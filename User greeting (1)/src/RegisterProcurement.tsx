import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import {
  MapPin, Bell, ChevronDown, Search, ArrowLeft, ArrowRight,
  CheckCircle2, Leaf, Lightbulb, Phone, Navigation, Clock,
  Edit2, Check, Truck, ShieldCheck, Zap, Headphones,
  Info, Droplets, Weight, Package, Tag, Camera, Upload, Plus,
} from "lucide-react";

/* ── Local images ────────────────────────────────────────────────────── */
import paddyImg    from "@/imports/sunlit-paddy-field-with-ripe-yellowing-rice-free-photo.jpg";
import maizeImg    from "@/imports/360_F_1795549219_SUHJwqosehTz0QCnO09ZA7xPhhQugq0v.jpg";
import wheatImg    from "@/imports/istockphoto-2153462364-612x612.jpg";
import soybeanImg  from "@/imports/istockphoto-177429175-612x612.jpg";
import tomatoImg   from "@/imports/images.jpg";
import potatoImg   from "@/imports/istockphoto-460420375-612x612.jpg";
import onionImg    from "@/imports/onions-thrive-in-rich-soil-promising-a-plentiful-harvest-photo.jpg";

/* ── Photos ─────────────────────────────────────────────────────────── */
const BANNER = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=320&fit=crop&auto=format&crop=entropy";

