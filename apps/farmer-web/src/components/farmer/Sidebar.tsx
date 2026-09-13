'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, FileText, BarChart2, CreditCard, BookOpen,
  Phone, User, Leaf, CalendarDays, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ─── Nav definition ─── */
const NAV_ITEMS = [
  { id: "/dashboard", icon: Home,        label: "Home"            },
  { id: "/dashboard/requests",  icon: FileText,    label: "My Requests"     },
  { id: "/dashboard/mandi-prices",     icon: BarChart2,   label: "Mandi Prices"    },
  { id: "/dashboard/book-slot",  icon: CalendarDays,label: "Register Procurement" },
  { id: "/dashboard/payment",   icon: CreditCard,  label: "Payment"         },
  { id: "/dashboard/records",   icon: BookOpen,    label: "Slips / Records" },
  { id: "/dashboard/calls",     icon: Phone,       label: "Calls"           },
  { id: "/dashboard/profile",   icon: User,        label: "Profile"         },
];

/* ─── Collapsed icon-rail ─── */
function CollapsedRail({
  activeScreen,
  onExpand,
}: {
  activeScreen: string;
  onExpand: () => void;
}) {
  return (
    <aside
      className="flex-shrink-0 flex flex-col items-center py-4 gap-1 z-10"
      style={{ width: 64, background: "#f0f9f2", borderRight: "1px solid #dceee0", height: "100vh" }}
    >
      <button
        onClick={onExpand}
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors"
        style={{ background: "#fff", border: "1px solid #C3E8CC" }}
      >
        <ChevronRight size={15} className="text-[#2D6A4F]" />
      </button>
      {NAV_ITEMS.map((item) => (
        <Link
          href={item.id}
          key={item.id}
          title={item.label}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: activeScreen === item.id ? "#EAF5EE" : "transparent",
            color: activeScreen === item.id ? "#2D6A4F" : "#7a9a88",
          }}
        >
          <item.icon
            size={18}
            strokeWidth={activeScreen === item.id ? 2.5 : 1.8}
          />
        </Link>
      ))}
    </aside>
  );
}

