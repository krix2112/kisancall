'use client';

import React from 'react';

export default function FarmerWebPage() {
  const handleRequestCall = () => {
    alert('TODO: Trigger voice-pipeline call request');
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-emerald-800">KisanCall Portal</h1>
        <p className="text-slate-600">Agricultural Procurement & Mandi Voice Assistant</p>
      </header>

      {/* Placeholder status card */}
      <div className="bg-white rounded-xl border p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Procurement & Queue Status</h2>
        <div className="p-4 bg-slate-50 border rounded-lg">
          <p className="text-sm text-slate-500 font-medium">Active Token: <span className="text-slate-800 font-mono">TOKEN-PENDING</span></p>
          <p className="text-sm text-slate-500 font-medium">Slot Status: <span className="text-amber-600">Awaiting Booking</span></p>
        </div>
      </div>

      {/* Request a call button */}
      <div className="bg-white rounded-xl border p-6 shadow-sm text-center space-y-4">
        <h3 className="text-lg font-medium text-slate-800">Need Assistance or Want to Book via Voice?</h3>
        <button
          onClick={handleRequestCall}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
        >
          Request a Call
        </button>
      </div>
    </main>
  );
}
