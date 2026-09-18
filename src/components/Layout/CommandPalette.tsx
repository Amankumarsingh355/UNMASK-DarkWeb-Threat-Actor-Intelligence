// ============================================================
// UNMASK GLOBAL COMMAND PALETTE & OMNI-SEARCH (Ctrl + K)
// Multi-Domain Intelligence Search & Tactical Navigation Hub
// ============================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  User, 
  Wallet, 
  Globe, 
  Server,
  FolderGit2, 
  BellRing, 
  FileText, 
  Network, 
  X, 
  ArrowRight, 
  Sparkles, 
  Command, 
  ShieldAlert, 
  ExternalLink,
  Bot,
  Activity,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';
import type { AppModule } from './TacticalSidebar';
import { 
  THREAT_ACTORS, 
  INVESTIGATIONS, 
  THREAT_ALERTS, 
  INITIAL_GRAPH_NODES 
} from '../../data/mockIntelligence';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: AppModule) => void;
  onSelectActor: (actorName: string) => void;
  onFocusThreatGraph: (actorName?: string) => void;
}

type SearchCategory = 'ALL' | 'ACTORS' | 'WALLETS' | 'INFRA' | 'CASES' | 'ALERTS' | 'COMMANDS';

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectActor,
  onFocusThreatGraph
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedCategory('ALL');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Quick Platform Navigation Actions
  const quickActions = useMemo(() => [
    { id: 'cmd-graph', label: '3D Threat Intelligence Graph', module: 'THREAT_GRAPH' as AppModule, icon: Network, desc: 'Interactive 3D WebGL network topology' },
    { id: 'cmd-dossier', label: 'Threat Actor Dossiers', module: 'ACTOR_INTELLIGENCE' as AppModule, icon: User, desc: 'Detailed profiles, aliases, and stylometrics' },
    { id: 'cmd-cases', label: 'Investigations Workspace', module: 'INVESTIGATIONS' as AppModule, icon: FolderGit2, desc: 'Forensic case files and evidence chains' },
    { id: 'cmd-search', label: 'Universal Intelligence Search', module: 'SEARCH' as AppModule, icon: Search, desc: 'Cross-indicator query engine (Page 5)' },
    { id: 'cmd-alerts', label: 'Threat Alerts & Triage', module: 'ALERTS' as AppModule, icon: BellRing, desc: 'Priority anomaly and multi-actor alerts' },
    { id: 'cmd-analytics', label: 'Threat Analytics & Heatmaps', module: 'ANALYTICS' as AppModule, icon: Activity, desc: 'Temporal anomaly and centrality metrics' },
    { id: 'cmd-reports', label: 'Dossier Reports Generator', module: 'REPORTS' as AppModule, icon: FileText, desc: 'Export official de-anonymization briefs' },
  ], []);

  // Filtered Threat Actors
  const matchedActors = useMemo(() => {
    if (!query.trim()) return THREAT_ACTORS.slice(0, 6);
    const q = query.toLowerCase();
    return THREAT_ACTORS.filter(a => 
      a.primaryAlias.toLowerCase().includes(q) ||
      a.threatCategory.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.aliases.some(al => al.alias.toLowerCase().includes(q)) ||
      a.emails.some(em => em.toLowerCase().includes(q)) ||
      a.wallets.some(w => w.address.toLowerCase().includes(q)) ||
      a.domains.some(d => d.domain.toLowerCase().includes(q)) ||
      a.ips.some(ip => ip.ip.includes(q))
    );
  }, [query]);

  // Filtered Wallets
  const matchedWallets = useMemo(() => {
    const q = query.toLowerCase().trim();
    const allWallets: { address: string; currency: string; balance: string; actor: string; risk: number }[] = [];
    
    THREAT_ACTORS.forEach(actor => {
      actor.wallets.forEach(w => {
        allWallets.push({
          address: w.address,
          currency: w.currency,
          balance: w.balanceEstimated,
          actor: actor.primaryAlias,
          risk: w.riskScore
        });
      });
    });

    if (!q) return allWallets.slice(0, 4);
    return allWallets.filter(w => 
      w.address.toLowerCase().includes(q) ||
      w.currency.toLowerCase().includes(q) ||
      w.actor.toLowerCase().includes(q)
    );
  }, [query]);

  // Filtered Infrastructure (Domains & IPs)
  const matchedInfra = useMemo(() => {
    const q = query.toLowerCase().trim();
    const allInfra: { type: 'DOMAIN' | 'IP'; value: string; extra: string; actor: string }[] = [];

    THREAT_ACTORS.forEach(actor => {
      actor.domains.forEach(d => {
        allInfra.push({
          type: 'DOMAIN',
          value: d.domain,
          extra: `${d.type} • Status: ${d.status}`,
          actor: actor.primaryAlias
        });
      });
      actor.ips.forEach(ip => {
        allInfra.push({
          type: 'IP',
          value: ip.ip,
          extra: `${ip.country} • ${ip.asn} (${ip.serviceType})`,
          actor: actor.primaryAlias
        });
      });
    });

    if (!q) return allInfra.slice(0, 4);
    return allInfra.filter(i => 
      i.value.toLowerCase().includes(q) ||
      i.extra.toLowerCase().includes(q) ||
      i.actor.toLowerCase().includes(q)
    );
  }, [query]);

  // Filtered Investigations
  const matchedCases = useMemo(() => {
    if (!query.trim()) return INVESTIGATIONS.slice(0, 4);
    const q = query.toLowerCase();
    return INVESTIGATIONS.filter(c => 
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.targetActorName.toLowerCase().includes(q) ||
      c.leadAnalyst.toLowerCase().includes(q)
    );
  }, [query]);

  // Filtered Alerts
  const matchedAlerts = useMemo(() => {
    if (!query.trim()) return THREAT_ALERTS.slice(0, 3);
    const q = query.toLowerCase();
    return THREAT_ALERTS.filter(a => 
      a.id.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.involvedActors.some(act => act.toLowerCase().includes(q))
    );
  }, [query]);

  // Filtered Commands
  const matchedCommands = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(cmd => 
      cmd.label.toLowerCase().includes(q) ||
      cmd.desc.toLowerCase().includes(q)
    );
  }, [query, quickActions]);

  // Flat list of clickable items for keyboard arrow navigation
  const flatSelectableItems = useMemo(() => {
    const items: { type: string; id: string; action: () => void }[] = [];

    if (selectedCategory === 'ALL' || selectedCategory === 'ACTORS') {
      matchedActors.forEach(a => {
        items.push({
          type: 'ACTOR',
          id: `actor-${a.id}`,
          action: () => {
            onSelectActor(a.primaryAlias);
            onNavigate('ACTOR_INTELLIGENCE');
            onClose();
          }
        });
      });
    }

    if (selectedCategory === 'ALL' || selectedCategory === 'WALLETS') {
      matchedWallets.forEach(w => {
        items.push({
          type: 'WALLET',
          id: `wallet-${w.address}`,
          action: () => {
            onSelectActor(w.actor);
            onFocusThreatGraph(w.actor);
            onNavigate('THREAT_GRAPH');
            onClose();
          }
        });
      });
    }

    if (selectedCategory === 'ALL' || selectedCategory === 'INFRA') {
      matchedInfra.forEach(i => {
        items.push({
          type: 'INFRA',
          id: `infra-${i.value}`,
          action: () => {
            onSelectActor(i.actor);
            onFocusThreatGraph(i.actor);
            onNavigate('THREAT_GRAPH');
            onClose();
          }
        });
      });
    }

    if (selectedCategory === 'ALL' || selectedCategory === 'CASES') {
      matchedCases.forEach(c => {
        items.push({
          type: 'CASE',
          id: `case-${c.id}`,
          action: () => {
            onSelectActor(c.targetActorName);
            onNavigate('INVESTIGATIONS');
            onClose();
          }
        });
      });
    }

    if (selectedCategory === 'ALL' || selectedCategory === 'ALERTS') {
      matchedAlerts.forEach(a => {
        items.push({
          type: 'ALERT',
          id: `alert-${a.id}`,
          action: () => {
            if (a.involvedActors[0]) onSelectActor(a.involvedActors[0]);
            onNavigate('ALERTS');
            onClose();
          }
        });
      });
    }

    if (selectedCategory === 'ALL' || selectedCategory === 'COMMANDS') {
      matchedCommands.forEach(cmd => {
        items.push({
          type: 'COMMAND',
          id: cmd.id,
          action: () => {
            onNavigate(cmd.module);
            onClose();
          }
        });
      });
    }

    return items;
  }, [
    selectedCategory, 
    matchedActors, 
    matchedWallets, 
    matchedInfra, 
    matchedCases, 
    matchedAlerts, 
    matchedCommands, 
    onSelectActor, 
    onNavigate, 
    onFocusThreatGraph, 
    onClose
  ]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < flatSelectableItems.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : flatSelectableItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatSelectableItems[selectedIndex]) {
          flatSelectableItems[selectedIndex].action();
        } else if (query.trim()) {
          onNavigate('SEARCH');
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatSelectableItems, selectedIndex, query, onNavigate, onClose]);

  if (!isOpen) return null;

  const totalResults = flatSelectableItems.length;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-20 px-3 sm:px-4 animate-in fade-in duration-150 font-mono-code"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-[#091122]/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Top Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cyan-500/30 bg-[#050a14]">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mr-3 shrink-0">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search threat actors, aliases, crypto wallets (0x...), onion domains, IPs, cases..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 outline-none font-mono-code"
          />

          {query && (
            <button 
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }} 
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 mr-2 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="px-2 py-1 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded border border-slate-700 transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-1.5 px-4 py-2 bg-[#060c18] border-b border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          {(['ALL', 'ACTORS', 'WALLETS', 'INFRA', 'CASES', 'ALERTS', 'COMMANDS'] as SearchCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Scrollable Container */}
        <div 
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 max-h-[58vh]"
        >
          {totalResults === 0 ? (
            /* Empty State */
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-sm font-bold text-white">No Direct Matches in Cache</h4>
                <p className="text-xs text-slate-400">
                  No threat indicators matched "{query}". Try one of the example queries below or search the universal engine.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['shadowfox', '0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a', 'darkwolf', 'dread', 'INV-1027', 'ALT-4402'].map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(pill);
                      setSelectedCategory('ALL');
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#050b18] hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-xs transition-all font-mono-code"
                  >
                    {pill}
                  </button>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    onNavigate('SEARCH');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Search in Universal Intelligence Engine</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: Threat Actors & Aliases */}
              {(selectedCategory === 'ALL' || selectedCategory === 'ACTORS') && matchedActors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Threat Actors & Correlated Aliases ({matchedActors.length})
                    </span>
                    <span className="text-slate-500">Press ↵ to Open Dossier</span>
                  </div>

                  <div className="space-y-1.5">
                    {matchedActors.map(actor => (
                      <div
                        key={actor.id}
                        onClick={() => {
                          onSelectActor(actor.primaryAlias);
                          onNavigate('ACTOR_INTELLIGENCE');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#060c18] hover:bg-[#0a152e] border border-slate-800/90 hover:border-cyan-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-xs tracking-wide truncate">
                                {actor.primaryAlias}
                              </span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                                actor.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                actor.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {actor.riskScore}/100 {actor.riskLevel}
                              </span>
                              <span className="text-[9px] text-emerald-400 shrink-0 font-bold">
                                {actor.confidenceScore}% Confidence
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {actor.threatCategory} • {actor.metrics.aliasCount} Aliases • {actor.metrics.walletCount} Wallets
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectActor(actor.primaryAlias);
                              onFocusThreatGraph(actor.primaryAlias);
                              onNavigate('THREAT_GRAPH');
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold flex items-center gap-1 transition-all"
                            title="Focus in 3D Graph"
                          >
                            <Network className="w-3 h-3" /> Graph
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 2: Cryptocurrency Wallets */}
              {(selectedCategory === 'ALL' || selectedCategory === 'WALLETS') && matchedWallets.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-3 h-3" /> Monitored Wallets & Mixer Trails ({matchedWallets.length})
                  </div>

                  <div className="space-y-1.5">
                    {matchedWallets.map((w, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectActor(w.actor);
                          onFocusThreatGraph(w.actor);
                          onNavigate('THREAT_GRAPH');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#060c18] hover:bg-[#141208] border border-slate-800/90 hover:border-amber-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-amber-300 text-xs font-mono truncate">
                                {w.address}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 font-bold shrink-0">
                                {w.currency}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Target: <strong className="text-cyan-300">{w.actor}</strong> • Balance: {w.balance} • Risk: {w.risk}/100
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-[10px] text-amber-300 font-bold shrink-0">
                          Pivot Graph →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: Infrastructure (Domains & IPs) */}
              {(selectedCategory === 'ALL' || selectedCategory === 'INFRA') && matchedInfra.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Onion Services & Bulletproof IPs ({matchedInfra.length})
                  </div>

                  <div className="space-y-1.5">
                    {matchedInfra.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectActor(item.actor);
                          onFocusThreatGraph(item.actor);
                          onNavigate('THREAT_GRAPH');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#060c18] hover:bg-[#081512] border border-slate-800/90 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                            {item.type === 'DOMAIN' ? <Globe className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-emerald-300 text-xs font-mono truncate">
                                {item.value}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold shrink-0">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              Target: <strong className="text-cyan-300">{item.actor}</strong> • {item.extra}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold shrink-0">
                          Inspect →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: Active Forensic Cases */}
              {(selectedCategory === 'ALL' || selectedCategory === 'CASES') && matchedCases.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-[10px] uppercase font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                    <FolderGit2 className="w-3 h-3" /> Active Forensic Investigations ({matchedCases.length})
                  </div>

                  <div className="space-y-1.5">
                    {matchedCases.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectActor(c.targetActorName);
                          onNavigate('INVESTIGATIONS');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#060c18] hover:bg-[#150a24] border border-slate-800/90 hover:border-purple-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                            <FolderGit2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-xs font-mono">{c.id}</span>
                              <span className="text-slate-300 font-semibold text-xs truncate">{c.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              Target: <strong className="text-cyan-300">{c.targetActorName}</strong> • {c.leadAnalyst}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 font-bold shrink-0">
                          Open Case →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: Threat Alerts */}
              {(selectedCategory === 'ALL' || selectedCategory === 'ALERTS') && matchedAlerts.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
                    <BellRing className="w-3 h-3" /> Priority Threat Alerts ({matchedAlerts.length})
                  </div>

                  <div className="space-y-1.5">
                    {matchedAlerts.map(alert => (
                      <div
                        key={alert.id}
                        onClick={() => {
                          if (alert.involvedActors[0]) onSelectActor(alert.involvedActors[0]);
                          onNavigate('ALERTS');
                          onClose();
                        }}
                        className="p-3 rounded-xl bg-[#060c18] hover:bg-[#1f0910] border border-slate-800/90 hover:border-red-500/50 cursor-pointer flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
                          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                            <BellRing className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-red-300 text-xs font-mono">{alert.id}</span>
                              <span className="font-bold text-white text-xs truncate">{alert.title}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-500/30 font-bold shrink-0">
                                {alert.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {alert.summary}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-[10px] text-red-300 font-bold shrink-0">
                          Triage →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6: Quick Commands */}
              {(selectedCategory === 'ALL' || selectedCategory === 'COMMANDS') && matchedCommands.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Command className="w-3 h-3 text-cyan-400" /> Platform Navigation Shortcuts
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedCommands.map(cmd => {
                      const Icon = cmd.icon;
                      return (
                        <div
                          key={cmd.id}
                          onClick={() => {
                            onNavigate(cmd.module);
                            onClose();
                          }}
                          className="p-2.5 rounded-xl bg-[#060c18] hover:bg-cyan-950/40 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/40 shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-white text-xs block truncate">{cmd.label}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{cmd.desc}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0 ml-1.5 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Global Search Deep Link Footer */}
        {query.trim() && (
          <div className="px-4 py-2.5 bg-[#040812] border-t border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] truncate mr-2">
              Looking for deep graph correlation for <strong className="text-cyan-300">"{query}"</strong>?
            </span>
            <button
              onClick={() => {
                onNavigate('SEARCH');
                onClose();
              }}
              className="px-3 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0"
            >
              <span>Open Universal Search (Page 5)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Standard Keyboard Shortcuts Footer */}
        <div className="p-3 bg-[#03060e] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <img src="/unmask-logo.png" alt="UNMASK" className="h-5 w-auto object-contain" />
            <span className="font-bold text-white">UNMASK Intelligence Command Hub</span>
          </div>
          <div className="flex items-center space-x-3 text-[10px]">
            <span>Navigate: <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">↑</kbd> <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">↓</kbd></span>
            <span>Select: <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd></span>
            <span>Close: <kbd className="px-1 bg-slate-800 rounded border border-slate-700 text-slate-300">ESC</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
};
