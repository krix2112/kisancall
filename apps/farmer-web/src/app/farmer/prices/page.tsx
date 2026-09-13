'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FarmerHeader from '@/components/farmer/FarmerHeader';

interface MandiPriceRecord {
  cropName: string;
  hindiCrop: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  govtMsp: number;
  yesterdayPrice: number;
  updatedTime: string;
  emoji: string;
}

const CROPS_DATA: MandiPriceRecord[] = [
  {
    cropName: 'Wheat',
    hindiCrop: 'गेहूँ',
    variety: 'Lok-1 (शरबती)',
    mandiName: 'सीहोर मंडी (Sehore Mandi)',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    modalPrice: 2450,
    minPrice: 2380,
    maxPrice: 2520,
    govtMsp: 2400,
    yesterdayPrice: 2420,
    updatedTime: '10:30 AM आज',
    emoji: '🌾',
  },
  {
    cropName: 'Gram / Chana',
    hindiCrop: 'चना',
    variety: 'Desi Chana (देसी)',
    mandiName: 'इंदौर मंडी (Indore Mandi)',
    district: 'Indore',
    state: 'Madhya Pradesh',
    modalPrice: 5650,
    minPrice: 5400,
    maxPrice: 5800,
    govtMsp: 5440,
    yesterdayPrice: 5600,
    updatedTime: '09:45 AM आज',
    emoji: '🌱',
  },
  {
    cropName: 'Mustard',
    hindiCrop: 'सरसों',
    variety: 'Pusa Bold (सरसों)',
    mandiName: 'करनाल मंडी (Karnal Central)',
    district: 'Karnal',
    state: 'Haryana',
    modalPrice: 5950,
    minPrice: 5750,
    maxPrice: 6120,
    govtMsp: 5650,
    yesterdayPrice: 5900,
    updatedTime: '11:15 AM आज',
    emoji: '🌻',
  },
  {
    cropName: 'Soyabean',
    hindiCrop: 'सोयाबीन',
    variety: 'JS-9560 (सोया)',
    mandiName: 'उज्जैन मंडी (Ujjain Mandi)',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    modalPrice: 4720,
    minPrice: 4500,
    maxPrice: 4890,
    govtMsp: 4600,
    yesterdayPrice: 4680,
    updatedTime: '10:00 AM आज',
    emoji: '🌿',
  },
];

