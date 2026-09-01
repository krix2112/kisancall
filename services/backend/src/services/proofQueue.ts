import { supabase } from '../supabase.js';
import { submitToChain } from './proofBuilder.js';

/**
 * Async proof-event worker.
 *
 * Polls proof_events WHERE status = 'pending' on a fixed interval and submits
 * each row to the on-chain ProofAnchor contract. Updates the row to 'confirmed'
 * with the real chain_tx_hash on success, or increments retry_count and
 * records error_message on failure.
 *
 * Failure handling: capped at MAX_RETRIES, then marked 'failed' for manual
 * review. A failed anchor is never silently dropped.
 */

const POLL_INTERVAL_MS = 10_000;     // 10s
const MAX_RETRIES = 5;
const BACKOFF_BASE_MS = 30_000;      // exponential: 30s, 60s, 120s, 240s, 480s

let _interval: NodeJS.Timeout | null = null;
let _running = false;

/**
 * Picks up one pending proof-event, attempts the chain submission, and
 * updates the row accordingly.
 */
async function processOne(): Promise<void> {
  // 1. Find the oldest pending row. Skip rows that hit a recent failed retry
  //    by computing the per-row backoff window from retry_count.
  const { data: rows, error: selectErr } = await supabase
    .from('proof_events')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1);

  if (selectErr) {
    console.error('[proofQueue] Failed to fetch pending rows:', selectErr.message);
    return;
  }

  if (!rows || rows.length === 0) return;

  const row = rows[0] as {
    id: string;
    payload_hash: string;
    event_type: string;
    retry_count: number;
    created_at: string;
  };

  // 2. Per-row backoff — don't re-attempt too soon after a failure
  if (row.retry_count > 0) {
    const backoffMs = BACKOFF_BASE_MS * Math.pow(2, row.retry_count - 1);
    const ageMs = Date.now() - new Date(row.created_at).getTime();
    if (ageMs < backoffMs) {
      console.log(
        `[proofQueue] Row ${row.id} still in backoff (${ageMs}ms < ${backoffMs}ms), skipping`
      );
      return;
    }
  }

  console.log(
    `[proofQueue] Processing ${row.id} (retry ${row.retry_count}/${MAX_RETRIES}) — event: ${row.event_type}`
  );

  try {
    // 3. Submit to chain — this is the real on-chain call. Throws on failure.
    const result = await submitToChain(row.payload_hash, row.event_type);

    // 4. Update row to confirmed with the real chain_tx_hash
    const { error: updateErr } = await supabase
      .from('proof_events')
      .update({
        status: 'confirmed',
        chain_tx_hash: result.chain_tx_hash,
        error_message: null,
      })
      .eq('id', row.id);

    if (updateErr) {
      console.error(`[proofQueue] Failed to mark ${row.id} as confirmed:`, updateErr.message);
    } else {
      console.log(
        `[proofQueue] ✓ Confirmed ${row.id} — tx: ${result.chain_tx_hash}`
      );
    }
  } catch (err) {
    // 5. Failure — record error, increment retry_count, cap at MAX_RETRIES
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown chain submission error';

    const newRetryCount = row.retry_count + 1;
    const exhausted = newRetryCount >= MAX_RETRIES;

    console.error(
      `[proofQueue] ✗ Failed ${row.id} (attempt ${newRetryCount}/${MAX_RETRIES}): ${errorMessage}`
    );

    const { error: updateErr } = await supabase
      .from('proof_events')
      .update({
        retry_count: newRetryCount,
        error_message: errorMessage,
        // Cap retries — mark as failed for manual review instead of looping forever
        ...(exhausted ? { status: 'failed' } : {}),
      })
      .eq('id', row.id);

    if (updateErr) {
      console.error(`[proofQueue] Failed to update error state:`, updateErr.message);
    }
  }
}

/**
 * Single tick — process as many pending rows as the queue has, sequentially.
 * This keeps the worker simple and avoids stampeding the RPC.
 */
async function tick(): Promise<void> {
  if (_running) return; // prevent re-entry from overlapping intervals
  _running = true;
  try {
    // Keep going while there are more pending rows; bounded to avoid infinite loops
    // if the producer is much faster than the RPC.
    for (let i = 0; i < 5; i++) {
      const { count } = await supabase
        .from('proof_events')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (!count || count === 0) break;
      await processOne();
    }
  } catch (err) {
    console.error('[proofQueue] Tick error:', err);
  } finally {
    _running = false;
  }
}

/**
 * Start the polling worker. Idempotent — calling twice is a no-op.
 */
export function startProofQueue(): void {
  if (_interval) {
    console.log('[proofQueue] Worker already running');
    return;
  }

  console.log(
    `[proofQueue] Starting worker — poll every ${POLL_INTERVAL_MS}ms, max ${MAX_RETRIES} retries`
  );

  // Run once immediately, then on interval
  tick().catch((err) => console.error('[proofQueue] Initial tick error:', err));
  _interval = setInterval(() => {
    tick().catch((err) => console.error('[proofQueue] Tick error:', err));
  }, POLL_INTERVAL_MS);
}

/**
 * Stop the polling worker. Used for graceful shutdown and tests.
 */
export function stopProofQueue(): void {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
    console.log('[proofQueue] Worker stopped');
  }
}
