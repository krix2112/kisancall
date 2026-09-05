import React, { ReactNode } from 'react';

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-0 md:p-6 space-y-4">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs text-slate-700 whitespace-nowrap min-w-full">
          {children}
        </table>
      </div>
    </div>
  );
}
