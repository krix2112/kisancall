import { useState, useRef } from "react";
import {
  Search, Mic, Bell, ChevronDown, MapPin, TrendingUp, TrendingDown,
  Download, Eye, Leaf, Lightbulb, Home, FileText, BarChart2, User,
  PhoneCall, Navigation, ChevronRight, Sun, RefreshCw, Filter,
} from "lucide-react";
import farmerImg from "@/imports/image-1.png";

/* ── Image URLs ── */
const MANDI_BG    = "https://images.unsplash.com/photo-1786301326154-3e040dc8db60?w=800&h=320&fit=crop&auto=format";
const WHEAT_IMG   = "https://images.unsplash.com/photo-1561978248-bffcdd0457ad?w=200&h=180&fit=crop&auto=format";
const PADDY_IMG   = "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=200&h=180&fit=crop&auto=format";
const MAIZE_IMG   = "https://images.unsplash.com/photo-1649251037566-6881b4956615?w=200&h=180&fit=crop&auto=format";
const MUSTARD_IMG = "https://images.unsplash.com/photo-1687840466714-c06204b409fc?w=200&h=180&fit=crop&auto=format";
const SOYBEAN_IMG = "https://images.unsplash.com/photo-1572457224112-06d191bb6d01?w=200&h=180&fit=crop&auto=format";
const MAP_IMG     = "https://images.unsplash.com/photo-1642863742974-7e0e40c8c0c9?w=800&h=360&fit=crop&auto=format";

/* ── Data ── */
const crops = [
  { name: "Wheat",   hindi: "गेहूं",    price: 2425, change: +2.1, img: WHEAT_IMG,   color: "#D9A441", bg: "#FFF8EC" },
  { name: "Paddy",   hindi: "धान",      price: 2183, change: -1.3, img: PADDY_IMG,   color: "#52B788", bg: "#EAF5EE" },
  { name: "Maize",   hindi: "मक्का",    price: 1890, change: +0.8, img: MAIZE_IMG,   color: "#F4A261", bg: "#FFF3E8" },
  { name: "Mustard", hindi: "सरसों",    price: 5650, change: +3.2, img: MUSTARD_IMG, color: "#FFD700", bg: "#FFFBE6" },
  { name: "Soybean", hindi: "सोयाबीन",  price: 4320, change: +1.5, img: SOYBEAN_IMG, color: "#8BC34A", bg: "#F1F8E9" },
];

const mandis = [
  { name: "Rampur",        min: 2300, max: 2520, modal: 2450, change: +2.1 },
  { name: "Bareilly",      min: 2280, max: 2500, modal: 2420, change: +1.8 },
  { name: "Moradabad",     min: 2150, max: 2380, modal: 2300, change: +0.9 },
  { name: "Pilibhit",      min: 2320, max: 2560, modal: 2480, change: +2.4 },
  { name: "Shahjahanpur",  min: 2100, max: 2350, modal: 2250, change: -0.6 },
  { name: "Badaun",        min: 2270, max: 2490, modal: 2410, change: +1.2 },
  { name: "Amroha",        min: 2080, max: 2340, modal: 2220, change: -0.4 },
  { name: "Bijnor",        min: 2260, max: 2510, modal: 2430, change: +1.7 },
];

/* 7-day price points for Rampur Wheat */
const trendData = [2180, 2240, 2200, 2320, 2290, 2390, 2450];
const trendLabels = ["7 Sep","8 Sep","9 Sep","10 Sep","11 Sep","12 Sep","13 Sep"];

