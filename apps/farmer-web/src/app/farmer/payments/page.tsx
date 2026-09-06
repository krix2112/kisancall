'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FarmerHeader from '@/components/farmer/FarmerHeader';
import FarmerBottomNav from '@/components/farmer/FarmerBottomNav';

export default function FarmerPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'paid' | 'proc' | 'failed'>('paid');
  const [copied, setCopied] = useState(false);

  const handleCopyTxn = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7fbf1] text-slate-900 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <FarmerHeader
        title="भुगतान / Payment"
        subtitle="फसल खरीद भुगतान विवरण • DBT Tracking"
        showBack={true}
        audioText="आपकी 45.50 क्विंटल गेहूं की खरीद का कुल 1 लाख 11 हजार 475 रुपये सीधे आपके भारतीय स्टेट बैंक खाते में डीबीटी द्वारा जमा कर दिया गया है।"
      />

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col gap-3.5">
        
        {/* Interactive State Switcher / Segmented Tabs */}
        <div className="w-full bg-[#e8ede2] p-1 rounded-xl flex gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('paid')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'paid'
                ? 'bg-white text-[#00450d] shadow-sm'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            ✓ भुगतान हो गया (Paid)
          </button>
          <button
            onClick={() => setActiveTab('proc')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'proc'
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            ⏳ प्रक्रिया में (Processing)
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
              activeTab === 'failed'
                ? 'bg-white text-rose-800 shadow-sm'
                : 'text-stone-600 hover:text-slate-900'
            }`}
            type="button"
          >
            ⚠️ विफल / अन्य
          </button>
        </div>

        {/* STATE 1: PAID (DEFAULT) */}
        {activeTab === 'paid' && (
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            {/* Hero Status Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-emerald-100/60 pointer-events-none"></div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00450d] text-white text-xs font-bold mb-3 shadow-xs">
                <span>✓</span>
                <span>भुगतान सफल / PAID</span>
              </div>

              {/* Amount */}
              <div className="flex items-baseline justify-center gap-1 text-[#00450d]">
                <span className="text-2xl font-bold font-mono">₹</span>
                <span className="text-4xl font-black tracking-tight font-mono">1,11,475</span>
              </div>
              <p className="text-sm text-emerald-800 font-bold mt-1">खाते में जमा किया गया (Credited)</p>
              <p className="text-xs text-stone-500 mt-0.5">आज, 11:42 AM • 05 Sep 2026</p>

              {/* Trust Note */}
              <div className="w-full mt-4 pt-3 bg-stone-50 rounded-xl p-2.5 flex items-center justify-center gap-2 text-stone-700 text-xs font-medium border border-stone-100">
                <span className="text-emerald-700 font-bold">🛡️</span>
                <span>भारत सरकार PFMS प्रत्यक्ष लाभ अंतरण (DBT)</span>
              </div>
            </div>

            {/* Mandi & Crop Procurement Breakdown */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-stone-200 flex flex-col gap-3">
              <div className="flex items-start justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl text-[#00450d] border border-emerald-200/60">
                    🌾
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">गेहूँ (Wheat - Lok-1)</h2>
                    <p className="text-xs text-stone-600">सीहोर खरीद केंद्र (Sehore Mandi MP)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-xs">
                  A-ग्रेड उपज
                </span>
              </div>

              {/* Detail Rows */}
              <div className="bg-stone-50 rounded-xl p-3 flex flex-col gap-2 text-xs border border-stone-200/60">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="text-stone-600">तौला गया वजन (Quantity)</span>
                  <span className="font-bold font-mono">45.50 क्विंटल <span className="font-normal text-stone-500">(4,550 kg)</span></span>
                </div>
                <div className="flex justify-between items-center text-slate-800">
                  <span className="text-stone-600">लागू खरीद दर (Applied Rate)</span>
                  <span className="font-bold font-mono text-[#00450d]">₹2,450 / क्विंटल</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 bg-emerald-50/70 p-1.5 rounded">
                  <span className="font-medium">सरकारी MSP संदर्भ (Govt MSP)</span>
                  <span className="font-bold font-mono">₹2,400 (+₹50 लाभ)</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-stone-700 border-t border-stone-200">
                  <span className="text-stone-600">कुल सकल राशि (Gross)</span>
                  <span className="font-mono">45.50 × ₹2,450 = ₹1,11,475.00</span>
                </div>
                <div className="flex justify-between items-center text-stone-700">
                  <span className="text-stone-600">मंडी व अन्य कटौती (Deductions)</span>
                  <span className="font-bold text-emerald-700">₹0.00 (शून्य शुल्क)</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="font-bold text-slate-900 text-sm">अंतिम भुगतान (Net Credit)</span>
                  <span className="text-base font-extrabold text-[#00450d] font-mono">₹1,11,475</span>
                </div>
              </div>
            </div>

            {/* DBT & Bank Credentials Card */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-stone-200 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏦</span>
                <span>जमा खाता विवरण (Destination Bank)</span>
              </h3>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00450d] text-white flex items-center justify-center font-black text-xs">
                    SBI
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">State Bank of India</p>
                    <p className="text-xs text-stone-600 font-mono">खाता क्र: •••• 4821</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-full border border-emerald-200">
                  आधार लिंक्ड
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center py-1 text-xs">
                  <span className="text-stone-600">PFMS संदर्भ (Reference)</span>
                  <span className="font-mono text-slate-900 font-bold">PFMS-98240184</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <span className="block text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      लेनदेन संदर्भ संख्या (UTR / Txn ID)
                    </span>
                    <span className="text-xs font-mono text-[#00450d] font-bold">
                      KC-PAY-2026-89412
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyTxn('KC-PAY-2026-89412')}
                    className="h-8 px-3 bg-white hover:bg-stone-100 text-[#00450d] border border-stone-300 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-2xs"
                    type="button"
                  >
                    <span>{copied ? '✓ कॉपीड' : 'कॉपी'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step Payment Timeline */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-stone-200">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>⏱️</span>
                <span>भुगतान स्थिति समय-सारणी (Timeline)</span>
              </h3>

              <div className="flex flex-col gap-3 pl-1 relative">
                <div className="flex gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00450d] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-bold text-slate-900">1. फसल तौल एवं खरीद पूरी</p>
                    <p className="text-[11px] text-stone-500">सीहोर मंडी • 05 Sep, 10:15 AM</p>
                  </div>
                </div>

                <div className="flex gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00450d] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-bold text-slate-900">2. खरीद बिल अधिकृत (Authorized)</p>
                    <p className="text-[11px] text-stone-500">मंडी अधिकारी द्वारा स्वीकृत • 05 Sep, 10:45 AM</p>
                  </div>
                </div>

                <div className="flex gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-[#00450d] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-bold text-slate-900">3. PFMS बैंक सर्वर को प्रेषित</p>
                    <p className="text-[11px] text-stone-500">DBT बैच #4412 • 05 Sep, 11:10 AM</p>
                  </div>
                </div>

                <div className="flex gap-3 relative">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    ✓
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-xs font-bold text-emerald-900">4. किसान बैंक खाते में जमा (Credited)</p>
                    <p className="text-[11px] text-emerald-700 font-medium">SBI A/c •••• 4821 • 05 Sep, 11:42 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slip CTA */}
            <Link
              href="/farmer/slips"
              className="w-full bg-[#00450d] hover:bg-[#134717] text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-sm transition-all text-sm font-bold"
            >
              <span>📄 आधिकारिक J-Form पर्ची देखें (View Receipt Slip)</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* STATE 2: PROCESSING */}
        {activeTab === 'proc' && (
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200/80 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold mb-3 shadow-xs animate-pulse">
                <span>⏳</span>
                <span>प्रक्रिया जारी / PROCESSING</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 text-slate-900">
                <span className="text-2xl font-bold font-mono">₹</span>
                <span className="text-4xl font-black font-mono">1,11,475</span>
              </div>
              <p className="text-sm text-amber-800 font-bold mt-1">बैंक खाते में भेजा जा रहा है</p>

              <div className="w-full mt-4 bg-amber-50 rounded-xl p-3 text-left flex gap-3 items-center border border-amber-200">
                <span className="text-2xl">🕒</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">अनुमानित जमा समय</p>
                  <p className="text-[11px] text-stone-600">अगले 24 से 48 घंटे में सीधे बैंक खाते में</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-xs border border-stone-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                वर्तमान भुगतान प्रगति (Live Progress)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold">✓</span>
                  <span>मंडी तौल पूर्ण (45.50 qtl)</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold">✓</span>
                  <span>भुगतान आदेश जारी (J-Form Approved)</span>
                </div>
                <div className="flex items-center gap-2.5 text-amber-800 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center animate-spin">⟳</span>
                  <span>बैंक एवं PFMS सत्यापन जारी (In Clearing)</span>
                </div>
                <div className="flex items-center gap-2.5 text-stone-400">
                  <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">○</span>
                  <span>खाते में अंतिम जमा (Pending)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: FAILED / ATTENTION */}
        {activeTab === 'failed' && (
          <div className="flex flex-col gap-3.5 animate-fadeIn">
            <div className="bg-rose-50 rounded-2xl p-5 shadow-sm border border-rose-200 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-700 text-white text-xs font-bold mb-3 shadow-xs">
                <span>⚠️</span>
                <span>सत्यापन आवश्यक / Action Needed</span>
              </div>
              <h3 className="text-base font-bold text-rose-950">NPCI बैंक खाता मैपिंग लंबित</h3>
              <p className="text-xs text-rose-800 mt-1.5 leading-relaxed font-hindi">
                आपका आधार खाता स्टेट बैंक से जुड़ा है, लेकिन NPCI DBT मैपर सक्रिय नहीं है। तत्काल अपने नजदीकी बैंक शाखा या मंडी सहायता केंद्र पर संपर्क करें।
              </p>
              <a
                href="tel:18001801551"
                className="mt-4 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <span>📞 नोडल अधिकारी से बात करें (1800-180-1551)</span>
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Persistent Bottom Nav */}
      <FarmerBottomNav />
    </div>
  );
}
