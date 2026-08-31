'use client';

import React, { useState } from 'react';

interface CallRecord {
  id: string;
  callSid: string;
  phone: string;
  farmerName: string;
  intent: string;
  duration: string;
  outcome: string;
  status: 'Completed' | 'Failed' | 'Escalated';
  timestamp: string;
}

const INITIAL_CALLS: CallRecord[] = [
  { id: '1', callSid: 'CA88192031', phone: '+91 98765 43210', farmerName: 'Ramesh Kumar', intent: 'Queue Check', duration: '1m 14s', outcome: 'Answered in Hindi (Queue pos #4)', status: 'Completed', timestamp: '31 Aug 09:30 AM' },
  { id: '2', callSid: 'CA88192032', phone: '+91 98765 43211', farmerName: 'Suresh Verma', intent: 'Slot Reminder', duration: '0m 00s', outcome: 'Unanswered / Busy', status: 'Failed', timestamp: '31 Aug 08:45 AM' },
  { id: '3', callSid: 'CA88192033', phone: '+91 98765 43212', farmerName: 'Baldev Singh', intent: 'Price Query', duration: '2m 05s', outcome: 'Provided Wheat MSP ₹2,275', status: 'Completed', timestamp: '30 Aug 04:15 PM' },
];

export default function CallConsolePage() {
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [toast, setToast] = useState<string | null>(null);

  const handleRetryCall = (id: string, phone: string) => {
    // TODO: Wire to POST /voice/outbound backend endpoint
    setToast(`📞 Triggered outbound AI voice call retry to ${phone}...`);
    setCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Completed', outcome: 'Retried via Voice AI' } : c))
    );
  };

  const handleEscalateVisit = (id: string, name: string) => {
    setToast(`🚩 Escalated ${name} to Mandi Field Staff physical visit list!`);
    setCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Escalated', outcome: 'Staff Visit Assigned' } : c))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Voice AI Call Telephony Console</h1>
        <p className="text-xs text-slate-500">Monitor automated inbound & outbound voice calls with fallback actions</p>
      </div>

      {toast && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-900 flex justify-between items-center">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-sky-700 hover:text-sky-950 font-bold">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Call SID</th>
                <th className="py-3 px-4">Farmer</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Intent</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">AI Outcome</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fallback Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {calls.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-600">{item.callSid}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.farmerName}</td>
                  <td className="py-3 px-4">{item.phone}</td>
                  <td className="py-3 px-4">{item.intent}</td>
                  <td className="py-3 px-4">{item.duration}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.outcome}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleRetryCall(item.id, item.phone)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors"
                    >
                      🔄 Retry Call
                    </button>
                    <button
                      onClick={() => handleEscalateVisit(item.id, item.farmerName)}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-sm transition-colors"
                    >
                      🚩 Escalate to Visit
                    </button>
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
