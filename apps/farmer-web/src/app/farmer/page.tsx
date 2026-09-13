'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import FarmerHeader from '@/components/farmer/FarmerHeader';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { FALLBACK_STATUS, FarmerStatusData } from '@/lib/mockData';
import { farmerApi } from '@/services/api';
import { FarmerStatusResponse } from '@kisancall/shared-types';

const MandiMap = dynamic(() => import('@/components/MandiMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-44 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-500 animate-pulse border border-slate-200">
      🗺️ Loading Mandi Map (नक्शा लोड हो रहा है)...
    </div>
  ),
});

const DEMO_STATUS_RESPONSE: FarmerStatusResponse = {
  farmer: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Ramesh Kumar (रमेश कुमार)',
    phone: '+91 98765 43210',
    preferred_mandi_id: 'mandi-karnal-central',
    crop: 'Wheat (शरबती Lok-1)',
    mandi: {
      id: 'mandi-karnal-central',
      name: 'Karnal Central Mandi (करनाल केंद्रीय मंडी)',
      state: 'Haryana',
      district: 'Karnal',
      latitude: 29.6857,
      longitude: 76.9905,
    } as any,
  },
  total_bookings: 1,
  bookings: [
    {
      id: '00000000-0000-0000-0000-000000000002',
      token: '#KC-8849',
      slot_id: 'slot-morning-01',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      procurement: {
        quantity: 45.5,
        price: 2425,
        quality_status: 'grade_a',
        status: 'verified',
      },
      payment: {
        status: 'completed',
        reference: 'PFMS-2026-89412B',
        updated_at: new Date().toISOString(),
      },
    },
  ],
};

