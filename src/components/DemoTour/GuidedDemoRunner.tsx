// ============================================================
// UNMASK // PLATFORM WALKTHROUGH & FEATURE TOUR
// Interactive Onboarding & Feature Discovery Experience
// ============================================================

import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Target, 
  Radio, 
  Search, 
  User, 
  Network, 
  Layers, 
  Activity, 
  Bot, 
  FileText,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Compass
} from 'lucide-react';
import type { AppModule } from '../Layout/TacticalSidebar';

export interface WalkthroughFeature {
  id: string;
  badge: string;
  title: string;
  module: AppModule;
  actorTarget?: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  keyHighlight: string;
  howToTest: string;
}

export const WALKTHROUGH_FEATURES: WalkthroughFeature[] = [
  {
    id: 'command-center',
    badge: 'Operations Telemetry',
    title: 'Tactical Command Center',
    module: 'COMMAND_CENTER',
    icon: Radio,
    tagline: 'Real-time Dark Web Ingestion & Threat Monitoring',
    description: 'Monitors authentic threat accounts, high-risk correlated entities, and indicators derived directly from UNMASK Dataset v2.3 across underground forums and blockchain ledgers.',
    keyHighlight: 'Live telemetry cards, threat event stream, and real-time coordinated activity alerts.',
    howToTest: 'Review top metrics, click on any critical alert, or view the activity timeline.'
  },
  {
    id: 'omni-search',
    badge: 'Universal Engine',
    title: 'Omni-Intelligence Search',
    module: 'SEARCH',
    actorTarget: 'shadowfox',
    icon: Search,
    tagline: 'Cross-Domain Correlation Search (Ctrl + K)',
    description: 'Instantly correlates fragmented raw indicators—pseudonymous forum aliases, crypto wallet addresses (0xdd31...), PGP fingerprints, and forum domains into unified threat profiles in under 1 second.',
    keyHighlight: 'Categorized live filtering with instant keyboard navigation (↑/↓) and direct graph pivots.',
    howToTest: 'Press Ctrl+K or use the top search bar to query target "shadowfox" or wallet "0xdd31...".'
  },
  {
    id: 'actor-dossier',
    badge: 'Target Profiling',
    title: 'Actor Intelligence Dossiers',
    module: 'ACTOR_INTELLIGENCE',
    actorTarget: 'shadowfox',
    icon: User,
    tagline: '5-Signal Holistic Threat Dossiers & Stylometrics',
    description: 'Comprehensive threat profiles featuring 5 core signal categories: Identity, Behavioral, Infrastructure, Temporal, and Blockchain on-chain ledgers.',
    keyHighlight: 'Explainable Risk Score (92/100 Very High Risk), 98% correlation confidence, and NLP Stylometric Radar charts.',
    howToTest: 'Explore the 5 signal tabs (Identity, Behavioral, Infrastructure, Temporal, Blockchain) and inspect the alias correlation table.'
  },
  {
    id: 'threat-graph',
    badge: 'Spatial Topology',
    title: '3D WebGL Threat Intelligence Graph',
    module: 'THREAT_GRAPH',
    actorTarget: 'shadowfox',
    icon: Network,
    tagline: 'Hardware-Accelerated 3D Force-Directed Network',
    description: 'A 3D spatial intelligence graph rendering authentic dataset entities: Glowing Cyan for Accounts, Gold for Crypto Wallets, Violet for PGP Keys, Ruby for Forums, and Orange for Transactions.',
    keyHighlight: 'Smooth camera orbiting, layout switching (3D Force, Concentric Rings, Risk Clusters), and dataset confidence slider filtering.',
    howToTest: 'Click and drag to rotate the 3D graph, click any node to focus, or adjust the confidence slider on the left.'
  },
  {
    id: 'multi-hop-pivot',
    badge: 'Forensic Pivot',
    title: 'Multi-Hop Pivot Investigation Engine',
    module: 'THREAT_GRAPH',
    actorTarget: 'shadowfox',
    icon: Layers,
    tagline: 'Trace Transitive Criminal Money & Infrastructure Trails',
    description: 'Empowers investigators to navigate deep multi-hop evidence chains: Account → PGP Public Key → Crypto Wallet → Multi-Hop Transactions → Correlated Account (shadow_fox).',
    keyHighlight: 'Automated breadcrumb trail with full transaction flow tracing across multiple wallet hops.',
    howToTest: 'In the 3D Graph, click on any node to inspect the connected records and transaction trail.'
  },
  {
    id: 'explainable-ai',
    badge: 'XAI Evidence',
    title: 'Explainable Relationship Provenance',
    module: 'THREAT_GRAPH',
    actorTarget: 'shadowfox',
    icon: ShieldAlert,
    tagline: 'Zero Black-Box Assertions with Mathematical Proofs',
    description: 'Every generated correlation provides a factor-by-factor evidentiary breakdown: Shared PGP Key (+100%), Shared Wallet (+98%), Temporal Overlap (+94%), and Stylometric Authorship Match (+92%).',
    keyHighlight: 'Cryptographically sealed with immutable SHA-256 evidence provenance hashes for legal court admissibility.',
    howToTest: 'Click on any connecting graph edge to open the "Why This Relationship Exists" decomposed scorecard.'
  },
  {
    id: 'ai-analyst',
    badge: 'Forensic Assistant',
    title: 'UNMASK ANALYST AI Copilot',
    module: 'COMMAND_CENTER',
    actorTarget: 'shadowfox',
    icon: Bot,
    tagline: 'Evidence-Grounded Cyber Defense Reasoning Assistant',
    description: 'An AI assistant trained on cyber threat intelligence standards that answers complex investigative queries with strict evidentiary citations and zero hallucinations.',
    keyHighlight: 'Dataset-powered reasoning with 1-click sample investigative questions and direct graph jumping.',
    howToTest: 'Click "UNMASK ANALYST AI" in the top header and click any sample prompt or ask "Why was shadowfox flagged?".'
  },
  {
    id: 'reports',
    badge: 'Case Intelligence',
    title: 'Classified Dossier Reports Generator',
    module: 'REPORTS',
    actorTarget: 'shadowfox',
    icon: FileText,
    tagline: '1-Click Exportable Court-Admissible Briefings',
    description: 'Instantly compiles active investigation data, evidence matrices, and risk assessments into formatted, official de-anonymization dossiers.',
    keyHighlight: 'Classification banners (TOP SECRET // LEVEL 4), digital analyst signatures, and 1-click browser print-to-PDF.',
    howToTest: 'Navigate to Reports and click "Export Official Dossier" to preview the print-ready briefing document.'
  }
];

