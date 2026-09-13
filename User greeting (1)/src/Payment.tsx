import { useState } from "react";
import Sidebar from "./Sidebar";
import {
  CheckCircle2, Clock, AlertTriangle, Download, FileText, Phone,
  MapPin, Bell, ChevronDown, ChevronRight, Search,
  Landmark, Leaf, ArrowRight, Megaphone, Hash, Wheat,
  Package, Tag, TrendingUp, Banknote, Minus, Calendar,
  CreditCard, AlertCircle, Info, RefreshCw, MessageCircle, Headphones,
} from "lucide-react";

type Tab = "paid" | "processing" | "failed";

/* ── Photos ─────────────────────────────────────────────────────── */
/* Banner: full-bleed, blur + gradient overlay */
const BANNER_PAID       = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=280&fit=crop&auto=format&crop=center";
const BANNER_PROCESSING = "https://images.unsplash.com/photo-1596526131083-e8c633964948?w=1200&h=280&fit=crop&auto=format&crop=center";
const BANNER_FAILED     = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=280&fit=crop&auto=format&crop=center";
/* Card bg watermarks */
const CARD_BG_PAID      = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop&auto=format";
const CARD_BG_PROC      = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop&auto=format";
const CARD_BG_FAIL      = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop&auto=format";
/* Footer strip photos */
const FOOTER_PAID       = "https://images.unsplash.com/photo-1621609764180-2ca554a9d6f2?w=1200&h=180&fit=crop&auto=format&crop=center";
const FOOTER_PROC       = "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=180&fit=crop&auto=format&crop=center";
const FOOTER_FAIL       = "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=1200&h=180&fit=crop&auto=format&crop=center";

/* ── Detail row definitions ─────────────────────────────────────── */
const DETAILS_PAID = [
  { icon: Hash,       label: "Reference ID (PFMS)",           value: "#KC202609130842" },
  { icon: Wheat,      label: "Crop / फसल",                   value: "Wheat (Lok-1)" },
  { icon: Package,    label: "Quantity / मात्रा",              value: "45.50 Qtl (4,550 kg)" },
  { icon: Tag,        label: "Applied Rate / लागू खरीद दर",   value: "₹ 2,450 / Qtl" },
  { icon: TrendingUp, label: "Govt. MSP / सरकारी MSP",        value: "₹ 2,400 (+₹50 लाभ)", hl: "green" },
  { icon: Banknote,   label: "Gross Amount / कुल सकल राशि",   value: "₹ 1,11,475" },
  { icon: Minus,      label: "Deductions / मंडी व अन्य कटौती",value: "₹ 0.00" },
];
const DETAILS_PROC = [
  { icon: Hash,       label: "Reference ID (PFMS)",           value: "#KC20260911032" },
  { icon: Wheat,      label: "Crop / फसल",                   value: "Wheat (Lok-1)" },
  { icon: Package,    label: "Quantity / मात्रा",              value: "45.50 Qtl (4,550 kg)" },
  { icon: Tag,        label: "Applied Rate / लागू खरीद दर",   value: "₹ 2,450 / Qtl" },
  { icon: TrendingUp, label: "Govt. MSP / सरकारी MSP",        value: "₹ 2,400 (+₹50 लाभ)", hl: "amber" },
  { icon: Banknote,   label: "Gross Amount / कुल सकल राशि",   value: "₹ 1,11,475" },
  { icon: Minus,      label: "Deductions / मंडी व अन्य कटौती",value: "₹ 0.00" },
];
const DETAILS_FAIL = [
  { icon: Hash,         label: "Reference ID (PFMS)",              value: "#KC202609131045" },
  { icon: Wheat,        label: "Crop / फसल",                      value: "Wheat (Lok-1)" },
  { icon: Banknote,     label: "Amount / राशि",                    value: "₹ 1,11,475", hl: "red" },
  { icon: Calendar,     label: "Attempted On / प्रयास की तिथि",    value: "05 Sep 2026, 10:45 AM" },
  { icon: CreditCard,   label: "Payment Method / भुगतान विधि",     value: "UPI (Paytm)" },
  { icon: Info,         label: "Status / स्थिति",                  value: "", badge: "red" },
  { icon: AlertCircle,  label: "Reason / कारण",                    value: "Payment was declined by bank", hl: "red" },
];

