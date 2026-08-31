'use client';

import React, { useState } from 'react';

export default function ProcurementEntryPage() {
  const [farmerToken, setFarmerToken] = useState('#KC-8849');
  const [farmerName, setFarmerName] = useState('Ramesh Kumar');
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState<number>(20.0);
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [pricePerQtl, setPricePerQtl] = useState<number>(2275);
  const [feedback, setFeedback] = useState<string | null>(null);

  const totalAmount = quantity * pricePerQtl;

  const handleMarkProcured = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Trigger backend POST /proof-events to generate SHA-256 payload hash & submit to Shardeum EVM contract
    console.log('TODO: Submit procurement record & anchor proof hash for token:', farmerToken);

    setFeedback(
      `✓ Procurement entry recorded! Amount: ₹${totalAmount.toLocaleString('en-IN')}. Hash anchored to AgroChain proof layer.`
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Procurement & Weight Entry</h1>
        <p className="text-xs text-slate-500">Record weighbridge receipts and generate cryptographic proof anchor</p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex justify-between items-center">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleMarkProcured} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Token / Booking ID</label>
            <input
              type="text"
              value={farmerToken}
              onChange={(e) => setFarmerToken(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Name</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Commodity / Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Paddy">Paddy (धान)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Gram">Gram (चना)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Quality Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as any)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Grade A">Grade A (Premium / Fair Average Quality)</option>
              <option value="Grade B">Grade B (Standard)</option>
              <option value="Grade C">Grade C (Sub-standard)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Weighbridge Net Quantity (Quintals)</label>
            <input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Agreed Rate per Quintal (₹/Qtl)</label>
            <input
              type="number"
              value={pricePerQtl}
              onChange={(e) => setPricePerQtl(parseFloat(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Calculated Amount Display */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Total Disbursable Amount</span>
            <span className="text-2xl font-extrabold text-emerald-900">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-xs text-emerald-700 font-mono">Calculated ({quantity} Qtl × ₹{pricePerQtl})</span>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-sm transition-colors text-sm"
        >
          ⛓️ Mark Procured & Generate Proof Anchor
        </button>
      </form>
    </div>
  );
}
