// ============================================================
// UNMASK // INTERACTIVE AI CONFIDENCE TIMELINE WIDGET
// Visual Step-by-Step Intelligence Ingestion & Scoring Progression
// ============================================================

import React, { useState } from 'react';
import type { ConfidenceTimelineStage } from '../../types/intelligence';
import { 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Zap,
  Info
} from 'lucide-react';

interface ConfidenceTimelineWidgetProps {
  timeline: ConfidenceTimelineStage[];
  currentScore: number;
  className?: string;
  onSelectStage?: (stage: ConfidenceTimelineStage) => void;
}

export const ConfidenceTimelineWidget: React.FC<ConfidenceTimelineWidgetProps> = ({
  timeline,
  currentScore,
  className = '',
  onSelectStage
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(timeline.length - 1);
  const activeStage = timeline[activeStepIndex] || timeline[timeline.length - 1];

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    if (onSelectStage) {
      onSelectStage(timeline[index]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'from-cyan-500 to-emerald-400';
    if (score >= 75) return 'from-blue-600 to-cyan-400';
    if (score >= 50) return 'from-amber-600 to-amber-400';
    return 'from-rose-600 to-rose-400';
  };

  return (
    <div className={`bg-[#050b18] border border-cyan-500/30 rounded-xl p-4 md:p-5 space-y-4 shadow-xl font-mono-code ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Confidence Timeline & Evidence Ingestion</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                DYNAMIC CORRELATION
              </span>
            </h4>
            <span className="text-[10px] text-slate-400">
              Interactive progression: How sequential intelligence signals compound analytical confidence
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 uppercase">Current Stage:</span>
          <span className="text-xs font-bold text-cyan-300">
            Step {activeStage.step}/{timeline.length} ({activeStage.score}%)
          </span>
        </div>
      </div>

      {/* Horizontal Multi-Step Progression Bar */}
      <div className="relative pt-2 pb-2">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 bg-slate-800 rounded-full z-0" />
        
        {/* Active Progress Fill Line */}
        <div 
          className={`absolute top-1/2 left-4 h-1 -translate-y-1/2 bg-gradient-to-r ${getProgressBarColor(activeStage.score)} rounded-full transition-all duration-500 z-0`}
          style={{ width: `${(activeStepIndex / Math.max(1, timeline.length - 1)) * 90}%` }}
        />

        {/* Interactive Steps */}
        <div className="relative z-10 flex items-center justify-between">
          {timeline.map((stage, idx) => {
            const isCompleted = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;
            return (
              <button
                key={stage.step}
                onClick={() => handleStepClick(idx)}
                className={`group flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                  isCurrent ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 shadow-md ${
                    isCurrent
                      ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/40'
                      : isCompleted
                      ? 'bg-[#0d1c38] text-cyan-300 border-cyan-500/60 hover:border-cyan-400'
                      : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {stage.score}%
                </div>
                <span className={`text-[10px] mt-2 font-bold max-w-[80px] text-center truncate ${
                  isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {stage.stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Inspector Card */}
      <div className="bg-[#030712] p-3.5 rounded-lg border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white">
              Stage {activeStage.step}: {activeStage.stage}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
              {activeStage.unlockedSignal}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeStage.description}
          </p>
        </div>

        <div className="shrink-0 flex items-center space-x-3 bg-[#081226] px-3.5 py-2 rounded-lg border border-cyan-500/30">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase block">Compounded Confidence</span>
            <span className={`text-base font-bold font-display-tactical ${getScoreColor(activeStage.score).split(' ')[0]}`}>
              {activeStage.score}%
            </span>
          </div>
          <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
