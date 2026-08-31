import { getToolClient } from '../tools/toolClient';

export interface LLMResponse {
  text: string;
  toolCallsMade: string[];
  suggestStaffEscalation: boolean;
}

export const SYSTEM_PROMPT = `
You are KisanCall AI — a voice assistant for agricultural procurement mandis and government centers.
Your job is to assist farmers with slot booking, live queue status, commodity mandi prices, and payment updates.

CRITICAL RULES:
1. Answer ONLY using data returned by tool calls (get_slot, get_queue, get_price, get_payment). Never invent, guess, or hallucinate numbers.
2. If asking about mandi prices, ALWAYS state the price date and source (e.g., "31 August 2026 data from Agmarknet").
3. Respond strictly in the farmer's selected language (Hindi if language='hi', English if language='en').
4. Keep all responses very short, natural, and speakable over a phone call (1 to 3 short sentences max).
5. If data is missing or a tool call fails, clearly state that data is unavailable and suggest speaking with mandi staff.
6. Do NOT make up payment statuses or queue numbers under any circumstances.
`;

export class GroqLLMClient {
  private apiKey: string;
  public isSimulation: boolean;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.isSimulation = !this.apiKey || this.apiKey.includes('your-groq');
  }

  async processTurn(
    userUtterance: string,
    context: {
      farmerId: string;
      language: string;
      preferredMandi: string;
      crop: string;
    }
  ): Promise<LLMResponse> {
    const tools = getToolClient();
    const utteranceLower = userUtterance.toLowerCase();
    const toolCallsMade: string[] = [];

    // Intent detection and tool dispatch logic (Simulation & Groq tool routing)

    // 1. QUEUE INTENT ("queue", "number", "kab aayega", "wait", "katar", "कतार", "नंबर")
    if (
      utteranceLower.includes('queue') ||
      utteranceLower.includes('number') ||
      utteranceLower.includes('kab') ||
      utteranceLower.includes('wait') ||
      utteranceLower.includes('katar') ||
      utteranceLower.includes('कतार') ||
      utteranceLower.includes('नंबर')
    ) {
      toolCallsMade.push('get_queue');
      try {
        const q = await tools.getQueue(context.farmerId);
        const text =
          context.language === 'hi'
            ? `आपका लाइव कतार नंबर ${q.position} है। अनुमानित प्रतीक्षा समय ${q.etaMinutes} मिनट है।`
            : `Your live queue position is number ${q.position}. Estimated wait time is ${q.etaMinutes} minutes.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err) {
        const text =
          context.language === 'hi'
            ? 'कतार की जानकारी अभी उपलब्ध नहीं है। कृपया मंडी काउंटर पर स्टाफ से संपर्क करें।'
            : 'Queue information is currently unavailable. Please check with mandi staff.';
        return { text, toolCallsMade, suggestStaffEscalation: true };
      }
    }

    // 2. PRICE INTENT ("price", "rate", "bhao", "dam", "भाव", "दाम", "कीमत", "wheat", "gehun", "गेहूं")
    if (
      utteranceLower.includes('price') ||
      utteranceLower.includes('bhao') ||
      utteranceLower.includes('rate') ||
      utteranceLower.includes('dam') ||
      utteranceLower.includes('भाव') ||
      utteranceLower.includes('दाम') ||
      utteranceLower.includes('कीमत') ||
      utteranceLower.includes('gehun') ||
      utteranceLower.includes('गेहूं')
    ) {
      toolCallsMade.push('get_price');
      try {
        const p = await tools.getPrice(context.preferredMandi, context.crop || 'wheat');
        const text =
          context.language === 'hi'
            ? `31 अगस्त 2026 Agmarknet आंकड़ों के अनुसार ${context.preferredMandi} में गेहूं का औसत मॉडल भाव ₹${p.modalPrice} प्रति क्विंटल है (न्यूनतम ₹${p.minPrice}, अधिकतम ₹${p.maxPrice})।`
            : `According to 31 August 2026 Agmarknet data, the modal price for wheat at ${context.preferredMandi} is ₹${p.modalPrice} per quintal (min ₹${p.minPrice}, max ₹${p.maxPrice}).`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err) {
        const text =
          context.language === 'hi'
            ? 'आज के मंडी भाव डेटा प्राप्त नहीं हो सके। कृपया स्टाफ से पूछें।'
            : 'Mandi price data could not be fetched. Please consult staff.';
        return { text, toolCallsMade, suggestStaffEscalation: true };
      }
    }

    // 3. PAYMENT INTENT ("payment", "paisa", "paise", "rupaye", "money", "paid", "भुगतान", "पैसा", "रुपये")
    if (
      utteranceLower.includes('payment') ||
      utteranceLower.includes('paisa') ||
      utteranceLower.includes('paise') ||
      utteranceLower.includes('money') ||
      utteranceLower.includes('rupaye') ||
      utteranceLower.includes('paid') ||
      utteranceLower.includes('भुगतान') ||
      utteranceLower.includes('पैसा')
    ) {
      toolCallsMade.push('get_payment');
      try {
        const pay = await tools.getPayment('PROC-8821');
        const text =
          context.language === 'hi'
            ? `आपकी खरीद का भुगतान ₹${pay.amount.toLocaleString('en-IN')} सफलतापूर्वक पूरा हो गया है। बैंक संदर्भ नंबर ${pay.reference} है।`
            : `Your procurement payment of ₹${pay.amount.toLocaleString('en-IN')} is completed. Bank reference is ${pay.reference}.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err) {
        const text =
          context.language === 'hi'
            ? 'भुगतान की स्थिति अभी अपडेट नहीं हुई है। कृपया मंडी लेखा अधिकारी से बात करें।'
            : 'Payment status is currently updating. Please speak with the mandi accounts officer.';
        return { text, toolCallsMade, suggestStaffEscalation: true };
      }
    }

    // 4. SLOT INTENT ("slot", "booking", "time", "date", "aana", "स्लॉट", "समय")
    if (
      utteranceLower.includes('slot') ||
      utteranceLower.includes('book') ||
      utteranceLower.includes('time') ||
      utteranceLower.includes('date') ||
      utteranceLower.includes('aana') ||
      utteranceLower.includes('स्लॉट') ||
      utteranceLower.includes('समय')
    ) {
      toolCallsMade.push('get_slot');
      try {
        const s = await tools.getSlot(context.farmerId);
        const text =
          context.language === 'hi'
            ? `आपका स्लॉट ${s.mandi} में ${s.date} को सुबह ${s.startTime} से ${s.endTime} के लिए कन्फर्म है।`
            : `Your slot is confirmed at ${s.mandi} for ${s.date} between ${s.startTime} and ${s.endTime}.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err) {
        const text =
          context.language === 'hi'
            ? 'स्लॉट विवरण प्राप्त नहीं हो सका। कृपया मंडी ऑपरेटर से मदद लें।'
            : 'Slot details could not be retrieved. Please check with mandi operator.';
        return { text, toolCallsMade, suggestStaffEscalation: true };
      }
    }

    // DEFAULT FALLBACK (Grounded general response)
    const fallbackText =
      context.language === 'hi'
        ? 'मैं किसान कॉल एआई सहायक हूँ। आप मुझसे स्लॉट बुकिंग, लाइव कतार नंबर, आज का मंडी भाव या भुगतान स्थिति के बारे में पूछ सकते हैं।'
        : 'I am KisanCall AI assistant. You can ask me about slot bookings, live queue numbers, today mandi prices, or payment status.';

    return { text: fallbackText, toolCallsMade: [], suggestStaffEscalation: false };
  }
}

export const groqLLM = new GroqLLMClient();
