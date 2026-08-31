import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';

// Indian mobile phone regex: +91 followed by 6-9 then 9 digits
const PHONE_REGEX = /^\+91[6-9]\d{9}$/;

const createFarmerSchema = {
  body: {
    type: 'object' as const,
    required: ['name', 'phone'],
    properties: {
      name: { type: 'string' as const, minLength: 1 },
      phone: { type: 'string' as const, pattern: '^\\+91[6-9]\\d{9}$' },
      language: { type: 'string' as const, default: 'hi' },
      preferred_mandi_id: { type: 'string' as const, format: 'uuid' },
      crop: { type: 'string' as const },
    },
    additionalProperties: false,
  },
};

export async function farmerRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /farmers — Create a new farmer
   * Validates phone format, inserts into farmers table, returns real row with UUID.
   */
  fastify.post('/farmers', { schema: createFarmerSchema }, async (request, reply) => {
    const body = request.body as {
      name: string;
      phone: string;
      language?: string;
      preferred_mandi_id?: string;
      crop?: string;
    };

    // Additional phone validation beyond JSON schema
    if (!PHONE_REGEX.test(body.phone)) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Phone must be a valid Indian mobile number in format +91XXXXXXXXXX',
      });
    }

    // If preferred_mandi_id is provided, verify it exists
    if (body.preferred_mandi_id) {
      const { data: mandi, error: mandiErr } = await supabase
        .from('mandis')
        .select('id')
        .eq('id', body.preferred_mandi_id)
        .single();

      if (mandiErr || !mandi) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Mandi with id '${body.preferred_mandi_id}' does not exist`,
        });
      }
    }

    const { data, error } = await supabase
      .from('farmers')
      .insert({
        name: body.name,
        phone: body.phone,
        language: body.language || 'hi',
        preferred_mandi_id: body.preferred_mandi_id || null,
        crop: body.crop || null,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint on phone
      if (error.code === '23505') {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'A farmer with this phone number already exists',
        });
      }
      throw error; // Let global error handler catch unexpected errors
    }

    return reply.status(201).send(data);
  });

  /**
   * GET /farmers/:id/queue — Live queue position and estimated wait
   * Real query joining bookings → queue_events. Wait time computed from
   * actual average service time per procurement, not a hardcoded constant.
   */
  fastify.get('/farmers/:id/queue', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Find the farmer's active (confirmed) booking
    const { data: activeBooking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id, slot_id, token, status, created_at')
      .eq('farmer_id', id)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (bookingErr || !activeBooking) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'No active booking found for this farmer',
      });
    }

    // Count confirmed bookings in the same slot created before this one → queue position
    const { count: positionCount, error: posErr } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('slot_id', activeBooking.slot_id)
      .eq('status', 'confirmed')
      .lt('created_at', activeBooking.created_at);

    if (posErr) throw posErr;

    const position = (positionCount ?? 0) + 1; // 1-indexed

    // Get the latest queue event for this booking
    const { data: latestEvent } = await supabase
      .from('queue_events')
      .select('event_type, timestamp, sequence')
      .eq('booking_id', activeBooking.id)
      .order('sequence', { ascending: false })
      .limit(1)
      .single();

    // Compute average service time from completed procurements at this mandi
    // Join through: slot → mandi, then find procurements with timing data
    const { data: slotData } = await supabase
      .from('slots')
      .select('mandi_id')
      .eq('id', activeBooking.slot_id)
      .single();

    let avgServiceMinutes: number | null = null;

    if (slotData) {
      // Get completed procurements for this mandi to compute average service time
      // We measure time between 'service_start' and 'service_complete' queue events
      const { data: serviceTimings } = await supabase
        .rpc('compute_avg_service_time', { p_mandi_id: slotData.mandi_id })
        .single();

      if (serviceTimings && typeof serviceTimings === 'object' && 'avg_minutes' in serviceTimings) {
        avgServiceMinutes = (serviceTimings as { avg_minutes: number }).avg_minutes;
      }
    }

    // Estimated wait = position * average service time
    // If we can't compute avg service time (no historical data), return null
    const estimatedWaitMinutes = avgServiceMinutes !== null
      ? Math.round(position * avgServiceMinutes)
      : null;

    return reply.send({
      farmer_id: id,
      booking_id: activeBooking.id,
      token: activeBooking.token,
      position,
      estimated_wait_minutes: estimatedWaitMinutes,
      latest_event: latestEvent || null,
      computed_from: {
        avg_service_minutes: avgServiceMinutes,
        note: avgServiceMinutes === null
          ? 'No historical service data available for this mandi yet'
          : undefined,
      },
    });
  });

  /**
   * GET /farmers/:id/status — Aggregate status across bookings, procurements, payments
   * All data from real Supabase queries.
   */
  fastify.get('/farmers/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Verify farmer exists
    const { data: farmer, error: farmerErr } = await supabase
      .from('farmers')
      .select('id, name, phone')
      .eq('id', id)
      .single();

    if (farmerErr || !farmer) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    // Get all bookings for this farmer (most recent first)
    const { data: bookings, error: bookingsErr } = await supabase
      .from('bookings')
      .select('id, slot_id, status, token, created_at')
      .eq('farmer_id', id)
      .order('created_at', { ascending: false });

    if (bookingsErr) throw bookingsErr;

    // For each booking, get procurement and payment data
    const enrichedBookings = await Promise.all(
      (bookings || []).map(async (booking) => {
        const { data: procurement } = await supabase
          .from('procurements')
          .select('quantity, price, quality_status, status')
          .eq('booking_id', booking.id)
          .single();

        let payment = null;
        if (procurement) {
          const { data: paymentData } = await supabase
            .from('payments')
            .select('status, reference, updated_at')
            .eq('procurement_id', booking.id)
            .single();
          payment = paymentData;
        }

        return {
          ...booking,
          procurement: procurement || null,
          payment: payment || null,
        };
      })
    );

    return reply.send({
      farmer: {
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
      },
      total_bookings: enrichedBookings.length,
      bookings: enrichedBookings,
    });
  });
}
