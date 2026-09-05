'use client';

import React, { useState } from 'react';

import { MOCK_FARMERS, CAPACITY_BLOCKS } from '@/lib/mockData';
import { DataTable } from '@/components/DataTable';

export default function TodayOverviewPage() {
  const [farmers] = useState(MOCK_FARMERS);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Booked': return 'bg-sky-100 text-sky-800';
      case 'Arrived': return 'bg-amber-100 text-amber-800';
      case 'In Queue': return 'bg-rose-100 text-rose-800';
      case 'Procured': return 'bg-indigo-100 text-indigo-800';
      case 'Paid': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Today Procurement Overview</h1>
        <p className="text-xs text-slate-500">Live operational metrics for Karnal Central Mandi • 31 Aug 2026</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Slot Bookings</span>
          <p className="text-2xl font-extrabold text-slate-900">120 <span className="text-xs font-normal text-slate-400">/ 150 Cap</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Farmers Arrived</span>
          <p className="text-2xl font-extrabold text-amber-600">58 <span className="text-xs font-normal text-slate-400">Checked In</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Procurement Completed</span>
          <p className="text-2xl font-extrabold text-indigo-600">34 <span className="text-xs font-normal text-slate-400">Lots Weighed</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">DBT Disbursed</span>
          <p className="text-2xl font-extrabold text-emerald-600">₹18.45 Lakhs</p>
        </div>
      </div>

      {/* Capacity vs Bookings Time Block Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Mandi Slot Capacity vs Bookings (Today)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPACITY_BLOCKS.map((block) => (
            <div key={block.time} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{block.time}</span>
                <span className="font-bold text-slate-900">{block.booked} / {block.capacity} Booked</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${block.color}`}
                  style={{ width: `${(block.booked / block.capacity) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Arrived: {block.arrived}</span>
                <span>Available: {block.capacity - block.booked}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Farmers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <span>📋</span>
            <span>Today's Live Roster</span>
          </h2>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 mb-4">
            ⚠️ MISSING BACKEND CAPABILITY: The backend does not have a GET /bookings API to fetch today's roster. This list is currently using fallback mock data.
          </div>
          
          <DataTable>
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Token #</th>
                  <th className="py-3 px-4">Farmer Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {farmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{farmer.token}</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">{farmer.name}</td>
                  <td className="py-3 px-4">{farmer.phone}</td>
                  <td className="py-3 px-4">{farmer.slot}</td>
                  <td className="py-3 px-4">{farmer.crop}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(farmer.status)}`}>
                      {farmer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
