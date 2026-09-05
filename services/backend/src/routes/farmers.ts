import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { computeQueuePosition } from '../services/queueEngine.js';

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
   * Delegates to the shared queue engine so the mobile app and the voice
   * call always report the exact same position and ETA.
   */
  fastify.get('/farmers/:id/queue', async (request, reply) => {
    const { id } = request.params as { id: string };

    // Verify farmer exists
    const { data: farmer, error: farmerErr } = await supabase
      .from('farmers')
      .select('id')
      .eq('id', id)
      .single();

    if (farmerErr || !farmer) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    const result = await computeQueuePosition(id);

    if (!result.hasBooking) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'No active booking found for this farmer',
      });
    }

    return reply.send({
      farmer_id: id,
      booking_id: result.bookingId,
      token: result.token,
      position: result.position,
      estimated_wait_minutes: result.estimatedWaitMinutes,
      mandi_name: result.mandiName,
      latest_event: result.latestEvent || null,
      computed_from: {
        avg_service_minutes: result.avgServiceMinutes,
        note: result.note,
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
      .select('id, name, phone, preferred_mandi_id, crop')
      .eq('id', id)
      .single();

    if (farmerErr || !farmer) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Farmer not found',
      });
    }

    let mandiDetails: any = null;
    if (farmer.preferred_mandi_id) {
      const { data: mandi } = await supabase
        .from('mandis')
        .select('*')
        .eq('id', farmer.preferred_mandi_id)
        .maybeSingle();

      if (mandi) {
        mandiDetails = {
          id: mandi.id,
          name: mandi.name,
          district: mandi.district,
          daily_capacity: mandi.daily_capacity,
          working_hours: mandi.working_hours,
          latitude: (mandi as any).latitude ?? null,
          longitude: (mandi as any).longitude ?? null,
        };
      }
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
        preferred_mandi_id: farmer.preferred_mandi_id || null,
        crop: farmer.crop || null,
        mandi: mandiDetails,
      },
      total_bookings: enrichedBookings.length,
      bookings: enrichedBookings,
    });
  });
}
