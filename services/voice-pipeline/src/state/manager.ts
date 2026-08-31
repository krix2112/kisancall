// Conversation State Manager stub
export interface CallSession {
  callId: string;
  farmerId?: string;
  language: string;
  turns: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class ConversationState {
  private sessions: Map<string, CallSession> = new Map();

  getOrCreateSession(callId: string): CallSession {
    if (!this.sessions.has(callId)) {
      this.sessions.set(callId, {
        callId,
        language: 'hi',
        turns: [],
      });
    }
    return this.sessions.get(callId)!;
  }

  // TODO: Implement conversation history accumulation and state transitions
}
