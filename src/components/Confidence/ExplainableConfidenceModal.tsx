// ============================================================
// UNMASK // EXPLAINABLE AI ANALYSIS CONFIDENCE MODAL
// Comprehensive "Why This Score?" Multi-Signal Forensics Inspector
// NTRO Cyber Threat Intelligence Platform
// ============================================================

import React, { useState } from 'react';
import type { AnalysisConfidenceData, ConfidenceSignals } from '../../types/intelligence';
import { ConfidenceTimelineWidget } from './ConfidenceTimelineWidget';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  TrendingUp, 
  Layers, 
  Cpu, 
  Network, 
  Sliders, 
  Info, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Lock,
  Zap,
  RotateCcw
} from 'lucide-react';

interface ExplainableConfidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: AnalysisConfidenceData | null;
  onOpenGraphPivot?: (nodeId?: string) => void;
}

const DEFAULT_DEMO_DATA: AnalysisConfidenceData = {
  analysisId: 'ANL-8942',
  confidenceScore: 98.0,
  confidenceLevel: 'VERY HIGH',
  confidenceClassification: 'Very High Confidence',
  signals: {
    aliasSimilarity: 98.0,
    stylometricSimilarity: 92.0,
    behavioralSimilarity: 95.0,
    temporalCorrelation: 94.0,
    sharedIndicators: 98.0,
    graphRelationship: 96.0
  },
  weights: {
    aliasSimilarity: 0.20,
    stylometricSimilarity: 0.15,
    behavioralSimilarity: 0.15,
    temporalCorrelation: 0.15,
    sharedIndicators: 0.20,
    graphRelationship: 0.15
  },
  evidenceCount: 12,
  strongCorrelationsCount: 5,
  supportingCorrelationsCount: 3,
  primarySignals: [
    { name: 'Alias / Handle Similarity', detail: 'Cross-forum handle match (shadowfox <-> shadow_fox) across Dread and BreachForums (98%)', status: 'VERIFIED', score: 98.0 },
    { name: 'Shared Cryptographic PGP Key', detail: 'Exact 4096R PGP fingerprint match (0xDD31FFB107B3DD6287955B57D6AD04797FBCF96A) (100%)', status: 'VERIFIED', score: 100.0 },
    { name: 'Shared Controlled Wallet', detail: 'Wallet 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a co-signed in marketplace transactions (98%)', status: 'VERIFIED', score: 98.0 },
    { name: 'Writing-Style & Stylometrics', detail: 'Sentence rhythm, escrow syntax, and clean UTXO terminology match (92%)', status: 'VERIFIED', score: 92.0 },
    { name: 'Temporal Activity Alignment', detail: 'UTC 18:00-23:00 burst posting and transaction broadcast alignment (94%)', status: 'VERIFIED', score: 94.0 }
  ],
  uncertainSignals: [
    { name: 'Cross-Mixer Peeling Hops', detail: 'Target transaction routes 2 hops through intermediary mixing pool', status: 'CAVEAT', impact: 'Low Variance' }
  ],
  timeline: [
    { stage: 'Dataset Ingestion', score: 70.0, step: 1, description: 'Forum posts and profile ingestion from Dread & BreachForums', unlockedSignal: 'Direct Forum Evidence' },
    { stage: 'PGP Key Fingerprint Match', score: 90.0, step: 2, description: 'Exact PGP public key signature match across both accounts', unlockedSignal: 'Identical Key Signature (+20%)' },
    { stage: 'Wallet Co-Occurrence', score: 96.0, step: 3, description: 'Direct shared wallet 0xdd31... link in forum posts', unlockedSignal: 'Shared Deposit Address (+6%)' },
    { stage: 'Graph Cross-Correlation', score: 98.0, step: 4, description: 'Multi-hop transaction cluster linking shadowfox to shadow_fox', unlockedSignal: 'Cluster Topology Link (+2%)' }
  ],
  edges: [
    { source: 'shadowfox', target: '0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a', relationshipType: 'ASSOCIATED_WALLET', confidenceScore: 98.0, confidenceLevel: 'VERY HIGH', evidenceCount: 14, sourceCategory: 'Dataset Ingestion', lastObserved: '2026-09-04T12:00:00Z', explanation: 'Direct deposit address referenced in forum post signature.' },
    { source: 'shadowfox', target: 'shadow_fox', relationshipType: 'CORRELATED_ACTOR', confidenceScore: 98.0, confidenceLevel: 'VERY HIGH', evidenceCount: 18, sourceCategory: 'Multi-Signal Correlation', lastObserved: '2026-09-03T18:30:00Z', explanation: 'Shared PGP public key 0xDD31FFB1... and common wallet address.' },
    { source: 'shadowfox', target: 'dread', relationshipType: 'MEMBER_OF', confidenceScore: 95.0, confidenceLevel: 'VERY HIGH', evidenceCount: 22, sourceCategory: 'Forum Profiles', lastObserved: '2026-09-01T09:15:00Z', explanation: 'Active verified account profile registered on Dread marketplace.' }
  ],
  disclaimer: 'Confidence score represents analytical correlation based on available evidence and does not constitute definitive proof of identity.',
  terminology: 'The available evidence indicates a very high-confidence correlation between these entities.'
};

