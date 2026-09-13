'use client';

import { useState } from "react";
import {
  MapPin, Bell, ChevronDown, ChevronRight, Mic,
  Search, Leaf, TrendingUp, TrendingDown, Download,
  Lightbulb, Navigation, RefreshCw, Sun, Globe,
} from "lucide-react";

/* ── Images ── */
const WHEAT_IMG   = "https://images.unsplash.com/photo-1561978248-bffcdd0457ad?w=280&h=180&fit=crop&auto=format";
const PADDY_IMG   = "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=280&h=180&fit=crop&auto=format";
const MAIZE_IMG   = "https://images.unsplash.com/photo-1649251037566-6881b4956615?w=280&h=180&fit=crop&auto=format";
const MUSTARD_IMG = "https://images.unsplash.com/photo-1687840466714-c06204b409fc?w=280&h=180&fit=crop&auto=format";
const SOYBEAN_IMG = "https://images.unsplash.com/photo-1572457224112-06d191bb6d01?w=280&h=180&fit=crop&auto=format";
const MAP_IMG     = "https://images.unsplash.com/photo-1642863742974-7e0e40c8c0c9?w=800&h=400&fit=crop&auto=format";

/* ── Data ── */
const crops = [
  { name: "Wheat",   hindi: "गेहूं",   price: 2425, change: +2.1, img: WHEAT_IMG,   pos: true  },
  { name: "Paddy",   hindi: "धान",     price: 2183, change: -1.3, img: PADDY_IMG,   pos: false },
  { name: "Maize",   hindi: "मक्का",   price: 1890, change: +0.8, img: MAIZE_IMG,   pos: true  },
  { name: "Mustard", hindi: "सरसों",   price: 5650, change: +3.2, img: MUSTARD_IMG, pos: true  },
  { name: "Soybean", hindi: "सोयाबीन", price: 4320, change: +1.5, img: SOYBEAN_IMG, pos: true  },
];

const mandis = [
  { name: "Rampur",       dist: "2 km",  min: 2300, max: 2520, modal: 2450, change: +2.1, top: true,  bars: [60,55,70,65,80,88,95] },
  { name: "Bareilly",     dist: "18 km", min: 2280, max: 2500, modal: 2420, change: +1.8, top: false, bars: [50,60,55,72,68,80,85] },
  { name: "Moradabad",    dist: "42 km", min: 2150, max: 2380, modal: 2300, change: +0.9, top: false, bars: [70,65,60,68,62,72,78] },
  { name: "Pilibhit",     dist: "56 km", min: 2320, max: 2560, modal: 2480, change: +2.4, top: true,  bars: [55,65,70,60,78,90,100] },
  { name: "Shahjahanpur", dist: "78 km", min: 2100, max: 2350, modal: 2250, change: -0.6, top: false, bars: [80,75,70,72,68,65,62] },
  { name: "Badaun",       dist: "90 km", min: 2270, max: 2490, modal: 2410, change: +1.2, top: false, bars: [60,58,65,70,68,75,80] },
  { name: "Amroha",       dist: "35 km", min: 2080, max: 2340, modal: 2220, change: -0.4, top: false, bars: [75,70,65,68,60,58,55] },
  { name: "Bijnor",       dist: "60 km", min: 2260, max: 2510, modal: 2430, change: +1.7, top: false, bars: [55,60,58,65,72,80,85] },
];

const trendData = [2180, 2240, 2200, 2320, 2290, 2390, 2450];
const trendLabels = ["7 Sep","8 Sep","9 Sep","10 Sep","11 Sep","12 Sep","13 Sep"];


