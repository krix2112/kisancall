'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ProofEvent {
  id: string;
  procurement_id: string;
  event_type: string;
  payload_hash: string;
  chain_tx_hash: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  new_value?: any;
}

export default function ProofAuditPage() {
  const [proofs, setProofs] = useState<ProofEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [proofsRes, logsRes] = await Promise.all([
          supabase.from('proof_events').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(20)
        ]);

        if (proofsRes.error) console.warn('proof_events fetch error:', proofsRes.error.message);
        if (logsRes.error) console.warn('audit_logs fetch error:', logsRes.error.message);

        setProofs(proofsRes.data || []);
        setAuditLogs(logsRes.data || []);
      } catch (err: any) {
        console.error('Failed to load audit data:', err);
        setError(err.message || 'Error fetching audit logs');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AgroChain Proof Anchor & System Audit Trail</h1>
          <p className="text-xs text-slate-500">Live cryptographic audit layer anchored on Shardeum EVM Testnet (Chain ID 8119)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md font-bold">
            Shardeum Mezame (8119) Live
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          ⚠️ {error}
        </div>
      )}

      {/* Proof Hash Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">On-Chain Procurement Proof Hashes</h2>
            <p className="text-xs text-slate-500">Cryptographically verifiable hashes emitted by ProofAnchor.sol</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {loading ? 'Fetching records...' : `${proofs.length} Anchored Records`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Procurement ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Payload Hash (Keccak/SHA)</th>
                <th className="py-3 px-4">Shardeum TxHash</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans text-xs">
                    Loading verified proof events from database...
                  </td>
                </tr>
              ) : proofs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No proof events recorded yet. Complete a procurement cycle to anchor proofs.
                  </td>
                </tr>
              ) : (
                proofs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {item.procurement_id ? item.procurement_id.slice(0, 8) + '...' : item.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {item.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]" title={item.payload_hash}>
                      {item.payload_hash}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]" title={item.chain_tx_hash}>
                      {item.chain_tx_hash}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                      {new Date(item.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <a
                        href={`https://explorer-mezame.shardeum.org/transaction/${item.chain_tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 transition-colors"
                      >
                        <span>Verify On-Chain</span>
                        <span>↗</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Immutable System & User Audit Trail</h2>
            <p className="text-xs text-slate-500">Live operational ledger recorded in audit_logs</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {loading ? 'Fetching logs...' : `${auditLogs.length} Audit Entries`}
          </span>
        </div>

        <div className="space-y-2.5">
          {loading ? (
            <div className="py-6 text-center text-slate-400 text-xs">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">No audit logs found.</div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    Actor: {log.actor ? log.actor.slice(0, 8) + '...' : 'System'}
                  </span>
                  {log.entity && (
                    <span className="text-slate-400 text-[11px]">
                      Target: {log.entity.slice(0, 8)}...
                    </span>
                  )}
                  {log.new_value?.anchor_status && (
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold rounded">
                      Status: {log.new_value.anchor_status}
                    </span>
                  )}
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