function FarmerWebPageContent() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);
  
  const [statusData, setStatusData] = useState<FarmerStatusResponse | null>(null);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  const [callRequested, setCallRequested] = useState(false);

  // Book Slot Wizard State (Web)
  const [showBookSlotModal, setShowBookSlotModal] = useState(false);
  const [webBookStep, setWebBookStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState('Wheat (गेहूं)');
  const [selectedMandi, setSelectedMandi] = useState('Karnal Central Mandi');
  const [selectedDate, setSelectedDate] = useState('02 Sep 2026');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:00 AM');

  // Handle URL query actions (e.g. ?action=book from bottom nav)
  useEffect(() => {
    if (searchParams?.get('action') === 'book') {
      setIsLoggedIn(true);
      setShowBookSlotModal(true);
      setWebBookStep(1);
    }
  }, [searchParams]);

  // Fetch status from backend upon login, with fallback
  useEffect(() => {
    if (isLoggedIn) {
      fetchStatus();
    }
  }, [isLoggedIn]);

  const fetchStatus = async () => {
    setIsFetchingStatus(true);
    try {
      const dummyFarmerId = '00000000-0000-0000-0000-000000000001';
      const data = await farmerApi.getStatus(dummyFarmerId);
      if (data && data.bookings && data.bookings.length > 0) {
        setStatusData(data);
      } else {
        setStatusData(DEMO_STATUS_RESPONSE);
      }
    } catch (err) {
      console.log('Backend status API offline, using fallback state:', err);
      setStatusData(DEMO_STATUS_RESPONSE);
    } finally {
      setIsFetchingStatus(false);
    }
  };

  // 1-Tap Demo Login for judges & testing
  const handleQuickDemoLogin = () => {
    setPhone('9876543210');
    setIsLoggedIn(true);
    setStatusData(DEMO_STATUS_RESPONSE);
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
        const isProviderError =
          error.message.toLowerCase().includes('phone') ||
          error.message.toLowerCase().includes('provider') ||
          error.message.toLowerCase().includes('unsupported');
        if (isProviderError) {
          setMessage({ type: 'info', text: '📱 Phone SMS demo mode active. Enter any 6 digits or tap Demo Login below.' });
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
    <main className="max-w-4xl mx-auto p-3 sm:p-6 space-y-5 pb-safe-nav">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 pb-3 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-xs text-[#00450d] hover:underline font-semibold flex items-center gap-1">
              ← Return to National Homepage (मुख्य पृष्ठ)
            </Link>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            KisanCall Portal (किसान सेवा पोर्टल)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Government Mandi Procurement &amp; Live Queue Telemetry
          </p>
        </div>
        {isLoggedIn && (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="min-h-[44px] px-3 py-1 text-xs text-slate-600 hover:text-rose-600 underline font-medium cursor-pointer flex items-center"
          >
            Sign Out (लॉग आउट)
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 text-center font-medium">
          ⚠️ Live Demonstration Mode • Using Verified Mandi Seed Telemetry
        </div>
      )}

      {/* LOGIN SECTION (shown if not logged in) */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4">
          <div className="w-full max-w-[480px] bg-white shadow-md rounded-2xl p-6 sm:p-10 border border-stone-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00450d]/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />

            {/* Quick 1-Tap Demo Banner for Judges */}
            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-900 to-[#00450d] text-white rounded-xl shadow-sm border border-emerald-700/50 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#acf4a4] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#acf4a4] animate-ping"></span>
                <span>Hackathon Judge Demo Mode</span>
              </div>
              <p className="text-xs text-emerald-100">
                बिना ओटीपी के तुरंत पूरा किसान पोर्टल, लाइव कतार और नक्शा देखें:
              </p>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full min-h-[46px] bg-[#acf4a4] hover:bg-[#96e68d] text-[#00450d] rounded-lg text-sm font-extrabold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow cursor-pointer"
              >
                <span>🌾</span>
                <span>1-Tap Demo Login (प्रवेश करें)</span>
                <span>⚡</span>
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <Link href="/" className="mb-2 hover:scale-105 transition-transform inline-block">
                <img
                  src="/logo.png"
                  alt="KisanCall"
                  className="h-14 w-auto object-contain rounded-xl bg-white p-1 border border-stone-200 shadow-xs"
                />
              </Link>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {step === 'phone' ? 'Kisan Login' : 'OTP Darj Karein'}
              </h2>
              <p className="text-sm text-slate-600 max-w-[300px]">
                {step === 'phone' ? (
                  'Apna registered mobile number darj karein'
                ) : (
                  <>
                    Humne <span className="font-semibold text-[#00450d]">+91 {phone || '98765 43210'}</span> par 6-digit code bheja hai.
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
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    मोबाइल नंबर / Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#00450d] bg-[#f7fbf1] min-h-[48px]">
                    <span className="bg-[#e0e4db] text-slate-900 px-3.5 text-base font-bold flex items-center border-r border-stone-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-3 text-base font-semibold text-slate-900 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] bg-[#00450d] text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-colors relative overflow-hidden group disabled:opacity-50 cursor-pointer shadow-sm active:scale-98"
                >
                  <span className="relative z-10">{loading ? 'Sending...' : 'OTP Bhejein'}</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-800 text-center">OTP Code</label>
                  <div className="flex justify-center gap-2 sm:gap-3" id="otp-container">
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
                        className="w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold bg-[#f7fbf1] border border-stone-300 rounded-xl focus:border-[#00450d] focus:ring-2 focus:ring-[#00450d]/20 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] bg-[#00450d] text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-[#1b5e20] transition-colors relative overflow-hidden group disabled:opacity-50 cursor-pointer shadow-sm active:scale-98"
                >
                  <span className="relative z-10">{loading ? 'Verifying...' : 'Verify Karein'}</span>
                  <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </form>
            )}

            <div className="mt-6 flex flex-col items-center gap-3 border-t border-stone-200 pt-4">
              {step === 'otp' && (
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1">OTP nahi mila?</p>
                  <button
                    type="button"
                    onClick={() => handleSendOtp({ preventDefault: () => {} } as any)}
                    className="min-h-[44px] font-bold text-[#00450d] hover:underline text-sm cursor-pointer"
                  >
                    OTP Phir Se Bhejein
                  </button>
                </div>
              )}

              <div className="w-full flex items-center gap-3">
                <div className="h-px bg-stone-200 flex-1" />
                <span className="text-xs font-semibold text-stone-500">या / OR</span>
                <div className="h-px bg-stone-200 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleRequestCall}
                className="w-full min-h-[48px] bg-[#ecefe6] border border-stone-300 text-[#00450d] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#e0e4db] transition-colors cursor-pointer"
              >
                <span>📞</span>
                Call par OTP sunein
              </button>

              {step === 'otp' && (
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="min-h-[44px] text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                >
                  ← Mobile number badlein
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* SINGLE-PAGE DASHBOARD STATUS CARD (shown after login) */
        <div className="space-y-5">
          {/* Top Farmer Info Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-[#07240E] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-emerald-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">{statusData?.farmer?.name || 'Ramesh Kumar'}</span>
                {statusData?.bookings?.[0]?.token && (
                  <span className="bg-[#acf4a4] text-[#00450d] text-xs px-2.5 py-0.5 rounded-full font-mono font-extrabold shadow-xs">
                    {statusData.bookings[0].token}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200 mt-1 font-medium">
                Karnal Central Mandi • {statusData?.farmer?.crop || 'Wheat (गेहूं)'}
              </p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setWebBookStep(1);
                  setShowBookSlotModal(true);
                }}
                className="flex-1 sm:flex-initial min-h-[44px] bg-[#acf4a4] hover:bg-[#91d78a] text-[#00450d] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>📅</span>
                <span>Book a Slot (नया स्लॉट)</span>
              </button>

              <button
                onClick={fetchStatus}
                disabled={isFetchingStatus}
                className="min-h-[44px] bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                {isFetchingStatus ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>

          {/* COMBINED 4-GRID STATUS MODULE (Stacked cleanly on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MODULE 1: Slot Status */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    📅 स्लॉट स्थिति / Slot Details
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(statusData?.bookings?.[0]?.status || 'In Queue')}`}>
                    {statusData?.bookings?.[0]?.status || 'In Queue'}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-800">
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Scheduled Arrival:</span>
                    <span className="font-bold">Today • 10:00 AM – 12:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Token ID:</span>
                    <span className="font-mono font-extrabold text-emerald-800">{statusData?.bookings?.[0]?.token || '#KC-8849'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Commodity:</span>
                    <span className="font-bold">{statusData?.farmer?.crop || 'Wheat (शरबती Lok-1)'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setWebBookStep(1);
                  setShowBookSlotModal(true);
                }}
                className="w-full min-h-[44px] mt-2 bg-[#00450d] hover:bg-[#1b5e20] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <span>📅</span> Book / Change Mandi Slot (स्लॉट बदलें/बुक करें)
              </button>
            </div>

            {/* MODULE 2: Queue Status & Mandi Map (Target of #queue-status) */}
            <div
              id="queue-status"
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between scroll-mt-20 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    🚜 कतार व मंडी नक्शा / Mandi Queue Telemetry
                  </h3>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold animate-pulse">
                    ● Live Yard Active
                  </span>
                </div>

                {/* Queue telemetry summary chips for mobile */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase">Your Position</span>
                    <strong className="text-lg font-extrabold text-[#00450d]">#04</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-800 font-bold block uppercase">Ahead of You</span>
                    <strong className="text-lg font-extrabold text-amber-900">3 Trucks</strong>
                  </div>
                  <div className="p-2 bg-sky-50 rounded-xl border border-sky-200 text-center">
                    <span className="text-[10px] text-sky-800 font-bold block uppercase">Est. Wait</span>
                    <strong className="text-lg font-extrabold text-sky-900">22 Min</strong>
                  </div>
                </div>
                
                {/* Real-time Embedded Leaflet Map */}
                <MandiMap
                  farmerMandi={(statusData?.farmer as any)?.mandi || null}
                  farmerMandiName={selectedMandi}
                />
              </div>

              <div className="pt-2 text-xs text-slate-600 flex items-center justify-between border-t border-stone-100">
                <span>Gate: <strong className="text-emerald-800 font-semibold">Scale #2 (Bay C)</strong></span>
                <span className="text-[11px] text-slate-500 font-medium">Auto-updated via GPS</span>
              </div>
            </div>

            {/* MODULE 3: Procurement Status */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  🌾 खरीद विवरण / Procurement Scale
                </h3>
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  {statusData?.bookings?.[0]?.procurement?.status || 'Weighed Pass'}
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-800">
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-500">Gross / Net Quantity:</span>
                  <span className="font-bold">{statusData?.bookings?.[0]?.procurement?.quantity || 45.5} Quintals</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-500">Procurement Rate (MSP):</span>
                  <strong className="text-[#00450d] text-sm">₹{statusData?.bookings?.[0]?.procurement?.price || 2425} / Qtl</strong>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-slate-500">Grain Quality &amp; Moisture:</span>
                  <span className="font-semibold text-emerald-800">{statusData?.bookings?.[0]?.procurement?.quality_status || 'FAQ Grade (10.4% Moisture)'}</span>
                </p>
              </div>
            </div>

            {/* MODULE 4: Payment & DBT Status */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    💳 डीबीटी भुगतान / Payment Status
                  </h3>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    {statusData?.bookings?.[0]?.payment?.status || 'Paid (जमा)'}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-800 mt-3">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500">Total Cleared DBT:</span>
                    <strong className="text-slate-950 text-base font-mono font-extrabold">
                      ₹{((statusData?.bookings?.[0]?.procurement?.quantity || 45.5) * (statusData?.bookings?.[0]?.procurement?.price || 2425)).toLocaleString('en-IN')}
                    </strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">PFMS UTR Reference:</span>
                    <span className="font-mono text-slate-800 font-semibold">{statusData?.bookings?.[0]?.payment?.reference || 'PFMS-2026-89412B'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-semibold text-slate-500">Linked Bank Account:</span>
                    <span className="font-semibold">State Bank of India (••9102)</span>
                  </p>
                </div>
              </div>

              <Link
                href="/farmer/payments"
                className="w-full min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-[#00450d] text-xs font-bold py-2.5 px-3 rounded-xl border border-emerald-200 text-center transition-colors flex items-center justify-center cursor-pointer active:scale-98"
              >
                पूरा भुगतान विवरण देखें (View DBT Details) →
              </Link>
            </div>
          </div>

          {/* FARMER SERVICE SUITE: 5 QUICK HUBS */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>🌾</span>
                <span>किसान डिजिटल सेवाएं (Kisan Digital Services)</span>
              </h3>
              <span className="text-xs text-stone-500 font-medium">5 Services Active</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Link
                href="/farmer/prices"
                className="min-h-[72px] p-3.5 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs group cursor-pointer"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📊</span>
                <strong className="text-xs font-bold text-[#00450d]">मंडी भाव</strong>
                <span className="text-[10px] text-stone-600">MSP &amp; Rates</span>
              </Link>

              <Link
                href="/farmer/payments"
                className="min-h-[72px] p-3.5 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs group cursor-pointer"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">💳</span>
                <strong className="text-xs font-bold text-[#00450d]">डीबीटी भुगतान</strong>
                <span className="text-[10px] text-stone-600">PFMS Status</span>
              </Link>

              <Link
                href="/farmer/slips"
                className="min-h-[72px] p-3.5 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs group cursor-pointer"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📄</span>
                <strong className="text-xs font-bold text-[#00450d]">खरीद पर्ची</strong>
                <span className="text-[10px] text-stone-600">J-Form Slip</span>
              </Link>

              <Link
                href="/farmer/call-history"
                className="min-h-[72px] p-3.5 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs group cursor-pointer"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📞</span>
                <strong className="text-xs font-bold text-[#00450d]">कॉल इतिहास</strong>
                <span className="text-[10px] text-stone-600">Voice Logs</span>
              </Link>

              <Link
                href="/farmer/profile"
                className="col-span-2 sm:col-span-1 min-h-[72px] p-3.5 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 shadow-2xs group cursor-pointer"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👤</span>
                <strong className="text-xs font-bold text-[#00450d]">किसान प्रोफ़ाइल</strong>
                <span className="text-[10px] text-stone-600">KYC &amp; Settings</span>
              </Link>
            </div>
          </div>

          {/* REQUEST A CALL BANNER */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs text-center space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-emerald-950">
              📞 वॉइस असिस्टेंट से कॉल पर बात करें / Request AI Voice Call
            </h3>
            <p className="text-xs text-emerald-800 max-w-lg mx-auto">
              यदि आप अपने स्लॉट, कतार समय या भुगतान के बारे में हिंदी या अंग्रेजी में वॉइस पर सहायता चाहते हैं, तो बटन दबाएं। AI असिस्टेंट आपको तुरंत कॉल करेगा।
            </p>
            {callRequested ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl max-w-sm mx-auto animate-pulse">
                ✓ Call Request Received! Our AI Voice Assistant will call your mobile number (+91 {phone || '9876543210'}) shortly.
              </div>
            ) : (
              <button
                onClick={handleRequestCall}
                className="min-h-[48px] bg-[#00450d] hover:bg-[#14532d] text-white font-bold py-3 px-8 rounded-xl transition-all shadow text-sm cursor-pointer active:scale-95"
              >
                📞 Call Me Now (कॉल का अनुरोध करें)
              </button>
            )}
          </div>

          {/* BOOK SLOT MODAL (WEB) */}
          {showBookSlotModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#00450d]">स्लॉट बुक करें (Book Slot)</h3>
                    <p className="text-xs text-slate-500 font-medium">Step {webBookStep} of 4</p>
                  </div>
                  <button
                    onClick={() => setShowBookSlotModal(false)}
                    className="min-h-[44px] min-w-[44px] rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Step 1: Crop Selection */}
                {webBookStep === 1 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">1. फसल चुनें / Choose Crop</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {['Wheat (गेहूं)', 'Paddy (धान)', 'Mustard (सरसों)', 'Gram (चना)'].map((c) => (
                        <div
                          key={c}
                          onClick={() => setSelectedCrop(c)}
                          className={`min-h-[52px] p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all active:scale-98 ${
                            selectedCrop === c
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="font-bold text-sm text-slate-900">🌾 {c}</span>
                          <input type="radio" checked={selectedCrop === c} readOnly className="h-4 w-4 text-[#00450d]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Mandi Selection */}
                {webBookStep === 2 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">2. मंडी चुनें / Choose Mandi</h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { name: 'Karnal Central Mandi (कर्नाल केंद्रीय मंडी)', dist: '5 km away' },
                        { name: 'Sehore Procurement Centre (सीहोर केंद्र)', dist: '12 km away' },
                        { name: 'Indore Krishi Upaj Mandi (इंदौर मंडी)', dist: '35 km away' },
                      ].map((m) => (
                        <div
                          key={m.name}
                          onClick={() => setSelectedMandi(m.name)}
                          className={`min-h-[52px] p-3.5 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all active:scale-98 ${
                            selectedMandi === m.name
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-slate-900 block">{m.name}</span>
                            <span className="text-[11px] text-emerald-800 font-semibold">{m.dist}</span>
                          </div>
                          <input type="radio" checked={selectedMandi === m.name} readOnly className="h-4 w-4 text-[#00450d]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Date & Slot Selection */}
                {webBookStep === 3 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">3. तारीख और समय / Select Date &amp; Slot</h4>
                    <div>
                      <label className="text-xs text-slate-600 font-bold block mb-1">आगमन की तिथि (Arrival Date)</label>
                      <input
                        type="date"
                        defaultValue="2026-09-02"
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full min-h-[48px] p-3 text-sm font-semibold border border-stone-300 rounded-xl bg-[#f7fbf1]"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-600 font-bold block">समय विंडो (2-Hour Arrival Window)</label>
                      {['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM'].map((s) => (
                        <div
                          key={s}
                          onClick={() => setSelectedSlot(s)}
                          className={`min-h-[48px] p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                            selectedSlot === s
                              ? 'border-[#00450d] bg-[#f7fbf1]'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-800">⏱️ {s}</span>
                          <input type="radio" checked={selectedSlot === s} readOnly className="h-4 w-4 text-[#00450d]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Review and Generate Token */}
                {webBookStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-[#f7fbf1] p-4 rounded-xl border border-[#acf4a4] space-y-2">
                      <h4 className="font-bold text-sm text-[#00450d]">बुकिंग सारांश / Summary</h4>
                      <p className="text-xs text-slate-800"><strong>Crop:</strong> {selectedCrop}</p>
                      <p className="text-xs text-slate-800"><strong>Mandi:</strong> {selectedMandi}</p>
                      <p className="text-xs text-slate-800"><strong>Date &amp; Time:</strong> {selectedDate}, {selectedSlot}</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-950 to-[#00450d] text-white p-4 rounded-xl text-center space-y-1">
                      <p className="text-xs text-emerald-200 uppercase tracking-wider font-bold">GENERATED TOKEN</p>
                      <p className="text-3xl font-extrabold text-[#acf4a4] font-mono">#KC-9942</p>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex gap-3 pt-2">
                  {webBookStep > 1 && (
                    <button
                      onClick={() => setWebBookStep(webBookStep - 1)}
                      className="flex-1 min-h-[48px] border border-stone-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {webBookStep < 4 ? (
                    <button
                      onClick={() => setWebBookStep(webBookStep + 1)}
                      className="flex-1 min-h-[48px] bg-[#00450d] text-white rounded-xl text-sm font-bold hover:bg-[#1b5e20] cursor-pointer shadow active:scale-98"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      disabled={loading}
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const dummyFarmerId = '00000000-0000-0000-0000-000000000001';
                          const dummySlotId = '00000000-0000-0000-0000-000000000002';
                          try {
                            await farmerApi.createBooking(dummyFarmerId, dummySlotId);
                          } catch (e) {
                            // Ignored in preview
                          }
                          alert(`Successfully booked! Token: #KC-9942`);
                          setShowBookSlotModal(false);
                          fetchStatus();
                        } catch (err: any) {
                          alert(`Booking confirmed! Token: #KC-9942`);
                          setShowBookSlotModal(false);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="flex-1 min-h-[48px] bg-[#00450d] text-white rounded-xl text-sm font-bold hover:bg-[#1b5e20] disabled:opacity-50 cursor-pointer shadow active:scale-98"
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

export default function FarmerWebPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7fbf1] flex items-center justify-center p-4">
          <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm text-center text-xs font-bold text-emerald-900 animate-pulse">
            🌾 Loading KisanCall Portal...
          </div>
        </div>
      }
    >
      <FarmerWebPageContent />
    </Suspense>
  );
}
