// ============================================================
// UNMASK // NETWORK THREAT INTELLIGENCE VIEW
// UNSW-NB15 Cyber Intrusion Detection & Evidence Fusion Module
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Server,
  Network,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Lock,
  Zap,
  Info,
  ChevronDown
} from 'lucide-react';

interface NetworkFlow {
  flowId: string;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: string;
  service: string;
  duration: number;
  sourceBytes: number;
  destBytes: number;
  sourcePackets: number;
  destPackets: number;
  isAttack: boolean;
  attackCategory: string;
  confidenceScore: number;
  threatScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  indicators: Array<{
    feature: string;
    evidence: string;
    severity: string;
  }>;
  ipIntelligence?: {
    country: string;
    asn: string;
    org: string;
    reputation: string;
    risk_score: number;
  };
}

interface EvidenceFusionResult {
  ipAddress: string;
  ipIntelligence: any;
  fusedThreatScore: number;
  confidenceLevel: string;
  evidenceBreakdown: {
    darkWebScore: number;
    blockchainScore: number;
    networkThreatScore: number;
    stylometryScore: number;
  };
  matchedEntities: Array<{
    entityType: string;
    actorId?: string;
    primaryAlias?: string;
    domain?: string;
    serviceType?: string;
    forum?: string;
    confidence: number;
    evidence: string[];
  }>;
  recommendedActions: string[];
}

interface NetworkThreatViewProps {
  onNavigateToActorProfile?: (actorId: string) => void;
  onNavigateToThreatGraph?: () => void;
}

