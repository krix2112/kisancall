import { processInboundWebhook, initiateOutboundCall } from './telephony/receiver';
import { sessionManager } from './state/manager';
import { deepgramSTT } from './stt/deepgramStt';
import { groqLLM } from './llm/groqClient';
import { deepgramTTS } from './tts/deepgramTts';

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
} catch (e) {
  // dotenv will load when installed
}

export const handleIncomingCall = async (callData: { callId?: string; from: string }) => {
  const result = await processInboundWebhook({
    CallSid: callData.callId || `CALL-${Date.now()}`,
    From: callData.from,
    To: '+911800123456',
  });
  return result;
};

export const handleOutboundCall = async (callData: { farmerPhone: string; intent: string }) => {
  const result = await initiateOutboundCall(callData.farmerPhone, callData.intent);
  return result;
};

/**
 * Execute a single conversational turn in the voice pipeline end-to-end
 */
export const executeVoiceTurn = async (
  callId: string,
  userUtterance: string
): Promise<{ reply: string; toolCalls: string[] }> => {
  const session = sessionManager.getOrCreateSession(callId);

  // 1. Handle Barge-in interruption if TTS is currently playing
  sessionManager.handleUserInterruption(callId);

  // 2. STT Processing (Simulation or Streaming)
  const sttResult = await deepgramSTT.processSimulatedUtterance(userUtterance, session.context.language);
  sessionManager.addTurn(callId, {
    role: 'user',
    content: sttResult.transcript,
    timestamp: new Date().toISOString(),
  });

  // 3. LLM Processing with Grounded System Prompt & Tool Calling
  const llmResult = await groqLLM.processTurn(sttResult.transcript, session.context);

  // 4. TTS Output Processing
  sessionManager.setTtsPlaybackState(callId, true);
  await deepgramTTS.speakText(llmResult.text, session.context.language);
  sessionManager.setTtsPlaybackState(callId, false);

  sessionManager.addTurn(callId, {
    role: 'assistant',
    content: llmResult.text,
    timestamp: new Date().toISOString(),
    toolCalls: llmResult.toolCallsMade,
  });

  return {
    reply: llmResult.text,
    toolCalls: llmResult.toolCallsMade,
  };
};

console.log('⚡ Voice Pipeline Orchestration Service initialized (USE_MOCK_TOOLS=' + (process.env.USE_MOCK_TOOLS !== 'false') + ')');
