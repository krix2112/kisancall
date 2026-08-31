'use client';

import React, { useState, useEffect } from 'react';
import { REALTIME_CHANNELS, subscribeToChannel } from '@kisancall/shared-types';
import { supabase } from '@/lib/supabase';

interface QueueItem {
  id: string;
  token: string;
  name: string;
  crop: string;
  arrivalTime: string;
  position: number;
  etaMinutes: number;
  status: 'Waiting' | 'Calling' | 'At Weighbridge';
}

const INITIAL_QUEUE: QueueItem[] = [
  { id: '1', token: '#KC-8845', name: 'Mangat Ram', crop: 'Wheat', arrivalTime: '08:30 AM', position: 1, etaMinutes: 0, status: 'Calling' },
  { id: '2', token: '#KC-8846', name: 'Satpal Singh', crop: 'Paddy', arrivalTime: '08:40 AM', position: 2, etaMinutes: 10, status: 'Waiting' },
  { id: '3', token: '#KC-8849', name: 'Ramesh Kumar', crop: 'Wheat', arrivalTime: '08:52 AM', position: 3, etaMinutes: 20, status: 'Waiting' },
  { id: '4', token: '#KC-8850', name: 'Suresh Verma', crop: 'Paddy', arrivalTime: '09:05 AM', position: 4, etaMinutes: 30, status: 'Waiting' },
];

export default function LiveQueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [activeCallMessage, setActiveCallMessage] = useState<string | null>(null);

  useEffect(() => {
    // Realtime queue subscription integration stub
    const channelName = REALTIME_CHANNELS.queue('karnal-central');
    const unsubscribe = subscribeToChannel(
      supabase,
      channelName,
      { table: 'queue_events' },
      (payload) => {
        console.log('[Staff Dashboard Queue Realtime]', payload);
        // TODO: Sync realtime queue position re-ordering from backend websocket
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCallNext = () => {
    if (queue.length === 0) return;

    const nextFarmer = queue[0];
    setActiveCallMessage(`📢 Calling Token ${nextFarmer.token} (${nextFarmer.name}) to Weighbridge Counter 1!`);

    // Advance queue positions
    setQueue((prev) =>
      prev
        .slice(1)
        .map((item, idx) => ({
          ...item,
          position: idx + 1,
          etaMinutes: idx * 10,
          status: idx === 0 ? 'Calling' : 'Waiting',
        }))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Weighbridge Queue Console</h1>
          <p className="text-xs text-slate-500">Real-time sequence display for incoming farmer vehicles</p>
        </div>
        <button
          onClick={handleCallNext}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
        >
          <span>📢 Call Next Farmer</span>
        </button>
      </div>

      {activeCallMessage && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm font-bold text-amber-900 shadow-sm animate-pulse flex justify-between items-center">
          <span>{activeCallMessage}</span>
          <button onClick={() => setActiveCallMessage(null)} className="text-amber-700 hover:text-amber-950 text-xs">Dismiss</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Pos #</th>
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Crop</th>
                <th className="py-3 px-4">Arrival Time</th>
                <th className="py-3 px-4">Est. Wait</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {queue.map((item) => (
                <tr key={item.id} className={item.status === 'Calling' ? 'bg-emerald-50/60 font-bold' : 'hover:bg-slate-50'}>
                  <td className="py-3 px-4 font-extrabold text-sm text-slate-900">#{item.position}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{item.token}</td>
                  <td className="py-3 px-4 text-slate-900">{item.name}</td>
                  <td className="py-3 px-4">{item.crop}</td>
                  <td className="py-3 px-4">{item.arrivalTime}</td>
                  <td className="py-3 px-4">{item.etaMinutes} mins</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Calling'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {item.status}
                    </span>
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
