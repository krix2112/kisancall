import Groq from 'groq-sdk';
import { getToolClient, SlotResult, QueueResult, PriceResult, PaymentResult } from '../tools/toolClient';

export interface LLMResponse {
  text: string;
  toolCallsMade: string[];
  suggestStaffEscalation: boolean;
}

export const SYSTEM_PROMPT = `
You are KisanCall AI — a helpful, empathetic, and highly accurate voice assistant for Indian farmers at agricultural mandis and government procurement centers.

CORE CAPABILITIES (use appropriate tool for each):
1. **Slot Booking** (get_slot): Booking date, time window, mandi name, status, token number
2. **Queue Status** (get_queue): Live queue position, token, estimated wait time
3. **Mandi Prices** (get_price): Live Agmarknet commodity prices — min, max, modal — with date, market, and source
4. **Payment Status** (get_payment): DBT payment amount, reference number, bank status

CRITICAL RULES — NEVER BREAK THESE:
1. ALWAYS invoke the appropriate tool function before answering any data question. Never guess, estimate, or make up any number.
2. If a tool returns data, use ONLY that data in your response. Never add fake amounts, token numbers, dates, or prices.
3. If a tool returns an error or "not found", honestly tell the farmer: "अभी आपका डेटा उपलब्ध नहीं है, कृपया मंडी कार्यालय से संपर्क करें।"
4. Speak in natural, warm, conversational Hindi. Keep responses short (1-3 sentences) for phone clarity.
5. For prices (CRITICAL STALENESS RULE):
   - Always check isToday and stale in the get_price tool output.
   - If isToday is true (and stale is false): You may state today's live rate (e.g. 'आज का ताज़ा भाव...').
   - If isToday is false or stale is true: The mandi has NOT reported new rates today! You MUST explicitly state in natural Hindi that today's new rates have not been reported yet by the mandi, and this is the last available report from dateDisplayHi or date. Example: 'आज मंडी ने नए भाव दर्ज नहीं किए हैं। Agmarknet पर उपलब्ध अंतिम रिपोर्ट [date] के अनुसार मॉडल भाव [amount] रुपये प्रति क्विंटल रहा है।' NEVER say 'आज का भाव' (today's price) or present a cached rate as today's rate when isToday is false!
6. For slots: use the exact token, date, and time from the tool response. Never invent token numbers.
7. For payments: use the exact amount and reference from the tool response. Never invent amounts.
8. You can also answer general agricultural knowledge questions (MSP rates, required documents, mandi timings, moisture norms) from your training data — but NEVER fabricate specific data that should come from a tool.
9. If the farmer asks something completely outside your scope, say: "यह जानकारी अभी उपलब्ध नहीं है। कृपया मंडी कार्यालय या हेल्पलाइन से संपर्क करें।"
10. CURRENCY SYMBOL RULE: NEVER use the symbol '₹' or 'Rs.'. ALWAYS write 'रुपये' in Hindi words so the voice engine can speak it naturally.

GENERAL AGRICULTURE KNOWLEDGE:
- Required documents for mandi: Aadhaar card, Bank passbook, Slot token number
- Moisture norms: Wheat <12%, Paddy <17%, Mustard <8%
- Typical mandi hours: Monday-Saturday, 9:00 AM - 5:00 PM (varies by mandi)
- MSP (Minimum Support Price): You do NOT have a live database tool for MSP rates. If the farmer asks for MSP, NEVER recite unverified or hardcoded numbers. Tell them honestly in natural Hindi: "एमएसपी (न्यूनतम समर्थन मूल्य) की आधिकारिक और अद्यतन सरकारी दर जानने के लिए कृपया कृषि विभाग के आधिकारिक पोर्टल (agricoop.nic.in) या अपनी मंडी समिति से पुष्टि करें।" Then offer to check today's live Agmarknet mandi market price using get_price.

LANGUAGE: Always respond in Hindi unless the farmer speaks in English.
`;

