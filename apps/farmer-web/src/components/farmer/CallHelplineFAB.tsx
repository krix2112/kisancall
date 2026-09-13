'use client';

import React from 'react';

export default function CallHelplineFAB() {
  return (
    <div className="fixed z-40 right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 md:right-6">
      <a
        href="tel:18001801551"
        className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-[#00450d] hover:bg-[#14532d] active:scale-95 text-white rounded-full shadow-[0_4px_20px_rgba(0,69,13,0.35)] border border-[#acf4a4]/40 transition-all cursor-pointer min-h-[44px]"
        aria-label="Call KisanCall Toll-Free Helpline 1800-180-1551"
        title="KisanCall निःशुल्क हेल्पलाइन (1800-180-1551)"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#acf4a4] text-[#00450d] flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#acf4a4] opacity-50"></span>
          <svg
            className="w-4 h-4 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] font-extrabold text-[#acf4a4] leading-tight uppercase tracking-wider">
            हेल्पलाइन कॉल
          </span>
          <span className="text-xs font-mono font-bold tracking-tight text-white leading-none">
            1800-180-1551
          </span>
        </div>
      </a>
    </div>
  );
}
