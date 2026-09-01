import { FastifyInstance, FastifyRequest } from 'fastify';
import { supabase } from '../supabase.js';
import { authGuard } from '../auth.js';
import { BookingStatus, ProcurementStatus, PaymentStatus, QualityStatus, Booking, Payment } from '@kisancall/shared-types';
import { AuthenticatedRequest } from '../auth.js';

/**
 * Staff endpoints — operator/supervisor/admin actions.
 * Zero hardcoded data: every value traces back to a real Supabase row at call time.
 */
export async function staffRoutes(fastify: FastifyInstance): Promise<void> {
  // Helper to get authenticated user with proper typing
  const getAuthUser = (request: FastifyRequest) => {
    const authRequest = request as AuthenticatedRequest;
    return authRequest.user;
  };

  // ============================================================
  // POST /staff/arrivals — mark booking as arrived
  // ============================================================
  fastify.post(
    '/staff/arrivals',
    {
      preHandler: [authGuard(['operator', 'supervisor', 'admin'])],
      schema: {
        body: {
          type: 'object' as const,
          required: ['booking_id'],
          properties: {
            booking_id: { type: 'string' as const, format: 'uuid' },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { booking_id } = request.body as { booking_id: string };
      const user = getAuthUser(request);

      // 1. Verify booking exists
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, slot_id, status, farmers!inner(mandi_id)')
        .eq('id', booking_id)
        .single();

      if (bookingErr || !booking) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Booking with id '${booking_id}' does not exist`,
        });
      }

      // Handle potential null farmers array
      if (!booking.farmers || booking.farmers.length === 0) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Booking has no associated mandi',
        });
      }

      const mandiId = booking.farmers[0].mandi_id;

      // 2. Verify staff member is scoped to this mandi
      const { data: staffFarmer, error: staffErr } = await supabase
        .from('user_roles')
        .select('farmers!inner(mandi_id)')
        .eq('auth_user_id', user?.id)
        .single();

      if (staffErr || !staffFarmer || !staffFarmer.farmers || staffFarmer.farmers.length === 0) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Staff member has no associated mandi',
        });
      }

      const staffMandiId = staffFarmer.farmers[0].mandi_id;

      // 3. Ensure staff mandi matches booking mandi
      if (staffMandiId !== mandiId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: `Staff member is not authorized for mandi ${mandiId}`,
        });
      }

      // 4. Only allow arrivals on confirmed bookings
      if (booking.status !== 'confirmed') {
        return reply.status(409).send({
          error: 'Conflict',
          message: `Booking is not confirmed (status: ${booking.status})`,
        });
      }

      // 5. Mark booking as arrived by inserting queue_events row
      const { data: queueEvent, error: queueErr } = await supabase
        .from('queue_events')
        .insert({
          booking_id,
          event_type: 'arrived',
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (queueErr) throw queueErr;

      // Also update booking status to reflect arrival
      const { data: updatedBooking, error: updateErr } = await supabase
        .from('bookings')
        .update({ status: 'arrived' })
        .eq('id', booking_id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      return reply.status(201).send({
        booking_id: updatedBooking.id,
        status: updatedBooking.status,
        arrived_at: queueEvent.timestamp,
      });
    }
  );

  // ============================================================
  // POST /staff/procurement — mark procurement with real data
  // ============================================================
  fastify.post(
    '/staff/procurement',
    {
      preHandler: [authGuard(['operator', 'supervisor', 'admin'])],
      schema: {
        body: {
          type: 'object' as const,
          required: ['booking_id', 'quantity', 'price', 'quality_status'],
          properties: {
            booking_id: { type: 'string' as const, format: 'uuid' },
            quantity: { type: 'number' as const, minimum: 0 },
            price: { type: 'number' as const, minimum: 0 },
            quality_status: {
              type: 'string' as const,
              enum: ['grade_a', 'grade_b', 'grade_c', 'rejected'] as const,
            },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { booking_id, quantity, price, quality_status } = request.body as {
        booking_id: string;
        quantity: number;
        price: number;
        quality_status: QualityStatus;
      };
      const user = getAuthUser(request);

      // 1. Verify booking exists and is confirmed/arrived
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, status, slot_id, farmers!inner(mandi_id)')
        .eq('id', booking_id)
        .single();

      if (bookingErr || !booking) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Booking with id '${booking_id}' does not exist`,
        });
      }

      if (!booking.farmers || booking.farmers.length === 0) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Booking has no associated mandi',
        });
      }

      const mandiId = booking.farmers[0].mandi_id;

      // 2. Verify staff member is scoped to this mandi
      const { data: staffFarmer, error: staffErr } = await supabase
        .from('user_roles')
        .select('farmers!inner(mandi_id)')
        .eq('auth_user_id', user?.id)
        .single();

      if (staffErr || !staffFarmer || !staffFarmer.farmers || staffFarmer.farmers.length === 0) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Staff member has no associated mandi',
        });
      }

      const staffMandiId = staffFarmer.farmers[0].mandi_id;

      if (staffMandiId !== mandiId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: `Staff member is not authorized for mandi ${mandiId}`,
        });
      }

      // 3. Only allow procurement on confirmed or arrived bookings
      if (!['confirmed', 'arrived'].includes(booking.status)) {
        return reply.status(409).send({
          error: 'Conflict',
          message: `Booking is not ready for procurement (status: ${booking.status})`,
        });
      }

      // 4. Check if procurement already exists for this booking
      const { data: existingProcurement, error: procureCheckErr } = await supabase
        .from('procurements')
        .select('id')
        .eq('booking_id', booking_id)
        .single();

      if (procureCheckErr && procureCheckErr.code !== 'PGRST116') {
        throw procureCheckErr;
      }

      if (existingProcurement) {
        return reply.status(409).send({
          error: 'Conflict',
          message: 'Procurement already exists for this booking',
        });
      }

      // 5. Insert procurement with REAL submitted data — no defaults, no fallbacks
      const { data: procurement, error: procureErr } = await supabase
        .from('procurements')
        .insert({
          booking_id,
          quantity,
          price,
          quality_status,
          status: 'in_progress',
        })
        .select()
        .single();

      if (procureErr) throw procureErr;

      // TODO: Phase 3 — call proof-event builder here
      // This integration needs to be tested jointly with AgroChain owners

      return reply.status(201).send(procurement);
    }
  );

  // ============================================================
  // PATCH /payments/:id — update payment status
  // ============================================================
  fastify.patch(
    '/payments/:id',
    {
      preHandler: [authGuard(['supervisor', 'admin'])],
      schema: {
        body: {
          type: 'object' as const,
          required: ['status'],
          properties: {
            status: {
              type: 'string' as const,
              enum: ['pending', 'processing', 'completed', 'failed'] as const,
            },
            reference: { type: 'string' as const },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status, reference } = request.body as {
        status: PaymentStatus;
        reference?: string;
      };
      const user = getAuthUser(request);

      // 1. Verify payment exists
      const { data: payment, error: paymentErr } = await supabase
        .from('payments')
        .select('id, status, procurement_id')
        .eq('id', id)
        .single();

      if (paymentErr || !payment) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Payment with id '${id}' does not exist`,
        });
      }

      // 2. Verify payment belongs to a procurement that's actually been marked complete
      //    Only allow marking payment complete if procurement exists and is verified
      const { data: procurement, error: procureErr } = await supabase
        .from('procurements')
        .select('id, status, booking_id')
        .eq('id', payment.procurement_id)
        .single();

      if (procureErr || !procurement) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Payment has no associated procurement',
        });
      }

      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, slot_id')
        .eq('id', procurement.booking_id)
        .single();

      if (bookingErr || !booking) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Procurement has no associated booking',
        });
      }

      // 3. If setting status to 'completed', verify procurement is verified
      if (status === 'completed' && procurement.status !== 'verified') {
        return reply.status(409).send({
          error: 'Conflict',
          message: `Cannot mark payment complete: procurement status is '${procurement.status}', expected 'verified'`,
        });
      }

      // 4. Update payment with real data
      const { data: updatedPayment, error: updateErr } = await supabase
        .from('payments')
        .update({
          status,
          ...(reference !== undefined ? { reference } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      return reply.send(updatedPayment);
    }
  );
}