/* ── Spinny ring ─────────────────────────────────────────────────── */
function SpinRing() {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#FEF3C7" strokeWidth="7" />
        <circle cx="40" cy="40" r="34" fill="none" stroke="#F59E0B" strokeWidth="7"
          strokeDasharray="60 180" strokeLinecap="round"
          style={{ animation: "spin 2s linear infinite", transformOrigin: "40px 40px" }} />
      </svg>
      <div className="relative z-10 w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
        <Clock size={26} className="text-amber-500" strokeWidth={2} />
      </div>
    </div>
  );
}

/* ── Success ring ────────────────────────────────────────────────── */
function SuccessRing() {
  return (
    <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#BBF7D0" strokeWidth="7" />
        <circle cx="40" cy="40" r="34" fill="none" stroke="#16A34A" strokeWidth="7"
          strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #16A34A66)" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-green-600" strokeWidth={2.5} />
      </div>
      {[
        { top: "4px",  left: "56px", bg: "#FCD34D" },
        { top: "16px", left: "-6px", bg: "#34D399" },
        { top: "58px", left: "60px", bg: "#60A5FA" },
        { top: "62px", left: "-2px", bg: "#F87171" },
      ].map((d, i) => (
        <div key={i} className="absolute w-2.5 h-2.5 rounded-full" style={{ top: d.top, left: d.left, background: d.bg }} />
      ))}
    </div>
  );
}

/* ── Failed ring ─────────────────────────────────────────────────── */
function FailedRing() {
  return (
    <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#FEE2E2" strokeWidth="7" />
        <circle cx="40" cy="40" r="34" fill="none" stroke="#DC2626" strokeWidth="7"
          strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px #DC262644)" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-600" strokeWidth={2.5} />
      </div>
    </div>
  );
}