/* ── Tiny sparkline SVG ── */
function Sparkline({ positive }: { positive: boolean }) {
  const pts = positive
    ? "0,14 8,10 16,12 24,6 32,8 40,2"
    : "0,2  8,6  16,4  24,10 32,8  40,14";
  return (
    <svg width="42" height="16" viewBox="0 0 42 16">
      <polyline points={pts} fill="none" stroke={positive ? "#2D6A4F" : "#e53e3e"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Area chart for price trend ── */
function PriceTrendChart() {
  const [active, setActive] = useState("7D");
  const tabs = ["7D", "1M", "3M", "1Y"];
  const W = 320, H = 120, pad = { t: 12, r: 12, b: 28, l: 42 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const min = 1900, max = 2600;
  const pts = trendData.map((v, i) => ({
    x: pad.l + (i / (trendData.length - 1)) * cW,
    y: pad.t + cH - ((v - min) / (max - min)) * cH,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length-1].x},${H - pad.b} L${pts[0].x},${H - pad.b} Z`;
  const last = pts[pts.length - 1];

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_0_#2D6A4F10] border border-[#E8F0E8] p-4 mx-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-bold text-[#2B2B2B]">Price Trend (Rampur · Wheat)</p>
          <p className="text-[10px] text-[#6B6B6B]">भाव का रुझान (रामपुर - गेहूं)</p>
        </div>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActive(t)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${active === t ? "bg-[#2D6A4F] text-white shadow-md" : "bg-[#F4F8F4] text-[#6B6B6B]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {/* Y-axis gridlines */}
          {[2000, 2200, 2400, 2600].map(v => {
            const y = pad.t + cH - ((v - min) / (max - min)) * cH;
            return (
              <g key={v}>
                <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#E8F0E8" strokeWidth="1" strokeDasharray="4,3" />
                <text x={pad.l - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#9AB4A0">{v.toLocaleString()}</text>
              </g>
            );
          })}
          {/* X-axis labels */}
          {pts.map((p, i) => (
            <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize="7.5" fill="#9AB4A0">
              {trendLabels[i].replace(" Sep","")}
            </text>
          ))}
          {/* Area fill */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Last point dot */}
          <circle cx={last.x} cy={last.y} r="4" fill="#2D6A4F" stroke="#fff" strokeWidth="2" />
          {/* Tooltip bubble */}
          <rect x={last.x - 28} y={last.y - 28} width="56" height="20" rx="6" fill="#2D6A4F" />
          <text x={last.x} y={last.y - 14} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">₹2,450</text>
          <text x={last.x} y={last.y - 5} textAnchor="middle" fontSize="7" fill="#B7E4C7">13 Sep</text>
        </svg>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function MandiPricesMobile({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [activeTab, setActiveTab] = useState("market");
  const cropScrollRef = useRef<HTMLDivElement>(null);

  const bottomTabs = [
    { id: "home",    icon: Home,      label: "Home",          hindi: "होम" },
    { id: "requests",icon: FileText,  label: "Requests",      hindi: "अनुरोध" },
    { id: "call",    icon: PhoneCall, label: "Call",          hindi: "कॉल", center: true },
    { id: "market",  icon: BarChart2, label: "Market",        hindi: "भाव", active: true },
    { id: "profile", icon: User,      label: "Profile",       hindi: "प्रोफाइल" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FDFBF5] max-w-[420px] mx-auto relative" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Top bar ── */}
      <div className="flex-shrink-0 bg-[#FDFBF5] border-b border-[#E8F0E8] px-4 pt-3 pb-2 z-20">
        {/* Row 1: logo + icons */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2D6A4F] flex items-center justify-center" style={{ boxShadow: "0 2px 8px #2D6A4F55" }}>
              <Leaf size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2D6A4F] leading-tight">KisanCall</p>
              <p className="text-[8px] text-[#6B6B6B] leading-tight">Your Farm. Our Support.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Help chip */}
            <button className="flex items-center gap-1 bg-[#EAF5EE] border border-[#C3E8CC] rounded-full px-2.5 py-1">
              <PhoneCall size={10} className="text-[#2D6A4F]" />
              <span className="text-[9px] font-bold text-[#2D6A4F]">1800-XXX-XXXX</span>
            </button>
            <button className="relative w-8 h-8 rounded-full bg-[#F4F8F4] border border-[#E0EDE3] flex items-center justify-center">
              <Bell size={14} className="text-[#2B2B2B]" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white text-[6px] text-white flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-[10px] font-bold" style={{ boxShadow: "0 2px 8px #2D6A4F44" }}>
              RK
            </div>
          </div>
        </div>
        {/* Row 2: search bar with trailing mic */}
        <div className="flex items-center gap-2 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-3.5 py-2">
          <Search size={13} className="text-[#9AB4A0] flex-shrink-0" />
          <input className="flex-1 bg-transparent text-[12px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none min-w-0"
            placeholder="Search crops, mandis..." />
          <button className="flex items-center gap-1 bg-[#EAF5EE] rounded-full px-2 py-0.5 flex-shrink-0">
            <Mic size={11} className="text-[#2D6A4F]" />
            <span className="text-[9px] font-bold text-[#2D6A4F]">AI</span>
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* 1. Hero Banner */}
        <div className="mx-4 mt-4 relative rounded-2xl overflow-hidden h-[150px] shadow-lg">
          <img src={MANDI_BG} alt="Mandi grain market" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/88 via-[#2D6A4F]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

          <div className="relative z-10 h-full flex flex-col justify-center px-4">
            <p className="text-[10px] text-[#B7E4C7] font-medium mb-0.5 tracking-wide">KisanCall · मंडी सेवा</p>
            <h1 className="text-[22px] font-extrabold text-white leading-tight">
              Mandi Prices <span className="text-[#D9A441]">मंडी भाव</span>
            </h1>
            <p className="text-[10px] text-white/75 mt-1 leading-snug max-w-[200px]">
              Real-time prices · ताजा मंडी भाव जानें
            </p>
          </div>

          {/* Bottom-left pill badge */}
          <div className="absolute bottom-3 left-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1">
            <p className="text-[9px] font-bold text-white" style={{ fontFamily: "'Caveat', cursive" }}>
              Jankari se hi hoti hai tarakki!
            </p>
          </div>

          {/* Mandi sign decoration */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2D6A4F] rounded-xl px-3 py-2 border-2 border-[#52B788] shadow-lg">
            <p className="text-[8px] text-[#B7E4C7] text-center font-medium">मंडी</p>
            <p className="text-[14px] font-extrabold text-white text-center">MANDI</p>
          </div>
        </div>

        {/* 2. Filters 2×2 grid */}
        <div className="mx-4 mt-4">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: "🌾", label: "Wheat (गेहूं)",       sub: "फसल चुनें",  color: "#D9A441" },
              { icon: "📍", label: "Uttar Pradesh",       sub: "राज्य चुनें", color: "#2D6A4F" },
              { icon: "🏘️", label: "Rampur",              sub: "जिला चुनें",  color: "#3B82F6" },
              { icon: "🏪", label: "All Mandis (सभी)",    sub: "मंडी चुनें",  color: "#8B5CF6" },
            ].map((f, i) => (
              <button key={i} className="flex items-center justify-between bg-white border border-[#E8F0E8] rounded-2xl px-3.5 py-2.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-left">
                  <p className="text-[9px] text-[#9AB4A0] font-medium">{f.sub}</p>
                  <p className="text-[12px] font-bold text-[#2B2B2B] leading-tight">{f.label}</p>
                </div>
                <ChevronDown size={14} className="text-[#9AB4A0]" />
              </button>
            ))}
          </div>
          <button
            className="w-full mt-3 py-3 rounded-full text-[14px] font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2D6A4F, #40916C)", boxShadow: "0 6px 20px #2D6A4F44" }}
          >
            <Search size={15} />
            Show Prices · भाव दिखाएं
          </button>
        </div>

        {/* 3. Today's Highlights — horizontal scroll carousel */}
        <div className="mt-5">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center">
                <Sun size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#2B2B2B]">Today's Highlights</p>
                <p className="text-[9px] text-[#6B6B6B]">आज के प्रमुख भाव</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="flex items-center gap-1 bg-[#EAF5EE] border border-[#C3E8CC] rounded-full px-2 py-0.5 text-[9px] font-semibold text-[#2D6A4F]">
                <RefreshCw size={8} /> Updated 10:30 AM
              </span>
              <button className="text-[10px] font-semibold text-[#2D6A4F] flex items-center gap-0.5">
                View All <ChevronRight size={10} />
              </button>
            </div>
          </div>

          {/* Snap-scroll carousel */}
          <div
            ref={cropScrollRef}
            className="flex gap-3 overflow-x-auto pl-4 pr-2 pb-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {crops.map((c, i) => (
              <div key={i}
                className="flex-shrink-0 w-[148px] snap-start rounded-2xl overflow-hidden shadow-[0_4px_18px_0_#2D6A4F10] border border-[#E8F0E8] cursor-pointer"
                style={{ background: c.bg }}
              >
                {/* Crop photo */}
                <div className="relative h-[88px]">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2">
                    <p className="text-[13px] font-extrabold text-white leading-tight">{c.name}</p>
                    <p className="text-[9px] text-white/80">{c.hindi}</p>
                  </div>
                </div>
                {/* Price + change */}
                <div className="px-3 py-2.5">
                  <p className="text-[16px] font-extrabold text-[#2B2B2B] leading-tight">
                    ₹{c.price.toLocaleString()}
                    <span className="text-[9px] font-semibold text-[#6B6B6B]">/Qtl</span>
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${c.change >= 0 ? "text-[#2D6A4F]" : "text-red-500"}`}>
                      {c.change >= 0
                        ? <TrendingUp size={10} />
                        : <TrendingDown size={10} />}
                      {c.change >= 0 ? "+" : ""}{c.change}%
                    </span>
                    <Sparkline positive={c.change >= 0} />
                  </div>
                </div>
              </div>
            ))}
            {/* Fade-edge hint */}
            <div className="flex-shrink-0 w-2" />
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2.5">
            {crops.map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === 0 ? "w-4 h-1.5 bg-[#2D6A4F]" : "w-1.5 h-1.5 bg-[#C3E8CC]"}`} />
            ))}
          </div>
        </div>

        {/* 4. Mandi-wise Prices — stacked card list */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[13px] font-bold text-[#2B2B2B]">Mandi-wise Prices (Wheat)</p>
              <p className="text-[9px] text-[#6B6B6B]">मंडी अनुसार भाव (गेहूं)</p>
            </div>
          </div>
          {/* Last updated + download row */}
          <div className="flex items-center justify-between mb-3 bg-[#F4F8F4] border border-[#E0EDE3] rounded-xl px-3 py-2">
            <div className="flex items-center gap-1.5">
              <RefreshCw size={10} className="text-[#6B6B6B]" />
              <p className="text-[10px] text-[#6B6B6B]">Last updated: 13 Sep 2026, 10:30 AM</p>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-[#2D6A4F]">
              <Download size={11} /> Download
            </button>
          </div>

          <div className="space-y-2.5">
            {mandis.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8F0E8] shadow-[0_2px_12px_0_#2D6A4F0A] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#F4F8F4]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
                      <MapPin size={13} className="text-[#2D6A4F]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#2B2B2B]">{m.name}</p>
                      <p className="text-[9px] text-[#6B6B6B]">Uttar Pradesh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${m.change >= 0 ? "text-[#2D6A4F]" : "text-red-500"}`}>
                      {m.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {m.change >= 0 ? "+" : ""}{m.change}%
                    </span>
                    <Sparkline positive={m.change >= 0} />
                  </div>
                </div>
                <div className="grid grid-cols-4 divide-x divide-[#F4F8F4] px-0">
                  {[
                    { label: "Min", sub: "न्यूनतम", val: m.min, color: "#6B6B6B" },
                    { label: "Max", sub: "अधिकतम", val: m.max, color: "#e53e3e" },
                    { label: "Modal", sub: "प्रचलित", val: m.modal, color: "#2D6A4F" },
                  ].map((col, j) => (
                    <div key={j} className="flex-1 text-center py-2.5">
                      <p className="text-[9px] text-[#9AB4A0] font-medium">{col.label}</p>
                      <p className="text-[8px] text-[#9AB4A0]">{col.sub}</p>
                      <p className="text-[13px] font-extrabold mt-0.5" style={{ color: col.color }}>
                        ₹{col.val.toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-center px-2">
                    <button className="bg-[#EAF5EE] border border-[#C3E8CC] text-[#2D6A4F] text-[10px] font-bold rounded-full px-3 py-1.5 flex items-center gap-1">
                      <Eye size={10} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Mandi Locations Map */}
        <div className="mx-4 mt-5 bg-white rounded-3xl shadow-[0_4px_20px_0_#2D6A4F10] border border-[#E8F0E8] overflow-hidden">
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
                <Navigation size={13} className="text-[#2D6A4F]" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#2B2B2B]">Mandi Locations</p>
                <p className="text-[9px] text-[#6B6B6B]">मंडी का नक्शा</p>
              </div>
            </div>
            <button className="flex items-center gap-1 bg-[#EAF5EE] border border-[#C3E8CC] text-[#2D6A4F] text-[10px] font-bold rounded-full px-3 py-1.5">
              View Full Map <ChevronRight size={10} />
            </button>
          </div>

          {/* Map preview */}
          <div className="relative mx-4 rounded-2xl overflow-hidden h-[180px] mb-3">
            <img src={MAP_IMG} alt="Mandi locations map" className="w-full h-full object-cover" style={{ filter: "saturate(1.2) brightness(0.9)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D6A4F]/30 to-transparent" />

            {/* Selected mandi callout */}
            <div className="absolute top-3 right-3 bg-white rounded-xl px-3 py-2 shadow-lg border border-[#E8F0E8]">
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-[#2D6A4F]" fill="#2D6A4F" />
                <p className="text-[10px] font-bold text-[#2D6A4F]">Rampur Mandi</p>
              </div>
              <p className="text-[12px] font-extrabold text-[#2B2B2B]">₹2,450 /Qtl</p>
            </div>

            {/* Pins */}
            {[
              { label: "Rampur", x: "42%", y: "48%" },
              { label: "Bareilly", x: "62%", y: "36%" },
              { label: "Moradabad", x: "72%", y: "26%" },
            ].map((p, i) => (
              <div key={i} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%,-100%)" }}>
                <MapPin size={i === 0 ? 20 : 15} className={i === 0 ? "text-[#2D6A4F]" : "text-red-500"} fill={i === 0 ? "#2D6A4F" : "#ef4444"} />
              </div>
            ))}

            {/* Zoom controls */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1">
              <button className="w-6 h-6 bg-white rounded shadow text-sm flex items-center justify-center font-bold text-[#2B2B2B]">+</button>
              <button className="w-6 h-6 bg-white rounded shadow text-sm flex items-center justify-center font-bold text-[#2B2B2B]">−</button>
            </div>
          </div>

          {/* Legend chips */}
          <div className="flex gap-2 px-4 pb-4 flex-wrap">
            {[
              { label: "All Mandis · सभी मंडियां", color: "#2D6A4F" },
              { label: "Selected · चुनी गई", color: "#D9A441" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-2.5 py-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span className="text-[9px] font-semibold text-[#6B6B6B]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Price Trend Chart */}
        <div className="mt-4">
          <PriceTrendChart />
        </div>

        {/* 7. Market Insight + Farming Tip stacked */}
        <div className="mx-4 mt-4 space-y-3">
          {/* Market Insight */}
          <div className="bg-[#EAF5EE] border border-[#C3E8CC] rounded-3xl p-4 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] flex items-center justify-center flex-shrink-0 shadow-md">
              <TrendingUp size={18} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-bold text-[#2D6A4F]">Market Insight</p>
                <p className="text-[9px] text-[#52B788] font-semibold">वाजार संकेत</p>
              </div>
              <p className="text-[11px] text-[#2B2B2B] leading-relaxed">
                Wheat prices in Uttar Pradesh have increased by 2.1% this week due to higher demand.
              </p>
              <p className="text-[10px] text-[#52B788] mt-1 leading-snug">
                उत्तर प्रदेश में गेहूं के भाव में इस सप्ताह 2.1% की वृद्धि हुई है।
              </p>
              <button className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-white border border-[#C3E8CC] rounded-full px-3 py-1.5">
                View Detailed Analysis <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* Farming Tip */}
          <div className="bg-[#FFF8EC] border border-[#F0D080] rounded-3xl p-4 flex gap-3 items-start shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#D9A441] flex items-center justify-center flex-shrink-0 shadow-md">
              <Lightbulb size={18} color="#fff" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-bold text-[#B7860B]">Farming Tip</p>
                <p className="text-[9px] text-[#D9A441] font-semibold">किसान सुझाव</p>
              </div>
              <p className="text-[11px] text-[#2B2B2B] leading-relaxed">
                Compare prices at nearby mandis before selling to get the best rate for your crop.
              </p>
              <p className="text-[10px] text-[#B7860B] mt-1 leading-snug">
                अच्छे दाम के लिए नजदीकी मंडियों के भाव की तुलना जरूर करें।
              </p>
              <button className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#B7860B] bg-white border border-[#F0D080] rounded-full px-3 py-1.5">
                More Tips <ChevronRight size={11} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* ── Fixed Bottom Nav ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30">
        <div className="bg-white border-t border-[#E8F0E8] shadow-[0_-4px_24px_0_#2D6A4F14] flex items-end justify-around px-2 pb-2 pt-1">
          {bottomTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "home" && onNavigate) onNavigate("dashboard");
                else setActiveTab(tab.id);
              }}
              className={`flex flex-col items-center gap-0.5 min-w-0 transition-all ${
                tab.center ? "relative -top-4" : ""
              }`}
            >
              {tab.center ? (
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_#2D6A4F55]"
                  style={{ background: "linear-gradient(135deg, #2D6A4F, #40916C)" }}>
                  <tab.icon size={22} color="#fff" strokeWidth={2} />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all ${
                  tab.id === activeTab ? "bg-[#EAF5EE]" : ""
                }`}>
                  <tab.icon size={18}
                    className={tab.id === activeTab ? "text-[#2D6A4F]" : "text-[#9AB4A0]"}
                    strokeWidth={tab.id === activeTab ? 2.5 : 1.8}
                  />
                </div>
              )}
              {!tab.center && (
                <span className={`text-[8px] font-semibold leading-tight ${tab.id === activeTab ? "text-[#2D6A4F]" : "text-[#9AB4A0]"}`}>
                  {tab.hindi}
                </span>
              )}
              {tab.center && (
                <span className="text-[8px] font-semibold text-[#6B6B6B] mt-0.5">कॉल</span>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
