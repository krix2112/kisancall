'use client';

import React, { useState } from 'react';

interface PaymentRecord {
  id: string;
  procurementId: string;
  farmerName: string;
  phone: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Paid';
  reference: string;
  updatedAt: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: '1', procurementId: 'PROC-8821', farmerName: 'Ramesh Kumar', phone: '+91 98765 43210', amount: 45500, status: 'Paid', reference: 'PAY-884920-IND', updatedAt: '31 Aug 02:30 PM' },
  { id: '2', procurementId: 'PROC-8822', farmerName: 'Harpreet Kaur', phone: '+91 98765 43213', amount: 34125, status: 'Processing', reference: 'PFMS-PENDING-99', updatedAt: '31 Aug 11:45 AM' },
  { id: '3', procurementId: 'PROC-8823', farmerName: 'Jagdish Chand', phone: '+91 98765 43214', amount: 113750, status: 'Pending', reference: '--', updatedAt: '31 Aug 09:15 AM' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Processing' | 'Paid'>('All');

  const filteredPayments = filter === 'All' ? payments : payments.filter((p) => p.status === filter);

  const handleUpdateStatus = (id: string, newStatus: 'Processing' | 'Paid') => {
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
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
                        onClick={() => handleUpdateStatus(item.id, 'Processing')}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                      >
                        Initiate PFMS
                      </button>
                    )}
                    {item.status !== 'Paid' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Paid')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                    {item.status === 'Paid' && (
                      <span className="text-emerald-700 text-xs font-semibold">✓ Disbursed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