/* ── Line sparkline ── */
function Sparkline({ pos }: { pos: boolean }) {
  const pts = pos ? "0,12 8,8 16,10 24,4 32,6 40,1" : "0,1 8,5 16,3 24,9 32,7 40,12";
  return (
    <svg width="44" height="14" viewBox="0 0 44 14">
      <polyline points={pts} fill="none" stroke={pos ? "#2D6A4F" : "#e53e3e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Bar sparkline (7-day) ── */
function BarSparkline({ bars, pos }: { bars: number[]; pos: boolean }) {
  const max = Math.max(...bars);
  const H = 28, W = 56, gap = 2;
  const bw = (W - gap * (bars.length - 1)) / bars.length;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {bars.map((v, i) => {
        const h = Math.max(4, (v / max) * (H - 2));
        const x = i * (bw + gap);
        const isUp = i === 0 ? pos : v >= bars[i - 1];
        return (
          <rect key={i} x={x} y={H - h} width={bw} height={h} rx="1.5"
            fill={isUp ? "#2D6A4F" : "#e53e3e"}
            opacity={i === bars.length - 1 ? 1 : 0.55 + (i / bars.length) * 0.35}
          />
        );
      })}
    </svg>
  );
}

/* ── Price trend chart ── */
function PriceTrendChart() {
  const [tab, setTab] = useState("7D");
  const W = 340, H = 140, pl = 44, pr = 16, pt = 14, pb = 28;
  const cW = W - pl - pr, cH = H - pt - pb;
  const mn = 1700, mx = 2800;
  const pts = trendData.map((v, i) => ({
    x: pl + (i / (trendData.length - 1)) * cW,
    y: pt + cH - ((v - mn) / (mx - mn)) * cH,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = line + ` L${pts[pts.length-1].x},${H-pb} L${pts[0].x},${H-pb} Z`;
  const last = pts[pts.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] shadow-[0_4px_20px_0_#2D6A4F0D] p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-bold text-[#2B2B2B]">Price Trend (Rampur · Wheat)</p>
          <p className="text-[10px] text-[#6B6B6B]">भाव का रुझान (रामपुर - गेहूं)</p>
        </div>
        <div className="flex gap-1 bg-[#F4F8F4] rounded-full p-0.5">
          {["7D","1M","3M","1Y"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${tab === t ? "bg-[#2D6A4F] text-white shadow" : "text-[#6B6B6B]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {[1800,2000,2200,2400,2600].map(v => {
          const y = pt + cH - ((v - mn) / (mx - mn)) * cH;
          return (
            <g key={v}>
              <line x1={pl} y1={y} x2={W-pr} y2={y} stroke="#E8F0E8" strokeWidth="1" strokeDasharray="4,3" />
              <text x={pl-4} y={y+3.5} textAnchor="end" fontSize="8" fill="#9AB4A0">{v.toLocaleString()}</text>
            </g>
          );
        })}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H-6} textAnchor="middle" fontSize="7.5" fill="#9AB4A0">
            {trendLabels[i].split(" ")[0]}
          </text>
        ))}
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tg)" />
        <path d={line} fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="4" fill="#2D6A4F" stroke="#fff" strokeWidth="2" />
        {/* tooltip */}
        <rect x={last.x - 28} y={last.y - 30} width="58" height="22" rx="6" fill="#2D6A4F" />
        <text x={last.x + 1} y={last.y - 16} textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="700">₹2,450</text>
        <text x={last.x + 1} y={last.y - 6} textAnchor="middle" fontSize="7.5" fill="#B7E4C7">13 Sep</text>
      </svg>
    </div>
  );
}

