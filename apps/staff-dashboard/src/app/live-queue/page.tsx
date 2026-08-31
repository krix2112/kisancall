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
  { token: 'T-842', initials: 'RK', name: 'Ramesh Kumar',  farmerId: 'FMR-0982', crop: 'Wheat (Lok-1)',    weight: '45.5 qtl', status: 'Arrived' },
  { token: 'T-843', initials: 'SP', name: 'Suresh Patel',  farmerId: 'FMR-1104', crop: 'Chana (Gram)',    weight: '12.0 qtl', status: 'Pending' },
  { token: 'T-841', initials: 'GS', name: 'Gurpreet Singh', farmerId: 'FMR-0771', crop: 'Wheat (Sharbati)', weight: '88.2 qtl', status: 'Procured', strikethrough: true },
  { token: 'T-844', initials: 'MK', name: 'Mukesh Kumar',  farmerId: 'FMR-1205', crop: 'Mustard',         weight: '24.0 qtl', status: 'Arrived' },
];

const STATUS_CHIP: Record<Status, { bg: string; text: string; dot?: boolean; icon?: string }> = {
  Arrived:  { bg: 'bg-[#91f78e]/30 text-[#00731e]', text: 'Arrived',  dot: true },
  Pending:  { bg: 'bg-[#e0e4db] text-[#41493e]',    text: 'Pending',  icon: 'schedule' },
  Procured: { bg: 'bg-[#883454]/20 text-[#6b1d3d]', text: 'Procured', icon: 'check_circle' },
};

