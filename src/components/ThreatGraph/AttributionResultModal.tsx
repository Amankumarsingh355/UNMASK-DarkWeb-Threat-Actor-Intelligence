// ============================================================
// UNMASK // MULTI-SIGNAL ATTRIBUTION RESULT MODAL
// Transparent, Explainable AI Correlation Inspector
// Grounded 100% in Observable Dataset Evidence
// ============================================================

import React, { useState } from 'react';
import type { AttributionResult, RuleEvaluation, EvidenceQuality, RuleCategory } from '../../types/intelligence';
import {
  ShieldAlert,
  AlertTriangle,
  X,
  ArrowRight,
  Lock,
  Wallet,
  Clock,
  Cpu,
  Globe,
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Layers,
  Terminal,
  Scale
} from 'lucide-react';

interface AttributionResultModalProps {
  isOpen: boolean;
  attribution: AttributionResult | null;
  onClose: () => void;
  onPivotToNode?: (nodeId: string) => void;
  onViewActorDossier?: (actorName: string) => void;
}

export const AttributionResultModal: React.FC<AttributionResultModalProps> = ({
  isOpen,
  attribution,
  onClose,
  onViewActorDossier
}) => {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  if (!isOpen || !attribution) return null;

  const toggleRule = (ruleId: string) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId);
  };

  const getStrengthBadge = (strength: EvidenceQuality) => {
    switch (strength) {
      case 'DIRECT':
        return {
          label: 'DIRECT EVIDENCE',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
        };
      case 'STRONG':
        return {
          label: 'STRONG SIGNAL',
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
        };
      case 'MODERATE':
        return {
          label: 'MODERATE SIGNAL',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/50'
        };
      case 'WEAK':
        return {
          label: 'WEAK SUPPORTING',
          classes: 'bg-purple-500/20 text-purple-300 border-purple-500/50'
        };
      default:
        return {
          label: 'INSUFFICIENT DATA',
          classes: 'bg-slate-800 text-slate-400 border-slate-700'
        };
    }
  };

  const getCategoryIcon = (cat: RuleCategory) => {
    switch (cat) {
      case 'TECHNICAL':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'FINANCIAL':
        return <Wallet className="w-4 h-4 text-amber-400" />;
      case 'LINGUISTIC':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'BEHAVIORAL':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'TEMPORAL':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'PLATFORM':
        return <Globe className="w-4 h-4 text-indigo-400" />;
      case 'IDENTITY':
      default:
        return <User className="w-4 h-4 text-sky-400" />;
    }
  };

  const score = attribution.confidenceScore;
  const scoreColor =
    score >= 80 ? 'text-emerald-400' :
    score >= 60 ? 'text-cyan-400' :
    score >= 30 ? 'text-amber-400' :
    score >= 10 ? 'text-orange-400' : 'text-slate-400';

  const barGradient =
    score >= 80 ? 'from-cyan-500 via-teal-400 to-emerald-400' :
    score >= 60 ? 'from-blue-500 via-cyan-400 to-teal-400' :
    score >= 30 ? 'from-amber-500 to-yellow-400' :
    score >= 10 ? 'from-orange-500 to-amber-400' : 'from-slate-600 to-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#070d18]/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/40 flex flex-col font-mono overflow-hidden">
        
        {/* ============================================================ */}
        {/* MODAL HEADER                                                */}
        {/* ============================================================ */}
        <div className="p-4 sm:p-5 border-b border-[#182740] bg-[#091222] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wider uppercase">
                  ATTRIBUTION RESULT & FORENSIC MATRIX
                </h3>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  MULTI-SIGNAL ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent Multi-Pillar Correlation • Grounded in Active Dataset Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* SCROLLABLE BODY                                             */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          
          {/* 1. Comparison & Confidence Banner */}
          <div className="p-5 rounded-2xl bg-[#040813] border border-[#1a2942] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Entity Comparison Pair */}
              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  EVALUATED ENTITY PAIR
                </span>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#081020] border border-cyan-500/30 flex-1">
                    <span className="text-[9px] text-cyan-400 uppercase font-bold block">Entity A</span>
                    <span className="text-sm font-bold text-white block truncate">
                      {attribution.entityA.username}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {attribution.entityA.postCount} posts • {attribution.entityA.pgpCount} PGP • {attribution.entityA.walletCount} wallets
                    </span>
                  </div>

                  <div className="flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 text-slate-500 hidden sm:block" />
                    <span className="sm:hidden text-xs text-slate-500 font-bold">vs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#081020] border border-purple-500/30 flex-1">
                    <span className="text-[9px] text-purple-400 uppercase font-bold block">Entity B</span>
                    <span className="text-sm font-bold text-white block truncate">
                      {attribution.entityB.username}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {attribution.entityB.postCount} posts • {attribution.entityB.pgpCount} PGP • {attribution.entityB.walletCount} wallets
                    </span>
                  </div>
                </div>

                {/* Categories & Synergy Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#0a1426] border border-slate-700 text-[10px] text-slate-300 font-medium">
                    {attribution.contributingCategoriesCount} Independent Categories Contributing
                  </span>

                  {attribution.synergyBoost > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{attribution.synergyBoost}% Multi-Signal Synergy Bonus
                    </span>
                  )}

                  {attribution.negativePenalties > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      -{attribution.negativePenalties}% Contradiction Penalties
                    </span>
                  )}
                </div>
              </div>

              {/* Confidence Score Gauge */}
              <div className="md:col-span-5 p-4 rounded-xl bg-[#081020] border border-[#1b2a44] text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  ANALYTICAL CONNECTION SCORE
                </span>
                
                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-4xl font-black ${scoreColor}`}>
                    {attribution.confidenceScore}%
                  </span>
                </div>

                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border" style={{ color: attribution.color, borderColor: `${attribution.color}66`, backgroundColor: `${attribution.color}15` }}>
                  {attribution.correlationLevel}
                </span>

                {/* Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800 mt-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
                    style={{ width: `${attribution.confidenceScore}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* 2. Transparent Reasoning Summary Box */}
          <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/20 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold uppercase text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span>Analytical Correlation Synthesis</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {attribution.reasoningSummary}
            </p>
          </div>

          {/* 3. 9-Rule Evidence Breakdown & Drill-Downs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Individual Rule Scoring & Evidence Breakdown (9 Independent Rules)
              </span>
              <span className="text-[11px] text-slate-400">
                {attribution.evidenceCount} / 9 Signals Active
              </span>
            </div>

            <div className="space-y-2.5">
              {attribution.rules.map((rule: RuleEvaluation) => {
                const badge = getStrengthBadge(rule.strength);
                const isExpanded = expandedRule === rule.rule;
                const isPositive = rule.score > 0;
                const isNegative = rule.score < 0;

                return (
                  <div
                    key={rule.rule}
                    className={`rounded-xl border transition-all ${
                      isPositive
                        ? 'bg-[#060c18] border-cyan-500/30 shadow-sm'
                        : isNegative
                        ? 'bg-[#140608] border-rose-500/40'
                        : 'bg-[#040812] border-slate-800/80 opacity-75'
                    }`}
                  >
                    {/* Header Item */}
                    <div
                      onClick={() => toggleRule(rule.rule)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-white/[0.02] rounded-xl"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {getCategoryIcon(rule.category)}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white truncate">
                              {rule.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px] font-semibold">
                              {rule.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {rule.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${badge.classes}`}>
                          {badge.label}
                        </span>

                        <span
                          className={`text-sm font-black font-mono w-14 text-right ${
                            isPositive
                              ? 'text-emerald-400'
                              : isNegative
                              ? 'text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {isPositive ? `+${rule.score}` : rule.score}
                          <span className="text-[10px] text-slate-500 font-normal">/{rule.maxScore}</span>
                        </span>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Drill-down accordion content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-800/80 bg-[#03060d] text-xs space-y-3 rounded-b-xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" />
                            Observed Telemetry Evidence Drill-Down
                          </span>
                          <span>Rule ID: {rule.rule}</span>
                        </div>

                        {/* Evidence Payload Properties */}
                        {Object.keys(rule.evidence || {}).length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                            {Object.entries(rule.evidence).map(([key, val]) => (
                              <div key={key} className="p-2.5 rounded-lg bg-[#070e1c] border border-slate-800">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                                <span className="text-slate-200 font-semibold break-all">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 italic text-[11px]">
                            No specific metadata attributes required for this rule evaluation.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Mandatory Analytical Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/30 text-xs text-slate-300 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-cyan-300 font-bold uppercase text-[11px] block">
                MANDATORY ANALYTICAL DISCLAIMER
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {attribution.disclaimer}
              </p>
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* FOOTER ACTIONS                                              */}
        {/* ============================================================ */}
        <div className="p-4 border-t border-[#182740] bg-[#091222] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            {onViewActorDossier && (
              <>
                <button
                  onClick={() => onViewActorDossier(attribution.entityA.username)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Inspect {attribution.entityA.username}</span>
                </button>
                <button
                  onClick={() => onViewActorDossier(attribution.entityB.username)}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Inspect {attribution.entityB.username}</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close Matrix Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
