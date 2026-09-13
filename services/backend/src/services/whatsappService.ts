export interface WhatsAppSendResult {
  success: boolean;
  messageSid?: string;
  status?: string;
  to: string;
  from: string;
  body: string;
  error?: {
    code?: number | string;
    message: string;
    status?: number;
    moreInfo?: string;
  };
}

export interface BookingAlertParams {
  farmerName: string;
  farmerPhone: string;
  token: string;
  mandiName: string;
  slotDate: string;
  startTime?: string;
  endTime?: string;
  crop?: string;
  modalPrice?: number;
}

export interface PaymentAlertParams {
  farmerName: string;
  farmerPhone: string;
  amount: number;
  crop: string;
  quantityKg: number;
  mandiName: string;
  reference: string;
  proofHash?: string;
}

/**
 * Sends a WhatsApp message via the Twilio REST API.
 */
export async function sendWhatsAppMessage(toPhone: string, bodyText: string): Promise<WhatsAppSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TELEPHONY_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_ACCOUNT_AUTH_TOKEN || process.env.TELEPHONY_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  
  // Format destination number with whatsapp: prefix
  let cleanTo = toPhone.trim();
  if (!cleanTo.startsWith('whatsapp:')) {
    if (!cleanTo.startsWith('+')) {
      cleanTo = `+${cleanTo}`;
    }
    cleanTo = `whatsapp:${cleanTo}`;
  }

  // Override recipient if alert override phone is set for sandbox testing
  const overrideTo = process.env.ALERT_RECIPIENT_PHONE;
  if (overrideTo && overrideTo.trim().length > 0) {
    let cleanOverride = overrideTo.trim();
    if (!cleanOverride.startsWith('whatsapp:')) {
      if (!cleanOverride.startsWith('+')) cleanOverride = `+${cleanOverride}`;
      cleanOverride = `whatsapp:${cleanOverride}`;
    }
    cleanTo = cleanOverride;
  }

  if (!accountSid || !authToken || accountSid.startsWith('your-') || authToken.startsWith('your-')) {
    console.warn('[WhatsAppService] TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not configured in .env');
    return {
      success: false,
      to: cleanTo,
      from: fromWhatsApp,
      body: bodyText,
      error: {
        code: 'MISSING_CREDENTIALS',
        message: 'TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing or not configured in services/backend/.env',
      },
    };
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams();
  params.append('From', fromWhatsApp);
  params.append('To', cleanTo);

  const contentSid = process.env.TWILIO_CONTENT_SID;
  if (contentSid && contentSid.trim().startsWith('HX')) {
    params.append('ContentSid', contentSid.trim());
    // Parse variables or pass structured variables
    params.append('ContentVariables', JSON.stringify({
      '1': 'KisanCall Alert',
      '2': bodyText.slice(0, 100).replace(/\n/g, ' ')
    }));
  } else {
    params.append('Body', bodyText);
  }

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = (await res.json()) as Record<string, any>;

    if (!res.ok) {
      console.error(`[WhatsAppService] Twilio API Error (${res.status}):`, data);
      return {
        success: false,
        to: cleanTo,
        from: fromWhatsApp,
        body: bodyText,
        error: {
          code: data.code || res.status,
          message: data.message || `Twilio HTTP ${res.status}: ${res.statusText}`,
          status: res.status,
          moreInfo: data.more_info,
        },
      };
    }

    console.log(`[WhatsAppService] WhatsApp alert sent successfully! SID: ${data.sid}, Status: ${data.status} to ${cleanTo}`);
    return {
      success: true,
      messageSid: data.sid,
      status: data.status,
      to: cleanTo,
      from: fromWhatsApp,
      body: bodyText,
    };
  } catch (networkErr: any) {
    console.error('[WhatsAppService] Network error sending WhatsApp message:', networkErr.message);
    return {
      success: false,
      to: cleanTo,
      from: fromWhatsApp,
      body: bodyText,
      error: {
        code: 'NETWORK_ERROR',
        message: networkErr.message,
      },
    };
  }
}

/**
 * Constructs and sends a real Booking Confirmation WhatsApp alert
 */
export async function sendBookingConfirmedAlert(params: BookingAlertParams): Promise<WhatsAppSendResult> {
  const timeStr = params.startTime && params.endTime ? `${params.startTime} - ${params.endTime}` : 'Morning Slot';
  const cropStr = params.crop || 'Wheat';
  const rateStr = params.modalPrice ? `₹${params.modalPrice.toLocaleString('en-IN')}/qtl` : 'Agmarknet Live Benchmark';

  const body = 
`🌾 *KisanCall Mandi Booking Confirmed* 🌾
Namaste *${params.farmerName}* ji,

Aapka mandi arrival slot confirm ho gaya hai:

🎫 *Token Number*: ${params.token}
📍 *Mandi*: ${params.mandiName}
📅 *Date*: ${params.slotDate}
⏰ *Time*: ${timeStr}
🌿 *Fasal / Crop*: ${cropStr}
💰 *Current Modal Rate*: ${rateStr}

Mandi aate samay apna Token Number (*${params.token}*) zaroor saath layein.
_AgroChain Verified Proof Anchor active._`;

  return sendWhatsAppMessage(params.farmerPhone, body);
}

/**
 * Constructs and sends a real Payment Disbursed WhatsApp alert
 */
export async function sendPaymentCompletedAlert(params: PaymentAlertParams): Promise<WhatsAppSendResult> {
  const body =
`💳 *KisanCall Payment Disbursed* 💳
Namaste *${params.farmerName}* ji,

Aapka fasal bhugtan safalta-purvak bhej diya gaya hai:

💵 *Amount*: ₹${params.amount.toLocaleString('en-IN')}
🌾 *Crop*: ${params.crop} (${params.quantityKg} kg)
📍 *Mandi*: ${params.mandiName}
🔗 *Tx Reference*: ${params.reference}
${params.proofHash ? `⛓️ *Shardeum Proof*: ${params.proofHash.slice(0, 18)}...` : ''}

Dhanyawad! KisanCall Helpline: 1800-KISAN`;

  return sendWhatsAppMessage(params.farmerPhone, body);
}