/* ── Journey step ────────────────────────────────────────────────── */
function Step({ num, label, sub, time, state, last = false }: {
  num: number; label: string; sub: string; time: string;
  state: "done" | "active" | "pending"; last?: boolean;
}) {
  const dot = state === "done" ? "#2D6A4F" : state === "active" ? "#F59E0B" : "#D1D5DB";
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 26 }}>
        <div className="rounded-full flex items-center justify-center"
          style={{ width: 26, height: 26, background: dot, flexShrink: 0,
            boxShadow: state === "done" ? "0 2px 8px #2D6A4F44" : state === "active" ? "0 2px 8px #F59E0B55" : "none" }}>
          {state === "done"   && <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />}
          {state === "active" && <Clock size={12} color="#fff" strokeWidth={2.5} />}
          {state === "pending"&& <span className="w-2 h-2 rounded-full bg-white/60" />}
        </div>
        {!last && <div className="w-px flex-1 mt-1 mb-0" style={{ background: dot, opacity: 0.35, minHeight: 18 }} />}
      </div>
      <div className={`flex-1 ${last ? "pb-0" : "pb-4"}`}>
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="font-bold leading-tight" style={{ fontSize: 12, color: state === "pending" ? "#9CA3AF" : "#1B4332" }}>
              {num}. {label}
            </p>
            <p style={{ fontSize: 11, color: state === "pending" ? "#C4C4C4" : "#6B6B6B", marginTop: 2 }}>{sub}</p>
          </div>
          <span className="text-[10px] font-semibold flex-shrink-0 mt-0.5"
            style={{ color: state === "active" ? "#F59E0B" : state === "done" ? "#6B6B6B" : "#9CA3AF" }}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Detail rows with icons ──────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value, hl, badge, iconColor }: {
  icon: React.ElementType; label: string; value: string;
  hl?: string; badge?: string; iconColor: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F5F5F5] last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${iconColor}18` }}>
          <Icon size={12} style={{ color: iconColor }} strokeWidth={2} />
        </div>
        <span className="text-[#6B6B6B]" style={{ fontSize: 12 }}>{label}</span>
      </div>
      {badge === "red" ? (
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-red-700 bg-red-100 border border-red-200">
          <AlertTriangle size={10} /> Failed
        </span>
      ) : (
        <span className="font-semibold text-right" style={{
          fontSize: 12,
          color: hl === "green" ? "#16A34A" : hl === "amber" ? "#B45309" : hl === "red" ? "#DC2626" : "#2B2B2B",
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

/* ── Action tile row (Failed) ────────────────────────────────────── */
function ActionTile({ icon: Icon, tileBg, tileColor, title, sub }: {
  icon: React.ElementType; tileBg: string; tileColor: string; title: string; sub: string;
}) {
  return (
    <button className="w-full flex items-center gap-3 bg-white border border-[#F3F4F6] rounded-xl px-3 py-3 text-left transition-all hover:shadow-md hover:border-[#FECACA] group">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: tileBg, boxShadow: `0 2px 8px ${tileColor}33` }}>
        <Icon size={18} style={{ color: tileColor }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#2B2B2B] leading-tight" style={{ fontSize: 13 }}>{title}</p>
        <p className="text-[#6B6B6B] mt-0.5 truncate" style={{ fontSize: 11 }}>{sub}</p>
      </div>
      <ChevronRight size={14} className="text-[#C4C4C4] group-hover:text-red-400 flex-shrink-0 transition-colors" />
    </button>
  );
}

/* ── Top bar ─────────────────────────────────────────────────────── */
function TopBar({ showTooltip, setShowTooltip }: { showTooltip: boolean; setShowTooltip: (v: boolean) => void }) {
  return (
    <header className="flex items-center gap-4 px-6 py-3 bg-[#FDFBF5] border-b border-[#E8F0E8] z-10 flex-shrink-0">
      <div className="flex items-center gap-1.5 flex-shrink-0 bg-white border border-[#E0EDE3] rounded-full px-3 py-1.5">
        <MapPin size={12} className="text-[#2D6A4F]" />
        <span className="text-[12px] font-semibold text-[#2B2B2B]">Uttar Pradesh</span>
        <ChevronDown size={11} className="text-[#6B6B6B]" />
      </div>
      <div className="flex-1 flex items-center gap-3 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-4 py-2.5">
        <Search size={14} className="text-[#9AB4A0]" />
        <input className="bg-transparent text-[13px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none w-full"
          placeholder="Search anything... (e.g. Mandi, Payment, Slot)" />
      </div>
      <button className="text-[12px] font-semibold text-[#2B2B2B] bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-3.5 py-2">
        EN | हिंदी
      </button>
      <button className="relative w-9 h-9 rounded-full bg-[#F4F8F4] border border-[#E0EDE3] flex items-center justify-center"
        onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        <Bell size={16} className="text-[#2B2B2B]" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#FDFBF5] text-[7px] text-white flex items-center justify-center font-bold">3</span>
        {showTooltip && (
          <div className="absolute top-11 right-0 bg-white rounded-2xl shadow-2xl border border-[#E8F0E8] p-3 w-56 text-left z-20">
            <p className="text-[11px] font-bold text-[#2D6A4F] mb-2">3 Notifications</p>
            {["Payment credited to account","Wheat rate updated","New mandi slot available"].map((n, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#F0F0F0] last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                <p className="text-[11px] text-[#6B6B6B]">{n}</p>
              </div>
            ))}
          </div>
        )}
      </button>
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-[12px] font-bold" style={{ boxShadow: "0 2px 8px #2D6A4F44" }}>RK</div>
        <div><p className="text-[12px] font-bold text-[#2B2B2B] leading-tight">Ramesh Kumar</p><p className="text-[10px] text-[#6B6B6B]">Farmer</p></div>
        <ChevronDown size={13} className="text-[#6B6B6B]" />
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════ */
export default function Payment({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const [tab, setTab] = useState<Tab>("paid");
  const [showTooltip, setShowTooltip] = useState(false);

  const pageBg = tab === "paid" ? "#F0FAF4" : tab === "processing" ? "#FFFBEB" : "#FFF5F5";

  const TABS = [
    { id: "paid" as Tab,       Icon: CheckCircle2,  hi: "भुगतान हो गया", en: "Paid",            activeBg: "#2D6A4F", idleColor: "#2D6A4F" },
    { id: "processing" as Tab, Icon: Clock,         hi: "प्रक्रिया में",  en: "Processing",      activeBg: "#F59E0B", idleColor: "#B45309" },
    { id: "failed" as Tab,     Icon: AlertTriangle, hi: "विफल / अन्य",   en: "Failed / Others", activeBg: "#DC2626", idleColor: "#B91C1C" },
  ];

  const BANNER = {
    paid:       { photo: BANNER_PAID,       overlay: "rgba(27,67,50,0.55)",   tagline: "Mehnat Ka\nSahi Daam!",             tagColor: "#fff" },
    processing: { photo: BANNER_PROCESSING, overlay: "rgba(120,60,0,0.50)",   tagline: "Aaj ki mehnat,\nkal ka behtar kal!", tagColor: "#fff" },
    failed:     { photo: BANNER_FAILED,     overlay: "rgba(120,10,10,0.48)",   tagline: "Koi baat nahi,\nhum aapke saath hain!", tagColor: "#fff" },
  }[tab];

  const FOOTER = {
    paid:       { photo: FOOTER_PAID, color: "#2D6A4F", head: "भुगतान आपके खाते में जमा हो गया है!", sub: "Great! Your hard work has paid off. Download your receipt for your records.", btn: "Download Receipt" },
    processing: { photo: FOOTER_PROC, color: "#F59E0B", head: "आपका भुगतान प्रक्रिया में है।",       sub: "You will receive an SMS once your payment is credited. Usually within 24–48 hours.", btn: "Track Live Status" },
    failed:     { photo: FOOTER_FAIL, color: "#DC2626", head: "हम आपकी मदद के लिए यहाँ हैं।",        sub: "Our support team is available 24x7. Call us and we'll resolve your issue instantly.", btn: "Call Us Now" },
  }[tab];

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif", background: pageBg }}>
      <Sidebar activeScreen="payment" onNavigate={(s) => onNavigate?.(s)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar showTooltip={showTooltip} setShowTooltip={setShowTooltip} />

        <main className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {/* ════ FIX 1: Full-bleed banner with blur + gradient overlay ════ */}
          <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{ height: 130, boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
            {/* Full-width photo edge-to-edge */}
            <img src={BANNER.photo} alt="" aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "blur(1.5px) brightness(0.88)", transform: "scale(1.03)" }} />
            {/* Gradient: left side readable for text, right side photo shows through */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to right, ${BANNER.overlay} 0%, ${BANNER.overlay.replace("0.55","0.72").replace("0.50","0.65").replace("0.48","0.62")} 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 80%, transparent 100%)`
            }} />
            {/* Page heading over the photo */}
            <div className="absolute left-7 top-0 bottom-0 flex flex-col justify-center">
              <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: 24 }}>
                Payment / भुगतान
              </h1>
              <p className="text-white/75 mt-1" style={{ fontSize: 11.5 }}>
                Track your payment status and details • DBT Tracking / डायरेक्ट बेनिफिट ट्रांसफर ट्रैकिंग
              </p>
            </div>
            {/* Caveat tagline — right side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right">
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: 26, fontWeight: 700, color: BANNER.tagColor, lineHeight: 1.2, whiteSpace: "pre-line", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                {BANNER.tagline}
              </p>
              <svg viewBox="0 0 130 12" className="mt-0.5 ml-auto" style={{ width: 120, height: 10 }}>
                <path d="M4,7 Q32,2 65,6 Q98,10 126,3" stroke="#D9A441" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* ════ 3-tab switcher ════ */}
          <div className="flex rounded-2xl p-1.5 gap-1 flex-shrink-0"
            style={{ background: "#E8F5EE", boxShadow: "inset 0 1px 4px rgba(45,106,79,0.10)" }}>
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3 transition-all"
                  style={{ background: active ? t.activeBg : "transparent", boxShadow: active ? "0 4px 16px rgba(0,0,0,0.18)" : "none" }}>
                  <t.Icon size={17} strokeWidth={2.2} style={{ color: active ? "#fff" : t.idleColor, flexShrink: 0 }} />
                  <div className="text-left">
                    <p className="font-bold leading-tight" style={{ fontSize: 13, color: active ? "#fff" : t.idleColor }}>{t.hi}</p>
                    <p className="leading-tight" style={{ fontSize: 10.5, color: active ? "rgba(255,255,255,0.75)" : "#6B6B6B" }}>({t.en})</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ════ Content panels ════ */}
          {tab === "paid"       && <PaidPanel />}
          {tab === "processing" && <ProcessingPanel />}
          {tab === "failed"     && <FailedPanel />}

          {/* ════ FIX 2 — Footer photo strip ════ */}
          <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
            style={{ minHeight: 88, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
            <img src={FOOTER.photo} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 55%, transparent 100%)" }} />
            <div className="relative z-10 flex items-center gap-5 px-6 py-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: FOOTER.color, boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
                <Phone size={20} color="#fff" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white" style={{ fontSize: 14 }}>{FOOTER.head}</p>
                <p className="text-white/75 mt-0.5" style={{ fontSize: 12 }}>{FOOTER.sub}</p>
              </div>
              <button className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white flex-shrink-0 transition-all hover:opacity-90"
                style={{ fontSize: 13, background: FOOTER.color, boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
                {FOOTER.btn} <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Bottom call bar */}
          <div className="flex-shrink-0 flex items-center gap-5 rounded-2xl px-6 py-4 bg-white border border-[#E8F0E8]"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: tab === "failed" ? "#DC2626" : "#2D6A4F", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
              <Phone size={19} color="#fff" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 13 }}>
                {tab === "failed" ? "Still facing issues?" : "Need any help with your payment?"}
              </p>
              <p style={{ fontSize: 11.5, color: "#6B6B6B" }}>हमारी सहायता टीम से बात करें। • हमसे बात करें</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white transition-all hover:opacity-90"
              style={{ fontSize: 12, background: tab === "failed" ? "#DC2626" : "#2D6A4F", boxShadow: "0 4px 14px rgba(0,0,0,0.16)" }}>
              <Phone size={13} /> Call Us Now (1800-180-1551) <ArrowRight size={13} />
            </button>
          </div>

          <div className="h-1" />
        </main>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAID PANEL
