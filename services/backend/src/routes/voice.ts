import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { fetchPrices } from '../services/priceAdapter.js';

export async function voiceRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /voice/webhook
   * Inbound telephony webhook receiver.
   * Matches telephony receiver payload (CallSid, From, To).
   * Looks up farmer by phone and returns initial FarmerCallContext.
   */
  fastify.post('/voice/webhook', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const callerPhone = body.From || body.from || body.callerPhone || body.phone;
    const callSid = body.CallSid || body.callSid || body.callId || `CALL-${Date.now()}`;

    let farmerData: any = null;

    if (callerPhone) {
      const { data: farmer } = await supabase
        .from('farmers')
        .select('id, name, phone, language, preferred_mandi_id, crop')
        .eq('phone', callerPhone)
        .maybeSingle();

      farmerData = farmer;
    }

    let mandiName = 'Karnal Mandi';
    if (farmerData?.preferred_mandi_id) {
      const { data: mandi } = await supabase
        .from('mandis')
        .select('name')
        .eq('id', farmerData.preferred_mandi_id)
        .maybeSingle();
      if (mandi?.name) mandiName = mandi.name;
    }

    const context = {
      callId: callSid,
      farmerId: farmerData?.id || (callerPhone ? `FARMER-${callerPhone.slice(-4)}` : 'FARMER-UNKNOWN'),
      farmer_id: farmerData?.id || null,
      name: farmerData?.name || 'Farmer',
      phone: callerPhone || '+919999999999',
      language: farmerData?.language || 'hi',
      preferredMandi: mandiName,
      preferred_mandi_id: farmerData?.preferred_mandi_id || null,
      crop: farmerData?.crop || 'Wheat',
    };

    return reply.send(context);
  });

  /**
   * POST /voice/tool/get-slot
   * Body: { farmer_id: uuid }
   * Look up farmer's most recent/active booking + its slot details.
   * Return: { mandi_name, date, start_time, end_time, status }
   */
  fastify.post('/voice/tool/get-slot', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const farmerId = body.farmer_id || body.farmerId;

    if (!farmerId) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'farmer_id is required',
      });
    }

    // Look up most recent booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('id, slot_id, status, created_at')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (bErr || !booking) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'No booking found for this farmer',
      });
    }

    // Look up slot details
    const { data: slot, error: sErr } = await supabase
      .from('slots')
      .select('id, date, start_time, end_time, mandi_id')
      .eq('id', booking.slot_id)
      .single();

    if (sErr || !slot) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Slot details not found',
      });
    }

    // Look up mandi name
    let mandi_name = 'Karnal Mandi';
    if (slot.mandi_id) {
      const { data: mandi } = await supabase
        .from('mandis')
        .select('name')
        .eq('id', slot.mandi_id)
        .single();
      if (mandi?.name) mandi_name = mandi.name;
    }

    return reply.send({
      mandi_name,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      status: booking.status,
    });
  });

  /**
   * POST /voice/tool/get-queue
   * Body: { farmer_id: uuid }
   * Reuse logic as GET /farmers/:id/queue
   * Return: { position, estimated_wait_minutes, token }
   */
  fastify.post('/voice/tool/get-queue', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const farmerId = body.farmer_id || body.farmerId;

    if (!farmerId) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'farmer_id is required',
      });
    }

    // Find confirmed booking or fall back to most recent booking
    let { data: activeBooking } = await supabase
      .from('bookings')
      .select('id, slot_id, token, status, created_at')
      .eq('farmer_id', farmerId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!activeBooking) {
      const { data: recentBooking } = await supabase
        .from('bookings')
        .select('id, slot_id, token, status, created_at')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      activeBooking = recentBooking;
    }

    if (!activeBooking) {
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

    const position = (positionCount ?? 0) + 1;

    // Average wait time computation
    const { data: slotData } = await supabase
      .from('slots')
      .select('mandi_id')
      .eq('id', activeBooking.slot_id)
      .single();

    let avgServiceMinutes: number | null = null;
    if (slotData) {
      try {
        const { data: serviceTimings } = await supabase
          .rpc('compute_avg_service_time', { p_mandi_id: slotData.mandi_id })
          .single();
        if (serviceTimings && typeof serviceTimings === 'object' && 'avg_minutes' in serviceTimings) {
          avgServiceMinutes = (serviceTimings as { avg_minutes: number }).avg_minutes;
        }
      } catch {
        // RPC might not exist
      }
    }

    const estimatedWaitMinutes = avgServiceMinutes !== null
      ? Math.round(position * avgServiceMinutes)
      : null;

    return reply.send({
      position,
      estimated_wait_minutes: estimatedWaitMinutes,
      token: activeBooking.token,
    });
  });

  /**
   * POST /voice/tool/get-price
   * Body: { farmer_id: uuid }
   * Look up farmer's preferred mandi and crop automatically.
   * Return: { commodity, variety, min_price, max_price, modal_price, date, stale }
   */
  fastify.post('/voice/tool/get-price', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const farmerId = body.farmer_id || body.farmerId;

    let mandiName = 'Karnal Mandi';
    let cropName = 'Wheat';

    if (farmerId) {
      const { data: farmer } = await supabase
        .from('farmers')
        .select('preferred_mandi_id, crop')
        .eq('id', farmerId)
        .maybeSingle();

      if (farmer) {
        if (farmer.crop) cropName = farmer.crop;
        if (farmer.preferred_mandi_id) {
          const { data: mandi } = await supabase
            .from('mandis')
            .select('name')
            .eq('id', farmer.preferred_mandi_id)
            .maybeSingle();
          if (mandi?.name) mandiName = mandi.name;
        }
      }
    }

    if (body.commodity) {
      cropName = body.commodity;
    }

    const result = await fetchPrices(mandiName);

    // Match crop in prices (case-insensitive)
    const matchedPrice = result.prices.find(
      (p) =>
        p.commodity.toLowerCase().includes(cropName.toLowerCase()) ||
        cropName.toLowerCase().includes(p.commodity.toLowerCase())
    ) || result.prices[0];

    if (!matchedPrice) {
      return reply.send({
        commodity: cropName,
        variety: 'Common',
        min_price: 2400,
        max_price: 2600,
        modal_price: 2500,
        date: new Date().toISOString().split('T')[0],
        stale: result.stale,
      });
    }

    return reply.send({
      commodity: matchedPrice.commodity,
      variety: matchedPrice.variety,
      min_price: matchedPrice.min_price,
      max_price: matchedPrice.max_price,
      modal_price: matchedPrice.modal_price,
      date: matchedPrice.date,
      stale: result.stale,
    });
  });

  /**
   * POST /voice/tool/get-payment
   * Body: { farmer_id: uuid }
   * Look up farmer's most recent procurement + payment
   * Return: { status, amount, reference, updated_at } or "no payment yet"
   */
  fastify.post('/voice/tool/get-payment', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const farmerId = body.farmer_id || body.farmerId;

    if (!farmerId) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'farmer_id is required',
      });
    }

    // Look up farmer's bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (!bookings || bookings.length === 0) {
      return reply.send({
        status: 'no_payment',
        message: 'No payment record found',
        amount: 0,
        reference: 'N/A',
        updated_at: '',
      });
    }

    const bookingIds = bookings.map((b) => b.id);

    // Look up most recent procurement
    const { data: procurements } = await supabase
      .from('procurements')
      .select('booking_id, quantity, price, created_at')
      .in('booking_id', bookingIds)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!procurements || procurements.length === 0) {
      return reply.send({
        status: 'no_payment',
        message: 'No payment record found',
        amount: 0,
        reference: 'N/A',
        updated_at: '',
      });
    }

    const proc = procurements[0];

    // Look up payment
    const { data: payment } = await supabase
      .from('payments')
      .select('status, reference, updated_at')
      .eq('procurement_id', proc.booking_id)
      .maybeSingle();

    if (!payment) {
      return reply.send({
        status: 'no_payment',
        message: 'No payment record found',
        amount: 0,
        reference: 'N/A',
        updated_at: '',
      });
    }

    const amount = Number(proc.quantity) * Number(proc.price);

    return reply.send({
      status: payment.status,
      amount,
      reference: payment.reference,
      updated_at: payment.updated_at,
    });
  });
}
