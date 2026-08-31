// Telephony webhook receiver stub
export interface CallPayload {
  callId: string;
  from: string;
  to: string;
}

export const processWebhookEvent = async (payload: CallPayload) => {
  // TODO: Process telephony provider webhook events
  return { status: 'received', callId: payload.callId };
};