export default function FarmerPricesPage() {
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [showCropModal, setShowCropModal] = useState(false);

  const activeCrop = CROPS_DATA[selectedCropIndex];
  const mspDiff = activeCrop.modalPrice - activeCrop.govtMsp;
  const mspPercent = ((mspDiff / activeCrop.govtMsp) * 100).toFixed(2);
  const dailyDiff = activeCrop.modalPrice - activeCrop.yesterdayPrice;

  return (
    <div className="min-h-screen bg-[#f7fbf1] text-slate-900 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <FarmerHeader
        title="मंडी भाव / Mandi Price"
        subtitle="आज का खरीद मूल्य • Today's Procurement Rates"
        showBack={true}
        audioText={`आज ${activeCrop.hindiCrop} का मंडी भाव ₹${activeCrop.modalPrice} प्रति क्विंटल है, जो सरकारी एमएसपी से ₹${mspDiff} अधिक है।`}
      />

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col gap-3.5">
        
        {/* Crop & Mandi Context Chip */}
        <div className="bg-white rounded-xl p-3 border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0 border border-emerald-200/60">
              {activeCrop.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm">
                  {activeCrop.hindiCrop} / {activeCrop.cropName}
                </span>
                <span className="text-[11px] px-1.5 py-0.5 rounded font-medium bg-stone-100 text-stone-700">
                  {activeCrop.variety}
                </span>
              </div>
              <div className="flex items-center text-[12px] text-stone-600 mt-0.5 gap-1">
                <svg className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-stone-700">{activeCrop.mandiName}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCropModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-[#00450d] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            type="button"
          >
            बदलें / Change
          </button>
        </div>

        {/* Primary Hero Card: Today's Mandi Price */}
        <div className="bg-gradient-to-b from-white to-[#f2f7ec] rounded-2xl p-4 sm:p-5 border border-emerald-900/15 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-200/70 pb-2.5 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00450d] text-white text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              आज का भाव / Today&apos;s Mandi Price
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
              <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{activeCrop.updatedTime}</span>
            </div>
          </div>

          <div className="mt-1 flex flex-col items-start">
            <span className="text-xs font-semibold text-stone-600 tracking-tight">वर्तमान खरीद दर (Current Modal Price)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00450d] tracking-tight leading-none font-mono">
                ₹{activeCrop.modalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base font-bold text-stone-700">/ क्विंटल (per quintal)</span>
            </div>
          </div>

          {/* Quick Comparison Callout with MSP */}
          <div className="mt-3.5 pt-3 border-t border-dashed border-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-emerald-900">
                    MSP से ₹{mspDiff > 0 ? `${mspDiff} अधिक` : `${Math.abs(mspDiff)} कम`}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700">
                    ({mspDiff >= 0 ? `+₹${mspDiff}` : `-₹${Math.abs(mspDiff)}`} vs MSP)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-none mt-0.5 font-hindi">
                  {mspDiff >= 0 ? 'सरकारी समर्थन मूल्य से बेहतर भाव' : 'न्यूनतम समर्थन मूल्य'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {mspDiff >= 0 ? `+${mspPercent}%` : `${mspPercent}%`}
            </span>
          </div>
        </div>

        {/* Min / Modal / Max Price Range Card */}
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2.5">
            <span className="flex items-center gap-1.5">
              <span>📊</span>
              <span>दैनिक मूल्य सीमा / Today&apos;s Price Range</span>
            </span>
            <span className="text-[11px] text-stone-500 font-semibold">FAQ Grade Pass</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="block text-[10px] font-bold text-stone-500 uppercase">न्यूनतम (Min)</span>
              <strong className="block text-sm font-bold text-stone-800 mt-0.5 font-mono">
                ₹{activeCrop.minPrice}
              </strong>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300">
              <span className="block text-[10px] font-bold text-emerald-800 uppercase">औसत (Modal)</span>
              <strong className="block text-sm font-extrabold text-[#00450d] mt-0.5 font-mono">
                ₹{activeCrop.modalPrice}
              </strong>
            </div>
            <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
              <span className="block text-[10px] font-bold text-stone-500 uppercase">अधिकतम (Max)</span>
              <strong className="block text-sm font-bold text-stone-800 mt-0.5 font-mono">
                ₹{activeCrop.maxPrice}
              </strong>
            </div>
          </div>
        </div>

        {/* Price Comparison Table vs MSP */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚖️</span>
              <span>मूल्य तुलना / Price Comparison</span>
            </h2>
            <span className="text-[11px] font-semibold text-stone-500">2025–26 सत्र</span>
          </div>

          <div className="space-y-2.5">
            {/* Mandi Rate */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f1f5eb] border border-emerald-200/80">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00450d]"></div>
                <div>
                  <div className="text-xs font-bold text-slate-900">मंडी भाव (Mandi Rate)</div>
                  <div className="text-[11px] text-stone-600 font-hindi">आज केंद्र पर लागू औसत दर</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#00450d] font-mono">₹{activeCrop.modalPrice}</div>
                <div className="text-[10px] text-stone-500">प्रति क्विंटल</div>
              </div>
            </div>

            {/* Govt MSP */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                <div>
                  <div className="text-xs font-bold text-slate-800">सरकारी समर्थन मूल्य (Govt MSP)</div>
                  <div className="text-[11px] text-stone-600 font-hindi">केंद्र सरकार द्वारा निर्धारित न्यूनतम दर</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-stone-800 font-mono">₹{activeCrop.govtMsp}</div>
                <div className="text-[10px] text-stone-500">प्रति क्विंटल</div>
              </div>
            </div>

            {/* Difference */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>अंतर / Difference:</span>
              </div>
              <div className="text-right flex items-center gap-1">
                <span className="text-xs font-extrabold text-emerald-900 font-mono">
                  +₹{mspDiff} / क्विंटल (Above MSP)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Price Trend */}
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
            <span className="flex items-center gap-1.5">
              <span>📈</span>
              <span>हालिया बदलाव / Recent Trend</span>
            </span>
            <span className="text-[11px] font-medium text-stone-500">कल की तुलना में (vs Yesterday)</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
              <span className="block text-[10px] font-semibold text-stone-600">कल का भाव</span>
              <span className="block text-xs font-bold text-stone-800 mt-0.5 font-mono">₹{activeCrop.yesterdayPrice}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#f1f5eb] border border-emerald-200">
              <span className="block text-[10px] font-bold text-emerald-800">आज का भाव</span>
              <span className="block text-xs font-extrabold text-[#00450d] mt-0.5 font-mono">₹{activeCrop.modalPrice}</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="block text-[10px] font-semibold text-emerald-800">बदलाव (Change)</span>
              <span className="block text-xs font-bold text-emerald-800 mt-0.5 font-mono">
                {dailyDiff >= 0 ? `+₹${dailyDiff} ↗` : `-₹${Math.abs(dailyDiff)} ↘`}
              </span>
            </div>
          </div>
        </div>

        {/* Helpful Explanation Card */}
        <div className="bg-[#f7fbf1] border border-emerald-900/20 rounded-xl p-3 flex gap-2.5 items-start">
          <div className="w-5 h-5 rounded-full bg-[#00450d] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">
            i
          </div>
          <div className="text-[11px] text-stone-700 leading-relaxed font-hindi">
            <strong className="font-bold text-slate-900 block text-xs">एमएसपी (MSP) क्या है? / What is MSP?</strong>
            MSP सरकार द्वारा गारंटीकृत न्यूनतम मूल्य है। यदि उपज की गुणवत्ता अच्छी है, तो मंडी में भाव MSP से अधिक भी प्राप्त हो सकता है। तौल और नमी के आधार पर अंतिम J-Form पर्ची तैयार होती है।
          </div>
        </div>

        {/* Trust Source */}
        <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span>✅</span>
            <span>स्रोत: राज्य कृषि उपज मंडी समिति व Agmarknet</span>
          </div>
          <span className="text-emerald-800 font-bold">Verified API</span>
        </div>

        {/* Action: Book Slot or Call KisanCall */}
        <div className="mt-1 space-y-2">
          <Link
            href="/farmer"
            className="w-full bg-[#00450d] hover:bg-[#134717] text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-lg">
                📅
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">मंडी में स्लॉट बुक करें</div>
                <div className="text-[10px] text-emerald-200 font-hindi">इस भाव पर अपनी उपज लाने का समय चुनें</div>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-md text-white">
              बुक करें →
            </span>
          </Link>

          <a
            href="tel:18001801551"
            className="w-full bg-[#202720] hover:bg-[#151c15] text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-sm transition-colors active:scale-[0.99]"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-base">
                📞
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">KisanCall को कॉल करें</div>
                <div className="text-[10px] text-stone-300 font-hindi">भाव, स्लॉट या खरीद की जानकारी फोन पर पूछें</div>
              </div>
            </div>
            <span className="text-xs font-semibold bg-white/15 px-2.5 py-1 rounded-md text-white font-mono">
              1800-180-1551
            </span>
          </a>
        </div>

      </main>

      {/* Crop Selector Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-slate-900">फसल व मंडी चुनें (Select Crop &amp; Mandi)</h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold"
                type="button"
              >
                ✕
              </button>
            </div>
            <div className="py-3 space-y-2">
              {CROPS_DATA.map((crop, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCropIndex(idx);
                    setShowCropModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    selectedCropIndex === idx
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crop.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        {crop.hindiCrop} ({crop.cropName})
                      </div>
                      <div className="text-xs text-stone-600">{crop.mandiName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#00450d] font-mono">₹{crop.modalPrice}</div>
                    <div className="text-[10px] text-stone-500">/ क्विंटल</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
