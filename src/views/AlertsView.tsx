// ============================================================
// PAGE 6 — ALERTS & TRIAGE CENTER
// Priority-Ranked Threat Alert Management & Automated Triggers
// ============================================================

import React, { useState } from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Network, 
  FolderGit2, 
  Filter, 
  Sparkles,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { THREAT_ALERTS } from '../data/mockIntelligence';
import type { ThreatAlert, RiskLevel } from '../types/intelligence';

interface AlertsViewProps {
  onSelectActor: (actorName: string) => void;
  onFocusThreatGraph: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  onSelectActor,
  onFocusThreatGraph,
  onNavigateToModule
}) => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>(THREAT_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const handleMarkReviewed = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'REVIEWED' } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Threat Alert & Anomaly Triage Center
            </h1>
            <p className="text-xs text-slate-400">
              Automated multi-factor anomaly signals, coordinated syndicate bursts, and wallet confluence alerts
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#020713]/60 p-1 rounded-lg border border-[#1e3a6a] text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(level => (
            <button
              key={level}
              onClick={() => setSeverityFilter(level)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                severityFilter === level
                  ? 'bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border backdrop-blur-md transition-all space-y-4 ${
                isCritical
                  ? 'bg-gradient-to-r from-[#140a14]/60 via-[#0b1022]/50 to-[#030a1a]/40 border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
                  : isHigh
                  ? 'bg-[#030a1a]/40 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-[#030a1a]/40 border-[#1e3a6a]/50 hover:border-[#1e90ff]/40'
              }`}
            >
              {/* Alert Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] px-2.5 py-1 rounded font-bold ${
                    isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40 glow-red' :
                    isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {alert.severity} ALERT • {alert.id}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {alert.timestamp}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {alert.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-200 leading-relaxed max-w-4xl">
                {alert.summary}
              </p>

              {/* Involved Target Badges & Indicator Count */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    Involved Actors:
                  </span>
                  {alert.involvedActors.map((actor, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        onSelectActor(actor);
                        onNavigateToModule('ACTOR_INTELLIGENCE');
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer transition-all"
                    >
                      {actor}
                    </span>
                  ))}
                  {alert.activitySpikePercentage && (
                    <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
                      +{alert.activitySpikePercentage}% Activity Spike
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    ({alert.indicatorsCount} indicators flagged)
                  </span>
                </div>

                {/* 3 Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (alert.involvedActors[0]) {
                        onSelectActor(alert.involvedActors[0]);
                      }
                      onNavigateToModule('INVESTIGATIONS');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </button>

                  <button
                    onClick={() => {
                      if (alert.involvedActors[0]) {
                        onFocusThreatGraph(alert.involvedActors[0]);
                      }
                      onNavigateToModule('THREAT_GRAPH');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center space-x-1.5 transition-all"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>View Graph</span>
                  </button>

                  <button
                    onClick={() => handleMarkReviewed(alert.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 transition-all ${
                      alert.status === 'REVIEWED'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{alert.status === 'REVIEWED' ? 'Reviewed' : 'Mark Reviewed'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
