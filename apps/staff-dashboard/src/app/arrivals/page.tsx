'use client';

import React, { useState } from 'react';

interface ArrivalRecord {
  id: string;
  token: string;
  name: string;
  phone: string;
  slot: string;
  crop: string;
  expectedQty: string;
  arrived: boolean;
  arrivalTime?: string;
}

const INITIAL_ARRIVALS: ArrivalRecord[] = [
  { id: '1', token: '#KC-8849', name: 'Ramesh Kumar', phone: '+91 98765 43210', slot: '09:00 AM - 12:00 PM', crop: 'Wheat', expectedQty: '20 Qtl', arrived: true, arrivalTime: '08:52 AM' },
  { id: '2', token: '#KC-8850', name: 'Suresh Verma', phone: '+91 98765 43211', slot: '09:00 AM - 12:00 PM', crop: 'Paddy', expectedQty: '35 Qtl', arrived: false },
  { id: '3', token: '#KC-8851', name: 'Baldev Singh', phone: '+91 98765 43212', slot: '12:00 PM - 03:00 PM', crop: 'Wheat', expectedQty: '50 Qtl', arrived: false },
  { id: '4', token: '#KC-8854', name: 'Gurmeet Singh', phone: '+91 98765 43215', slot: '09:00 AM - 12:00 PM', crop: 'Mustard', expectedQty: '15 Qtl', arrived: false },
];

export default function ArrivalsPage() {
  const [arrivals, setArrivals] = useState<ArrivalRecord[]>(INITIAL_ARRIVALS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleMarkArrived = (id: string) => {
    setArrivals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            arrived: true,
            arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setFeedback(`✓ Token ${item.token} (${item.name}) marked as Arrived & automatically queued!`);
          return updated;
        }
        return item;
      })
    );

    // TODO: Trigger backend POST /queue/events to push arrival to live queue
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mandi Gate Arrivals & Check-In</h1>
          <p className="text-xs text-slate-500">Scan gate tokens or manually mark farmer vehicle arrival</p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Est. Qty</th>
                <th className="py-3 px-4">Gate Status</th>
                <th className="py-3 px-4 text-right">Gate Check-In Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {arrivals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{item.token}</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{item.name}</td>
                  <td className="py-3 px-4">{item.phone}</td>
                  <td className="py-3 px-4">{item.slot}</td>
                  <td className="py-3 px-4">{item.crop}</td>
                  <td className="py-3 px-4">{item.expectedQty}</td>
                  <td className="py-3 px-4">
                    {item.arrived ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Arrived ({item.arrivalTime})
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Scheduled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!item.arrived ? (
                      <button
                        onClick={() => handleMarkArrived(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                      >
                        🚛 Mark Arrived
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Queued at Gate</span>
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
