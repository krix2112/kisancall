'use client';

import { useState } from 'react';
import { Search, ChevronDown, Bell } from 'lucide-react';

export default function TopBar() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="flex items-center gap-4 px-6 py-3 bg-[#FDFBF5] border-b border-[#E8F0E8] z-10 flex-shrink-0">
      <div className="flex-1 flex items-center gap-3 bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-4 py-2.5">
        <Search size={15} className="text-[#9AB4A0]" />
        <input
          className="bg-transparent text-[13px] text-[#6B6B6B] placeholder-[#9AB4A0] outline-none w-full"
          placeholder="Search for mandis, services, or help..."
        />
      </div>
      <button className="flex items-center gap-1 text-[13px] font-semibold text-[#2B2B2B] bg-[#F4F8F4] border border-[#E0EDE3] rounded-full px-3.5 py-2 hover:bg-[#EAF5EE] transition-colors">
        EN <ChevronDown size={13} />
      </button>
      <button
        className="relative w-9 h-9 rounded-full bg-[#F4F8F4] border border-[#E0EDE3] flex items-center justify-center hover:bg-[#EAF5EE] transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Bell size={16} className="text-[#2B2B2B]" />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#FDFBF5] text-[7px] text-white flex items-center justify-center font-bold">3</span>
        {showTooltip && (
          <div className="absolute top-11 right-0 bg-white rounded-2xl shadow-2xl border border-[#E8F0E8] p-3 w-56 text-left z-20">
            <p className="text-[11px] font-bold text-[#2D6A4F] mb-2">3 Notifications</p>
            {["Queue update: Turn #12", "Payment pending review", "New mandi rates available"].map((n, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-[#F0F0F0] last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] flex-shrink-0" />
                <p className="text-[11px] text-[#6B6B6B]">{n}</p>
              </div>
            ))}
          </div>
        )}
      </button>
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-9 h-9 rounded-full bg-[#2D6A4F] flex items-center justify-center text-white text-[12px] font-bold shadow-md group-hover:shadow-[0_0_16px_#2D6A4F66] transition-shadow">
          RK
        </div>
        <div className="hidden md:block">
          <p className="text-[12px] font-bold text-[#2B2B2B] leading-tight">Ramesh Kumar</p>
          <p className="text-[10px] text-[#6B6B6B]">Farmer</p>
        </div>
        <ChevronDown size={13} className="text-[#6B6B6B]" />
      </div>
    </header>
  );
}
