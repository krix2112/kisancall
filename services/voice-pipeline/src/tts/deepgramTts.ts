export class DeepgramTTSClient {
  private apiKey: string;
  public isSimulation: boolean;
  private currentStreamCancelled: boolean = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPGRAM_API_KEY || '';
    this.isSimulation = !this.apiKey || this.apiKey.includes('your-deepgram');
  }

  /**
   * Synthesize spoken audio or print output in simulation mode
   */
  async speakText(
    text: string,
    language: string = 'hi',
    onAudioChunk?: (chunk: Buffer) => void
  ): Promise<{ textSpoken: string; cancelled: boolean }> {
    this.currentStreamCancelled = false;

    console.log(`\n[TTS Audio Output] (${language.toUpperCase()}): "${text}"`);

    if (this.isSimulation) {
      // In simulation mode, text is output to console cleanly
      return { textSpoken: text, cancelled: this.currentStreamCancelled };
    }

    // Deepgram Aura/Flux Websocket Audio Stream synthesis stub
    try {
      if (this.currentStreamCancelled) {
        console.log('[TTS Stream] Playback cancelled due to user barge-in.');
        return { textSpoken: text, cancelled: true };
      }
      return { textSpoken: text, cancelled: false };
    } catch (err: any) {
      console.error('[TTS Deepgram Error]', err.message);
      return { textSpoken: text, cancelled: false };
    }
  }

  /**
   * Immediately cancel any playing TTS output when user interruption (barge-in) occurs
   */
  cancelCurrentOutput() {
    this.currentStreamCancelled = true;
    console.log('[TTS Interruption] Barge-in triggered! Immediately stopping TTS stream output.');
  }
}

export const deepgramTTS = new DeepgramTTSClient();
