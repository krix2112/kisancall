import { ethers } from 'ethers';

/**
 * Proof Builder — canonicalizes real procurement data, hashes it, and submits
 * to the ProofAnchor contract on Shardeum testnet.
 *
 * All data is real: farmer_id, mandi_id, quantity, grade, price, timestamp come
 * directly from Supabase rows. No hardcoded or placeholder values.
 */

// ============================================================
// ABI — minimal subset needed for anchorEvent
// ============================================================
const PROOF_ANCHOR_ABI = [
  'function anchorEvent(bytes32 payloadHash, string memory eventType) public',
] as const;

// ============================================================
// Ethers.js instances — initialised lazily on first use
// ============================================================
let _contract: ethers.Contract | null = null;
let _wallet: ethers.Wallet | null = null;

function getContract(): ethers.Contract {
  if (_contract) return _contract;

  const rpcUrl = process.env.SHARDEUM_RPC_URL!;
  const contractAddress = process.env.PROOF_ANCHOR_CONTRACT_ADDRESS!;
  const walletKey = process.env.PROOF_ANCHOR_WALLET_KEY!;

  // A Wallet connected to the Shardeum testnet RPC
  _wallet = new ethers.Wallet(walletKey, new ethers.JsonRpcProvider(rpcUrl));
  _contract = new ethers.Contract(contractAddress, PROOF_ANCHOR_ABI, _wallet);

  return _contract;
}

// ============================================================
// Canonicalization — must be deterministic (same input → identical bytes)
// ============================================================

/**
 * Canonicalizes a procurement record into a deterministic JSON string.
 * Fields appear in a fixed alphabetical order so that two equivalent records
 * always serialize to the same bytes, making the hash verifiable later.
 *
 * @param procurement — real row from the procurements table (joined with
 *   bookings → farmers → mandis for display names)
 */
export function canonicalizePayload(procurement: {
  farmer_id: string;
  mandi_id: string;
  quantity: number | string;
  quality_status: string;
  price: number | string;
  timestamp: string;
}): string {
  // Fixed alphabetical field order — no reliance on object property iteration order
  return JSON.stringify({
    farmer_id: procurement.farmer_id,
    mandi_id: procurement.mandi_id,
    quality_status: procurement.quality_status,
    price: String(procurement.price),
    quantity: String(procurement.quantity),
    timestamp: procurement.timestamp,
  });
}

// ============================================================
// Hashing — real Keccak-256 of real canonical data
// ============================================================

/**
 * Produces a Keccak-256 hash of the canonical payload.
 * This is what gets stored on-chain in the EventAnchored event.
 */
export function hashPayload(canonical: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// ============================================================
// On-chain submission — real tx, waits for confirmation
// ============================================================

export interface SubmitResult {
  chain_tx_hash: string;
}

/**
 * Submits the payload hash to the ProofAnchor contract and waits for
 * the transaction to be mined (confirmed on-chain).
 *
 * Returns the real transaction hash — NOT the unconfirmed hash before
 * submission. This is what goes into proof_events.chain_tx_hash.
 *
 * @throws if the RPC call or tx submission fails
 */
export async function submitToChain(
  payloadHash: string,
  eventType: string
): Promise<SubmitResult> {
  const contract = getContract();
  const signer = contract.runner as ethers.Wallet;

  console.log(
    `[proofBuilder] Submitting anchorEvent to Shardeum — payloadHash: ${payloadHash}, eventType: ${eventType}, from: ${signer.address}`
  );

  // Send the transaction — does NOT wait for confirmation yet
  const tx = await (contract.anchorEvent as ethers.ContractMethod)(
    payloadHash,
    eventType
  ) as ethers.TransactionResponse;

  console.log(`[proofBuilder] Tx submitted, waiting for confirmation: ${tx.hash}`);

  // Wait for 1 block confirmation — this is the REAL, finalised tx hash
  const receipt = await tx.wait(1);

  if (!receipt) {
    throw new Error(`Transaction ${tx.hash} failed — no receipt returned`);
  }

  console.log(
    `[proofBuilder] Tx confirmed on-chain. Block: ${receipt.blockNumber}, gasUsed: ${receipt.gasUsed}`
  );

  return { chain_tx_hash: receipt.hash };
}
