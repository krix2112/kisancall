import { FastifyInstance } from 'fastify';
import { createHash } from 'crypto';
import { ethers } from 'ethers';
import { supabase } from '../supabase.js';
import { authGuard } from '../auth.js';

// ABI inlined to avoid file-path resolution differences between tsx dev and compiled dist
const ProofAnchorABI: ethers.InterfaceAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true,  internalType: 'bytes32',  name: 'payloadHash', type: 'bytes32' },
      { indexed: false, internalType: 'string',   name: 'eventType',   type: 'string' },
      { indexed: false, internalType: 'uint256',  name: 'timestamp',   type: 'uint256' },
      { indexed: true,  internalType: 'address',  name: 'sender',      type: 'address' },
    ],
    name: 'EventAnchored',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'payloadHash', type: 'bytes32' },
      { internalType: 'string',  name: 'eventType',   type: 'string' },
    ],
    name: 'anchorEvent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'payloadHash', type: 'bytes32' },
    ],
    name: 'getEvent',
    outputs: [
      { internalType: 'string',  name: 'eventType',  type: 'string' },
      { internalType: 'uint256', name: 'timestamp',  type: 'uint256' },
      { internalType: 'address', name: 'sender',     type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

// Initialise ethers provider + signer once at module load time
const _provider = new ethers.JsonRpcProvider(process.env.SHARDEUM_RPC_URL!);
const _signer = new ethers.Wallet(process.env.SHARDEUM_PRIVATE_KEY!, _provider);
const _contract = new ethers.Contract(
  process.env.AGROCHAIN_CONTRACT_ADDRESS!,
  ProofAnchorABI,
  _signer
);

/**
 * Canonicalise a procurement row into a deterministic JSON string and return
 * a SHA-256 hash as a 0x-prefixed hex bytes32.
 */
function computePayloadHash(proc: {
  booking_id: string;
  quantity: string | number;
  price: string | number;
  quality_status: string;
  created_at: string;
}): string {
  const canonical = JSON.stringify({
    booking_id: proc.booking_id,
    quantity: String(proc.quantity),
    price: String(proc.price),
    quality_status: proc.quality_status,
    created_at: proc.created_at,
  });
  return '0x' + createHash('sha256').update(canonical).digest('hex');
}

export async function proofRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /proof-events
   * Anchor a procurement event on Shardeum and record in proof_events.
   */
  fastify.post(
    '/proof-events',
    { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
    async (request, reply) => {
      const body = request.body as { procurement_id: string; event_type: string };

      if (!body.procurement_id || !body.event_type) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'procurement_id and event_type are required',
        });
      }

      // Idempotency check
      const { data: existing } = await supabase
        .from('proof_events')
        .select('*')
        .eq('procurement_id', body.procurement_id)
        .eq('event_type', body.event_type)
        .single();

      if (existing) {
        return reply.send({ ...existing, idempotent: true });
      }

      // Fetch the procurement
      const { data: proc, error: procErr } = await supabase
        .from('procurements')
        .select('booking_id, quantity, price, quality_status, created_at')
        .eq('booking_id', body.procurement_id)
        .single();

      if (procErr || !proc) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Procurement not found',
        });
      }

      const payloadHash = computePayloadHash(proc);
      let chainTxHash: string | null = null;
      let anchorStatus = 'pending';

      // Fire-and-forget chain call — never block the response on a chain timeout
      try {
        const tx = await Promise.race([
          _contract.anchorEvent(payloadHash, body.event_type) as Promise<ethers.TransactionResponse>,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Chain call timed out after 20s')), 20_000)
          ),
        ]);
        const receipt = await tx.wait(1);
        chainTxHash = receipt?.hash ?? tx.hash;
        anchorStatus = 'anchored';
        request.log.info({ chainTxHash }, 'Proof anchored on-chain');
      } catch (chainErr) {
        // Log and continue — store with null tx hash
        request.log.warn({ chainErr }, 'Chain anchor failed — storing proof_event with pending status');
      }

      // Insert proof_event
      const { data: proofEvent, error: insertErr } = await supabase
        .from('proof_events')
        .insert({
          procurement_id: body.procurement_id,
          event_type: body.event_type,
          payload_hash: payloadHash,
          chain_tx_hash: chainTxHash,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // Audit log
      const user = (request as any).user;
      await supabase.from('audit_logs').insert({
        actor: user.id,
        action: 'POST /proof-events',
        entity: body.procurement_id,
        new_value: { event_type: body.event_type, anchor_status: anchorStatus },
      });

      return reply.status(201).send({ ...proofEvent, anchor_status: anchorStatus });
    }
  );

  /**
   * GET /proof/:id
   * Return all proof events for a procurement, ordered by creation time.
   */
  fastify.get('/proof/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabase
      .from('proof_events')
      .select('*')
      .eq('procurement_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return reply.send({
      procurement_id: id,
      proof_events: data || [],
    });
  });
}