export default function LiveQueuePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = activeTab === 'All'
    ? QUEUE_DATA
    : QUEUE_DATA.filter((r) => r.status === activeTab);

  const tabs: { label: string; count: number; key: FilterTab }[] = [
    { label: 'All',      count: 42, key: 'All'      },
    { label: 'Pending',  count: 15, key: 'Pending'  },
    { label: 'Arrived',  count: 20, key: 'Arrived'  },
    { label: 'Procured', count: 7,  key: 'Procured' },
  ];

  return (
    <div className="flex flex-col w-full h-full max-w-[1400px] mx-auto">

      {/* ── Page Header Banner ─────────────────────────────────────── */}
      <div className="relative w-full rounded-xl overflow-hidden mb-6 shadow-sm bg-[#f2f5ec]" style={{ minHeight: 160 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00450d]/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00450d]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between p-6 gap-4">
          <div>
            <h1 className="text-[28px] leading-[36px] font-bold text-[#191d17] mb-1 flex items-center gap-2">
              Farmer Queue
              <span className="inline-flex items-center justify-center bg-[#1b5e20] text-[#90d689] text-[14px] font-semibold rounded-full px-3 py-1">
                Today
              </span>
            </h1>
            <p className="text-[16px] leading-[24px] text-[#41493e] max-w-2xl">
              Manage incoming procurement tokens and track arrivals for the current operating shift.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#00450d] text-white rounded-full px-6 min-h-[48px] shadow-sm hover:bg-[#1b5e20] transition-colors font-semibold text-[16px]">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Register New Arrival
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">

        {/* ── LEFT: Queue Table ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#ecefe6] rounded-xl shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#f2f5ec] border-b border-[#c0c9bb] gap-4">
            {/* Filter Chips */}
            <div className="flex overflow-x-auto w-full sm:w-auto gap-2" role="tablist">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#00450d] ${
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

            {/* Actions */}
            <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
              <button className="w-10 h-10 rounded-full hover:bg-[#e0e4db] flex items-center justify-center text-[#41493e] transition-colors" title="Filter">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-[#e0e4db] flex items-center justify-center text-[#41493e] transition-colors" title="Export">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-[#f7fbf1]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#f2f5ec] z-20 shadow-sm">
                <tr>
                  {['Token #', 'Farmer Details', 'Crop', 'Est. Weight', 'Status', 'Action'].map((h, i) => (
                    <th
                      key={h}
                      className={`py-2 px-4 text-[16px] font-semibold text-[#41493e] border-b border-[#c0c9bb] whitespace-nowrap ${
                        i === 3 || i === 5 ? 'text-right' : ''
                      } ${i === 2 ? 'hidden md:table-cell' : ''} ${i === 3 ? 'hidden lg:table-cell' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c0c9bb]/30">
                {filtered.map((row) => {
                  const chip = STATUS_CHIP[row.status];
                  const isProcured = row.status === 'Procured';
                  const isArrived  = row.status === 'Arrived';
                  return (
                    <tr
                      key={row.token}
                      className={`hover:bg-[#f2f5ec] transition-colors cursor-pointer ${
                        isProcured ? 'opacity-70 bg-[#ffffff]' : ''
                      }`}
                    >
                      {/* Token */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`text-[20px] font-bold font-mono tracking-tight ${
                          isProcured ? 'text-[#41493e]' : 'text-[#00450d]'
                        }`}>
                          {row.token}
                        </span>
                      </td>

                      {/* Farmer */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#e0e4db] flex items-center justify-center shrink-0">
                            <span className="text-[16px] font-semibold text-[#41493e]">{row.initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[16px] font-semibold text-[#191d17] truncate ${row.strikethrough ? 'line-through decoration-[#41493e]/50' : ''}`}>
                              {row.name}
                            </p>
                            <p className="text-[14px] text-[#41493e] truncate">ID: {row.farmerId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Crop */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="text-[16px] text-[#191d17]">{row.crop}</span>
                      </td>

                      {/* Weight */}
                      <td className="py-4 px-4 text-right hidden lg:table-cell font-mono">
                        <span className="text-[16px] text-[#191d17]">{row.weight}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[14px] font-semibold ${chip.bg}`}>
                          {chip.dot && <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c]" />}
                          {chip.icon && <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>}
                          {chip.text}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        {isProcured ? (
                          <button className="h-10 px-4 rounded-lg bg-[#f7fbf1] border border-[#c0c9bb] text-[#41493e] text-[16px] font-semibold hover:bg-[#e0e4db] transition-colors inline-flex items-center gap-1">
                            View Receipt
                          </button>
                        ) : isArrived ? (
                          <button className="h-10 px-4 rounded-lg bg-[#00450d] text-white text-[16px] font-semibold hover:bg-[#1b5e20] transition-colors inline-flex items-center gap-1">
                            Start
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        ) : (
                          <button className="w-10 h-10 rounded-full bg-[#f7fbf1] border border-[#c0c9bb] hover:bg-[#e0e4db] flex items-center justify-center text-[#41493e] transition-colors ml-auto" title="More options">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-[#f2f5ec] border-t border-[#c0c9bb] flex items-center justify-between">
            <span className="text-[16px] text-[#41493e]">Showing 1-{filtered.length} of 42</span>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full hover:bg-[#e0e4db] flex items-center justify-center text-[#41493e] transition-colors opacity-50" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-[#e0e4db] flex items-center justify-center text-[#41493e] transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Widgets ───────────────────────────────────────── */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">

          {/* Voice Command Widget */}
          <div className="bg-[#f7fbf1] p-6 rounded-xl shadow-sm border border-[#c0c9bb] flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1b5e20] flex items-center justify-center mb-4 relative overflow-hidden">
              <span className="material-symbols-outlined text-[#90d689] text-[32px] z-10">mic</span>
              <div className="absolute bottom-2 left-0 right-0 h-4 flex items-end justify-center gap-1 opacity-50">
                <div className="w-1 bg-[#00450d] h-2 animate-pulse" />
                <div className="w-1 bg-[#00450d] h-4 animate-pulse delay-75" />
                <div className="w-1 bg-[#00450d] h-3 animate-pulse delay-150" />
              </div>
            </div>
            <h3 className="text-[20px] font-semibold text-[#191d17] mb-1">Bolkar batayein</h3>
            <p className="text-[16px] text-[#41493e] mb-4">
              Speak a token number to quickly find a farmer in the queue.
            </p>
            <button className="w-full h-[48px] rounded-lg border border-[#00450d] text-[#00450d] text-[16px] font-semibold hover:bg-[#00450d]/5 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">mic</span>
              Tap to Speak
            </button>
          </div>

          {/* Shift Overview */}
          <div className="bg-[#ecefe6] rounded-xl p-4 shadow-sm">
            <h3 className="text-[16px] font-semibold text-[#191d17] uppercase tracking-wider mb-4">Shift Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[16px] text-[#41493e]">Procurement Progress</span>
                  <span className="text-[16px] font-semibold text-[#191d17]">16%</span>
                </div>
                <div className="w-full h-2 bg-[#e0e4db] rounded-full overflow-hidden">
                  <div className="h-full bg-[#00450d] rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2 bg-[#f7fbf1] rounded-lg">
                  <span className="block text-[14px] text-[#41493e] mb-1">Total Expected</span>
                  <span className="text-[28px] font-bold text-[#191d17]">42</span>
                </div>
                <div className="p-2 bg-[#f7fbf1] rounded-lg">
                  <span className="block text-[14px] text-[#41493e] mb-1">Processed</span>
                  <span className="text-[28px] font-bold text-[#191d17]">07</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Widget */}
          <div className="bg-[#ecefe6] rounded-xl overflow-hidden shadow-sm flex flex-col relative" style={{ height: 192 }}>
            <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between pointer-events-none">
              <span className="bg-[#f7fbf1]/80 backdrop-blur self-start px-2 py-1 rounded text-[14px] font-semibold text-[#191d17] shadow-sm">
                Mandi Location
              </span>
            </div>
            <div
              className="w-full h-full bg-cover bg-center bg-[#e0e4db] flex items-center justify-center"
            >
              <span className="text-[#717a6d] text-sm font-medium">📍 Bhopal Mandi, MP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
