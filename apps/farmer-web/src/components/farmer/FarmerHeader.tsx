'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FarmerHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  audioText?: string;
}

export default function FarmerHeader({
  title = 'KisanCall',
  subtitle = 'कृषि सेवा पोर्टल • Govt Mandi Seva',
  showBack = false,
  onBack,
  audioText = 'किसान कॉल सेवा: आपकी मंडी की ताजा स्थिति, भाव और भुगतान विवरण यहां उपलब्ध हैं।',
}: FarmerHeaderProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(audioText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#f7fbf1]/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {showBack ? (
              <button
                onClick={onBack || (() => window.history.back())}
                className="min-h-[44px] min-w-[44px] rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition-all cursor-pointer shadow-xs flex-shrink-0"
                title="पीछे जाएं (Go Back)"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <Link href="/farmer" className="flex-shrink-0 transition-transform hover:scale-105 min-h-[44px] flex items-center">
                <img
                  src="/logo.png"
                  alt="KisanCall"
                  className="h-10 w-auto object-contain rounded-md bg-white p-0.5 border border-stone-200 shadow-2xs"
                />
              </Link>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">{title}</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  सत्यापित
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-600 mt-0.5">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Listen Audio Voice Button */}
            <button
              onClick={handlePlayAudio}
              className={`min-h-[44px] px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-emerald-700 text-white animate-pulse'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300/60 active:scale-95'
              }`}
              type="button"
              title="ऑडियो में सुनें (Listen in Hindi)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5 9.77l-4.5-4h-3v8h3l4.5 4v-8zm5 0c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <span>{isPlayingAudio ? 'चल रहा है...' : 'सुनें'}</span>
            </button>

            {/* Helpline Modal Trigger */}
            <button
              onClick={() => setShowVoiceModal(true)}
              className="min-h-[44px] min-w-[44px] rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-sm transition-colors cursor-pointer"
              title="KisanCall हेल्पलाइन (1800-180-1551)"
              type="button"
            >
              📞
            </button>

            {/* Farmer Profile Avatar */}
            <Link
              href="/farmer/profile"
              className="min-h-[44px] min-w-[44px] rounded-full bg-[#00450d] text-white flex items-center justify-center text-xs font-bold shadow-sm hover:ring-2 hover:ring-emerald-600 transition-all cursor-pointer"
              title="किसान प्रोफ़ाइल"
            >
              रK
            </Link>
          </div>
        </div>
      </header>

      {/* Voice Helpline Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-900 mx-auto flex items-center justify-center text-2xl">
              📞
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">KisanCall निःशुल्क हेल्पलाइन</h3>
              <p className="text-xs text-stone-600 mt-1 font-hindi">
                24×7 किसी भी कीपैड फोन से हिंदी, पंजाबी, हरियाणवी में बात करें।
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold block uppercase tracking-wider">Toll-Free Number</span>
              <a href="tel:18001801551" className="text-2xl font-black text-emerald-950 font-mono tracking-tight hover:underline">
                1800-180-1551
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:18001801551"
                className="flex-1 py-3 rounded-xl bg-[#00450d] hover:bg-[#134717] text-white font-bold text-sm shadow transition-colors text-center"
              >
                अभी कॉल करें (Call Now)
              </a>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors cursor-pointer"
                type="button"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
