// ============================================================
// PAGE 5 — INTELLIGENCE SEARCH VIEW
// Universal Cross-Domain Threat Intelligence Search Engine
// ============================================================

import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Wallet, 
  Globe, 
  Server, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Filter,
  CheckCircle2,
  FolderGit2,
  Network
} from 'lucide-react';
import { THREAT_ACTORS, INITIAL_GRAPH_NODES } from '../data/mockIntelligence';
import type { EntityType } from '../types/intelligence';

interface IntelligenceSearchViewProps {
  onSelectActor: (actorName: string) => void;
  onFocusThreatGraph: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const IntelligenceSearchView: React.FC<IntelligenceSearchViewProps> = ({
  onSelectActor,
  onFocusThreatGraph,
  onNavigateToModule
}) => {
  const [searchQuery, setSearchQuery] = useState('shadowfox');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const sampleSearchPills = [
    'shadowfox',
    '0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a',
    'darkwolf',
    '0x127b8a531e21b77c59ff1990df78923053d2bf94',
    'dread',
    'BreachForums'
  ];

  const matchedActors = THREAT_ACTORS.filter(a =>
    a.primaryAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.aliases.some(al => al.alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.emails.some(em => em.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.wallets.some(w => w.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.domains.some(d => d.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
    a.ips.some(ip => ip.ip.includes(searchQuery))
  );

  const matchedEntities = INITIAL_GRAPH_NODES.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.details && Object.values(n.details).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Search Header Banner */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8]">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              Universal Intelligence Search Engine
            </h1>
            <p className="text-xs text-slate-400">
              Cross-Indicator Correlation across Actors, PGP Keys, Crypto Wallets, IPs, and Onion Domains
            </p>
          </div>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#38bdf8] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search dataset actors (shadowfox, darkwolf), wallets (0xdd31...), forums (dread)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#020713]/60 border-2 border-[#1e3a6a] focus:border-[#1e90ff] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none shadow-[0_0_20px_rgba(30,144,255,0.15)] transition-all font-mono-code"
          />
        </div>

        {/* Quick Search Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] uppercase">Example Queries:</span>
          {sampleSearchPills.map((pill, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(pill)}
              className="px-2.5 py-1 rounded-md bg-[#020713]/60 hover:bg-[#1e90ff]/20 border border-[#1e3a6a] hover:border-[#1e90ff]/50 text-[#38bdf8] text-xs font-mono-code transition-all"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-[#1e90ff]/20 pb-3">
        <div>
          Found <strong className="text-[#38bdf8] font-bold">{matchedActors.length}</strong> Actors and <strong className="text-purple-300 font-bold">{matchedEntities.length}</strong> Graph Indicators for query "{searchQuery}"
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/30 font-bold">
          NTRO CORRELATION ENGINE ACTIVE
        </span>
      </div>

      {/* Main Matched Threat Actor Highlight Card (If shadowfox searched) */}
      {matchedActors.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider block">
            Correlated Threat Actor Profiles ({matchedActors.length})
          </span>

          <div className="grid grid-cols-1 gap-4">
            {matchedActors.map(actor => (
              <div
                key={actor.id}
                className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/30 rounded-2xl p-5 shadow-2xl space-y-4 hover:border-[#1e90ff] transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white font-display-tactical tracking-wider">
                          {actor.primaryAlias}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          actor.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                          actor.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                          'bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40'
                        }`}>
                          {actor.riskLevel} RISK ({actor.riskScore}/100)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{actor.threatCategory}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onSelectActor(actor.primaryAlias);
                        onNavigateToModule('ACTOR_INTELLIGENCE');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Open Dossier</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectActor(actor.primaryAlias);
                        onFocusThreatGraph(actor.primaryAlias);
                        onNavigateToModule('THREAT_GRAPH');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition-all"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>Pivot into 3D Graph</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-[#020713]/40 p-2.5 rounded-lg border border-[#1e3a6a]/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Aliases Linked</span>
                    <span className="font-bold text-[#38bdf8]">{actor.metrics.aliasCount} Correlated</span>
                  </div>
                  <div className="bg-[#020713]/40 p-2.5 rounded-lg border border-[#1e3a6a]/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Indicators</span>
                    <span className="font-bold text-purple-300">{actor.metrics.domainCount + actor.metrics.walletCount + actor.metrics.emailCount} Total</span>
                  </div>
                  <div className="bg-[#020713]/40 p-2.5 rounded-lg border border-[#1e3a6a]/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Graph Degree</span>
                    <span className="font-bold text-emerald-300">{actor.metrics.relatedEntityCount} Nodes</span>
                  </div>
                  <div className="bg-[#020713]/40 p-2.5 rounded-lg border border-[#1e3a6a]/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Active Alerts</span>
                    <span className="font-bold text-red-400">{actor.metrics.activeAlertCount} Critical/High</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matched Discrete Graph Indicators Grid */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Matched Graph Indicators ({matchedEntities.length})
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {matchedEntities.map(ent => (
            <div
              key={ent.id}
              onClick={() => {
                onFocusThreatGraph(ent.name);
                onNavigateToModule('THREAT_GRAPH');
              }}
              className="p-3.5 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e3a6a]/40 hover:border-[#1e90ff]/50 rounded-xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/30 font-bold">
                  {ent.type}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-[#38bdf8] flex items-center gap-1">
                  View in Graph <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div className="text-xs font-bold text-white truncate font-mono-code">
                {ent.name}
              </div>

              {ent.details && (
                <div className="text-[10px] text-slate-400 truncate">
                  {Object.entries(ent.details).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
