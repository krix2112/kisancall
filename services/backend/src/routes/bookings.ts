import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';

const createBookingSchema = {
  body: {
    type: 'object' as const,
    required: ['farmer_id', 'slot_id'],
    properties: {
      farmer_id: { type: 'string' as const, format: 'uuid' },
      slot_id: { type: 'string' as const, format: 'uuid' },
    },
    additionalProperties: false,
  },
};

export async function bookingRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /bookings — Create a booking with capacity validation and sequential token
   *
   * 1. Verify farmer_id exists
   * 2. Verify slot_id exists and fetch capacity + mandi info
   * 3. Count existing non-cancelled bookings for that slot
   * 4. Reject 409 if slot is full
   * 5. Generate sequential token: MANDINAME-YYYYMMDD-NNN
   * 6. Insert booking with status 'confirmed'
   */
  fastify.post('/bookings', { schema: createBookingSchema }, async (request, reply) => {
    const body = request.body as { farmer_id: string; slot_id: string };

    // 1. Verify farmer exists
    const { data: farmer, error: farmerErr } = await supabase
      .from('farmers')
      .select('id')
      .eq('id', body.farmer_id)
      .single();

    if (farmerErr || !farmer) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: `Farmer with id '${body.farmer_id}' does not exist`,
      });
    }

    // 2. Verify slot exists and get capacity + mandi info
    const { data: slot, error: slotErr } = await supabase
      .from('slots')
      .select('id, mandi_id, date, capacity')
      .eq('id', body.slot_id)
      .single();

    if (slotErr || !slot) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: `Slot with id '${body.slot_id}' does not exist`,
      });
    }

    // 3. Count existing non-cancelled bookings for this slot
    const { count: existingCount, error: countErr } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('slot_id', body.slot_id)
      .neq('status', 'cancelled');

    if (countErr) throw countErr;

    // 4. Reject if slot is full
    if ((existingCount ?? 0) >= slot.capacity) {
      return reply.status(409).send({
        error: 'Conflict',
        message: `Slot is full. Capacity: ${slot.capacity}, Current bookings: ${existingCount}`,
      });
    }

    // 5. Generate sequential token: MANDINAME-YYYYMMDD-NNN
    const { data: mandi } = await supabase
      .from('mandis')
      .select('name')
      .eq('id', slot.mandi_id)
      .single();

    const mandiPrefix = mandi
      ? mandi.name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 6)
      : 'MANDI';

    const dateStr = slot.date.replace(/-/g, '');

    // Find the highest existing token number for this mandi+date
    const tokenPrefix = `${mandiPrefix}-${dateStr}-`;
    const { data: existingTokens } = await supabase
      .from('bookings')
      .select('token')
      .like('token', `${tokenPrefix}%`)
      .order('token', { ascending: false })
      .limit(1);

    let nextNumber = 1;
    if (existingTokens && existingTokens.length > 0) {
      const lastToken = existingTokens[0].token;
      const lastNumStr = lastToken.split('-').pop();
      if (lastNumStr) {
        nextNumber = parseInt(lastNumStr, 10) + 1;
      }
    }

    const token = `${tokenPrefix}${String(nextNumber).padStart(3, '0')}`;

    // 6. Insert booking
    const { data: booking, error: insertErr } = await supabase
      .from('bookings')
      .insert({
        farmer_id: body.farmer_id,
        slot_id: body.slot_id,
        status: 'confirmed',
        token,
      })
      .select()
      .single();

    if (insertErr) {
      // Handle unique constraint on token (race condition)
      if (insertErr.code === '23505') {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'Token generation conflict. Please retry.',
        });
      }
      throw insertErr;
    }

    return reply.status(201).send(booking);
  });
}