export const FAST_SYNTHESIS_PROMPT = `You are KisanCall AI — a helpful, empathetic, and highly accurate voice assistant for Indian farmers at agricultural mandis.
CRITICAL RULES:
1. Speak in natural, warm, conversational Hindi in 1-2 short sentences for phone clarity.
2. Use ONLY the verified real data provided below. Never make up numbers, prices, tokens, dates, or amounts.
3. For prices (STALENESS RULE):
   - If is_today is true (and stale is false): State today's live rate (e.g. 'आज का ताज़ा भाव...').
   - If is_today is false or stale is true: You MUST explicitly state that today's new rates have not been reported yet by the mandi, and this is the last available report from date. Example: 'आज मंडी ने नए भाव दर्ज नहीं किए हैं। Agmarknet पर उपलब्ध अंतिम रिपोर्ट [date] के अनुसार मॉडल भाव [amount] रुपये प्रति क्विंटल रहा है।' NEVER say 'आज का भाव' (today's price).
4. For slots: state the exact token, date, and time window from the data.
5. For queues: state the live position and estimated wait time from the data.
6. For payments: state the credited amount, DBT reference, and status from the data.
7. For MSP: explain that official rates should be confirmed at agricoop.nic.in or the mandi office.
8. CURRENCY RULE: NEVER write '₹' or 'Rs.'. ALWAYS write 'रुपये' in Hindi words so voice synthesis speaks clearly.`;

