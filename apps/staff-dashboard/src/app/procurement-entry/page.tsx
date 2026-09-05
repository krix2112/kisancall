'use client';

import React, { useState } from 'react';
import { staffApi } from '@/services/api';

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
      // Dummy booking ID since there's no real list to select from yet
      const dummyBookingId = '00000000-0000-0000-0000-000000000002';
      await staffApi.submitProcurement(dummyBookingId, {
        weight: numericWeight,
        rate,
        total: totalPayment,
        checklist
      });
      setSuccessMsg(`✓ Procurement saved successfully for Token ${token}`);
    } catch (err: any) {
      if (err.message.includes('501')) {
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
      {/* ── Top Banner Section ──────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-col md:flex-row gap-6 bg-[#ecefe6] rounded-xl p-4 md:p-6 shadow-sm relative overflow-hidden w-full">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#00450d]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col gap-1 z-10 relative">
          <span className="text-[16px] font-semibold text-[#00450d] uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">scale</span> Weighing Station Alpha
          </span>
          <h1 className="text-[28px] leading-[36px] font-bold text-[#191d17]">Procurement Recording</h1>
          <p className="text-[18px] leading-[26px] text-[#41493e] flex items-center flex-wrap gap-2 mt-1">
            <span className="text-[20px] font-semibold text-[#191d17] bg-[#f7fbf1] px-4 py-1 rounded-md shadow-sm border border-[#c0c9bb]">
              Token {token}
            </span>
            <span className="text-[#191d17] font-semibold text-[16px]">{farmerName}</span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 bg-[#f7fbf1] p-4 rounded-lg shadow-sm border border-[#c0c9bb] z-10 relative w-full md:w-auto">
          <span className="text-[14px] font-medium text-[#41493e]">Scheduled Crop</span>
          <span className="text-[24px] font-semibold text-[#00450d] flex items-center gap-2">
            <span className="material-symbols-outlined">grass</span> {crop}
          </span>
          <span className="text-[14px] text-[#41493e] mt-1">
            MSP Rate: <span className="font-semibold text-[#191d17]">₹{rate.toLocaleString('en-IN')} / Qtl</span>
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

      {/* ── Main Grid Section ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        
        {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-4 md:gap-6">
          
          {/* Measured Weight Card */}
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-8 shadow-md border border-[#c0c9bb] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none hidden md:block">
              <span className="material-symbols-outlined text-[120px] text-[#00450d]">monitor_weight</span>
            </div>
            <label className="text-[20px] font-semibold text-[#191d17] block mb-4" htmlFor="weightInput">
              Measured Weight
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
                  className="w-full bg-[#f2f5ec] border-2 border-[#c0c9bb] focus:border-[#00450d] focus:ring-0 rounded-lg py-6 px-8 text-[32px] font-bold text-[#191d17] placeholder:text-[#717a6d] text-right transition-colors pr-24 h-24"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[20px] font-semibold text-[#41493e]">
                  Qtl
                </span>
              </div>
              <button
                type="button"
                onClick={handleFetchDigitalScale}
                className="h-16 md:h-24 px-6 bg-[#91f78e] hover:bg-[#91f78e]/80 text-[#00731e] rounded-lg text-[16px] font-semibold shadow-sm transition-colors flex flex-row md:flex-col items-center justify-center gap-1 border border-[#c0c9bb] w-full md:w-auto"
              >
                <span className="material-symbols-outlined">sync</span>
                <span>Fetch Digital Scale</span>
              </button>
            </div>
            <p className="text-[16px] text-[#41493e] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#717a6d]">info</span> Ensure the scale is zeroed before placing bags.
            </p>
          </div>

          {/* Quality Standards Checklist */}
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-6 shadow-sm border border-[#c0c9bb]">
            <h3 className="text-[20px] font-semibold text-[#191d17] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00450d]">fact_check</span> Quality Standards Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Checkbox 1 */}
              <div
                onClick={() => toggleCheck('moisture')}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={checklist.moisture}
                    readOnly
                    className="w-6 h-6 border-2 border-[#717a6d] rounded bg-[#ffffff] checked:bg-[#00450d] checked:border-[#00450d] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#191d17]">Moisture Content &lt; 12%</span>
                  <span className="text-[16px] text-[#41493e]">Measured with digital meter</span>
                </div>
              </div>

              {/* Checkbox 2 */}
              <div
                onClick={() => toggleCheck('foreignMatter')}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={checklist.foreignMatter}
                    readOnly
                    className="w-6 h-6 border-2 border-[#717a6d] rounded bg-[#ffffff] checked:bg-[#00450d] checked:border-[#00450d] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#191d17]">Foreign Matter &lt; 0.75%</span>
                  <span className="text-[16px] text-[#41493e]">Visual inspection passed</span>
                </div>
              </div>

              {/* Checkbox 3 */}
              <div
                onClick={() => toggleCheck('damagedGrain')}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={checklist.damagedGrain}
                    readOnly
                    className="w-6 h-6 border-2 border-[#717a6d] rounded bg-[#ffffff] checked:bg-[#00450d] checked:border-[#00450d] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#191d17]">Damaged Grain &lt; 2%</span>
                  <span className="text-[16px] text-[#41493e]">Sample sieving completed</span>
                </div>
              </div>

              {/* Checkbox 4 */}
              <div
                onClick={() => toggleCheck('bagCount')}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#f2f5ec] hover:bg-[#ecefe6] transition-colors cursor-pointer border border-transparent hover:border-[#c0c9bb]"
              >
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={checklist.bagCount}
                    readOnly
                    className="w-6 h-6 border-2 border-[#717a6d] rounded bg-[#ffffff] checked:bg-[#00450d] checked:border-[#00450d] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#191d17]">Bag Count Verified</span>
                  <span className="text-[16px] text-[#41493e]">91 standard gunny bags</span>
                </div>
              </div>

            </div>
          </div>

          {/* Voice Notes Widget */}
          <div className="bg-[#ffffff] rounded-xl p-4 md:p-6 shadow-sm border border-[#c0c9bb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1b5e20] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#90d689]">mic</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-semibold text-[#191d17]">Voice Recording Optional</span>
                <span className="text-[16px] text-[#41493e]">Add verbal notes to this record</span>
              </div>
            </div>
            <button className="w-full sm:w-auto min-h-[48px] px-6 border border-[#00450d] text-[#00450d] hover:bg-[#00450d]/5 rounded-lg text-[16px] font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">mic</span>
              Bolkar batayein
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Transaction Summary & Actions ─────────────── */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 md:gap-6">
          <div className="bg-[#1b5e20] text-[#90d689] rounded-xl p-4 md:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 pointer-events-none" />
            <h3 className="text-[20px] font-semibold text-white mb-4 md:mb-6 relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined">receipt_long</span> Transaction Summary
            </h3>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-[16px] opacity-80 text-white">Crop</span>
                <span className="text-[16px] font-semibold text-white">{crop}</span>
              </div>
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-[16px] opacity-80 text-white">MSP Rate</span>
                <span className="text-[16px] font-semibold text-white">₹{rate.toLocaleString('en-IN')} / Qtl</span>
              </div>
              <div className="flex justify-between border-b border-[#90d689]/20 pb-2">
                <span className="text-[16px] opacity-80 text-white">Weight Recorded</span>
                <span className="text-[16px] font-semibold text-white">{numericWeight.toFixed(2)} Qtl</span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 pt-4 relative z-10">
              <span className="text-[16px] opacity-80 text-white block mb-1">Estimated Total Payment</span>
              <div className="text-[32px] leading-[40px] font-bold tracking-tight text-white">{formattedTotal}</div>
              <div className="text-[14px] font-medium mt-1 opacity-70 bg-black/10 inline-block px-2 py-1 rounded text-white">
                Subject to final central audit
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <button 
              onClick={handleSaveAndPrint}
              disabled={loading}
              className={`w-full min-h-[48px] text-white rounded-lg text-[16px] font-semibold shadow-md transition-transform flex items-center justify-center gap-2 ${loading ? 'bg-[#1b5e20]/70' : 'bg-[#00450d] hover:bg-[#1b5e20] active:scale-[0.98]'}`}>
              <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'print'}</span> 
              {loading ? 'Saving...' : 'Save & Print Slip'}
            </button>
            <button className="w-full min-h-[48px] border border-[#00450d] text-[#00450d] hover:bg-[#00450d]/5 rounded-lg text-[16px] font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">edit</span> Edit Token Details
            </button>
            <button className="w-full min-h-[48px] text-[#ba1a1a] hover:bg-[#ba1a1a]/5 rounded-lg text-[16px] font-semibold transition-colors flex items-center justify-center gap-2 mt-2">
              <span className="material-symbols-outlined">cancel</span> Reject Lot
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
