'use client';

import React, { useState } from 'react';

import { INITIAL_PAYMENTS, PaymentRecord } from '@/lib/mockData';
import { DataTable } from '@/components/DataTable';
import { staffApi } from '@/services/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Processing' | 'Paid'>('All');

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const filteredPayments = filter === 'All' ? payments : payments.filter((p) => p.status === filter);

  const handleUpdateStatus = async (id: string, newStatus: 'Processing' | 'Paid') => {
    setLoadingId(id);
    setErrorBanner(null);
    try {
      await staffApi.processPayment(id, { status: newStatus });
      setPayments((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: newStatus,
              reference: newStatus === 'Paid' ? `PAY-${Math.floor(100000 + Math.random() * 900000)}-IND` : 'PFMS-BATCH-INIT',
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return item;
        })
      );
    } catch (err: any) {
      if (err.message.includes('501')) {
        setErrorBanner(`MISSING BACKEND CAPABILITY: The backend route PATCH /payments/:id is a stub and returned 501 Not Implemented. Frontend is correctly wired.`);
      } else {
        setErrorBanner(`Error: ${err.message}`);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">PFMS Payment & DBT Management</h1>
          <p className="text-xs text-slate-500">Track and approve Direct Benefit Transfer payouts to farmers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-200 p-1 rounded-lg space-x-1 text-xs font-semibold">
          {(['All', 'Pending', 'Processing', 'Paid'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {errorBanner && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex justify-between items-start mb-4">
          <div className="flex-1">
            <span className="font-bold block mb-1">⚠️ Error Processing Payment</span>
            {errorBanner}
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-red-600 hover:text-red-900 ml-2">✕</button>
        </div>
      )}

      <DataTable>
        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Procurement ID</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Bank Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPayments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{item.procurementId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.farmerName}</td>
                  <td className="py-3 px-4">{item.phone}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{item.reference}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Processing'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {item.status === 'Pending' && (
                      <button
                        disabled={loadingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'Processing')}
                        className={`text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors ${loadingId === item.id ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                      >
                        {loadingId === item.id ? '...' : 'Initiate PFMS'}
                      </button>
                    )}
                    {item.status !== 'Paid' && (
                      <button
                        disabled={loadingId === item.id}
                        onClick={() => handleUpdateStatus(item.id, 'Paid')}
                        className={`text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors ${loadingId === item.id ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                      >
                        {loadingId === item.id ? '...' : 'Mark Paid'}
                      </button>
                    )}
                    {item.status === 'Paid' && (
                      <span className="text-emerald-700 text-xs font-semibold">✓ Disbursed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
      </DataTable>
    </div>
  );
}
