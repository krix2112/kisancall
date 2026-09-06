'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  // 1. Hero Narratives
  const heroSlides = [
    {
      headline: (
        <>
          Know when to come. <br className="hidden sm:block" />
          <span className="text-harvest-light">Know where you stand.</span>
        </>
      ),
      hindi: 'समय पर आवक, निश्चित तौल और बैंक खाते में सीधा पारदर्शी भुगतान।',
      body: 'KisanCall helps farmers coordinate mandi procurement visits, track their live queue, follow electronic weighing and DBT payment, and stay informed through a simple phone call.',
    },
    {
      headline: (
        <>
          Less waiting. <br className="hidden sm:block" />
          <span className="text-harvest-light">More certainty.</span>
        </>
      ),
      hindi: 'न्यूनतम प्रतीक्षा, अधिकतम निश्चितता।',
      body: 'Eliminate 12-hour chaotic mandi queues. Book a scheduled arrival slot and arrive directly when the electronic scale is ready for your crop.',
    },
    {
      headline: (
        <>
          From weighing to payment, <br className="hidden sm:block" />
          <span className="text-harvest-light">keep track.</span>
        </>
      ),
      hindi: 'कांटे से लेकर बैंक खाते तक सीधी डिजिटल निगरानी।',
      body: 'Digital serial scale output streams straight to your verified J-Form receipt. Real-time PFMS DBT updates direct to your linked bank account.',
    },
    {
      headline: (
        <>
          A phone call <br className="hidden sm:block" />
          <span className="text-harvest-light">is enough.</span>
        </>
      ),
      hindi: 'सिर्फ एक फोन कॉल ही काफी है।',
      body: 'No smartphone or internet required. Dial toll-free 1800-180-1551 from any basic keypad mobile to get spoken voice updates in your regional dialect.',
    },
  ];

  const [heroTab, setHeroTab] = useState(0);

  // 2. 6-Stage Journey Workflow Data
  const stageData: Record<
    number,
    {
      stageNum: string;
      title: string;
      hindi: string;
      body: string;
      mockTitle: string;
      badge: string;
      line1L: string;
      line1R: string;
      line2L: string;
      line2R: string;
      line3L: string;
      line3R: string;
      line4L: string;
      line4R: string;
      footerLabel: string;
      footerVal: string;
    }
  > = {
    1: {
      stageNum: '01',
      title: 'Book Your Arrival Slot In Advance',
      hindi: 'मंडी आने से पहले अपनी सुविधानुसार दिन और समय चुनें ताकि आपको अनिश्चित घंटों तक मंडी गेट पर खड़ा न रहना पड़े।',
      body: 'Farmers select their nearest procurement centre, register expected quantity (in bags or quintals), and pick a guaranteed 2-hour arrival window. No crowding, no chaotic road blockages outside mandi gates.',
      mockTitle: 'Procurement Appointment Request',
      badge: 'Slot Confirmed',
      line1L: 'Mandi Yard:',
      line1R: 'Rajapur Procurement Hub (Sehore)',
      line2L: 'Commodity:',
      line2R: 'Wheat (Lok-1 / शरबती)',
      line3L: 'Scheduled Date:',
      line3R: 'Tomorrow • 10:00 AM – 12:00 PM',
      line4L: 'Est. Quantity:',
      line4R: '100 Bags (~50 Quintals)',
      footerLabel: 'Gate Security Entry Code:',
      footerVal: 'KC-9042',
    },
    2: {
      stageNum: '02',
      title: 'Arrive & Check-In at Mandi Gate',
      hindi: 'गेट पर डिजिटल चेक-इन और वाहन टोकन आवंटन।',
      body: 'Show your SMS PIN or QR pass at the entry gate. Security verifies vehicle registration and issues a digital physical token that feeds into the central display board.',
      mockTitle: 'Gate Security Check-In Verification',
      badge: 'Vehicle Admitted',
      line1L: 'Gate Pass Token:',
      line1R: 'Token #047 (Lane 2)',
      line2L: 'Tractor Registration:',
      line2R: 'MP-04-GB-9821',
      line3L: 'Gate Check Time:',
      line3R: 'Today • 09:52 AM',
      line4L: 'Farmer ID (Samagra):',
      line4R: 'Verified (Aadhaar Seeded)',
      footerLabel: 'Assigned Waiting Yard:',
      footerVal: 'Bay C - North Shade',
    },
    3: {
      stageNum: '03',
      title: 'Live Transparent Queue Tracking',
      hindi: 'मोबाइल पर लाइव टोकन क्रम और अनुमानित समय की जानकारी।',
      body: 'Relax under shaded farmer bays. KisanCall monitors weighing progress across scales and pushes an automated countdown notification when you have two farmers ahead.',
      mockTitle: 'Yard Queue Live Telemetry',
      badge: '16 Farmers Ahead',
      line1L: 'Current Serving Token:',
      line1R: '#031 on Scale #2',
      line2L: 'Your Position:',
      line2R: '#047 (Estimated 42 Min)',
      line3L: 'Scales Active:',
      line3R: '4 Operational Bridges',
      line4L: 'Throughput Rate:',
      line4R: '22 Tractors / Hour',
      footerLabel: 'Automated SMS Alert:',
      footerVal: 'Scheduled at #045',
    },
    4: {
      stageNum: '04',
      title: 'Certified Electronic Weighing',
      hindi: 'कंप्यूटरीकृत धर्मकांटा तौल, कोई मैन्युअल छेड़छाड़ नहीं।',
      body: 'Weighbridge transmits weight data over tamper-proof serial cables directly to state procurement servers. Moisture and grain foreign matter analyzers record readings instantly.',
      mockTitle: 'Weighbridge Digital Telemetry Slip',
      badge: 'Gross Weight Captured',
      line1L: 'Scale Indicator ID:',
      line1R: 'WB-DIGI-SEHORE-04',
      line2L: 'Gross Weight:',
      line2R: '78.40 Quintal (Tractor+Load)',
      line3L: 'Tare Weight (Empty):',
      line3R: '29.80 Quintal',
      line4L: 'Net Wheat Procured:',
      line4R: '48.60 Quintals',
      footerLabel: 'Certified Moisture Reading:',
      footerVal: '10.4% (FAQ Grade Pass)',
    },
    5: {
      stageNum: '05',
      title: 'Instant Digital J-Form Generation',
      hindi: 'तौल पूरा होते ही पक्की खरीद रसीद (जे-फॉर्म) मोबाइल पर।',
      body: 'The mandi procurement officer signs the digital J-form. The farmer receives an official receipt on SMS and smartphone with rate calculations based on the approved MSP rate.',
      mockTitle: 'Official Procurement J-Form Receipt',
      badge: 'Form Approved',
      line1L: 'J-Form Certificate No:',
      line1R: 'JF-MP-2026-901844',
      line2L: 'Net Quantity:',
      line2R: '48.60 Quintals',
      line3L: 'Approved Rate (MSP):',
      line3R: '₹2,425.00 / Qtl',
      line4L: 'Gross Amount Payable:',
      line4R: '₹1,17,855.00',
      footerLabel: 'Digital Sign Verification:',
      footerVal: 'APMC Secretary (Valid)',
    },
    6: {
      stageNum: '06',
      title: 'Direct Bank Account (DBT) Transfer',
      hindi: 'आधार लिंक बैंक खाते में सीधे 24-48 घंटों के भीतर भुगतान।',
      body: 'No cheques, no dalal commissions. Public Financial Management System (PFMS) clears payment directly into the farmer\'s Aadhaar-linked bank account with confirmation SMS.',
      mockTitle: 'PFMS Direct Benefit Transfer Status',
      badge: 'Disbursement Scheduled',
      line1L: 'Beneficiary Account:',
      line1R: 'State Bank of India (••9102)',
      line2L: 'PFMS Reference UTR:',
      line2R: 'KC-PAY-2026-89412B',
      line3L: 'Net Remitted Total:',
      line3R: '₹1,17,855.00',
      line4L: 'Expected Settlement:',
      line4R: 'Within 24 Hours',
      footerLabel: 'Bank Confirmation Alert:',
      footerVal: 'Voice Call + SMS Alert',
    },
  };

  const [activeStage, setActiveStage] = useState(1);
  const currentStage = stageData[activeStage];

  // 3. Price Chart Range Switcher
  const [chartRange, setChartRange] = useState<'7d' | '14d' | '30d'>('7d');

  // Chart path coordinates based on range
  const chartPaths = {
    '7d': {
      line: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80',
      area: 'M 0,140 Q 120,110 240,130 T 480,90 T 700,80 L 700,180 L 0,180 Z',
      labels: ['25 Feb (₹2,360)', '27 Feb (₹2,390)', '01 Mar (₹2,410)', 'Today 03 Mar (₹2,425)'],
    },
    '14d': {
      line: 'M 0,160 Q 180,140 350,110 T 700,85',
      area: 'M 0,160 Q 180,140 350,110 T 700,85 L 700,180 L 0,180 Z',
      labels: ['18 Feb (₹2,310)', '22 Feb (₹2,350)', '27 Feb (₹2,390)', 'Today 03 Mar (₹2,425)'],
    },
    '30d': {
      line: 'M 0,170 Q 200,160 400,120 T 700,75',
      area: 'M 0,170 Q 200,160 400,120 T 700,75 L 700,180 L 0,180 Z',
      labels: ['01 Feb (₹2,280)', '10 Feb (₹2,320)', '20 Feb (₹2,370)', 'Today 03 Mar (₹2,425)'],
    },
  };

  // 4. Product Tab Switcher
  const [appTab, setAppTab] = useState<'farmer' | 'staff'>('farmer');

  // 5. Mobile Menu Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 6. Language selector
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="bg-stonebg-50 text-charcoal-900 antialiased selection:bg-brand-800 selection:text-white min-h-screen">
      {/* BEGIN: NavigationBar */}
      <header
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stonebg-200 transition-shadow duration-200 shadow-sm"
        data-purpose="site-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand Identity */}
            <div className="flex items-center gap-4">
              <Link
                aria-label="KisanCall Home"
                className="flex items-center gap-3 group focus:outline-none"
                href="/"
              >
                <div className="w-11 h-11 rounded-lg bg-brand-900 flex items-center justify-center text-harvest-light shadow-inner transition-transform group-hover:scale-105">
                  {/* Leaf / Grain Monogram Icon */}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
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
            <nav
              className="hidden lg:flex items-center gap-8 text-sm font-semibold text-charcoal-700"
              data-purpose="primary-navigation"
            >
              <a className="hover:text-brand-900 transition-colors py-2" href="#how-it-works">
                How It Works
              </a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#live-queue">
                Live Mandi Queue
              </a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#mandi-prices">
                Mandi &amp; MSP Rates
              </a>
              <a
                className="hover:text-brand-900 transition-colors py-2 flex items-center gap-1.5"
                href="#voice-engine"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Voice Helpline
              </a>
              <a className="hover:text-brand-900 transition-colors py-2" href="#verification">
                Audit &amp; Proof
              </a>
            </nav>

            {/* Right Utilities & Portal Access */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center bg-stonebg-100 p-0.5 rounded-lg border border-stonebg-200 text-xs font-semibold">
                <button
                  className={`px-2.5 py-1 rounded transition-all ${
                    lang === 'en' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  onClick={() => setLang('en')}
                  type="button"
                >
                  English
                </button>
                <button
                  className={`px-2.5 py-1 rounded font-hindi transition-all ${
                    lang === 'hi' ? 'bg-white text-brand-950 shadow-xs' : 'text-charcoal-600 hover:text-brand-950'
                  }`}
                  onClick={() => setLang('hi')}
                  type="button"
                >
                  हिंदी
                </button>
              </div>

              {/* Farmer Portal Quick Action */}
              <Link
                className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-brand-900 hover:bg-brand-800 shadow-sm transition-all focus:ring-2 focus:ring-brand-700"
                href="/farmer"
              >
                <span>किसान सेवा पोर्टल</span>
              </Link>

              {/* Procurement Staff Portal */}
              <Link
                className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-bold text-charcoal-800 bg-stonebg-100 hover:bg-stonebg-200 border border-stonebg-300 transition-all"
                href="/staff/login"
              >
                <span>केंद्र लॉगिन</span>
              </Link>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                aria-label="Toggle menu"
                className="p-2 rounded-md text-charcoal-700 hover:text-brand-900 hover:bg-stonebg-100"
                id="mobileMenuBtn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d={
                      mobileMenuOpen
                        ? 'M6 18L18 6M6 6l12 12'
                        : 'M4 6h16M4 12h16m-7 6h7'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden border-t border-stonebg-200 bg-white px-4 pt-3 pb-6 space-y-3"
            id="mobileMenu"
          >
            <a
              className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900"
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900"
              href="#live-queue"
              onClick={() => setMobileMenuOpen(false)}
            >
              Live Mandi Queue
            </a>
            <a
              className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900"
              href="#mandi-prices"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mandi &amp; MSP Rates
            </a>
            <a
              className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900"
              href="#voice-engine"
              onClick={() => setMobileMenuOpen(false)}
            >
              Voice Helpline (1800-180-1551)
            </a>
            <a
              className="block py-2 text-base font-medium text-charcoal-800 hover:text-brand-900"
              href="#verification"
              onClick={() => setMobileMenuOpen(false)}
            >
              Audit &amp; Tamper-Proofing
            </a>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                className="w-full text-center py-2.5 rounded-md bg-brand-900 text-white font-semibold text-sm"
                href="/farmer"
                onClick={() => setMobileMenuOpen(false)}
              >
                किसान सेवा पोर्टल (Farmer Access)
              </Link>
              <Link
                className="w-full text-center py-2.5 rounded-md bg-stonebg-100 text-charcoal-800 border border-stonebg-300 font-semibold text-sm"
                href="/staff/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                केंद्र लॉगिन (Staff Dashboard)
              </Link>
            </div>
          </div>
        )}
      </header>
      {/* END: NavigationBar */}

      {/* BEGIN: HeroSection */}
      <section
        className="relative min-h-[90vh] bg-brand-950 text-white flex items-center overflow-hidden"
        data-purpose="cinematic-hero"
      >
        {/* Background Image with Authentic National Geographic documentary feel */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Indian farmer harvesting golden wheat crop during morning light in Madhya Pradesh"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U5hik24fgbfU_n6fXjpuyTj0x6jefFUjBzFU2RWJMETWr2Rh4Z5RRXFW0abDZYlNQgamlNix_SmUYeHX1gzx4S-mf8uJL9klfaJ28ZjWDD3159aTgSPqBKjjKQX2ZWp-8AmIMXYChkPSZ4b-_D5Aqm2laBhd7f2OkKS0GQq9OURSZxeY4cvpPMGMjrc25GgPZfdR619kU10Zbox8N05hyXfoeYEgAsKbOQPCthz5lS0MgPCmU0bQvI9g"
          />
          {/* Deep Institutional Vignette & Gradient Overlays for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-brand-950/40"></div>
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-brand-950/50 to-brand-950/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          {/* Interactive 4-Pill Narrative Switcher */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
            <div
              className="inline-flex p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 gap-1"
              role="tablist"
            >
              {['1. Know Arrival Time', '2. Less Waiting', '3. Digital Weighing', '4. Simple Phone Call'].map(
                (tabName, idx) => (
                  <button
                    key={idx}
                    className={`hero-tab-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                      heroTab === idx
                        ? 'active bg-brand-800/90 text-white shadow-sm'
                        : 'text-stone-200 hover:text-white'
                    }`}
                    onClick={() => setHeroTab(idx)}
                    type="button"
                  >
                    {tabName}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Primary Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-harvest/20 border border-harvest/40 text-harvest-light text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-harvest animate-ping"></span>
                <span>RABI PROCUREMENT SEASON 2025–26 LIVE</span>
              </div>
              <div className="space-y-4" id="heroTextContainer">
                <h1
                  className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
                  id="heroHeadline"
                >
                  {heroSlides[heroTab].headline}
                </h1>
                <p
                  className="font-hindi text-xl sm:text-2xl text-stone-200 font-medium leading-relaxed"
                  id="heroHindiSubtitle"
                >
                  {heroSlides[heroTab].hindi}
                </p>
                <p
                  className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-normal"
                  id="heroBody"
                >
                  {heroSlides[heroTab].body}
                </p>
              </div>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl text-base font-bold text-white bg-brand-700 hover:bg-brand-600 border border-brand-500/50 shadow-lg hover:shadow-brand-700/30 transition-all gap-2 group"
                  href="/farmer"
                >
                  <span>किसान सेवा पोर्टल (Track Arrival &amp; Queue)</span>
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    ></path>
                  </svg>
                </Link>
                <Link
                  className="inline-flex items-center justify-center px-5 py-4 rounded-xl text-sm font-semibold text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm transition-all"
                  href="/staff/login"
                >
                  <span>उपार्जन केंद्र पोर्टल (Staff Desk)</span>
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-8 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <span>NIC &amp; PFMS Standard Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-harvest-light" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
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
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Rajapur Mandi Procurement Centre
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Sehore District, Madhya Pradesh • Today&apos;s Wheat Lot
                  </p>
                </div>

                {/* Centre Tally Snapshot */}
                <div className="grid grid-cols-2 divide-x divide-stonebg-200 bg-stonebg-100 border-b border-stonebg-200 text-center py-2.5">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-semibold">
                      Total Arrived
                    </span>
                    <span className="text-base font-bold text-brand-950 font-mono">124 Farmers</span>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-charcoal-600 font-semibold">
                      In Line Now
                    </span>
                    <span className="text-base font-bold text-harvest-dark font-mono">18 In Queue</span>
                  </div>
                </div>

                {/* Live Farmer Token Spotlight */}
                <div className="p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold text-charcoal-600 tracking-wider">
                        Assigned Token
                      </span>
                      <div className="text-4xl font-extrabold text-brand-900 font-mono tracking-tight mt-0.5">
                        #047
                      </div>
                      <span className="text-xs font-semibold text-charcoal-700">
                        Rameshwar Patel • MP-04-GB-9821
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold text-charcoal-600 tracking-wider">
                        Est. Wait Time
                      </span>
                      <div className="text-2xl font-bold text-brand-950 font-mono mt-0.5 text-harvest-dark">
                        ~42 Min
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">16 vehicles ahead</span>
                    </div>
                  </div>

                  {/* 4-Stage Mini Progress Ribbon */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-brand-800">1. Arrived (09:52 AM)</span>
                      <span className="text-brand-900 underline decoration-harvest decoration-2">
                        2. In Queue
                      </span>
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
                    <button
                      className="w-full py-2.5 px-4 rounded-lg bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2"
                      type="button"
                    >
                      <svg className="w-4 h-4 text-harvest-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                      <span>Receive Phone Call When 2 Farmers Ahead</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: JourneySection */}
      <section
        className="py-20 bg-stonebg-100 border-b border-stonebg-300"
        data-purpose="six-stage-journey"
        id="how-it-works"
      >
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

          {/* Interactive 6 Stage Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8" role="tablist">
            {[
              { num: 1, label: '1. Book Slot', sub: 'आवक समय चयन' },
              { num: 2, label: '2. Arrive & Check-in', sub: 'गेट पास व टोकन' },
              { num: 3, label: '3. Live Queue', sub: 'पारदर्शी प्रतीक्षा' },
              { num: 4, label: '4. Electronic Weigh', sub: 'डिजिटल कांटा तौल' },
              { num: 5, label: '5. J-Form Procure', sub: 'जे-फॉर्म खरीद पर्ची' },
              { num: 6, label: '6. Direct Payment', sub: 'डीबीटी बैंक भुगतान' },
            ].map((stg) => (
              <button
                key={stg.num}
                className={`stage-nav-btn text-left p-3.5 rounded-xl border transition-all ${
                  activeStage === stg.num
                    ? 'border-brand-800 bg-brand-900 text-white shadow-sm'
                    : 'border-stonebg-300 bg-white text-charcoal-800 hover:border-brand-700'
                }`}
                onClick={() => setActiveStage(stg.num)}
                type="button"
              >
                <div
                  className={`flex items-center justify-between text-xs font-mono font-bold mb-1 ${
                    activeStage === stg.num ? 'opacity-80' : 'text-charcoal-600'
                  }`}
                >
                  <span>0{stg.num}</span>
                  {activeStage === stg.num && <span className="w-2 h-2 rounded-full bg-harvest"></span>}
                </div>
                <div className="font-bold text-sm leading-tight">{stg.label}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    activeStage === stg.num ? 'text-stone-200' : 'text-charcoal-600'
                  }`}
                >
                  {stg.sub}
                </div>
              </button>
            ))}
          </div>

          {/* Dynamic Stage Detail Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="stageDynamicContent">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-block px-3 py-1 bg-brand-50 text-brand-900 border border-brand-200 rounded-md font-mono text-xs font-bold">
                  STAGE {currentStage.stageNum} OF 06
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-brand-950">{currentStage.title}</h3>
                <p className="font-hindi text-base text-charcoal-700 font-medium">{currentStage.hindi}</p>
                <p className="text-charcoal-700 text-sm leading-relaxed">{currentStage.body}</p>
                <div className="border-t border-stonebg-200 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
                    <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                    <span>Automated SMS Confirmation with Entry Gate PIN</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-800">
                    <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
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
      {/* END: JourneySection */}

      {/* BEGIN: LiveQueueSection */}
      <section
        className="py-20 relative bg-brand-950 text-white overflow-hidden"
        data-purpose="live-queue-experience"
        id="live-queue"
      >
        {/* Yard Image Background with Dark Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            alt="Indian agricultural mandi procurement yard with bags and digital scale"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Uqt2sVt_3cAibjMN9l4b1WhsM1ToE6hTz2pWHcPDAKUFxSbzIH8hUorAtrg_1PX7IdI1X-SXZPGA6wWQp1wGeW2CwP8kYBQY5I19FotJ4NWJ69nG879zrM2kY7YDl5N_HetGFqHwCRc37ykrN2-k2fon9tbxJeonLU6Y2rCNjRGp99ttDH8x2NAr1XybFmG4BMQI2giQmXAFndtgCh4jpVGJX0idVue7DhRTeK17QkFrrfzRAnDQdSCPs"
          />
        </div>

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
                    <span className="text-xs font-mono font-bold text-charcoal-600 uppercase tracking-wider block">
                      Live Mandi Screen
                    </span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-600 block mb-3">
                    Today&apos;s Token Sequence
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2 ticker-bar">
                    <div className="flex-shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-200 text-center opacity-70">
                      <span className="block text-[10px] text-charcoal-600 font-mono">TOKEN</span>
                      <span className="text-sm font-bold line-through">#029</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Weigh Done</span>
                    </div>
                    <div className="flex-shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-200 text-center opacity-70">
                      <span className="block text-[10px] text-charcoal-600 font-mono">TOKEN</span>
                      <span className="text-sm font-bold line-through">#030</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Weigh Done</span>
                    </div>
                    <div className="flex-shrink-0 w-28 p-2.5 rounded-lg bg-harvest-50 border-2 border-harvest text-center">
                      <span className="block text-[10px] text-harvest-dark font-mono font-bold">ON SCALE NOW</span>
                      <span className="text-base font-extrabold text-charcoal-900 font-mono">#031</span>
                      <span className="block text-[10px] text-harvest-dark font-bold animate-pulse">48.60 Qtl</span>
                    </div>
                    <div className="flex-shrink-0 w-24 p-2.5 rounded-lg bg-brand-50 border border-brand-200 text-center">
                      <span className="block text-[10px] text-brand-800 font-mono">NEXT UP</span>
                      <span className="text-sm font-bold text-brand-950 font-mono">#032</span>
                      <span className="block text-[10px] text-brand-700">Call Gate B</span>
                    </div>
                    <div className="flex-shrink-0 w-24 p-2.5 rounded-lg bg-stonebg-100 text-center border border-dashed border-stonebg-300">
                      <span className="block text-[10px] text-charcoal-600 font-mono">WAITING</span>
                      <span className="text-sm font-bold text-charcoal-700 font-mono">#033</span>
                      <span className="block text-[10px] text-charcoal-600">~6 Min</span>
                    </div>
                    <div className="flex-shrink-0 w-24 p-2.5 rounded-lg bg-brand-900 text-white text-center shadow">
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
                <span>
                  Last refreshed at: <strong>10:14:02 AM</strong> (Auto-syncs every 15s)
                </span>
                <span className="text-brand-900 font-bold underline cursor-pointer">View CCTV Mandi Gate View</span>
              </div>
            </div>

            {/* Phone Notification Preview (SMS Fallback Simulator) */}
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
                    <span>SENDER: VM-KISANCALL-MP</span>
                    <span>10:12 AM</span>
                  </div>
                  <p className="text-stone-100 leading-relaxed font-sans">
                    &ldquo;प्रिय रमेश जी, राजापुर उपार्जन केंद्र पर आपका टोकन <strong>#047</strong> है। आपकी तुलाई का अनुमानित समय <strong>10:54 AM</strong> है (16 किसान आगे)। कृपया अपने वाहन को प्लेटफॉर्म #2 की लेन में तैयार रखें।&rdquo;
                  </p>
                  <div className="pt-2 text-[11px] text-harvest-light font-sans font-medium">
                    स्थिति पुनः जानने हेतु 1800-180-1551 पर कॉल करें (मुफ्त)।
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="p-4 rounded-xl bg-brand-900/60 border border-brand-700/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-harvest flex items-center justify-center text-brand-950 font-bold shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
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
      {/* END: LiveQueueSection */}

      {/* BEGIN: MandiPricesSection */}
      <section
        className="py-20 bg-stonebg-50 border-b border-stonebg-300"
        data-purpose="market-rates-and-msp"
        id="mandi-prices"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
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

            {/* MSP Distinction Flag Banner */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-stonebg-300 shadow-xs text-xs">
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

          {/* Price Snapshot Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Key Rate Metric Spotlight */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stonebg-300 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-charcoal-600 mb-2">
                  <span className="font-bold uppercase tracking-wider">SELECTED COMMODITY</span>
                  <span className="text-brand-800 font-semibold font-mono">APMC SEHORE (MP)</span>
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
                  <span className="text-xs font-bold text-harvest-dark uppercase block">
                    Central Govt MSP + State Bonus
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-charcoal-900 font-mono">₹2,450</span>
                    <span className="text-xs font-semibold text-harvest-dark font-hindi font-bold">
                      (₹2,400 MSP + ₹50 बोनस)
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-700 mt-1">
                    Mandatory procurement rate for verified FAQ wheat at Rajapur centre.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stonebg-200 flex items-center justify-between text-xs">
                <span className="text-charcoal-600">Source: Agmarknet APMC Feed</span>
                <span className="font-bold text-brand-900">03-Mar-2026 Updated</span>
              </div>
            </div>

            {/* SVG Historical Chart & Visual Trends */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-brand-950">Mandi Price Movement vs Guaranteed MSP</h4>
                    <p className="text-xs text-charcoal-600">Past procurement trends indicating peak selling windows</p>
                  </div>
                  {/* Time Selector Buttons */}
                  <div className="inline-flex p-1 bg-stonebg-100 rounded-lg border border-stonebg-200 text-xs font-semibold">
                    {(['7d', '14d', '30d'] as const).map((rng) => (
                      <button
                        key={rng}
                        className={`px-3 py-1 rounded transition-all ${
                          chartRange === rng
                            ? 'bg-brand-900 text-white shadow-xs'
                            : 'text-charcoal-700 hover:text-brand-950'
                        }`}
                        onClick={() => setChartRange(rng)}
                        type="button"
                      >
                        {rng === '7d' ? '7 Days' : rng === '14d' ? '14 Days' : '30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Data Chart Display */}
                <div className="w-full h-56 relative" data-purpose="trend-chart-container">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                    {/* Grid Lines */}
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="30" y2="30"></line>
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="80" y2="80"></line>
                    <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                    <line stroke="#CBD5E1" strokeWidth="1" x1="0" x2="700" y1="180" y2="180"></line>
                    {/* MSP Fixed Reference Line */}
                    <line stroke="#C68A2C" strokeDasharray="6" strokeWidth="2" x1="0" x2="700" y1="75" y2="75"></line>
                    <text fill="#926017" fontFamily="sans-serif" fontSize="11" fontWeight="bold" x="590" y="70">
                      MSP Floor: ₹2,450
                    </text>
                    {/* Gradient fill under curve */}
                    <defs>
                      <linearGradient id="priceGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#15803D" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#15803D" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>
                    <path d={chartPaths[chartRange].area} fill="url(#priceGradient)" id="chartPathArea"></path>
                    <path
                      d={chartPaths[chartRange].line}
                      fill="none"
                      id="chartPathLine"
                      stroke="#0B3B18"
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></path>
                    {/* Interactive High Points */}
                    <circle cx="240" cy="130" fill="#0B3B18" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                    <circle cx="480" cy="90" fill="#0B3B18" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                    <circle cx="700" cy="80" fill="#C68A2C" r="6" stroke="#FFFFFF" strokeWidth="2"></circle>
                  </svg>

                  {/* Chart Labels */}
                  <div className="flex justify-between text-[11px] text-charcoal-600 font-mono mt-2">
                    {chartPaths[chartRange].labels.map((lbl, i) => (
                      <span
                        key={i}
                        className={i === chartPaths[chartRange].labels.length - 1 ? 'font-bold text-brand-950' : ''}
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stonebg-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-charcoal-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-brand-900 inline-block"></span> Open Mandi Auction Trend
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-harvest inline-block"></span> Govt Procurement Target
                  </span>
                </div>
                <a className="font-bold text-brand-900 hover:underline" href="#mandi-details">
                  Download Detailed Mandi Price Bulletin (PDF) →
                </a>
              </div>
            </div>
          </div>

          {/* Quality Inspection Documentary Preview Banner */}
          <div className="bg-brand-900 rounded-2xl overflow-hidden border border-brand-800 text-white grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-4 h-56 md:h-full">
              <img
                alt="Close up documentary photograph of golden wheat grains inspected over burlap sacks"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VhiWeJsUMYSKQdmNb27u_W_KaQEv262lA-_IXTVKLVh5CXaqBu-fHcmqx45he8CwDcvibw8YcHyUH3EeVk7Wjb0DdKKwG9CzGvLiutIeyuQteqMCVvS8wtLaypMRo8k4XMePIZisHtwHE3lR2ukK_100NAmnetDlDp_fblQlj3ZYeqk8UgGaPLFHgzAnO7kCLqvWQOSJIGSsRILk-ZhQn8VjdH1aNT53qvt1eByE_Ox3diwxo_to2M2ZE"
              />
            </div>
            <div className="md:col-span-8 p-6 sm:p-8 space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-harvest-light">
                QUALITY STANDARD COMPLIANCE
              </span>
              <h4 className="text-xl sm:text-2xl font-bold">Fair Average Quality (FAQ) Wheat Specifications</h4>
              <p className="text-sm text-stone-200 font-hindi">
                सरकारी उपार्जन में नमी 12% से कम और विदेशी तत्व 0.75% से कम होना अनिवार्य है। डिजिटल नमी विश्लेषक तुरंत तौल कांटे पर रीडिंग दर्ज करता है।
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-stone-300">
                <span className="px-2.5 py-1 bg-white/10 rounded">Max Moisture: 12.0%</span>
                <span className="px-2.5 py-1 bg-white/10 rounded">Foreign Matter: &lt; 0.75%</span>
                <span className="px-2.5 py-1 bg-white/10 rounded">Slightly Damaged: &lt; 2.0%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: MandiPricesSection */}

      {/* BEGIN: ComparisonSection */}
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

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Traditional System */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stonebg-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-red-700 uppercase">Legacy Status Quo</span>
                  <h3 className="text-xl font-bold text-charcoal-900">Traditional Mandi Arrival</h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  ✕
                </span>
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
                    <strong className="text-charcoal-900 block font-semibold">8 to 14 Hours Idle Waiting</strong>
                    Farmers sleep in tractor trailers overnight during peak harvest rush, losing daily wages.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold">Manual Weight Discrepancies</strong>
                    Mechanical beam scales and manual entry slips lead to frequent weigh disputes and deduction fears.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <strong className="text-charcoal-900 block font-semibold">Untracked Payment Status</strong>
                    Farmers visit tehsil offices multiple times over 30 days just to ask if their payment cleared.
                  </div>
                </li>
              </ul>
            </div>

            {/* Card 2: With KisanCall */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-brand-800 shadow-md space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                KisanCall Standard
              </div>
              <div className="flex items-center justify-between border-b border-stonebg-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-brand-800 uppercase">Coordinated Workflow</span>
                  <h3 className="text-xl font-bold text-brand-950">With KisanCall Coordination</h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold">
                  ✓
                </span>
              </div>
              <ul className="space-y-4 text-sm text-charcoal-800">
                <li className="flex items-start gap-3">
                  <span className="text-brand-700 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Reserved 2-Hour Arrival Window</strong>
                    Farmers enter with scheduled slot tickets. Mandi gates operate at orderly, continuous capacity.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-700 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Predictable ~42 Minute Yard Processing</strong>
                    Real-time queue display and SMS alerts let farmers rest under mandi shades till token is active.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-700 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">Tamper-Evident Direct Scale Capture</strong>
                    Digital scale transmits kilograms directly to central ledger with zero manual intermediary
                    intervention.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-700 font-bold shrink-0 mt-0.5">✓</span>
                  <div>
                    <strong className="text-brand-950 block font-semibold">
                      Direct DBT Verification Within 24-48 Hours
                    </strong>
                    Digital J-Form sent to mobile with PFMS transfer reference; automated call when funds hit bank.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* END: ComparisonSection */}

      {/* BEGIN: VoiceEngineSection */}
      <section
        className="py-20 bg-brand-950 text-white relative overflow-hidden"
        data-purpose="voice-first-infrastructure"
        id="voice-engine"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Documentary Photo & Audio Context */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-brand-700 shadow-2xl">
                <img
                  alt="Indian farmer speaking into simple mobile phone near rural mandi procurement yard"
                  className="w-full h-auto object-cover filter contrast-105"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WCASnOQi7Ze2IAMBzBBh1V1Mm_M6OKXwpAcz4d_lqAI4e-T-3bMXVx7fCX5E65WWi8kIuK7hmL9hbeTxGQbYCIMhddpkFnW2j0KUHT8uM9NXWjZUl0dE0K-2ItRAdVLXc85tNRj1YJZ3g6dYWu-qugu-1MWZ6O2OfspIsnkkFe12Fm1WO0F3sh6cLGZTWhHYDkp3poLfyvGGqUkwVMkMHq7yXjMKD_TEpNVEYSim4VbK9mAjxlTMM_Xw"
                />
              </div>
              {/* Floating Toll Free Ribbon */}
              <div className="absolute -bottom-5 right-4 bg-harvest text-brand-950 px-5 py-3 rounded-xl shadow-xl border border-harvest-light flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block">
                    NATIONAL TOLL-FREE HELPLINE
                  </span>
                  <strong className="font-mono text-base font-extrabold tracking-tight">1800-180-1551</strong>
                </div>
              </div>
            </div>

            {/* Right: Spoken Dialogue Mockup & Architecture */}
            <div className="lg:col-span-7 space-y-6 lg:pl-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-harvest-light uppercase block mb-1">
                  INCLUSIVE VOICE INTERFACE
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  You don&apos;t need an app to use KisanCall. A phone call is enough.
                </h2>
                <p className="font-hindi text-lg text-stone-300 mt-1">
                  सरल कीपैड फोन, कम नेटवर्क और क्षेत्रीय भाषाओं के लिए विशेष रूप से निर्मित।
                </p>
              </div>

              {/* Spoken Dialogue Simulation Card */}
              <div className="bg-brand-900/80 rounded-2xl p-5 sm:p-6 border border-brand-700/60 space-y-4">
                <div className="text-xs uppercase font-bold tracking-wider text-harvest-light flex items-center justify-between border-b border-brand-700/60 pb-2">
                  <span>Interactive Voice Response (IVR) Sample</span>
                  <span className="text-stone-300 font-mono">Hindi / Malwi dialect</span>
                </div>

                {/* Dialogue 1: Farmer speaks */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold shrink-0 text-white">
                    किसान
                  </div>
                  <div className="bg-stone-800/80 p-3.5 rounded-xl text-stone-100 text-sm max-w-md border border-stone-700">
                    <p className="font-hindi text-base font-medium">&ldquo;मेरा नंबर कब आएगा?&rdquo;</p>
                    {/* Audio Waveform Illustration */}
                    <div className="flex items-center gap-1 mt-2 text-harvest-light">
                      <span className="w-1 h-3 bg-harvest-light rounded-full"></span>
                      <span className="w-1 h-5 bg-harvest-light rounded-full"></span>
                      <span className="w-1 h-2 bg-harvest-light rounded-full"></span>
                      <span className="w-1 h-4 bg-harvest-light rounded-full"></span>
                      <span className="w-1 h-1 bg-harvest-light rounded-full"></span>
                      <span className="text-[10px] font-mono text-stone-400 ml-2">Voice Input Detected</span>
                    </div>
                  </div>
                </div>

                {/* Dialogue 2: KisanCall System Answers */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-emerald-950/80 p-3.5 rounded-xl text-stone-100 text-sm max-w-md border border-emerald-700/60">
                    <p className="font-hindi text-base font-semibold text-emerald-300">
                      &ldquo;नमस्ते रमेश जी। आपका टोकन 47 है। आपसे पहले 16 किसान हैं। अनुमानित प्रतीक्षा समय 42 मिनट है।&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-800/60 text-[10px] text-stone-300">
                      <span>AI Dialect Engine: Instant Synthesis</span>
                      <span className="text-emerald-400 font-bold">Latency: 0.6s</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold shrink-0 text-white">
                    KC
                  </div>
                </div>
              </div>

              {/* Architecture Pipeline Flow */}
              <div className="pt-2">
                <span className="text-xs font-mono font-bold uppercase text-stone-400 block mb-3">
                  System Architecture Pipeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="block text-harvest-light font-bold">1800 IVR Call</span>
                    <span className="text-[10px] text-stone-300 font-sans">Telecom Gateway</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="block text-harvest-light font-bold">ASR Dialect</span>
                    <span className="text-[10px] text-stone-300 font-sans">Hindi &amp; Regional</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="block text-harvest-light font-bold">Mandi Ledger</span>
                    <span className="text-[10px] text-stone-300 font-sans">Scale &amp; Token DB</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="block text-harvest-light font-bold">Instant TTS/SMS</span>
                    <span className="text-[10px] text-stone-300 font-sans">Dual Channel Feed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: VoiceEngineSection */}

      {/* BEGIN: ProductShowcaseSection */}
      <section className="py-20 bg-stonebg-50 border-b border-stonebg-300" data-purpose="product-consoles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
              INTERFACES BUILT FOR PURPOSE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              Dedicated views for farmers and yard operators.
            </h2>
            <p className="font-hindi text-base text-charcoal-700 mt-1">
              सरल मोबाइल दृश्य किसान के लिए, विस्तृत मॉनिटरिंग कंसोल केंद्र प्रभारियों के लिए।
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-xl bg-stonebg-200 inline-flex border border-stonebg-300">
              <button
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                  appTab === 'farmer'
                    ? 'font-bold bg-white text-brand-950 shadow-xs'
                    : 'font-semibold text-charcoal-700 hover:text-brand-950'
                }`}
                id="tab-farmer-btn"
                onClick={() => setAppTab('farmer')}
                type="button"
              >
                Farmer Mobile Experience
              </button>
              <button
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                  appTab === 'staff'
                    ? 'font-bold bg-white text-brand-950 shadow-xs'
                    : 'font-semibold text-charcoal-700 hover:text-brand-950'
                }`}
                id="tab-staff-btn"
                onClick={() => setAppTab('staff')}
                type="button"
              >
                Procurement Centre Staff Console
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div id="product-showcase-container">
            {/* View A: Farmer Mobile Interface */}
            {appTab === 'farmer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="view-farmer-app">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono font-bold text-brand-800 uppercase">
                    SMARTPHONE WEB &amp; PWA APP
                  </span>
                  <h3 className="text-2xl font-bold text-brand-950">Everything in One Glance</h3>
                  <p className="text-sm text-charcoal-700 leading-relaxed">
                    Designed with ultra-large touch targets, readable Devanagari numerals, offline pass storage, and
                    zero unnecessary navigation layers.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-charcoal-800">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                      Digital Gate Pass QR Code with offline cryptographic validation
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                      Direct digital receipt (J-Form) downloadable immediately after scale
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                      Aadhaar PFMS DBT bank account status tracker
                    </li>
                  </ul>
                </div>

                {/* Mobile Phone Frame Mockup */}
                <div className="lg:col-span-7 flex justify-center">
                  <div className="w-full max-w-sm bg-stone-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-stone-800">
                    <div className="bg-white rounded-[2rem] overflow-hidden border border-stone-200">
                      {/* Phone Top Bar */}
                      <div className="bg-brand-950 text-white px-5 pt-4 pb-3 flex justify-between items-center text-xs">
                        <span className="font-bold">10:14 AM</span>
                        <div className="flex items-center gap-1.5">
                          <span>4G</span>
                          <div className="w-4 h-2 bg-white rounded-xs"></div>
                        </div>
                      </div>

                      {/* Farmer App Body */}
                      <div className="p-4 space-y-3 bg-stonebg-100">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-sm text-brand-950 font-sans">
                            KISAN<span className="text-harvest">CALL</span>
                          </span>
                          <span className="text-[11px] bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-bold">
                            रबी 2025-26
                          </span>
                        </div>

                        {/* Today's Visit Card */}
                        <div className="bg-white rounded-xl p-4 shadow-xs border border-stonebg-300 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-charcoal-600">Active Gate Pass</span>
                              <h5 className="text-sm font-bold text-charcoal-900">Rajapur Procurement Yard</h5>
                            </div>
                            <span className="text-xs font-mono font-extrabold bg-brand-900 text-white px-2 py-0.5 rounded">
                              #047
                            </span>
                          </div>

                          {/* Mini Visual QR */}
                          <div className="flex items-center gap-3 bg-stonebg-50 p-2.5 rounded-lg border border-stonebg-200">
                            <div className="w-12 h-12 bg-charcoal-900 rounded flex items-center justify-center text-white text-[9px] font-mono">
                              QR PASS
                            </div>
                            <div className="text-[11px]">
                              <span className="block font-bold text-brand-950">Entry PIN: KC-9042</span>
                              <span className="text-charcoal-600">Scan at Scale Ingate</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                            <div className="p-2 bg-stonebg-100 rounded">
                              <span className="text-[10px] text-charcoal-600 block">Queue Ahead</span>
                              <strong className="text-sm text-brand-900">16 Farmers</strong>
                            </div>
                            <div className="p-2 bg-harvest-50 rounded">
                              <span className="text-[10px] text-harvest-dark block">Est. Time</span>
                              <strong className="text-sm text-harvest-dark">~42 Min</strong>
                            </div>
                          </div>
                        </div>

                        {/* Action Quick Button */}
                        <button
                          className="w-full py-2.5 bg-brand-900 text-white text-xs font-bold rounded-lg shadow-sm"
                          type="button"
                        >
                          View Live Scale Video Feed
                        </button>
                        <div className="text-center text-[10px] text-charcoal-600 font-hindi">
                          समस्या होने पर सीधे केंद्र प्रभारी से संपर्क करें
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View B: Staff Console */}
            {appTab === 'staff' && (
              <div className="space-y-6" id="view-staff-app">
                <div className="bg-white rounded-2xl p-6 border border-stonebg-300 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stonebg-200 pb-4 gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-800 uppercase">
                        MANDI DESK OPERATIONS CONSOLE
                      </span>
                      <h3 className="text-xl font-bold text-brand-950">
                        Rajapur Procurement Station #04 — Officer: M. S. Chouhan
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-brand-900 text-white rounded text-xs font-bold">
                        + New On-Spot Token
                      </button>
                      <button className="px-3 py-1.5 bg-stonebg-100 border text-charcoal-800 rounded text-xs font-bold">
                        Print Daily Day-Sheet
                      </button>
                    </div>
                  </div>

                  {/* Stats Ribbon */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="p-3 bg-stonebg-100 rounded-xl border border-stonebg-200">
                      <span className="text-xs text-charcoal-600 block">Today&apos;s Total Arrival</span>
                      <span className="text-2xl font-bold text-brand-950 font-mono">124</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs text-amber-800 block">In Queue (Yard)</span>
                      <span className="text-2xl font-bold text-amber-900 font-mono">18</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-xs text-emerald-800 block">Weighed &amp; Completed</span>
                      <span className="text-2xl font-bold text-emerald-900 font-mono">99</span>
                    </div>
                    <div className="p-3 bg-brand-50 rounded-xl border border-brand-200">
                      <span className="text-xs text-brand-800 block">J-Forms Cleared for DBT</span>
                      <span className="text-2xl font-bold text-brand-900 font-mono">₹2.41 Cr</span>
                    </div>
                  </div>

                  {/* Active Yard Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-stonebg-200">
                      <thead className="bg-stonebg-200 font-bold uppercase text-charcoal-700">
                        <tr>
                          <th className="p-2.5">Token</th>
                          <th className="p-2.5">Farmer Name</th>
                          <th className="p-2.5">Vehicle Reg.</th>
                          <th className="p-2.5">Crop / Grade</th>
                          <th className="p-2.5">Scale Station</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stonebg-200 font-mono">
                        <tr className="bg-emerald-50/60 font-sans">
                          <td className="p-2.5 font-bold font-mono">#031</td>
                          <td className="p-2.5 font-medium">Bhawani Singh</td>
                          <td className="p-2.5 font-mono text-charcoal-600">MP-04-E-4412</td>
                          <td className="p-2.5">Wheat Lok-1 (10.4%)</td>
                          <td className="p-2.5 font-bold text-brand-900">Scale #2 (Bridge)</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                              Weighing (48.60 Q)
                            </span>
                          </td>
                          <td className="p-2.5">
                            <button className="text-brand-900 font-bold underline font-sans">Approve J-Form</button>
                          </td>
                        </tr>
                        <tr className="font-sans">
                          <td className="p-2.5 font-bold font-mono">#032</td>
                          <td className="p-2.5 font-medium">Devendra Meena</td>
                          <td className="p-2.5 font-mono text-charcoal-600">MP-37-T-9011</td>
                          <td className="p-2.5">Wheat FAQ (11.1%)</td>
                          <td className="p-2.5 text-charcoal-600">Scale #1</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                              Called to Scale
                            </span>
                          </td>
                          <td className="p-2.5">
                            <button className="text-charcoal-700 underline font-sans">Send Bell Alert</button>
                          </td>
                        </tr>
                        <tr className="font-sans">
                          <td className="p-2.5 font-bold font-mono text-brand-900">#047</td>
                          <td className="p-2.5 font-medium">Rameshwar Patel</td>
                          <td className="p-2.5 font-mono text-charcoal-600">MP-04-GB-9821</td>
                          <td className="p-2.5">Wheat Lok-1</td>
                          <td className="p-2.5 text-charcoal-600">Waiting Yard A</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 bg-stonebg-200 text-charcoal-800 rounded">
                              In Queue (~42m)
                            </span>
                          </td>
                          <td className="p-2.5">
                            <button className="text-charcoal-700 underline font-sans">View Token Slip</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* END: ProductShowcaseSection */}

      {/* BEGIN: VerificationSection */}
      <section
        className="py-20 bg-white border-b border-stonebg-300"
        data-purpose="tamper-evident-audit"
        id="verification"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Explanatory Proof Pillar */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block">
                AUDITABILITY &amp; INSTITUTIONAL TRUST
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight leading-tight">
                Every quintal verified. <br />
                Every transaction signed.
              </h2>
              <p className="font-hindi text-base text-charcoal-700 font-medium">
                कांटे पर तुलाई होते ही वजन और ग्रेड का डिजिटल रिकॉर्ड सुरक्षित हो जाता है, जिससे बाद में किसी भी प्रकार की हेराफेरी संभव नहीं।
              </p>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                KisanCall operates on tamper-evident cryptographic ledgers designed for public auditability without volatile crypto tokens or speculative hype. Scale weights stream straight from certified RS-232 serial telemetry into the mandi ledger.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold text-charcoal-800">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Hardware Handshake with Weighbridge Digital Indicator</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-charcoal-800">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>SHA-256 Checksum on J-Form Procure Receipt</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-charcoal-800">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Direct PFMS API Link for Farmer DBT Disbursement</span>
                </div>
              </div>
            </div>

            {/* Right: Verifiable Digital J-Form Receipt Card */}
            <div className="lg:col-span-6" data-purpose="verifiable-receipt">
              <div className="bg-stonebg-50 rounded-2xl p-6 sm:p-8 border border-stonebg-300 shadow-lg relative font-sans">
                {/* Watermark badge */}
                <div className="absolute top-4 right-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase">
                  GOVT AUDIT CLEARED
                </div>
                <div className="border-b border-stonebg-300 pb-4 mb-4">
                  <span className="text-xs font-mono uppercase text-charcoal-600 block">
                    GOVERNMENT OF MADHYA PRADESH • APMC PROCUREMENT
                  </span>
                  <h4 className="text-lg font-bold text-brand-950 mt-0.5">E-Procurement &amp; Digital J-Form Certificate</h4>
                  <span className="text-xs font-mono text-charcoal-600">
                    Ref: <strong>KC-PROC-2026-89412B</strong>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-charcoal-600 block">Farmer Name:</span>
                      <span className="font-bold text-charcoal-900">Rameshwar Patel</span>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">Aadhaar Linked Acct:</span>
                      <span className="font-mono font-bold text-charcoal-900">SBI •••• 9102</span>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">Gross Weighed Quantity:</span>
                      <span className="font-mono font-bold text-brand-950 text-sm">48.60 Quintals</span>
                    </div>
                    <div>
                      <span className="text-charcoal-600 block">Verified MSP Rate:</span>
                      <span className="font-mono font-bold text-charcoal-900 text-sm">₹2,425 / Qtl</span>
                    </div>
                  </div>

                  {/* Price Computation Box */}
                  <div className="p-3.5 bg-white rounded-xl border border-stonebg-200 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-charcoal-600">Total Purchase Value:</span>
                      <span className="font-mono font-bold text-charcoal-900">48.60 × ₹2,425 = ₹1,17,855.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1 pt-1 border-t border-stonebg-200">
                      <span className="font-bold text-brand-950">Disbursement Status:</span>
                      <span className="font-bold text-emerald-700">PFMS Initiated (ETA 24 Hrs)</span>
                    </div>
                  </div>

                  {/* Cryptographic Signature Line */}
                  <div className="pt-2 font-mono text-[10px] text-charcoal-600 break-all bg-stonebg-200/60 p-2.5 rounded border border-stonebg-300">
                    <span className="font-bold text-charcoal-800 block mb-0.5">TAMPER-PROOF LEDGER HASH (SHA-256):</span>
                    0x8f3a992c10bdfa74512e0988bc1142e0a811559bfad402941091ca28114091c2
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-charcoal-600">
                  <span>Electronic Sign: Mandi Quality In-Charge</span>
                  <a className="font-bold text-brand-900 hover:underline" href="#verify">
                    Verify Hash Authenticity →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: VerificationSection */}

      {/* BEGIN: RealFarmerPillars */}
      <section className="py-20 bg-stonebg-100 border-b border-stonebg-300" data-purpose="accessibility-pillars">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-brand-800 uppercase block mb-1">
              ACCESSIBLE BY DESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
              Built for real Indian farm conditions.
            </h2>
            <p className="font-hindi text-base text-charcoal-700 mt-1">
              प्रत्येक किसान के लिए सहज, सुगम और बिना किसी तकनीकी बाधा के।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Voice-First Toll-Free IVR</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                No internet or data pack required. Call 1800-180-1551 from any basic phone to register, check token queue,
                and receive instant spoken updates.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Native Bilingual &amp; Dialects</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Deep Hindi &amp; regional dialect support with clear voice pronunciation tuned for rural agricultural
                terminology.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Smartphone Optional</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                All notifications are mirrored to basic GSM SMS. If you have an Android, use the PWA; if you carry a
                basic keypad phone, SMS is enough.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Low-Bandwidth Resilient</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Lightweight payloads load under 1.2 seconds even on congested 2G/3G rural cell towers during peak harvest
                traffic.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Tamper-Proof Scale Sync</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Hardware-level serial telemetry directly captures kilograms from electronic scales to eliminate human
                clerical errors.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white p-6 rounded-2xl border border-stonebg-300 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand-950">Human Escalation Desk</h3>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Every Mandi has a dedicated Kisan Mitra desk equipped with tablets to assist elderly or first-time
                farmers with tokens.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: RealFarmerPillars */}

      {/* BEGIN: CallToAction */}
      <section
        className="py-20 relative bg-brand-950 text-white overflow-hidden"
        data-purpose="final-call-to-action"
      >
        {/* Background Wheat Field Image */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            alt="Wheat field sunset"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida/AEtjO1U5hik24fgbfU_n6fXjpuyTj0x6jefFUjBzFU2RWJMETWr2Rh4Z5RRXFW0abDZYlNQgamlNix_SmUYeHX1gzx4S-mf8uJL9klfaJ28ZjWDD3159aTgSPqBKjjKQX2ZWp-8AmIMXYChkPSZ4b-_D5Aqm2laBhd7f2OkKS0GQq9OURSZxeY4cvpPMGMjrc25GgPZfdR619kU10Zbox8N05hyXfoeYEgAsKbOQPCthz5lS0MgPCmU0bQvI9g"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-950"></div>
        </div>

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

          {/* Portals Dual Action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-harvest hover:bg-harvest-light text-brand-950 font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2"
              href="/farmer"
            >
              <span>किसान सेवा पोर्टल (Farmer Access)</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                ></path>
              </svg>
            </Link>
            <Link
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base transition-all"
              href="/staff/login"
            >
              <span>उपार्जन केंद्र लॉगिन (Staff Console)</span>
            </Link>
          </div>

          {/* Toll Free Call Banner */}
          <div className="pt-6 inline-flex items-center gap-3 text-sm text-stone-300">
            <svg className="w-5 h-5 text-harvest-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span>
              Or simply dial Toll-Free:{' '}
              <strong className="text-white font-mono text-base font-bold">1800-180-1551</strong> (24×7 Hindi Support)
            </span>
          </div>
        </div>
      </section>
      {/* END: CallToAction */}

      {/* BEGIN: InstitutionalFooter */}
      <footer
        className="bg-brand-950 text-stone-300 pt-16 pb-12 border-t border-brand-900 text-xs"
        data-purpose="institutional-footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
            {/* Column 1: Brand & Identity */}
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
                An institutional-grade agricultural queue logistics network connecting APMC mandis, food corporations,
                and farming families across India.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">
                Platform
              </span>
              <ul className="space-y-2">
                <li>
                  <a className="hover:text-white transition-colors" href="#how-it-works">
                    How It Works
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#live-queue">
                    Live Token Monitor
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#mandi-prices">
                    Agmarknet MSP Rates
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#verification">
                    Digital Weigh Proof
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#voice-engine">
                    IVR Architecture
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Farmers & Staff */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">Portals</span>
              <ul className="space-y-2">
                <li>
                  <Link className="hover:text-white transition-colors" href="/farmer">
                    किसान सेवा पोर्टल
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" href="/farmer">
                    Book Arrival Slot
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" href="/farmer/payments">
                    PFMS DBT Tracking
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-white transition-colors" href="/staff/login">
                    Mandi Operator Desk
                  </Link>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#helpdesk">
                    Kisan Mitra Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Standards & Legal */}
            <div className="space-y-3">
              <span className="font-bold text-white uppercase tracking-wider block font-mono text-[11px]">
                Compliance
              </span>
              <ul className="space-y-2">
                <li>
                  <a className="hover:text-white transition-colors" href="#security">
                    Hardware Scale Calibrations
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#privacy">
                    Farmer Data Privacy (DPDP)
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#open-api">
                    e-NAM Interoperability
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#accessibility">
                    W3C &amp; GIGW Accessibility
                  </a>
                </li>
                <li>
                  <a className="hover:text-white transition-colors" href="#audit">
                    Public Audit Ledger
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Compliance Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 text-[11px]">
            <div>
              © 2026 KisanCall Platform. Built for Indian Agricultural Procurement Hubs. Illustrative live-data
              demonstrator.
            </div>
            <div className="flex gap-6">
              <span>Compliant with National Informatics Centre (NIC) standards</span>
              <span>Emergency Support: 1800-180-1551</span>
            </div>
          </div>
        </div>
      </footer>
      {/* END: InstitutionalFooter */}
    </div>
  );
}
