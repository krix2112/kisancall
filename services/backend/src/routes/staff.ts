import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { authGuard } from '../auth.js';

export async function staffRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /staff/roster
   * Return all bookings for a mandi/date joined with farmer name/phone, current status, and latest queue_event
   */
  fastify.get(
    '/staff/roster',
    { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
    async (request, reply) => {
      const query = request.query as { mandi_id: string; date?: string };
      
      if (!query.mandi_id) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'mandi_id is required',
        });
      }

      const date = query.date || new Date().toISOString().split('T')[0];

      // Find slots for this mandi and date
      const { data: slots, error: slotsErr } = await supabase
        .from('slots')
        .select('id')
        .eq('mandi_id', query.mandi_id)
        .eq('date', date);

      if (slotsErr) throw slotsErr;

      if (!slots || slots.length === 0) {
        return reply.send([]);
      }

      const slotIds = slots.map(s => s.id);

      // Get bookings for these slots
      const { data: bookings, error: bookingsErr } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          token,
          farmers ( id, name, phone )
        `)
        .in('slot_id', slotIds);

      if (bookingsErr) throw bookingsErr;

      // Enrich with latest queue_event
      const roster = await Promise.all((bookings || []).map(async (b: any) => {
        const { data: queueEvent } = await supabase
          .from('queue_events')
          .select('event_type, timestamp, sequence')
          .eq('booking_id', b.id)
          .order('sequence', { ascending: false })
          .limit(1)
          .single();

        return {
          ...b,
          latest_event: queueEvent || null,
        };
      }));

      // Audit log
      const user = (request as any).user;
      await supabase.from('audit_logs').insert({
        actor: user.id,
        action: 'GET /staff/roster',
        entity: query.mandi_id
      });

      return reply.send(roster);
    }
  );

  /**
   * POST /staff/arrivals
   * Mark a booking as arrived, insert queue_event, update status
   */
  fastify.post(
    '/staff/arrivals',
    { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
    async (request, reply) => {
      const body = request.body as { booking_id: string };

      if (!body.booking_id) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'booking_id is required',
        });
      }

      // Verify booking exists and its status
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, status, slot_id')
        .eq('id', body.booking_id)
        .single();

      if (bookingErr || !booking) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Booking not found',
        });
      }

      if (booking.status === 'completed') {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'Booking is already completed',
        });
      }

      // Check if already arrived via queue_events
      const { data: existingArrival } = await supabase
        .from('queue_events')
        .select('id')
        .eq('booking_id', body.booking_id)
        .eq('event_type', 'ARRIVED')
        .single();
        
      if (existingArrival) {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'Booking is already marked as arrived',
        });
      }

      // Get next sequence for queue_events
      const { data: events } = await supabase
        .from('queue_events')
        .select('sequence')
        .eq('booking_id', body.booking_id)
        .order('sequence', { ascending: false })
        .limit(1);

      const nextSequence = events && events.length > 0 ? (events[0].sequence + 1) : 1;

      // Insert queue_event
      const { data: queueEvent, error: qeErr } = await supabase
        .from('queue_events')
        .insert({
          booking_id: body.booking_id,
          event_type: 'ARRIVED',
          sequence: nextSequence,
        })
        .select()
        .single();

      if (qeErr) throw qeErr;

      // Audit log
      const user = (request as any).user;
      await supabase.from('audit_logs').insert({
        actor: user.id,
        action: 'POST /staff/arrivals',
        entity: body.booking_id
      });

      return reply.send({
        booking: { ...booking, status: 'arrived' },
        queue_event: queueEvent,
      });
    }
  );

  /**
   * POST /staff/procurement
   * Record procurement details (quantity, price, quality), create payment row
   */
  fastify.post(
    '/staff/procurement',
    { preHandler: [authGuard(['operator', 'supervisor', 'admin'])] },
    async (request, reply) => {
      const body = request.body as {
        booking_id: string;
        quantity: number;
        price: number;
        quality_status: string;
      };

      if (!body.booking_id || body.quantity === undefined || body.price === undefined || !body.quality_status) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'booking_id, quantity, price, and quality_status are required',
        });
      }

      // Validate booking exists
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, status, slot_id')
        .eq('id', body.booking_id)
        .single();

      if (bookingErr || !booking) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Booking not found',
        });
      }

      // Check if procurement already exists
      const { data: existingProc } = await supabase
        .from('procurements')
        .select('booking_id')
        .eq('booking_id', body.booking_id)
        .single();

      if (existingProc) {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'Procurement already exists for this booking',
        });
      }

      // Insert procurement
      const { data: procurement, error: procErr } = await supabase
        .from('procurements')
        .insert({
          booking_id: body.booking_id,
          quantity: body.quantity,
          price: body.price,
          quality_status: body.quality_status,
          status: 'verified',
        })
        .select()
        .single();

      if (procErr) throw procErr;

      // Create initial payment row
      const { error: payErr } = await supabase
        .from('payments')
        .insert({
          procurement_id: body.booking_id,
          status: 'pending',
          reference: '',
          updated_at: new Date().toISOString(),
        });

      if (payErr) throw payErr;

      // Update booking to completed
      await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', body.booking_id);

      // Audit log
      const user = (request as any).user;
      await supabase.from('audit_logs').insert({
        actor: user.id,
        action: 'POST /staff/procurement',
        entity: body.booking_id,
        new_value: { quantity: body.quantity, price: body.price, quality_status: body.quality_status }
      });

      return reply.status(201).send(procurement);
    }
  );
}
