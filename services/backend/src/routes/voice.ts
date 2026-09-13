import { FastifyInstance } from 'fastify';
import { supabase } from '../supabase.js';
import { fetchPrices, parseAgmarknetDate } from '../services/priceAdapter.js';

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
    const callSid = body.CallSid || body.callSid || body.callId;

    // If request is from Twilio voice telephony webhook, answer with TwiML
    if (body.CallSid || body.callSid || request.headers['x-twilio-signature']) {
      return handleIncomingCall(request, reply);
    }

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

    let mandiName = body.mandi || body.mandi_name || body.mandiName || '';
    let cropName = body.commodity || 'Wheat';

    if (!mandiName && farmerId) {
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

    if (!mandiName) {
      mandiName = 'Sehore';
    }

    if (body.commodity) {
      cropName = body.commodity;
    }

    const varietyName = body.variety || undefined;

    const result = await fetchPrices(mandiName, cropName, varietyName);

    const matchedPrice = result.prices[0];

    if (!matchedPrice) {
      return reply.status(404).send({
        error: 'No price data available',
        message: `No Agmarknet price data found for ${cropName} at ${mandiName}. The mandi may not have reported today.`,
        commodity: cropName,
        market: mandiName,
      });
    }

    const dateMeta = parseAgmarknetDate(matchedPrice.date);

    return reply.send({
      commodity: matchedPrice.commodity,
      variety: matchedPrice.variety,
      min_price: matchedPrice.min_price,
      max_price: matchedPrice.max_price,
      modal_price: matchedPrice.modal_price,
      date: dateMeta.isoDate,
      date_display: dateMeta.displayEn,
      date_display_hi: dateMeta.displayHi,
      is_today: dateMeta.isToday,
      market: result.market_used || mandiName,
      source: result.source || 'Agmarknet / data.gov.in',
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

  /**
   * POST /voice/turn
   * Web Voice Loop endpoint for browser Speech API.
   * Body: { utterance: string, farmer_id?: string, phone?: string, language?: 'hi' | 'en' }
   */
  fastify.post('/voice/turn', async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const utterance = (body.utterance || body.message || body.text || '').trim();
    let farmerId = body.farmer_id || body.farmerId;
    const phone = body.phone || body.callerPhone;
    const language = (body.language || 'hi').toLowerCase();

    if (!utterance) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'utterance is required',
      });
    }

    // Resolve farmer profile
    let farmerProfile: any = null;
    if (farmerId) {
      const { data: f } = await supabase.from('farmers').select('*').eq('id', farmerId).maybeSingle();
      farmerProfile = f;
    } else if (phone) {
      const { data: f } = await supabase.from('farmers').select('*').eq('phone', phone).maybeSingle();
      farmerProfile = f;
    }

    if (!farmerProfile) {
      // Fall back to default seeded test farmer if none specified
      const { data: f } = await supabase.from('farmers').select('*').limit(1).maybeSingle();
      farmerProfile = f || {
        id: 'd16486e6-0b85-4d03-9778-11498d8e7523',
        name: 'Farmer',
        crop: 'Wheat',
        language: 'hi',
      };
    }

    farmerId = farmerProfile.id;

    // Mandi lookup
    let mandiName = 'Karnal Mandi';
    if (farmerProfile.preferred_mandi_id) {
      const { data: m } = await supabase.from('mandis').select('name').eq('id', farmerProfile.preferred_mandi_id).maybeSingle();
      if (m?.name) mandiName = m.name;
    }

    const context = {
      farmerId,
      name: farmerProfile.name || 'Farmer',
      language,
      preferredMandi: mandiName,
      crop: farmerProfile.crop || 'Wheat',
    };

    // Forward to Groq LLM logic or execute turn
    const { groqLLM } = await import('@kisancall/voice-pipeline');
    const result = await groqLLM.processTurn(utterance, context);

    return reply.send({
      reply: result.text,
      tool_calls: result.toolCallsMade,
      context,
    });
  });

  /**
   * Helper to escape XML characters for TwiML
   */
  function escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Helper to prepare text for Amazon Polly (Polly.Aditi hi-IN) TTS synthesis.
   * Strips symbols like ₹ (which causes Polly SSML parsing failures), formats currency as 'रुपये',
   * and translates technical terms phonetically.
   */
  function cleanTextForSpeech(text: string): string {
    return text
      // Replace currency symbols and abbreviations with spoken Hindi
      .replace(/₹\s*([0-9,]+)/g, '$1 रुपये')
      .replace(/₹/g, ' रुपये ')
      .replace(/Rs\.?\s*([0-9,]+)/gi, '$1 रुपये')
      .replace(/INR\s*([0-9,]+)/gi, '$1 रुपये')
      // English words to phonetically clean Hindi for Polly.Aditi
      .replace(/Agmarknet/gi, 'एगमार्कनेट')
      .replace(/data\.gov\.in/gi, 'डाटा डॉट जीओवी डॉट इन')
      .replace(/agricoop\.nic\.in/gi, 'एग्रीकॉप पोर्टल')
      .replace(/\bDBT\b/gi, 'डीबीटी')
      .replace(/\bMSP\b/gi, 'एमएसपी')
      // Replace slashes like ₹2900/qtl with प्रति
      .replace(/\/qtl/gi, ' प्रति क्विंटल')
      .replace(/\/quintal/gi, ' प्रति क्विंटल')
      .replace(/\//g, ' प्रति ')
      // Strip Markdown formatting and unwanted special chars
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '')
      .replace(/_{1,2}/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[|\\<>~^;]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Handler for speech recognition callback from Twilio Gather
   */
  async function handleVoiceRespond(request: any, reply: any) {
    const body = (request.body as Record<string, any>) || (request.query as Record<string, any>) || {};
    const speechResult = (body.SpeechResult || body.speechResult || body.utterance || '').trim();
    const callerPhone = body.From || body.from || '';
    const callSid = body.CallSid || body.callSid || '';
    const confidence = body.Confidence || '1.0';

    const protocol = (request.headers['x-forwarded-proto'] as string) || 'https';
    const host = request.headers['x-forwarded-host'] || request.headers['host'] || request.hostname;
    const respondActionUrl = `${protocol}://${host}/voice/respond`;

    fastify.log.info(`[Twilio Voice] Recognized speech from ${callerPhone}: "${speechResult}" (Confidence: ${confidence})`);

    // If no speech was detected
    if (!speechResult) {
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="hi-IN" speechTimeout="auto" action="${respondActionUrl}" method="POST">
    <Say language="hi-IN" voice="Polly.Aditi">क्षमा करें, मुझे समझ नहीं आया। क्या आप आज का भाव, स्लॉट बुकिंग, या भुगतान स्थिति जानना चाहते हैं?</Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">किसानकॉल से जुड़ने के लिए धन्यवाद। आपका दिन शुभ हो!</Say>
  <Hangup/>
</Response>`;
      reply.header('Content-Type', 'text/xml; charset=utf-8');
      return reply.send(fallbackTwiml);
    }

    // Lookup farmer profile
    let farmerProfile: any = null;
    if (callerPhone) {
      const cleanPhone = callerPhone.replace(/\s+/g, '');
      const { data: f } = await supabase
        .from('farmers')
        .select('*')
        .or(`phone.eq.${cleanPhone},phone.eq.${cleanPhone.replace('+91', '')},phone.eq.+91${cleanPhone.replace('+91', '')}`)
        .maybeSingle();
      farmerProfile = f;
    }

    if (!farmerProfile) {
      const { data: f } = await supabase.from('farmers').select('*').limit(1).maybeSingle();
      farmerProfile = f || {
        id: 'd16486e6-0b85-4d03-9778-11498d8e7523',
        name: 'किसान भाई',
        crop: 'Wheat',
        language: 'hi',
      };
    }

    let mandiName = 'सीहोर मंडी';
    if (farmerProfile.preferred_mandi_id) {
      const { data: m } = await supabase.from('mandis').select('name').eq('id', farmerProfile.preferred_mandi_id).maybeSingle();
      if (m?.name) mandiName = m.name;
    }

    const context = {
      farmerId: farmerProfile.id,
      name: farmerProfile.name || 'किसान भाई',
      language: farmerProfile.language || 'hi',
      preferredMandi: mandiName,
      crop: farmerProfile.crop || 'Wheat',
    };

    // Invoke Groq LLM with tools — NO fallback fake data
    let synthesizedAnswer = '';
    try {
      const { groqLLM } = await import('@kisancall/voice-pipeline');
      const llmResult = await groqLLM.processTurn(speechResult, context);
      fastify.log.info(`[Twilio Voice] LLM response: "${llmResult.text}" (Tools: ${llmResult.toolCallsMade.join(', ') || 'none'})`);
      if (llmResult.text && llmResult.text.trim().length > 0) {
        synthesizedAnswer = cleanTextForSpeech(llmResult.text);
      } else {
        synthesizedAnswer = 'क्षमा करें, आपका अनुरोध संसाधित नहीं हो सका। कृपया दोबारा पूछें या मंडी कार्यालय से संपर्क करें।';
      }
    } catch (llmErr: any) {
      fastify.log.error(`[Twilio Voice] LLM error: ${llmErr.message}`);
      synthesizedAnswer = 'यह जानकारी अभी उपलब्ध नहीं है। कृपया मंडी कार्यालय या हेल्पलाइन से संपर्क करें।';
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(synthesizedAnswer)}</Say>
  <Gather input="speech" language="hi-IN" speechTimeout="auto" action="${respondActionUrl}" method="POST">
    <Say language="hi-IN" voice="Polly.Aditi">क्या आप कुछ और पूछना चाहते हैं?</Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">किसानकॉल से जुड़ने के लिए धन्यवाद। आपका दिन शुभ हो!</Say>
  <Hangup/>
</Response>`;

    reply.header('Content-Type', 'text/xml; charset=utf-8');
    return reply.send(twiml);
  }

  /**
   * POST /voice/incoming-call
   * Webhook entry point configured in Twilio Console Voice configuration.
   * Answers incoming telephone call with Hindi voice greeting + speech Gather loop.
   */
  async function handleIncomingCall(request: any, reply: any) {
    const body = (request.body as Record<string, any>) || (request.query as Record<string, any>) || {};
    const callerPhone = body.From || body.from || body.callerPhone || '';
    const callSid = body.CallSid || body.callSid || `CALL-${Date.now()}`;

    const protocol = (request.headers['x-forwarded-proto'] as string) || 'https';
    const host = request.headers['x-forwarded-host'] || request.headers['host'] || request.hostname;
    const respondActionUrl = `${protocol}://${host}/voice/respond`;

    fastify.log.info(`[Twilio Voice] Incoming phone call received: SID=${callSid}, From=${callerPhone}, ActionURL=${respondActionUrl}`);

    // Look up caller in Supabase farmers table
    let farmerName = '';
    let cropName = 'Wheat';
    let mandiName = 'सीहोर मंडी';

    if (callerPhone) {
      const cleanPhone = callerPhone.replace(/\s+/g, '');
      const { data: farmer } = await supabase
        .from('farmers')
        .select('name, crop, preferred_mandi_id')
        .or(`phone.eq.${cleanPhone},phone.eq.${cleanPhone.replace('+91', '')},phone.eq.+91${cleanPhone.replace('+91', '')}`)
        .maybeSingle();

      if (farmer) {
        if (farmer.name) farmerName = farmer.name;
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

    const greeting = farmerName
      ? `नमस्ते ${farmerName} जी! किसानकॉल में आपका स्वागत है।`
      : `नमस्ते! किसानकॉल सरकारी सेवा में आपका स्वागत है।`;

    const promptText = `${greeting} आप आज का मंडी भाव, स्लॉट बुकिंग, या फसल भुगतान की स्थिति पूछ सकते हैं। आप क्या जानना चाहते हैं?`;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="hi-IN" speechTimeout="auto" action="${respondActionUrl}" method="POST">
    <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(promptText)}</Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">हमें आपकी आवाज़ नहीं सुनाई दी। कृपया दोबारा कॉल करें। धन्यवाद!</Say>
  <Hangup/>
</Response>`;

    reply.header('Content-Type', 'text/xml; charset=utf-8');
    return reply.send(twiml);
  }

  /**
   * Register all alias routes for inbound call and speech response
   */
  fastify.all('/', handleIncomingCall);
  fastify.all('/voice', handleIncomingCall);
  fastify.all('/voice/', handleIncomingCall);
  fastify.all('/webhook', handleIncomingCall);
  fastify.all('/webhook/', handleIncomingCall);
  fastify.all('/call', handleIncomingCall);
  fastify.all('/call/', handleIncomingCall);
  fastify.all('/voice/call', handleIncomingCall);
  fastify.all('/voice/call/', handleIncomingCall);
  fastify.all('/voice/incoming-call', handleIncomingCall);
  fastify.all('/voice/incoming-call/', handleIncomingCall);
  fastify.all('/incoming-call', handleIncomingCall);
  fastify.all('/incoming-call/', handleIncomingCall);

  fastify.all('/voice/respond', handleVoiceRespond);
  fastify.all('/voice/respond/', handleVoiceRespond);
  fastify.all('/respond', handleVoiceRespond);
  fastify.all('/respond/', handleVoiceRespond);
  fastify.all('/voice/incoming-call/voice/respond', handleVoiceRespond);
  fastify.all('/voice/incoming-call/respond', handleVoiceRespond);
}

