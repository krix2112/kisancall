import { FastifyInstance } from 'fastify';
import { ethers } from 'ethers';
import { supabase } from '../supabase.js';

/**
 * Proof Events — async on-chain anchoring lifecycle.
 *
 * POST /proof-events returns 202 immediately. The actual chain submission runs
 * in the background proofQueue worker so staff-facing actions are never blocked
 * by Shardeum confirmation latency.
 *
 * GET /proof/:id lets staff/farmer apps poll for status: pending → confirmed | failed.
 */

export interface ProofEventsRow {
  id: string;
  procurement_id: string;
  event_type: string;
  payload_hash: string;
  chain_tx_hash: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  idempotency_key: string;
  error_message: string | null;
  retry_count: number;
  created_at: string;
}

/**
 * Internal function — enqueues a proof-event for async on-chain anchoring.
 * Called by POST /proof-events and by staff.ts after procurement insertion.
 *
 * Flow:
 * 1. Check idempotency — if a row with the same key exists, return it
 * 2. Fetch procurement + booking + mandi data for canonical payload
 * 3. Canonicalize, hash, and insert a pending proof_events row
 * 4. Return the row so the caller has the id immediately (202 response)
 *
 * The proofQueue worker picks up pending rows asynchronously.
 *
 * @param procurementId — Supabase UUID of the procurement row
 * @param eventType     — e.g. 'procurement_completed'
 * @returns The newly inserted (or existing) proof_events row
 */
export async function enqueueProofEvent(
  procurementId: string,
  eventType: string
): Promise<ProofEventsRow> {
  // Deterministic idempotency key from procurement_id + eventType
  const idempotencyKey = ethers.keccak256(
    ethers.toUtf8Bytes(`${procurementId}::${eventType}`)
  );

  // 1. Check if a row with this idempotency key already exists
  const { data: existing } = await supabase
    .from('proof_events')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .limit(1)
    .single();

  if (existing) {
    return existing as ProofEventsRow;
  }

  // 2. Fetch procurement + booking + mandi for canonical payload
  const { data: procurement, error: procErr } = await supabase
    .from('procurements')
    .select('quantity, price, quality_status, created_at, booking_id')
    .eq('booking_id', procurementId)
    .single();

  if (procErr || !procurement) {
    throw new Error(`Procurement ${procurementId} not found`);
  }

  const { data: booking, error: bookErr } = await supabase
    .from('bookings')
    .select('farmer_id, slot_id')
    .eq('id', procurementId)
    .single();

  if (bookErr || !booking) {
    throw new Error(`Booking for procurement ${procurementId} not found`);
  }

  const { data: slot, error: slotErr } = await supabase
    .from('slots')
    .select('mandi_id')
    .eq('id', booking.slot_id)
    .single();

  if (slotErr || !slot) {
    throw new Error(`Slot for booking ${booking.slot_id} not found`);
  }

  // 3. Build the canonical payload — same fields, fixed alphabetical order
  const canonical = JSON.stringify({
    farmer_id: booking.farmer_id,
    mandi_id: slot.mandi_id,
    quality_status: procurement.quality_status,
    price: String(procurement.price),
    quantity: String(procurement.quantity),
    timestamp: procurement.created_at,
  });

  const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(canonical));

  // 4. Insert the pending row — chain_tx_hash is null until worker confirms it
  const { data: row, error: insertErr } = await supabase
    .from('proof_events')
    .insert({
      procurement_id: procurementId,
      event_type: eventType,
      payload_hash: payloadHash,
      status: 'pending',
      idempotency_key: idempotencyKey,
      retry_count: 0,
    })
    .select()
    .single();

  if (insertErr) {
    // Handle race condition: another concurrent call inserted the same key
    if (insertErr.code === '23505') {
      const { data: concurrent } = await supabase
        .from('proof_events')
        .select('*')
        .eq('idempotency_key', idempotencyKey)
        .limit(1)
        .single();
      return concurrent as ProofEventsRow;
    }
    throw insertErr;
  }

  return row as ProofEventsRow;
}

// ============================================================
// POST /proof-events — public endpoint (also called internally)
// ============================================================
export async function proofEventRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/proof-events',
    {
      schema: {
        body: {
          type: 'object' as const,
          required: ['procurement_id', 'event_type'],
          properties: {
            procurement_id: { type: 'string' as const, format: 'uuid' },
            event_type: { type: 'string' as const, minLength: 1 },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { procurement_id, event_type } = request.body as {
        procurement_id: string;
        event_type: string;
      };

      try {
        const row = await enqueueProofEvent(procurement_id, event_type);

        return reply.status(202).send({
          id: row.id,
          procurement_id: row.procurement_id,
          event_type: row.event_type,
          status: row.status,
          created_at: row.created_at,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return reply.status(500).send({ error: 'Internal Server Error', message });
      }
    }
  );

  // ============================================================
  // GET /proof/:id — poll proof-event status
  // ============================================================
  fastify.get<{ Params: { id: string } }>(
    '/proof/:id',
    {
      schema: {
        params: {
          type: 'object' as const,
          required: ['id'],
          properties: {
            id: { type: 'string' as const, format: 'uuid' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const { data: row, error } = await supabase
        .from('proof_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !row) {
        return reply.status(404).send({
          error: 'Not Found',
          message: `Proof event with id '${id}' not found`,
        });
      }

      return reply.send({
        id: row.id,
        procurement_id: row.procurement_id,
        event_type: row.event_type,
        payload_hash: row.payload_hash,
        chain_tx_hash: row.chain_tx_hash,
        status: row.status,
        idempotency_key: row.idempotency_key,
        error_message: row.error_message,
        retry_count: row.retry_count,
        created_at: row.created_at,
      } satisfies ProofEventsRow);
    }
  );
}
