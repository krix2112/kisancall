export interface STTResponse {
  transcript: string;
  isFinal: boolean;
  language: string;
}

export class DeepgramSTTClient {
  private apiKey: string;
  public isSimulation: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPGRAM_API_KEY || '';
    this.isSimulation = !this.apiKey || this.apiKey.includes('your-deepgram');
  }

  /**
   * Process incoming text input directly in Simulation Mode (CLI / Test Harness).
   */
  async processSimulatedUtterance(textInput: string, language: string = 'hi'): Promise<STTResponse> {
    console.log(`[STT Simulation Input] (${language}): "${textInput}"`);
    return {
      transcript: textInput.trim(),
      isFinal: true,
      language,
    };
  }

  /**
   * Deepgram Nova Live WebSocket Streaming STT stub
   */
  async startLiveStream(
    audioChunkHandler: (chunk: Buffer) => void,
    onTranscript: (result: STTResponse) => void
  ) {
    if (this.isSimulation) {
      console.log('[STT Deepgram] Running in Simulation Mode (No DEEPGRAM_API_KEY). Use text input.');
      return;
    }

    console.log('[STT Deepgram Nova] Connecting to wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true');
    // Stub turn-detection streaming socket listener
  }
}

export const deepgramSTT = new DeepgramSTTClient();
