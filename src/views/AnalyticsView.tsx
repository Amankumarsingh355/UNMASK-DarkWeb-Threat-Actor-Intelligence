// ============================================================
// PAGE 7 — THREAT ANALYTICS & ANOMALY DETECTION
// 24x7 Heatmap, Temporal Spike Engine & Entity Centrality
// ============================================================

import React from 'react';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Layers, 
  Network, 
  AlertTriangle, 
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  THREAT_ACTIVITY_HEATMAP, 
  ANOMALY_RECORDS, 
  RISK_DISTRIBUTION_DATA, 
  SOURCE_DISTRIBUTION_DATA,
  THREAT_ACTORS 
} from '../data/mockIntelligence';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface AnalyticsViewProps {
  onSelectActor: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onSelectActor,
  onNavigateToModule
}) => {
  const topCentralEntities = [
    { rank: 1, name: 'shadowfox', type: 'ACTOR', degree: 14, betweenness: '0.892', risk: 'VERY HIGH' },
    { rank: 2, name: 'darkwolf', type: 'ACTOR', degree: 12, betweenness: '0.814', risk: 'HIGH' },
    { rank: 3, name: '0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a', type: 'WALLET', degree: 14, betweenness: '0.845', risk: 'HIGH' },
    { rank: 4, name: '0x127b8a531e21b77c59ff1990df78923053d2bf94', type: 'WALLET', degree: 9, betweenness: '0.720', risk: 'HIGH' },
    { rank: 5, name: 'dread', type: 'FORUM', degree: 28, betweenness: '0.940', risk: 'HIGH' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Header Banner */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Threat Intelligence Analytics & Anomaly Detection
            </h1>
            <p className="text-xs text-slate-400">
              Temporal Activity Heatmaps, Statistical Outliers & Entity Centrality Measures
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40">
          ANOMALY DETECTION ENGINE ACTIVE
        </span>
      </div>

      {/* 3 Anomaly Detection Alert Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ANOMALY_RECORDS.map(anom => (
          <div
            key={anom.id}
            onClick={() => {
              onSelectActor(anom.actorName);
              onNavigateToModule('ACTOR_INTELLIGENCE');
            }}
            className="p-4 rounded-2xl bg-[#030a1a]/40 backdrop-blur-md border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-3 cursor-pointer shadow-xl group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                {anom.severity} ANOMALY
              </span>
              <span className="text-xs font-bold text-red-400 font-display-tactical text-base">
                +{anom.spikePercentage}% Surge
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                {anom.actorName} • {anom.metric}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {anom.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Baseline: {anom.baselineRate}/day → Observed: <strong className="text-amber-300">{anom.observedRate}/day</strong></span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Interactive Heatmap (8 cols) + Risk & Source Distribution (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 24h x 7d Threat Activity Heatmap (8 cols) */}
        <div className="lg:col-span-8 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Threat Activity Heatmap (Day × UTC Hour Bands)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Peak Window: 20:00 - 02:00 UTC</span>
          </div>

          <p className="text-xs text-slate-400">
            Color intensity represents normalized telemetry volume across monitored underground forum posts, C2 beacons, and mixer contracts:
          </p>

          {/* Tactical Matrix Heatmap Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-code text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="p-2">DAY</th>
                  <th className="p-2 text-center">00:00 - 04:00</th>
                  <th className="p-2 text-center">04:00 - 08:00</th>
                  <th className="p-2 text-center">08:00 - 12:00</th>
                  <th className="p-2 text-center">12:00 - 16:00</th>
                  <th className="p-2 text-center">16:00 - 20:00</th>
                  <th className="p-2 text-center">20:00 - 24:00</th>
                </tr>
              </thead>
              <tbody>
                {THREAT_ACTIVITY_HEATMAP.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-900/80 hover:bg-slate-900/30">
                    <td className="p-2 font-bold text-slate-300">{row.day}</td>
                    {(['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'] as const).map(slot => {
                      const val = (row as any)[slot];
                      const opacity = Math.min(1, Math.max(0.1, val / 280));
                      return (
                        <td key={slot} className="p-1.5 text-center">
                          <div
                            className="py-1.5 px-2 rounded font-bold text-[11px] transition-all"
                            style={{
                              backgroundColor: `rgba(6, 182, 212, ${opacity * 0.7})`,
                              color: opacity > 0.4 ? '#ffffff' : '#94a3b8',
                              border: opacity > 0.6 ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid transparent'
                            }}
                          >
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Low Activity (0-40)</span>
            <div className="flex items-center gap-1">
              <span className="w-4 h-2 rounded bg-cyan-950"></span>
              <span className="w-4 h-2 rounded bg-cyan-800"></span>
              <span className="w-4 h-2 rounded bg-cyan-600"></span>
              <span className="w-4 h-2 rounded bg-cyan-400"></span>
            </div>
            <span>High Intensity Surge (200+)</span>
          </div>
        </div>

        {/* Right: Risk Distribution & Data Sources (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Distribution Bar Chart */}
          <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Risk Score Distribution
              </h3>
              <span className="text-[10px] text-[#38bdf8] font-bold">127 ACTORS</span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RISK_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="range" stroke="#475569" fontSize={9} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#030a1a',
                      borderColor: '#1e90ff',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="count" fill="#1e90ff" radius={[4, 4, 0, 0]}>
                    {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intelligence Source Distribution */}
          <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Intelligence Feeds Ingestion
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">4,821 IOCs</span>
            </div>

            <div className="space-y-2 text-xs">
              {SOURCE_DISTRIBUTION_DATA.map((src, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">{src.name}</span>
                    <span className="text-[#38bdf8] font-bold">{src.value}%</span>
                  </div>
                  <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${src.value}%`, backgroundColor: src.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Entity Centrality Leaderboard */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Connected Entities & Graph Centrality Metrics
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">DEGREE & BETWEENNESS CENTRALITY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono-code text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                <th className="p-2.5">RANK</th>
                <th className="p-2.5">ENTITY NAME</th>
                <th className="p-2.5">TYPE</th>
                <th className="p-2.5">DEGREE (CONNECTIONS)</th>
                <th className="p-2.5">BETWEENNESS CENTRALITY</th>
                <th className="p-2.5">THREAT STATUS</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {topCentralEntities.map(item => (
                <tr key={item.rank} className="border-b border-slate-900 hover:bg-slate-900/40">
                  <td className="p-2.5 font-bold text-cyan-400">#{item.rank}</td>
                  <td className="p-2.5 font-bold text-white">{item.name}</td>
                  <td className="p-2.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-2.5 font-semibold text-cyan-300">{item.degree} links</td>
                  <td className="p-2.5 text-purple-300 font-semibold">{item.betweenness}</td>
                  <td className="p-2.5">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">
                      {item.risk}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => {
                        if (item.type === 'ACTOR') {
                          onSelectActor(item.name);
                          onNavigateToModule('ACTOR_INTELLIGENCE');
                        } else {
                          onNavigateToModule('THREAT_GRAPH');
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      Inspect <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
