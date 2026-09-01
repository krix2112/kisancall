import { supabase } from '../supabase.js';
import { QueueEvent } from '@kisancall/shared-types';

/**
 * Result of a queue position + ETA computation.
 * Both GET /farmers/:id/queue (mobile) and GET /voice/tool/get-queue (voice)
 * call computeQueuePosition, guaranteeing the two surfaces report the same number.
 */
export interface QueuePositionResult {
  hasBooking: boolean;
  bookingId?: string;
  token?: string;
  position?: number;
  estimatedWaitMinutes: number | null;
  mandiName: string | null;
  mandiId: string | null;
  avgServiceMinutes: number | null;
  latestEvent: QueueEvent | null;
  note?: string;
}

/**
 * Shared queue position + ETA calculator.
 *
 * Computes a farmer's live queue position within their slot by counting
 * confirmed bookings created before theirs, then multiplies by the real
 * rolling average service time for the mandi (from completed procurements).
 *
 * @param farmerId  Supabase farmer UUID
 * @returns QueuePositionResult with position, ETA, and metadata, or hasBooking: false
 */
export async function computeQueuePosition(farmerId: string): Promise<QueuePositionResult> {
  // 1. Find the farmer's active (confirmed) booking — real row, no defaults
  const { data: activeBooking, error: bookingErr } = await supabase
    .from('bookings')
    .select('id, slot_id, token, status, created_at')
    .eq('farmer_id', farmerId)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (bookingErr || !activeBooking) {
    return {
      hasBooking: false,
      estimatedWaitMinutes: null,
      mandiName: null,
      mandiId: null,
      avgServiceMinutes: null,
      latestEvent: null,
    };
  }

  // 2. Count confirmed bookings in the same slot created before this one → position
  const { count: positionCount, error: posErr } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('slot_id', activeBooking.slot_id)
    .eq('status', 'confirmed')
    .lt('created_at', activeBooking.created_at);

  if (posErr) throw posErr;

  const position = (positionCount ?? 0) + 1; // 1-indexed

  // 3. Get the latest queue event for this booking (optional, does not error)
  const { data: latestEvent } = await supabase
    .from('queue_events')
    .select('booking_id, event_type, timestamp, sequence')
    .eq('booking_id', activeBooking.id)
    .order('sequence', { ascending: false })
    .limit(1)
    .single();

  // 4. Resolve mandi_id and name from the slot → booking belongs to this mandi
  const { data: slotData, error: slotErr } = await supabase
    .from('slots')
    .select('mandi_id')
    .eq('id', activeBooking.slot_id)
    .single();

  if (slotErr || !slotData) {
    // Booking exists but slot is gone (shouldn't happen with FK, but guard)
    return {
      hasBooking: true,
      bookingId: activeBooking.id,
      token: activeBooking.token,
      position,
      estimatedWaitMinutes: null,
      mandiName: null,
      mandiId: null,
      avgServiceMinutes: null,
      latestEvent: latestEvent ?? null,
      note: 'Slot data not found — cannot compute ETA',
    };
  }

  const mandiId = slotData.mandi_id;

  // 5. Get mandi name for display
  const { data: mandiData, error: mandiErr } = await supabase
    .from('mandis')
    .select('name')
    .eq('id', mandiId)
    .single();

  const mandiName = mandiData?.name ?? null;

  // 6. Compute average service time from completed procurements at this mandi
  //    Uses the real RPC that joins queue_events to compute service_start → service_complete durations
  const { data: serviceTimings } = await supabase
    .rpc('compute_avg_service_time', { p_mandi_id: mandiId })
    .single();

  let avgServiceMinutes: number | null = null;
  if (
    serviceTimings &&
    typeof serviceTimings === 'object' &&
    'avg_minutes' in serviceTimings &&
    serviceTimings.avg_minutes !== null
  ) {
    avgServiceMinutes = Number(serviceTimings.avg_minutes);
  }

  // Estimated wait = position * average service time
  // If no historical data exists, ETA is null (not a hardcoded default)
  const estimatedWaitMinutes =
    avgServiceMinutes !== null
      ? Math.round(position * avgServiceMinutes)
      : null;

  return {
    hasBooking: true,
    bookingId: activeBooking.id,
    token: activeBooking.token,
    position,
    estimatedWaitMinutes,
    mandiName,
    mandiId,
    avgServiceMinutes,
    latestEvent: latestEvent ?? null,
    note:
      avgServiceMinutes === null
        ? 'No historical service data available for this mandi yet'
        : undefined,
  };
}