export const ExplainableConfidenceModal: React.FC<ExplainableConfidenceModalProps> = ({
  isOpen,
  onClose,
  data = DEFAULT_DEMO_DATA,
  onOpenGraphPivot
}) => {
  const currentData = data || DEFAULT_DEMO_DATA;
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SIGNALS' | 'EVIDENCE' | 'TIMELINE' | 'GRAPH_EDGES' | 'SIMULATOR'>('OVERVIEW');
  
  // Dynamic Simulator State
  const [simSignals, setSimSignals] = useState<ConfidenceSignals>({ ...currentData.signals });

  if (!isOpen) return null;

  const simOverallScore = Math.round((
    simSignals.aliasSimilarity * (currentData.weights?.aliasSimilarity || 0.20) +
    simSignals.stylometricSimilarity * (currentData.weights?.stylometricSimilarity || 0.15) +
    simSignals.behavioralSimilarity * (currentData.weights?.behavioralSimilarity || 0.15) +
    simSignals.temporalCorrelation * (currentData.weights?.temporalCorrelation || 0.15) +
    simSignals.sharedIndicators * (currentData.weights?.sharedIndicators || 0.20) +
    simSignals.graphRelationship * (currentData.weights?.graphRelationship || 0.15)
  ) * 10) / 10;

  const getTierBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: '90–100% → VERY HIGH CONFIDENCE',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        barColor: 'bg-emerald-400'
      };
    }
    if (score >= 75) {
      return {
        label: '75–89% → HIGH CONFIDENCE',
        color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
        barColor: 'bg-cyan-400'
      };
    }
    if (score >= 50) {
      return {
        label: '50–74% → MODERATE CONFIDENCE',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        barColor: 'bg-amber-400'
      };
    }
    return {
      label: 'BELOW 50% → LOW CONFIDENCE',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
      barColor: 'bg-rose-400'
    };
  };

  const currentTier = getTierBadge(currentData.confidenceScore);

  const signalItems = [
    { key: 'aliasSimilarity', label: 'Username / Alias Similarity', score: currentData.signals.aliasSimilarity, weight: '20%', desc: 'Lexical, phonetic and permutation distance across dark web forums' },
    { key: 'stylometricSimilarity', label: 'Writing Style Similarity', score: currentData.signals.stylometricSimilarity, weight: '15%', desc: 'NLP sentence rhythm, vocabulary richness and punctuation entropy' },
    { key: 'behavioralSimilarity', label: 'Posting & TTP Behavior', score: currentData.signals.behavioralSimilarity, weight: '15%', desc: 'Ransom format, toolchains and message timing frequencies' },
    { key: 'temporalCorrelation', label: 'Temporal Pattern & Timezone', score: currentData.signals.temporalCorrelation, weight: '15%', desc: 'Diurnal UTC activity bursts and transaction broadcast sync' },
    { key: 'sharedIndicators', label: 'Shared Indicators (IOCs)', score: currentData.signals.sharedIndicators, weight: '20%', desc: 'Crypto wallets, Tor onion endpoints and PGP key signatures' },
    { key: 'graphRelationship', label: 'Graph Relationship Strength', score: currentData.signals.graphRelationship, weight: '15%', desc: 'K-hop graph proximity, clustering coefficient and mixer flows' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono-code overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#081020] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-[#0a1428] to-purple-950/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wider uppercase font-display-tactical">
                  AI Analysis Confidence & Scoring Engine
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  {currentData.analysisId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explainable Multi-Domain Forensic Attribution & Correlation Scoring Model
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Hero Banner — Score & Tier Display */}
        <div className="p-4 md:p-6 bg-[#040813] border-b border-cyan-500/20 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Main Score Gauge */}
          <div className="md:col-span-5 flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-[#081226] border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <div className="text-center">
                <span className="text-2xl md:text-3xl font-bold text-white font-display-tactical">
                  {currentData.confidenceScore}%
                </span>
                <span className="text-[9px] text-cyan-400 uppercase font-bold block">
                  CONFIDENCE
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${currentTier.color}`}>
                  {currentData.confidenceClassification.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                {currentData.terminology}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="md:col-span-7 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#081226] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Evidence Signals</span>
              <span className="text-sm font-bold text-cyan-300">{currentData.evidenceCount} Tracked</span>
            </div>
            <div className="bg-[#081226] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Strong Correlations</span>
              <span className="text-sm font-bold text-emerald-400">{currentData.strongCorrelationsCount} Signals (≥85%)</span>
            </div>
            <div className="bg-[#081226] p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Supporting / Caveats</span>
              <span className="text-sm font-bold text-amber-400">{currentData.supportingCorrelationsCount} Signals</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cyan-500/20 bg-[#060c1c] px-4 overflow-x-auto space-x-1">
          {[
            { id: 'OVERVIEW', label: 'Overview & Formula' },
            { id: 'SIGNALS', label: 'Why This Score? (Signals)' },
            { id: 'EVIDENCE', label: 'Primary vs Caveat Signals' },
            { id: 'TIMELINE', label: 'Confidence Timeline' },
            { id: 'GRAPH_EDGES', label: 'Graph Edge Confidence' },
            { id: 'SIMULATOR', label: 'Live Signal Simulator' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 tracking-wider shrink-0 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 max-h-[58vh]">
          
          {/* TAB 1: OVERVIEW & FORMULA */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-5">
              {/* Formula Card */}
              <div className="bg-[#050b18] p-4 rounded-xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>MATHEMATICAL CONFIDENCE FORMULATION</span>
                </div>
                <div className="bg-[#02050e] p-3 rounded-lg border border-slate-800 text-cyan-400 text-xs font-bold overflow-x-auto">
                  <code>Overall Confidence = (Alias × 0.20) + (Stylometrics × 0.15) + (Behavioral × 0.15) + (Temporal × 0.15) + (IOCs × 0.20) + (Graph × 0.15)</code>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The UNMASK Confidence Scoring Engine computes an analytical correlation percentage from 6 discrete forensic pillars. Weights are dynamically calibrated to prevent false certainty while preserving high sensitivity to darknet de-anonymization markers.
                </p>
              </div>

              {/* Classification Tiers Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Classification Tiers Standard
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#050b18] rounded-lg border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold block">90% – 100%</span>
                    <span className="text-xs font-bold text-white">Very High Confidence</span>
                    <p className="text-[10px] text-slate-400">Multiple concordant cryptographic and behavioral proofs.</p>
                  </div>
                  <div className="p-3 bg-[#050b18] rounded-lg border border-cyan-500/30 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold block">75% – 89%</span>
                    <span className="text-xs font-bold text-white">High Confidence</span>
                    <p className="text-[10px] text-slate-400">Strong analytical correlation across core forensic vectors.</p>
                  </div>
                  <div className="p-3 bg-[#050b18] rounded-lg border border-amber-500/30 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">50% – 74%</span>
                    <span className="text-xs font-bold text-white">Moderate Confidence</span>
                    <p className="text-[10px] text-slate-400">Circumstantial alignment; additional tracing advised.</p>
                  </div>
                  <div className="p-3 bg-[#050b18] rounded-lg border border-rose-500/30 space-y-1">
                    <span className="text-[10px] text-rose-400 font-bold block">&lt; 50%</span>
                    <span className="text-xs font-bold text-white">Low Confidence</span>
                    <p className="text-[10px] text-slate-400">Sparse signals; unverified heuristic data.</p>
                  </div>
                </div>
              </div>

              {/* Quick Timeline Preview */}
              <ConfidenceTimelineWidget timeline={currentData.timeline} currentScore={currentData.confidenceScore} />
            </div>
          )}

          {/* TAB 2: WHY THIS SCORE? (SIGNALS) */}
          {activeTab === 'SIGNALS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Contributing Evidence Signals (Why this score?)
                </h4>
                <span className="text-[10px] text-slate-400">WEIGHTED SUM: {currentData.confidenceScore}%</span>
              </div>

              <div className="space-y-3">
                {signalItems.map(item => (
                  <div key={item.key} className="p-3.5 bg-[#050b18] rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">{item.label}</span>
                        <span className="text-[10px] text-slate-500">Weight: {item.weight}</span>
                      </div>
                      <span className="font-bold text-cyan-300 font-display-tactical text-sm">
                        {item.score}%
                      </span>
                    </div>

                    {/* Progress Bar Gauge */}
                    <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score >= 85 ? 'bg-cyan-400' : item.score >= 70 ? 'bg-blue-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRIMARY VS CAVEAT SIGNALS */}
          {activeTab === 'EVIDENCE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Primary Verified Signals */}
              <div className="bg-[#050b18] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PRIMARY VERIFIED SIGNALS ({currentData.primarySignals.length})</span>
                </div>
                <div className="space-y-2.5">
                  {currentData.primarySignals.map((sig, idx) => (
                    <div key={idx} className="p-2.5 bg-[#030712] rounded-lg border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-emerald-400">✓</span> {sig.name}
                        </span>
                        <span className="text-emerald-400 font-bold">{sig.score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {sig.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Uncertain Signals & Caveats */}
              <div className="bg-[#050b18] p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>UNCERTAIN SIGNALS & CAVEATS ({currentData.uncertainSignals.length})</span>
                </div>
                <div className="space-y-2.5">
                  {currentData.uncertainSignals.map((sig, idx) => (
                    <div key={idx} className="p-2.5 bg-[#030712] rounded-lg border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>⚠</span> {sig.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                          {sig.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {sig.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIDENCE TIMELINE */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-4">
              <ConfidenceTimelineWidget timeline={currentData.timeline} currentScore={currentData.confidenceScore} />
              
              <div className="p-4 bg-[#050b18] rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  How New Evidence Updates the Confidence Score
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As intelligence analysts attach forensic evidence files, verify transaction hashes, or link onion hidden services, the UNMASK AI correlator ingests the new telemetry and recalculates the overall confidence score in real time.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: GRAPH EDGE CONFIDENCE */}
          {activeTab === 'GRAPH_EDGES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Graph Relationship Edge Confidence ({currentData.edges?.length || 0})
                </h4>
                {onOpenGraphPivot && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGraphPivot();
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                  >
                    <span>Inspect in 3D Threat Graph</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {currentData.edges && currentData.edges.length > 0 ? (
                  currentData.edges.map((edge, idx) => (
                    <div key={idx} className="p-3.5 bg-[#050b18] rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-cyan-300">{edge.source}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-bold text-purple-300">{edge.target}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {edge.relationshipType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="font-bold text-emerald-400 font-display-tactical">
                          {edge.confidenceScore}% ({edge.confidenceLevel})
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {edge.explanation}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
                        <span>Source: {edge.sourceCategory} • {edge.evidenceCount} Signals</span>
                        <span>Observed: {edge.lastObserved}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No discrete graph edge overrides registered for this analysis ID.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE SIGNAL SIMULATOR */}
          {activeTab === 'SIMULATOR' && (
            <div className="space-y-5 bg-[#050b18] p-4 rounded-xl border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                  <Sliders className="w-4 h-4" />
                  <span>DYNAMIC SIGNAL SIMULATOR</span>
                </div>
                <button
                  onClick={() => setSimSignals({ ...currentData.signals })}
                  className="px-2.5 py-1 text-[10px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="p-3 bg-[#02050e] rounded-xl border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Simulated Overall Confidence</span>
                  <span className="text-xl font-bold text-white font-display-tactical">
                    {simOverallScore}%
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-md border ${getTierBadge(simOverallScore).color}`}>
                  {getTierBadge(simOverallScore).label}
                </span>
              </div>

              {/* Interactive Signal Sliders */}
              <div className="space-y-3">
                {Object.entries(simSignals).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-cyan-300 font-bold">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={99}
                      value={val}
                      onChange={e => setSimSignals(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer & Mandatory Disclaimer */}
        <div className="p-4 bg-[#040813] border-t border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-start space-x-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">DISCLAIMER:</strong> {currentData.disclaimer}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
