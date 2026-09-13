'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

function FarmerBottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams?.get('action');

  const navItems = [
    {
      href: '/farmer',
      id: 'home',
      label: 'Home',
      hindi: 'होम',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/farmer?action=book',
      id: 'book',
      label: 'Book Slot',
      hindi: 'स्लॉट',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/farmer#queue-status',
      id: 'queue',
      label: 'Queue',
      hindi: 'कतार',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      href: '/farmer/prices',
      id: 'prices',
      label: 'Prices',
      hindi: 'भाव',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 4h5m-5-8h6a4 4 0 010 8H9m0 0l6 8" />
        </svg>
      ),
    },
    {
      href: '/farmer/payments',
      id: 'payments',
      label: 'Payments',
      hindi: 'भुगतान',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  const getIsActive = (item: typeof navItems[0]) => {
    if (item.id === 'book') {
      return action === 'book';
    }
    if (item.id === 'home') {
      return pathname === '/farmer' && !action;
    }
    if (item.id === 'prices') {
      return pathname?.startsWith('/farmer/prices') || pathname?.startsWith('/dashboard/mandi-prices');
    }
    if (item.id === 'payments') {
      return pathname?.startsWith('/farmer/payments') || pathname?.startsWith('/dashboard/payment');
    }
    return false;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (item.id === 'queue') {
      if (pathname === '/farmer') {
        e.preventDefault();
        const el = document.getElementById('queue-status');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-[#acf4a4]');
          setTimeout(() => el.classList.remove('ring-4', 'ring-[#acf4a4]'), 1800);
        }
      }
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 z-40 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-0.5">
        {navItems.map((item) => {
          const active = getIsActive(item);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none active:scale-95 ${
                active
                  ? 'text-[#00450d] font-extrabold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mb-0.5 transition-colors ${
                  active ? 'bg-[#00450d]/15 text-[#00450d]' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] font-semibold tracking-tight leading-none text-center">
                {item.label}
              </span>
              <span className="text-[9px] font-hindi text-stone-600 tracking-tight leading-tight mt-0.5">
                {item.hindi}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function FarmerBottomNav() {
  return (
    <Suspense fallback={null}>
      <FarmerBottomNavInner />
    </Suspense>
  );
}
