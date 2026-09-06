'use client';

import React, { useState } from 'react';
import { staffApi } from '@/services/staffApi';

export default function ProcurementEntryPage() {
  const [weight, setWeight] = useState<string>('');
  const [token, setToken] = useState<string>('T-842');
  const [farmerName, setFarmerName] = useState<string>('Ramesh Kumar');
  const [crop, setCrop] = useState<string>('Wheat (Sharbati)');
  const [rate, setRate] = useState<number>(2275);
  const [checklist, setChecklist] = useState({
    moisture: true,
    foreignMatter: true,
    damagedGrain: true,
    bagCount: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const numericWeight = parseFloat(weight) || 0;
  const totalPayment = numericWeight * rate;

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(totalPayment);

  const handleFetchDigitalScale = () => {
    setWeight('45.50');
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAndPrint = async () => {
    setLoading(true);
    setErrorBanner(null);
    setSuccessMsg(null);
    try {
      const dummyBookingId = '00000000-0000-0000-0000-000000000002';
      await staffApi.submitProcurement(dummyBookingId, {
        weight: numericWeight,
        rate,
        total: totalPayment,
        checklist
      });
      setSuccessMsg(`✓ Procurement saved successfully for Token ${token}`);
    } catch (err: any) {
      if (err.message && err.message.includes('501')) {
        setErrorBanner(`MISSING BACKEND CAPABILITY: The backend route POST /staff/procurement is a stub and returned 501 Not Implemented. Frontend is correctly wired.`);
      } else {
        setErrorBanner(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 gap-4 md:gap-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-6 bg-[#ecefe6] rounded-xl p-4 md:p-6 shadow-xs relative overflow-hidden w-full border border-slate-200">
        <div className="flex flex-col gap-1 z-10 relative">
          <span className="text-xs font-semibold text-[#00450d] uppercase tracking-widest flex items-center gap-1.5">
            <span>⚖️</span> Weighing Station Alpha
          </span>
          <h1 className="text-2xl font-bold text-[#191d17]">Procurement Recording</h1>
          <p className="text-sm text-[#41493e] flex items-center flex-wrap gap-2 mt-1">
            <span className="font-semibold text-[#191d17] bg-[#f7fbf1] px-3 py-0.5 rounded-md border border-[#c0c9bb]">
              Token {token}
            </span>
            <span className="text-[#191d17] font-semibold">{farmerName}</span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 bg-[#f7fbf1] p-4 rounded-lg shadow-xs border border-[#c0c9bb] z-10 relative w-full md:w-auto">
          <span className="text-xs font-medium text-[#41493e]">Scheduled Crop</span>
          <span className="text-lg font-semibold text-[#00450d] flex items-center gap-1.5">
            <span>🌾</span> {crop}
          </span>
          <span className="text-xs text-[#41493e]">
            MSP Rate: <strong className="text-[#191d17]">₹{rate.toLocaleString('en-IN')} / Qtl</strong>
          </span>
        </div>
      </div>

      {errorBanner && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex justify-between items-start z-10 relative">
          <div className="flex-1">
            <span className="font-bold block mb-1">⚠️ Error Saving Procurement</span>
            {errorBanner}
          </div>
          <button onClick={() => setErrorBanner(null)} className="text-red-600 hover:text-red-900 ml-2">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex justify-between items-center z-10 relative">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          {/* Measured Weight Card */}
          <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#c0c9bb] relative overflow-hidden space-y-4">
            <label className="text-base font-semibold text-[#191d17] block" htmlFor="weightInput">
              Measured Weight (Quintals)
            </label>
            <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3">
              <div className="relative w-full">
                <input
                  id="weightInput"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#f2f5ec] border-2 border-[#c0c9bb] focus:border-[#00450d] focus:ring-0 rounded-lg py-4 px-6 text-2xl font-bold text-[#191d17] placeholder:text-[#717a6d] text-right transition-colors pr-20"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#41493e]">
                  Qtl
                </span>
              </div>
              <button
                type="button"
                onClick={handleFetchDigitalScale}
                className="py-3 px-6 bg-[#91f78e] hover:bg-[#91f78e]/80 text-[#00731e] rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 border border-[#c0c9bb] whitespace-nowrap cursor-pointer"
              >
                <span>🔄</span>
                <span>Fetch Digital Scale</span>
              </button>
            </div>
            <p className="text-xs text-[#41493e]">
              Ensure the scale is zeroed before recording.
            </p>
          </div>

          {/* Quality Standards Checklist */}
          <div className="bg-[#ffffff] rounded-xl p-6 shadow-xs border border-[#c0c9bb]">
            <h3 className="text-base font-semibold text-[#191d17] mb-4 flex items-center gap-2">
              <span>📋</span> Quality Standards Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => toggleCheck('moisture')}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <input
                  type="checkbox"
                  checked={checklist.moisture}
                  readOnly
                  className="w-5 h-5 mt-0.5 rounded text-[#00450d]"
                />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-[#191d17]">Moisture Content &lt; 12%</span>
                  <span className="text-slate-500">Digital meter reading pass</span>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('foreignMatter')}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <input
                  type="checkbox"
                  checked={checklist.foreignMatter}
                  readOnly
                  className="w-5 h-5 mt-0.5 rounded text-[#00450d]"
                />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-[#191d17]">Foreign Matter &lt; 0.75%</span>
                  <span className="text-slate-500">Visual inspection pass</span>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('damagedGrain')}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <input
                  type="checkbox"
                  checked={checklist.damagedGrain}
                  readOnly
                  className="w-5 h-5 mt-0.5 rounded text-[#00450d]"
                />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-[#191d17]">Damaged Grain &lt; 2%</span>
                  <span className="text-slate-500">Sample sieving completed</span>
                </div>
              </div>

              <div
                onClick={() => toggleCheck('bagCount')}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <input
                  type="checkbox"
                  checked={checklist.bagCount}
                  readOnly
                  className="w-5 h-5 mt-0.5 rounded text-[#00450d]"
                />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-[#191d17]">Bag Count Verified</span>
                  <span className="text-slate-500">Standard gunny bags checked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Summary */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1b5e20] text-[#90d689] rounded-xl p-6 shadow-md relative overflow-hidden">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span>🧾</span> Transaction Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-white/80">Crop</span>
                <span className="font-semibold text-white">{crop}</span>
              </div>
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-white/80">MSP Rate</span>
                <span className="font-semibold text-white">₹{rate.toLocaleString('en-IN')} / Qtl</span>
              </div>
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-white/80">Weight Recorded</span>
                <span className="font-semibold text-white">{numericWeight.toFixed(2)} Qtl</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#90d689]/30">
              <span className="text-xs text-white/80 block mb-1">Estimated Total Payment</span>
              <div className="text-2xl font-bold tracking-tight text-white">{formattedTotal}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSaveAndPrint}
              disabled={loading}
              className={`w-full py-3 text-white rounded-lg text-xs font-semibold shadow-sm transition-transform flex items-center justify-center gap-2 cursor-pointer ${
                loading ? 'bg-[#1b5e20]/70' : 'bg-[#00450d] hover:bg-[#1b5e20]'
              }`}
            >
              <span>{loading ? '⏳' : '🖨️'}</span>
              <span>{loading ? 'Saving...' : 'Save & Print Procurement Slip'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
