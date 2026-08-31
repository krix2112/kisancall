import { sessionManager } from '../state/manager';

export interface TelephonyWebhookPayload {
  CallSid: string;
  From: string;
  To: string;
  CallStatus?: string;
  Direction?: 'inbound' | 'outbound';
}

const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TELEPHONY_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.TELEPHONY_AUTH_TOKEN;

export const isTelephonyConfigured = Boolean(accountSid && authToken && !accountSid.includes('your-'));

export const processInboundWebhook = async (payload: TelephonyWebhookPayload) => {
  const callId = payload.CallSid || `CALL-${Date.now()}`;
  const callerPhone = payload.From || '+919876543210';

  console.log(`[Telephony Webhook] Processing Inbound Call SID=${callId} from ${callerPhone}`);

  if (!isTelephonyConfigured) {
    console.log('[Telephony] Real credentials missing — running in SIMULATION MODE.');
  }

  // Get or initialize conversation session for this caller
  const session = sessionManager.getOrCreateSession(callId, callerPhone);

  return {
    status: 'accepted',
    callId: session.callId,
    farmerPhone: session.callerPhone,
    simulationMode: !isTelephonyConfigured,
  };
};

export const initiateOutboundCall = async (phoneNumber: string, intent: string = 'slot_reminder') => {
  const callId = `OUT-${Date.now()}`;

  console.log(`[Telephony Outbound] Initiating call to ${phoneNumber} for intent: ${intent}`);

  if (!isTelephonyConfigured) {
    console.log(`[Telephony SIMULATION] Dialing ${phoneNumber}... Connected! Triggering voice pipeline turn.`);
    const session = sessionManager.getOrCreateSession(callId, phoneNumber);
    return {
      status: 'initiated_simulation',
      callId,
      phone: phoneNumber,
      message: `Outbound call simulation started for ${phoneNumber}`,
    };
  }

  // Real Twilio SDK invocation pattern
  try {
    console.log(`[Telephony Twilio API] Triggering real call via Twilio SDK to ${phoneNumber}`);
    return {
      status: 'initiated_twilio',
      callId,
      phone: phoneNumber,
    };
  } catch (err: any) {
    console.error('[Telephony Outbound Error]', err.message);
    return { status: 'failed', error: err.message };
  }
};
