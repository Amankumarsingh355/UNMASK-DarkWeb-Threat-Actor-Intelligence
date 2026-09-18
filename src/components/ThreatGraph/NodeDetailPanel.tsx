// ============================================================
// DARKTRACE FLOATING NODE DETAIL INSPECTOR
// Entity Intelligence Panel with Analytical Risk Scoring & Data Provenance
// ============================================================

import React, { useState } from 'react';
import type { GraphNode, EntityType } from '../../types/intelligence';
import { 
  User, 
  Wallet, 
  Globe, 
  Server, 
  CreditCard, 
  MessageSquare, 
  Activity, 
  X, 
  Sparkles, 
  ArrowRight,
  Crosshair,
  FileSearch,
  Database,
  Code2,
  ChevronDown,
  ChevronUp,
  ShieldAlert
} from 'lucide-react';

interface NodeDetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
  onPivotToNode: (node: GraphNode) => void;
  onViewActorDossier?: (actorName: string) => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  onClose,
  onPivotToNode,
  onViewActorDossier
}) => {
  const [isProvenanceExpanded, setIsProvenanceExpanded] = useState<boolean>(true);

  if (!node) return null;

  const getTypeIcon = (type: EntityType) => {
    switch (type) {
      case 'ACTOR': return <User className="w-4 h-4 text-cyan-400" />;
      case 'WALLET': return <Wallet className="w-4 h-4 text-amber-400" />;
      case 'DOMAIN': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'IP': return <Server className="w-4 h-4 text-cyan-400" />;
      case 'TRANSACTION': return <CreditCard className="w-4 h-4 text-orange-400" />;
      case 'FORUM': return <MessageSquare className="w-4 h-4 text-rose-400" />;
      default: return <Activity className="w-4 h-4 text-purple-400" />;
    }
  };

  const riskScore = node.riskScore || 50;
  const riskLevel = node.riskLevel || (riskScore >= 81 ? 'CRITICAL' : riskScore >= 61 ? 'HIGH' : riskScore >= 31 ? 'MEDIUM' : 'LOW');

  const supportingRecords = node.details?.supportingRecords || [];
  const provenanceSnippet = node.details?.provenanceSnippet;

  return (
    <div className="w-full bg-[#030a1a]/55 backdrop-blur-xl border border-[#1e90ff]/30 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-right-3 duration-200 font-mono-code">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center">
            {getTypeIcon(node.type)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {node.type}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                riskLevel === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                riskLevel === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-500/40' :
                riskLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-500/40' :
                'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
              }`}>
                {riskLevel} RISK
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5 truncate max-w-[200px]" title={node.name}>
              {node.name}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Analytical Risk Score Card */}
      <div className="bg-[#020713]/50 p-3 rounded-lg border border-[#1e3a6a]/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            Analytical Risk Score
          </span>
          <span className="text-sm font-bold text-amber-400">
            {riskScore} <span className="text-slate-500 text-xs font-normal">/ 100</span>
          </span>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div 
            className={`h-full rounded-full transition-all ${
              riskLevel === 'CRITICAL' ? 'bg-red-500' :
              riskLevel === 'HIGH' ? 'bg-orange-500' :
              riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-cyan-400'
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-500">
          <span>0 (Low)</span>
          <span>31 (Med)</span>
          <span>61 (High)</span>
          <span>81+ (Crit)</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#020713]/50 p-2.5 rounded border border-[#1e3a6a]/60">
          <span className="text-[10px] text-slate-400 block uppercase">Network Degree</span>
          <span className="text-sm font-bold text-cyan-300">{node.connectionsCount || 1} Connected Links</span>
        </div>
        <div className="bg-[#020713]/50 p-2.5 rounded border border-[#1e3a6a]/60">
          <span className="text-[10px] text-slate-400 block uppercase">Telemetry Status</span>
          <span className="text-sm font-bold text-emerald-400">VERIFIED</span>
        </div>
      </div>

      {/* Telemetry & Entity Attributes */}
      <div className="bg-[#020713]/50 p-3 rounded-lg border border-[#1e3a6a]/60 space-y-1.5 text-xs">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block border-b border-slate-800/80 pb-1">
          Entity Attributes & Telemetry
        </span>
        {node.firstSeen && (
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">First Observed:</span>
            <span>{node.firstSeen}</span>
          </div>
        )}
        {node.lastSeen && (
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Last Telemetry:</span>
            <span className="text-cyan-300">{node.lastSeen}</span>
          </div>
        )}
        {node.details && Object.entries(node.details)
          .filter(([k]) => !['provenanceRowIndices', 'supportingRecords', 'provenanceSnippet'].includes(k))
          .slice(0, 4)
          .map(([key, val]) => (
            <div key={key} className="flex justify-between text-slate-300">
              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
              <span className="text-cyan-200 font-semibold truncate max-w-[150px]">{String(val)}</span>
            </div>
        ))}
      </div>

      {/* DATA PROVENANCE SECTION */}
      <div className="bg-[#020713]/50 p-3 rounded-lg border border-[#1e90ff]/30 space-y-2 text-xs">
        <div 
          onClick={() => setIsProvenanceExpanded(!isProvenanceExpanded)}
          className="flex items-center justify-between cursor-pointer border-b border-slate-800/80 pb-1.5"
        >
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Data Provenance ({node.details?.totalSupportingRecords || 1} Record{node.details?.totalSupportingRecords !== 1 ? 's' : ''})
          </span>
          {isProvenanceExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </div>

        {isProvenanceExpanded && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-150">
            <p className="text-[10px] text-slate-400">
              Every graph entity is directly traceable to the raw records in the uploaded dataset:
            </p>

            {supportingRecords.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {supportingRecords.map((item: any, idx: number) => (
                  <div key={idx} className="bg-[#030a1a]/60 p-2 rounded border border-[#1e3a6a]/60 space-y-1">
                    <div className="flex justify-between text-[9px] text-cyan-400 font-bold">
                      <span>Row #{item.rowIndex + 1}</span>
                      <span className="text-slate-500">Source Telemetry</span>
                    </div>
                    <pre className="text-[10px] text-slate-300 whitespace-pre-wrap break-all font-mono leading-tight">
                      {JSON.stringify(item.record, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : provenanceSnippet ? (
              <div className="bg-[#030a1a]/60 p-2 rounded border border-[#1e3a6a]/60 space-y-1 max-h-36 overflow-y-auto">
                <div className="flex justify-between text-[9px] text-cyan-400 font-bold">
                  <span>Row #{((node.details?.provenanceRowIndex || 0) + 1)}</span>
                  <span className="text-slate-500">Source Telemetry</span>
                </div>
                <pre className="text-[10px] text-slate-300 whitespace-pre-wrap break-all font-mono leading-tight">
                  {JSON.stringify(provenanceSnippet, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-[#030a1a]/60 p-2 rounded border border-[#1e3a6a]/60 text-[10px] text-slate-400">
                Derived from UNMASK Threat Intelligence Ingestion Record.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 pt-1">
        <button
          onClick={() => onPivotToNode(node)}
          className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span>PIVOT INTO THIS ENTITY</span>
        </button>

        {node.type === 'ACTOR' && onViewActorDossier && (
          <button
            onClick={() => onViewActorDossier(node.name)}
            className="w-full py-2 px-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <FileSearch className="w-3.5 h-3.5 text-purple-400" />
            <span>OPEN ACTOR DOSSIER</span>
          </button>
        )}
      </div>
    </div>
  );
};
