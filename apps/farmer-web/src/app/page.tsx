'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 4 Hero Narrative Slides
const HERO_SLIDES = [
  {
    id: '01',
    tabTitle: '01 · Know Arrival Time',
    headline: 'Know when to come.',
    highlight: 'Know where you stand.',
    hindi: 'समय पर आवक, निश्चित तौल और बैंक खाते में सीधा पारदर्शी भुगतान।',
    body: 'KisanCall coordinates mandi procurement visits with scheduled arrival slots, live queue visibility, electronic weighing, and direct DBT bank settlement.',
    bgImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=2000&q=80',
    cardType: 'slot',
  },
  {
    id: '02',
    tabTitle: '02 · Less Waiting',
    headline: 'Less waiting.',
    highlight: 'More certainty.',
    hindi: 'न्यूनतम प्रतीक्षा, अधिकतम निश्चितता।',
    body: 'Eliminate chaotic 12-hour mandi queues. Receive automated countdown notifications so you arrive directly when your designated scale is ready.',
    bgImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=2000&q=80',
    cardType: 'queue',
  },
  {
    id: '03',
    tabTitle: '03 · Digital Weighing',
    headline: 'From weighing to payment,',
    highlight: 'keep track.',
    hindi: 'कांटे से लेकर बैंक खाते तक सीधी डिजिटल निगरानी।',
    body: 'Tamper-proof serial weighbridge telemetry feeds straight into certified digital J-Form receipts. Real-time PFMS DBT tracking direct to your bank account.',
    bgImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=80',
    cardType: 'weigh',
  },
  {
    id: '04',
    tabTitle: '04 · Simple Phone Call',
    headline: "You don't need an app.",
    highlight: 'A phone call is enough.',
    hindi: 'सिर्फ एक फोन कॉल ही काफी है।',
    body: 'No smartphone or internet required. Dial toll-free 1800-180-1551 from any basic keypad mobile to get spoken voice updates in your regional dialect.',
    bgImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80',
    cardType: 'voice',
  },
];

// 6-Stage Journey Workflow Data
const STAGE_DATA: Record<number, {
  stageNum: string;
  title: string;
  hindi: string;
  body: string;
  mockTitle: string;
  badge: string;
  line1L: string; line1R: string;
  line2L: string; line2R: string;
  line3L: string; line3R: string;
  line4L: string; line4R: string;
  footerLabel: string; footerVal: string;
}> = {
  1: {
    stageNum: '01',
    title: 'Book Your Arrival Slot In Advance',
    hindi: 'मंडी आने से पहले अपनी सुविधानुसार दिन और समय चुनें।',
    body: 'Farmers select their nearest procurement centre, register expected quantity (in bags or quintals), and pick a guaranteed 2-hour arrival window. No crowding outside mandi gates.',
    mockTitle: 'Procurement Appointment Request',
    badge: 'Slot Confirmed',
    line1L: 'Mandi Yard:', line1R: 'Karnal Central Mandi (Haryana)',
    line2L: 'Commodity:', line2R: 'Wheat (Lok-1 / शरबती)',
    line3L: 'Scheduled Date:', line3R: 'Tomorrow • 10:00 AM – 12:00 PM',
    line4L: 'Est. Quantity:', line4R: '100 Bags (~50 Quintals)',
    footerLabel: 'Gate Security Entry Code:', footerVal: 'KC-9042',
  },
  2: {
    stageNum: '02',
    title: 'Arrive & Check-In at Mandi Gate',
    hindi: 'गेट पर डिजिटल चेक-इन और टोकन आवंटन।',
    body: 'Show your SMS PIN or QR pass at the entry gate. Security verifies vehicle registration and issues a digital physical token that feeds into the central display board.',
    mockTitle: 'Gate Security Check-In Verification',
    badge: 'Vehicle Admitted',
    line1L: 'Gate Pass Token:', line1R: 'Token #047 (Lane 2)',
    line2L: 'Tractor Registration:', line2R: 'HR-05-AB-9821',
    line3L: 'Gate Check Time:', line3R: 'Today • 09:52 AM',
    line4L: 'Farmer ID (Meri Fasal):', line4R: 'Verified (Aadhaar Seeded)',
    footerLabel: 'Assigned Waiting Yard:', footerVal: 'Bay C - North Shade',
  },
  3: {
    stageNum: '03',
    title: 'Live Transparent Queue Tracking',
    hindi: 'मोबाइल पर लाइव टोकन क्रम और अनुमानित समय की जानकारी।',
    body: 'Relax under shaded farmer bays. KisanCall monitors weighing progress across scales and pushes an automated countdown notification when you have two farmers ahead.',
    mockTitle: 'Yard Queue Live Telemetry',
    badge: '16 Farmers Ahead',
    line1L: 'Current Serving Token:', line1R: '#031 on Scale #2',
    line2L: 'Your Position:', line2R: '#047 (Estimated 42 Min)',
    line3L: 'Scales Active:', line3R: '4 Operational Bridges',
    line4L: 'Throughput Rate:', line4R: '22 Tractors / Hour',
    footerLabel: 'Automated SMS Alert:', footerVal: 'Scheduled at #045',
  },
  4: {
    stageNum: '04',
    title: 'Certified Electronic Weighing',
    hindi: 'कंप्यूटरीकृत धर्मकांटा तौल, कोई मैन्युअल छेड़छाड़ नहीं।',
    body: 'Weighbridge transmits weight data over tamper-proof serial cables directly to state procurement servers. Moisture and grain foreign matter analyzers record readings instantly.',
    mockTitle: 'Weighbridge Digital Telemetry Slip',
    badge: 'Gross Weight Captured',
    line1L: 'Scale Indicator ID:', line1R: 'WB-DIGI-KARNAL-04',
    line2L: 'Gross Weight:', line2R: '78.40 Quintal (Tractor+Load)',
    line3L: 'Tare Weight (Empty):', line3R: '29.80 Quintal',
    line4L: 'Net Wheat Procured:', line4R: '48.60 Quintals',
    footerLabel: 'Certified Moisture Reading:', footerVal: '10.4% (FAQ Grade Pass)',
  },
  5: {
    stageNum: '05',
    title: 'Instant Digital J-Form Generation',
    hindi: 'तौल पूरा होते ही पक्की खरीद रसीद (जे-फॉर्म) जारी।',
    body: 'The mandi procurement officer signs the digital J-form. The farmer receives an official receipt on SMS and smartphone with rate calculations based on the approved MSP rate.',
    mockTitle: 'Official Procurement J-Form Receipt',
    badge: 'Form Approved',
    line1L: 'J-Form Certificate No:', line1R: 'JF-HR-2026-901844',
    line2L: 'Net Quantity:', line2R: '48.60 Quintals',
    line3L: 'Approved Rate (MSP):', line3R: '₹2,425.00 / Qtl',
    line4L: 'Gross Amount Payable:', line4R: '₹1,17,855.00',
    footerLabel: 'Digital Sign Verification:', footerVal: 'APMC Secretary (Valid)',
  },
  6: {
    stageNum: '06',
    title: 'Direct Bank Account (DBT) Transfer',
    hindi: 'आधार लिंक बैंक खाते में सीधे 24-48 घंटों के भीतर भुगतान।',
    body: 'Public Financial Management System (PFMS) clears payment directly into the farmer\'s Aadhaar-linked bank account with confirmation SMS and automated voice receipt.',
    mockTitle: 'PFMS Direct Benefit Transfer Status',
    badge: 'Disbursement Scheduled',
    line1L: 'Beneficiary Account:', line1R: 'State Bank of India (••9102)',
    line2L: 'PFMS Reference UTR:', line2R: 'KC-PAY-2026-89412B',
    line3L: 'Net Remitted Total:', line3R: '₹1,17,855.00',
    line4L: 'Expected Settlement:', line4R: 'Within 24 Hours',
    footerLabel: 'Bank Confirmation Alert:', footerVal: 'Voice Call + SMS Alert',
  },
};

