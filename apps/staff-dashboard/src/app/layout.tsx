'use client';

import './globals.css';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@kisancall/shared-types';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';

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
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkRole = async () => {
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        if (pathname !== '/unauthorized') {
          router.push('/login');
        }
        setLoading(false);
        return;
      }

      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('auth_user_id', user.id)
        .single();

      if (error || !roleData?.role) {
        setRole(null);
        if (pathname !== '/unauthorized') {
          router.push('/unauthorized');
        }
      } else {
        setRole(roleData.role as UserRole);
        const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
        if (!allowedRoles.includes(roleData.role as UserRole)) {
          router.push('/unauthorized');
        }
      }
      setLoading(false);
    };

    checkRole();
  }, [pathname, router]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('staff_user_role', newRole);
    const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
    if (!allowedRoles.includes(newRole)) {
      router.push('/unauthorized');
    }
  };

  const isPublicPage = pathname === '/login' || pathname === '/unauthorized';

  if (!mounted || loading) {
    return (
      <html lang="en">
        <head><title>KisanCall - Staff Dashboard</title></head>
        <body className="bg-slate-100 flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </body>
      </html>
    );
  }

  // Blocking view for missing roles
  if (!isPublicPage && !role) {
    return (
      <html lang="en">
        <head><title>KisanCall - No Role</title></head>
        <body className="bg-slate-100 flex items-center justify-center min-h-screen text-slate-900">
          <div className="bg-white p-8 rounded-xl shadow text-center space-y-4 max-w-sm">
            <h1 className="text-xl font-bold text-rose-600">No Role Assigned</h1>
            <p className="text-sm text-slate-600">Your account does not have a staff role assigned. Please contact the administrator.</p>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="px-4 py-2 bg-slate-900 text-white rounded font-medium text-sm w-full">
              Sign Out
            </button>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>KisanCall - Staff Dashboard</title>
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased min-h-screen">
        {isPublicPage ? (
          <main className="min-h-screen">{children}</main>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar Navigation */}
            {role && <Sidebar role={role} />}

            {/* Main Content View */}
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
