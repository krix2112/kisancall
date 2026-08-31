// Groq LLM Tool-Calling client wrapper stub
export class GroqLLM {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
  }

  async processTurn(history: unknown[], userUtterance: string): Promise<{ text: string; toolCalls?: unknown[] }> {
    // TODO: Send prompt and tool declarations to Groq Llama3 model
    return {
      text: 'TODO: Voice assistant response',
    };
  }
}
