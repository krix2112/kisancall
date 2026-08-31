// Deepgram STT client wrapper stub
export class DeepgramSTT {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPGRAM_API_KEY || '';
  }

  async transcribeAudioStream(stream: unknown): Promise<string> {
    // TODO: Connect to Deepgram Live Transcription WS API
    return 'TODO: Transcribed speech text';
  }
}
