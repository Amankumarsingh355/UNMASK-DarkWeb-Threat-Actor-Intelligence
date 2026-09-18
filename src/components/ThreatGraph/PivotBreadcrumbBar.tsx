// ============================================================
// DARKTRACE PIVOT INVESTIGATION BREADCRUMB BAR
// Multi-Hop Investigation Trail & Graph Dynamic Expansion
// ============================================================

import React from 'react';
import type { GraphNode } from '../../types/intelligence';
import { ChevronRight, Crosshair, Sparkles, RefreshCw, Zap } from 'lucide-react';

interface PivotBreadcrumbBarProps {
  pivotChain: GraphNode[];
  onSelectBreadcrumb: (index: number) => void;
  onResetPivot: () => void;
  onInvestigateRelationship: () => void;
}

export const PivotBreadcrumbBar: React.FC<PivotBreadcrumbBarProps> = ({
  pivotChain,
  onSelectBreadcrumb,
  onResetPivot,
  onInvestigateRelationship
}) => {
  return (
    <div className="w-full bg-[#030a1a]/45 backdrop-blur-xl border border-[#1e90ff]/30 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs">
      {/* Left: Pivot Trail */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none max-w-3xl">
        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mr-1 shrink-0">
          <Crosshair className="w-3.5 h-3.5" /> PIVOT TRAIL:
        </span>

        {pivotChain.length === 0 ? (
          <span className="text-slate-400 italic text-[11px]">
            Click any node to begin multi-hop pivot investigation
          </span>
        ) : (
          pivotChain.map((node, idx) => {
            const isLast = idx === pivotChain.length - 1;
            return (
              <React.Fragment key={node.id + idx}>
                <button
                  onClick={() => onSelectBreadcrumb(idx)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1 transition-all shrink-0 border ${
                    isLast
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 rounded bg-slate-950/80 text-cyan-400">
                    {node.type}
                  </span>
                  <span className="truncate max-w-[110px]">{node.name}</span>
                </button>

                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2 shrink-0">
        {pivotChain.length >= 2 && (
          <button
            onClick={onInvestigateRelationship}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>INVESTIGATE RELATIONSHIP</span>
          </button>
        )}

        {pivotChain.length > 0 && (
          <button
            onClick={onResetPivot}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reset Pivot Trail"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
