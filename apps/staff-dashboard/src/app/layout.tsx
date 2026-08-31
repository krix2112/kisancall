'use client';

import './globals.css';
import { ReactNode, useEffect, useState } from 'react';
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

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('operator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = (localStorage.getItem('staff_user_role') as UserRole) || 'operator';
    setRole(savedRole);

    // Route Guard check
    if (pathname !== '/login' && pathname !== '/unauthorized') {
      const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
      if (!allowedRoles.includes(savedRole)) {
        router.push('/unauthorized');
      }
    }
  }, [pathname, router]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('staff_user_role', newRole);
    const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
    if (!allowedRoles.includes(newRole)) {
      router.push('/unauthorized');
    }
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

  const isPublicPage = pathname === '/login' || pathname === '/unauthorized';

  return (
    <html lang="en">
      <head>
        <title>KisanCall - Staff Dashboard</title>
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased min-h-screen">
        {isPublicPage ? (
          <main className="min-h-screen">{children}</main>
        ) : (
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between flex-shrink-0">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🌾</span>
                    <h1 className="text-xl font-bold text-emerald-400">KisanCall</h1>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Staff Coordination Console</p>
                </div>

                {/* Role Switcher for Testing */}
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Current Role
                  </span>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full bg-slate-900 text-white text-xs font-semibold rounded p-1.5 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    <option value="operator">Operator</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
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
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block text-center w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                >
                  🔐 Staff Login / Change User
                </Link>
              </div>
            </aside>

            {/* Main Content View */}
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
