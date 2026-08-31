import { deepgramTTS } from '../tts/deepgramTts';

export interface Turn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: string[];
}

export interface FarmerCallContext {
  farmerId: string;
  name: string;
  phone: string;
  language: string; // 'hi' | 'en'
  preferredMandi: string;
  crop: string;
  slotContext?: Record<string, any>;
  queueContext?: Record<string, any>;
  priceContext?: Record<string, any>;
  paymentContext?: Record<string, any>;
}

export interface CallSession {
  callId: string;
  callerPhone: string;
  context: FarmerCallContext;
  turns: Turn[];
  isPlayingTts: boolean;
  activeTtsStreamId?: string;
  lastCallOutcome?: string;
}

export class SessionManager {
  private sessions: Map<string, CallSession> = new Map();

  /**
   * Initialize or retrieve call session with compact per-call context object.
   * Context is fetched fresh per call (not cached across calls) per §11.2 of the design doc.
   */
  getOrCreateSession(callId: string, callerPhone: string = '+919876543210'): CallSession {
    if (!this.sessions.has(callId)) {
      const freshContext: FarmerCallContext = {
        farmerId: `FARMER-${callerPhone.slice(-4)}`,
        name: 'Ramesh Kumar',
        phone: callerPhone,
        language: 'hi', // Default to Hindi, can switch to English
        preferredMandi: 'Karnal Central Mandi',
        crop: 'Wheat (गेहूं)',
      };

      this.sessions.set(callId, {
        callId,
        callerPhone,
        context: freshContext,
        turns: [],
        isPlayingTts: false,
      });
    }
    return this.sessions.get(callId)!;
  }

  /**
   * BARGE-IN INTERRUPTION HANDLING:
   * If new speech/utterance arrives while TTS output is actively playing (isPlayingTts = true),
   * immediately cancel the current TTS playback stream and return conversation state to listening.
   *
   * REAL TELEPHONY / WebRTC MAPPING:
   * In a live telephony deployment (e.g. Twilio Media Streams / WebRTC), when incoming VAD
   * (Voice Activity Detection) or STT detects user speech while audio is playing out to the speaker,
   * the server sends a Clear / Interrupt frame to the telephony WebSocket to flush out queued audio buffers
   * and stops TTS synthesis instantly.
   */
  handleUserInterruption(callId: string) {
    const session = this.sessions.get(callId);
    if (session && session.isPlayingTts) {
      console.log(`\n⚡ [BARGE-IN DETECTED] Session ${callId}: User started speaking while TTS was playing!`);
      deepgramTTS.cancelCurrentOutput();
      session.isPlayingTts = false;
    }
  }

  setTtsPlaybackState(callId: string, isPlaying: boolean) {
    const session = this.sessions.get(callId);
    if (session) {
      session.isPlayingTts = isPlaying;
    }
  }

  addTurn(callId: string, turn: Turn) {
    const session = this.sessions.get(callId);
    if (session) {
      session.turns.push(turn);
    }
  }

  setLanguage(callId: string, language: 'hi' | 'en') {
    const session = this.sessions.get(callId);
    if (session) {
      session.context.language = language;
    }
  }
}

export const sessionManager = new SessionManager();