export default function MasterHomepage() {
  // Hero Slideshow State
  const [heroTab, setHeroTab] = useState(0);
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // 6-stage workflow
  const [activeStage, setActiveStage] = useState(1);

  // Chart range
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('7d');

  // Dialect state
  const [selectedDialect, setSelectedDialect] = useState<'hindi' | 'punjabi' | 'haryanvi' | 'malwi'>('hindi');
  const [isDialerPlaying, setIsDialerPlaying] = useState(false);

  // App Switcher preview
  const [appPreviewTab, setAppPreviewTab] = useState<'farmer' | 'staff'>('farmer');

  // Language Toggle
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-advancing Hero Slideshow with progress timer
  useEffect(() => {
    if (isHoveringHero) return;

    const intervalTime = 6500;
    const updateFreq = 50;
    const step = (updateFreq / intervalTime) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          setHeroTab((current) => (current + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, updateFreq);

    return () => clearInterval(timer);
  }, [isHoveringHero, heroTab]);

  const handleSelectTab = (idx: number) => {
    setHeroTab(idx);
    setSlideProgress(0);
  };

  // Dialect playback simulation
  const handlePlayVoice = (dialect: 'hindi' | 'punjabi' | 'haryanvi' | 'malwi') => {
    setSelectedDialect(dialect);
    setIsDialerPlaying(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const phrases = {
        hindi: 'नमस्ते, किसान कॉल सेवा में आपका स्वागत है। करनाल मंडी में आपका टोकन नंबर 47 है।',
        punjabi: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ ਕਾਲ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਤੁਹਾਡਾ ਟੋਕਨ ਨੰਬਰ 47 ਹੈ।',
        haryanvi: 'राम राम, किसान कॉल सेवा म थारा स्वागत स। थारा टोकन नंबर 47 स।',
        malwi: 'जय श्री राम, किसान कॉल सेवा मा आपणो स्वागत छे। आपणो टोकन नंबर 47 छे।',
      };
      const utterance = new SpeechSynthesisUtterance(phrases[dialect]);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsDialerPlaying(false);
      utterance.onerror = () => setIsDialerPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsDialerPlaying(false), 3500);
    }
  };

  const currentStage = STAGE_DATA[activeStage];

  // Dynamic Chart Paths
  const chartConfig = {
    '7d': {
      line: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80',
      area: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80 L 700,180 L 0,180 Z',
      labels: ['25 Feb (₹2,360)', '27 Feb (₹2,390)', '01 Mar (₹2,410)', 'Today 06 Mar (₹2,450)'],
    },
    '14d': {
      line: 'M 0,160 Q 180,140 350,110 T 700,85',
      area: 'M 0,160 Q 180,140 350,110 T 700,85 L 700,180 L 0,180 Z',
      labels: ['18 Feb (₹2,320)', '22 Feb (₹2,350)', '28 Feb (₹2,400)', 'Today 06 Mar (₹2,450)'],
    },
    '30d': {
      line: 'M 0,170 Q 200,160 400,120 T 700,75',
      area: 'M 0,170 Q 200,160 400,120 T 700,75 L 700,180 L 0,180 Z',
      labels: ['01 Feb (₹2,280)', '10 Feb (₹2,310)', '20 Feb (₹2,380)', 'Today 06 Mar (₹2,450)'],
    },
  }[chartRange];

  return (
    <div className="min-h-screen bg-stonebg-50 text-charcoal-900 font-sans selection:bg-brand-900 selection:text-white">
      
      {/* 1. INSTITUTIONAL TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stonebg-200 transition-shadow duration-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Brand Identity */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
                <img
                  src="/logo.png"
                  alt="KisanCall Logo"
                  className="h-11 w-auto object-contain rounded-md bg-white p-0.5 border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-brand-950 font-sans">
                      KISAN<span className="text-harvest">CALL</span>
                    </span>
                    <span className="inline-block text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-100">
                      National
                    </span>
                  </div>
                  <span className="text-xs font-hindi text-charcoal-600 tracking-normal font-medium leading-none">
                    कृषि उपार्जन समन्वय व पारदर्शी तुलाई
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-charcoal-700">
              <a className="hover:text-brand-900 transition-colors py-2 whitespace-nowrap" href="#how-it-works">How It Works</a>
              <a className="hover:text-brand-900 transition-colors py-2 whitespace-nowrap" href="#live-queue">Live Mandi Queue</a>
              <a className="hover:text-brand-900 transition-colors py-2 whitespace-nowrap" href="#mandi-prices">Mandi &amp; MSP Rates</a>
              <a className="hover:text-brand-900 transition-colors py-2 flex items-center gap-1.5 whitespace-nowrap" href="#voice-engine">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Voice Helpline
              </a>
              <a className="hover:text-brand-900 transition-colors py-2 whitespace-nowrap" href="#verification">Audit &amp; Proof</a>
            </nav>

            {/* Right Action Portals */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center bg-stonebg-100 p-0.5 rounded-lg border border-stonebg-200 text-xs font-semibold">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-white text-brand-950 shadow-xs font-bold' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  type="button"
                >
                  English
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1.5 rounded font-hindi transition-all cursor-pointer ${
                    lang === 'hi' ? 'bg-white text-brand-950 shadow-xs font-bold' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  type="button"
                >
                  हिंदी
                </button>
              </div>

              {/* Farmer Portal CTA */}
              <Link
                href="/farmer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-900 hover:bg-brand-800 shadow-sm transition-all focus:ring-2 focus:ring-brand-700 cursor-pointer gap-1.5 whitespace-nowrap h-9.5"
              >
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <span>किसान सेवा पोर्टल (Farmer)</span>
              </Link>

              {/* Procurement Staff Portal */}
              <Link
                href="/staff/login"
                className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-bold text-charcoal-800 bg-stonebg-100 hover:bg-stonebg-200 border border-stonebg-300 transition-all cursor-pointer gap-1.5 whitespace-nowrap h-9.5"
              >
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>केंद्र लॉगिन (Staff)</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-charcoal-700 hover:text-brand-900 hover:bg-stonebg-100 cursor-pointer"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stonebg-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-charcoal-800 hover:text-brand-900" href="#how-it-works">How It Works</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-charcoal-800 hover:text-brand-900" href="#live-queue">Live Mandi Queue</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-charcoal-800 hover:text-brand-900" href="#mandi-prices">Mandi &amp; MSP Rates</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-charcoal-800 hover:text-brand-900" href="#voice-engine">Voice Helpline (1800-180-1551)</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-charcoal-800 hover:text-brand-900" href="#verification">Audit &amp; Tamper-Proofing</a>
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/farmer" className="w-full text-center py-2.5 rounded-lg bg-brand-900 text-white font-bold text-sm flex items-center justify-center gap-2">
                <span>किसान सेवा पोर्टल (Farmer Access)</span>
                <span>→</span>
              </Link>
              <Link href="/staff/login" className="w-full text-center py-2.5 rounded-lg bg-stonebg-100 text-charcoal-800 border border-stonebg-300 font-bold text-sm">
                केंद्र लॉगिन (Staff Dashboard)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. CINEMATIC HERO SLIDESHOW SECTION */}
      <section
        className="relative min-h-[90vh] bg-brand-950 text-white flex items-center overflow-hidden transition-all duration-700"
        data-purpose="cinematic-hero"
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
      >
        {/* Background Images Crossfade */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              heroTab === idx ? 'opacity-60 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              alt={slide.headline}
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
              src={slide.bgImage}
            />
          </div>
        ))}

        {/* Deep Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/40 z-1"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-brand-950/50 to-brand-950/90 z-1"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          
          {/* Interactive 4-Pill Narrative Switcher with Smooth Progress Bars */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 gap-1.5" role="tablist">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSelectTab(idx)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer overflow-hidden ${
                    heroTab === idx
                      ? 'bg-brand-800/90 text-white shadow-sm ring-1 ring-white/30'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                  type="button"
                >
                  {/* Active Slide Progress Line */}
                  {heroTab === idx && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-harvest transition-all duration-75"
                      style={{ width: `${slideProgress}%` }}
                    />
                  )}
                  <span className="relative z-10">{slide.tabTitle}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Primary Pitch with Staggered Transition */}
            <div className="lg:col-span-7 space-y-6 animate-fadeIn" key={`text-${heroTab}`}>
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-harvest/20 border border-harvest/40 text-harvest-light text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-harvest animate-ping"></span>
                <span>RABI PROCUREMENT SEASON 2025–26 LIVE</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  {HERO_SLIDES[heroTab].headline} <br className="hidden sm:block" />
                  <span className="text-harvest-light">{HERO_SLIDES[heroTab].highlight}</span>
                </h1>
                <p className="font-hindi text-xl sm:text-2xl text-stone-200 font-medium leading-relaxed">
                  {HERO_SLIDES[heroTab].hindi}
                </p>
                <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-normal">
                  {HERO_SLIDES[heroTab].body}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link
                  href="/farmer"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-bold text-white bg-brand-700 hover:bg-brand-600 border border-brand-500/50 shadow-lg hover:shadow-brand-700/30 transition-all gap-2 group cursor-pointer"
                >
                  <span>किसान सेवा पोर्टल (Track Arrival &amp; Queue)</span>
                  <span className="transition-transform group-hover:translate-x-1 font-mono">→</span>
                </Link>

                <Link
                  href="/staff/login"
                  className="inline-flex items-center justify-center px-5 py-4 rounded-xl text-sm font-semibold text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xs transition-all cursor-pointer gap-2"
                >
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                  </svg>
                  <span>उपार्जन केंद्र पोर्टल (Staff Desk)</span>
                </Link>
              </div>

              {/* Institutional Trust Badges */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-8 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>NIC &amp; PFMS Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-harvest-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Toll-Free IVR (Works on 2G Keypad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
                  <span className="text-white font-medium">1,482 Mandi Hubs Active</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Supporting Product Visualizations */}
            <div className="lg:col-span-5" data-purpose="hero-live-card">
              
              {/* Card 1: Slot & Gate Pass Mockup (Slide 0) */}
              {heroTab === 0 && (
                <div className="bg-white text-charcoal-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
                  <div className="bg-brand-900 text-white p-5 border-b border-brand-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono uppercase tracking-wider text-harvest-light font-semibold">
                        LIVE MANDI GATE PASS
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
                        Active Gate Feed
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">Karnal Central Procurement Centre</h3>
                    <p className="text-xs text-stone-300 mt-0.5">Karnal District, Haryana • Today&apos;s Wheat Lot</p>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-stonebg-200 bg-stonebg-100 border-b border-stonebg-200 text-center py-2.5">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-semibold">Total Arrived</span>
                      <span className="text-base font-bold text-brand-950 font-mono">124 Farmers</span>
                    </div>
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-semibold">In Line Now</span>
                      <span className="text-base font-bold text-harvest-dark font-mono">18 In Queue</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-charcoal-600 tracking-wider">Assigned Token</span>
                        <div className="text-4xl font-extrabold text-brand-900 font-mono tracking-tight mt-0.5">#047</div>
                        <span className="text-xs font-semibold text-charcoal-700">Rameshwar Patel • HR-05-AB-9821</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs uppercase font-bold text-charcoal-600 tracking-wider">Est. Wait Time</span>
                        <div className="text-2xl font-bold text-brand-950 font-mono mt-0.5 text-harvest-dark">~42 Min</div>
                        <span className="text-[11px] text-emerald-700 font-medium">16 vehicles ahead</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-brand-800">1. Arrived (09:52 AM)</span>
                        <span className="text-brand-900 underline decoration-harvest decoration-2">2. In Queue</span>
                        <span className="text-charcoal-600">3. Weighing</span>
                        <span className="text-charcoal-600">4. Payment</span>
                      </div>
                      <div className="w-full bg-stonebg-200 h-2 rounded-full overflow-hidden flex">
                        <div className="w-1/4 bg-brand-700"></div>
                        <div className="w-1/4 bg-harvest relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                        </div>
                        <div className="w-2/4 bg-stonebg-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2: Live Queue Countdown & Shaded Bay Dispatch (Slide 1) */}
              {heroTab === 1 && (
                <div className="bg-white text-charcoal-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
                  <div className="bg-brand-900 text-white p-5 border-b border-brand-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-harvest-light font-semibold block">
                        YARD TELEMETRY
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">Shaded Bay Dispatch Stream</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-mono border border-emerald-400/30">
                      Scale #2 Active
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-900 uppercase">Now Serving at Weighbridge</span>
                        <div className="text-3xl font-black text-[#00450d] font-mono mt-0.5">Token #031</div>
                        <span className="text-xs text-stone-600">Truck Scale 02 (Lok-1 Wheat)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">Throughput</span>
                        <div className="text-lg font-bold text-stone-900 font-mono">3.2 Min/Scale</div>
                      </div>
                    </div>

                    <div className="p-4 bg-stonebg-100 rounded-xl border border-stonebg-300 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-charcoal-800">
                        <span>Your Assigned Token: #047</span>
                        <span className="text-harvest-dark font-mono">16 Farmers Ahead</span>
                      </div>
                      <p className="text-xs text-charcoal-600 font-hindi">
                        स्वचालित एसएमएस और फोन अलर्ट आपको 2 किसान पहले भेज दिया जाएगा।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Electronic Weighbridge Telemetry Slip (Slide 2) */}
              {heroTab === 2 && (
                <div className="bg-white text-charcoal-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
                  <div className="bg-brand-900 text-white p-5 border-b border-brand-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-harvest-light font-semibold block">
                        CERTIFIED SCALE TELEMETRY
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">Digital Serial Weight Output</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 text-white rounded text-xs font-bold">
                      WB-04 PASS
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Gross (Load+Tractor)</span>
                        <strong className="text-base font-bold text-slate-900 font-mono">78.40 Qtl</strong>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Tare (Empty Vehicle)</span>
                        <strong className="text-base font-bold text-slate-900 font-mono">29.80 Qtl</strong>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-900 uppercase">Net Certified Procurement</span>
                        <div className="text-2xl font-black text-[#00450d] font-mono">48.60 Quintals</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold">Moisture</span>
                        <div className="text-sm font-bold text-emerald-900 font-mono">10.4% FAQ Pass</div>
                      </div>
                    </div>

                    <div className="p-3 bg-stonebg-100 rounded-lg text-xs flex justify-between items-center text-charcoal-700">
                      <span>Total Net Payable (MSP ₹2,425):</span>
                      <strong className="text-sm font-bold text-brand-950 font-mono">₹1,17,855.00</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 4: IVR Multilingual Telephony Waveform (Slide 3) */}
              {heroTab === 3 && (
                <div className="bg-white text-charcoal-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
                  <div className="bg-brand-900 text-white p-5 border-b border-brand-800 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-harvest-light font-semibold block">
                        TOLL-FREE IVR ENGINE
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">1800-180-1551 Helpline</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-mono border border-emerald-400/30">
                      Live Telephony
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="p-4 bg-slate-950 text-white rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Spoken Voice Channel #4</span>
                        <span className="text-emerald-400 font-mono">● Connected</span>
                      </div>
                      <p className="font-hindi text-sm text-stone-200 leading-relaxed">
                        &ldquo;नमस्ते रमेश जी, करनाल मंडी में आपका टोकन 047 है। आपके आगे 16 किसान हैं।&rdquo;
                      </p>
                      <div className="flex items-center gap-1.5 pt-2">
                        <div className="h-1.5 flex-1 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="h-3 flex-1 bg-emerald-400 rounded-full"></div>
                        <div className="h-2 flex-1 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="h-4 flex-1 bg-emerald-400 rounded-full"></div>
                        <div className="h-1.5 flex-1 bg-emerald-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-center font-bold">
                      <div className="p-2.5 bg-stonebg-100 rounded-lg border border-stonebg-200">
                        2G Keypad Compatible
                      </div>
                      <div className="p-2.5 bg-stonebg-100 rounded-lg border border-stonebg-200">
                        4 Regional Dialects
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 3. LIVE APMC PROCUREMENT TICKER */}
      <section className="bg-brand-900 border-y border-brand-800 text-stone-200 py-3 overflow-x-auto ticker-bar" data-purpose="live-ticker-strip">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 text-xs font-mono tracking-tight whitespace-nowrap">
          <div className="flex items-center gap-2 font-bold text-white uppercase text-[11px] bg-brand-950 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
            LIVE MANDI FEED
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-300">Karnal Central (HR):</span>
            <span className="font-bold text-white">Wheat Lok-1 ₹2,425/Qtl</span>
            <span className="text-emerald-400 font-semibold">(+₹25 MSP)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-300">Sehore Mandi (MP):</span>
            <span className="font-bold text-white">Sharbati ₹2,450/Qtl</span>
            <span className="text-emerald-400 font-semibold">(+₹50 MSP)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-300">Indore APMC (MP):</span>
            <span className="font-bold text-white">Gram (चना) ₹5,650/Qtl</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-300">Sirsa Yard (HR):</span>
            <span className="font-bold text-white">Mustard (सरसों) ₹5,950/Qtl</span>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS: 6-STAGE PROGRESSIVE JOURNEY */}
      <section className="py-20 bg-stonebg-50 text-charcoal-900" id="how-it-works" data-purpose="lifecycle-journey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-harvest-dark bg-harvest/10 px-2.5 py-1 rounded border border-harvest/20 inline-block mb-3">
              END-TO-END PROCUREMENT LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 leading-tight">
              A transparent, dignified mandi journey <br />
              <span className="text-harvest-dark">from advance booking to bank credit.</span>
            </h2>
            <p className="font-hindi text-lg sm:text-xl text-charcoal-700 mt-2 font-medium">
              मंडी गेट से लेकर बैंक खाते तक, हर चरण पारदर्शी और आपके फोन पर लाइव उपलब्ध है।
            </p>
          </div>

          {/* 6 Sequential Milestone Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
            {[
              { num: 1, label: '01. Book Slot' },
              { num: 2, label: '02. Gate Arrival' },
              { num: 3, label: '03. Live Queue' },
              { num: 4, label: '04. Scale Weigh' },
              { num: 5, label: '05. J-Form Slip' },
              { num: 6, label: '06. DBT Payment' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setActiveStage(step.num)}
                className={`py-3 px-3 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                  activeStage === step.num
                    ? 'bg-brand-900 text-white border-brand-900 shadow-md ring-2 ring-brand-700/20'
                    : 'bg-white text-charcoal-700 hover:bg-stonebg-100 border-stonebg-300'
                }`}
                type="button"
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* Detailed Stage Interactive Card */}
          <div className="bg-white rounded-2xl border border-stonebg-300 shadow-lg p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn" key={`stage-${activeStage}`}>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-50 text-brand-900 text-xs font-bold border border-brand-200">
                <span>STAGE {currentStage.stageNum} OF 06</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-950">{currentStage.title}</h3>
              <p className="font-hindi text-base sm:text-lg text-charcoal-800 font-medium leading-relaxed">
                {currentStage.hindi}
              </p>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                {currentStage.body}
              </p>
              <div className="pt-2">
                <Link
                  href="/farmer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-900 hover:text-brand-700 underline"
                >
                  <span>Experience this step in Farmer Portal</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-stonebg-100 rounded-xl p-6 border border-stonebg-300 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stonebg-200">
                <h4 className="text-xs font-bold text-brand-950 uppercase tracking-wider">{currentStage.mockTitle}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {currentStage.badge}
                </span>
              </div>

              <div className="space-y-2 text-xs text-charcoal-800">
                <div className="flex justify-between py-1 border-b border-stonebg-200/60">
                  <span className="text-charcoal-600">{currentStage.line1L}</span>
                  <strong className="font-mono text-charcoal-900">{currentStage.line1R}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stonebg-200/60">
                  <span className="text-charcoal-600">{currentStage.line2L}</span>
                  <strong className="font-mono text-charcoal-900">{currentStage.line2R}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stonebg-200/60">
                  <span className="text-charcoal-600">{currentStage.line3L}</span>
                  <strong className="font-mono text-charcoal-900">{currentStage.line3R}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-charcoal-600">{currentStage.line4L}</span>
                  <strong className="font-mono text-charcoal-900">{currentStage.line4R}</strong>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stonebg-200 text-xs flex justify-between items-center">
                <span className="text-charcoal-600">{currentStage.footerLabel}</span>
                <strong className="text-brand-950 font-mono">{currentStage.footerVal}</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. LIVE QUEUE & YARD TELEMETRY HIGHLIGHT */}
      <section className="py-20 bg-brand-950 text-white" id="live-queue" data-purpose="live-queue-highlight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-harvest-light bg-harvest/20 px-2.5 py-1 rounded border border-harvest/30 inline-block">
                REAL-TIME YARD DISPATCH
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Track every token. <br />
                <span className="text-harvest-light">Never wait blindly again.</span>
              </h2>
              <p className="font-hindi text-xl text-stone-200 font-medium leading-relaxed">
                कतार में आपका स्थान, आगे कितने किसान हैं और अनुमानित समय — सब कुछ आपके मोबाइल पर।
              </p>
              <p className="text-stone-300 text-sm leading-relaxed">
                KisanCall central yard software syncs with scale transponders. It monitors incoming tractors and balances loads across available weighbridges to minimize idle waiting time.
              </p>
              <div className="pt-2 flex gap-4">
                <Link
                  href="/farmer"
                  className="px-6 py-3.5 bg-brand-700 hover:bg-brand-600 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <span>Open Live Yard Map</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-harvest-light font-bold block">LIVE DISPATCH</span>
                  <h4 className="text-base font-bold text-white">Karnal Central Mandi Yard</h4>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono border border-emerald-500/30">
                  4 Scales Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Arrived</span>
                  <strong className="text-lg font-black text-white font-mono mt-0.5 block">124</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Currently In Line</span>
                  <strong className="text-lg font-black text-amber-400 font-mono mt-0.5 block">18</strong>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg Scale Time</span>
                  <strong className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">3.2 Min</strong>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Current Serving Token:</span>
                  <strong className="text-emerald-400 font-mono text-sm">#031 (Scale 2)</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Next Ready in Line:</span>
                  <strong className="text-white font-mono">#032, #033, #034</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. MANDI RATES & MSP BENCHMARK SECTION (WITH ANIMATED PRICE CHART) */}
      <section className="py-20 bg-stonebg-50 text-charcoal-900" id="mandi-prices" data-purpose="market-rates">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-harvest-dark bg-harvest/10 px-2.5 py-1 rounded border border-harvest/20 inline-block mb-3">
              TRANSPARENT MARKET INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 leading-tight">
              Real-time Mandi Rates vs. <br />
              <span className="text-harvest-dark">Government Support Price (MSP).</span>
            </h2>
            <p className="font-hindi text-lg sm:text-xl text-charcoal-700 mt-2 font-medium">
              मंडी भाव और सरकारी समर्थन मूल्य हमेशा स्पष्ट और अलग-अलग प्रदर्शित।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Price Chart Container */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stonebg-200">
                <div>
                  <h3 className="text-xl font-bold text-brand-950">Wheat (Lok-1 / शरबती) — 7-Day Trend</h3>
                  <p className="text-xs text-charcoal-600 mt-0.5">Sehore &amp; Karnal Mandi Average Modal Prices</p>
                </div>
                <div className="flex gap-1.5 bg-stonebg-100 p-1 rounded-lg border border-stonebg-200 text-xs font-semibold">
                  {(['7d', '14d', '30d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        chartRange === r ? 'bg-brand-900 text-white shadow-xs font-bold' : 'text-charcoal-600 hover:text-brand-950'
                      }`}
                      type="button"
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated SVG Curve Chart */}
              <div className="w-full h-48 sm:h-56 relative bg-stonebg-50 rounded-xl p-4 border border-stonebg-200 overflow-hidden flex flex-col justify-between">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#15803D" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#15803D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={chartConfig.area} fill="url(#chartGrad)" />
                  <path
                    d={chartConfig.line}
                    fill="none"
                    stroke="#15803D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-chart-line"
                    key={`chart-${chartRange}`}
                  />
                </svg>
                <div className="flex justify-between text-[11px] font-mono text-charcoal-600 font-medium pt-2 border-t border-stonebg-200">
                  {chartConfig.labels.map((lbl, idx) => (
                    <span key={idx}>{lbl}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-stonebg-100 rounded-xl border border-stonebg-200">
                  <span className="text-charcoal-600 block text-[10px] uppercase font-bold">Govt MSP 2025-26</span>
                  <strong className="text-base text-slate-900 font-mono mt-0.5 block">₹2,400 / Qtl</strong>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 block text-[10px] uppercase font-bold">Today&apos;s Modal Price</span>
                  <strong className="text-base text-[#00450d] font-mono mt-0.5 block">₹2,450 / Qtl</strong>
                </div>
                <div className="p-3 bg-stonebg-100 rounded-xl border border-stonebg-200">
                  <span className="text-charcoal-600 block text-[10px] uppercase font-bold">Daily Minimum</span>
                  <strong className="text-base text-slate-900 font-mono mt-0.5 block">₹2,380 / Qtl</strong>
                </div>
                <div className="p-3 bg-stonebg-100 rounded-xl border border-stonebg-200">
                  <span className="text-charcoal-600 block text-[10px] uppercase font-bold">Daily Maximum</span>
                  <strong className="text-base text-slate-900 font-mono mt-0.5 block">₹2,520 / Qtl</strong>
                </div>
              </div>
            </div>

            {/* Side Card: Price Intelligence Feature */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-stonebg-300 shadow-md space-y-3">
                <h4 className="text-sm font-bold text-brand-950 uppercase tracking-wider">Agmarknet Verified Feed</h4>
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  Price indices update directly from mandi trade ledgers twice daily. Farmers can compare rates across neighboring districts before booking arrival slots.
                </p>
                <Link
                  href="/farmer/prices"
                  className="w-full py-3 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>View All Crop Prices (मंडी भाव)</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="bg-harvest/10 border border-harvest/30 p-5 rounded-2xl text-xs text-charcoal-900 space-y-2 font-hindi">
                <strong className="block text-sm text-harvest-dark font-bold">पारदर्शी तौल गारंटी</strong>
                <p>खरीद केंद्र पर तौल और नमी के आधार पर अंतिम भुगतान तय होता है। शून्य कटौती नीति लागू है।</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. MULTILINGUAL VOICE TELEPHONY ENGINE (1800-180-1551) */}
      <section className="py-20 bg-brand-950 text-white" id="voice-engine" data-purpose="voice-telephony">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-harvest-light bg-harvest/20 px-2.5 py-1 rounded border border-harvest/30 inline-block">
                VOICE-FIRST MULTILINGUAL ACCESSIBILITY
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Designed for any phone. <br />
                <span className="text-harvest-light">Dial 1800-180-1551.</span>
              </h2>
              <p className="font-hindi text-xl text-stone-200 font-medium leading-relaxed">
                स्मार्टफोन या इंटरनेट के बिना भी सिर्फ एक साधारण फोन कॉल से अपनी बारी और भुगतान जानें।
              </p>
              <p className="text-stone-300 text-sm leading-relaxed">
                KisanCall natural voice AI understands regional dialects. Dial toll-free to inquire about token status, weather forecasts, scale availability, or confirmed DBT payouts.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2">
                {(['hindi', 'punjabi', 'haryanvi', 'malwi'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => handlePlayVoice(d)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize border ${
                      selectedDialect === d
                        ? 'bg-harvest text-brand-950 border-harvest font-black shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                    type="button"
                  >
                    {d === 'hindi' ? 'हिंदी (Hindi)' : d === 'punjabi' ? 'ਪੰਜਾਬੀ (Punjabi)' : d === 'haryanvi' ? 'हरियाणवी (Haryanvi)' : 'मालवी (Malwi)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-xs font-mono text-harvest-light uppercase font-bold">VOICE DIALER SIMULATOR</span>
                <span className="text-xs font-mono text-emerald-400">{isDialerPlaying ? '● Audio Active' : '● Ready'}</span>
              </div>

              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    📞
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">1800-180-1551 (Toll Free)</h4>
                    <p className="text-xs text-slate-400 capitalize">{selectedDialect} Channel Selected</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handlePlayVoice(selectedDialect)}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    type="button"
                  >
                    <span>{isDialerPlaying ? 'Playing Audio...' : 'Simulate Spoken Response (ऑडियो सुनें)'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. TAMPER-PROOF PROOF & POLYGON AUDIT LEDGER */}
      <section className="py-20 bg-stonebg-50 text-charcoal-900" id="verification" data-purpose="proof-ledger">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-harvest-dark bg-harvest/10 px-2.5 py-1 rounded border border-harvest/20 inline-block mb-3">
              MATHEMATICAL CERTAINTY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 leading-tight">
              Cryptographic weighbridge verification <br />
              <span className="text-harvest-dark">anchored on public blockchain.</span>
            </h2>
            <p className="font-hindi text-lg sm:text-xl text-charcoal-700 mt-2 font-medium">
              धर्मकांटा तौल से लेकर भुगतान तक, हर आंकड़ा डिजिटल रूप से सुरक्षित और अपरिवर्तनीय है।
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stonebg-300 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl font-bold text-brand-950">5-Step Cryptographic Audit Trail</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                When a scale captures tractor load, a SHA-256 state hash is computed alongside serial calibration tokens. The hash anchors to Polygon Amoy for public dispute verification.
              </p>
              <div className="p-4 bg-stonebg-100 rounded-xl border border-stonebg-300 space-y-2 font-mono text-xs text-charcoal-800">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Sample Proof Hash:</span>
                  <span className="text-emerald-800 font-bold">0x9f82...104a</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Network:</span>
                  <span>Polygon Amoy Testnet (POS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Ledger Status:</span>
                  <span className="text-emerald-700 font-bold">Anchored (Block #14920412)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 rounded-xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="text-slate-400 font-mono">ProofAnchor.sol Smart Contract</span>
                <span className="text-emerald-400 font-mono">● Verified</span>
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p className="text-emerald-400">// Event: ProcurementAnchored</p>
                <p>emit ProofLogged(txId: &quot;KC-PAY-2026-89412&quot;, weight: 4550, rate: 2450);</p>
                <p className="text-slate-400">// Farmer &amp; Secretary Dual Multi-Signature Confirmed</p>
              </div>
              <div className="pt-2">
                <Link
                  href="/farmer/slips"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>View Sample Verified J-Form Slip</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DUAL PORTAL SHOWCASE (FARMER APP & STAFF CONSOLE) */}
      <section className="py-20 bg-stonebg-100 text-charcoal-900 border-t border-stonebg-300" id="portal-access" data-purpose="dual-portal-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-brand-900 bg-brand-50 px-2.5 py-1 rounded border border-brand-200 inline-block mb-3">
              UNIFIED DEPLOYMENT ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-950 leading-tight">
              One platform. <br />
              <span className="text-harvest-dark">Dedicated interfaces for farmers &amp; staff.</span>
            </h2>
          </div>

          <div className="flex gap-2 mb-8 border-b border-stonebg-300 pb-4">
            <button
              onClick={() => setAppPreviewTab('farmer')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                appPreviewTab === 'farmer'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-white text-charcoal-700 hover:bg-stonebg-200 border border-stonebg-300'
              }`}
              type="button"
            >
              Farmer Service Portal (/farmer)
            </button>
            <button
              onClick={() => setAppPreviewTab('staff')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                appPreviewTab === 'staff'
                  ? 'bg-brand-900 text-white shadow-sm'
                  : 'bg-white text-charcoal-700 hover:bg-stonebg-200 border border-stonebg-300'
              }`}
              type="button"
            >
              Mandi Staff Desk (/staff)
            </button>
          </div>

          {/* Tab 1: Farmer App Preview */}
          {appPreviewTab === 'farmer' && (
            <div className="bg-white rounded-2xl border border-stonebg-300 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-md">
                  FARMER WEB &amp; MOBILE PORTAL
                </span>
                <h3 className="text-2xl font-bold text-brand-950">Kisan Seva Dashboard &amp; Leaflet Map</h3>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  Interactive slot reservation wizard, live mandi queue tracking, GPS pin mapping across state mandis, Agmarknet MSP rate comparison, and direct DBT bank settlement tracking.
                </p>
                <div className="pt-2">
                  <Link
                    href="/farmer"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm gap-2 cursor-pointer"
                  >
                    <span>Launch Farmer Portal</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-800 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-slate-400 font-mono ml-2">/farmer</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">● Live Status</span>
                </div>
                <div className="py-6 px-4 bg-slate-950 rounded-lg mt-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-harvest-light font-bold text-sm">Token #047 • Rameshwar Patel</span>
                    <span className="bg-emerald-900 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono">In Queue</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Mandi Centre:</span>
                      <strong className="text-white">Karnal Central (Haryana)</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Assigned Scale:</span>
                      <strong className="text-emerald-400">Scale #2 (Est. 42 Min)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Mandi Staff Console Preview */}
          {appPreviewTab === 'staff' && (
            <div className="bg-white rounded-2xl border border-stonebg-300 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold rounded-md">
                  STAFF DASHBOARD (/staff)
                </span>
                <h3 className="text-2xl font-bold text-brand-950">Mandi Operator &amp; Supervisor Console</h3>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  Gate arrival check-in with QR code scanners, live weighbridge procurement entry, digital J-Form signature approvals, and direct DBT bank disbursement execution.
                </p>
                <div className="pt-2">
                  <Link
                    href="/staff/login"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm gap-2 cursor-pointer"
                  >
                    <span>Launch Staff Dashboard</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-800 text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="text-slate-400 font-mono ml-2">/staff/login</span>
                  </div>
                  <span className="text-sky-400 font-mono text-[11px]">● Ready</span>
                </div>
                <div className="py-6 px-4 bg-slate-950 rounded-lg mt-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sky-300 font-bold text-sm">Operator Desk: Sunil Kumar (Gate 1)</span>
                    <span className="bg-sky-900/80 text-sky-100 text-[10px] px-2 py-0.5 rounded font-mono">Supervisor Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
                    <div className="bg-slate-900 p-2.5 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Today Arrived</span>
                      <strong className="text-base text-white">124</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">In Line</span>
                      <strong className="text-base text-amber-400">18</strong>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg text-center">
                      <span className="text-slate-400 block text-[10px]">Procured (Qtl)</span>
                      <strong className="text-base text-emerald-400">4,820</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-20 relative bg-brand-950 text-white overflow-hidden" data-purpose="final-call-to-action">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="inline-block px-3 py-1 rounded-full bg-harvest/20 border border-harvest/40 text-harvest-light text-xs font-mono font-bold tracking-wider uppercase">
            TRANSPARENT PROCUREMENT FOR EVERY KISAN
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your crop. Your visit. <br />
            <span className="text-harvest-light">Your confirmed status.</span>
          </h2>
          <p className="font-hindi text-xl sm:text-2xl text-stone-200 max-w-2xl mx-auto font-medium">
            मंडी में अपनी फसल लाने से पहले समय बुक करें या लाइव कतार देखें।
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/farmer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-harvest hover:bg-harvest-light text-brand-950 font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>किसान सेवा पोर्टल (Farmer Access)</span>
              <span className="font-mono">→</span>
            </Link>
            <Link
              href="/staff/login"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition-all cursor-pointer"
            >
              <span>उपार्जन केंद्र लॉगिन (Staff Console)</span>
            </Link>
          </div>

          <div className="pt-6 inline-flex items-center gap-3 text-sm text-stone-300">
            <svg className="w-5 h-5 text-harvest-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Or simply dial Toll-Free: <strong className="text-white font-mono text-base font-bold">1800-180-1551</strong> (24×7 Multilingual Support)</span>
          </div>
        </div>
      </section>

      {/* 11. INSTITUTIONAL FOOTER */}
      <footer className="bg-brand-950 text-stone-300 pt-16 pb-12 border-t border-brand-900 text-xs" data-purpose="institutional-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="KisanCall Logo"
                  className="h-10 w-auto object-contain rounded-md bg-white p-0.5 border border-white/20 shadow-xs"
                />
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                    KISAN<span className="text-harvest">CALL</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-900 text-harvest-light border border-brand-800">
                    Govt Partner
                  </span>
                </div>
              </div>
              <p className="font-hindi text-stone-300 text-sm max-w-sm">
                कृषि उपज उपार्जन समन्वय एवं पारदर्शी डिजिटल तुलाई निगरानी प्रणाली।
              </p>
              <p className="text-stone-400 text-xs max-w-sm leading-relaxed">
                An institutional-grade agricultural queue logistics network connecting APMC mandis, food corporations, and farming families across India.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">Platform</span>
              <ul className="space-y-2">
                <li><a className="hover:text-white transition-colors" href="#how-it-works">How It Works</a></li>
                <li><a className="hover:text-white transition-colors" href="#live-queue">Live Token Monitor</a></li>
                <li><a className="hover:text-white transition-colors" href="#mandi-prices">Agmarknet MSP Rates</a></li>
                <li><a className="hover:text-white transition-colors" href="#verification">Digital Weigh Proof</a></li>
                <li><a className="hover:text-white transition-colors" href="#voice-engine">IVR Architecture</a></li>
              </ul>
            </div>

            {/* Portals */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">Portals</span>
              <ul className="space-y-2">
                <li><Link className="hover:text-white transition-colors" href="/farmer">किसान सेवा पोर्टल</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/farmer/prices">Mandi Prices (भाव)</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/farmer/payments">PFMS DBT Tracking</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/staff/login">Mandi Operator Desk</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/staff/login">Staff Console</Link></li>
              </ul>
            </div>

            {/* Compliance */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">Compliance</span>
              <ul className="space-y-2">
                <li><a className="hover:text-white transition-colors" href="#verification">Hardware Scale Calibrations</a></li>
                <li><a className="hover:text-white transition-colors" href="#verification">Farmer Data Privacy (DPDP)</a></li>
                <li><a className="hover:text-white transition-colors" href="#verification">e-NAM Interoperability</a></li>
                <li><a className="hover:text-white transition-colors" href="#verification">W3C &amp; GIGW Accessibility</a></li>
                <li><a className="hover:text-white transition-colors" href="#verification">Public Audit Ledger</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
            <div>
              © 2026 KisanCall Platform. Built for Indian Agricultural Procurement Hubs.
            </div>
            <div className="flex gap-6">
              <span>Compliant with National Informatics Centre (NIC) standards</span>
              <span>Emergency Support: 1800-180-1551</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
