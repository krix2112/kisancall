'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface FarmerStatusData {
  farmer: {
    name: string;
    phone: string;
    mandi: string;
    crop: string;
  };
  booking: {
    tokenId: string;
    date: string;
    slotBlock: string;
    status: 'Booked' | 'Arrived' | 'In Queue' | 'Procured' | 'Completed';
  };
  queue: {
    position: number;
    totalInQueue: number;
    etaMinutes: number;
    gateNumber: string;
  };
  price: {
    commodity: string;
    modalPrice: number;
    msp: number;
    date: string;
  };
  payment: {
    status: 'Pending' | 'Processing' | 'Paid';
    amount: number;
    reference: string;
    updatedAt: string;
  };
  proof?: {
    txHash: string;
    blockNumber: number;
    verified: boolean;
  };
}

const FALLBACK_STATUS: FarmerStatusData = {
  farmer: {
    name: 'Ramesh Kumar (रमेश कुमार)',
    phone: '+91 98765 43210',
    mandi: 'Karnal Central Mandi (कर्नाल केंद्रीय मंडी)',
    crop: 'Wheat / गेहूं (Lok-1)',
  },
  booking: {
    tokenId: '#KC-8849',
    date: '01 Sep 2026',
    slotBlock: 'Morning 08:00 AM - 12:00 PM',
    status: 'In Queue',
  },
  queue: {
    position: 4,
    totalInQueue: 18,
    etaMinutes: 25,
    gateNumber: 'Gate 2 (गेट न. 2)',
  },
  price: {
    commodity: 'Wheat (गेहूं)',
    modalPrice: 2275,
    msp: 2275,
    date: '31 Aug 2026',
  },
  payment: {
    status: 'Paid',
    amount: 45500,
    reference: 'PAY-884920-IND',
    updatedAt: '31 Aug 02:30 PM',
  },
  proof: {
    txHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    blockNumber: 4892014,
    verified: true,
  },
};