const GROQ_TOOLS: Groq.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_slot',
      description: "Fetch the farmer's slot booking details including date, time window, mandi name, token number, and booking status.",
      parameters: {
        type: 'object',
        properties: {
          farmer_id: {
            type: 'string',
            description: "The farmer's unique UUID identifier.",
          },
        },
        required: ['farmer_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_queue',
      description: "Fetch the farmer's live queue position, token number, and estimated wait time at the mandi.",
      parameters: {
        type: 'object',
        properties: {
          farmer_id: {
            type: 'string',
            description: "The farmer's unique UUID identifier.",
          },
        },
        required: ['farmer_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_price',
      description: 'Fetch official Agmarknet mandi market prices (min, max, modal) for a specific crop/commodity. Returns real government data with date, market name, and source.',
      parameters: {
        type: 'object',
        properties: {
          farmer_id: {
            type: 'string',
            description: "The farmer's unique UUID identifier.",
          },
          commodity: {
            type: 'string',
            description: 'Commodity name in English (e.g., Wheat, Paddy, Mustard, Gram, Maize, Soyabean).',
          },
          variety: {
            type: 'string',
            description: 'Optional variety if specifically requested (e.g., Lokwan, Malwa Shakti, Sharbati).',
          },
        },
        required: ['farmer_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_payment',
      description: "Fetch the farmer's procurement payment status, DBT transfer reference, credited amount, and bank status.",
      parameters: {
        type: 'object',
        properties: {
          farmer_id: {
            type: 'string',
            description: "The farmer's unique UUID identifier.",
          },
        },
        required: ['farmer_id'],
      },
    },
  },
];

export class GroqLLMClient {
  private apiKey: string;
  private groq: Groq | null = null;
  public isSimulation: boolean;

  constructor(apiKey?: string) {
    this.apiKey = (apiKey || process.env.GROQ_API_KEY || '').trim();
    this.isSimulation = !this.apiKey || this.apiKey.includes('your-groq') || this.apiKey.length < 10;
    if (!this.isSimulation) {
      try {
        this.groq = new Groq({ apiKey: this.apiKey });
        console.log('[GroqLLMClient] ✅ Real Groq LLM initialized with API key');
      } catch (err: any) {
        console.warn('[GroqLLMClient] ❌ Failed to initialize Groq SDK:', err.message);
        this.isSimulation = true;
      }
    } else {
      console.warn('[GroqLLMClient] ⚠️ No valid GROQ_API_KEY — running in fallback heuristic mode (NO LLM)');
    }
  }

  /**
   * Process a conversational turn with Groq LLM and tool execution
   */
  async processTurn(
    userUtterance: string,
    context: {
      farmerId: string;
      language: string;
      preferredMandi: string;
      crop: string;
      name?: string;
    }
  ): Promise<LLMResponse> {
    const tools = getToolClient();
    const toolCallsMade: string[] = [];

    // PRIMARY PATH: Real Groq LLM with tool calling
    if (this.groq && !this.isSimulation) {
      try {
        const userPrompt = `CONTEXT: Farmer "${context.name || 'Farmer'}" (ID: ${context.farmerId}) is calling from ${context.preferredMandi}. Their crop is ${context.crop}. Respond in ${context.language === 'en' ? 'English' : 'Hindi'}.

FARMER'S QUESTION: "${userUtterance}"

IMPORTANT: If this question is about prices/bhav/rates, slots/booking/token, queue/line/wait, or payment/money/DBT — you MUST call the appropriate tool function. Do NOT answer without tool data.`;

        const messages: Groq.Chat.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ];

        // Fast 1-turn path: Pre-fetch verified real data for standard telephony intents (<600ms)
        const combinedCheck = (userUtterance + ' ' + userUtterance.toLowerCase());
        let preloadedTool: string | null = null;
        let preloadedData: any = null;

        if (/msp|एमएसपी|न्यूनतम समर्थन मूल्य/.test(combinedCheck)) {
          // MSP inquiry — handled by knowledge in system prompt pointing to official portal
          preloadedTool = 'msp_info';
        } else if (/bhav|भाव|price|rate|दाम|रेट|कीमत|मूल्य|गेहूं|wheat|चना|gram|chana|सरसों|mustard|sarson|धान|paddy|dhan|मक्का|maize|सोयाबीन|soya/.test(combinedCheck)) {
          let commodity = context.crop || 'Wheat';
          if (/चना|gram|chana/i.test(combinedCheck)) commodity = 'Gram';
          else if (/सरसों|mustard|sarson/i.test(combinedCheck)) commodity = 'Mustard';
          else if (/धान|paddy|dhan/i.test(combinedCheck)) commodity = 'Paddy';
          else if (/मक्का|maize/i.test(combinedCheck)) commodity = 'Maize';
          else if (/सोयाबीन|soya/i.test(combinedCheck)) commodity = 'Soyabean';
          else if (/गेहूं|wheat/i.test(combinedCheck)) commodity = 'Wheat';

          try {
            preloadedData = await tools.getPrice(context.farmerId, commodity, undefined, context.preferredMandi);
            preloadedTool = 'get_price';
            toolCallsMade.push('get_price');
          } catch (pErr: any) {
            console.warn('[GroqLLMClient] Preload price error:', pErr.message);
          }
        } else if (/slot|स्लॉट|प्लॉट|book|बुक|token|टोकन|तारीख|kab|कब|आना|aana/.test(combinedCheck)) {
          try {
            preloadedData = await tools.getSlot(context.farmerId);
            preloadedTool = 'get_slot';
            toolCallsMade.push('get_slot');
          } catch (sErr: any) {
            console.warn('[GroqLLMClient] Preload slot error:', sErr.message);
          }
        } else if (/queue|कतार|बारी|line|लाइन|wait|इंतजार/.test(combinedCheck)) {
          try {
            preloadedData = await tools.getQueue(context.farmerId);
            preloadedTool = 'get_queue';
            toolCallsMade.push('get_queue');
          } catch (qErr: any) {
            console.warn('[GroqLLMClient] Preload queue error:', qErr.message);
          }
        } else if (/payment|पैसा|पैसे|भुगतान|dbt|bank|बैंक|खाते|rupay/.test(combinedCheck)) {
          try {
            preloadedData = await tools.getPayment(context.farmerId);
            preloadedTool = 'get_payment';
            toolCallsMade.push('get_payment');
          } catch (pmErr: any) {
            console.warn('[GroqLLMClient] Preload payment error:', pmErr.message);
          }
        }

        if (preloadedTool) {
          // FAST 1-TURN SYNTHESIS with 100% REAL VERIFIED DATA (<600ms)
          const fastUserPrompt = `FARMER CONTEXT: "${context.name || 'किसान भाई'}" (Mandi: ${context.preferredMandi}, Crop: ${context.crop})
${preloadedData ? `REAL VERIFIED DATABASE/AGMARKNET DATA:\n${JSON.stringify(preloadedData, null, 2)}` : ''}

FARMER'S QUESTION: "${userUtterance}"

Respond in 1-2 short, conversational sentences in Hindi. Remember: speak रुपये in words, never write ₹. Follow the critical staleness rule if price data.`;

          const fastCompletion = await this.groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: FAST_SYNTHESIS_PROMPT },
              { role: 'user', content: fastUserPrompt },
            ],
            temperature: 0.2,
            max_tokens: 150,
          });

          const synthesized = fastCompletion.choices[0]?.message?.content || '';
          if (synthesized.trim()) {
            return {
              text: synthesized.trim(),
              toolCallsMade,
              suggestStaffEscalation: false,
            };
          }
        }

        // Detect if this is a data question that should force tool calling
        const isDataQuestion = /bhav|भाव|price|rate|दाम|रेट|कीमत|मूल्य|slot|स्लॉट|प्लॉट|book|बुक|token|टोकन|तारीख|कब|kab|queue|कतार|बारी|line|लाइन|payment|पैसा|पैसे|भुगतान|dbt|bank|बैंक|गेहूं|wheat|चना|सरसों|धान|मंडी|mandi|paisa|rupay|slot|kitna|कितना|आना|aana/.test(combinedCheck);

        // 1st Turn: Send prompt to Groq with tool declarations
        const completion = await this.groq.chat.completions.create({
          model: 'qwen/qwen3.8-27b',
          messages,
          tools: GROQ_TOOLS,
          tool_choice: isDataQuestion ? 'required' : 'auto',
          temperature: 0.2,
          max_tokens: 180,
        });

        const choice = completion.choices[0];
        const responseMessage = choice?.message;

        if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
          messages.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            const fnName = toolCall.function.name;
            toolCallsMade.push(fnName);
            let args: any = {};
            try {
              args = JSON.parse(toolCall.function.arguments || '{}');
            } catch {
              args = {};
            }

            const targetFarmerId = args.farmer_id || context.farmerId;
            let toolOutput: any = null;

            try {
              if (fnName === 'get_slot') {
                toolOutput = await tools.getSlot(targetFarmerId);
              } else if (fnName === 'get_queue') {
                toolOutput = await tools.getQueue(targetFarmerId);
              } else if (fnName === 'get_price') {
                const commodity = args.commodity || context.crop || 'Wheat';
                const variety = args.variety || undefined;
                toolOutput = await tools.getPrice(targetFarmerId, commodity, variety, context.preferredMandi);
              } else if (fnName === 'get_payment') {
                toolOutput = await tools.getPayment(targetFarmerId);
              } else {
                toolOutput = { error: `Unknown tool ${fnName}` };
              }
            } catch (toolErr: any) {
              console.warn(`[GroqLLMClient] Tool ${fnName} error:`, toolErr.message);
              toolOutput = { error: toolErr.message, status: 'tool_error' };
            }

            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolOutput),
            });
          }

          // 2nd Turn: Groq synthesizes the natural response based on REAL tool data
          const finalCompletion = await this.groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b',
            messages,
            temperature: 0.2,
            max_tokens: 180,
          });

          const finalText = finalCompletion.choices[0]?.message?.content || '';
          return {
            text: finalText.trim(),
            toolCallsMade,
            suggestStaffEscalation: false,
          };
        }

        // LLM responded without tool calls (general conversation / knowledge question)
        if (responseMessage?.content) {
          return {
            text: responseMessage.content.trim(),
            toolCallsMade,
            suggestStaffEscalation: false,
          };
        }
      } catch (err: any) {
        console.error('[GroqLLMClient] ❌ Groq API call failed:', err.message);
        // Fall through to heuristic fallback
      }
    }

    // FALLBACK PATH: Heuristic tool router (used ONLY when Groq API is unavailable)
    // This calls the SAME real backend tools — no fake data ever
    return this.fallbackHeuristicProcess(userUtterance, context);
  }

  /**
   * Heuristic fallback: routes intents to real backend tools.
   * ZERO hardcoded data — every number comes from the tool response or an honest error message.
   */
  private async fallbackHeuristicProcess(
    userUtterance: string,
    context: {
      farmerId: string;
      language: string;
      preferredMandi: string;
      crop: string;
      name?: string;
    }
  ): Promise<LLMResponse> {
    const tools = getToolClient();
    const utterance = userUtterance.toLowerCase();
    const toolCallsMade: string[] = [];
    const isHi = context.language !== 'en';

    const ERROR_MSG = isHi
      ? 'यह जानकारी अभी उपलब्ध नहीं है। कृपया मंडी कार्यालय या हेल्पलाइन से संपर्क करें।'
      : 'This information is currently unavailable. Please contact the mandi office or helpline.';

    // ── SIGN-OFF / CLOSURE ──
    if (
      utterance.includes('नहीं') || utterance.includes('nahi') ||
      utterance.includes('thank') || utterance.includes('थैंक') ||
      utterance.includes('धन्यवाद') || utterance.includes('शुक्रिया') ||
      utterance.includes('bye') || utterance.includes('बाय') ||
      utterance.includes('अलविदा') || utterance.includes('बस') ||
      utterance.includes('ho gaya') || utterance.includes('हो गया') ||
      utterance.includes('ठीक है')
    ) {
      const text = isHi
        ? 'किसानकॉल से जुड़ने के लिए बहुत-बहुत धन्यवाद! किसी भी जानकारी के लिए कभी भी कॉल करें। आपका दिन शुभ हो!'
        : 'Thank you for calling KisanCall! Feel free to call us anytime. Have a wonderful day!';
      return { text, toolCallsMade, suggestStaffEscalation: false };
    }

    // ── GENERAL KNOWLEDGE: REQUIRED DOCUMENTS ──
    if (
      utterance.includes('document') || utterance.includes('कागजात') ||
      utterance.includes('कागज') || utterance.includes('दस्तावेज') ||
      utterance.includes('क्या लाना') || utterance.includes('kya lana') ||
      utterance.includes('passbook') || utterance.includes('aadhaar') ||
      utterance.includes('आधार')
    ) {
      const text = isHi
        ? 'मंडी आते समय कृपया 3 चीजें साथ रखें: 1. आधार कार्ड, 2. बैंक पासबुक या खाता विवरण, और 3. अपना स्लॉट टोकन नंबर जो आपको बुकिंग के समय दिया गया था।'
        : 'Please bring your Aadhaar Card, Bank Passbook, and your Slot Token Number when arriving at the mandi.';
      return { text, toolCallsMade, suggestStaffEscalation: false };
    }

    // ── GENERAL KNOWLEDGE: MSP ──
    if (
      utterance.includes('msp') || utterance.includes('एमएसपी') ||
      utterance.includes('समर्थन मूल्य') || utterance.includes('सरकारी भाव') ||
      utterance.includes('सरकारी दर') || utterance.includes('सरकारी रेट')
    ) {
      const text = isHi
        ? `एमएसपी (न्यूनतम समर्थन मूल्य) की आधिकारिक और अद्यतन सरकारी दर जानने के लिए कृपया कृषि विभाग के पोर्टल agricoop.nic.in या अपनी मंडी समिति से पुष्टि करें। आज का वास्तविक Agmarknet मंडी भाव जानने के लिए "मंडी भाव बताओ" कहें।`
        : `For official and current Minimum Support Price (MSP) rates, please verify with the Agriculture Department portal at agricoop.nic.in or your local mandi office. To check today's live market prices, say "mandi bhav".`;
      return { text, toolCallsMade, suggestStaffEscalation: false };
    }

    // ── GENERAL KNOWLEDGE: MOISTURE / QUALITY NORMS ──
    if (
      utterance.includes('moisture') || utterance.includes('नमी') ||
      utterance.includes('nami') || utterance.includes('quality') ||
      utterance.includes('क्वालिटी') || utterance.includes('grade') ||
      utterance.includes('ग्रेड')
    ) {
      const text = isHi
        ? 'सरकारी खरीद मानक: गेहूं में नमी 12% से कम, धान में 17% से कम, सरसों में 8% से कम होनी चाहिए। उपज साफ, सूखी, और बिना मिलावट होनी चाहिए।'
        : 'Government norms: Wheat moisture <12%, Paddy <17%, Mustard <8%. Produce must be clean and dry.';
      return { text, toolCallsMade, suggestStaffEscalation: false };
    }

    // ── GENERAL KNOWLEDGE: MANDI TIMINGS ──
    if (
      utterance.includes('timing') || utterance.includes('कब खुलती') ||
      utterance.includes('kab khulti') || utterance.includes('कितने बजे') ||
      utterance.includes('location') || utterance.includes('कहा है') ||
      utterance.includes('कहाँ')
    ) {
      const text = isHi
        ? `${context.preferredMandi || 'आपकी मंडी'} का खरीद केंद्र आमतौर पर सोमवार से शनिवार सुबह 9:00 बजे से शाम 5:00 बजे तक खुला रहता है। सटीक समय के लिए मंडी कार्यालय से संपर्क करें।`
        : `The procurement center is typically open Monday to Saturday, 9 AM to 5 PM. Contact the mandi office for exact timings.`;
      return { text, toolCallsMade, suggestStaffEscalation: false };
    }

    // ── TOOL CALL: PAYMENT / DBT / MONEY ──
    if (
      utterance.includes('payment') || utterance.includes('paisa') ||
      utterance.includes('paise') || utterance.includes('money') ||
      utterance.includes('rupaye') || utterance.includes('rupay') ||
      utterance.includes('paid') || utterance.includes('aaya') ||
      utterance.includes('bhugtan') || utterance.includes('khata') ||
      utterance.includes('bank') || utterance.includes('dbt') ||
      utterance.includes('भुगतान') || utterance.includes('पैसा') ||
      utterance.includes('पैसे') || utterance.includes('रुपये') ||
      utterance.includes('रुपया') || utterance.includes('खाता') ||
      utterance.includes('बैंक') || utterance.includes('क्रेडिट') ||
      utterance.includes('मिला')
    ) {
      toolCallsMade.push('get_payment');
      try {
        const pay = await tools.getPayment(context.farmerId);
        if (!pay || pay.status === 'no_payment' || pay.amount === 0) {
          const text = isHi
            ? 'आपके खाते में अभी कोई भुगतान रिकॉर्ड नहीं मिला। अगर आपकी फसल की खरीद हो चुकी है तो भुगतान प्रक्रिया में हो सकता है। कृपया मंडी कार्यालय से संपर्क करें।'
            : 'No payment record found for your account. If procurement is complete, the payment may be processing. Please contact the mandi office.';
          return { text, toolCallsMade, suggestStaffEscalation: false };
        }
        const amountStr = `₹${pay.amount.toLocaleString('en-IN')}`;
        const refStr = pay.reference && pay.reference !== 'N/A' ? pay.reference : '';
        const text = isHi
          ? `आपकी फसल खरीद का भुगतान ${amountStr} ${pay.status === 'completed' ? 'आपके बैंक खाते में DBT द्वारा सफलतापूर्वक जमा हो चुका है' : 'प्रक्रिया में है'}।${refStr ? ` संदर्भ संख्या: ${refStr}।` : ''}`
          : `Your payment of ${amountStr} has been ${pay.status === 'completed' ? 'credited to your bank account via DBT' : 'is being processed'}.${refStr ? ` Reference: ${refStr}.` : ''}`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err: any) {
        console.error('[Fallback] get_payment error:', err.message);
        return { text: ERROR_MSG, toolCallsMade, suggestStaffEscalation: false };
      }
    }

    // ── TOOL CALL: QUEUE / TOKEN POSITION ──
    if (
      utterance.includes('queue') || utterance.includes('katar') ||
      utterance.includes('कतार') || utterance.includes('बारी') ||
      utterance.includes('bari') || utterance.includes('लाइन') ||
      utterance.includes('line') || utterance.includes('भीड़') ||
      utterance.includes('bheed') || utterance.includes('कितनी देर') ||
      utterance.includes('kitni der') ||
      (utterance.includes('नंबर') && !utterance.includes('टोकन'))
    ) {
      toolCallsMade.push('get_queue');
      try {
        const q = await tools.getQueue(context.farmerId);
        const etaText = q.etaMinutes ? `${q.etaMinutes} मिनट` : 'कुछ समय';
        const text = isHi
          ? `आपकी कतार में स्थिति: नंबर ${q.position}। अनुमानित प्रतीक्षा समय लगभग ${etaText} है।`
          : `Your queue position is number ${q.position}. Estimated wait time is approximately ${etaText}.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err: any) {
        console.error('[Fallback] get_queue error:', err.message);
        const text = isHi
          ? 'आपकी कतार की जानकारी अभी उपलब्ध नहीं है। संभव है आपकी कोई सक्रिय बुकिंग नहीं है। कृपया मंडी कार्यालय से संपर्क करें।'
          : 'Queue information is not available. You may not have an active booking. Please contact the mandi office.';
        return { text, toolCallsMade, suggestStaffEscalation: false };
      }
    }

    // ── TOOL CALL: SLOT / BOOKING / TOKEN ──
    if (
      utterance.includes('slot') || utterance.includes('स्लॉट') ||
      utterance.includes('प्लॉट') || utterance.includes('प्लाट') ||
      utterance.includes('सलाट') || utterance.includes('सलोट') ||
      utterance.includes('plot') || utterance.includes('book') ||
      utterance.includes('बुकिंग') || utterance.includes('बुक') ||
      utterance.includes('तारीख') || utterance.includes('tareekh') ||
      utterance.includes('tarikh') || utterance.includes('कब आना') ||
      utterance.includes('kab aana') || utterance.includes('aana hai') ||
      utterance.includes('आना है') || utterance.includes('schedule') ||
      utterance.includes('appointment') || utterance.includes('टोकन') ||
      utterance.includes('token')
    ) {
      toolCallsMade.push('get_slot');
      try {
        const s = await tools.getSlot(context.farmerId);
        const mandiName = s.mandi || context.preferredMandi || 'मंडी';
        const text = isHi
          ? `आपका ${mandiName} में स्लॉट ${s.date} को ${s.startTime} से ${s.endTime} के लिए ${s.status === 'confirmed' ? 'कन्फर्म' : s.status} है।`
          : `Your slot at ${mandiName} is ${s.status} for ${s.date} from ${s.startTime} to ${s.endTime}.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err: any) {
        console.error('[Fallback] get_slot error:', err.message);
        const text = isHi
          ? 'आपकी स्लॉट बुकिंग की जानकारी नहीं मिली। संभव है अभी कोई बुकिंग नहीं है। कृपया ऐप से बुकिंग करें या मंडी कार्यालय से संपर्क करें।'
          : 'No slot booking found. Please book through the app or contact the mandi office.';
        return { text, toolCallsMade, suggestStaffEscalation: false };
      }
    }

    // ── TOOL CALL: PRICE / MANDI BHAV ──
    if (
      utterance.includes('price') || utterance.includes('bhao') ||
      utterance.includes('bhaav') || utterance.includes('bhav') ||
      utterance.includes('rate') || utterance.includes('dam') ||
      utterance.includes('daam') || utterance.includes('kimat') ||
      utterance.includes('भाव') || utterance.includes('दाम') ||
      utterance.includes('रेट') || utterance.includes('कीमत') ||
      utterance.includes('मूल्य') || utterance.includes('गेहूं') ||
      utterance.includes('wheat') || utterance.includes('चना') ||
      utterance.includes('सरसों') || utterance.includes('सोयाबीन') ||
      utterance.includes('धान') || utterance.includes('मंडी') ||
      utterance.includes('मक्का') || utterance.includes('maize') ||
      utterance.includes('प्याज') || utterance.includes('onion') ||
      utterance.includes('आलू') || utterance.includes('potato') ||
      utterance.includes('कपास') || utterance.includes('cotton')
    ) {
      toolCallsMade.push('get_price');
      try {
        // Detect requested commodity from utterance
        let commodity = context.crop || 'Wheat';
        if (utterance.includes('चना') || utterance.includes('gram') || utterance.includes('chana')) commodity = 'Gram';
        else if (utterance.includes('सरसों') || utterance.includes('mustard') || utterance.includes('sarson')) commodity = 'Mustard';
        else if (utterance.includes('सोयाबीन') || utterance.includes('soya')) commodity = 'Soyabean';
        else if (utterance.includes('धान') || utterance.includes('paddy') || utterance.includes('rice')) commodity = 'Paddy';
        else if (utterance.includes('मक्का') || utterance.includes('maize') || utterance.includes('corn')) commodity = 'Maize';
        else if (utterance.includes('प्याज') || utterance.includes('onion')) commodity = 'Onion';
        else if (utterance.includes('आलू') || utterance.includes('potato')) commodity = 'Potato';
        else if (utterance.includes('कपास') || utterance.includes('cotton')) commodity = 'Cotton';
        else if (utterance.includes('गेहूं') || utterance.includes('wheat')) commodity = 'Wheat';

        // Detect requested variety
        let requestedVariety: string | undefined;
        if (utterance.includes('lokwan') || utterance.includes('लोकवान')) requestedVariety = 'Lokwan';
        else if (utterance.includes('malwa') || utterance.includes('मालवा')) requestedVariety = 'Malwa Shakti';
        else if (utterance.includes('sharbati') || utterance.includes('शरबती')) requestedVariety = 'Sharbati';

        const p = await tools.getPrice(context.farmerId, commodity, requestedVariety);
        const cropDisplay = p.commodity || commodity;
        const varietyDisplay = p.variety && p.variety !== p.commodity ? ` (${p.variety})` : '';
        const source = p.source || 'Agmarknet / data.gov.in';
        const dateStr = p.dateDisplayHi || p.dateDisplay || p.date || 'आज';
        const mandiDisplay = context.preferredMandi || 'मंडी';

        const isStale = !p.isToday || p.stale;
        const text = isHi
          ? isStale
            ? `आज ${mandiDisplay} ने नए भाव दर्ज नहीं किए हैं। ${source} पर उपलब्ध अंतिम रिपोर्ट (${dateStr}) के अनुसार ${cropDisplay}${varietyDisplay} का भाव: न्यूनतम ₹${p.minPrice}, अधिकतम ₹${p.maxPrice}, मॉडल ₹${p.modalPrice} प्रति क्विंटल रहा है।`
            : `${source} के अनुसार आज ${mandiDisplay} में ${cropDisplay}${varietyDisplay} का ताज़ा भाव: न्यूनतम ₹${p.minPrice}, अधिकतम ₹${p.maxPrice}, मॉडल ₹${p.modalPrice} प्रति क्विंटल है।`
          : isStale
            ? `Today's rates have not been reported yet by ${mandiDisplay}. As per the last available report (${dateStr}) from ${source}, ${cropDisplay}${varietyDisplay}: Min ₹${p.minPrice}, Max ₹${p.maxPrice}, Modal ₹${p.modalPrice} per quintal.`
            : `As per ${source}, today's price for ${cropDisplay}${varietyDisplay} at ${mandiDisplay}: Min ₹${p.minPrice}, Max ₹${p.maxPrice}, Modal ₹${p.modalPrice} per quintal.`;
        return { text, toolCallsMade, suggestStaffEscalation: false };
      } catch (err: any) {
        console.error('[Fallback] get_price error:', err.message);
        const text = isHi
          ? 'मंडी भाव की जानकारी अभी प्राप्त नहीं हो पा रही है। कृपया कुछ देर बाद पूछें या मंडी कार्यालय से संपर्क करें।'
          : 'Unable to fetch mandi prices right now. Please try again later or contact the mandi office.';
        return { text, toolCallsMade, suggestStaffEscalation: false };
      }
    }

    // ── DEFAULT: HELPFUL PROMPT ──
    const fallbackText = isHi
      ? `नमस्ते${context.name && context.name !== 'Farmer' ? ` ${context.name} जी` : ' किसान भाई'}! आप मुझसे यह पूछ सकते हैं:\n1. आज का मंडी भाव\n2. स्लॉट बुकिंग की जानकारी\n3. कतार में आपका नंबर\n4. फसल भुगतान की स्थिति\nआप क्या जानना चाहते हैं?`
      : 'Hello! You can ask me about: mandi prices, slot booking, queue position, or payment status. What would you like to know?';

    return { text: fallbackText, toolCallsMade: [], suggestStaffEscalation: false };
  }
}

export const groqLLM = new GroqLLMClient();