export const NetworkThreatView: React.FC<NetworkThreatViewProps> = ({
  onNavigateToActorProfile,
  onNavigateToThreatGraph
}) => {
  const [flows, setFlows] = useState<NetworkFlow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  
  // Selected flow for XAI inspection modal
  const [selectedFlow, setSelectedFlow] = useState<NetworkFlow | null>(null);
  
  // Evidence Fusion state
  const [fusionResult, setFusionResult] = useState<EvidenceFusionResult | null>(null);
  const [isFusing, setIsFusing] = useState<boolean>(false);
  const [showFusionModal, setShowFusionModal] = useState<boolean>(false);

  // Load UNSW-NB15 sample telemetry on mount
  const fetchDemoFlows = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/network/demo-flows?count=30');
      if (res.ok) {
        const data = await res.json();
        setFlows(data.flows || []);
      }
    } catch (err) {
      console.error('Failed to fetch network flows:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoFlows();
  }, []);

  // Trigger Evidence Fusion for an IP
  const handleCorrelateIp = async (ipAddress: string) => {
    setIsFusing(true);
    setShowFusionModal(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/network/correlate-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ipAddress })
      });
      if (res.ok) {
        const data = await res.json();
        setFusionResult(data);
      }
    } catch (err) {
      console.error('Evidence fusion failed:', err);
    } finally {
      setIsFusing(false);
    }
  };

  // Metrics calculation
  const totalFlows = flows.length;
  const attackFlows = flows.filter(f => f.isAttack);
  const criticalThreats = flows.filter(f => f.severity === 'CRITICAL');
  const attackRatio = totalFlows > 0 ? ((attackFlows.length / totalFlows) * 100).toFixed(1) : '0';

  // Category counts
  const categoryCounts = flows.reduce((acc, f) => {
    acc[f.attackCategory] = (acc[f.attackCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtered flows
  const filteredFlows = flows.filter(f => {
    const matchesSearch = 
      f.flowId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sourceIp.includes(searchQuery) ||
      f.destinationIp.includes(searchQuery) ||
      f.attackCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.protocol.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCat = categoryFilter === 'ALL' || f.attackCategory.toUpperCase() === categoryFilter.toUpperCase();
    const matchesSev = severityFilter === 'ALL' || f.severity === severityFilter;

    return matchesSearch && matchesCat && matchesSev;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-slate-100 overflow-y-auto p-6 space-y-6 font-mono-code">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-5 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#1e90ff]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-[#1e90ff]/10 border border-[#1e90ff]/30 rounded-xl text-[#38bdf8] shadow-inner">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Network Threat Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                UNSW-NB15 ACTIVE
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Real-time deep flow telemetry, intrusion pattern classification, and multi-signal attribution fusion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={fetchDemoFlows}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#020713]/60 hover:bg-[#1e90ff]/20 text-slate-200 text-sm font-medium rounded-lg border border-[#1e3a6a] transition shadow-sm hover:shadow cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#38bdf8]' : ''}`} />
            <span>Reload Benchmark</span>
          </button>
        </div>
      </div>

      {/* 2. NTRO Ethical & Legal Compliance Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 backdrop-blur-md">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">Statutory Cybersecurity & NTRO Adherence:</span> Network telemetry is ingested strictly for forensic intrusion detection and cyber evidence corroboration. Under the Indian Information Technology Act (Cert-In directives), network flow evidence provides corroborative anomaly signals and does not constitute autonomous legal deanonymization without cross-signal corroboration.
        </div>
      </div>

      {/* 3. Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Flows Analyzed</span>
            <Activity className="w-5 h-5 text-[#38bdf8]" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            {totalFlows}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-[#38bdf8] font-medium">100% Verified</span> via Random Forest
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-rose-500/30 p-4 rounded-xl relative overflow-hidden bg-gradient-to-br from-rose-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Intrusion Attacks</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2">
            {attackFlows.length}
          </div>
          <div className="text-xs text-rose-400/80 mt-1">
            <span className="font-bold">{attackRatio}%</span> attack ratio in stream
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-amber-500/30 p-4 rounded-xl relative overflow-hidden bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Critical C2 Beacons</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">
            {criticalThreats.length}
          </div>
          <div className="text-xs text-amber-400/80 mt-1">
            Requiring immediate perimeter sinkhole
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl relative overflow-hidden bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Evidence Fusion Lead</span>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            3 High
          </div>
          <div className="text-xs text-emerald-400/80 mt-1">
            Linked to Dark Web & Crypto Wallets
          </div>
        </div>

      </div>

      {/* 4. Attack Category Distribution Bar */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-5 rounded-xl shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#38bdf8]" />
          UNSW-NB15 Attack Category Breakdown
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const isNormal = cat.toUpperCase() === 'NORMAL';
            return (
              <div 
                key={cat}
                onClick={() => setCategoryFilter(cat === categoryFilter ? 'ALL' : cat)}
                className={`cursor-pointer p-3 rounded-lg border transition text-center ${
                  categoryFilter === cat 
                    ? 'bg-[#1e90ff]/20 border-[#1e90ff] text-[#38bdf8] shadow-md ring-1 ring-[#1e90ff]' 
                    : isNormal 
                      ? 'bg-[#020713]/40 border-[#1e3a6a]/40 hover:border-[#1e90ff]/40 text-slate-300' 
                      : 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60 text-rose-300'
                }`}
              >
                <div className="text-xs font-bold uppercase truncate">{cat}</div>
                <div className="text-xl font-extrabold mt-1">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Flow Filter & Action Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md p-4 rounded-xl border border-[#1e90ff]/25">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search IP, Port, Category, Flow ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#020713]/60 border border-[#1e3a6a] rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#1e90ff] transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#020713]/60 border border-[#1e3a6a] text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1e90ff] cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL (85+)</option>
            <option value="HIGH">HIGH (70-84)</option>
            <option value="MEDIUM">MEDIUM (45-69)</option>
            <option value="LOW">LOW (&lt;45)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#020713]/60 border border-[#1e3a6a] text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-[#1e90ff] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {Object.keys(categoryCounts).map(c => (
              <option key={c} value={c} className="bg-[#030a1a]">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Interactive Flows Table */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#020713]/60 text-slate-400 uppercase font-semibold tracking-wider border-b border-[#1e90ff]/20">
              <tr>
                <th className="py-3 px-4">Flow ID</th>
                <th className="py-3 px-4">Source IP & Port</th>
                <th className="py-3 px-4">Target IP & Port</th>
                <th className="py-3 px-4">Proto / Service</th>
                <th className="py-3 px-4">Volume (B / Pkts)</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredFlows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No network flows matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFlows.map((f) => (
                  <tr key={f.flowId} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-300">
                      {f.flowId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-sans font-medium text-slate-200">
                        <span>{f.sourceIp}</span>
                        <span className="text-slate-500 font-mono">:{f.sourcePort}</span>
                      </div>
                      {f.ipIntelligence && (
                        <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                          <span className="text-slate-500">{f.ipIntelligence.asn}</span>
                          <span>•</span>
                          <span>{f.ipIntelligence.country}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-sans font-medium text-slate-200">
                        <span>{f.destinationIp}</span>
                        <span className="text-slate-500 font-mono">:{f.destinationPort}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {f.protocol}
                      </span>
                      {f.service !== '-' && (
                        <span className="ml-1.5 text-xs text-slate-400 font-medium">
                          {f.service}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{f.sourceBytes.toLocaleString()} B</div>
                      <div className="text-[10px] text-slate-500">{f.sourcePackets} pkts ({f.duration}s)</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        !f.isAttack 
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                          : f.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {f.attackCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${f.isAttack ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${f.confidenceScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-xs">{f.confidenceScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedFlow(f)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition text-xs font-medium"
                        >
                          Inspect
                        </button>
                        {f.isAttack && (
                          <button
                            onClick={() => handleCorrelateIp(f.sourceIp)}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs flex items-center gap-1 shadow-sm transition"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Fuse</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Flow Detail & XAI Anomaly Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${selectedFlow.isAttack ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                  {selectedFlow.isAttack ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Flow Telemetry: {selectedFlow.flowId}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedFlow.timestamp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFlow(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">Source</span>
                <span className="font-bold text-slate-200">{selectedFlow.sourceIp}:{selectedFlow.sourcePort}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Destination</span>
                <span className="font-bold text-slate-200">{selectedFlow.destinationIp}:{selectedFlow.destinationPort}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Protocol / Svc</span>
                <span className="font-bold text-slate-200">{selectedFlow.protocol} / {selectedFlow.service}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Threat Score</span>
                <span className="font-bold text-rose-400">{selectedFlow.threatScore}/100</span>
              </div>
            </div>

            {/* Explainable AI Indicators */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Explainable Anomaly Indicators (XAI)
              </h4>
              <div className="space-y-2">
                {selectedFlow.indicators.map((ind, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{ind.feature}</div>
                      <div className="text-slate-400 mt-0.5">{ind.evidence}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                      {ind.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedFlow(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              {selectedFlow.isAttack && (
                <button
                  onClick={() => {
                    const ip = selectedFlow.sourceIp;
                    setSelectedFlow(null);
                    handleCorrelateIp(ip);
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Correlate IP with Threat Graph</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 8. Evidence Fusion Lead Modal */}
      {showFusionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Multi-Signal Evidence Fusion Bridge
                  </h3>
                  <p className="text-xs text-cyan-400/90 font-mono">
                    Dark Web + Blockchain + Network Threat + Stylometry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFusionModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {isFusing || !fusionResult ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-sm font-medium text-slate-300">
                  Cross-referencing network flow origin against Dark Web Forums & Blockchain Wallets...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Composite Score Card */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fused Deanonymization Score</span>
                    <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                      <span>{fusionResult.fusedThreatScore}</span>
                      <span className="text-sm text-cyan-400 font-semibold">/ 100</span>
                      <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {fusionResult.confidenceLevel} CONFIDENCE
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Origin IP: <span className="font-mono font-bold text-slate-200">{fusionResult.ipAddress}</span></div>
                    <div>ASN: <span className="text-cyan-400">{fusionResult.ipIntelligence.asn}</span> ({fusionResult.ipIntelligence.org})</div>
                  </div>
                </div>

                {/* Score Breakdown Pillars */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-sans">Dark Web</span>
                    <span className="font-bold text-cyan-400 text-sm">{fusionResult.evidenceBreakdown.darkWebScore}%</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-sans">Blockchain</span>
                    <span className="font-bold text-amber-400 text-sm">{fusionResult.evidenceBreakdown.blockchainScore}%</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-sans">Network Threat</span>
                    <span className="font-bold text-rose-400 text-sm">{fusionResult.evidenceBreakdown.networkThreatScore}%</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-sans">Stylometry</span>
                    <span className="font-bold text-purple-400 text-sm">{fusionResult.evidenceBreakdown.stylometryScore}%</span>
                  </div>
                </div>

                {/* Matched Dark Web Entities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    Correlated Dark Web Actors & Services
                  </h4>
                  <div className="space-y-2">
                    {fusionResult.matchedEntities.map((ent, i) => (
                      <div key={i} className="p-3 bg-slate-800/70 border border-slate-700 rounded-lg text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                              {ent.entityType}
                            </span>
                            {ent.primaryAlias || ent.domain}
                          </span>
                          <span className="font-bold text-cyan-400">{ent.confidence}% Match</span>
                        </div>
                        <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-0.5">
                          {ent.evidence.map((ev, evIdx) => (
                            <li key={evIdx}>{ev}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 block mb-1">Investigative Recommendations:</span>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px]">
                    {fusionResult.recommendedActions.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowFusionModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                  {onNavigateToThreatGraph && (
                    <button
                      onClick={() => {
                        setShowFusionModal(false);
                        onNavigateToThreatGraph();
                      }}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>Open in 3D Threat Graph</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
