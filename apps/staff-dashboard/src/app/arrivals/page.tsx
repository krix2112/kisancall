'use client';

import React, { useState } from 'react';

import { INITIAL_ARRIVALS, ArrivalRecord } from '@/lib/mockData';
import { DataTable } from '@/components/DataTable';
import { staffApi } from '@/services/api';

export default function ArrivalsPage() {
  const [arrivals, setArrivals] = useState<ArrivalRecord[]>(INITIAL_ARRIVALS);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkArrived = async (id: string, token: string, name: string) => {
    setLoadingId(id);
    setErrorBanner(null);
    setFeedback(null);
    
    try {
      await staffApi.markArrived(id);
      
      // If backend succeeds (or if we want to update optimistically after success)
      setArrivals((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              arrived: true,
              arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return item;
        })
      );
      setFeedback(`✓ Token ${token} (${name}) marked as Arrived & automatically queued!`);
    } catch (err: any) {
      if (err.message.includes('501')) {
        setErrorBanner(`MISSING BACKEND CAPABILITY: The backend route POST /staff/arrivals is a stub and returned 501 Not Implemented. Frontend is correctly wired.`);
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
          <h1 className="text-2xl font-bold text-slate-900">Mandi Gate Arrivals & Check-In</h1>
          <p className="text-xs text-slate-500">Scan gate tokens or manually mark farmer vehicle arrival</p>
        </div>
      </div>

      {errorBanner && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex justify-between items-start">
          <div className="flex-1">
            <span className="font-bold block mb-1">⚠️ Error Marking Arrival</span>
            {errorBanner}
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-red-600 hover:text-red-900 ml-2">✕</button>
        </div>
      )}

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      <DataTable>
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
                        disabled={loadingId === item.id}
                        onClick={() => handleMarkArrived(item.id, item.token, item.name)}
                        className={`font-semibold text-xs py-1.5 px-3 rounded-lg shadow-sm transition-colors text-white ${
                          loadingId === item.id ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {loadingId === item.id ? 'Loading...' : '🚛 Mark Arrived'}
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Queued at Gate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
      </DataTable>
    </div>
  );
}
