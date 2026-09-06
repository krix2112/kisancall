import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="max-w-xl mx-auto my-12 bg-white rounded-xl border border-rose-200 shadow-sm p-8 text-center space-y-6">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
        🚫
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">403 - Access Denied</h1>
        <p className="text-sm text-slate-600">
          You do not have the required role permissions to view this page.
        </p>
      </div>

      <div className="bg-slate-50 border p-4 rounded-lg text-xs text-slate-600 text-left space-y-1">
        <p><span className="font-semibold text-slate-800">Permission Requirement:</span> Admin role required for Admin Console</p>
        <p><span className="font-semibold text-slate-800">Allowed Roles for Standard Pages:</span> Operator, Supervisor, Admin</p>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <Link
          href="/staff"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Return to Overview
        </Link>
        <Link
          href="/staff/login"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors border cursor-pointer"
        >
          Switch Role / Re-login
        </Link>
      </div>
    </div>
  );
}
