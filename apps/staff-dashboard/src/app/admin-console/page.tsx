'use client';

import React, { useState } from 'react';
import { UserRole } from '@kisancall/shared-types';

interface StaffUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
}

const INITIAL_USERS: StaffUser[] = [
  { id: '1', name: 'Rajesh Sharma', phone: '+91 98765 00001', role: 'admin', status: 'Active' },
  { id: '2', name: 'Vikram Jit', phone: '+91 98765 00002', role: 'supervisor', status: 'Active' },
  { id: '3', name: 'Anita Devi', phone: '+91 98765 00003', role: 'operator', status: 'Active' },
  { id: '4', name: 'Sunil Kumar', phone: '+91 98765 00004', role: 'operator', status: 'Active' },
];

export default function AdminConsolePage() {
  const [users, setUsers] = useState<StaffUser[]>(INITIAL_USERS);
  const [dailyCapacity, setDailyCapacity] = useState<number>(150);
  const [workingHours, setWorkingHours] = useState('09:00 AM - 06:00 PM');
  const [telephonyLine, setTelephonyLine] = useState('+91 1800-123-456');
  const [supportedCrops, setSupportedCrops] = useState('Wheat (गेहूं), Paddy (धान), Mustard (सरसों), Gram (चना)');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('✓ Centre configuration and telephony parameters saved successfully!');
  };

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setFeedback(`✓ Staff user permissions updated to ${newRole.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* VISUALLY DISTINCT ADMIN BANNER HEADER */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-xs font-mono font-extrabold uppercase tracking-wider">
              🛡️ ADMIN RESTRICTED ZONE
            </span>
            <span className="text-xs text-amber-300 font-mono">Role: System Administrator</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2">
            System Admin & Mandi Configuration Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global center parameters, role-based user permissions, telephony lines & security controls
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-right text-xs font-mono text-slate-300">
          <p><span className="text-slate-500">Mandi Code:</span> KRN-CENTRAL-01</p>
          <p><span className="text-slate-500">Node Status:</span> <strong className="text-emerald-400">● ONLINE</strong></p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex justify-between items-center shadow-sm">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-amber-800 font-extrabold">✕</button>
        </div>
      )}

      {/* Centre Configuration Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          ⚙️ Procurement Centre Configuration Parameters
        </h2>
        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Daily Capacity (Farmers / Day)
            </label>
            <input
              type="number"
              value={dailyCapacity}
              onChange={(e) => setDailyCapacity(parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Working Hours Window
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Telephony Toll-Free Hotline
            </label>
            <input
              type="text"
              value={telephonyLine}
              onChange={(e) => setTelephonyLine(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supported Procurement Crops (Comma-separated)
            </label>
            <input
              type="text"
              value={supportedCrops}
              onChange={(e) => setSupportedCrops(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-sm transition-colors"
            >
              Save Configuration Changes
            </button>
          </div>
        </form>
      </div>

      {/* Staff User & Role Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          👥 Staff User & Role Permission Management
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Role Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4">{u.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : u.role === 'supervisor'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">● {u.status}</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleUpdate(u.id, e.target.value as UserRole)}
                      className="bg-slate-50 border border-slate-300 rounded text-xs p-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="operator">Operator</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration & API Keys Status */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          🔑 Core Service Keys & Integration Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Deepgram STT/TTS</span>
            <span className="text-xs font-bold text-emerald-700">● ACTIVE (Nova-2 Speech Engine)</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Groq LLM Engine</span>
            <span className="text-xs font-bold text-emerald-700">● ACTIVE (Llama-3-70B-Versatile)</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Supabase Auth & DB</span>
            <span className="text-xs font-bold text-emerald-700">● ACTIVE (PostgreSQL RLS)</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Shardeum EVM RPC</span>
            <span className="text-xs font-bold text-emerald-700">● ACTIVE (Liberty Testnet)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