const CROPS = [
  { id: "wheat",     label: "Wheat",        hi: "गेहूं",      img: wheatImg   },
  { id: "paddy",     label: "Paddy (Rice)", hi: "धान",        img: paddyImg   },
  { id: "maize",     label: "Maize",        hi: "मक्का",      img: maizeImg   },
  { id: "soybean",   label: "Soybean",      hi: "सोयाबीन",   img: soybeanImg },
  { id: "mustard",   label: "Mustard",      hi: "सरसों",      img: "https://images.unsplash.com/photo-1687840466714-c06204b409fc?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "gram",      label: "Gram (Chana)", hi: "चना",        img: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "arhar",     label: "Arhar (Tur)",  hi: "अरहर",       img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "urad",      label: "Urad",         hi: "उड़द",       img: "https://images.unsplash.com/photo-1612257999756-3f9e0fd4c48e?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "moong",     label: "Moong",        hi: "मूंग",       img: "https://images.unsplash.com/photo-1607620000036-8ae65e8c6b2a?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "groundnut", label: "Groundnut",    hi: "मूंगफली",   img: "https://images.unsplash.com/photo-1567954968077-c4f43bbe34b5?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "sunflower", label: "Sunflower",    hi: "सूरजमुखी",  img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "tomato",    label: "Tomato",       hi: "टमाटर",      img: tomatoImg  },
  { id: "potato",    label: "Potato",       hi: "आलू",        img: potatoImg  },
  { id: "onion",     label: "Onion",        hi: "प्याज",      img: onionImg   },
  { id: "cotton",    label: "Cotton",       hi: "कपास",       img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "sugarcane", label: "Sugarcane",    hi: "गन्ना",      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=320&h=220&fit=crop&auto=format&crop=center" },
  { id: "bajra",     label: "Bajra",        hi: "बाजरा",      img: "https://images.unsplash.com/photo-1615485500704-8e990f9900b7?w=320&h=220&fit=crop&auto=format&crop=center" },
];

const CENTRES = [
  { id: "sehore",    name: "Sehore Mandi (MP)",  loc: "Sehore, Madhya Pradesh — 466001", dist: "10 km", slots: "Available Slots", slotColor: "#16A34A", slotBg: "#F0FDF4", badge: "Recommended", badgeColor: "#2D6A4F", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=220&h=140&fit=crop&auto=format", amenities: ["Weighbridge","Digital Token","Drinking Water","Waiting Area"] },
  { id: "ashta",     name: "Ashta Mandi",         loc: "Ashta, Sehore, Madhya Pradesh",   dist: "28 km", slots: "Available Slots", slotColor: "#16A34A", slotBg: "#F0FDF4", badge: "",            badgeColor: "",       img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=220&h=140&fit=crop&auto=format", amenities: ["Weighbridge","Digital Token","Help Desk"] },
  { id: "ichhawar",  name: "Ichhawar Mandi",       loc: "Ichhawar, Sehore, Madhya Pradesh",dist: "42 km", slots: "Limited Slots",   slotColor: "#B45309", slotBg: "#FFFBEB", badge: "",            badgeColor: "",       img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=220&h=140&fit=crop&auto=format", amenities: ["Weighbridge","Drinking Water","Waiting Area"] },
  { id: "bhopal",    name: "Bhopal Mandi",         loc: "Bhopal, Madhya Pradesh",          dist: "68 km", slots: "Filling Fast",    slotColor: "#DC2626", slotBg: "#FEF2F2", badge: "",            badgeColor: "",       img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=220&h=140&fit=crop&auto=format", amenities: ["Weighbridge","Digital Token","Food Facility"] },
];

/* ── Step banner taglines & badges ─────────────────────────────────── */
const STEP_META = [
  { tagline: "Apni Fasal,\nSahi Daam, Behtar Kal!", badge: ["Fair Prices","Direct Procurement","A Stronger Tomorrow"] },
  { tagline: "Mehnat Aapki,\nSaath Hamesha Hamara!",  badge: ["Better Markets","Fair Prices","Stronger Farmers"] },
  { tagline: "Kisaan ki mehnat,\nsahi jagah, sahi daam!", badge: ["Nearest Mandi","Best Rates","Quick Slots"] },
  { tagline: "Aaj ki Sahi Soch,\nBehtar Kal!",         badge: ["Farmers Grow","India Prospers",""] },
];

const STEP_LABELS = ["Crop Details","Quantity & Quality","Procurement Centre","Review & Submit"];

/* ── Top bar ────────────────────────────────────────────────────────── */
function TopBar({ showTip, setShowTip }: { showTip: boolean; setShowTip: (v: boolean) => void }) {
  return (
    <header className="flex items-center gap-4 px-6 py-3 bg-[#FDFBF5] border-b border-[#E8F0E8] z-10 flex-shrink-0">
      <div className="flex items-center gap-1.5 bg-white border border-[#E0EDE3] rounded-full px-3 py-1.5 flex-shrink-0">
        <MapPin size={12} className="text-[#2D6A4F]" /><span className="text-[12px] font-semibold text-[#2B2B2B]">Uttar Pradesh</span><ChevronDown size={11} className="text-[#6B6B6B]" />
      </div>
      <div className="flex-1 flex items-center gap-3 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-4 py-2.5">
        <Search size={14} className="text-[#9AB4A0]" />
        <input className="bg-transparent text-[13px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none w-full" placeholder="Search anything... (e.g. Mandi, Payment, Procurement)" />
      </div>
      <button className="text-[12px] font-semibold text-[#2B2B2B] bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-3.5 py-2">EN | हिंदी</button>
      <button className="relative w-9 h-9 rounded-full bg-[#F4F8F4] border border-[#E0EDE3] flex items-center justify-center" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
        <Bell size={16} className="text-[#2B2B2B]" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#FDFBF5] text-[7px] text-white flex items-center justify-center font-bold">3</span>
        {showTip && (
          <div className="absolute top-11 right-0 bg-white rounded-2xl shadow-2xl border border-[#E8F0E8] p-3 w-52 text-left z-20">
            <p className="text-[11px] font-bold text-[#2D6A4F] mb-2">3 Notifications</p>
            {["Procurement slot available","MSP updated for Wheat","New centre added nearby"].map((n,i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#F0F0F0] last:border-0"><span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" /><p className="text-[11px] text-[#6B6B6B]">{n}</p></div>
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

/* ── Banner ─────────────────────────────────────────────────────────── */
function Banner({ step }: { step: number }) {
  const meta = STEP_META[step - 1];
  return (
    <div className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ height: 260, boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
      {/* Full-bleed photo, blurred */}
      <img src={BANNER} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(1px) brightness(0.80)", transform: "scale(1.04)" }} />
      {/* High-opacity uniform overlay — user requested "blurred and high in opacity so text is visible" */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(15,40,20,0.78) 0%, rgba(15,40,20,0.60) 38%, rgba(10,30,15,0.28) 65%, rgba(0,0,0,0.05) 100%)" }} />

      {/* Heading */}
      <div className="absolute left-7 top-5">
        <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: 26 }}>Register Procurement</h1>
        <p className="text-white/70 mt-0.5" style={{ fontSize: 12.5 }}>Sell your produce in just a few simple steps</p>
      </div>

      {/* 4-step stepper inside banner — wrapped in semi-opaque scrim strip */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ background: "linear-gradient(to top, rgba(10,28,18,0.72) 0%, rgba(10,28,18,0.52) 60%, transparent 100%)", paddingBottom: 16, paddingTop: 20, paddingLeft: 28, paddingRight: 28 }}
      >
      <div className="flex items-center gap-0">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = num < step;
          const active = num === step;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all"
                  style={{
                    background: done ? "#2D6A4F" : active ? "#2D6A4F" : "rgba(255,255,255,0.18)",
                    border: done || active ? "none" : "2px solid rgba(255,255,255,0.5)",
                    boxShadow: active ? "0 0 0 4px rgba(45,106,79,0.35)" : "none",
                    fontSize: 14,
                    color: done || active ? "#fff" : "rgba(255,255,255,0.65)",
                  }}>
                  {done ? <Check size={16} strokeWidth={2.5} /> : num}
                </div>
                <span className="text-[10px] font-semibold whitespace-nowrap"
                  style={{ color: done || active ? "#fff" : "rgba(255,255,255,0.55)" }}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-px mx-2 mt-[-10px]" style={{ background: i < step - 1 ? "#2D6A4F" : "rgba(255,255,255,0.3)" }} />
              )}
            </div>
          );
        })}
      </div>
      </div>

      {/* Tagline */}
      <div className="absolute right-48 top-1/2 -translate-y-1/2 text-right pointer-events-none select-none">
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.25, whiteSpace: "pre-line", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
          {meta.tagline}
        </p>
        <svg viewBox="0 0 130 12" className="mt-0.5 ml-auto" style={{ width: 120, height: 10 }}>
          <path d="M4,7 Q32,2 65,6 Q98,10 126,3" stroke="#D9A441" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Badge card */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/95 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm"
        style={{ minWidth: 160, border: "1px solid rgba(45,106,79,0.15)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
            <Leaf size={15} className="text-[#2D6A4F]" />
          </div>
        </div>
        {meta.badge.filter(Boolean).map((b, i) => (
          <p key={i} className="font-bold text-[#1B4332] leading-tight" style={{ fontSize: 12 }}>{b}</p>
        ))}
      </div>
    </div>
  );
}

/* ── Progress bar row ───────────────────────────────────────────────── */
function ProgressRow({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#2D6A4F] font-semibold text-[13px] hover:gap-2.5 transition-all">
        <ArrowLeft size={15} /> Back
      </button>
      <div className="flex-1 h-1.5 rounded-full bg-[#E8F0E8] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%`, background: "linear-gradient(to right, #2D6A4F, #40916C)" }} />
      </div>
      <span className="text-[12px] font-semibold text-[#6B6B6B] flex-shrink-0">Step {step} of 4</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════ */
export default function RegisterProcurement({ onNavigate }: { onNavigate?: (s: string) => void }) {
  const [step, setStep] = useState(1);
  const [showTip, setShowTip] = useState(false);

  /* form state */
  const [crop, setCrop] = useState("wheat");
  const [cropSearch, setCropSearch] = useState("");
  const [otherCropName, setOtherCropName] = useState("");
  const [quantity, setQuantity] = useState("45.50");
  const [unit, setUnit] = useState("Quintal (Qtl)");
  const [grade, setGrade] = useState("A");
  const [moisture, setMoisture] = useState("12");
  const [remarks, setRemarks] = useState("");
  const [centre, setCentre] = useState("sehore");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCrop = CROPS.find(c => c.id === crop) ?? CROPS[0];
  const selectedCentre = CENTRES.find(c => c.id === centre) ?? CENTRES[0];

  const handleBack = () => step > 1 ? setStep(s => s - 1) : onNavigate?.("dashboard");
  const handleNext = () => step < 4 ? setStep(s => s + 1) : undefined;

  if (submitted) return <SuccessScreen crop={selectedCrop} centre={selectedCentre} quantity={quantity} unit={unit} grade={grade} onNavigate={onNavigate} />;

  const filteredCrops = CROPS.filter(c =>
    cropSearch === "" || c.label.toLowerCase().includes(cropSearch.toLowerCase()) || c.hi.includes(cropSearch)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFBF5]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar activeScreen="bookslot" onNavigate={(s) => onNavigate?.(s)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar showTip={showTip} setShowTip={setShowTip} />
        <main className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          <Banner step={step} />
          <ProgressRow step={step} onBack={handleBack} />

          {/* Two-column content + right panel */}
          <div className="flex gap-5 flex-1 min-h-0">

            {/* ── Main content card ── */}
            <div className="flex-1 bg-white rounded-2xl border border-[#E8F0E8] overflow-y-auto" style={{ boxShadow: "0 4px 20px rgba(45,106,79,0.07)" }}>

              {step === 1 && (
                <Step1
                  crop={crop} setCrop={setCrop}
                  search={cropSearch} setSearch={setCropSearch}
                  filteredCrops={filteredCrops}
                  otherCropName={otherCropName} setOtherCropName={setOtherCropName}
                />
              )}
              {step === 2 && (
                <Step2
                  selectedCrop={selectedCrop}
                  quantity={quantity} setQuantity={setQuantity}
                  unit={unit} setUnit={setUnit}
                  grade={grade} setGrade={setGrade}
                  moisture={moisture} setMoisture={setMoisture}
                  remarks={remarks} setRemarks={setRemarks}
                />
              )}
              {step === 3 && (
                <Step3
                  centre={centre} setCentre={setCentre}
                  centres={CENTRES}
                />
              )}
              {step === 4 && (
                <Step4
                  selectedCrop={selectedCrop}
                  quantity={quantity} unit={unit} grade={grade} moisture={moisture}
                  selectedCentre={selectedCentre}
                  confirmed={confirmed} setConfirmed={setConfirmed}
                  onEdit={(s) => setStep(s)}
                />
              )}
            </div>

            {/* ── Right panel ── */}
            <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: 260 }}>
              {step <= 2 && <WhyPanel step={step} />}
              {step === 2 && <SelectionSummary crop={selectedCrop} quantity={quantity} unit={unit} grade={grade} />}
              {step === 3 && <SelectionSoFar crop={selectedCrop} quantity={quantity} unit={unit} grade={grade} />}
              {step === 3 && <MapCard />}
              {step === 4 && <AlmostDonePanel />}
              {step === 4 && <WhatNextPanel />}

              {/* CTA button always at bottom of right panel */}
              <button
                onClick={step === 4 ? () => confirmed && setSubmitted(true) : handleNext}
                disabled={step === 4 && !confirmed}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-extrabold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: 15, background: "linear-gradient(135deg, #2D6A4F, #40916C)", boxShadow: "0 6px 20px #2D6A4F55" }}
              >
                {step === 4 ? "Submit for Procurement" : "Next"} <ArrowRight size={16} />
              </button>
              <p className="text-center text-[11px] text-[#9AB4A0] font-medium -mt-1">
                Step {step} of 4 · {STEP_LABELS[step - 1]}
              </p>
            </div>
          </div>
          <div className="h-2" />
        </main>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STEP 1 — CROP DETAILS
══════════════════════════════════════════════════════════════════════ */
function Step1({ crop, setCrop, search, setSearch, filteredCrops, otherCropName, setOtherCropName }: {
  crop: string; setCrop: (v: string) => void;
  search: string; setSearch: (v: string) => void;
  filteredCrops: typeof CROPS;
  otherCropName: string; setOtherCropName: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [otherPhotoPreview, setOtherPhotoPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOtherPhotoPreview(url);
  }

  function cropCardStyle(id: string) {
    const selected = crop === id;
    return {
      border: selected ? "2.5px solid #2D6A4F" : "2px solid #E8F0E8",
      boxShadow: selected ? "0 0 0 3px rgba(45,106,79,0.15), 0 6px 20px rgba(45,106,79,0.18)" : "0 2px 8px rgba(0,0,0,0.07)",
      transition: "transform 200ms ease, box-shadow 200ms ease",
    };
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-extrabold text-[#2B2B2B]" style={{ fontSize: 22 }}>What are you selling?</h2>
          <p className="text-[#6B6B6B] mt-0.5" style={{ fontSize: 13 }}>Select the crop you want to register</p>
        </div>
        <div className="flex items-center gap-2 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-4 py-2">
          <Search size={13} className="text-[#9AB4A0]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[12px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none w-44"
            placeholder="Search crop (e.g. Wheat, Paddy...)"
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {filteredCrops.map((c) => (
          <button key={c.id} onClick={() => setCrop(c.id)}
            className="relative rounded-2xl overflow-hidden text-left"
            style={cropCardStyle(c.id)}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(45,106,79,0.22)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = cropCardStyle(c.id).boxShadow;
            }}>
            <div className="relative overflow-hidden" style={{ height: 110 }}>
              <img src={c.img as string} alt={c.label} className="w-full h-full object-cover" />
              {crop === c.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-lg">
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="px-3 py-2 bg-white">
              <p className="font-bold text-[#2B2B2B] leading-tight" style={{ fontSize: 12.5 }}>{c.label}</p>
              <p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>{c.hi}</p>
            </div>
          </button>
        ))}

        {/* Other Crops tile — tomato/produce photo with + overlay */}
        <button onClick={() => setCrop("other")}
          className="relative rounded-2xl overflow-hidden text-left"
          style={{
            transition: "transform 200ms ease, box-shadow 200ms ease",
            border: crop === "other" ? "2.5px solid #2D6A4F" : "2px solid #E8F0E8",
            boxShadow: crop === "other" ? "0 0 0 3px rgba(45,106,79,0.15), 0 6px 20px rgba(45,106,79,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(45,106,79,0.22)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "";
            (e.currentTarget as HTMLElement).style.boxShadow = crop === "other" ? "0 0 0 3px rgba(45,106,79,0.15), 0 6px 20px rgba(45,106,79,0.18)" : "0 2px 8px rgba(0,0,0,0.06)";
          }}>
          <div className="relative overflow-hidden" style={{ height: 110 }}>
            <img src={tomatoImg} alt="Other crops" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#1B4332]/50 flex items-center justify-center">
              {crop === "other"
                ? <div className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-lg"><Check size={18} color="#fff" strokeWidth={3} /></div>
                : <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><Plus size={18} className="text-[#2D6A4F]" strokeWidth={2.5} /></div>
              }
            </div>
          </div>
          <div className="px-3 py-2 bg-white">
            <p className="font-bold text-[#1B4332]" style={{ fontSize: 12.5 }}>Other Crops</p>
            <p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>Not listed above?</p>
          </div>
        </button>
      </div>

      {/* ── Other Crop inline expansion panel ── */}
      {crop === "other" && (
        <div
          className="mt-4 rounded-2xl border border-[#C3E8CC] bg-[#FAFFFE] p-5"
          style={{ boxShadow: "0 4px 20px rgba(45,106,79,0.10)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
              <Leaf size={15} className="text-[#2D6A4F]" />
            </div>
            <p className="font-bold text-[#1B4332]" style={{ fontSize: 14 }}>Enter your crop details</p>
          </div>

          {/* Crop Name input */}
          <div className="mb-4">
            <label className="block font-semibold text-[#2B2B2B] mb-1.5" style={{ fontSize: 12.5 }}>
              Crop Name <span className="text-red-500">*</span>
            </label>
            <input
              value={otherCropName}
              onChange={e => setOtherCropName(e.target.value)}
              placeholder="e.g. Tomato, Onion, Potato..."
              className="w-full bg-white border-2 border-[#E0EDE3] rounded-xl px-4 py-3 text-[13px] text-[#2B2B2B] placeholder-[#9AB4A0] outline-none focus:border-[#2D6A4F] transition-colors"
            />
          </div>

          {/* Crop Photo row */}
          <div>
            <label className="block font-semibold text-[#2B2B2B] mb-2" style={{ fontSize: 12.5 }}>
              Crop Photo <span className="text-[#9AB4A0] font-normal">(optional)</span>
            </label>
            <div className="flex gap-3">
              {/* Take Photo */}
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-[12.5px] border transition-colors"
                style={{ background: "#EAF5EE", color: "#2D6A4F", border: "1.5px solid #C3E8CC" }}
                onClick={() => {
                  const inp = document.createElement("input");
                  inp.type = "file";
                  inp.accept = "image/*";
                  inp.capture = "environment";
                  inp.onchange = (ev) => {
                    const file = (ev.target as HTMLInputElement).files?.[0];
                    if (file) setOtherPhotoPreview(URL.createObjectURL(file));
                  };
                  inp.click();
                }}
              >
                <Camera size={15} /> Take Photo
              </button>
              {/* Upload Photo */}
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-[12.5px] border-2 border-dashed transition-colors"
                style={{ background: "white", color: "#5a7a6a", borderColor: "#C3E8CC" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} /> Upload Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Preview */}
            {otherPhotoPreview && (
              <div className="mt-3 flex items-center gap-3 bg-[#F0FDF4] border border-[#C3E8CC] rounded-xl px-3 py-2">
                <img src={otherPhotoPreview} alt="Crop preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2D6A4F]" style={{ fontSize: 12 }}>Photo uploaded</p>
                  <p className="text-[#6B6B6B] truncate" style={{ fontSize: 10.5 }}>Tap to change</p>
                </div>
                <button onClick={() => setOtherPhotoPreview(null)} className="text-[#9AB4A0] hover:text-red-400 transition-colors text-[11px] font-medium flex-shrink-0">Remove</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STEP 2 — QUANTITY & QUALITY
══════════════════════════════════════════════════════════════════════ */
function Step2({ selectedCrop, quantity, setQuantity, unit, setUnit, grade, setGrade, moisture, setMoisture, remarks, setRemarks }: {
  selectedCrop: typeof CROPS[0]; quantity: string; setQuantity: (v: string) => void;
  unit: string; setUnit: (v: string) => void; grade: string; setGrade: (v: string) => void;
  moisture: string; setMoisture: (v: string) => void; remarks: string; setRemarks: (v: string) => void;
}) {
  const grades = [
    { id: "A", label: "A - Grade", sub: "Premium Quality", img: "https://images.unsplash.com/photo-1561978248-bffcdd0457ad?w=200&h=120&fit=crop&auto=format", color: "#2D6A4F" },
    { id: "B", label: "B - Grade", sub: "Good Quality",    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=120&fit=crop&auto=format", color: "#B45309" },
    { id: "C", label: "C - Grade", sub: "Standard Quality",img: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=200&h=120&fit=crop&auto=format", color: "#6B6B6B" },
  ];
  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h2 className="font-extrabold text-[#2B2B2B]" style={{ fontSize: 22 }}>Enter Quantity & Quality</h2>
        <p className="text-[#6B6B6B] mt-0.5" style={{ fontSize: 13 }}>Provide details of your produce for accurate pricing.</p>
      </div>

      {/* Selected crop chip */}
      <div className="flex items-center justify-between bg-[#F4F8F4] border border-[#E0EDE3] rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3">
          <img src={selectedCrop.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 14 }}>{selectedCrop.label} / {selectedCrop.hi}</p>
            <p className="text-[#6B6B6B]" style={{ fontSize: 11 }}>Selected Crop</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[#2D6A4F] font-semibold border border-[#C3E8CC] rounded-full px-3.5 py-1.5 bg-[#EAF5EE] text-[12px]">
          <Edit2 size={12} /> Change Crop
        </button>
      </div>

      {/* Quantity row */}
      <div>
        <p className="font-semibold text-[#2B2B2B] mb-2" style={{ fontSize: 13 }}>Total Quantity / कुल मात्रा</p>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white border-2 border-[#E0EDE3] rounded-xl px-4 focus-within:border-[#2D6A4F] transition-colors">
            <input value={quantity} onChange={e => setQuantity(e.target.value)}
              className="flex-1 py-3 text-[15px] font-bold text-[#2B2B2B] outline-none bg-transparent" />
          </div>
          <select value={unit} onChange={e => setUnit(e.target.value)}
            className="bg-white border-2 border-[#E0EDE3] rounded-xl px-4 py-3 text-[13px] font-semibold text-[#2B2B2B] outline-none focus:border-[#2D6A4F]">
            <option>Quintal (Qtl)</option>
            <option>Kilogram (Kg)</option>
          </select>
        </div>
        <p className="text-[#9AB4A0] mt-1.5" style={{ fontSize: 11 }}>1 Quintal (Qtl) = 100 kg</p>
      </div>

      {/* Grade selector */}
      <div>
        <p className="font-semibold text-[#2B2B2B] mb-2" style={{ fontSize: 13 }}>Expected Grade / अनुमानित गुणवत्ता</p>
        <div className="grid grid-cols-3 gap-3">
          {grades.map(g => (
            <button key={g.id} onClick={() => setGrade(g.id)}
              className="relative rounded-2xl overflow-hidden text-left transition-all hover:-translate-y-0.5"
              style={{ border: grade === g.id ? `2.5px solid ${g.color}` : "2px solid #E8F0E8", boxShadow: grade === g.id ? `0 0 0 3px ${g.color}22, 0 4px 14px ${g.color}22` : "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div className="relative" style={{ height: 90 }}>
                <img src={g.img} alt={g.label} className="w-full h-full object-cover" />
                {grade === g.id && <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: g.color }}><Check size={12} color="#fff" strokeWidth={3} /></div>}
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 13 }}>{g.label}</p>
                <p className="text-[#6B6B6B]" style={{ fontSize: 11 }}>{g.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Moisture + Remarks row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-[#2B2B2B] mb-2" style={{ fontSize: 13 }}>Moisture Level / नमी सत्र (वैकल्पिक)</p>
          <div className="flex items-center gap-0 bg-white border-2 border-[#E0EDE3] rounded-xl overflow-hidden focus-within:border-[#2D6A4F] transition-colors">
            <input value={moisture} onChange={e => setMoisture(e.target.value)}
              className="flex-1 px-4 py-3 text-[14px] font-bold text-[#2B2B2B] outline-none bg-transparent" />
            <span className="px-4 text-[13px] font-bold text-[#6B6B6B] bg-[#F4F8F4] self-stretch flex items-center border-l border-[#E0EDE3]">%</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-[#2B2B2B] mb-2" style={{ fontSize: 13 }}>Any Remarks (Optional) / कोई अतिरिक्त जानकारी</p>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
            className="w-full bg-white border-2 border-[#E0EDE3] rounded-xl px-4 py-3 text-[13px] text-[#2B2B2B] outline-none resize-none focus:border-[#2D6A4F] transition-colors"
            rows={2} maxLength={200} placeholder="e.g. Clean grain, properly dried, etc." />
          <p className="text-right text-[10px] text-[#9AB4A0] mt-0.5">{remarks.length}/200</p>
        </div>
      </div>

      {/* Validation hint */}
      <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#D1FAE5] rounded-2xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} className="text-green-600" />
        </div>
        <div>
          <p className="font-bold text-green-700" style={{ fontSize: 13 }}>Looks Good!</p>
          <p className="text-[#4a6a54]" style={{ fontSize: 12 }}>Your quantity and quality details have been recorded.</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <Lightbulb size={13} className="text-amber-500 flex-shrink-0" />
          <p className="text-amber-800" style={{ fontSize: 11 }}><span className="font-bold">Tip:</span> Accurate quality details help you get the best price.</p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STEP 3 — PROCUREMENT CENTRE
══════════════════════════════════════════════════════════════════════ */
function Step3({ centre, setCentre, centres }: {
  centre: string; setCentre: (v: string) => void; centres: typeof CENTRES;
}) {
  const amenityIcon: Record<string, React.ElementType> = {
    "Weighbridge": Weight, "Digital Token": Tag, "Drinking Water": Droplets,
    "Waiting Area": Clock, "Help Desk": Headphones, "Food Facility": Package,
  };
  return (
    <div className="p-6 flex flex-col gap-4">
      <div>
        <h2 className="font-extrabold text-[#2B2B2B]" style={{ fontSize: 22 }}>Choose a Procurement Centre</h2>
        <p className="text-[#6B6B6B] mt-0.5" style={{ fontSize: 13 }}>Select a nearby centre to deliver your produce</p>
      </div>

      {/* Search + Location row */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border-2 border-[#E0EDE3] rounded-xl px-4 py-2.5 focus-within:border-[#2D6A4F] transition-colors">
          <MapPin size={14} className="text-[#9AB4A0]" />
          <input className="flex-1 text-[13px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none bg-transparent" placeholder="Search by district, city or centre name..." />
        </div>
        <button className="flex items-center gap-2 bg-[#EAF5EE] border border-[#C3E8CC] rounded-xl px-4 py-2.5 text-[#2D6A4F] font-bold text-[12px] flex-shrink-0 hover:bg-[#D1FAE5] transition-colors">
          <Navigation size={13} /> Use My Location
        </button>
        <select className="bg-white border-2 border-[#E0EDE3] rounded-xl px-3 py-2.5 text-[12px] font-semibold text-[#2B2B2B] outline-none">
          <option>Sort by: Nearest First</option>
          <option>By Availability</option>
          <option>By Name</option>
        </select>
      </div>

      {/* Centre cards */}
      <div className="flex flex-col gap-3">
        {centres.map((c) => (
          <button key={c.id} onClick={() => setCentre(c.id)}
            className="w-full text-left flex items-center gap-4 rounded-2xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "#fff",
              border: centre === c.id ? "2.5px solid #2D6A4F" : "2px solid #E8F0E8",
              boxShadow: centre === c.id ? "0 0 0 3px rgba(45,106,79,0.12), 0 6px 20px rgba(45,106,79,0.12)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}>
            {/* Photo */}
            <div className="relative flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 110, height: 78 }}>
              <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
              {centre === c.id && (
                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-md">
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 14 }}>{c.name}</p>
                {c.badge && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: "#EAF5EE", color: "#2D6A4F", border: "1px solid #C3E8CC" }}>
                    {c.badge}
                  </span>
                )}
              </div>
              <p className="text-[#6B6B6B] mb-1.5" style={{ fontSize: 12 }}>{c.loc}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#6B6B6B]">
                  <MapPin size={10} className="text-[#2D6A4F]" /> {c.dist}
                </span>
                {c.amenities.map((a, i) => {
                  const Icon = amenityIcon[a] ?? Info;
                  return (
                    <span key={i} className="flex items-center gap-1 text-[10.5px] text-[#6B6B6B]">
                      <Icon size={10} className="text-[#9AB4A0]" /> {a}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Slots + Select */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="rounded-xl px-3 py-1.5 text-center" style={{ background: c.slotBg }}>
                <p className="font-bold text-[11px]" style={{ color: c.slotColor }}>{c.slots}</p>
                <p className="text-[10px] text-[#6B6B6B]">Today, 05 Sep</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold text-[12px] text-white"
                style={{ background: "#2D6A4F", boxShadow: "0 4px 12px #2D6A4F44" }}>
                Select Centre <ArrowRight size={12} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STEP 4 — REVIEW & SUBMIT
══════════════════════════════════════════════════════════════════════ */
function Step4({ selectedCrop, quantity, unit, grade, moisture, selectedCentre, confirmed, setConfirmed, onEdit }: {
  selectedCrop: typeof CROPS[0]; quantity: string; unit: string; grade: string; moisture: string;
  selectedCentre: typeof CENTRES[0]; confirmed: boolean; setConfirmed: (v: boolean) => void;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div>
        <h2 className="font-extrabold text-[#2B2B2B]" style={{ fontSize: 22 }}>Review Your Details</h2>
        <p className="text-[#6B6B6B] mt-0.5" style={{ fontSize: 13 }}>Please check all the information below before submitting. You can go back and edit if needed.</p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Crop */}
        <div className="bg-white border border-[#E8F0E8] rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <img src={selectedCrop.img} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[#6B6B6B] text-[11px]">Crop / फसल</p>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 15 }}>{selectedCrop.label} / {selectedCrop.hi}</p>
          </div>
          <button onClick={() => onEdit(1)} className="flex items-center gap-1 text-[#2D6A4F] font-semibold text-[11px] border border-[#C3E8CC] rounded-full px-2.5 py-1 bg-[#EAF5EE] flex-shrink-0">
            <Edit2 size={10} /> Edit
          </button>
        </div>

        {/* Quantity */}
        <div className="bg-white border border-[#E8F0E8] rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Package size={22} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#6B6B6B] text-[11px]">Quantity / मात्रा</p>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 15 }}>{quantity} {unit === "Quintal (Qtl)" ? "Quintal (Qtl)" : "Kg"}</p>
            <p className="text-[#6B6B6B] text-[11px]">({(parseFloat(quantity) * 100).toFixed(0)} kg)</p>
          </div>
          <button onClick={() => onEdit(2)} className="flex items-center gap-1 text-[#2D6A4F] font-semibold text-[11px] border border-[#C3E8CC] rounded-full px-2.5 py-1 bg-[#EAF5EE] flex-shrink-0">
            <Edit2 size={10} /> Edit
          </button>
        </div>

        {/* Quality */}
        <div className="bg-white border border-[#E8F0E8] rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-[#6B6B6B] text-[11px]">Expected Quality / अपेक्षित गुणवत्ता</p>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 15 }}>
              {grade === "A" ? "A - Grade" : grade === "B" ? "B - Grade" : "C - Grade"}
            </p>
            <p className="text-[#6B6B6B] text-[11px]">{grade === "A" ? "Premium Quality" : grade === "B" ? "Good Quality" : "Standard Quality"}{moisture ? ` • ${moisture}% Moisture` : ""}</p>
          </div>
          <button onClick={() => onEdit(2)} className="flex items-center gap-1 text-[#2D6A4F] font-semibold text-[11px] border border-[#C3E8CC] rounded-full px-2.5 py-1 bg-[#EAF5EE] flex-shrink-0">
            <Edit2 size={10} /> Edit
          </button>
        </div>

        {/* Moisture */}
        <div className="bg-white border border-[#E8F0E8] rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Droplets size={22} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-[#6B6B6B] text-[11px]">Moisture Level / नमी सत्र</p>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 15 }}>{moisture || "—"}%</p>
          </div>
          <button onClick={() => onEdit(2)} className="flex items-center gap-1 text-[#2D6A4F] font-semibold text-[11px] border border-[#C3E8CC] rounded-full px-2.5 py-1 bg-[#EAF5EE] flex-shrink-0">
            <Edit2 size={10} /> Edit
          </button>
        </div>
      </div>

      {/* Procurement centre */}
      <div className="bg-white border border-[#E8F0E8] rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <img src={selectedCentre.img} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[#6B6B6B] text-[11px] mb-0.5">Procurement Centre / क्रय केंद्र</p>
          <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 15 }}>{selectedCentre.name}</p>
          <p className="text-[#6B6B6B] text-[12px]">{selectedCentre.loc}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-[#6B6B6B]"><MapPin size={10} className="text-[#2D6A4F]" />{selectedCentre.dist}</span>
            {selectedCentre.amenities.slice(0, 3).map((a, i) => <span key={i} className="text-[10.5px] text-[#9AB4A0]">• {a}</span>)}
          </div>
        </div>
        <button onClick={() => onEdit(3)} className="flex items-center gap-1 text-[#2D6A4F] font-semibold text-[11px] border border-[#C3E8CC] rounded-full px-2.5 py-1 bg-[#EAF5EE] flex-shrink-0">
          <Edit2 size={10} /> Edit
        </button>
      </div>

      {/* Declaration checkbox */}
      <button onClick={() => setConfirmed(!confirmed)}
        className="flex items-start gap-3 bg-[#F0FDF4] border border-[#D1FAE5] rounded-2xl px-4 py-3.5 text-left transition-all hover:border-[#2D6A4F]">
        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{ background: confirmed ? "#2D6A4F" : "#fff", border: confirmed ? "none" : "2px solid #C3E8CC" }}>
          {confirmed && <Check size={12} color="#fff" strokeWidth={3} />}
        </div>
        <div>
          <p className="font-semibold text-[#2B2B2B]" style={{ fontSize: 13 }}>
            I confirm that the information provided is correct to the best of my knowledge.
          </p>
          <p className="text-[#6B6B6B] mt-0.5" style={{ fontSize: 11 }}>
            मैं पुष्टि करता हूँ कि दी गई जानकारी मेरी जानकारी के अनुसार सही है।
          </p>
        </div>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   RIGHT PANEL COMPONENTS
══════════════════════════════════════════════════════════════════════ */
function WhyPanel({ step }: { step: number }) {
  const benefits = [
    { icon: Tag,         title: "Get fair market price",   sub: "Direct access to government procurement centres" },
    { icon: ShieldCheck, title: "Hassle-free process",     sub: "Simple and transparent" },
    { icon: Zap,         title: "Real-time updates",       sub: "Track your slot, payment and status" },
    { icon: Headphones,  title: "Support at every step",   sub: "We are here to help" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] p-4" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] flex items-center justify-center">
          <Leaf size={15} className="text-[#2D6A4F]" />
        </div>
        <p className="font-bold text-[#1B4332]" style={{ fontSize: 13.5 }}>Why Register Procurement?</p>
      </div>
      {benefits.map((b, i) => (
        <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
          <div className="w-8 h-8 rounded-full bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
            <b.icon size={14} className="text-[#2D6A4F]" />
          </div>
          <div>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12 }}>{b.title}</p>
            <p className="text-[#6B6B6B]" style={{ fontSize: 11 }}>{b.sub}</p>
          </div>
        </div>
      ))}
      {step === 1 && (
        <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <Lightbulb size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800" style={{ fontSize: 11 }}>
            <span className="font-bold">Tip</span><br />Make sure to select the correct crop for accurate pricing and centre availability.
          </p>
        </div>
      )}
    </div>
  );
}

function SelectionSummary({ crop, quantity, unit, grade }: { crop: typeof CROPS[0]; quantity: string; unit: string; grade: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] p-4" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-[#1B4332]" style={{ fontSize: 13 }}>Your Selection</p>
        <button className="flex items-center gap-1 text-[#2D6A4F] text-[11px] font-semibold"><Edit2 size={10} /> Edit</button>
      </div>
      {[
        { icon: <img src={crop.img} alt="" className="w-7 h-7 rounded-lg object-cover" />, label: "Wheat / गेहूं", sub: "Crop" },
        { icon: <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><Package size={14} className="text-amber-600" /></div>, label: `${quantity} Qtl`, sub: "Expected Quantity" },
        { icon: <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center"><ShieldCheck size={14} className="text-green-600" /></div>, label: `${grade} - Grade`, sub: "Expected Quality" },
      ].map((r, i) => (
        <div key={i} className="flex items-center gap-2.5 mb-3 last:mb-0">
          <div className="flex-shrink-0">{r.icon}</div>
          <div><p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12 }}>{r.label}</p><p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>{r.sub}</p></div>
        </div>
      ))}
      <div className="mt-3 bg-[#F0FDF4] rounded-xl p-3">
        <p className="font-bold text-[#1B4332]" style={{ fontSize: 11 }}>Next Step</p>
        <p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>Choose a nearby procurement centre and preferred date & time.</p>
      </div>
      {/* Wheat photo card */}
      <div className="relative mt-3 rounded-2xl overflow-hidden" style={{ height: 100 }}>
        <img src={crop.img} alt="" className="w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(27,67,50,0.6), transparent)" }} />
        <p className="absolute bottom-3 right-3 text-right" style={{ fontFamily: "'Caveat', cursive", fontSize: 16, fontWeight: 700, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
          "Kisan ka vishwas,<br />hamari zimmedari."
        </p>
      </div>
    </div>
  );
}

function SelectionSoFar({ crop, quantity, unit, grade }: { crop: typeof CROPS[0]; quantity: string; unit: string; grade: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] p-4" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-[#1B4332]" style={{ fontSize: 13 }}>Your Selection So Far</p>
        <button className="flex items-center gap-1 text-[#2D6A4F] text-[11px] font-semibold"><Edit2 size={10} /> Edit</button>
      </div>
      {[
        { icon: <img src={crop.img} alt="" className="w-7 h-7 rounded-lg object-cover" />, label: `${crop.label} / ${crop.hi}`, sub: "Crop" },
        { icon: <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center"><Package size={14} className="text-amber-600" /></div>, label: `${quantity} Qtl`, sub: "Quantity" },
        { icon: <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center"><ShieldCheck size={14} className="text-green-600" /></div>, label: `${grade} - Grade`, sub: "Quality" },
      ].map((r, i) => (
        <div key={i} className="flex items-center gap-2.5 mb-3 last:mb-0">
          <div className="flex-shrink-0">{r.icon}</div>
          <div><p className="font-bold text-[#2B2B2B]" style={{ fontSize: 12 }}>{r.label}</p><p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>{r.sub}</p></div>
        </div>
      ))}
    </div>
  );
}

function MapCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      <div className="p-3 border-b border-[#F0F7F3]">
        <p className="font-bold text-[#1B4332]" style={{ fontSize: 12.5 }}>Nearby Centres on Map</p>
      </div>
      <div className="relative" style={{ height: 110 }}>
        <img src="https://images.unsplash.com/photo-1642863742974-7e0e40c8c0c9?w=400&h=220&fit=crop&auto=format" alt="" className="w-full h-full object-cover" style={{ filter: "saturate(0.6) brightness(1.05)" }} />
        <div className="absolute top-3 right-4 bg-white rounded-xl px-2.5 py-1.5 shadow-lg border border-[#E8F0E8]">
          <p className="font-bold text-[#2D6A4F]" style={{ fontSize: 10 }}>Sehore Mandi</p>
          <p className="text-[#6B6B6B]" style={{ fontSize: 9 }}>10 km</p>
        </div>
        <div className="absolute top-6 left-4 w-6 h-6 rounded-full bg-[#2D6A4F] flex items-center justify-center shadow-md">
          <MapPin size={12} color="#fff" />
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[#2D6A4F] font-bold text-[12px] border-t border-[#F0F7F3] hover:bg-[#F0FDF4] transition-colors">
        View Full Map <ArrowRight size={12} />
      </button>
      <div className="p-3 border-t border-[#F0F7F3]">
        <div className="flex items-start gap-2">
          <Headphones size={14} className="text-[#2D6A4F] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#1B4332]" style={{ fontSize: 11 }}>Need help choosing?</p>
            <p className="text-[#6B6B6B]" style={{ fontSize: 10 }}>Our team can help you find the best centre near you.</p>
          </div>
        </div>
        <button className="mt-2 w-full flex items-center justify-center gap-1.5 bg-[#EAF5EE] border border-[#C3E8CC] rounded-xl py-2 text-[#2D6A4F] font-bold text-[11px]">
          <Phone size={11} /> Call Us (1800-180-1551)
        </button>
      </div>
    </div>
  );
}

function AlmostDonePanel() {
  return (
    <div className="relative bg-white rounded-2xl border border-[#E8F0E8] p-4 overflow-hidden" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      {/* Leaf watermarks */}
      <div className="absolute right-2 top-2 pointer-events-none select-none" style={{ opacity: 0.18 }}>
        <Leaf size={60} className="text-[#2D6A4F]" strokeWidth={0.8} />
      </div>
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={18} className="text-[#2D6A4F]" />
        </div>
        <div>
          <p className="font-bold text-[#1B4332]" style={{ fontSize: 13 }}>You're Almost Done!</p>
          <p className="text-[#6B6B6B] mt-1" style={{ fontSize: 11 }}>
            Submit your request and get a confirmation via SMS and in My Requests.
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatNextPanel() {
  const steps = [
    { icon: Phone,       color: "#2D6A4F", bg: "#EAF5EE", title: "1. Request Submitted",    sub: "You will receive a confirmation SMS." },
    { icon: ShieldCheck, color: "#2563EB", bg: "#DBEAFE", title: "2. Verification by Mandi", sub: "Your details will be verified by the centre." },
    { icon: Zap,         color: "#D97706", bg: "#FEF3C7", title: "3. Token Allotment",       sub: "You will get a token with date & time." },
    { icon: Truck,       color: "#7C3AED", bg: "#EDE9FE", title: "4. Bring Your Produce",    sub: "Visit the centre at the scheduled time." },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E8] p-4 flex flex-col gap-3" style={{ boxShadow: "0 4px 16px rgba(45,106,79,0.07)" }}>
      <p className="font-bold text-[#1B4332]" style={{ fontSize: 13 }}>What Happens Next?</p>
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
            <s.icon size={14} style={{ color: s.color }} />
          </div>
          <div>
            <p className="font-bold text-[#2B2B2B]" style={{ fontSize: 11.5 }}>{s.title}</p>
            <p className="text-[#6B6B6B]" style={{ fontSize: 10.5 }}>{s.sub}</p>
          </div>
        </div>
      ))}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 mt-1">
        <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-blue-700" style={{ fontSize: 11 }}>Need to make changes?</p>
          <p className="text-blue-600" style={{ fontSize: 10.5 }}>You can go back to any step using the Previous button.</p>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════════════════════════════════ */
function SuccessScreen({ crop, centre, quantity, unit, grade, onNavigate }: {
  crop: typeof CROPS[0]; centre: typeof CENTRES[0]; quantity: string; unit: string; grade: string;
  onNavigate?: (s: string) => void;
}) {
  const token = `KSN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  return (
    <div className="flex h-screen overflow-hidden bg-[#F0FAF4]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar activeScreen="bookslot" onNavigate={(s) => onNavigate?.(s)} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 24px 64px rgba(45,106,79,0.18)" }}>
          {/* Top green strip */}
          <div className="relative overflow-hidden px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #2D6A4F, #40916C)" }}>
            <img src={crop.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" style={{ filter: "blur(4px)" }} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4" style={{ boxShadow: "0 0 0 8px rgba(255,255,255,0.12)" }}>
                <CheckCircle2 size={40} color="#fff" strokeWidth={2} />
              </div>
              <h2 className="font-extrabold text-white" style={{ fontSize: 22 }}>Registration Successful!</h2>
              <p className="text-white/80 mt-1" style={{ fontSize: 13 }}>आपका पंजीकरण सफलतापूर्वक हो गया है।</p>
            </div>
          </div>

          <div className="px-8 py-6 flex flex-col gap-4">
            {/* Token */}
            <div className="text-center bg-[#F0FDF4] rounded-2xl p-4 border border-[#D1FAE5]">
              <p className="text-[#6B6B6B] text-[11px] font-semibold mb-1">Your Token Number / आपका टोकन नंबर</p>
              <p className="font-extrabold text-[#1B4332]" style={{ fontSize: 28, letterSpacing: "0.08em" }}>{token}</p>
              <p className="text-[#6B6B6B] text-[11px] mt-1">Show this token at the procurement centre</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Crop", value: crop.label },
                { label: "Quantity", value: `${quantity} Qtl` },
                { label: "Grade", value: `${grade} - Grade` },
                { label: "Centre", value: centre.name.split(" (")[0] },
              ].map((r, i) => (
                <div key={i} className="bg-[#F9FAFB] rounded-xl p-3">
                  <p className="text-[#9AB4A0] text-[10px] font-semibold">{r.label}</p>
                  <p className="font-bold text-[#2B2B2B] text-[13px]">{r.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border-2 border-[#2D6A4F] text-[#2D6A4F] font-bold rounded-xl py-3 text-[13px] hover:bg-[#EAF5EE] transition-colors">
                Download Receipt
              </button>
              <button onClick={() => onNavigate?.("dashboard")}
                className="flex-1 flex items-center justify-center gap-2 text-white font-bold rounded-xl py-3 text-[13px] hover:opacity-90 transition-all"
                style={{ background: "#2D6A4F", boxShadow: "0 4px 16px #2D6A4F44" }}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
