'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// 4 Hero Narrative Slides
const HERO_SLIDES = [
  {
    headline: 'Know when to come.',
    highlight: 'Know where you stand.',
    hindi: 'समय पर आवक, निश्चित तौल और बैंक खाते में सीधा पारदर्शी भुगतान।',
    body: 'KisanCall helps farmers coordinate mandi procurement visits, track their live queue, follow electronic weighing and DBT payment, and stay informed through a simple phone call.',
  },
  {
    headline: 'Less waiting.',
    highlight: 'More certainty.',
    hindi: 'न्यूनतम प्रतीक्षा, अधिकतम निश्चितता।',
    body: 'Eliminate 12-hour chaotic mandi queues. Book a scheduled arrival slot and arrive directly when the electronic scale is ready for your crop.',
  },
  {
    headline: 'From weighing to payment,',
    highlight: 'keep track.',
    hindi: 'कांटे से लेकर बैंक खाते तक सीधी डिजिटल निगरानी।',
    body: 'Digital serial scale output streams straight to your verified J-Form receipt. Real-time PFMS DBT updates direct to your linked bank account.',
  },
  {
    headline: 'A phone call',
    highlight: 'is enough.',
    hindi: 'सिर्फ एक फोन कॉल ही काफी है।',
    body: 'No smartphone or internet required. Dial toll-free 1800-180-1551 from any basic keypad mobile to get spoken voice updates in your regional dialect.',
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
    hindi: 'मंडी आने से पहले अपनी सुविधानुसार दिन और समय चुनें ताकि आपको अनिश्चित घंटों तक मंडी गेट पर खड़ा न रहना पड़े।',
    body: 'Farmers select their nearest procurement centre, register expected quantity (in bags or quintals), and pick a guaranteed 2-hour arrival window. No crowding, no chaotic road blockages outside mandi gates.',
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
    hindi: 'गेट पर डिजिटल चेक-इन और वाहन टोकन आवंटन।',
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
    hindi: 'कंप्यूटरीकृत धर्मकांटा तौल, कोई मैन्युअल छेड़छाड़ नहीं।',
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
    hindi: 'तौल पूरा होते ही पक्की खरीद रसीद (जे-फॉर्म) मोबाइल पर।',
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
    body: 'No cheques, no dalal commissions. Public Financial Management System (PFMS) clears payment directly into the farmer\'s Aadhaar-linked bank account with confirmation SMS.',
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
  // State for hero narrative tab
  const [heroTab, setHeroTab] = useState(0);

  // State for 6-stage workflow
  const [activeStage, setActiveStage] = useState(1);

  // State for chart range (7d, 14d, 30d)
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('7d');

  // State for voice simulation dialect
  const [selectedDialect, setSelectedDialect] = useState<'hindi' | 'punjabi' | 'haryanvi' | 'malwi'>('hindi');
  const [isDialerPlaying, setIsDialerPlaying] = useState(false);

  // State for App Switcher preview
  const [appPreviewTab, setAppPreviewTab] = useState<'farmer' | 'staff'>('farmer');

  // Language Toggle
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Voice playback trigger
  const handlePlayVoice = (dialect: 'hindi' | 'punjabi' | 'haryanvi' | 'malwi') => {
    setSelectedDialect(dialect);
    setIsDialerPlaying(true);
    setTimeout(() => setIsDialerPlaying(false), 4000);
  };

  const currentStage = STAGE_DATA[activeStage];

  // Dynamic Chart Paths
  const chartConfig = {
    '7d': {
      line: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80',
      area: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80 L 700,180 L 0,180 Z',
      labels: ['25 Feb (₹2,360)', '27 Feb (₹2,390)', '01 Mar (₹2,410)', 'Today 03 Mar (₹2,425)'],
    },
    '14d': {
      line: 'M 0,160 Q 180,140 350,110 T 700,85',
      area: 'M 0,160 Q 180,140 350,110 T 700,85 L 700,180 L 0,180 Z',
      labels: ['18 Feb (₹2,320)', '22 Feb (₹2,350)', '28 Feb (₹2,400)', 'Today 03 Mar (₹2,425)'],
    },
    '30d': {
      line: 'M 0,170 Q 200,160 400,120 T 700,75',
      area: 'M 0,170 Q 200,160 400,120 T 700,75 L 700,180 L 0,180 Z',
      labels: ['01 Feb (₹2,280)', '10 Feb (₹2,310)', '20 Feb (₹2,380)', 'Today 03 Mar (₹2,425)'],
    },
  }[chartRange];

  return (
    <div className="min-h-screen bg-stonebg-50 text-charcoal-900 font-sans selection:bg-brand-800 selection:text-white">
      {/* 1. MASTER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stonebg-200 shadow-xs" data-purpose="site-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
                <div className="w-11 h-11 rounded-lg bg-brand-900 flex items-center justify-center text-harvest-light shadow-inner transition-transform group-hover:scale-105">
                  <span className="text-2xl">🌾</span>
                </div>
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
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-charcoal-700">
              <a className="hover:text-brand-900 transition-colors py-2" href="#how-it-works">How It Works</a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#live-queue">Live Mandi Queue</a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#mandi-prices">Mandi &amp; MSP Rates</a>
              <a className="hover:text-brand-900 transition-colors py-2 flex items-center gap-1.5" href="#voice-engine">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Voice Helpline
              </a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#verification">Audit &amp; Proof</a>
            </nav>

            {/* Right Utilities & Direct Portal Access */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center bg-stonebg-100 p-0.5 rounded-lg border border-stonebg-200 text-xs font-semibold">
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    lang === 'en' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  type="button"
                >
                  English
                </button>
                <button
                  onClick={() => setLang('hi')}
                  className={`px-2.5 py-1 rounded font-hindi transition-all cursor-pointer ${
                    lang === 'hi' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  type="button"
                >
                  हिंदी
                </button>
              </div>

              {/* Farmer Portal Quick Action */}
              <Link
                href="/farmer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-900 hover:bg-brand-800 shadow-sm transition-all focus:ring-2 focus:ring-brand-700 cursor-pointer"
              >
                <span>🌾 किसान सेवा पोर्टल</span>
              </Link>

              {/* Procurement Staff Portal */}
              <Link
                href="/staff/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-charcoal-800 bg-stonebg-100 hover:bg-stonebg-200 border border-stonebg-300 transition-all cursor-pointer"
              >
                <span>🏢 केंद्र लॉगिन (Staff)</span>
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
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stonebg-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900" href="#how-it-works">How It Works</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900" href="#live-queue">Live Mandi Queue</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900" href="#mandi-prices">Mandi &amp; MSP Rates</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900" href="#voice-engine">Voice Helpline (1800-180-1551)</a>
            <a onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900" href="#verification">Audit &amp; Tamper-Proofing</a>
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/farmer" className="w-full text-center py-2.5 rounded-md bg-brand-900 text-white font-semibold text-sm">
                🌾 किसान सेवा पोर्टल (Farmer Access)
              </Link>
              <Link href="/staff/login" className="w-full text-center py-2.5 rounded-md bg-stonebg-100 text-charcoal-800 border border-stonebg-300 font-semibold text-sm">
                🏢 केंद्र लॉगिन (Staff Dashboard)
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] bg-brand-950 text-white flex items-center overflow-hidden" data-purpose="cinematic-hero">
        {/* Background Image with Documentary Tone */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Indian farmer harvesting golden wheat crop in morning light"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-105 opacity-60"
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=2000&q=80"
          />
          {/* Deep Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/40"></div>
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-brand-950/50 to-brand-950/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          {/* Interactive 4-Pill Narrative Switcher */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="inline-flex p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 gap-1" role="tablist">
              {['1. Know Arrival Time', '2. Less Waiting', '3. Digital Weighing', '4. Simple Phone Call'].map((tabLabel, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroTab(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    heroTab === idx
                      ? 'bg-brand-800/90 text-white shadow-sm'
                      : 'text-stone-200 hover:text-white'
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Primary Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-harvest/20 border border-harvest/40 text-harvest-light text-xs font-semibold tracking-wide">
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
                  <span>🌾 किसान सेवा पोर्टल (Track Arrival &amp; Queue)</span>
                  <span className="transition-transform group-hover:translate-x-1 font-mono">→</span>
                </Link>

                <Link
                  href="/staff/login"
                  className="inline-flex items-center justify-center px-5 py-4 rounded-xl text-sm font-semibold text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
                >
                  <span>🏢 उपार्जन केंद्र पोर्टल (Staff Desk)</span>
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-8 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>NIC &amp; PFMS Standard Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-harvest-light font-bold">📞</span>
                  <span>Toll-Free IVR (Works on 2G Keypad)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
                  <span className="text-white font-medium">1,482 Mandi Hubs Active</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Real-Time Queue Status Mockup */}
            <div className="lg:col-span-5" data-purpose="hero-live-card">
              <div className="bg-white text-charcoal-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
                {/* Card Header: Mandi Meta */}
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

                {/* Centre Tally Snapshot */}
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

                {/* Live Farmer Token Spotlight */}
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

                  {/* 4-Stage Mini Progress Ribbon */}
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

                  {/* Live Activity Box */}
                  <div className="rounded-xl bg-stonebg-50 p-3.5 border border-stonebg-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-charcoal-700 font-medium">
                      <span>Currently Serving at Scales:</span>
                      <span className="font-mono font-bold text-brand-950">Scale #1: #030 | Scale #2: #031</span>
                    </div>
                    <div className="flex items-center justify-between text-charcoal-700 font-medium">
                      <span>Verified Crop &amp; Moisture:</span>
                      <span className="font-semibold text-brand-950">Wheat Lok-1 (10.4% Moisture)</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stonebg-200 text-[11px] text-charcoal-600">
                      <span>SMS alert sent to: +91 98XXX-XX812</span>
                      <span className="text-emerald-700 font-semibold">Live Synced</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      href="/farmer"
                      className="w-full py-2.5 px-4 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>📞</span>
                      <span>Open Live Queue Telemetry Dashboard</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 6-STAGE CONNECTED JOURNEY WORKFLOW */}
      <section className="py-20 bg-stonebg-100 border-b border-stonebg-300" data-purpose="six-stage-journey" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold font-mono tracking-widest text-brand-800 uppercase block mb-1">
              END-TO-END WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              From booking to payment. One connected journey.
            </h2>
            <p className="font-hindi text-lg text-charcoal-700 mt-1">
              खेत से बैंक खाते तक एक पारदर्शी, डिजिटल और विश्वसनीय प्रक्रिया।
            </p>
          </div>

          {/* 6 Stage Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8" role="tablist">
            {[
              { num: 1, label: '1. Book Slot', hindi: 'आवक समय चयन' },
              { num: 2, label: '2. Check-In', hindi: 'गेट पास व टोकन' },
              { num: 3, label: '3. Live Queue', hindi: 'पारदर्शी प्रतीक्षा' },
              { num: 4, label: '4. Weighing', hindi: 'डिजिटल कांटा तौल' },
              { num: 5, label: '5. J-Form Procure', hindi: 'जे-फॉर्म खरीद पर्ची' },
              { num: 6, label: '6. Direct DBT', hindi: 'डीबीटी बैंक भुगतान' },
            ].map((stg) => (
              <button
                key={stg.num}
                onClick={() => setActiveStage(stg.num)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeStage === stg.num
                    ? 'bg-brand-900 text-white border-brand-800 shadow-sm'
                    : 'bg-white text-charcoal-800 border-stonebg-300 hover:border-brand-700'
                }`}
              >
                <div className={`flex items-center justify-between text-xs font-mono font-bold mb-1 ${
                  activeStage === stg.num ? 'opacity-80' : 'text-charcoal-600'
                }`}>
                  <span>0{stg.num}</span>
                  {activeStage === stg.num && <span className="w-2 h-2 rounded-full bg-harvest"></span>}
                </div>
                <div className="font-bold text-sm leading-tight">{stg.label}</div>
                <div className={`text-[11px] mt-0.5 ${activeStage === stg.num ? 'text-stone-200' : 'text-charcoal-600'}`}>
                  {stg.hindi}
                </div>
              </button>
            ))}
          </div>

          {/* Dynamic Stage Detail Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-900 border border-brand-200 rounded-md font-mono text-xs font-bold">
                  STAGE {currentStage.stageNum} OF 06
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-950">{currentStage.title}</h3>
                <p className="font-hindi text-base text-charcoal-700 font-medium">
                  {currentStage.hindi}
                </p>
                <p className="text-charcoal-700 text-sm leading-relaxed">
                  {currentStage.body}
                </p>
                <div className="border-t border-stonebg-200 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
                    <span className="text-brand-700 font-bold">✓</span>
                    <span>Automated GSM SMS Confirmation with Entry Gate PIN</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
                    <span className="text-brand-700 font-bold">✓</span>
                    <span>Toll-free IVR booking available for non-smartphone users</span>
                  </div>
                </div>
              </div>

              {/* High fidelity UI mockup corresponding to Stage */}
              <div className="lg:col-span-6 bg-stonebg-100 rounded-xl p-5 border border-stonebg-300">
                <div className="bg-white rounded-lg p-5 shadow-sm border border-stonebg-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-3 border-stonebg-200">
                    <span className="font-bold text-xs uppercase tracking-wider text-brand-900">
                      {currentStage.mockTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      {currentStage.badge}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-charcoal-600 block">{currentStage.line1L}</span>
                      <strong className="text-charcoal-900 text-sm">{currentStage.line1R}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">{currentStage.line2L}</span>
                      <strong className="text-charcoal-900 text-sm">{currentStage.line2R}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">{currentStage.line3L}</span>
                      <strong className="text-charcoal-900">{currentStage.line3R}</strong>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">{currentStage.line4L}</span>
                      <strong className="text-charcoal-900">{currentStage.line4R}</strong>
                    </div>
                  </div>
                  <div className="p-3 bg-brand-50 border border-brand-200 rounded-md flex items-center justify-between text-xs">
                    <span className="text-brand-950 font-medium">{currentStage.footerLabel}</span>
                    <span className="font-mono font-extrabold text-brand-900 text-base tracking-wider">
                      {currentStage.footerVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE MANDI QUEUE SECTION */}
      <section className="py-20 relative bg-brand-950 text-white overflow-hidden" data-purpose="live-queue-experience" id="live-queue">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-harvest-light uppercase block mb-2">
              LIVE MANDI TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              &ldquo;Waiting is not the problem. Not knowing how long you&apos;ll wait is.&rdquo;
            </h2>
            <p className="font-hindi text-xl text-stone-300 mt-2">
              कतार की सही जानकारी हर किसान के मोबाइल पर उपलब्ध।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Live Queue Monitor Display */}
            <div className="lg:col-span-7 bg-white text-charcoal-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-stonebg-200 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-charcoal-600 uppercase tracking-wider block">Live Mandi Screen</span>
                    <h3 className="text-xl font-bold text-brand-950">Scale Line #2 — Electronic Bridge</h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
                      Connected to Govt e-NAM Portal
                    </span>
                  </div>
                </div>

                {/* Visual Queue Ticker Line */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600 block mb-3">Today&apos;s Token Sequence</span>
                  <div className="flex gap-2 overflow-x-auto pb-2 ticker-bar">
                    <div className="shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-200 text-center opacity-70">
                      <span className="block text-[10px] text-charcoal-600 font-mono">TOKEN</span>
                      <span className="text-sm font-bold line-through">#029</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Weigh Done</span>
                    </div>
                    <div className="shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-200 text-center opacity-70">
                      <span className="block text-[10px] text-charcoal-600 font-mono">TOKEN</span>
                      <span className="text-sm font-bold line-through">#030</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Weigh Done</span>
                    </div>
                    <div className="shrink-0 w-28 p-2.5 rounded-lg bg-harvest-50 border-2 border-harvest text-center">
                      <span className="block text-[10px] text-harvest-dark font-mono font-bold">ON SCALE NOW</span>
                      <span className="text-base font-extrabold text-charcoal-900 font-mono">#031</span>
                      <span className="block text-[10px] text-harvest-dark font-bold animate-pulse">48.60 Qtl</span>
                    </div>
                    <div className="shrink-0 w-24 p-2.5 rounded-lg bg-brand-50 border border-brand-200 text-center">
                      <span className="block text-[10px] text-brand-800 font-mono">NEXT UP</span>
                      <span className="text-sm font-bold text-brand-950 font-mono">#032</span>
                      <span className="block text-[10px] text-brand-700">Call Gate B</span>
                    </div>
                    <div className="shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-100 text-center border border-dashed border-stonebg-300">
                      <span className="block text-[10px] text-charcoal-600 font-mono">WAITING</span>
                      <span className="text-sm font-bold text-charcoal-700 font-mono">#033</span>
                      <span className="block text-[10px] text-charcoal-600">~6 Min</span>
                    </div>
                    <div className="shrink-0 w-24 p-2.5 rounded-lg bg-brand-900 text-white text-center shadow-sm">
                      <span className="block text-[10px] text-harvest-light font-mono font-bold">YOUR TOKEN</span>
                      <span className="text-base font-extrabold font-mono">#047</span>
                      <span className="block text-[10px] text-stone-200 font-bold">16 Ahead</span>
                    </div>
                  </div>
                </div>

                {/* Live Scale Specifications Readout */}
                <div className="bg-stonebg-50 rounded-xl p-4 border border-stonebg-200 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="block text-[11px] font-semibold text-charcoal-600">Scale ID</span>
                    <span className="text-sm font-bold text-brand-950 font-mono">DIGI-SCALE-04</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-charcoal-600">Calibration Valid Till</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">30-JUN-2026</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-charcoal-600">Avg Time Per Cart</span>
                    <span className="text-sm font-bold text-charcoal-900 font-mono">2.6 Minutes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stonebg-200 flex items-center justify-between text-xs text-charcoal-600">
                <span>Last refreshed at: <strong>10:14:02 AM</strong> (Auto-syncs every 15s)</span>
                <Link href="/farmer" className="text-brand-900 font-bold underline cursor-pointer">
                  Open Interactive Map View →
                </Link>
              </div>
            </div>

            {/* GSM SMS Fallback Simulator */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-harvest-light uppercase">No App Required</span>
                  <span className="text-xs text-stone-300">Standard GSM SMS Feed</span>
                </div>
                <h4 className="text-2xl font-bold text-white">Instant SMS When It&apos;s Your Turn</h4>
                <p className="text-sm text-stone-300 font-hindi">
                  किसान को बार-बार उठकर कांटा देखने की आवश्यकता नहीं। जैसे ही आपका नंबर नजदीक आता है, आपके फोन पर मैसेज और मिस्ड कॉल अलर्ट आ जाता है।
                </p>

                {/* SMS Bubble Mockup */}
                <div className="bg-stone-900 rounded-xl p-4 border border-stone-700 text-stone-200 space-y-3 font-mono text-xs shadow-inner">
                  <div className="flex justify-between items-center text-stone-400 text-[10px] pb-1 border-b border-stone-800">
                    <span>SENDER: VM-KISANCALL-HR</span>
                    <span>10:12 AM</span>
                  </div>
                  <p className="text-stone-100 leading-relaxed font-sans">
                    &ldquo;प्रिय रमेश जी, कर्नाल उपार्जन केंद्र पर आपका टोकन <strong>#047</strong> है। आपकी तुलाई का अनुमानित समय <strong>10:54 AM</strong> है (16 किसान आगे)। कृपया अपने वाहन को प्लेटफॉर्म #2 की लेन में तैयार रखें।&rdquo;
                  </p>
                  <div className="pt-2 text-[11px] text-harvest-light font-sans font-medium">
                    स्थिति पुनः जानने हेतु 1800-180-1551 पर कॉल करें (मुफ्त)।
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="p-4 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-harvest flex items-center justify-center text-brand-950 font-bold shrink-0">
                    <span>📱</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-white block">Works on any ₹800 Basic Keypad Phone</span>
                    <span className="text-stone-300">No internet, 4G, or Android needed at the yard.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MANDI PRICES & MSP INTELLIGENCE */}
      <section className="py-20 bg-stonebg-50 border-b border-stonebg-300" data-purpose="market-rates-and-msp" id="mandi-prices">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
                REAL-TIME MARKET INTELLIGENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
                Know the market. Before you arrive.
              </h2>
              <p className="font-hindi text-base text-charcoal-700 mt-1">
                मंडी का दैनिक मॉडल भाव और सरकारी न्यूनतम समर्थन मूल्य (MSP) की तुलना।
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stonebg-300 shadow-2xs text-xs">
              <div className="flex items-center gap-1.5 font-bold text-brand-900">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-700"></span>
                <span>दैनिक मंडी भाव (Modal Price)</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-1.5 font-bold text-harvest-dark">
                <span className="w-2.5 h-2.5 rounded-full bg-harvest"></span>
                <span>सरकारी समर्थन मूल्य (Govt MSP)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Spotlight Metric */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stonebg-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-charcoal-600 mb-2">
                  <span className="font-bold uppercase tracking-wider">SELECTED COMMODITY</span>
                  <span className="text-brand-800 font-semibold font-mono">APMC KARNAL (HR)</span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-950">Wheat (गेहूं - Lok-1)</h3>
                <p className="text-xs text-charcoal-600 mt-0.5">Grade: FAQ (Fair Average Quality) • Standard Bag</p>

                <div className="mt-6 p-4 rounded-xl bg-stonebg-100 border border-stonebg-200">
                  <span className="text-xs font-bold text-charcoal-600 uppercase block">Reported Modal Price</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-brand-950 font-mono">₹2,425</span>
                    <span className="text-xs font-semibold text-charcoal-600">/ quintal</span>
                  </div>
                  <div className="mt-2 text-xs flex justify-between text-charcoal-700 border-t border-stonebg-200 pt-2 font-mono">
                    <span>Min: ₹2,300</span>
                    <span>Max: ₹2,510</span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-harvest-50 border border-harvest/40">
                  <span className="text-xs font-bold text-harvest-dark uppercase block">Central Govt MSP + State Bonus</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-charcoal-900 font-mono">₹2,450</span>
                    <span className="text-xs font-semibold text-harvest-dark font-hindi font-bold">(₹2,400 MSP + ₹50 बोनस)</span>
                  </div>
                  <p className="text-[11px] text-charcoal-700 mt-1">
                    Mandatory procurement rate for verified FAQ wheat at Karnal Central hub.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stonebg-200 flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Source: Agmarknet APMC Feed</span>
                <span className="font-bold text-brand-900">03-Mar-2026 Updated</span>
              </div>
            </div>

            {/* SVG Historical Price Trend Chart */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-brand-950">Mandi Price Movement vs Guaranteed MSP</h4>
                    <p className="text-xs text-charcoal-600">Past procurement trends indicating peak selling windows</p>
                  </div>

                  {/* Range Buttons */}
                  <div className="inline-flex p-1 bg-stonebg-100 rounded-lg border border-stonebg-200 text-xs font-semibold">
                    {(['7d', '14d', '30d'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setChartRange(r)}
                        className={`px-3 py-1 rounded transition-all cursor-pointer ${
                          chartRange === r
                            ? 'bg-brand-900 text-white shadow-xs'
                            : 'text-charcoal-700 hover:text-brand-950'
                        }`}
                      >
                        {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : '30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Trend Visualization */}
                <div className="w-full h-56 relative" data-purpose="trend-chart-container">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="30" y2="30"></line>
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="80" y2="80"></line>
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                    <line stroke="#CBD5E1" strokeWidth="1" x1="0" x2="700" y1="180" y2="180"></line>
                    {/* MSP Ceiling / Floor Line */}
                    <line stroke="#C68A2C" strokeDasharray="6" strokeWidth="2" x1="0" x2="700" y1="75" y2="75"></line>
                    <text fill="#926017" fontFamily="sans-serif" fontSize="11" fontWeight="bold" x="580" y="70">
                      MSP Floor: ₹2,450
                    </text>

                    <defs>
                      <linearGradient id="priceGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#15803D" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#15803D" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>

                    <path d={chartConfig.area} fill="url(#priceGrad)"></path>
                    <path d={chartConfig.line} fill="none" stroke="#0B3B18" strokeLinecap="round" strokeWidth="3"></path>

                    <circle cx="240" cy="130" fill="#0B3B18" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                    <circle cx="480" cy="90" fill="#0B3B18" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                    <circle cx="700" cy="80" fill="#C68A2C" r="6" stroke="#FFFFFF" strokeWidth="2"></circle>
                  </svg>

                  {/* Dynamic Labels */}
                  <div className="flex justify-between text-[11px] text-charcoal-600 font-mono mt-2">
                    {chartConfig.labels.map((l, idx) => (
                      <span key={idx} className={idx === 3 ? 'font-bold text-brand-950' : ''}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stonebg-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-charcoal-700">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-brand-900 inline-block"></span> Open Mandi Auction Trend</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-harvest inline-block"></span> Govt Procurement Target</span>
                </div>
                <Link href="/farmer" className="font-bold text-brand-900 hover:underline">
                  View Live Mandis on Map →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEMIC COMPARISON SECTION */}
      <section className="py-20 bg-stonebg-100 border-b border-stonebg-300" data-purpose="before-and-after-comparison">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
              SYSTEMIC IMPACT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              From uncertainty to visibility.
            </h2>
            <p className="font-hindi text-base text-charcoal-700 mt-1">
              पारंपरिक मंडी की अव्यवस्था और किसानकॉल के व्यवस्थित समाधान में अंतर।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Traditional System */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-stonebg-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-red-700 uppercase">Legacy Status Quo</span>
                  <h3 className="text-xl font-bold text-charcoal-900">Traditional Mandi Arrival</h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">✕</span>
              </div>
              <ul className="space-y-4 text-sm text-charcoal-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold">Unannounced Arrival Congestion</strong>
                    Tractors queued for 2 km outside gates, blocking highways with zero queue predictability.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold">12–18 Hour Overnight Wait</strong>
                    Farmers forced to sleep on loaded trollies under open skies to protect harvest from moisture.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold">Manual Weighbridge Deductions</strong>
                    Disputed tare weights and unauthorized bag cuts by local weighing brokers.
                  </div>
                </li>
              </ul>
            </div>

            {/* Card 2: KisanCall Platform */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-700 shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between border-b border-brand-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-brand-700 uppercase">KisanCall Platform</span>
                  <h3 className="text-xl font-bold text-brand-950">Coordinated Transparent Procurement</h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">✓</span>
              </div>
              <ul className="space-y-4 text-sm text-charcoal-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Guaranteed 2-Hour Arrival Windows</strong>
                    Book from your village over phone or web and arrive smoothly without traffic roadblocks.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Live Real-Time Queue &amp; SMS Dispatch</strong>
                    Relax under covered sheds while automated SMS and voice alerts count down your vehicle token.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Tamper-Proof Serial Scale Sync &amp; DBT</strong>
                    Direct digital weights stream straight to J-Form and Aadhaar-linked PFMS bank disbursement.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOICE HELPLINE (1800-180-1551) ENGINE */}
      <section className="py-20 bg-brand-950 text-white overflow-hidden" data-purpose="voice-helpline" id="voice-engine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase rounded-full">
                AI VOICE HELPLINE (1800-180-1551)
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Speaks your language. <br />
                <span className="text-harvest-light">Listens to your query.</span>
              </h2>
              <p className="font-hindi text-lg text-stone-200">
                चाहे हिंदी हो, हरियाणवी, पंजाबी या मालवी — किसानकॉल का वॉइस असिस्टेंट आपकी बोली समझता है और आपकी फसल, कतार व भुगतान की सटीक जानकारी देता है।
              </p>

              {/* Dialect Buttons */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">Test Regional Dialects:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'hindi', label: '🇮🇳 मानक हिंदी (Hindi)' },
                    { id: 'haryanvi', label: '🌾 हरियाणवी (Haryanvi)' },
                    { id: 'punjabi', label: '🚜 ਪੰਜਾਬੀ (Punjabi)' },
                    { id: 'malwi', label: '🌾 मालवी (Malwi)' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handlePlayVoice(d.id as any)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                        selectedDialect === d.id
                          ? 'bg-harvest text-brand-950 border-harvest font-bold'
                          : 'bg-white/10 text-stone-200 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Live Call Simulation</h4>
                    <span className="text-xs text-stone-400 font-mono">Toll-Free: 1800-180-1551</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isDialerPlaying ? 'bg-emerald-500 text-brand-950 animate-pulse' : 'bg-white/20 text-stone-300'
                }`}>
                  {isDialerPlaying ? '● Call In Progress' : 'Standby'}
                </span>
              </div>

              {/* Waveform Animation */}
              <div className="h-24 bg-stone-900/80 rounded-xl flex items-center justify-center gap-1.5 px-4 overflow-hidden border border-white/10">
                {[12, 28, 45, 18, 55, 32, 65, 40, 20, 48, 60, 25, 38, 50, 15, 30].map((h, idx) => (
                  <span
                    key={idx}
                    style={{ height: isDialerPlaying ? `${Math.max(10, (h * (idx % 3 + 1)) % 65)}px` : '8px' }}
                    className="w-1.5 bg-emerald-400 rounded-full transition-all duration-150"
                  />
                ))}
              </div>

              {/* Spoken Response Preview */}
              <div className="bg-stone-900/60 p-4 rounded-xl border border-white/10 text-xs text-stone-200 space-y-1 font-hindi">
                <span className="text-harvest-light font-sans font-bold uppercase text-[10px] block">Assistant Audio Stream:</span>
                <p className="text-sm leading-relaxed">
                  {selectedDialect === 'hindi' && '“नमस्ते रमेश जी! कर्नाल मंडी में आपका गेहूं टोकन #047 है। अभी स्केल #2 पर टोकन #031 की तुलाई हो रही है।”'}
                  {selectedDialect === 'haryanvi' && '“राम-राम भाई रमेश! थारा कर्नाल मंडी का टोकन #047 सै। स्केल पे थारे आगे 16 गाड़ियां खड़ी सैं, 40 मिनट में नंबर आ ज्यागा।”'}
                  {selectedDialect === 'punjabi' && '“ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਰਮੇਸ਼ ਜੀ! ਕਰਨਾਲ ਮੰਡੀ ਵਿੱਚ ਤੁਹਾਡਾ ਕਣਕ ਦਾ ਟੋਕਨ #047 ਹੈ। ਕੰਡੇ ਤੇ ਤੁਹਾਡੇ ਅੱਗੇ 16 ਟਰਾਲੀਆਂ ਹਨ।”'}
                  {selectedDialect === 'malwi' && '“जय श्री राम पटेल साब! राजापुर केंद्र पे थारो टोकन #047 हे। 16 किसान आगे हे, तुलाई 10:54 पे होवेगी।”'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handlePlayVoice(selectedDialect)}
                  className="flex-1 py-3 bg-brand-700 hover:bg-brand-600 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  ▶ Simulate AI Voice Call
                </button>
                <Link
                  href="/farmer"
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors text-center cursor-pointer"
                >
                  Open Web Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUDIT & CRYPTOGRAPHIC PROOF SECTION */}
      <section className="py-20 bg-stonebg-50 border-b border-stonebg-300" data-purpose="audit-and-proof" id="verification">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
              TAMPER-EVIDENT ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              Hardware-backed weighment integrity.
            </h2>
            <p className="font-hindi text-base text-charcoal-700 mt-1">
              कांटे से सीधा डिजिटल डेटा हस्तांतरण। बिना किसी मानवीय हेरफेर के।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-2xs space-y-3">
              <span className="text-2xl">⚖️</span>
              <h3 className="text-lg font-bold text-brand-950">Direct Serial Scale Sync</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Weighbridge indicator transmits digital load readings directly over encrypted RS-232 serial interface. Clerks cannot manually override weights.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-2xs space-y-3">
              <span className="text-2xl">🔐</span>
              <h3 className="text-lg font-bold text-brand-950">SHA-256 Batch Hash</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed font-mono">
                Every procurement slip generates an immutable hash signature (e.g. 9b7a...41f) stored in state records for tamper audit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-2xs space-y-3">
              <span className="text-2xl">🏦</span>
              <h3 className="text-lg font-bold text-brand-950">Direct DBT Ledger</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Direct integration with PFMS ensures 100% of the funds reach the farmer&apos;s verified bank account without intermediaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE APP PREVIEW & PORTAL LAUNCHERS */}
      <section className="py-20 bg-stonebg-100 border-b border-stonebg-300" id="apps-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
              LIVE PLATFORM INTERFACES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              One ecosystem. Dedicated portals.
            </h2>
            <p className="font-hindi text-base text-charcoal-700 mt-1">
              किसान और मंडी कर्मचारियों के लिए विशेष रूप से डिज़ाइन किए गए इंटरफ़ेस।
            </p>

            {/* Portal Switcher Buttons */}
            <div className="inline-flex p-1.5 bg-stonebg-200 rounded-xl mt-6">
              <button
                onClick={() => setAppPreviewTab('farmer')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  appPreviewTab === 'farmer' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-700 hover:text-brand-950'
                }`}
              >
                🌾 Farmer Web Portal
              </button>
              <button
                onClick={() => setAppPreviewTab('staff')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  appPreviewTab === 'staff' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-700 hover:text-brand-950'
                }`}
              >
                🏢 Mandi Staff Console
              </button>
            </div>
          </div>

          {/* Tab 1: Farmer Web App Preview */}
          {appPreviewTab === 'farmer' && (
            <div className="bg-white rounded-2xl border border-stonebg-300 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md">
                  LIVE PORTAL READY (PORT 3001)
                </span>
                <h3 className="text-2xl font-bold text-brand-950">Farmer Self-Service &amp; Map Portal</h3>
                <p className="text-sm text-charcoal-700 leading-relaxed">
                  Book scheduled arrival slots, inspect real-time queue position, view interactive OpenStreetMap locations of all APMC mandis, and verify procurement payments.
                </p>
                <div className="pt-2">
                  <Link
                    href="/farmer"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold rounded-xl text-sm transition-colors shadow-sm gap-2 cursor-pointer"
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
                    <span className="text-slate-400 font-mono ml-2">http://localhost:3001/farmer</span>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">● Active</span>
                </div>
                <div className="py-6 px-4 bg-slate-950 rounded-lg mt-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-bold text-sm">🌾 Rameshwar Patel (Token #047)</span>
                    <span className="bg-emerald-800/80 text-emerald-100 text-[10px] px-2 py-0.5 rounded font-mono">Live Dispatch</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Assigned Mandi:</span>
                      <strong>Karnal Central Hub (Haryana)</strong>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Procurement Value:</span>
                      <strong className="text-emerald-400">₹1,17,855.00 (FAQ Grade)</strong>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-slate-400 flex items-center justify-between">
                    <span>🗺️ Interactive Leaflet Map Active</span>
                    <span className="text-emerald-400 text-[11px] font-semibold">10 Mandis Mapped</span>
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
                    <span className="text-sky-300 font-bold text-sm">👨‍💼 Operator Desk: Sunil Kumar (Gate 1)</span>
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
              <span>🌾 किसान सेवा पोर्टल (Farmer Access)</span>
              <span className="font-mono">→</span>
            </Link>
            <Link
              href="/staff/login"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition-all cursor-pointer"
            >
              <span>🏢 उपार्जन केंद्र लॉगिन (Staff Console)</span>
            </Link>
          </div>

          <div className="pt-6 inline-flex items-center gap-3 text-sm text-stone-300">
            <span>📞</span>
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
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  KISAN<span className="text-harvest">CALL</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-900 text-harvest-light border border-brand-800">
                  Govt Partner
                </span>
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
                <li><Link className="hover:text-white transition-colors" href="/farmer">Book Arrival Slot</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/farmer">PFMS DBT Tracking</Link></li>
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
