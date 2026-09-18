import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  User,
  Activity,
  Layers,
  ChevronRight,
  Send,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { INVESTIGATIONS, THREAT_ACTORS } from '../data/mockIntelligence';
import { ExplainableConfidenceModal } from '../components/Confidence/ExplainableConfidenceModal';
import { ConfidenceTimelineWidget } from '../components/Confidence/ConfidenceTimelineWidget';
import type { Investigation, RiskLevel } from '../types/intelligence';

interface InvestigationsViewProps {
  onNavigateToModule: (module: any) => void;
  onSelectActor: (actorName: string) => void;
  onFocusGraphActor: (actorName: string) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  onNavigateToModule,
  onSelectActor,
  onFocusGraphActor
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('INV-1027');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONFIDENCE' | 'ENTITIES' | 'TIMELINE' | 'RELATIONSHIPS' | 'EVIDENCE' | 'NOTES'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);


  const currentCase = INVESTIGATIONS.find(c => c.id === selectedCaseId) || INVESTIGATIONS[0];

  const filteredCases = INVESTIGATIONS.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.targetActorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Investigation Workspace
            </h1>
            <p className="text-xs text-slate-400">
              Active Case Tracking, Multi-Domain Correlation Evidence & Forensics Dossiers
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white text-xs font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(30,144,255,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>START INVESTIGATION</span>
          </button>
        </div>
      </div>

      {/* Case Layout: Left Case Selector (4 cols) + Right Active Dossier Tabs (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Case List Selector */}
        <div className="lg:col-span-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl p-4 flex flex-col justify-between shadow-2xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Cases ({filteredCases.length})
              </span>
              <span className="text-[10px] text-[#38bdf8] font-semibold">NTRO REGISTER</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter case ID or target..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#020713]/60 border border-[#1e3a6a] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-[#1e90ff]"
              />
            </div>

            {/* Case List Items */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredCases.map(c => {
                const isSelected = c.id === currentCase.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 backdrop-blur-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1e90ff]/20 to-[#0d1c38]/70 border-[#1e90ff] shadow-[0_0_15px_rgba(30,144,255,0.2)]'
                        : 'bg-[#020713]/40 hover:bg-[#091326]/60 border-[#1e3a6a]/40 hover:border-[#1e90ff]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38bdf8] text-xs">{c.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        c.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        c.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40'
                      }`}>
                        {c.riskLevel} RISK
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white truncate">
                      {c.title}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: <strong className="text-slate-200">{c.targetActorName}</strong></span>
                      <span className="text-emerald-400 font-bold">{c.confidenceScore}% Conf</span>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-[#1e3a6a]/40">
                      <span>{c.relatedEntitiesCount} entities • {c.alertsCount} alerts</span>
                      <span className="text-[#38bdf8]">{c.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Investigation Detailed Tabbed View */}
        <div className="lg:col-span-8 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl p-5 shadow-2xl space-y-5">
          {/* Top Dossier Header Card */}
          <div className="bg-[#020713]/50 p-4 rounded-xl border border-[#1e90ff]/20 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40">
                  {currentCase.id}
                </span>
                <h2 className="text-sm font-bold text-white">
                  {currentCase.title}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectActor(currentCase.targetActorName);
                    onFocusGraphActor(currentCase.targetActorName);
                    onNavigateToModule('THREAT_GRAPH');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Explore in 3D Graph</span>
                </button>

                <button
                  onClick={() => onNavigateToModule('REPORTS')}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            {/* Target Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Target Actor</span>
                <span 
                  onClick={() => {
                    onSelectActor(currentCase.targetActorName);
                    onNavigateToModule('ACTOR_INTELLIGENCE');
                  }}
                  className="font-bold text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {currentCase.targetActorName} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <div 
                onClick={() => setIsConfidenceModalOpen(true)}
                className="cursor-pointer group hover:bg-cyan-950/30 p-1 rounded transition-colors"
              >
                <span className="text-[10px] text-slate-400 block uppercase group-hover:text-cyan-300">
                  Correlation Confidence 🔍
                </span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  {currentCase.confidenceScore}% Multi-Signal
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Lead Analyst</span>
                <span className="text-slate-200">{currentCase.leadAnalyst}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Last Updated</span>
                <span className="text-slate-300">{currentCase.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cyan-500/20 space-x-1 overflow-x-auto">
            {(['OVERVIEW', 'CONFIDENCE', 'ENTITIES', 'TIMELINE', 'RELATIONSHIPS', 'EVIDENCE', 'NOTES'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 text-xs font-bold transition-all border-b-2 tracking-wider ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                {tab === 'CONFIDENCE' ? 'AI CONFIDENCE & EVIDENCE' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="min-h-[380px]">
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4">
                <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentCase.summary}
                  </p>
                </div>

                <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Key Investigative Findings
                  </h4>
                  <div className="space-y-2">
                    {currentCase.keyFindings.map((finding, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONFIDENCE TAB */}
            {activeTab === 'CONFIDENCE' && (
              <div className="space-y-5">
                {/* Top Summary Banner */}
                <div className="bg-[#050b18] p-4 rounded-xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400 uppercase font-bold">Analysis Confidence:</span>
                      <span className="text-xl font-bold text-emerald-400 font-display-tactical">
                        {currentCase.confidenceScore}%
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        HIGH CONFIDENCE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      The available evidence indicates a high-confidence correlation between these entities based on concordant forensic signatures.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsConfidenceModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shrink-0 flex items-center space-x-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Explainable Deep Inspector</span>
                  </button>
                </div>

                {/* "Why this score?" Signals Grid */}
                <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Contributing Evidence Signals (Why this score?)
                    </h4>
                    <span className="text-[10px] text-slate-400">FORMULA: Weighted Multi-Signal Formulation</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { name: 'Username/Alias Similarity', score: 92, weight: '20%' },
                      { name: 'Writing Style Similarity', score: 86, weight: '15%' },
                      { name: 'Posting & TTP Behavior', score: 81, weight: '15%' },
                      { name: 'Temporal Pattern Overlap', score: 89, weight: '15%' },
                      { name: 'Shared Indicators (IOCs)', score: 84, weight: '20%' },
                      { name: 'Graph Relationship Strength', score: 91, weight: '15%' }
                    ].map((sig, idx) => (
                      <div key={idx} className="p-3 bg-[#030712] rounded-lg border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-bold">{sig.name}</span>
                          <span className="text-cyan-300 font-bold font-display-tactical">{sig.score}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${sig.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 block text-right">Weight: {sig.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary vs Caveat Signals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#050b18] p-4 rounded-xl border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Primary Signals (Concordant)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> Alias similarity verified across Dread & Exploit
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> Writing-style stylometric rhythm match (86%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> Shared indicators (3 wallets + 2 onion domains)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> Temporal diurnal activity correlation (89%)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#050b18] p-4 rounded-xl border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Uncertain Signals (Caveats)</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400">⚠</span> Limited historical clearnet telemetry (&lt;180 days)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-amber-400">⚠</span> Incomplete mixer peeling chain source information
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confidence Timeline */}
                <ConfidenceTimelineWidget
                  timeline={[
                    { stage: 'Dataset Ingestion', score: 70, step: 1, description: 'Forum posts and profile ingestion from Dread & BreachForums', unlockedSignal: 'Direct Forum Evidence' },
                    { stage: 'PGP Fingerprint Match', score: 90, step: 2, description: 'Exact 4096R PGP public key signature match across account profiles', unlockedSignal: 'Identical Key Signature (+20%)' },
                    { stage: 'Wallet Co-Occurrence', score: 96, step: 3, description: 'Shared controlled deposit address referenced in forum posts', unlockedSignal: 'Shared Deposit Address (+6%)' },
                    { stage: 'Graph Cross-Correlation', score: 98, step: 4, description: 'Multi-hop transaction cluster linking shadowfox to shadow_fox', unlockedSignal: 'Cluster Topology Link (+2%)' }
                  ]}
                  currentScore={currentCase.confidenceScore}
                />

                {/* Mandatory Intelligence Disclaimer */}
                <div className="p-3 bg-[#030712] rounded-lg border border-cyan-500/20 flex items-start space-x-2 text-[11px] text-slate-400">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">CONFIDENCE DISCLAIMER:</strong> Confidence score represents analytical correlation based on available evidence and does not constitute definitive proof of identity.
                  </span>
                </div>
              </div>
            )}


            {/* ENTITIES TAB */}
            {activeTab === 'ENTITIES' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Linked Entities in Dossier ({currentCase.entities.length})</span>
                  <span className="text-cyan-400">Multi-Domain Correlated</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {currentCase.entities.map(ent => (
                    <div key={ent.id} className="p-3 bg-[#050b18] rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {ent.type}
                        </span>
                        <span className="text-[9px] text-amber-400 font-bold">{ent.risk}</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{ent.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'TIMELINE' && (
              <div className="space-y-3">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/30">
                  {currentCase.timeline.map(item => (
                    <div key={item.id} className="relative space-y-1 bg-[#050b18] p-3 rounded-lg border border-slate-800">
                      <span className="absolute -left-[27px] top-3.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#081020] shadow-[0_0_8px_#06B6D4]"></span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{item.description}</p>
                      <div className="text-[10px] text-purple-400">Involved: {item.entityInvolved}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATIONSHIPS TAB */}
            {activeTab === 'RELATIONSHIPS' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Primary evidentiary links connecting {currentCase.targetActorName} across the threat graph:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-[#050b18] rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-cyan-300 font-bold">{currentCase.targetActorName}</span>
                      <span className="text-purple-400 mx-2">→ CORRELATED ACTOR →</span>
                      <span className="text-slate-200">shadow_fox (BreachForums)</span>
                    </div>
                    <span className="text-emerald-400 font-bold">98% Conf</span>
                  </div>
                  <div className="p-3 bg-[#050b18] rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-cyan-300 font-bold">{currentCase.targetActorName}</span>
                      <span className="text-purple-400 mx-2">→ CONTROLLED WALLET →</span>
                      <span className="text-slate-200">0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a</span>
                    </div>
                    <span className="text-emerald-400 font-bold">98% Conf</span>
                  </div>
                  <div className="p-3 bg-[#050b18] rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-cyan-300 font-bold">{currentCase.targetActorName}</span>
                      <span className="text-purple-400 mx-2">→ ACTIVE MEMBER OF →</span>
                      <span className="text-slate-200">Dread & BreachForums</span>
                    </div>
                    <span className="text-emerald-400 font-bold">95% Conf</span>
                  </div>
                </div>
              </div>
            )}

            {/* EVIDENCE TAB */}
            {activeTab === 'EVIDENCE' && (
              <div className="space-y-3">
                {currentCase.evidenceList.map(ev => (
                  <div key={ev.id} className="p-3.5 bg-[#050b18] rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        {ev.title}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {ev.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{ev.description}</p>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Category: <strong className="text-purple-300">{ev.category}</strong></span>
                      <span>Verified: <strong className="text-slate-300">{ev.verifiedBy}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'NOTES' && (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {currentCase.analystNotes.map(note => (
                    <div key={note.id} className="p-3 bg-[#050b18] rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-cyan-400 font-bold">
                        <span>{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{note.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Add classified forensic observation note..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#050b18] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/40"
                  />
                  <button
                    onClick={() => {
                      if (!newNoteText.trim()) return;
                      currentCase.analystNotes.push({
                        id: `note-${Date.now()}`,
                        author: 'Analyst K. Raman',
                        date: '2026-02-24',
                        content: newNoteText
                      });
                      setNewNoteText('');
                    }}
                    className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start New Investigation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091122] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-code">
                Initialize New Investigation Dossier
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono-code">
              <div>
                <label className="text-slate-400 block mb-1">Target Threat Actor</label>
                <select className="w-full bg-[#050b18] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-cyan-500/40">
                  {THREAT_ACTORS.map(a => (
                    <option key={a.id} value={a.primaryAlias}>{a.primaryAlias} ({a.threatCategory})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Investigation Name / Operation Title</label>
                <input
                  type="text"
                  placeholder="e.g. Operation Cryptic Weaver"
                  defaultValue="Operation Night Horizon"
                  className="w-full bg-[#050b18] border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-cyan-500/40"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Threat Priority Level</label>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">CRITICAL</span>
                  <span className="px-3 py-1.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">HIGH</span>
                  <span className="px-3 py-1.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 font-bold">MEDIUM</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setSelectedCaseId('INV-1027');
                }}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
              >
                Create Case Dossier
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Explainable AI Confidence Modal */}
      <ExplainableConfidenceModal
        isOpen={isConfidenceModalOpen}
        onClose={() => setIsConfidenceModalOpen(false)}
        onOpenGraphPivot={() => {
          onFocusGraphActor(currentCase.targetActorName);
          onNavigateToModule('THREAT_GRAPH');
        }}
      />
    </div>
  );
};


