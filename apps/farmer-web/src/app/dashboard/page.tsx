'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { farmerApi } from '@/services/api';
import { FarmerStatusResponse } from '@kisancall/shared-types';
import {
  FileText, CreditCard, Phone, MapPin, Search, ChevronDown, Bell,
  ChevronRight, Wheat, History, Settings, TrendingUp, CheckCircle2,
  Circle, Navigation, Sprout, Zap, Shield, Banknote
} from "lucide-react";

const WHEAT_IMG = "https://images.unsplash.com/photo-1561978248-bffcdd0457ad?w=300&h=200&fit=crop&auto=format";
const RUPEE_IMG = "https://images.unsplash.com/photo-1565373679107-344d38dbf734?w=300&h=200&fit=crop&auto=format";
const MAP_BG = "https://images.unsplash.com/photo-1767880408267-e9f64de1fe7a?w=600&h=260&fit=crop&auto=format";

const steps = ["Registered", "At Mandi", "Verification", "Payment"];
const activeStep = 1;

const services = [
  { id: "/dashboard/mandi-prices", icon: TrendingUp, label: "Mandi Price", sub: "MSP & Rates", color: "bg-green-50", iconColor: "text-green-600", glow: "#22c55e" },
  { id: "/dashboard/payment", icon: CreditCard, label: "Payment Status", sub: "PFMS Status", color: "bg-blue-50", iconColor: "text-blue-600", glow: "#3b82f6" },
  { id: "/dashboard/records", icon: FileText, label: "Procurement", sub: "J-Form Slip", color: "bg-purple-50", iconColor: "text-purple-600", glow: "#a855f7" },
  { id: "/dashboard/calls", icon: History, label: "Call History", sub: "Voice Logs", color: "bg-pink-50", iconColor: "text-pink-600", glow: "#ec4899" },
  { id: "/dashboard/profile", icon: Settings, label: "KYC & Settings", sub: "Manage Profile", color: "bg-gray-50", iconColor: "text-gray-600", glow: "#6b7280" },
];

function ProgressRing({ value, max }: { value: number; max: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const pct = value / max;
  const dash = circ * pct;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="relative">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#EAF5EE" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 8px #2D6A4F88)" }}
      />
      <text x="60" y="52" textAnchor="middle" fontSize="28" fontWeight="800" fill="#2D6A4F" fontFamily="Poppins">{value}</text>
      <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#6B6B6B" fontFamily="Nunito">Your Turn</text>
    </svg>
  );
}

function LiveBadge() {
  return (
    <span className="badge-live flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
      <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
      Live
    </span>
  );
}

function PendingBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
      Pending
    </span>
  );
}

