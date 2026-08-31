-- Migration: Add compute_avg_service_time RPC function
-- Used by GET /farmers/:id/queue to compute estimated wait time
-- from actual service durations, not hardcoded constants.

CREATE OR REPLACE FUNCTION public.compute_avg_service_time(p_mandi_id UUID)
RETURNS TABLE(avg_minutes NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(
      AVG(
        EXTRACT(EPOCH FROM (
          qe_end.timestamp - qe_start.timestamp
        )) / 60.0
      ),
      NULL
    )::NUMERIC AS avg_minutes
  FROM queue_events qe_start
  INNER JOIN queue_events qe_end
    ON qe_start.booking_id = qe_end.booking_id
    AND qe_start.event_type = 'service_start'
    AND qe_end.event_type = 'service_complete'
  INNER JOIN bookings b
    ON b.id = qe_start.booking_id
  INNER JOIN slots s
    ON s.id = b.slot_id
  WHERE s.mandi_id = p_mandi_id
    AND b.status = 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
