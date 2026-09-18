// ============================================================
// UNMASK // ADMIN AUDIT LOGS & SECURITY TELEMETRY VIEW
// Comprehensive system-wide authentication audit trail
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  History, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  User, 
  Key, 
  Wallet, 
  Lock, 
  Calendar, 
  Activity,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { AuthService } from '../services/authService';
import type { AuthEvent } from '../types/auth';

interface AdminAuditLogsViewProps {
  onNavigateBack?: () => void;
  theme?: 'dark' | 'light';
}

export const AdminAuditLogsView: React.FC<AdminAuditLogsViewProps> = ({
  onNavigateBack,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await AuthService.getAdminAuditLogs(200, 0);
      setEvents(res.events || []);
    } catch (e) {
      console.error('[UNMASK Admin] Failed to fetch audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Format timestamp
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Not recorded';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return isoString;
    }
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesSearch = 
        !searchQuery.trim() ||
        (ev.userId && ev.userId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ev.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.ipHash && ev.ipHash.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = 
        selectedFilter === 'ALL' ||
        ev.eventType === selectedFilter ||
        (selectedFilter === 'FAILED' && !ev.success);

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedFilter]);

  // Telemetry counts
  const totalCount = events.length;
  const successCount = events.filter(e => e.success).length;
  const failedCount = events.filter(e => !e.success).length;
  const metamaskCount = events.filter(e => e.provider === 'ethereum' || e.eventType === 'METAMASK_LOGIN').length;
  const googleCount = events.filter(e => e.provider === 'google' || e.eventType === 'GOOGLE_LOGIN').length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold uppercase">
              ADMINISTRATIVE AUDIT TRAIL
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-mono">Authentication Security Logs</span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight mt-1">
            Authentication & User Identity Audit Logs
          </h1>
        </div>

        <div className="flex items-center space-x-2.5">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-[#0a101f] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Command Center</span>
            </button>
          )}

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4-Stat Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className={`p-4 rounded-xl border backdrop-blur-md ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'}`}>
          <span className="text-[10px] text-slate-400 uppercase block font-sans">TOTAL AUTH EVENTS</span>
          <span className="text-xl font-black text-[#38bdf8] mt-1 block font-mono">{totalCount}</span>
        </div>

        <div className={`p-4 rounded-xl border backdrop-blur-md ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'}`}>
          <span className="text-[10px] text-slate-400 uppercase block font-sans">SUCCESSFUL SESSIONS</span>
          <span className="text-xl font-black text-emerald-400 mt-1 block font-mono">{successCount}</span>
        </div>

        <div className={`p-4 rounded-xl border backdrop-blur-md ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'}`}>
          <span className="text-[10px] text-slate-400 uppercase block font-sans">WEB3 (METAMASK) LOGINS</span>
          <span className="text-xl font-black text-amber-400 mt-1 block font-mono">{metamaskCount}</span>
        </div>

        <div className={`p-4 rounded-xl border backdrop-blur-md ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'}`}>
          <span className="text-[10px] text-slate-400 uppercase block font-sans">FAILED ATTEMPTS</span>
          <span className={`text-xl font-black mt-1 block font-mono ${failedCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {failedCount}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`p-4 rounded-xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'
      }`}>
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search User ID, event type, IP hash..."
            className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs font-mono outline-hidden border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'
                : 'bg-[#020713]/60 border-[#1e3a6a] text-white focus:border-[#1e90ff]'
            }`}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {['ALL', 'LOGIN_SUCCESS', 'METAMASK_LOGIN', 'GOOGLE_LOGIN', 'ACCOUNT_CREATED', 'WALLET_LINKED', 'LOGOUT', 'FAILED'].map(flt => (
            <button
              key={flt}
              onClick={() => setSelectedFilter(flt)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === flt
                  ? 'bg-[#1e90ff] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                  : 'bg-[#020713]/60 border border-[#1e3a6a] text-slate-400 hover:text-white'
              }`}
            >
              {flt}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className={`rounded-2xl border backdrop-blur-md shadow-xl overflow-hidden ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#030a1a]/40 border-[#1e90ff]/25'
      }`}>
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-2 text-cyan-300 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Loading authentication audit events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-mono space-y-2">
            <AlertTriangle className="w-6 h-6 text-slate-500 mx-auto" />
            <p>No authentication events match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1e90ff]/20 text-[10px] text-slate-400 uppercase bg-[#020713]/60">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Action / Event</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Network / IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {ev.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-300">
                      {ev.userId || 'ANONYMOUS'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {ev.eventType}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        ev.provider === 'ethereum'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : ev.provider === 'google'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {ev.provider}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {ev.success ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {formatDate(ev.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {ev.ipHash || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
