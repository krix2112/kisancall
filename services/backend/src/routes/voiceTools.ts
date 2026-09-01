import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { computeQueuePosition } from '../services/queueEngine.js';
import { fetchPrices } from '../services/priceAdapter.js';
import {
  VoiceGetSlotResponse,
  VoiceGetQueueResponse,
  VoiceGetPriceResponse,
  VoiceGetPaymentResponse,
} from '@kisancall/shared-types';

/**
 * Voice tool endpoints — read-only data for the voice pipeline to read aloud.
 * Response shapes frozen in @kisancall/shared-types for API contract.
 * All data from real Supabase queries — no hardcoded defaults.
 */
export async function voiceToolRoutes(fastify: FastifyInstance): Promise<void> {
  // ============================================================
  // GET /voice/tool/get-slot — farmer's next/current booking
  // ============================================================
  fastify.get(
    '/voice/tool/get-slot',
    {
      schema: {
        querystring: {
          type: 'object' as const,
          required: ['farmer_id'],
          properties: {
            farmer_id: { type: 'string' as const, format: 'uuid' },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { farmer_id } = request.query as { farmer_id: string };

      // 1. Verify farmer exists
      const { data: farmer, error: farmerErr } = await supabase
        .from('farmers')
        .select('id, name')
        .eq('id', farmer_id)
        .single();

      if (farmerErr || !farmer) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Farmer with id '${farmer_id}' not found`,
        });
      }

      // 2. Find active (confirmed) booking
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, status, token')
        .eq('farmer_id', farmer_id)
        .eq('status', 'confirmed')
        .single();

      if (bookingErr || !booking) {
        // No active booking — return clear has_booking: false
        const response: VoiceGetSlotResponse = {
          has_booking: false,
        };
        return reply.send(response);
      }

      // 3. Get slot details for the booking
      const { data: bookingWithSlot, error: slotErr } = await supabase
        .from('bookings')
        .select(`
          id,
          token,
          slots!inner (
            mandi_id,
            date,
            start_time,
            end_time
          )
        `)
        .eq('id', booking.id)
        .single();

      if (slotErr || !bookingWithSlot || !bookingWithSlot.slots || !Array.isArray(bookingWithSlot.slots)) {
        // Fallback: just return what we have
        const response: VoiceGetSlotResponse = {
          has_booking: true,
          booking_id: booking.id,
          token_number: booking.token,
        };
        return reply.send(response);
      }

      const slotArray = bookingWithSlot.slots as unknown[];
      const slot = slotArray[0] as {
        mandi_id: string;
        date: string;
        start_time: string;
        end_time: string;
      };

      // Get mandi name
      const { data: mandi } = await supabase
        .from('mandis')
        .select('name')
        .eq('id', slot.mandi_id)
        .single();

      const timeWindow = `${slot.start_time} - ${slot.end_time}`;

      const response: VoiceGetSlotResponse = {
        has_booking: true,
        booking_id: bookingWithSlot.id,
        mandi_name: mandi?.name ?? null,
        date: slot.date,
        time_window: timeWindow,
        token_number: bookingWithSlot.token,
      };

      return reply.send(response);
    }
  );

  // ============================================================
  // GET /voice/tool/get-queue — live position and ETA
  // ============================================================
  fastify.get(
    '/voice/tool/get-queue',
    {
      schema: {
        querystring: {
          type: 'object' as const,
          required: ['farmer_id'],
          properties: {
            farmer_id: { type: 'string' as const, format: 'uuid' },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { farmer_id } = request.query as { farmer_id: string };

      // Use the shared queue engine for real position + ETA
      const result = await computeQueuePosition(farmer_id);

      if (!result.hasBooking) {
        return reply.send({
          has_booking: false,
          position: null,
          estimated_wait_minutes: null,
        });
      }

      const response: VoiceGetQueueResponse = {
        has_booking: true,
        position: result.position ?? undefined,
        estimated_wait_minutes: result.estimatedWaitMinutes ?? undefined,
        mandi_name: result.mandiName ?? undefined,
        token_number: result.token ?? undefined,
        computed_from: result.avgServiceMinutes !== null
          ? {
              avg_service_minutes: result.avgServiceMinutes ?? undefined,
              note: result.note,
            }
          : undefined,
      };

      return reply.send(response);
    }
  );

  // ============================================================
  // GET /voice/tool/get-price — wraps Phase 1 priceAdapter
  // ============================================================
  fastify.get(
    '/voice/tool/get-price',
    {
      schema: {
        querystring: {
          type: 'object' as const,
          required: ['mandi_id', 'commodity'],
          properties: {
            mandi_id: { type: 'string' as const, format: 'uuid' },
            commodity: { type: 'string' as const },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { mandi_id, commodity } = request.query as {
        mandi_id: string;
        commodity: string;
      };

      // 1. Verify mandi exists
      const { data: mandi, error: mandiErr } = await supabase
        .from('mandis')
        .select('id, name')
        .eq('id', mandi_id)
        .single();

      if (mandiErr || !mandi) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Mandi with id '${mandi_id}' not found`,
        });
      }

      // 2. Fetch prices from adapter (cache-first, real API)
      const priceResult = await fetchPrices(mandi.name);

      // 3. Filter to requested commodity
      const commodityPrices = priceResult.prices.filter(
        (p) => p.commodity.toLowerCase() === commodity.toLowerCase()
      );

      // Determine the actual price_date from the data
      const priceDate =
        commodityPrices.length > 0
          ? commodityPrices[0].date
          : new Date().toISOString().split('T')[0]; // Fallback to today only if no data

      const response: VoiceGetPriceResponse = {
        mandi_id: mandi_id,
        mandi_name: mandi.name,
        prices: commodityPrices,
        price_date: priceDate, // Actual date from cache/API response
        stale: priceResult.stale,
        fetched_at: priceResult.fetched_at,
        message: priceResult.message,
      };

      return reply.send(response);
    }
  );

  // ============================================================
  // GET /voice/tool/get-payment — real payment status
  // ============================================================
  fastify.get(
    '/voice/tool/get-payment',
    {
      schema: {
        querystring: {
          type: 'object' as const,
          required: ['farmer_id'],
          properties: {
            farmer_id: { type: 'string' as const, format: 'uuid' },
          },
          additionalProperties: false,
        },
      },
    },
    async (request, reply) => {
      const { farmer_id } = request.query as { farmer_id: string };

      // 1. Verify farmer exists
      const { data: farmer, error: farmerErr } = await supabase
        .from('farmers')
        .select('id')
        .eq('id', farmer_id)
        .single();

      if (farmerErr || !farmer) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: `Farmer with id '${farmer_id}' not found`,
        });
      }

      // 2. Find farmer's completed booking with procurement
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id')
        .eq('farmer_id', farmer_id)
        .eq('status', 'confirmed')
        .single();

      if (bookingErr || !booking) {
        // No confirmed booking = no payment
        const response: VoiceGetPaymentResponse = {
          has_payment: false,
          status: 'not_yet_processed',
        };
        return reply.send(response);
      }

      // 3. Get procurement for this booking
      const { data: procurement, error: procureErr } = await supabase
        .from('procurements')
        .select('id, status, quantity, price')
        .eq('booking_id', booking.id)
        .single();

      if (procureErr || !procurement) {
        const response: VoiceGetPaymentResponse = {
          has_payment: false,
          status: 'not_yet_processed',
        };
        return reply.send(response);
      }

      // 4. Get payment for this procurement
      const { data: payment, error: paymentErr } = await supabase
        .from('payments')
        .select('id, status, reference, updated_at, procurement_id')
        .eq('procurement_id', procurement.id)
        .single();

      if (paymentErr || !payment) {
        const response: VoiceGetPaymentResponse = {
          has_payment: false,
          status: 'not_yet_processed',
        };
        return reply.send(response);
      }

      // Calculate amount: quantity * price from procurement
      const amount =
        procurement.quantity && procurement.price
          ? Number(procurement.quantity) * Number(procurement.price)
          : undefined;

      const response: VoiceGetPaymentResponse = {
        has_payment: true,
        status: payment.status,
        amount: amount,
        reference: payment.reference,
        updated_at: payment.updated_at,
        procurement_id: payment.procurement_id,
        booking_id: booking.id,
      };

      return reply.send(response);
    }
  );
}