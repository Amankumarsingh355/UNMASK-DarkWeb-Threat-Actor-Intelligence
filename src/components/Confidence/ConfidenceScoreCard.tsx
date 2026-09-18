// ============================================================
// UNMASK // TACTICAL AI ANALYSIS CONFIDENCE CARD
// Metric widget for Command Center Dashboard & Dossiers
// ============================================================

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  ChevronRight
} from 'lucide-react';
import type { AnalysisConfidenceData } from '../../types/intelligence';

interface ConfidenceScoreCardProps {
  score?: number;
  level?: string;
  evidenceCount?: number;
  strongCount?: number;
  supportingCount?: number;
  onClick?: () => void;
  className?: string;
}

export const ConfidenceScoreCard: React.FC<ConfidenceScoreCardProps> = ({
  score = 87.3,
  level = 'HIGH CONFIDENCE',
  evidenceCount = 6,
  strongCount = 4,
  supportingCount = 2,
  onClick,
  className = ''
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 90) return { text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]' };
    if (s >= 75) return { text: 'text-cyan-400', border: 'border-cyan-500/40', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', glow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]' };
    if (s >= 50) return { text: 'text-amber-400', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]' };
    return { text: 'text-rose-400', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', glow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]' };
  };

  const style = getScoreColor(score);

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-[#081020]/95 backdrop-blur-md rounded-xl border ${style.border} ${style.glow} cursor-pointer transition-all duration-200 group flex flex-col justify-between font-mono-code ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
          <ShieldCheck className={`w-4 h-4 ${style.text}`} />
          <span>AI Analysis Confidence</span>
        </span>
        <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${style.badge}`}>
          {level}
        </span>
      </div>

      {/* Main Score Value */}
      <div className="my-2.5 flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold text-white font-display-tactical tracking-tight flex items-baseline gap-1">
            <span>{score}%</span>
            <span className="text-xs font-normal text-slate-400">CORRELATION</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Multi-Signal Analytical Forensics
          </span>
        </div>
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Evidence Signals Breakdown Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span className="text-cyan-300 font-semibold">{evidenceCount} Evidence Signals</span>
        <span className="text-emerald-400 font-semibold">{strongCount} Strong</span>
        <span className="text-amber-400 font-semibold">{supportingCount} Supporting</span>
      </div>
    </div>
  );
};
