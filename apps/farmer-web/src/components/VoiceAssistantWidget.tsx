'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VoiceTurnResult {
  reply: string;
  tool_calls: string[];
  context: {
    farmerId: string;
    name: string;
    language: string;
    preferredMandi: string;
    crop: string;
  };
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tools?: string[];
  time: string;
}

export default function VoiceAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'नमस्ते किसान साथी! मैं किसान कॉल एआई सहायक हूँ। आप मुझसे स्लॉट बुकिंग, लाइव कतार नंबर, मंडी भाव या भुगतान की स्थिति के बारे में बोलकर पूछ सकते हैं।',
      time: 'Just now',
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (event.results[0].isFinal) {
            handleSendUtterance(currentTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[SpeechRecognition Error]', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Stop any ongoing TTS playback before listening
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      setTranscript('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        } else {
          alert('Speech Recognition is not supported in this browser. Please use the text input below.');
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendUtterance = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    setManualInput('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/voice-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utterance: trimmed,
          farmer_id: 'd16486e6-0b85-4d03-9778-11498d8e7523',
          language,
        }),
      });

      const data: VoiceTurnResult = await res.json();
      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'जानकारी प्राप्त नहीं हो सकी।',
        tools: data.tool_calls || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(assistantMsg.text);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'सर्वर से संपर्क करने में समस्या हुई। कृपया पुनः प्रयास करें।',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-4 md:bottom-6 md:left-auto md:right-56 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-emerald-400/30"
          title="Open KisanCall AI Voice Loop"
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-200"></span>
          </span>
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">
            KisanCall AI Voice
          </span>
        </button>
      </div>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-96 h-full sm:h-[580px] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center">
                <span className="text-base">🎙️</span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">KisanCall AI Voice Loop</h3>
                <p className="text-[11px] text-emerald-300 font-medium">Live Groq LLM & Tools</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="text-[11px] font-bold px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                title="Switch Language"
              >
                {language === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.tools && m.tools.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.tools.map((t, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          ⚡ {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-2 text-xs text-slate-500 bg-white rounded-xl border border-slate-200 w-fit">
                <span className="animate-spin text-emerald-600">⚙️</span>
                <span>Groq AI Tool Calling in progress...</span>
              </div>
            )}
          </div>

          {/* Active Utterance Banner */}
          {transcript && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-3 py-1.5 text-xs text-emerald-800 flex items-center gap-2">
              <span className="animate-pulse">🔴</span>
              <span className="truncate">"{transcript}"</span>
            </div>
          )}

          {/* Footer Controls & Speech Mic */}
          <div className="p-3 bg-white border-t border-slate-200 space-y-2.5">
            {/* Mic Center Action */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleListening}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-bounce scale-110 ring-4 ring-rose-200'
                    : isSpeaking
                    ? 'bg-teal-600 text-white ring-4 ring-teal-200 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
                }`}
                title={isListening ? 'Stop Listening' : 'Click to Speak (Web Speech API)'}
              >
                {isListening ? (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 font-medium">
              {isListening
                ? '🎙️ Listening... बोलिए (उदा: "मेरा स्लॉट कब है?")'
                : isSpeaking
                ? '🔊 AI बोल रहा है...'
                : 'Click mic to speak or type query below'}
            </p>

            {/* Quick Text Input for fallback / testing */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendUtterance(manualInput);
              }}
              className="flex gap-1.5"
            >
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'प्रश्न लिखें (उदा: पेमेंट आया क्या)...'
                    : 'Type query (e.g. what is wheat price)...'
                }
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || isProcessing}
                className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