/* ─── Main expanded sidebar ─── */
export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Consider /dashboard as the base route. If pathname is exactly /dashboard or starts with it.
  const activeScreen = pathname === '/' ? '/dashboard' : pathname;

  if (collapsed) {
    return (
      <CollapsedRail
        activeScreen={activeScreen}
        onExpand={() => setCollapsed(false)}
      />
    );
  }

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-screen z-10 overflow-y-auto"
      style={{
        width: 268,
        minWidth: 268,
        background: "#f0f9f2",
        borderRight: "1px solid #dceee0",
        boxShadow: "2px 0 16px 0 rgba(45,106,79,0.06)",
      }}
    >
      {/* ── 1. Header ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0" style={{ width: 44, height: 44 }}>
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
              <rect width="44" height="44" rx="12" fill="#2D6A4F" />
              <path d="M22 8C22 8 10 14 10 24C10 30.627 15.373 36 22 36C28.627 36 34 30.627 34 24C34 14 22 8 22 8Z" fill="white" opacity="0.95"/>
              <path d="M22 8L22 30" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 18C22 18 17 16 14 20" stroke="#2D6A4F" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              <path d="M22 23C22 23 27 21 30 25" stroke="#2D6A4F" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <p className="font-extrabold leading-tight" style={{ fontSize: 18, color: "#1B4332", fontFamily: "'Poppins', sans-serif" }}>
              KisanCall
            </p>
            <p className="font-medium leading-tight" style={{ fontSize: 10, color: "#7a9a88" }}>
              Your Farm. Our Support.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
          style={{ width: 34, height: 34, background: "#fff", border: "1px solid #C3E8CC" }}
        >
          <ChevronLeft size={15} className="text-[#2D6A4F]" />
          <ChevronLeft size={15} className="text-[#2D6A4F] -ml-2" />
        </button>
      </div>

      {/* ── 2. Tagline ── */}
      <div className="relative px-5 pb-6 flex-shrink-0" style={{ overflow: "visible" }}>
        <div className="absolute pointer-events-none select-none" style={{ right: -6, top: -18, opacity: 0.22 }}>
          <svg viewBox="0 0 90 110" style={{ width: 90, height: 110 }} fill="none">
            <path d="M70,5 Q85,20 78,42 Q72,62 55,70 Q40,78 28,68" stroke="#2D6A4F" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <ellipse cx="78" cy="42" rx="14" ry="22" fill="#2D6A4F" transform="rotate(-30 78 42)" opacity="0.7"/>
            <ellipse cx="55" cy="70" rx="12" ry="18" fill="#2D6A4F" transform="rotate(15 55 70)" opacity="0.6"/>
            <ellipse cx="30" cy="55" rx="10" ry="16" fill="#2D6A4F" transform="rotate(-45 30 55)" opacity="0.5"/>
          </svg>
        </div>
        <div className="absolute pointer-events-none select-none" style={{ right: 18, top: 28, opacity: 0.14 }}>
          <svg viewBox="0 0 55 70" style={{ width: 55, height: 70 }} fill="none">
            <path d="M42,4 Q52,16 48,34 Q44,50 30,56" stroke="#2D6A4F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="47" cy="32" rx="10" ry="16" fill="#2D6A4F" transform="rotate(-25 47 32)" opacity="0.75"/>
            <ellipse cx="30" cy="52" rx="9" ry="13" fill="#2D6A4F" transform="rotate(10 30 52)" opacity="0.6"/>
          </svg>
        </div>

        <p
          className="relative z-10 leading-snug"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 24,
            fontWeight: 700,
            color: "#1B4332",
          }}
        >
          Sahi Jaankari,<br />Behtar Fasal.
        </p>
        <div
          className="relative z-10 mt-1.5 rounded-full"
          style={{ width: 118, height: 2.5, background: "linear-gradient(to right, #2D6A4F, #74C69D, transparent)" }}
        />
      </div>

      {/* ── 3. Nav list ── */}
      <nav className="flex-shrink-0 px-3 mb-3">
        {NAV_ITEMS.map((item) => {
          const active = activeScreen === item.id;
          return (
            <Link
              href={item.id}
              key={item.id}
              className="w-full flex items-center gap-4 px-4 py-[14px] rounded-xl mb-0.5 text-left transition-all"
              style={{
                background: active ? "#EAF5EE" : "transparent",
                borderLeft: active ? "3.5px solid #2D6A4F" : "3.5px solid transparent",
                color: active ? "#1B4332" : "#5a7a6a",
                fontWeight: active ? 700 : 500,
              }}
            >
              <item.icon
                size={21}
                strokeWidth={active ? 2.2 : 1.7}
                style={{ color: active ? "#2D6A4F" : "#7a9a88", flexShrink: 0 }}
              />
              <span style={{ fontSize: 14.5 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── 4. Farmer photo card ── */}
      <div
        className="mx-3 mb-3 rounded-2xl overflow-hidden flex-shrink-0 relative"
        style={{ height: 178, boxShadow: "0 4px 16px rgba(45,106,79,0.14)" }}
      >
        <img
          src="/imports/image-1.png"
          alt="Farmer with arms crossed in green field"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "82% top",
            filter: "brightness(1.18) blur(0.6px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(27,67,50,0.58) 0%, rgba(27,67,50,0.22) 48%, transparent 68%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0" style={{ background: "linear-gradient(to top, rgba(12,40,24,0.88) 0%, rgba(12,40,24,0.55) 55%, transparent 100%)", height: "65%" }} />
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3" style={{ maxWidth: 155 }}>
          <p
            className="font-extrabold text-white leading-snug"
            style={{ fontSize: 12.5, textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
          >
            Empowering Farmers,<br />Building a Stronger Tomorrow
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Leaf size={11} style={{ color: "#74C69D" }} />
            <span style={{ fontSize: 9.5, fontWeight: 600, color: "#B7E4C7" }}>KisanCall</span>
          </div>
        </div>
      </div>

      {/* ── 5. Call Us card ── */}
      <div
        className="mx-3 mb-4 rounded-2xl flex-shrink-0 overflow-hidden relative"
        style={{
          border: "1px solid #C3E8CC",
          boxShadow: "0 4px 14px rgba(45,106,79,0.12)",
          minHeight: 120,
        }}
      >
        <img
          src="/imports/image-13.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "right center" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(230,246,234,0.96) 0%, rgba(230,246,234,0.88) 55%, rgba(230,246,234,0.3) 80%, transparent 100%)",
          }}
        />
        <div className="relative z-10 px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-full"
              style={{
                width: 46,
                height: 46,
                background: "#2D6A4F",
                boxShadow: "0 4px 14px rgba(45,106,79,0.50)",
              }}
            >
              <Phone size={20} color="#fff" strokeWidth={2} />
            </div>
            <div className="flex flex-col justify-center" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10.5, color: "#5a7a6a", fontWeight: 500, lineHeight: 1.2 }}>
                Need Help?
              </p>
              <p style={{ fontSize: 21, fontWeight: 800, color: "#1B4332", lineHeight: 1.1 }}>
                Call Us
              </p>
            </div>
            <button
              className="flex items-center justify-center rounded-full flex-shrink-0 ml-auto"
              style={{
                width: 34,
                height: 34,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(45,106,79,0.18)",
              }}
            >
              <ChevronRight size={16} className="text-[#2D6A4F]" strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-2" style={{ fontSize: 10, color: "#5a7a6a", fontWeight: 500 }}>
            Toll-Free • 24x7 • Multilingual
          </p>
        </div>
      </div>
    </aside>
  );
}
