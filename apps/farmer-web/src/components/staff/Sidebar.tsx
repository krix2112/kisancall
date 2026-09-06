'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@kisancall/shared-types';

const navItems = [
  { href: '/staff', label: 'Today Overview', icon: '📊' },
  { href: '/staff/arrivals', label: 'Arrivals', icon: '🚛' },
  { href: '/staff/live-queue', label: 'Live Queue', icon: '⏱️' },
  { href: '/staff/procurement-entry', label: 'Procurement Entry', icon: '📝' },
  { href: '/staff/payments', label: 'Payments', icon: '💳' },
  { href: '/staff/call-console', label: 'Call Console', icon: '📞' },
  { href: '/staff/proof-audit', label: 'Proof & Audit', icon: '⛓️' },
  { href: '/staff/admin-console', label: 'Admin Console', icon: '⚙️', adminOnly: true },
];

export function Sidebar({
  role,
}: {
  role: UserRole;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header (Hamburger) */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🌾</span>
          <h1 className="text-lg font-bold text-emerald-400">KisanCall Staff</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
        >
          <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="hidden lg:block">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
              <span className="text-2xl">🌾</span>
              <h1 className="text-xl font-bold text-emerald-400">KisanCall</h1>
            </Link>
            <p className="text-xs text-slate-400 mt-1">Mandi Staff &amp; Operator Console</p>
          </div>

          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
              Current Role
            </span>
            <div className="w-full bg-slate-900 text-white text-xs font-semibold rounded p-1.5 border border-slate-600 capitalize">
              {role}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.adminOnly && (
                    <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Login & Home Redirect */}
        <div className="border-t border-slate-800 pt-4 space-y-2 mt-4 lg:mt-0">
          <Link
            href="/staff/login"
            className="block text-center w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
          >
            🔐 Switch Role / Login
          </Link>
          <Link
            href="/"
            className="block text-center w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-xs font-medium transition-colors"
          >
            ← National Homepage
          </Link>
        </div>
      </aside>
    </>
  );
}