export default function DashboardPage() {
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [status, setStatus] = useState<FarmerStatusResponse | null>(null);
  const [queue, setQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current Supabase session to determine farmer ID
        const { data: sessionData } = await supabase.auth.getSession();
        const farmerId = sessionData.session?.user?.id || process.env.NEXT_PUBLIC_TEST_FARMER_ID || '00000000-0000-0000-0000-000000000001';

        // Fetch dashboard data from backend
        const [statusRes, queueRes] = await Promise.all([
          farmerApi.getStatus(farmerId).catch((err) => {
            console.error('Status fetch error:', err);
            return null;
          }),
          farmerApi.getQueuePosition(farmerId).catch((err) => {
            console.error('Queue fetch error:', err);
            return null;
          })
        ]);

        if (statusRes) setStatus(statusRes);
        if (queueRes) setQueue(queueRes);

        if (!statusRes && !queueRes) {
          setError('Unable to fetch data. Please check your connection.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-[#2D6A4F]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden h-[200px] shadow-xl">
        <img
          src="/imports/image-1.png"
          alt="Farmer giving thumbs up in green field"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "blur(2px) brightness(0.88) saturate(1.05)", transform: "scale(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF5]/82 via-[#EAF5EE]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <div>
            <p className="text-[13px] text-[#5a7a68] font-medium tracking-wide">Good Morning,</p>
            <h1 className="text-[34px] font-extrabold text-[#1a3a2a] leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {status?.farmer?.name || "Ramesh Kumar"}
            </h1>
            <p className="text-[17px] font-semibold text-[#2D6A4F] mt-0.5" style={{ fontFamily: "'Caveat', cursive" }}>
              Mehnat aapki, saath hamaara!
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin size={13} className="text-[#2D6A4F]" />
              <span className="text-[12px] text-[#5a7a68] font-medium">{status?.farmer?.mandi?.district || "Rampur, Uttar Pradesh"}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl px-5 py-3.5 border border-[#c3e8cc] shadow-xl mr-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Sprout size={14} className="text-[#2D6A4F]" />
              <span className="text-[10px] text-[#6B6B6B] font-medium">Here&apos;s your slot &amp; live queue status.</span>
            </div>
            <p className="text-[18px] font-bold text-[#2D6A4F] leading-snug" style={{ fontFamily: "'Caveat', cursive" }}>
              "Sahi jaankari,<br />behtar fasal"
            </p>
          </div>
        </div>
      </div>

      {/* ── Cards Row 1 ── */}
      <div className="grid grid-cols-2 gap-5">
        {/* Queue Status */}
        <div className="card-hover bg-white rounded-3xl p-5 shadow-[0_4px_24px_0_#2D6A4F12] border border-[#E8F0E8]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#2B2B2B]">Your Queue Status</span>
              <LiveBadge />
            </div>
            <button className="text-[11px] font-semibold text-[#2D6A4F] flex items-center gap-1 hover:underline">
              View Details <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <ProgressRing value={queue?.position || 12} max={20} />
            <div>
              <p className="text-[11px] text-[#6B6B6B] mb-0.5">Estimated Time</p>
              <p className="text-[22px] font-extrabold text-[#2B2B2B] leading-tight">~{queue?.estimated_wait_minutes || 45} minutes</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Wheat size={13} className="text-[#D9A441]" />
                <p className="text-[12px] font-semibold text-[#2B2B2B]">{queue?.mandi_name || status?.farmer?.mandi?.name || "Rampur Mandi"}</p>
              </div>
              <p className="text-[11px] text-[#6B6B6B]">{status?.farmer?.crop || "Wheat"} | 2 Apr 2026</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-4 flex items-center gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {i < steps.length - 1 && (
                  <div className={`absolute top-[14px] left-1/2 w-full h-[3px] ${i < activeStep ? "bg-[#2D6A4F]" : "bg-[#E8F0E8]"}`} />
                )}
                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center ${
                  i < activeStep ? "bg-[#2D6A4F] shadow-[0_0_10px_#2D6A4F66]"
                  : i === activeStep ? "bg-[#2D6A4F] ring-4 ring-[#EAF5EE] shadow-[0_0_14px_#2D6A4F88]"
                  : "bg-[#E8F0E8]"
                }`}>
                  {i <= activeStep
                    ? <CheckCircle2 size={14} color="#fff" strokeWidth={3} />
                    : <Circle size={14} color="#9AB4A0" strokeWidth={2} />}
                </div>
                <p className={`text-[9px] mt-1.5 font-semibold text-center ${i <= activeStep ? "text-[#2D6A4F]" : "text-[#9AB4A0]"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mandi Map */}
        <div className="card-hover bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_0_#2D6A4F12] border border-[#E8F0E8]">
          <div className="flex items-center justify-between p-5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#2B2B2B]">Mandi Map & Queue</span>
              <span className="badge-live flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                <Navigation size={10} /> Live Location
              </span>
            </div>
            <button className="btn-glow text-[11px] font-bold text-white bg-[#2D6A4F] rounded-full px-3.5 py-1.5 flex items-center gap-1">
              View Full Map <Navigation size={11} />
            </button>
          </div>
          <div className="px-5 pb-2">
            <p className="text-[13px] font-bold text-[#2B2B2B]">{status?.farmer?.mandi?.name || "Rampur Mandi"}</p>
            <p className="text-[11px] text-[#6B6B6B]">District: {status?.farmer?.mandi?.district || "Rampur"}, Uttar Pradesh</p>
          </div>
          <div className="relative mx-5 mb-4 rounded-2xl overflow-hidden h-[150px]">
            <img src={MAP_BG} alt="Farm area map preview" className="w-full h-full object-cover" style={{ filter: "saturate(1.3) brightness(0.92)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D6A4F]/30 to-transparent" />
            {[
              { label: "Your Mandi\nRampur", x: "42%", y: "40%", main: true },
              { label: "Moradabad\n~42 km", x: "72%", y: "28%", main: false },
              { label: "Sambhal\n~42 km", x: "20%", y: "62%", main: false },
            ].map((pin, i) => (
              <div key={i} className={`absolute flex flex-col items-center group cursor-pointer`} style={{ left: pin.x, top: pin.y, transform: "translate(-50%,-100%)" }}>
                <div className={`text-[8px] font-bold text-center bg-white rounded-lg px-2 py-1 mb-1 shadow-md leading-tight whitespace-pre border ${pin.main ? "text-[#2D6A4F] border-[#2D6A4F]" : "text-[#6B6B6B] border-transparent"} group-hover:scale-110 transition-transform`}>
                  {pin.label}
                </div>
                <MapPin size={pin.main ? 18 : 14} className={pin.main ? "text-[#2D6A4F]" : "text-red-500"} fill={pin.main ? "#2D6A4F" : "#ef4444"} />
              </div>
            ))}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1">
              <button className="w-6 h-6 bg-white rounded shadow text-[#2B2B2B] text-sm flex items-center justify-center font-bold hover:bg-[#EAF5EE]">+</button>
              <button className="w-6 h-6 bg-white rounded shadow text-[#2B2B2B] text-sm flex items-center justify-center font-bold hover:bg-[#EAF5EE]">−</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cards Row 2 ── */}
      <div className="grid grid-cols-2 gap-5">
        {/* Procurement Details */}
        <div className="card-hover bg-white rounded-3xl shadow-[0_4px_24px_0_#2D6A4F12] border border-[#E8F0E8] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[28%] pointer-events-none">
            <img
              src={WHEAT_IMG}
              alt="Golden wheat stalks"
              className="h-full w-full object-cover object-center"
              style={{ opacity: 0.75 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #ffffff 0%, #ffffffcc 30%, #ffffff88 60%, transparent 100%)" }} />
          </div>
          <div className="relative z-10 p-5 pr-[32%]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat size={18} className="text-[#D9A441]" />
                <span className="text-[15px] font-bold text-[#2B2B2B]">Procurement Details</span>
              </div>
              <PendingBadge />
            </div>
            <div className="space-y-3">
              {[
                { label: "Quantity", value: "48 Qtl" },
                { label: "Price", value: "₹2,275 / Qtl", highlight: true },
                { label: "Quality", value: "FAQ Grade A" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] text-[#6B6B6B] flex-shrink-0">{row.label}:</span>
                  <span className={`text-[13px] font-bold text-right ${row.highlight ? "text-[#2D6A4F]" : "text-[#2B2B2B]"}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="card-hover bg-white rounded-3xl shadow-[0_4px_24px_0_#2D6A4F12] border border-[#E8F0E8] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[28%] pointer-events-none">
            <img
              src={RUPEE_IMG}
              alt="Rupee coins"
              className="h-full w-full object-cover object-center"
              style={{ opacity: 0.5 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #ffffff 0%, #ffffffcc 30%, #ffffff88 60%, transparent 100%)" }} />
          </div>
          <div className="relative z-10 p-5 pr-[32%]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Banknote size={18} className="text-[#D9A441]" />
                <span className="text-[15px] font-bold text-[#2B2B2B]">Payment Status</span>
              </div>
              <PendingBadge />
            </div>
            <div className="space-y-3">
              {[
                { label: "Amount", value: "₹1,09,200" },
                { label: "Reference", value: "PFMS-2026-04892" },
                { label: "Updated", value: "2 Apr 2026, 3:45 PM" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] text-[#6B6B6B] flex-shrink-0">{row.label}:</span>
                  <span className="text-[13px] font-bold text-[#2B2B2B] text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <Zap size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-amber-800 leading-snug">Payment will be processed after verification. Typically within 24–48 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kisan Digital Services ── */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_0_#2D6A4F12] border border-[#E8F0E8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#2D6A4F]" />
            <h2 className="text-[15px] font-bold text-[#2B2B2B]">Kisan Digital Services</h2>
          </div>
          <span className="text-[11px] font-semibold text-[#6B6B6B]">5 Services Active</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {services.map((svc, i) => (
            <Link
              href={svc.id}
              key={i}
              className="service-tile relative rounded-2xl p-3 cursor-pointer flex flex-col gap-2"
              style={{
                background: hoveredService === i
                  ? `linear-gradient(135deg, ${svc.glow}18, ${svc.glow}0a)`
                  : "#F9FAFB",
                border: hoveredService === i ? `1.5px solid ${svc.glow}44` : "1.5px solid #F0F0F0",
                boxShadow: hoveredService === i ? `0 8px 28px 0 ${svc.glow}33` : undefined,
              }}
              onMouseEnter={() => setHoveredService(i)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${svc.color}`}>
                <svc.icon size={20} className={svc.iconColor} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#2B2B2B] leading-tight">{svc.label}</p>
                <p className="text-[10px] text-[#6B6B6B] mt-0.5">{svc.sub}</p>
              </div>
              <ChevronRight size={13} className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity ${hoveredService === i ? "opacity-100 text-[#2D6A4F]" : "opacity-40 text-[#6B6B6B]"}`} />
              {hoveredService === i && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2D6A4F] text-white text-[10px] font-bold rounded-lg px-2.5 py-1.5 whitespace-nowrap z-20 shadow-xl"
                  style={{ boxShadow: `0 4px 16px ${svc.glow}55` }}>
                  Open {svc.label}
                  <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#2D6A4F]" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Call Us Banner ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-[#E8F5EE] border border-[#C3E8CC]" style={{ minHeight: "120px" }}>
        <img
          src="/imports/image-4.png"
          alt="Farmer on phone call getting assistance"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8F5EE] via-[#E8F5EE]/85 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center h-full px-8 py-6 gap-5">
          <div className="w-14 h-14 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-[0_4px_20px_#2D6A4F55] flex-shrink-0 float-anim">
            <Phone size={24} color="#fff" strokeWidth={2} />
          </div>
          <div className="flex-shrink-0">
            <p className="text-[12px] text-[#6B6B6B] font-medium mb-0.5">Need Help?</p>
            <h3 className="text-[28px] font-extrabold text-[#2B2B2B] leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Call Us
            </h3>
            <p className="text-[13px] text-[#6B6B6B] mt-1 leading-snug">
              Get instant assistance in your language
            </p>
          </div>
          <button className="btn-glow ml-4 w-11 h-11 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-[0_4px_18px_#2D6A4F55] flex-shrink-0">
            <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="h-2" />
    </>
  );
}