══════════════════════════════════════════════════════════════════════ */
function PaidPanel() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 256px" }}>

      {/* Left: Status card with subtle currency bg watermark */}
      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: "#fff", border: "1px solid #D1FAE5", boxShadow: "0 4px 20px rgba(45,106,79,0.10)" }}>
        {/* Subtle bg watermark */}
        <img src={CARD_BG_PAID} alt="" aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.06, filter: "blur(2px) grayscale(0.3)" }} />
        <div className="relative z-10">
          <div className="px-5 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #F0FDF4cc, #DCFCE7cc)" }}>
            <div className="flex items-start gap-4 mb-4">
              <SuccessRing />
              <div>
                <p className="font-extrabold text-green-700 leading-tight" style={{ fontSize: 16 }}>भुगतान सफल</p>
                <p className="font-bold text-[#1B4332]" style={{ fontSize: 14 }}>Payment Successful</p>
                <p className="text-[#4a6a54] mt-1" style={{ fontSize: 11 }}>
                  Your payment has been successfully<br />credited to your bank account.
                </p>
              </div>
            </div>
            <p className="font-extrabold text-[#1B4332]" style={{ fontSize: 30 }}>₹ 1,11,475</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
              <Landmark size={18} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[#6B6B6B] font-medium">Credited to</p>
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12.5 }}>State Bank of India — A/c XXXX 4821</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
              <Calendar size={18} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-[#6B6B6B] font-medium">Payment Date</p>
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12.5 }}>05 Sep 2026, 11:42 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <Leaf size={14} className="text-green-500 flex-shrink-0" />
              <p style={{ fontSize: 11, color: "#166534" }}>
                <span className="font-bold">Great!</span> Your hard work has been rewarded. आपकी मेहनत का सही मूल्य मिला।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Details with icon tiles */}
      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #E8F0E8", boxShadow: "0 4px 20px rgba(45,106,79,0.07)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#F0F7F3]">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#2D6A4F]" />
            <span className="font-bold text-[#2B2B2B]" style={{ fontSize: 13.5 }}>Payment Details / भुगतान विवरण</span>
          </div>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-green-700 bg-green-100 border border-green-200">
            <CheckCircle2 size={11} /> Paid
          </span>
        </div>
        <div className="px-5 py-3">
          {DETAILS_PAID.map((r, i) => (
            <DetailRow key={i} {...r} iconColor="#2D6A4F" />
          ))}
          <div className="flex items-center justify-between pt-3 mt-1.5" style={{ borderTop: "2px solid #D1FAE5" }}>
            <span className="font-extrabold text-[#1B4332]" style={{ fontSize: 13 }}>Net Credit / अंतिम भुगतान</span>
            <span className="font-extrabold text-green-700" style={{ fontSize: 16 }}>₹ 1,11,475</span>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-4">
          <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#2D6A4F] py-2.5 text-[#2D6A4F] font-bold text-[12px] transition-all hover:bg-[#EAF5EE]">
            <FileText size={13} /> View Receipt Slip
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-white font-bold text-[12px] transition-all hover:opacity-90"
            style={{ background: "#2D6A4F", boxShadow: "0 4px 14px #2D6A4F44" }}>
            <Download size={13} /> Download Receipt
          </button>
        </div>
      </div>

      {/* Right: Journey */}
      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #E8F0E8", boxShadow: "0 4px 20px rgba(45,106,79,0.07)" }}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-[#F0F7F3]">
          <Clock size={15} className="text-[#2D6A4F]" />
          <div><p className="font-bold text-[#2B2B2B]" style={{ fontSize: 13 }}>Payment Journey</p><p className="text-[#6B6B6B]" style={{ fontSize: 10 }}>भुगतान यात्रा</p></div>
        </div>
        <div className="px-4 py-4">
          <Step num={1} label="फसल तौल पूरी"       sub="Crop weighing completed"    time="05 Sep, 10:15 AM" state="done" />
          <Step num={2} label="खरीद बिल अधिकृत"    sub="Purchase bill authorized"   time="05 Sep, 10:45 AM" state="done" />
          <Step num={3} label="PFMS बैंक को भेजा"  sub="Sent to bank via PFMS"      time="05 Sep, 11:10 AM" state="done" />
          <Step num={4} label="बैंक खाते में जमा"  sub="Credited to your account"   time="05 Sep, 11:42 AM" state="done" last />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PROCESSING PANEL