interface GuidedDemoRunnerProps {
  currentStepIndex: number;
  isActive: boolean;
  onClose: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
}

export const GuidedDemoRunner: React.FC<GuidedDemoRunnerProps> = ({
  currentStepIndex,
  isActive,
  onClose,
  onNextStep,
  onPrevStep,
  onJumpToStep
}) => {
  if (!isActive) return null;

  const currentFeature = WALKTHROUGH_FEATURES[currentStepIndex] || WALKTHROUGH_FEATURES[0];
  const Icon = currentFeature.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === WALKTHROUGH_FEATURES.length - 1;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-[#081020]/95 backdrop-blur-2xl border-2 border-cyan-400/80 rounded-2xl p-4 sm:p-5 shadow-[0_0_60px_rgba(6,182,212,0.35)] font-mono-code animate-in slide-in-from-bottom-5 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                UNMASK PLATFORM WALKTHROUGH
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider">
                {currentFeature.badge}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Walkthrough"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Feature Main Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white font-mono-code tracking-wide">
                {currentFeature.title}
              </h4>
              <p className="text-[11px] text-cyan-400 font-medium">
                {currentFeature.tagline}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-block text-[10px] text-slate-400 uppercase font-semibold bg-slate-900 px-2 py-1 rounded border border-slate-800">
            Module: <span className="text-purple-400 font-bold">{currentFeature.module}</span>
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
          {currentFeature.description}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#050b18] border border-cyan-500/30 text-cyan-100">
            <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Key Innovation:
            </span>
            <p className="text-[11px] text-slate-300 leading-normal">
              {currentFeature.keyHighlight}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050b18] border border-amber-500/30 text-amber-100">
            <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1 flex items-center gap-1">
              <Target className="w-3 h-3 text-amber-400" /> How to Interact:
            </span>
            <p className="text-[11px] text-slate-300 leading-normal">
              {currentFeature.howToTest}
            </p>
          </div>
        </div>
      </div>

      {/* Feature Navigation Bar */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
        {/* Feature Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[200px] sm:max-w-xs md:max-w-sm scrollbar-none py-1">
          {WALKTHROUGH_FEATURES.map((feat, idx) => (
            <button
              key={feat.id}
              onClick={() => onJumpToStep(idx)}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                idx === currentStepIndex
                  ? 'bg-cyan-400 text-black shadow-[0_0_10px_#06B6D4]'
                  : 'bg-[#060c18] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
              title={feat.title}
            >
              {feat.badge}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onPrevStep}
            disabled={isFirst}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-xs font-bold text-slate-300 border border-slate-700 flex items-center space-x-1 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center space-x-1 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <span>{isLast ? 'Explore Platform' : 'Next Feature'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
