'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@kisancall/shared-types';

const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin-console': ['admin'],
  '/': ['operator', 'supervisor', 'admin'],
  '/arrivals': ['operator', 'supervisor', 'admin'],
  '/live-queue': ['operator', 'supervisor', 'admin'],
  '/procurement-entry': ['operator', 'supervisor', 'admin'],
  '/payments': ['operator', 'supervisor', 'admin'],
  '/call-console': ['operator', 'supervisor', 'admin'],
  '/proof-audit': ['operator', 'supervisor', 'admin'],
};

const navItems = [
  { href: '/', label: 'Today Overview', icon: '📊' },
  { href: '/arrivals', label: 'Arrivals', icon: '🚛' },
  { href: '/live-queue', label: 'Live Queue', icon: '⏱️' },
  { href: '/procurement-entry', label: 'Procurement Entry', icon: '📝' },
  { href: '/payments', label: 'Payments', icon: '💳' },
  { href: '/call-console', label: 'Call Console', icon: '📞' },
  { href: '/proof-audit', label: 'Proof & Audit', icon: '⛓️' },
  { href: '/admin-console', label: 'Admin Console', icon: '⚙️', adminOnly: true },
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
          <h1 className="text-lg font-bold text-emerald-400">KisanCall</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌾</span>
              <h1 className="text-xl font-bold text-emerald-400">KisanCall</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Staff Coordination Console</p>
          </div>

          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
              Current Role
            </span>
            <div className="w-full bg-slate-900 text-white text-xs font-semibold rounded p-1.5 border border-slate-600">
              {role.charAt(0).toUpperCase() + role.slice(1)}
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

        {/* Sidebar Footer / Login Redirect */}
        <div className="border-t border-slate-800 pt-4 space-y-2 mt-4 lg:mt-0">
          <Link
            href="/login"
            className="block text-center w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
          >
            🔐 Staff Login / Change User
          </Link>
        </div>
      </aside>
    </>
  );
}
