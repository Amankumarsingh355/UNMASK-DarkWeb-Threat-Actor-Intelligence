// ============================================================
// PAGE 1 — COMMAND CENTER VIEW
// Tactical SOC & Cyber Intelligence Overview
// ============================================================

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Binary, 
  Network, 
  FolderGit2, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Activity, 
  ChevronRight, 
  Sparkles, 
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Radio,
  Upload,
  Target,
  Crosshair,
  Key,
  Wallet,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download
} from 'lucide-react';
import { ThreatGraph3D } from '../components/ThreatGraph/ThreatGraph3D';
import { ExplainableConfidenceModal } from '../components/Confidence/ExplainableConfidenceModal';
import { useDataset } from '../context/DatasetContext';
import { IntelligenceExporter } from '../services/intelligenceExporter';
import type { GraphNode, GraphLink, AnalysisConfidenceData } from '../types/intelligence';
import { ApiClient } from '../services/apiClient';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CommandCenterViewProps {
  onNavigateToModule: (module: any) => void;
  onSelectActor: (actorName: string) => void;
  onFocusGraphActor: (actorName: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  onNavigateToModule,
  onSelectActor,
  onFocusGraphActor
}) => {
  const { 
    mode, 
    metadata, 
    nodes, 
    links, 
    stats, 
    timelineData, 
    hasTimelineData, 
    primeSuspect,
    openUploadModal, 
    resetToDemo 
  } = useDataset();

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  const [confidenceData, setConfidenceData] = useState<AnalysisConfidenceData | null>(null);
  const [graphLayout, setGraphLayout] = useState<'FORCE' | 'RINGS' | 'CLUSTER'>('FORCE');

  // Fetch AI Analysis Confidence on mount
  useEffect(() => {
    const fetchConfidence = async () => {
      const res = await ApiClient.getAnalysisConfidence('ANL-8942');
      if (res) {
        setConfidenceData(res);
      }
    };
    fetchConfidence();
  }, []);

  const totalIndicators = stats.walletsCount + stats.pgpCount + stats.domainsCount + stats.ipsCount + stats.platformsCount;

  const metrics = [
    {
      id: 'm1',
      title: 'Total actors',
      value: String(stats.actorsCount || 127),
      change: mode === 'LIVE' ? 'Dynamic dataset' : '↑ 14 this month',
      changeColor: 'text-emerald-400',
      icon: Users,
      iconColor: 'text-slate-400',
      onClick: () => onNavigateToModule('ACTOR_INTELLIGENCE')
    },
    {
      id: 'm2',
      title: 'High-risk actors',
      value: String(stats.highRiskCount || 18),
      change: mode === 'LIVE' ? 'Evaluated risk signals' : '↑ 3 critical alerts',
      changeColor: 'text-rose-400',
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      onClick: () => onNavigateToModule('ACTOR_INTELLIGENCE')
    },
    {
      id: 'm3',
      title: 'Indicators ingested',
      value: totalIndicators > 0 ? totalIndicators.toLocaleString() : '4,821',
      change: mode === 'LIVE' ? 'Multi-entity telemetry' : '↑ 512 today',
      changeColor: 'text-emerald-400',
      icon: Binary,
      iconColor: 'text-slate-400',
      onClick: () => onNavigateToModule('SEARCH')
    },
    {
      id: 'm4',
      title: 'Relationships',
      value: String(stats.edgesCount || 736),
      change: mode === 'LIVE' ? 'Deterministic edges' : '68% avg confidence',
      changeColor: 'text-cyan-400',
      icon: Network,
      iconColor: 'text-slate-400',
      onClick: () => setIsConfidenceModalOpen(true)
    },
    {
      id: 'm5',
      title: 'Active cases',
      value: '12',
      change: 'INV-1027 priority',
      changeColor: 'text-sky-400',
      icon: FolderGit2,
      iconColor: 'text-slate-400',
      onClick: () => onNavigateToModule('INVESTIGATIONS')
    },
    {
      id: 'm6',
      title: 'Critical alerts',
      value: String(Math.max(1, Math.min(12, stats.highRiskCount || 6))),
      change: 'Action required',
      changeColor: 'text-rose-400',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      onClick: () => onNavigateToModule('ALERTS')
    }
  ];

  const liveFeedItems = [
    {
      id: 'f1',
      severity: 'CRITICAL',
      severityColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      timestamp: '2m ago',
      title: 'Coordinated activity pattern detected',
      description: 'Synchronized transaction bursts and PGP public key cross-posting observed between shadowfox and shadow_fox accounts.',
      tag: 'SHADOWFOX ↔ SHADOW_FOX',
      actorName: 'shadowfox'
    },
    {
      id: 'f2',
      severity: 'HIGH',
      severityColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      timestamp: '14m ago',
      title: 'Cryptographic identity match confirmed (98%)',
      description: "Exact 4096R PGP fingerprint match between Dread forum persona 'shadowfox' and BreachForums alias 'shadow_fox'.",
      tag: '0xDD31FFB1 · PGP-MATCH',
      actorName: 'shadowfox'
    },
    {
      id: 'f3',
      severity: 'MEDIUM',
      severityColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      timestamp: '1h ago',
      title: 'New wallet relationship discovered',
      description: 'Direct high-value transaction of 12.8 ETH routed from 0xdd31ffb1... to counterparty address in dataset.',
      tag: '0xdd31ffb1... · ETH-TRANSFER',
      actorName: 'shadowfox'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1920px] mx-auto">
      {/* 1. Critical Alert Banner */}
      <div className="p-3.5 md:px-5 md:py-3.5 bg-rose-950/20 backdrop-blur-md border border-rose-500/35 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.12)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-rose-950/40 flex items-center justify-center shrink-0 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]">
            <AlertTriangle className="w-4 h-4 text-[#f04438]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#f04438] tracking-wide font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                CRITICAL ALERT · ALT-4402
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate">
              Coordinated multi-actor activity surge detected across shadowfox and correlated infrastructure.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigateToModule('ALERTS')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold transition-all shadow-[0_0_18px_rgba(240,68,56,0.45)] flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Investigate alert</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top 6 Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={m.onClick}
              className="p-4 hud-card-interactive rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                  {m.title}
                </span>
                <Icon className={`w-4 h-4 ${m.iconColor} group-hover:text-[#38bdf8] transition-colors`} />
              </div>

              <div className="my-2">
                <div className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(30,144,255,0.4)]">
                  {m.value}
                </div>
              </div>

              <div className="text-[11px] font-medium flex items-center justify-between">
                <span className={m.changeColor}>
                  {m.change}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎯 FINAL ATTRIBUTION OUTPUT // PRIME SUSPECT IDENTIFICATION SPOTLIGHT */}
      <div className="bg-gradient-to-r from-[#04102b] via-[#06183d] to-[#030c22] border-2 border-[#1e90ff]/60 rounded-2xl p-5 shadow-[0_0_30px_rgba(30,144,255,0.3)] space-y-4 font-mono-code relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1e90ff]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Tagline & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e90ff]/30 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Crosshair className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                  FINAL ATTRIBUTION OUTPUT
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  // Prime Suspect De-anonymization Result
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Automated multi-signal attribution has converged on the primary human threat operator.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Attribution Confidence</span>
              <span className="text-xl font-black text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                {primeSuspect ? `${primeSuspect.confidenceScore.toFixed(1)}%` : '98.0%'}
              </span>
            </div>
            
            <button
              onClick={() => {
                if (primeSuspect) {
                  IntelligenceExporter.downloadSuspectAttributionCSV(
                    primeSuspect,
                    [],
                    metadata?.fileName || 'UNMASK_Investigation'
                  );
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              title="Download suspect findings and grounded evidence chain as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Findings (.CSV)</span>
            </button>

            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold">
              {mode === 'LIVE' ? 'LIVE DATASET ATTRIBUTION' : 'VERIFIED BEYOND REASONABLE DOUBT'}
            </span>
          </div>
        </div>

        {/* Main Suspect Card with "The Why" Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left: Suspect Core Identity (4 cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#020713]/70 border border-[#1e3a6a]/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Suspect Rank #{primeSuspect?.rank || 1}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                (primeSuspect?.riskLevel || 'HIGH') === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {primeSuspect?.riskLevel || 'HIGH'} THREAT ({primeSuspect?.riskScore || 78}/100)
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-white font-mono tracking-wider text-cyan-200">
                {primeSuspect?.name || 'shadowfox'}
              </div>
              <div className="text-xs text-slate-300">
                {primeSuspect?.category || 'Cryptocurrency Drainer & Exploit Broker'}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {mode === 'LIVE' 
                ? (primeSuspect?.why || `Primary threat actor identified across ${primeSuspect?.recordCount || 1} records and ${primeSuspect?.connectionsCount || 1} topological connections in uploaded dataset.`)
                : 'Attributed operator behind multiple multi-forum drainer operations and BlackMarket forum escrow exploits.'}
            </p>

            <div className="pt-1 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  if (primeSuspect) {
                    onSelectActor(primeSuspect.name);
                  }
                  onNavigateToModule('ACTOR_INTELLIGENCE');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(30,144,255,0.4)] cursor-pointer"
              >
                <span>Inspect Full Dossier & Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (primeSuspect) {
                    IntelligenceExporter.downloadSuspectAttributionCSV(
                      primeSuspect,
                      [],
                      metadata?.fileName || 'UNMASK_Investigation'
                    );
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                title="Download suspect findings and grounded evidence chain as CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Suspect (.CSV)</span>
              </button>
            </div>
          </div>

          {/* Right: The "Why" Evidence Proof (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-xl bg-[#020713]/50 border border-[#1e3a6a]/60 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyan-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                {mode === 'LIVE' 
                  ? 'The "Why" — Evidence Derived Directly From Uploaded CSV:'
                  : 'The "Why" — Grounded Multi-Signal Evidence Chain:'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {mode === 'LIVE' 
                  ? `${primeSuspect?.reasons?.length || 0} Grounded Evidence Signals`
                  : 'Based on 5 Orthogonal Telecom/Crypto Signals'}
              </span>
            </div>

            {mode === 'LIVE' && primeSuspect?.reasons ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {primeSuspect.reasons.map((reason, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#030919] border border-cyan-500/20 space-y-1">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Signal #{idx + 1}
                      </span>
                      <p className="text-[11px] text-slate-200 leading-snug">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>

                {primeSuspect.associatedEntities && primeSuspect.associatedEntities.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Linked Indicators:</span>
                    {primeSuspect.associatedEntities.map((ent, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1">
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold">{ent.type}</span>
                        <span className="truncate max-w-[140px]">{ent.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#030919] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                    <Key className="w-3 h-3" /> 1. Cryptographic PGP Match (+35%)
                  </span>
                  <p className="text-[11px] text-slate-300 font-mono truncate" title="3A51BFA53BEDBF12EFD852A5EA9640169DB1832B">
                    Fingerprint: 3A51BFA5...9DB1832B
                  </p>
                  <span className="text-[10px] text-slate-400">Published openly on BlackMarket Forum</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#030919] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> 2. Financial Wallet Trace (+25%)
                  </span>
                  <p className="text-[11px] text-slate-300 font-mono truncate" title="0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17">
                    Wallet: 0xdd31ffb1...5c214a17
                  </p>
                  <span className="text-[10px] text-slate-400">12.4 ETH • 3 Mixer Peeling Hops Detected</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#030919] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
                    <FileText className="w-3 h-3" /> 3. NLP Writeprint Subconscious Habit (+15%)
                  </span>
                  <p className="text-[11px] text-slate-300 italic truncate" title="prefers short factual replies when a thread gets noisy">
                    "prefers short factual replies..."
                  </p>
                  <span className="text-[10px] text-slate-400">Character n-gram & punctuation entropy match</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#030919] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 4. Circadian Sleep Cycle Window (+10%)
                  </span>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Activity: 18:00 - 02:00 UTC
                  </p>
                  <span className="text-[10px] text-slate-400">Aligns with UTC+3 European timezone cluster</span>
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
              <span>Looking for other actors?</span>
              <button
                onClick={() => onNavigateToModule('ACTOR_INTELLIGENCE')}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
              >
                <span>View Full Ranked Suspects List ({stats.actorsCount || 127} actors)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout: Threat Relationship Graph (8 cols) + Live Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Threat Relationship Graph Card (8 cols) */}
        <div className="lg:col-span-8 hud-card rounded-xl overflow-hidden flex flex-col shadow-xl">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-[#1e90ff]/20 bg-[#020713]/30 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[#00BFFF] font-bold text-sm animate-pulse">✱</span>
              <h2 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
                Threat Relationship Graph HUD
              </h2>
            </div>
            <button
              onClick={() => onNavigateToModule('THREAT_GRAPH')}
              className="text-xs text-[#60a5fa] hover:text-[#93c5fd] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>Full screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-bar: Stats & Layout Selector Capsule */}
          <div className="px-4 py-2.5 bg-[#020612]/30 backdrop-blur-md border-b border-[#1e90ff]/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="font-semibold text-[#38bdf8] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                {nodes.length} nodes
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-semibold text-purple-300">{links.length} edges</span>
              <span className="text-slate-600">·</span>

              {mode === 'LIVE' ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  ● LIVE DATASET
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/40 text-[10px] font-bold shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                  ● DEMO DATA
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Upload Dataset Button */}
              <button
                onClick={openUploadModal}
                className="px-2.5 py-1 rounded-lg hud-button-primary text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Dataset</span>
              </button>

              <div className="flex items-center bg-[#020713]/50 backdrop-blur-sm p-0.5 rounded-lg border border-[#1e3a6a] text-xs">
                <button
                  onClick={() => setGraphLayout('FORCE')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    graphLayout === 'FORCE'
                      ? 'bg-[#1e90ff] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Force
                </button>
                <button
                  onClick={() => setGraphLayout('RINGS')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    graphLayout === 'RINGS'
                      ? 'bg-[#1e90ff] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Rings
                </button>
                <button
                  onClick={() => setGraphLayout('CLUSTER')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    graphLayout === 'CLUSTER'
                      ? 'bg-[#1e90ff] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Risk cluster
                </button>
              </div>

              <button
                onClick={() => onNavigateToModule('THREAT_GRAPH')}
                className="px-2.5 py-1 rounded-lg bg-[#020713]/50 hover:bg-[#081a38]/60 border border-[#1e3a6a] text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* 3D Graph Canvas (Transparent background floating above HUD background) */}
          <div className="h-[460px] w-full relative bg-transparent">
            <ThreatGraph3D
              nodes={nodes}
              links={links}
              selectedNodeId={selectedNode?.id || null}
              selectedLinkId={selectedLink?.id || null}
              onSelectNode={setSelectedNode}
              onSelectLink={setSelectedLink}
              onPivotStep={(node) => {
                if (node.type === 'ACTOR') {
                  onSelectActor(node.name);
                }
              }}
              focusedActorName="shadowfox"
              hideTopControls={true}
            />
          </div>
        </div>

        {/* Right Column: Live Intelligence Feed (4 cols) */}
        <div className="lg:col-span-4 hud-card rounded-xl p-4 flex flex-col justify-between shadow-xl space-y-3.5 font-mono-code">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#1E90FF] shadow-[0_0_8px_#1E90FF]"></span>
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
                Live Intelligence Feed
              </h3>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Streaming</span>
            </div>
          </div>

          {/* Feed Items List */}
          <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
            {liveFeedItems.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.actorName) {
                    onSelectActor(item.actorName);
                    onNavigateToModule('ACTOR_INTELLIGENCE');
                  }
                }}
                className="p-3.5 rounded-xl bg-[#030a1a]/35 backdrop-blur-sm hover:bg-[#061430]/60 border border-[#1e3a6a]/40 hover:border-[#1e90ff]/60 cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-[0_0_15px_rgba(30,144,255,0.2)]"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${item.severityColor}`}>
                    {item.severity}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {item.timestamp}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-200 group-hover:text-[#60a5fa] transition-colors leading-snug">
                  {item.title}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-[#60a5fa] font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#081a38]/60 border border-[#1e90ff]/30">
                    {item.tag}
                  </span>
                  <span className="text-slate-400 group-hover:text-[#60a5fa] font-medium flex items-center gap-0.5 text-xs">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Target Action Button */}
          <button
            onClick={() => {
              onSelectActor('shadowfox');
              onNavigateToModule('ACTOR_INTELLIGENCE');
            }}
            className="w-full py-2.5 px-3 rounded-lg hud-button-secondary text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>Inspect primary target: shadowfox</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
        </div>
      </div>

      {/* 4. Bottom 24-Hour Threat Activity & Anomaly Timeline */}
      <div className="hud-card rounded-xl p-4 shadow-xl space-y-3 font-mono-code">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e90ff]/20 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#38bdf8]" />
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
                24-Hour Threat Activity & Anomaly Timeline
              </h3>
              <p className="text-[11px] text-slate-400">
                Hourly correlation event telemetry and temporal surge monitoring
              </p>
            </div>
          </div>

          {hasTimelineData && timelineData.length > 0 && (
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E90FF] shadow-[0_0_6px_#1E90FF]"></span>
                <span className="text-slate-200 font-medium">Total Telemetry Volume</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]"></span>
                <span className="text-purple-300 font-medium">Anomaly Indicator Surge</span>
              </div>
            </div>
          )}
        </div>

        {/* Recharts Timeline Area Chart or Unavailable Notice */}
        {hasTimelineData && timelineData.length > 0 ? (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(4, 12, 30, 0.85)', 
                    borderColor: '#1e3a6a', 
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                    boxShadow: '0 0 15px rgba(30,144,255,0.3)',
                    backdropFilter: 'blur(8px)'
                  }}
                />
                <Area type="monotone" dataKey="totalEvents" stroke="#1e90ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" name="Total Events" />
                <Area type="monotone" dataKey="anomalyScore" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAnomaly)" name="Anomaly Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 w-full flex flex-col items-center justify-center bg-[#020713]/30 backdrop-blur-sm rounded-xl border border-dashed border-[#1e3a6a] text-center p-6 space-y-2">
            <Clock className="w-8 h-8 text-amber-400/80" />
            <p className="text-xs text-amber-300 font-bold">
              Timeline unavailable — timestamp data not found.
            </p>
            <p className="text-[11px] text-slate-400 max-w-md">
              No timestamp column detected in the uploaded dataset. Upload a dataset with timestamp, time, or created_at fields to generate hourly activity histograms.
            </p>
          </div>
        )}
      </div>

      {/* Explainable AI Confidence Modal */}
      <ExplainableConfidenceModal
        isOpen={isConfidenceModalOpen}
        onClose={() => setIsConfidenceModalOpen(false)}
        data={confidenceData}
        onOpenGraphPivot={() => onNavigateToModule('THREAT_GRAPH')}
      />
    </div>
  );
};


