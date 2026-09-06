'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@kisancall/shared-types';
import { Sidebar } from '@/components/staff/Sidebar';
import { supabase } from '@/lib/supabase';

const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  '/staff/admin-console': ['admin'],
  '/staff': ['operator', 'supervisor', 'admin'],
  '/staff/arrivals': ['operator', 'supervisor', 'admin'],
  '/staff/live-queue': ['operator', 'supervisor', 'admin'],
  '/staff/procurement-entry': ['operator', 'supervisor', 'admin'],
  '/staff/payments': ['operator', 'supervisor', 'admin'],
  '/staff/call-console': ['operator', 'supervisor', 'admin'],
  '/staff/proof-audit': ['operator', 'supervisor', 'admin'],
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkRole = async () => {
      if (pathname === '/staff/login') {
        setLoading(false);
        return;
      }

      // Check local staff session (dev mode / stored role)
      const localRole = typeof window !== 'undefined' ? (localStorage.getItem('staff_user_role') as UserRole | null) : null;
      if (localRole) {
        setRole(localRole);
        const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
        if (!allowedRoles.includes(localRole) && pathname !== '/staff/unauthorized') {
          router.push('/staff/unauthorized');
        }
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        if (pathname !== '/staff/unauthorized') {
          router.push('/staff/login');
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
        if (pathname !== '/staff/unauthorized') {
          router.push('/staff/unauthorized');
        }
      } else {
        setRole(roleData.role as UserRole);
        const allowedRoles = ROLE_PERMISSIONS[pathname] || ['operator', 'supervisor', 'admin'];
        if (!allowedRoles.includes(roleData.role as UserRole)) {
          router.push('/staff/unauthorized');
        }
      }
      setLoading(false);
    };

    checkRole();
  }, [pathname, router]);

  const isPublicPage = pathname === '/staff/login' || pathname === '/staff/unauthorized';

  if (!mounted || loading) {
    return (
      <div className="bg-slate-100 flex items-center justify-center min-h-screen">
        <p className="text-xs text-slate-500 animate-pulse">Loading staff environment...</p>
      </div>
    );
  }

  // Blocking view for missing roles
  if (!isPublicPage && !role) {
    return (
      <div className="bg-slate-100 flex items-center justify-center min-h-screen text-slate-900 p-4">
        <div className="bg-white p-8 rounded-xl shadow text-center space-y-4 max-w-sm">
          <h1 className="text-xl font-bold text-rose-600">No Role Assigned</h1>
          <p className="text-sm text-slate-600">Your account does not have a staff role assigned. Please sign in as an operator, supervisor, or admin.</p>
          <Link href="/staff/login" className="block px-4 py-2 bg-slate-900 text-white rounded font-medium text-sm w-full">
            Go to Staff Login
          </Link>
        </div>
      </div>
    );
  }

  if (isPublicPage) {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 text-slate-900">
      {role && <Sidebar role={role} />}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
