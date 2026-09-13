'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FarmerHeader from '@/components/farmer/FarmerHeader';

export default function FarmerSlipsPage() {
  const [slipState, setSlipState] = useState<'verified' | 'processing' | 'attention'>('verified');
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedProof, setCopiedProof] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = (val: string, type: 'tx' | 'proof') => {
    navigator.clipboard.writeText(val);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedProof(true);
      setTimeout(() => setCopiedProof(false), 2000);
    }
  };

  const handleDownloadSlip = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f7fbf1] text-slate-900 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <FarmerHeader
        title="लेन-देन प्रमाण"
        subtitle="Transaction Proof • आधिकारिक खरीद रसीद (J-Form)"
        showBack={true}
        audioText="आपकी गेहूं खरीद पर्ची संख्या MP-SHR-2026-901 सफलतापूर्वक जारी हो चुकी है। कुल शुद्ध राशि 1 लाख 11 हजार 475 रुपये है।"
      />

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col gap-3.5">
        
        {/* State Toggle Selector (Pill Switcher) */}
        <div className="bg-[#e8ede2] p-1 rounded-full flex items-center justify-between shadow-inner">
          <button
            onClick={() => setSlipState('verified')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              slipState === 'verified'
                ? 'bg-[#00450d] text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            <span>✓</span>
            <span>सत्यापित</span>
          </button>
          <button
            onClick={() => setSlipState('processing')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              slipState === 'processing'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            <span>⏳</span>
            <span>प्रक्रिया में</span>
          </button>
          <button
            onClick={() => setSlipState('attention')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              slipState === 'attention'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            <span>⚠️</span>
            <span>जांच आवश्यक</span>
          </button>
        </div>

        {/* Dynamic Hero Status Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200/80">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                slipState === 'verified'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : slipState === 'processing'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              <span>{slipState === 'verified' ? '✓' : slipState === 'processing' ? '⏳' : '⚠️'}</span>
              <span>
                {slipState === 'verified'
                  ? 'प्रमाणित खरीद रिकॉर्ड • Verified'
                  : slipState === 'processing'
                  ? 'प्रक्रिया जारी • Processing'
                  : 'सत्यापन लंबित • Action Needed'}
              </span>
            </span>
            <span className="text-xs font-bold font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
              टोकन: K-104
            </span>
          </div>

          <p className="text-xs text-stone-600 mb-3 font-hindi">
            {slipState === 'verified'
              ? 'आपकी फसल खरीद का डिजिटल प्रमाण सुरक्षित रूप से दर्ज हो चुका है। डीबीटी भुगतान बैंक खाते में भेज दिया गया है।'
              : slipState === 'processing'
              ? 'तौल पर्ची बन चुकी है, डिजिटल हस्ताक्षर और PFMS क्लीयरेंस कतार में है।'
              : 'बैंक खाता सत्यापन में सुधार की आवश्यकता है। कृपया सहायता केंद्र से संपर्क करें।'}
          </p>

          {/* Core Metric */}
          <div className="bg-stone-50 rounded-xl p-3.5 flex flex-col justify-center items-center text-center border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
              अंतिम देय राशि / Net Settled Amount
            </span>
            <div className="flex items-baseline gap-1 text-[#00450d]">
              <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                ₹ 1,11,475
              </span>
            </div>
            <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[11px] font-bold">
              <span>🏦</span>
              <span>भुगतान पूर्ण / Direct PFMS DBT</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-2 text-stone-500 text-xs border-t border-stone-100">
            <span className="flex items-center gap-1 font-mono">
              📅 05 Sep 2026 • 11:42 AM
            </span>
            <span className="flex items-center gap-1 text-[#00450d] font-bold">
              📍 सीहोर मंडी (MP)
            </span>
          </div>
        </div>

        {/* Attention Alert Banner if Attention State */}
        {slipState === 'attention' && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-950 rounded-2xl animate-fadeIn space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold">बैंक विवरण पुष्टि आवश्यक</h4>
                <p className="text-[11px] text-rose-800 font-hindi mt-0.5">
                  आपका आधार कार्ड खाता संख्या SBI •••• 4821 से लिंक है, लेकिन NPCI डीबीटी मैपर सत्यापन लंबित है।
                </p>
              </div>
            </div>
            <a
              href="tel:18001801551"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow"
            >
              <span>📞 नोडल अधिकारी से बात करें</span>
            </a>
          </div>
        )}

        {/* Official Procurement Slip Card (Receipt Format) */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Slip Header Ribbon */}
          <div className="bg-[#00450d] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg">
                📄
              </div>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white">
                  मंडी खरीद पर्ची (J-Form)
                </h2>
                <p className="text-[10px] text-emerald-200 font-mono">
                  MP e-Uparjan • क्रय संख्या: MP-SHR-2026-901
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white text-[#00450d] font-black text-xs rounded-md shadow-xs">
              PASS
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Farmer & Variety Row */}
            <div className="bg-stone-50 p-3 rounded-xl flex items-center justify-between text-xs border border-stone-200/70">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">किसान का नाम / Farmer</span>
                <strong className="text-slate-900 text-xs block mt-0.5">रमेश कुमार (Ramesh Kumar)</strong>
                <span className="text-emerald-700 font-mono text-[10px] block font-semibold">आधार प्रमाणित • समग्र: 10839218</span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">फसल / Variety</span>
                <strong className="text-slate-900 text-xs block mt-0.5">गेहूँ (Lok-1)</strong>
                <span className="text-stone-600 text-[10px] block">Grade: FAQ-A Pass</span>
              </div>
            </div>

            {/* Itemized Breakdown Table */}
            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>तौला गया वजन (Net Weight)</span>
                <span className="font-bold text-slate-900 font-mono">45.50 क्विंटल (4,550 kg)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>सरकारी समर्थन मूल्य (MSP)</span>
                <span className="font-mono">₹ 2,400 / क्विंटल</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>लागू खरीद दर (Applied Rate)</span>
                <div className="text-right">
                  <span className="font-bold text-[#00450d] font-mono">₹ 2,450 / क्विंटल</span>
                  <span className="text-[10px] text-emerald-700 block font-hindi">(+₹50 मंडी बोनस)</span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>कुल उपज राशि (Gross Total)</span>
                <span className="font-mono">₹ 1,11,475.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>मंडी शुल्क व तलाई कटौती (Charges)</span>
                <span className="text-emerald-700 font-bold">₹ 0.00 (शत-प्रतिशत छूट)</span>
              </div>

              {/* Total Highlight Row */}
              <div className="bg-[#f1f5eb] p-3 rounded-xl flex justify-between items-center mt-2 border border-emerald-200">
                <span className="font-extrabold text-slate-900 text-xs">अंतिम भुगतान राशि (Net)</span>
                <span className="text-lg font-black text-[#00450d] font-mono">₹ 1,11,475</span>
              </div>
            </div>

            {/* Transaction ID tile */}
            <div className="bg-stone-50 p-3 rounded-xl space-y-2 border border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block font-bold">लेन-देन पहचान (Transaction ID)</span>
                  <span className="font-mono text-slate-900 font-bold text-xs">KC-PAY-2026-89412</span>
                </div>
                <button
                  onClick={() => handleCopy('KC-PAY-2026-89412', 'tx')}
                  className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-bold text-[#00450d] transition-all cursor-pointer shadow-2xs"
                  type="button"
                >
                  {copiedTx ? '✓ कॉपीड' : 'कॉपी'}
                </button>
              </div>
              <div className="flex justify-between text-stone-600 text-[11px] pt-1 border-t border-stone-200">
                <span>PFMS संदर्भ: <strong className="text-slate-900 font-mono">PFMS-98240184</strong></span>
                <span>खाता: <strong className="text-slate-900 font-mono">SBI •••• 4821</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Verification & QR Section */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🛡️</span>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              डिजिटल सत्यापन एवं ब्लॉकचेन प्रमाण
            </h3>
          </div>
          <p className="text-xs text-stone-600 mb-3 font-hindi">
            यह खरीद दस्तावेज राष्ट्रीय कृषि सूचना तंत्र व Polygon Amoy लेजर पर अपरिवर्तनीय रूप से दर्ज है।
          </p>

          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
            {/* SVG QR Code */}
            <div className="w-24 h-24 bg-white p-2 rounded-lg flex-shrink-0 flex items-center justify-center shadow-xs border border-stone-200">
              <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                <rect height="28" rx="2" width="28" x="0" y="0"></rect>
                <rect fill="#ffffff" height="20" width="20" x="4" y="4"></rect>
                <rect height="12" width="12" x="8" y="8"></rect>
                <rect height="28" rx="2" width="28" x="72" y="0"></rect>
                <rect fill="#ffffff" height="20" width="20" x="76" y="4"></rect>
                <rect height="12" width="12" x="80" y="8"></rect>
                <rect height="28" rx="2" width="28" x="0" y="72"></rect>
                <rect fill="#ffffff" height="20" width="20" x="4" y="76"></rect>
                <rect height="12" width="12" x="8" y="80"></rect>
                <rect height="8" width="8" x="36" y="6"></rect>
                <rect height="6" width="12" x="52" y="6"></rect>
                <rect height="8" width="16" x="36" y="20"></rect>
                <rect height="6" width="16" x="6" y="36"></rect>
                <rect height="10" width="10" x="28" y="36"></rect>
                <rect height="8" width="8" x="46" y="34"></rect>
                <rect height="6" width="14" x="62" y="36"></rect>
                <rect height="10" width="10" x="84" y="36"></rect>
                <rect height="12" width="10" x="36" y="52"></rect>
                <rect height="8" width="14" x="54" y="48"></rect>
                <rect height="12" width="16" x="76" y="52"></rect>
                <rect height="20" width="8" x="36" y="72"></rect>
                <rect height="8" width="18" x="52" y="72"></rect>
                <rect height="8" width="12" x="52" y="86"></rect>
                <rect height="18" width="14" x="78" y="74"></rect>
                <circle cx="50" cy="50" fill="#00450d" r="7"></circle>
              </svg>
            </div>

            <div className="flex flex-col justify-between text-xs flex-1">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold block">प्रमाण आईडी / Proof ID</span>
                <span className="font-mono text-[#00450d] font-bold break-all text-[11px]">
                  AGC-2026-8F3A-91C2
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <span>🔒</span>
                  <span>अपरिवर्तनीय (Immutable)</span>
                </span>
                <button
                  onClick={() => handleCopy('AGC-2026-8F3A-91C2', 'proof')}
                  className="px-2 py-0.5 bg-white border border-stone-300 rounded text-[10px] font-bold text-stone-700"
                  type="button"
                >
                  {copiedProof ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Verification Progressive Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
            <span>⛓️</span>
            <span>प्रमाण श्रृंखला (5-Step Audit Chain)</span>
          </h3>

          <div className="space-y-3 pl-1 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#00450d] text-white flex items-center justify-center font-bold text-[10px]">1</span>
              <div>
                <strong className="text-slate-900 block">धर्मकांटा डिजिटल तौल (WB-KARNAL-04)</strong>
                <span className="text-[10px] text-stone-500">Gross: 78.40 Qtl | Tare: 29.80 Qtl | Net: 45.50 Qtl</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#00450d] text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <div>
                <strong className="text-slate-900 block">नमी व गुणवत्ता परीक्षण (Moisture 10.4%)</strong>
                <span className="text-[10px] text-stone-500">FAQ-A Grade Pass • Mandi Inspector Approved</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#00450d] text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <div>
                <strong className="text-slate-900 block">ई-उपार्जन डिजिटल J-Form हस्ताक्षर</strong>
                <span className="text-[10px] text-stone-500">DSC Cryptographic Signature Attached</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#00450d] text-white flex items-center justify-center font-bold text-[10px]">4</span>
              <div>
                <strong className="text-slate-900 block">PFMS DBT भुगतान बैच #4412</strong>
                <span className="text-[10px] text-stone-500">Aadhaar Payment Bridge Reference Mapped</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">5</span>
              <div>
                <strong className="text-emerald-900 block">Polygon Amoy ब्लॉकचेन एंकरिंग</strong>
                <span className="text-[10px] text-emerald-700">Tx: 0x9f82...104a • Block #14920412</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleDownloadSlip}
            className="w-full bg-[#00450d] hover:bg-[#134717] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 shadow-sm font-bold text-xs transition-colors cursor-pointer"
            type="button"
          >
            <span>📥 {downloading ? 'तैयार हो रहा है...' : 'आधिकारिक पर्ची डाउनलोड / प्रिंट करें (Print J-Form)'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'KisanCall J-Form Slip',
                  text: 'मेरी गेहूं खरीद रसीद (₹1,11,475) सत्यापित हो गई है।',
                  url: window.location.href,
                }).catch(() => {});
              } else {
                alert('पर्ची लिंक कॉपी कर लिया गया है!');
              }
            }}
            className="w-full bg-white hover:bg-stone-100 text-slate-800 border border-stone-300 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold text-xs transition-colors cursor-pointer"
            type="button"
          >
            <span>📲 WhatsApp पर शेयर करें (Share Slip)</span>
          </button>
        </div>

      </main>
    </div>
  );
}