══════════════════════════════════════════════════════════════════════ */
function ProcessingPanel() {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 256px" }}>

      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: "#fff", border: "1px solid #FDE68A", boxShadow: "0 4px 20px rgba(245,158,11,0.12)" }}>
        <img src={CARD_BG_PROC} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.06, filter: "blur(2px) sepia(0.4)" }} />
        <div className="relative z-10">
          <div className="px-5 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #FFFBEBcc, #FEF3C7cc)" }}>
            <div className="flex items-start gap-4 mb-4">
              <SpinRing />
              <div>
                <p className="font-extrabold text-amber-700 leading-tight" style={{ fontSize: 15 }}>भुगतान प्रक्रिया में है</p>
                <p className="font-bold text-amber-900" style={{ fontSize: 13 }}>Payment in Processing</p>
                <p className="text-amber-700 mt-1" style={{ fontSize: 11 }}>Being verified, will be credited<br />to your account soon.</p>
              </div>
            </div>
            <p className="font-extrabold text-amber-900" style={{ fontSize: 28 }}>₹ 1,11,475</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
              <Landmark size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-amber-600 font-medium">Destination Bank</p>
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12.5 }}>State Bank of India — A/c XXXX 4821</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
              <Clock size={18} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-amber-600 font-medium">Expected Credit Time</p>
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12.5 }}>Within 24 to 48 hours</p>
                <p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>आमतौर पर 24 से 48 घंटे में</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <Megaphone size={13} className="text-amber-500 flex-shrink-0" />
              <p style={{ fontSize: 11, color: "#92400E" }}>
                You will be notified once credited.<br />
                <span className="text-[10px]">जैसे ही जमा होगा, SMS द्वारा सूचना मिलेगी।</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #FDE68A", boxShadow: "0 4px 20px rgba(245,158,11,0.08)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#FEF3C7]">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-amber-500" />
            <span className="font-bold text-[#2B2B2B]" style={{ fontSize: 13.5 }}>Payment Details / भुगतान विवरण</span>
          </div>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200">
            <Clock size={11} /> Processing
          </span>
        </div>
        <div className="px-5 py-3">
          {DETAILS_PROC.map((r, i) => <DetailRow key={i} {...r} iconColor="#B45309" />)}
          <div className="flex items-center justify-between pt-3 mt-1.5" style={{ borderTop: "2px solid #FDE68A" }}>
            <span className="font-extrabold text-amber-900" style={{ fontSize: 13 }}>Net Credit / अंतिम भुगतान</span>
            <span className="font-extrabold text-amber-600" style={{ fontSize: 16 }}>₹ 1,11,475</span>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <Info size={13} className="text-amber-500 flex-shrink-0" />
            <p style={{ fontSize: 11, color: "#92400E" }}>
              No action required from your side.<br />
              कृपया इंतजार करें, भुगतान स्वचालित रूप से जमा हो जाएगा।
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #FDE68A", boxShadow: "0 4px 20px rgba(245,158,11,0.08)" }}>
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-[#FEF3C7]">
          <Clock size={15} className="text-amber-500" />
          <div><p className="font-bold text-[#2B2B2B]" style={{ fontSize: 13 }}>Payment Journey</p><p className="text-[#6B6B6B]" style={{ fontSize: 10 }}>भुगतान यात्रा</p></div>
        </div>
        <div className="px-4 py-4">
          <Step num={1} label="फसल तौल पूरी"           sub="Crop weighing completed"    time="05 Sep, 10:15 AM" state="done" />
          <Step num={2} label="खरीद बिल अधिकृत"        sub="Purchase bill authorized"   time="05 Sep, 10:45 AM" state="done" />
          <Step num={3} label="PFMS बैंक को भेजा"      sub="Sent to bank via PFMS"      time="05 Sep, 11:10 AM" state="done" />
          <Step num={4} label="बैंक में सत्यापन जारी"   sub="In bank verification"       time="In Progress"      state="active" />
          <div className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: 26 }}>
              <div className="rounded-full border-2 border-gray-200 flex items-center justify-center" style={{ width: 26, height: 26, flexShrink: 0 }}>
                <span className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>
            <div>
              <p className="font-bold text-[#9CA3AF]" style={{ fontSize: 12 }}>5. खाते में जमा (अपेक्षित)</p>
              <p className="text-[#9CA3AF]" style={{ fontSize: 11 }}>Credit to your bank account</p>
              <p className="text-[#C4C4C4]" style={{ fontSize: 10 }}>Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FAILED PANEL
