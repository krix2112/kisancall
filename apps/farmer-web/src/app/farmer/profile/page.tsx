'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FarmerHeader from '@/components/farmer/FarmerHeader';
import FarmerBottomNav from '@/components/farmer/FarmerBottomNav';

export default function FarmerProfilePage() {
  const [profileState, setProfileState] = useState<'verified' | 'pending' | 'incomplete' | 'error'>('verified');
  const [copiedId, setCopiedId] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'pa' | 'mr'>('hi');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(true);

  const handleCopyFarmerId = () => {
    navigator.clipboard.writeText('KC-FARMER-8849');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    alert('आप सफलतापूर्वक लॉग आउट हो गए हैं। (Logged out successfully)');
    window.location.href = '/farmer';
  };

  return (
    <div className="min-h-screen bg-[#f7fbf1] text-slate-900 flex flex-col justify-between pb-24">
      {/* Top Header */}
      <FarmerHeader
        title="प्रोफ़ाइल / Profile"
        subtitle="किसान खाता एवं सेटिंग्स • Farmer Account"
        showBack={true}
        audioText="किसान खाता विवरण: आप रमेश कुमार हैं, किसान कोड KC-FARMER-8849, सीहोर मध्य प्रदेश। आपका खाता पूर्णतः सत्यापित है।"
      />

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex-1 flex flex-col gap-3.5">
        
        {/* State Preview Switcher */}
        <div className="overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max bg-[#e8ede2] p-1 rounded-full shadow-inner text-xs font-bold">
            <button
              onClick={() => setProfileState('verified')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                profileState === 'verified'
                  ? 'bg-[#00450d] text-white shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
              type="button"
            >
              ✓ सत्यापित (Verified)
            </button>
            <button
              onClick={() => setProfileState('pending')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                profileState === 'pending'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
              type="button"
            >
              लंबित (Pending)
            </button>
            <button
              onClick={() => setProfileState('incomplete')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                profileState === 'incomplete'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
              type="button"
            >
              अधूरा (Incomplete)
            </button>
            <button
              onClick={() => setProfileState('error')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                profileState === 'error'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-slate-900'
              }`}
              type="button"
            >
              त्रुटि (Error)
            </button>
          </div>
        </div>

        {/* Dynamic Status Banner */}
        {profileState === 'verified' && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col gap-1 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-[#00450d] font-bold">
              <span>✓</span>
              <span>प्रोफ़ाइल सत्यापित (Profile Verified)</span>
            </div>
            <p className="text-stone-600 font-hindi pl-4">
              आधार, समग्र एवं ई-उपार्जन रिकॉर्ड से प्रमाणित किसान खाता।
            </p>
          </div>
        )}

        {profileState === 'pending' && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col gap-1 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <span>⏳</span>
              <span>दस्तावेज़ सत्यापन प्रक्रिया में है (Under Review)</span>
            </div>
            <p className="text-amber-800 font-hindi pl-4">
              आपका खसरा एवं बैंक खाता नोडल अधिकारी द्वारा 24 घंटे में सत्यापित किया जाएगा।
            </p>
          </div>
        )}

        {profileState === 'incomplete' && (
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col gap-2 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <span>⚠️</span>
                <span>पसंदीदा मंडी जोड़ें (Missing Mandi)</span>
              </div>
              <button className="px-2.5 py-1 bg-rose-700 text-white rounded-lg font-bold text-[11px]" type="button">
                पूरा करें
              </button>
            </div>
            <p className="text-rose-800 font-hindi">
              स्लॉट बुकिंग के लिए अपनी मुख्य उपार्जन मंडी जोड़ना आवश्यक है।
            </p>
          </div>
        )}

        {profileState === 'error' && (
          <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center space-y-2 animate-fadeIn shadow-xs">
            <span className="text-3xl">⚠️</span>
            <h4 className="text-sm font-bold text-slate-900">डेटा लोड नहीं हो सका</h4>
            <p className="text-xs text-stone-600">सर्वर से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।</p>
            <button
              onClick={() => setProfileState('verified')}
              className="mt-2 px-4 py-2 bg-[#00450d] text-white rounded-xl text-xs font-bold"
              type="button"
            >
              पुनः लोड करें (Retry)
            </button>
          </div>
        )}

        {/* Farmer Identity Anchor Card */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-[#00450d] flex items-center justify-center text-white font-extrabold text-xl shadow-inner">
                  RK
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow">
                  ✓
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">रमेश कुमार</h2>
                <span className="text-xs text-stone-500 block">Ramesh Kumar</span>
                <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-[#00450d] border border-emerald-200 rounded-full text-[10px] font-bold">
                  🌾 पंजीकृत किसान (Registered)
                </span>
              </div>
            </div>
          </div>

          {/* Farmer ID with 1-Click Copy */}
          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-bold">किसान कोड / Kisan ID</span>
              <span className="text-xs font-mono font-black text-slate-900">KC-FARMER-8849</span>
            </div>
            <button
              onClick={handleCopyFarmerId}
              className="px-3 py-1 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-bold text-[#00450d] transition-all cursor-pointer shadow-2xs"
              type="button"
            >
              {copiedId ? '✓ कॉपीड' : 'कॉपी'}
            </button>
          </div>

          {/* Mobile & Aadhaar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm">
                📱
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">पंजीकृत मोबाइल</span>
                <strong className="text-slate-900 font-mono">+91 ••••••4821</strong>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[11px] font-bold border border-emerald-200">
              आधार लिंक ✓
            </span>
          </div>
        </section>

        {/* Farm & Mandi Visual Gallery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-2xl overflow-hidden shadow-xs h-28 bg-stone-100 border border-stone-200">
            <img
              alt="Wheat fields"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
              <span className="text-[10px] uppercase font-bold opacity-80">रकबा / Land Area</span>
              <span className="text-xs font-extrabold">4.5 एकड़ (Acres)</span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xs h-28 bg-stone-100 border border-stone-200">
            <img
              alt="Mandi centre"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
              <span className="text-[10px] uppercase font-bold opacity-80">मंडी केंद्र / Center</span>
              <span className="text-xs font-extrabold">सीहोर मुख्य मंडी</span>
            </div>
          </div>
        </div>

        {/* Bank & Land Records Card */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>🏦</span>
            <span>बैंक व भूमि रिकॉर्ड विवरण (Bank &amp; Land)</span>
          </h3>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-600">बैंक का नाम:</span>
              <strong className="text-slate-900">भारतीय स्टेट बैंक (SBI)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">खाता संख्या:</span>
              <strong className="text-slate-900 font-mono">•••• •••• 4821</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">IFSC कोड:</span>
              <strong className="text-slate-900 font-mono">SBIN0001234</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">खसरा संख्या:</span>
              <strong className="text-slate-900 font-mono">142/2, 142/3 (सीहोर)</strong>
            </div>
          </div>
        </section>

        {/* Settings & Preferences */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200 space-y-3 text-xs">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <span>⚙️</span>
            <span>ऐप सेटिंग्स (App Preferences)</span>
          </h3>

          {/* Language Selector */}
          <div>
            <span className="text-stone-600 block mb-1.5 font-bold">भाषा चुनें (Language)</span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { code: 'hi', label: 'हिंदी' },
                { code: 'en', label: 'English' },
                { code: 'pa', label: 'ਪੰਜਾਬੀ' },
                { code: 'mr', label: 'मराठी' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as any)}
                  className={`py-2 rounded-xl text-center font-bold transition-all cursor-pointer ${
                    selectedLanguage === lang.code
                      ? 'bg-[#00450d] text-white shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                  type="button"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-2.5 border-t border-stone-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-800">SMS टोकन व तौल सूचनाएं</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-800">वॉयसबॉट कॉल अनुस्मारक</span>
              <input
                type="checkbox"
                checked={voiceAlerts}
                onChange={(e) => setVoiceAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600"
              />
            </label>
          </div>
        </section>

        {/* Logout Action */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
          type="button"
        >
          <span>🚪</span>
          <span>लॉग आउट करें (Logout)</span>
        </button>

      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-800 mx-auto flex items-center justify-center text-xl">
              🚪
            </div>
            <h3 className="text-base font-bold text-slate-900">लॉग आउट की पुष्टि करें</h3>
            <p className="text-xs text-stone-600 font-hindi">
              क्या आप सचमुच अपने किसान खाते से बाहर निकलना चाहते हैं?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold text-xs shadow transition-colors cursor-pointer"
                type="button"
              >
                हाँ, लॉग आउट करें
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                type="button"
              >
                रद्द करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Nav */}
      <FarmerBottomNav />
    </div>
  );
}
