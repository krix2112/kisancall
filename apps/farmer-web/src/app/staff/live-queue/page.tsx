'use client';

import React, { useState } from 'react';

type Status = 'Arrived' | 'Pending' | 'Procured';
type FilterTab = 'All' | 'Pending' | 'Arrived' | 'Procured';

interface QueueEntry {
  token: string;
  initials: string;
  name: string;
  farmerId: string;
  crop: string;
  weight: string;
  status: Status;
  strikethrough?: boolean;
}

const QUEUE_DATA: QueueEntry[] = [
  { token: 'T-842', initials: 'RK', name: 'Ramesh Kumar', farmerId: 'FMR-0982', crop: 'Wheat (Lok-1)', weight: '45.5 qtl', status: 'Arrived' },
  { token: 'T-843', initials: 'SP', name: 'Suresh Patel', farmerId: 'FMR-1104', crop: 'Chana (Gram)', weight: '12.0 qtl', status: 'Pending' },
  { token: 'T-841', initials: 'GS', name: 'Gurpreet Singh', farmerId: 'FMR-0771', crop: 'Wheat (Sharbati)', weight: '88.2 qtl', status: 'Procured', strikethrough: true },
  { token: 'T-844', initials: 'MK', name: 'Mukesh Kumar', farmerId: 'FMR-1205', crop: 'Mustard', weight: '24.0 qtl', status: 'Arrived' },
];

const STATUS_CHIP: Record<Status, { bg: string; text: string; dot?: boolean; icon?: string }> = {
  Arrived: { bg: 'bg-[#91f78e]/30 text-[#00731e]', text: 'Arrived', dot: true },
  Pending: { bg: 'bg-[#e0e4db] text-[#41493e]', text: 'Pending', icon: '⏱️' },
  Procured: { bg: 'bg-[#883454]/20 text-[#6b1d3d]', text: 'Procured', icon: '✓' },
};

export default function LiveQueuePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filtered = activeTab === 'All'
    ? QUEUE_DATA
    : QUEUE_DATA.filter((r) => r.status === activeTab);

  const tabs: { label: string; count: number; key: FilterTab }[] = [
    { label: 'All', count: 42, key: 'All' },
    { label: 'Pending', count: 15, key: 'Pending' },
    { label: 'Arrived', count: 20, key: 'Arrived' },
    { label: 'Procured', count: 7, key: 'Procured' },
  ];

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-[#f2f5ec] p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#191d17] mb-1 flex items-center gap-2">
              Farmer Queue
              <span className="inline-flex items-center justify-center bg-[#1b5e20] text-[#90d689] text-xs font-semibold rounded-full px-2.5 py-0.5">
                Today
              </span>
            </h1>
            <p className="text-xs text-[#41493e] max-w-2xl">
              Manage incoming procurement tokens and track arrivals for Karnal Central Mandi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left: Queue Table */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#ecefe6] rounded-xl shadow-sm overflow-hidden border border-slate-200">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#f2f5ec] border-b border-[#c0c9bb] gap-4">
            <div className="flex overflow-x-auto w-full sm:w-auto gap-2" role="tablist">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.key)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1b5e20] text-[#90d689]'
                        : 'bg-[#f7fbf1] text-[#191d17] border border-[#c0c9bb] hover:bg-[#e0e4db]'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-[#f7fbf1]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#f2f5ec] z-20 shadow-xs">
                <tr>
                  {['Token #', 'Farmer Details', 'Crop', 'Est. Weight', 'Status'].map((h) => (
                    <th key={h} className="py-3 px-4 font-semibold text-[#41493e] border-b border-[#c0c9bb] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c0c9bb]/30">
                {filtered.map((row) => {
                  const chip = STATUS_CHIP[row.status];
                  const isProcured = row.status === 'Procured';
                  return (
                    <tr
                      key={row.token}
                      className={`hover:bg-[#f2f5ec] transition-colors ${
                        isProcured ? 'opacity-70 bg-[#ffffff]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-base font-bold font-mono ${
                          isProcured ? 'text-[#41493e]' : 'text-[#00450d]'
                        }`}>
                          {row.token}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#e0e4db] flex items-center justify-center shrink-0 text-xs font-bold text-[#41493e]">
                            {row.initials}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-semibold text-[#191d17] truncate ${row.strikethrough ? 'line-through decoration-[#41493e]/50' : ''}`}>
                              {row.name}
                            </p>
                            <p className="text-[11px] text-[#41493e] truncate">ID: {row.farmerId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#191d17]">
                        {row.crop}
                      </td>

                      <td className="py-3 px-4 font-mono text-[#191d17]">
                        {row.weight}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${chip.bg}`}>
                          {chip.dot && <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c]" />}
                          {chip.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Widgets */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div className="bg-[#ecefe6] rounded-xl p-4 shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold text-[#191d17] uppercase tracking-wider">Shift Overview</h3>
            <div>
              <div className="flex justify-between items-end mb-1 text-xs">
                <span className="text-[#41493e]">Procurement Progress</span>
                <span className="font-semibold text-[#191d17]">16%</span>
              </div>
              <div className="w-full h-2 bg-[#e0e4db] rounded-full overflow-hidden">
                <div className="h-full bg-[#00450d] rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 bg-[#f7fbf1] rounded-lg text-center">
                <span className="block text-[11px] text-[#41493e] mb-0.5">Total Expected</span>
                <span className="text-xl font-bold text-[#191d17]">42</span>
              </div>
              <div className="p-3 bg-[#f7fbf1] rounded-lg text-center">
                <span className="block text-[11px] text-[#41493e] mb-0.5">Processed</span>
                <span className="text-xl font-bold text-[#191d17]">07</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