══════════════════════════════════════════════════════════════════════ */
function FailedPanel() {
  const actions = [
    { icon: RefreshCw,    tileBg: "#DCFCE7", tileColor: "#16A34A", title: "Try Again",              sub: "Retry with the same payment method" },
    { icon: CreditCard,   tileBg: "#DBEAFE", tileColor: "#2563EB", title: "Use a Different Method", sub: "Try UPI, Card or Net Banking" },
    { icon: Headphones,   tileBg: "#EDE9FE", tileColor: "#7C3AED", title: "Contact Support",        sub: "Get help from our team" },
    { icon: Landmark,     tileBg: "#FEE2E2", tileColor: "#DC2626", title: "Check with Your Bank",   sub: "Confirm if transaction was declined" },
  ];
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 256px" }}>

      <div className="rounded-2xl overflow-hidden relative"
        style={{ background: "#fff", border: "1px solid #FECACA", boxShadow: "0 4px 20px rgba(220,38,38,0.10)" }}>
        <img src={CARD_BG_FAIL} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.06, filter: "blur(2px) grayscale(0.2)" }} />
        <div className="relative z-10">
          <div className="px-5 pt-5 pb-4" style={{ background: "linear-gradient(135deg, #FFF5F5cc, #FEE2E2cc)" }}>
            <div className="flex items-start gap-4 mb-4">
              <FailedRing />
              <div>
                <p className="font-extrabold text-red-700 leading-tight" style={{ fontSize: 15 }}>भुगतान विफ़ल हो गया</p>
                <p className="font-bold text-red-900" style={{ fontSize: 13 }}>Payment Failed</p>
                <p className="text-red-600 mt-1" style={{ fontSize: 11 }}>Could not be processed.<br />Please check details or try again.</p>
              </div>
            </div>
            <p className="font-extrabold text-red-900" style={{ fontSize: 28 }}>₹ 1,11,475</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            <div className="rounded-xl p-3" style={{ background: "#FFF5F5", border: "1px solid #FECACA" }}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-700" style={{ fontSize: 12 }}>No amount deducted in most cases.</p>
                  <p className="text-red-600 mt-0.5" style={{ fontSize: 11 }}>
                    If deducted, auto-refunded within 3–5 working days.<br />
                    <span className="text-[10px]">यदि राशि कट गई है, 3–5 दिनों में वापस आ जाएगी।</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <Leaf size={13} className="text-green-500 flex-shrink-0" />
              <p style={{ fontSize: 11, color: "#166534" }}>Don't worry! You can try again or contact our support team anytime.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #FECACA", boxShadow: "0 4px 20px rgba(220,38,38,0.08)" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#FEE2E2]">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-red-500" />
            <span className="font-bold text-[#2B2B2B]" style={{ fontSize: 13.5 }}>Payment Details / भुगतान विवरण</span>
          </div>
          <button className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 hover:bg-red-200 transition-colors">
            <Download size={11} /> Download
          </button>
        </div>
        <div className="px-5 py-3">
          {DETAILS_FAIL.map((r, i) => <DetailRow key={i} {...r} iconColor="#DC2626" />)}
        </div>
        <div className="px-5 pb-4">
          <div className="rounded-xl p-3" style={{ background: "#FFF5F5", border: "1px solid #FECACA" }}>
            <div className="flex items-start gap-2">
              <Info size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p style={{ fontSize: 11, color: "#B91C1C" }}>
                Your bank could not process the transaction. Please try again or use a different payment method.<br />
                <span className="text-[10px]">आपका बैंक लेनदेन पूरा नहीं कर सका। कृपया दोबारा प्रयास करें।</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl" style={{ background: "#fff", border: "1px solid #FECACA", boxShadow: "0 4px 20px rgba(220,38,38,0.08)" }}>
        <div className="px-4 pt-4 pb-3 border-b border-[#FEE2E2]">
          <p className="font-bold text-red-700" style={{ fontSize: 13 }}>What You Can Do?</p>
          <p className="text-[#6B6B6B]" style={{ fontSize: 10 }}>आप क्या कर सकते हैं?</p>
        </div>
        <div className="px-3 py-3 flex flex-col gap-2">
          {actions.map((a, i) => <ActionTile key={i} {...a} />)}
        </div>
      </div>
    </div>
  );
}
