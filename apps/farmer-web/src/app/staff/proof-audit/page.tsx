'use client';

import React from 'react';

const MOCK_PROOFS = [
  {
    id: 'P1',
    procurementId: 'PROC-8821',
    event: 'PROCUREMENT_VERIFIED',
    payloadHash: '0x8f7c2a1b9e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    txHash: '0x7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    block: 4892014,
    timestamp: '31 Aug 10:15:32 AM',
  },
  {
    id: 'P2',
    procurementId: 'PROC-8820',
    event: 'PROCUREMENT_VERIFIED',
    payloadHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    txHash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
    block: 4891980,
    timestamp: '31 Aug 09:40:10 AM',
  },
];

const MOCK_AUDIT_LOGS = [
  { actor: 'Operator (Op-4)', action: 'UPDATE_SLOT_CAPACITY', entity: 'Slot #S1', time: '31 Aug 08:30 AM' },
  { actor: 'System (Voice AI)', action: 'AUTO_BOOK_SLOT', entity: 'Booking #KC-8849', time: '30 Aug 04:15 PM' },
  { actor: 'Supervisor (Sup-1)', action: 'APPROVE_PFMS_BATCH', entity: 'Payment #PAY-884920', time: '31 Aug 02:30 PM' },
];

export default function ProofAuditPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AgroChain Proof Anchor &amp; System Audit Trail</h1>
        <p className="text-xs text-slate-500">Cryptographic audit layer targeting Shardeum EVM Liberty Testnet</p>
      </div>

      {/* Proof Hash Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Verifiable Procurement Proof Hashes</h2>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            Shardeum Liberty EVM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b">
              <tr>
                <th className="py-3 px-4">Procurement ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Payload Hash (SHA-256)</th>
                <th className="py-3 px-4">Chain TxHash</th>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MOCK_PROOFS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-emerald-700">{item.procurementId}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-800">{item.event}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{item.payloadHash}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{item.txHash}</td>
                  <td className="py-3 px-4 text-slate-900 font-bold">#{item.block}</td>
                  <td className="py-3 px-4 font-sans text-slate-500">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Immutable System &amp; User Audit Trail</h2>

        <div className="space-y-3">
          {MOCK_AUDIT_LOGS.map((log, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center text-xs">
              <div className="space-x-3">
                <span className="font-bold text-slate-900">{log.actor}</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">{log.action}</span>
                <span className="text-slate-600">{log.entity}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
