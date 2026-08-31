import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'KisanCall - Staff Dashboard',
  description: 'Mandi Procurement & Staff Management Console',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Role-based layout guard placeholder
  const mockUserRole = 'operator'; // supervisor, admin, operator

  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased min-h-screen flex">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-slate-900 text-white p-6 space-y-6 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">KisanCall</h2>
            <p className="text-xs text-slate-400">Staff Console ({mockUserRole})</p>
          </div>
          <nav className="space-y-2 text-sm">
            <Link href="/" className="block py-2 px-3 rounded hover:bg-slate-800">Today Overview</Link>
            <Link href="/arrivals" className="block py-2 px-3 rounded hover:bg-slate-800">Arrivals</Link>
            <Link href="/live-queue" className="block py-2 px-3 rounded hover:bg-slate-800">Live Queue</Link>
            <Link href="/procurement-entry" className="block py-2 px-3 rounded hover:bg-slate-800">Procurement Entry</Link>
            <Link href="/payments" className="block py-2 px-3 rounded hover:bg-slate-800">Payments</Link>
            <Link href="/call-console" className="block py-2 px-3 rounded hover:bg-slate-800">Call Console</Link>
            <Link href="/proof-audit" className="block py-2 px-3 rounded hover:bg-slate-800">Proof & Audit</Link>
            <Link href="/admin-console" className="block py-2 px-3 rounded hover:bg-slate-800">Admin Console</Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