export default function MandiPricesContent() {
  return (
    <>

          {/* ── Hero Banner ── */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl flex" style={{ height: "220px", background: "#f4f9f5" }}>

            {/* Photo: farmer from behind in green field, fills right ~65% */}
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=500&fit=crop&auto=format&crop=right"
              alt="Farmer standing in green field at sunrise"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "60% center" }}
            />

            {/* Solid cream panel on the left, fading into photo */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to right, #f4f9f5 0%, #f4f9f5 30%, rgba(244,249,245,0.90) 40%, rgba(244,249,245,0.45) 55%, transparent 72%)"
            }} />

            {/* Leaf accent — bottom-left */}
            <div className="absolute bottom-3 left-3 pointer-events-none select-none" style={{ opacity: 0.55 }}>
              <svg viewBox="0 0 52 64" style={{ width: 48, height: 58 }} fill="none">
                <path d="M26,4 Q44,14 40,36 Q36,54 18,58 Q4,46 10,26 Q16,8 26,4Z" fill="#74C69D" opacity="0.7"/>
                <path d="M26,4 L20,52" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <div className="absolute bottom-8 left-10 pointer-events-none select-none" style={{ opacity: 0.35 }}>
              <svg viewBox="0 0 34 42" style={{ width: 30, height: 36 }} fill="none">
                <path d="M17,3 Q28,9 26,24 Q24,36 12,38 Q3,30 7,17 Q11,5 17,3Z" fill="#74C69D"/>
                <path d="M17,3 L13,35" stroke="#2D6A4F" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>

            {/* Leaf accents — top-right */}
            <div className="absolute top-4 right-6 pointer-events-none select-none" style={{ opacity: 0.75 }}>
              <svg viewBox="0 0 38 46" style={{ width: 34, height: 42 }} fill="none">
                <path d="M19,3 Q32,10 29,26 Q26,40 12,42 Q2,32 7,18 Q12,4 19,3Z" fill="#52B788"/>
                <path d="M19,3 L14,38" stroke="#2D6A4F" strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div className="absolute top-10 right-14 pointer-events-none select-none" style={{ opacity: 0.5 }}>
              <svg viewBox="0 0 28 34" style={{ width: 24, height: 30 }} fill="none">
                <path d="M14,2 Q24,8 22,20 Q20,30 9,31 Q2,23 5,13 Q9,3 14,2Z" fill="#74C69D"/>
              </svg>
            </div>

            {/* Left text zone */}
            <div className="absolute left-7 top-0 bottom-0 flex flex-col justify-center" style={{ maxWidth: "360px" }}>
              {/* Location pill */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center gap-1.5 bg-white/95 border border-[#D8EDD8] rounded-full px-3 py-1.5 shadow-sm">
                  <MapPin size={11} className="text-[#2D6A4F]" />
                  <span className="text-[11px] font-semibold text-[#2D6A4F]">Uttar Pradesh</span>
                  <ChevronDown size={11} className="text-[#6B6B6B]" />
                </div>
              </div>

              {/* Main heading — huge, two lines */}
              <h1 className="font-extrabold text-[#1B4332] leading-[1.0]" style={{ fontSize: "54px", fontFamily: "'Poppins', sans-serif" }}>
                Mandi<br />Prices
              </h1>

              {/* Subtitle */}
              <p className="text-[13px] text-[#4a6a54] mt-3 leading-relaxed font-medium">
                Apni fasal ka sahi daam jaaniye,<br />behtar faisla lijiye.
              </p>
            </div>

            {/* Right: Caveat tagline over photo */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right">
              <p
                className="font-bold text-[#1B4332] leading-tight"
                style={{ fontFamily: "'Caveat', cursive", fontSize: "30px", textShadow: "0 1px 12px rgba(255,255,255,0.85)" }}
              >
                Sahi daam,<br />better kal!
              </p>
              {/* Mustard swoosh underline */}
              <svg viewBox="0 0 140 14" className="mt-1 ml-auto" style={{ width: 130, height: 12 }}>
                <path d="M4,9 Q35,2 70,8 Q105,14 136,5" stroke="#D9A441" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* ── Filter row ── */}
          <div className="flex items-end gap-3">
            {[
              { sub: "Select Crop · फसल चुनें",       val: "Wheat (गेहूं)" },
              { sub: "Select State · राज्य चुनें",     val: "Uttar Pradesh" },
              { sub: "Select District · जिला चुनें",   val: "Rampur" },
              { sub: "Select Mandi · मंडी चुनें",      val: "All Mandis (सभी मंडियां)" },
            ].map((f, i) => (
              <div key={i} className="flex-1">
                <p className="text-[9px] text-[#9AB4A0] font-semibold mb-1">{f.sub}</p>
                <button className="w-full flex items-center justify-between bg-white border border-[#E0EDE3] rounded-xl px-3 py-2.5 shadow-sm hover:border-[#2D6A4F] hover:shadow-md transition-all">
                  <span className="text-[12px] font-semibold text-[#2B2B2B] truncate">{f.val}</span>
                  <ChevronDown size={14} className="text-[#9AB4A0] flex-shrink-0 ml-1" />
                </button>
              </div>
            ))}
            <button className="flex items-center gap-2 text-[13px] font-bold text-white rounded-xl px-5 py-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#2D6A4F,#40916C)", boxShadow: "0 4px 16px #2D6A4F44" }}>
              <Search size={14} />
              <span>Show Prices<br /><span className="text-[10px] font-semibold opacity-80">भाव दिखाएं</span></span>
            </button>
          </div>

          {/* ── Today's Highlights ── */}
          <div className="bg-white rounded-2xl border border-[#E8F0E8] shadow-[0_4px_20px_0_#2D6A4F0A] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Sun size={16} className="text-amber-500" />
                </div>
                <div>
                  <span className="text-[14px] font-bold text-[#2B2B2B]">Today's Highlights</span>
                  <span className="text-[11px] text-[#6B6B6B] ml-2">आज के प्रमुख भाव</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-[#EAF5EE] border border-[#C3E8CC] rounded-full px-3 py-1 text-[10px] font-semibold text-[#2D6A4F]">
                  <RefreshCw size={10} /> Prices updated 10:30 AM
                </span>
                <button className="text-[11px] font-semibold text-[#2D6A4F] flex items-center gap-1 hover:underline">
                  View All Crops <ChevronRight size={12} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {crops.map((c, i) => (
                <div key={i} className="card-hover rounded-2xl overflow-hidden border border-[#E8F0E8] cursor-pointer shadow-sm">
                  <div className="relative h-[100px]">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-[13px] font-extrabold text-white leading-tight">{c.name}</p>
                      <p className="text-[9px] text-white/80">{c.hindi}</p>
                    </div>
                  </div>
                  <div className="px-3 pt-2.5 pb-3 bg-white">
                    <p className="text-[15px] font-extrabold text-[#2B2B2B]">
                      ₹ {c.price.toLocaleString()}
                      <span className="text-[10px] font-semibold text-[#6B6B6B]"> /Qtl</span>
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`flex items-center gap-0.5 text-[11px] font-bold ${c.pos ? "text-[#2D6A4F]" : "text-red-500"}`}>
                        {c.pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {c.pos ? "+" : ""}{c.change}%
                      </span>
                      <Sparkline pos={c.pos} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom two-column section ── */}
          <div className="grid grid-cols-[1fr_380px] gap-4">

            {/* Left: Mandi-wise Prices table */}
            <div className="bg-white rounded-2xl border border-[#E8F0E8] shadow-[0_4px_24px_0_#2D6A4F10] overflow-hidden flex flex-col">

              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F5F0] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
                    <Leaf size={16} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#2B2B2B]">Wheat Prices in Uttar Pradesh</p>
                    <p className="text-[10px] text-[#6B6B6B]">मंडी अनुसार भाव (गेहूं) · Mandi-wise</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse flex-shrink-0" />
                    <span className="text-[10px] text-[#6B6B6B] whitespace-nowrap">Updated 13 Sep 2026, 10:30 AM</span>
                    <button className="text-[#9AB4A0] hover:text-[#2D6A4F] transition-colors">
                      <RefreshCw size={12} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 bg-[#EAF5EE] border border-[#C3E8CC] text-[#2D6A4F] text-[11px] font-bold rounded-full px-3.5 py-1.5 whitespace-nowrap hover:shadow-md transition-shadow">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>

              {/* Scrollable table wrapper — prevents content bleed */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: "680px" }}>
                  <thead>
                    <tr className="bg-[#F7FBF7] border-b border-[#EEF4EE]">
                      {[
                        { en: "Mandi",       hi: "मंडी",            w: "180px" },
                        { en: "Min Price",   hi: "न्यूनतम (₹/Qtl)", w: "96px"  },
                        { en: "Max Price",   hi: "अधिकतम (₹/Qtl)",  w: "96px"  },
                        { en: "Modal Price", hi: "प्रचलित भाव",      w: "116px" },
                        { en: "Change",      hi: "परिवर्तन",         w: "84px"  },
                        { en: "Trend",       hi: "रुझान",            w: "60px"  },
                        { en: "Last 7 Days", hi: "7 दिन",            w: "72px"  },
                        { en: "",            hi: "",                  w: "120px" },
                      ].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 font-semibold whitespace-nowrap" style={{ width: h.w, minWidth: h.w }}>
                          <p className="text-[11px] text-[#4a6a54]">{h.en}</p>
                          <p className="text-[8.5px] text-[#9AB4A0] font-normal">{h.hi}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mandis.map((m, i) => {
                      const pos = m.change >= 0;
                      return (
                        <tr key={i}
                          className="border-b border-[#edf4ed] last:border-0 transition-all group"
                          style={{ background: pos ? "#f2fbf5" : "#fff7f5" }}
                          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0.965)")}
                          onMouseLeave={e => (e.currentTarget.style.filter = "")}>

                          {/* Mandi */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${pos ? "bg-[#D1FADF]" : "bg-[#FFDDD4]"}`}>
                                <Leaf size={12} className={pos ? "text-[#2D6A4F]" : "text-[#c0392b]"} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-bold text-[#2B2B2B] whitespace-nowrap">{m.name}</span>
                                  {m.top && (
                                    <span className="text-[8px] font-bold text-[#B7860B] bg-[#FFF3CD] border border-[#F0D080] rounded-full px-1.5 py-0.5 leading-none whitespace-nowrap">Top</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                  <MapPin size={8} className="text-[#9AB4A0]" />
                                  <span className="text-[9px] text-[#9AB4A0] whitespace-nowrap">{m.dist} away</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Min */}
                          <td className="px-4 py-3.5">
                            <span className="text-[13px] text-[#5a7a68] font-semibold whitespace-nowrap">₹{m.min.toLocaleString()}</span>
                          </td>

                          {/* Max */}
                          <td className="px-4 py-3.5">
                            <span className="text-[13px] text-[#5a7a68] font-semibold whitespace-nowrap">₹{m.max.toLocaleString()}</span>
                          </td>

                          {/* Modal Price pill */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center text-[12px] font-extrabold rounded-xl px-3 py-1 whitespace-nowrap"
                              style={{
                                background: pos ? "#2D6A4F" : "#c0392b",
                                color: "#fff",
                                boxShadow: pos ? "0 2px 10px #2D6A4F44" : "0 2px 10px #c0392b33",
                              }}>
                              ₹{m.modal.toLocaleString()}
                            </span>
                          </td>

                          {/* Change */}
                          <td className="px-4 py-3.5">
                            <div className={`flex items-center gap-0.5 text-[12px] font-bold whitespace-nowrap ${pos ? "text-[#2D6A4F]" : "text-[#c0392b]"}`}>
                              {pos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                              {pos ? "+" : ""}{m.change}%
                            </div>
                          </td>

                          {/* Trend sparkline */}
                          <td className="px-4 py-3.5">
                            <Sparkline pos={pos} />
                          </td>

                          {/* 7-day bar chart */}
                          <td className="px-4 py-3.5">
                            <BarSparkline bars={m.bars} pos={pos} />
                          </td>

                          {/* Action */}
                          <td className="px-4 py-3.5">
                            <button
                              className="flex items-center gap-1.5 text-[11px] font-bold text-white rounded-full px-3.5 py-2 whitespace-nowrap transition-all"
                              style={{ background: "#2D6A4F", boxShadow: "0 2px 8px #2D6A4F44" }}
                              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px #2D6A4F66")}
                              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px #2D6A4F44")}
                            >
                              View Details <ChevronRight size={10} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Map + Chart stacked */}
            <div className="flex flex-col gap-4">

              {/* Mandi Locations Map */}
              <div className="bg-white rounded-2xl border border-[#E8F0E8] shadow-[0_4px_20px_0_#2D6A4F0A] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4F8F4]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
                      <Navigation size={13} className="text-[#2D6A4F]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#2B2B2B]">Mandi Locations</p>
                      <p className="text-[9px] text-[#6B6B6B]">मंडी का नक्शा</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-[#EAF5EE] border border-[#C3E8CC] rounded-full px-3 py-1.5">
                    View Full Map <ChevronRight size={10} />
                  </button>
                </div>

                {/* Map preview */}
                <div className="relative mx-4 my-3 rounded-xl overflow-hidden h-[160px]">
                  <img src={MAP_IMG} alt="Mandi map" className="w-full h-full object-cover" style={{ filter: "saturate(1.2) brightness(0.88)" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D6A4F]/25 to-transparent" />

                  {/* Selected mandi info */}
                  <div className="absolute top-2 right-2 bg-white rounded-xl px-3 py-2 shadow-lg border border-[#E8F0E8]">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-[#2D6A4F]" fill="#2D6A4F" />
                      <p className="text-[10px] font-bold text-[#2D6A4F]">Rampur Mandi</p>
                    </div>
                    <p className="text-[12px] font-extrabold text-[#2B2B2B]">₹ 2,450 /Qtl</p>
                  </div>

                  {/* Pins */}
                  {[
                    { label: "Rampur", x: "38%", y: "52%", main: true },
                    { label: "Moradabad", x: "58%", y: "30%", main: false },
                    { label: "Bareilly", x: "68%", y: "42%", main: false },
                    { label: "Shahjahanpur", x: "22%", y: "65%", main: false },
                  ].map((pin, i) => (
                    <div key={i} className="absolute group cursor-pointer" style={{ left: pin.x, top: pin.y, transform: "translate(-50%,-100%)" }}>
                      <div className={`text-[8px] font-bold bg-white rounded-lg px-1.5 py-0.5 mb-0.5 shadow text-center ${pin.main ? "text-[#2D6A4F] border border-[#2D6A4F]" : "text-[#6B6B6B]"} group-hover:scale-110 transition-transform`}>
                        {pin.label}
                      </div>
                      <MapPin size={pin.main ? 18 : 13} className={pin.main ? "text-[#2D6A4F] mx-auto" : "text-red-500 mx-auto"} fill={pin.main ? "#2D6A4F" : "#ef4444"} />
                    </div>
                  ))}

                  <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                    <button className="w-5 h-5 bg-white rounded shadow text-[11px] flex items-center justify-center font-bold">+</button>
                    <button className="w-5 h-5 bg-white rounded shadow text-[11px] flex items-center justify-center font-bold">−</button>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-2 px-4 pb-3">
                  {[
                    { label: "All Mandis · सभी मंडियां", color: "#2D6A4F" },
                    { label: "Selected · चुनी गई", color: "#D9A441" },
                    { label: "Nearby · निकट", color: "#ef4444" },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[#F4F8F4] rounded-full px-2 py-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-[9px] text-[#6B6B6B] font-semibold">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Trend Chart */}
              <PriceTrendChart />
            </div>
          </div>

          {/* ── Market Insight + Farming Tip ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EAF5EE] border border-[#C3E8CC] rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] flex items-center justify-center flex-shrink-0 shadow-md">
                <TrendingUp size={18} color="#fff" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-bold text-[#2D6A4F]">Market Insight</p>
                  <p className="text-[9px] text-[#52B788] font-semibold bg-[#C3E8CC] rounded-full px-2 py-0.5">वाजार संकेत</p>
                </div>
                <p className="text-[12px] text-[#2B2B2B] leading-relaxed">
                  Wheat prices in Uttar Pradesh have increased by 2.1% this week due to higher demand.
                </p>
                <p className="text-[10px] text-[#52B788] mt-1 leading-snug">
                  उत्तर प्रदेश में गेहूं के भाव में इस सप्ताह 2.1% की वृद्धि हुई है, मांग अधिक रहने के कारण।
                </p>
                <button className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-white border border-[#C3E8CC] rounded-full px-3.5 py-1.5">
                  View Detailed Analysis <ChevronRight size={11} />
                </button>
              </div>
            </div>

            <div className="bg-[#FFF8EC] border border-[#F0D080] rounded-2xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#D9A441] flex items-center justify-center flex-shrink-0 shadow-md">
                <Lightbulb size={18} color="#fff" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[13px] font-bold text-[#B7860B]">Farming Tip</p>
                  <p className="text-[9px] text-[#D9A441] font-semibold bg-[#F5E0A0] rounded-full px-2 py-0.5">किसान सुझाव</p>
                </div>
                <p className="text-[12px] text-[#2B2B2B] leading-relaxed">
                  Compare prices at nearby mandis before selling to get the best rate for your crop.
                </p>
                <p className="text-[10px] text-[#B7860B] mt-1 leading-snug">
                  अच्छे दाम के लिए नजदीकी मंडियों के भाव की तुलना जरूर करें।
                </p>
                <button className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#B7860B] bg-white border border-[#F0D080] rounded-full px-3.5 py-1.5">
                  More Tips <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>

      <div className="h-2" />
    </>
  );
}