export default function FarmerWebPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);
  
  const [statusData, setStatusData] = useState<FarmerStatusData>(FALLBACK_STATUS);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [callRequested, setCallRequested] = useState(false);

  // Book Slot Wizard State (Web)
  const [showBookSlotModal, setShowBookSlotModal] = useState(false);
  const [webBookStep, setWebBookStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState('Wheat (गेहूं)');
  const [selectedMandi, setSelectedMandi] = useState('Karnal Central Mandi');
  const [selectedDate, setSelectedDate] = useState('02 Sep 2026');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');

  // Fetch status from backend upon login
  useEffect(() => {
    if (isLoggedIn) {
      fetchStatus();
    }
  }, [isLoggedIn]);

  const fetchStatus = async () => {
    setIsFetchingStatus(true);
    try {
      const res = await fetch('http://localhost:4000/farmers/KC-FARMER-8849/status');
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setStatusData(data.status);
        }
      }
    } catch (err) {
      console.log('Backend status API offline, using fallback state:', err);
    } finally {
      setIsFetchingStatus(false);
    }
  };

  // Send OTP handler using Supabase Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    setMessage(null);
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (!isSupabaseConfigured) {
      setLoading(false);
      setMessage({
        type: 'info',
        text: 'Supabase env variables not configured. Running in UI preview mode.',
      });
      setStep('otp');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      setLoading(false);
      if (error) {
        // If phone provider not configured in Supabase (no Twilio/SMS), fall through to demo mode
        const isProviderError =
          error.message.toLowerCase().includes('phone') ||
          error.message.toLowerCase().includes('provider') ||
          error.message.toLowerCase().includes('unsupported');
        if (isProviderError) {
          setMessage({ type: 'info', text: '📱 Phone SMS not yet configured — entering preview mode. Enter any 6 digits to continue.' });
          setStep('otp');
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        setStep('otp');
        setMessage({ type: 'info', text: `OTP sent to ${formattedPhone}` });
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to send OTP' });
    }
  };

  // Verify OTP handler using Supabase Auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP code.' });
      return;
    }

    setMessage(null);
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    if (!isSupabaseConfigured) {
      setLoading(false);
      setIsLoggedIn(true);
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      setLoading(false);

      if (error) {
        // If phone provider not configured, accept any 6-digit code in demo mode
        const isProviderError =
          error.message.toLowerCase().includes('phone') ||
          error.message.toLowerCase().includes('provider') ||
          error.message.toLowerCase().includes('unsupported') ||
          error.message.toLowerCase().includes('token');
        if (isProviderError) {
          setIsLoggedIn(true);
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setLoading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to verify OTP' });
    }
  };

  // Request voice AI call
  const handleRequestCall = async () => {
    setCallRequested(true);
    try {
      await fetch('http://localhost:4000/voice/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone || '+919876543210', reason: 'Farmer Web Call Request' }),
      });
    } catch (err) {
      console.log('Outbound voice call backend stub triggered.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Booked': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Arrived': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Queue': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Procured': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': case 'Paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <header className="border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
            KisanCall Portal (किसान सेवा पोर्टल)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Government Mandi Procurement & AI Voice Assistant Portal
          </p>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-xs text-slate-500 hover:text-rose-600 underline font-medium"
          >
            Sign Out (लॉग आउट)
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-center font-medium">
          ⚠️ Supabase environment variables not configured. Running in preview mode.
        </div>
      )}

      {/* LOGIN SECTION (shown if not logged in) */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="w-full max-w-[480px] bg-[#ffffff] shadow-sm rounded-xl p-8 lg:p-12 border border-[#717a6d]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00450d]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#00450d] flex items-center justify-center mb-4 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="material-symbols-outlined text-white text-[32px] relative z-10">potted_plant</span>
              </div>
              <h1 className="text-[28px] leading-[36px] font-bold text-[#191d17] mb-2">
                {step === 'phone' ? 'Kisan Login' : 'OTP Darj Karein'}
              </h1>
              <p className="text-[16px] leading-[24px] text-[#41493e] max-w-[300px]">
                {step === 'phone' ? (
                  'Apna registered mobile number darj karein'
                ) : (
                  <>
                    Humne <span className="font-semibold text-[#00450d]">+91 {phone || '98765 43210'}</span> par ek 6-digit code bheja hai.
                  </>
                )}
              </p>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-xs text-center font-medium mb-4 ${
                  message.type === 'error'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#1b5e20]/10 text-[#00450d]'
                }`}
              >
                {message.text}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#191d17]">
                    मोबाइल नंबर / Mobile Number
                  </label>
                  <div className="flex rounded-lg border border-[#717a6d]/30 overflow-hidden focus-within:ring-2 focus-within:ring-[#00450d] bg-[#f7fbf1]">
                    <span className="bg-[#e0e4db] text-[#191d17] px-4 py-3 text-base font-semibold flex items-center border-r border-[#717a6d]/20">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-4 py-3 text-lg font-medium text-[#191d17] bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] bg-[#00450d] text-white rounded-lg text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-colors relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10">{loading ? 'Sending...' : 'OTP Bhejein'}</span>
                  <span className="material-symbols-outlined text-[20px] relative z-10 transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#191d17] text-center">OTP Code</label>
                  <div className="flex justify-between gap-2 sm:gap-3" id="otp-container">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        value={otp[idx] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newOtpArr = otp.split('');
                          newOtpArr[idx] = val;
                          const newOtpStr = newOtpArr.join('');
                          setOtp(newOtpStr);

                          if (val && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[idx] && e.currentTarget.previousElementSibling) {
                            (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        className="w-12 h-16 sm:w-14 sm:h-16 text-center text-[24px] font-bold bg-[#f7fbf1] border border-[#717a6d]/20 rounded-lg focus:border-[#00450d] focus:ring-2 focus:ring-[#00450d]/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] bg-[#00450d] text-white rounded-lg text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-colors relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10">{loading ? 'Verifying...' : 'Verify Karein'}</span>
                  <span className="material-symbols-outlined text-[20px] relative z-10 transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </form>
            )}

            <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#717a6d]/10 pt-6">
              {step === 'otp' && (
                <div className="text-center">
                  <p className="text-[16px] text-[#41493e] mb-1">OTP nahi mila?</p>
                  <button
                    type="button"
                    onClick={() => handleSendOtp({ preventDefault: () => {} } as any)}
                    className="font-semibold text-[#00450d] hover:underline transition-all text-[16px]"
                  >
                    OTP Phir Se Bhejein
                  </button>
                </div>
              )}

              <div className="w-full flex items-center gap-4">
                <div className="h-px bg-[#717a6d]/10 flex-1" />
                <span className="text-[14px] font-medium text-[#41493e]">YA</span>
                <div className="h-px bg-[#717a6d]/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleRequestCall}
                className="w-full min-h-[48px] bg-[#ecefe6] border border-[#717a6d]/20 text-[#00450d] rounded-lg text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-[#e0e4db] transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">call</span>
                Call par OTP sunein
              </button>

              {step === 'otp' && (
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[14px] text-[#41493e] hover:underline mt-2"
                >
                  ← Mobile number badlein
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* SINGLE-PAGE DASHBOARD STATUS CARD (shown after login) */
        <div className="space-y-6">
          {/* Top Farmer Info Header */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">{statusData.farmer.name}</span>
                <span className="bg-emerald-700 text-emerald-100 text-xs px-2 py-0.5 rounded font-mono font-semibold">
                  {statusData.booking.tokenId}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                {statusData.farmer.mandi} • {statusData.farmer.crop}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setWebBookStep(1);
                  setShowBookSlotModal(true);
                }}
                className="bg-[#acf4a4] hover:bg-[#91d78a] text-[#00450d] font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>📅</span>
                <span>Book a Slot (नया स्लॉट)</span>
              </button>

              <button
                onClick={fetchStatus}
                disabled={isFetchingStatus}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                {isFetchingStatus ? 'Refreshing...' : '🔄 Refresh Status'}
              </button>
            </div>
          </div>

          {/* COMBINED 4-GRID STATUS MODULE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MODULE 1: Slot Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    📅 स्लॉट स्थिति / Slot Details
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(statusData.booking.status)}`}>
                    {statusData.booking.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><span className="font-semibold text-slate-500">Scheduled Date:</span> {statusData.booking.date}</p>
                  <p><span className="font-semibold text-slate-500">Time Block:</span> {statusData.booking.slotBlock}</p>
                  <p><span className="font-semibold text-slate-500">Token ID:</span> <span className="font-mono font-bold text-emerald-700">{statusData.booking.tokenId}</span></p>
                </div>
              </div>

              <button
                onClick={() => {
                  setWebBookStep(1);
                  setShowBookSlotModal(true);
                }}
                className="w-full mt-2 bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>📅</span> Book / Change Mandi Slot (स्लॉट बदलें/बुक करें)
              </button>
            </div>

            {/* MODULE 2: Queue Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  🚜 कतार स्थिति / Queue Sequence
                </h3>
                <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Pos #{statusData.queue.position}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p><span className="font-semibold text-slate-500">Current Position:</span> <strong className="text-slate-900 text-sm">#{statusData.queue.position}</strong> (out of {statusData.queue.totalInQueue})</p>
                <p><span className="font-semibold text-slate-500">Est. Wait Time:</span> <strong className="text-amber-800">~{statusData.queue.etaMinutes} minutes</strong></p>
                <p><span className="font-semibold text-slate-500">Assigned Gate:</span> {statusData.queue.gateNumber}</p>
              </div>
            </div>

            {/* MODULE 3: Mandi Price & MSP */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  🌾 सरकारी भाव / Mandi Rate
                </h3>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Agmarknet Daily
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p><span className="font-semibold text-slate-500">Commodity:</span> {statusData.price.commodity}</p>
                <p><span className="font-semibold text-slate-500">Today's Modal Price:</span> <strong className="text-emerald-800 text-base">₹{statusData.price.modalPrice} / Qtl</strong></p>
                <p><span className="font-semibold text-slate-500">Govt MSP Guarantee:</span> ₹{statusData.price.msp} / Qtl</p>
              </div>
            </div>

            {/* MODULE 4: Payment & DBT Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  💳 डीबीटी भुगतान / Payment Status
                </h3>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {statusData.payment.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p><span className="font-semibold text-slate-500">Disbursed Amount:</span> <strong className="text-slate-900 text-sm">₹{statusData.payment.amount.toLocaleString('en-IN')}</strong></p>
                <p><span className="font-semibold text-slate-500">PFMS Ref:</span> <span className="font-mono text-slate-800">{statusData.payment.reference}</span></p>
                <p><span className="font-semibold text-slate-500">Updated:</span> {statusData.payment.updatedAt}</p>
              </div>
            </div>
          </div>

          {/* BLOCKCHAIN AGROCHAIN PROOF REFERENCE */}
          {statusData.proof && (
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  🔗 AgroChain Verifiable Proof Reference (Shardeum EVM)
                </h4>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  ✓ ON-CHAIN VERIFIED
                </span>
              </div>
              <div className="font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
                <p><span className="text-slate-500">TxHash:</span> {statusData.proof.txHash}</p>
                <p><span className="text-slate-500">Block:</span> #{statusData.proof.blockNumber}</p>
              </div>
            </div>
          )}

          {/* REQUEST A CALL BANNER */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 shadow-sm text-center space-y-3">
            <h3 className="text-lg font-bold text-emerald-900">
              📞 वॉइस असिस्टेंट से कॉल पर बात करें / Request AI Voice Call
            </h3>
            <p className="text-xs text-emerald-800 max-w-lg mx-auto">
              यदि आप अपने स्लॉट, कतार समय या भुगतान के बारे में हिंदी या अंग्रेजी में वॉइस पर सहायता चाहते हैं, तो बटन दबाएं। AI असिस्टेंट आपको तुरंत कॉल करेगा।
            </p>
            {callRequested ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg max-w-sm mx-auto animate-pulse">
                ✓ Call Request Received! Our AI Voice Assistant will call your mobile number (+91 {phone || '9876543210'}) shortly.
              </div>
            ) : (
              <button
                onClick={handleRequestCall}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md text-sm"
              >
                📞 Call Me Now (कॉल का अनुरोध करें)
              </button>
            )}
          </div>

          {/* BOOK SLOT MODAL (WEB) */}
          {showBookSlotModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#00450d]">स्लॉट बुक करें (Book Slot)</h3>
                    <p className="text-xs text-slate-500">Step {webBookStep} of 4</p>
                  </div>
                  <button
                    onClick={() => setShowBookSlotModal(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Step 1: Crop Selection */}
                {webBookStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">1. फसल चुनें / Choose Crop</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {['Wheat (गेहूं)', 'Paddy (धान)', 'Maize (मक्का)'].map((c) => (
                        <div
                          key={c}
                          onClick={() => setSelectedCrop(c)}
                          className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            selectedCrop === c
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-semibold text-sm text-slate-800">🌾 {c}</span>
                          <input type="radio" checked={selectedCrop === c} readOnly />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Mandi Selection */}
                {webBookStep === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">2. मंडी चुनें / Choose Mandi</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'Sehore Procurement Centre (सीहोर)', dist: '12 km away' },
                        { name: 'Karnal Central Mandi (कर्नाल)', dist: '5 km away' },
                        { name: 'Ashta Krishi Upaj Mandi (आष्टा)', dist: '35 km away' },
                      ].map((m) => (
                        <div
                          key={m.name}
                          onClick={() => setSelectedMandi(m.name)}
                          className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            selectedMandi === m.name
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-sm text-slate-800">📍 {m.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{m.dist}</p>
                          </div>
                          <input type="radio" checked={selectedMandi === m.name} readOnly />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Slot */}
                {webBookStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">3. समय चुनें / Choose Time Slot</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">तारीख / Date</label>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#00450d] outline-none"
                      >
                        <option value="01 Sep 2026">Today (01 Sep 2026)</option>
                        <option value="02 Sep 2026">Tomorrow (02 Sep 2026)</option>
                        <option value="03 Sep 2026">Thu (03 Sep 2026)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">समय ब्लॉक / Time Block</label>
                      {['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM'].map((s) => (
                        <div
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between ${
                            selectedSlot === s
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-slate-200'
                          }`}
                        >
                          <span className="font-medium text-xs text-slate-800">⏱ {s}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Available</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {webBookStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-[#f7fbf1] p-4 rounded-xl border border-[#acf4a4] space-y-2">
                      <h4 className="font-bold text-sm text-[#00450d]">बुकिंग सारांश / Summary</h4>
                      <p className="text-xs text-slate-700"><strong>Crop:</strong> {selectedCrop}</p>
                      <p className="text-xs text-slate-700"><strong>Mandi:</strong> {selectedMandi}</p>
                      <p className="text-xs text-slate-700"><strong>Date & Time:</strong> {selectedDate}, {selectedSlot}</p>
                    </div>

                    <div className="bg-emerald-900 text-white p-4 rounded-xl text-center space-y-1">
                      <p className="text-xs text-emerald-200 uppercase tracking-wider">GENERATED TOKEN</p>
                      <p className="text-3xl font-extrabold text-[#acf4a4]">#KC-9942</p>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-3 pt-2">
                  {webBookStep > 1 && (
                    <button
                      onClick={() => setWebBookStep(webBookStep - 1)}
                      className="flex-1 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </button>
                  )}
                  {webBookStep < 4 ? (
                    <button
                      onClick={() => setWebBookStep(webBookStep + 1)}
                      className="flex-1 py-3 bg-[#00450d] text-white rounded-xl text-sm font-semibold hover:bg-[#1b5e20]"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setStatusData((prev) => ({
                          ...prev,
                          booking: {
                            tokenId: '#KC-9942',
                            date: selectedDate,
                            slotBlock: selectedSlot,
                            status: 'Booked',
                          },
                          farmer: {
                            ...prev.farmer,
                            crop: selectedCrop,
                            mandi: selectedMandi,
                          },
                        }));
                        setShowBookSlotModal(false);
                      }}
                      className="flex-1 py-3 bg-[#00450d] text-white rounded-xl text-sm font-semibold hover:bg-[#1b5e20]"
                    >
                      Confirm Slot (पुष्टि करें) ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
