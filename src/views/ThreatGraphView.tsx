// ============================================================
// PAGE 4 — THREAT GRAPH (HERO VIEW)
// Real Dataset Ingestion, 3D WebGL Visualization & Pivot Engine
// Dataset: UNMASK_Final_Synthetic_MVP_v2.3_VALIDATED
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { ThreatGraph3D } from '../components/ThreatGraph/ThreatGraph3D';
import { ThreatRelationsGraph2D } from '../components/ThreatGraph/ThreatRelationsGraph2D';
import { RelationshipEvidencePanel } from '../components/ThreatGraph/RelationshipEvidencePanel';
import { NodeDetailPanel } from '../components/ThreatGraph/NodeDetailPanel';
import { ActorIntelligenceProfileDrawer } from '../components/ThreatGraph/ActorIntelligenceProfileDrawer';
import { PivotBreadcrumbBar } from '../components/ThreatGraph/PivotBreadcrumbBar';
import { ApiClient } from '../services/apiClient';
import type { GraphNode, GraphLink, EntityType } from '../types/intelligence';
import { 
  Network, 
  Sliders, 
  Maximize2, 
  RefreshCw, 
  Sparkles, 
  Crosshair, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Info, 
  Database, 
  Search, 
  X,
  AlertTriangle, 
  FileText, 
  Activity, 
  Boxes, 
  Upload,
  Download 
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import { IntelligenceExporter } from '../services/intelligenceExporter';

interface ThreatGraphViewProps {
  focusedActorName?: string | null;
  onSelectActor: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

interface DatasetStats {
  status: string;
  datasetVersion: string;
  datasetName: string;
  isAvailable: boolean;
  error?: string | null;
  accountsCount: number;
  postsCount: number;
  forumsCount: number;
  walletsCount: number;
  transactionsCount: number;
  relationshipsCount: number;
  correlatedPairsCount: number;
  nodesCount: number;
}

function adaptDatasetNode(rawNode: any): GraphNode {
  return {
    id: rawNode.id,
    name: rawNode.label || rawNode.name || rawNode.id,
    label: rawNode.label || rawNode.name,
    type: (rawNode.type === 'SECURITY' ? 'CLUSTER' : (rawNode.type || 'ACTOR')) as EntityType,
    riskLevel: rawNode.riskScore >= 85 ? 'CRITICAL' : rawNode.riskScore >= 70 ? 'HIGH' : rawNode.riskScore >= 50 ? 'MEDIUM' : 'LOW',
    riskScore: rawNode.riskScore || 65,
    connectionsCount: rawNode.postCount || rawNode.txCount || 4,
    size: rawNode.size || 18,
    color: rawNode.color,
    firstSeen: rawNode.joinedDate || '2026-09-01',
    lastSeen: '2026-09-04',
    details: {
      bio: rawNode.bio,
      pgp: rawNode.pgp || rawNode.fingerprint,
      forumId: rawNode.forumId,
      fullAddress: rawNode.fullAddress,
      chain: rawNode.chain,
      balance: rawNode.balance ? `${rawNode.balance} ETH` : undefined,
      txCount: rawNode.txCount,
      postCount: rawNode.postCount
    }
  };
}

function adaptDatasetLink(rawLink: any): GraphLink {
  const src = typeof rawLink.source === 'object' ? rawLink.source.id : rawLink.source;
  const tgt = typeof rawLink.target === 'object' ? rawLink.target.id : rawLink.target;
  const conf = Number(rawLink.confidence || 90);
  const evItems = Array.isArray(rawLink.evidence)
    ? rawLink.evidence.map((e: any) => typeof e === 'string' ? { title: 'Verified Telemetry', description: e, confidenceContribution: conf } : e)
    : [{ title: 'Graph Relationship', description: 'Observed connection in intelligence registry', confidenceContribution: conf }];

  return {
    id: rawLink.id,
    source: src,
    target: tgt,
    relationship: (rawLink.relationship || 'CONNECTED_TO') as any,
    confidence: conf,
    isAnimated: conf >= 85,
    evidence: {
      sharedIdentifierScore: conf >= 90 ? 35 : 25,
      temporalOverlapScore: 20,
      aliasSimilarityScore: conf >= 80 ? 22 : 15,
      behavioralSimilarityScore: 18,
      infrastructureScore: 15,
      totalConfidence: conf,
      evidenceItems: evItems
    }
  };
}

export const ThreatGraphView: React.FC<ThreatGraphViewProps> = ({
  focusedActorName = 'shadowfox',
  onSelectActor,
  onNavigateToModule
}) => {
  const { 
    mode, 
    metadata, 
    nodes: contextNodes, 
    links: contextLinks, 
    stats: contextStats, 
    primeSuspect,
    openUploadModal, 
    resetToDemo 
  } = useDataset();

  const [apiNodes, setApiNodes] = useState<GraphNode[]>([]);
  const [apiLinks, setApiLinks] = useState<GraphLink[]>([]);
  const [apiStats, setApiStats] = useState<DatasetStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [graphEngine, setGraphEngine] = useState<'RELATIONS_2D' | 'WEBGL_3D'>('RELATIONS_2D');

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [nodeExtraDetails, setNodeExtraDetails] = useState<any | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResultMessage, setSearchResultMessage] = useState<string | null>(null);

  // Multi-hop pivot trail
  const [pivotChain, setPivotChain] = useState<GraphNode[]>([]);

  // Computed active nodes & links
  const activeNodes = useMemo(() => {
    if (mode === 'LIVE') return contextNodes;
    return apiNodes.length > 0 ? apiNodes : contextNodes;
  }, [mode, contextNodes, apiNodes]);

  const activeLinks = useMemo(() => {
    if (mode === 'LIVE') return contextLinks;
    return apiLinks.length > 0 ? apiLinks : contextLinks;
  }, [mode, contextLinks, apiLinks]);

  // Fetch live dataset graph topology
  const loadGraphData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [topoRes, statsRes] = await Promise.all([
        ApiClient.getThreatGraphTopology(),
        ApiClient.getDatasetStats()
      ]);

      if (statsRes) {
        setApiStats(statsRes);
      }

      if (topoRes && topoRes.nodes && topoRes.nodes.length > 0) {
        const adaptedNodes: GraphNode[] = topoRes.nodes.map(adaptDatasetNode);
        const adaptedLinks: GraphLink[] = (topoRes.links || []).map(adaptDatasetLink);
        setApiNodes(adaptedNodes);
        setApiLinks(adaptedLinks);

        // Seed initial pivot chain with shadowfox or first actor
        const initialActor = adaptedNodes.find(n => 
          n.name.toLowerCase() === (focusedActorName?.toLowerCase() || 'shadowfox')
        ) || adaptedNodes[0];

        if (initialActor) {
          setPivotChain([initialActor]);
        }
      } else {
        setApiNodes([]);
        setApiLinks([]);
      }
    } catch (err: any) {
      // Backend not strictly required since client-side graph engine is active
      console.warn('Backend API offline, using dataset context engine.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  // Fetch node extra details on click
  const handleSelectNode = async (node: GraphNode | null) => {
    setSelectedNode(node);
    if (!node) {
      setNodeExtraDetails(null);
      return;
    }
    handlePivotStep(node);

    try {
      const details = await ApiClient.getNodeDetails(node.id);
      if (details) {
        setNodeExtraDetails(details);
      }
    } catch {
      setNodeExtraDetails(null);
    }
  };

  const handlePivotStep = (node: GraphNode) => {
    if (!pivotChain.some(n => n.id === node.id)) {
      setPivotChain(prev => [...prev, node]);
    }
  };

  const handleSelectBreadcrumb = (index: number) => {
    const targetNode = pivotChain[index];
    setSelectedNode(targetNode);
    setPivotChain(prev => prev.slice(0, index + 1));
  };

  const handleResetPivot = () => {
    const defaultNode = activeNodes.find(n => n.name.toLowerCase() === 'shadowfox') || activeNodes[0];
    setPivotChain(defaultNode ? [defaultNode] : []);
    setSelectedNode(null);
    setSelectedLink(null);
    setNodeExtraDetails(null);
    setSearchResultMessage(null);
  };

  const handleInvestigateRelationship = () => {
    const lastNode = pivotChain[pivotChain.length - 1];
    const prevNode = pivotChain[pivotChain.length - 2];
    if (!lastNode || !prevNode) return;

    const matchedLink = activeLinks.find(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return (s === prevNode.id && t === lastNode.id) || (s === lastNode.id && t === prevNode.id);
    });

    if (matchedLink) {
      setSelectedLink(matchedLink);
      setSelectedNode(null);
    }
  };

  // Real dataset search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const matchedGraphNode = activeNodes.find(n => 
      n.id.toLowerCase().includes(query) || 
      n.name.toLowerCase().includes(query) ||
      (n.details && Object.values(n.details).some(v => String(v).toLowerCase().includes(query)))
    );

    if (matchedGraphNode) {
      handleSelectNode(matchedGraphNode);
      setSearchResultMessage(`Found in active dataset. Focused on: ${matchedGraphNode.name}`);
      return;
    }

    try {
      const res = await ApiClient.searchIntelligence(query);
      if (res && res.results && res.results.length > 0) {
        const topResult = res.results[0];
        const matched = activeNodes.find(n => n.id === topResult.id || n.name.toLowerCase() === String(topResult.label || '').toLowerCase());
        if (matched) {
          handleSelectNode(matched);
          setSearchResultMessage(`Found ${res.count} match(es). Focused on: ${matched.name}`);
        } else {
          setSearchResultMessage(`Found ${res.count} match(es) in intelligence repository.`);
        }
      } else {
        setSearchResultMessage('No matching intelligence found in the dataset.');
      }
    } catch {
      setSearchResultMessage('No matching intelligence found in active nodes.');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1920px] mx-auto font-mono-code flex flex-col h-[calc(100vh-5rem)]">
      {/* Live Data Source Indicator Banner */}
      <div className="hud-card px-4 py-2.5 rounded-xl border border-[#1e90ff]/30 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-bold text-slate-100">DATA SOURCE:</span>
            <span className="text-[#60a5fa] font-semibold truncate max-w-[200px]" title={mode === 'LIVE' ? (metadata?.fileName || 'Uploaded Dataset') : 'UNMASK MVP Dataset v2.3'}>
              {mode === 'LIVE' ? (metadata?.fileName || 'Uploaded Dataset') : 'UNMASK MVP Dataset v2.3'}
            </span>
          </div>
          <span className="text-slate-600">|</span>

          {mode === 'LIVE' ? (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE DATASET ({metadata?.recordCount || activeNodes.length} rows)
              </span>
              <button
                onClick={resetToDemo}
                className="text-[10px] text-slate-400 hover:text-amber-300 underline transition-colors cursor-pointer"
              >
                Reset to Demo
              </button>
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold shadow-[0_0_8px_rgba(59,130,246,0.3)]">
              ● DEMO DATA
            </span>
          )}
        </div>

        {/* Dynamic Statistics Counters */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-300">
          <span>Nodes: <strong className="text-[#38bdf8]">{activeNodes.length}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Edges: <strong className="text-purple-300">{activeLinks.length}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Actors: <strong className="text-emerald-300">{contextStats.actorsCount}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Wallets: <strong className="text-amber-300">{contextStats.walletsCount}</strong></span>
          <span className="text-slate-600">•</span>
          <span>High-Risk: <strong className="text-rose-400">{contextStats.highRiskCount}</strong></span>
        </div>

        {/* Action Buttons: Upload Dataset & 2D/3D Engine Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={openUploadModal}
            className="px-3 py-1.5 hud-button-primary text-white rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(30,144,255,0.4)] group cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[11px] text-white">Upload Dataset</span>
              <span className="text-[8px] text-blue-200 font-normal">CSV / JSON / XLSX</span>
            </div>
          </button>

          <div className="flex items-center p-0.5 rounded-lg bg-[#07132a] border border-[#1e3a6a]">
            <button
              onClick={() => setGraphEngine('RELATIONS_2D')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                graphEngine === 'RELATIONS_2D'
                  ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.5)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>2D Graph</span>
            </button>
            <button
              onClick={() => setGraphEngine('WEBGL_3D')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                graphEngine === 'WEBGL_3D'
                  ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.5)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>3D WebGL</span>
            </button>
          </div>

          <button
            onClick={() => {
              IntelligenceExporter.downloadCompleteIntelligenceGraphCSV(
                activeNodes,
                activeLinks,
                primeSuspect,
                metadata?.fileName || 'Threat_Network'
              );
            }}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            title="Download all discovered graph entities and topological links as CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export Graph (.CSV)</span>
          </button>

          <button
            onClick={loadGraphData}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-[#07132a] hover:bg-[#0c1f44] text-[#93c5fd] border border-[#1e3a6a] hover:border-[#1e90ff]/50 transition-all flex items-center space-x-1 cursor-pointer"
            title="Reload Dataset"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-[10px]">RELOAD</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb & Pivot Bar + Real Dataset Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1">
          <PivotBreadcrumbBar
            pivotChain={pivotChain}
            onSelectBreadcrumb={handleSelectBreadcrumb}
            onResetPivot={handleResetPivot}
            onInvestigateRelationship={handleInvestigateRelationship}
          />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 min-w-[320px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchResultMessage(null);
              }}
              placeholder="Search accounts, wallets, PGPs, keywords..."
              className="w-full pl-8 pr-8 py-1.5 bg-[#040c1e] border border-[#1e3a6a] focus:border-[#1e90ff] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:shadow-[0_0_12px_rgba(30,144,255,0.3)] font-mono-code"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResultMessage(null);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 hud-button-secondary rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <Search className="w-3 h-3" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Search Result Feedback */}
      {searchResultMessage && (
        <div className={`px-3 py-1.5 rounded-lg text-xs font-mono-code flex items-center space-x-2 border ${
          searchResultMessage.includes('No matching') 
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
            : 'bg-[#081a38] border-[#1e90ff]/40 text-[#93c5fd]'
        }`}>
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{searchResultMessage}</span>
        </div>
      )}

      {/* Main Graph Content Area */}
      <div className="relative flex-1 w-full rounded-2xl overflow-hidden shadow-2xl border border-[#1e90ff]/30 hud-card">
        {activeNodes.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#050811] text-slate-300 p-6 text-center space-y-4 font-mono-code">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dataset unavailable</h3>
            <p className="text-xs text-slate-400 max-w-md">
              {errorMessage || 'No graph nodes detected in active dataset. Click "Upload Dataset" to load your data.'}
            </p>
            <button
              onClick={openUploadModal}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-xs font-bold"
            >
              Upload Dataset
            </button>
          </div>
        ) : (
          <>
            {/* Graph Canvas: 2D Relations Graph or 3D WebGL Sphere */}
            {graphEngine === 'RELATIONS_2D' ? (
              <ThreatRelationsGraph2D
                nodes={activeNodes}
                links={activeLinks}
                selectedNodeId={selectedNode?.id || null}
                selectedLinkId={selectedLink?.id || null}
                onSelectNode={handleSelectNode}
                onSelectLink={setSelectedLink}
                onPivotStep={handlePivotStep}
                focusedActorName={focusedActorName}
              />
            ) : (
              <ThreatGraph3D
                nodes={activeNodes}
                links={activeLinks}
                selectedNodeId={selectedNode?.id || null}
                selectedLinkId={selectedLink?.id || null}
                onSelectNode={handleSelectNode}
                onSelectLink={setSelectedLink}
                onPivotStep={handlePivotStep}
                focusedActorName={focusedActorName}
              />
            )}

            {/* Floating Detail Panels: Actor Intelligence Profile, Node Detail, or Link Evidence */}
            {selectedNode && (
              selectedNode.type === 'ACTOR' ||
              (selectedNode as any).entityType === 'ACCOUNT' ||
              selectedNode.id.toLowerCase().startsWith('account-') ||
              selectedNode.id.toLowerCase().startsWith('prof_') ||
              selectedNode.id.toLowerCase().startsWith('actor-')
            ) ? (
              <ActorIntelligenceProfileDrawer
                entityId={selectedNode.id || selectedNode.name}
                onClose={() => {
                  setSelectedNode(null);
                  setNodeExtraDetails(null);
                }}
                onPivotToNode={(targetId) => {
                  const targetNode = activeNodes.find(n => 
                    n.id.toLowerCase() === targetId.toLowerCase() || 
                    n.name.toLowerCase() === targetId.toLowerCase() ||
                    n.id.toLowerCase() === `account-${targetId.toLowerCase()}`
                  );
                  if (targetNode) {
                    handleSelectNode(targetNode);
                  }
                }}
                onViewActorDossier={(name) => {
                  onSelectActor(name);
                  onNavigateToModule('ACTOR_INTELLIGENCE');
                }}
              />
            ) : selectedNode ? (
              <div className="absolute top-16 right-4 z-30 w-80 sm:w-96 max-h-[85%] overflow-y-auto space-y-3">
                <NodeDetailPanel
                  node={selectedNode}
                  onClose={() => {
                    setSelectedNode(null);
                    setNodeExtraDetails(null);
                  }}
                  onPivotToNode={handlePivotStep}
                  onViewActorDossier={(name) => {
                    onSelectActor(name);
                    onNavigateToModule('ACTOR_INTELLIGENCE');
                  }}
                />

                {/* Extra Related Forum Posts from Dataset */}
                {nodeExtraDetails && nodeExtraDetails.posts && nodeExtraDetails.posts.length > 0 && (
                  <div className="bg-[#030a1a]/55 backdrop-blur-xl border border-[#1e90ff]/30 rounded-xl p-4 shadow-2xl space-y-3 font-mono-code text-xs">
                    <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-2">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Observed Dataset Posts ({nodeExtraDetails.posts.length})
                      </span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {nodeExtraDetails.posts.map((post: any, idx: number) => (
                        <div key={idx} className="bg-[#020713]/50 p-2.5 rounded border border-[#1e3a6a]/60 space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span className="text-purple-300 font-semibold">{post.forum_id}</span>
                            <span>{post.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-200 line-clamp-3">
                            {post.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {selectedLink && (
              <div className="absolute top-16 right-4 z-30 w-80 sm:w-96 max-h-[85%] overflow-y-auto space-y-3">
                <RelationshipEvidencePanel
                  link={selectedLink}
                  nodes={activeNodes}
                  onClose={() => setSelectedLink(null)}
                />
              </div>
            )}

            {/* Quick Pivot Assist for Verified Dataset Correlated Pairs */}
            <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-2 bg-[#030a1a]/50 backdrop-blur-md px-3 py-2 rounded-xl border border-[#1e90ff]/30 text-xs">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">Dataset Correlation Trails:</span>
              <button
                onClick={() => {
                  const n1 = activeNodes.find(n => n.name.toLowerCase() === 'shadowfox');
                  const n2 = activeNodes.find(n => n.name.toLowerCase() === 'shadow_fox');
                  if (n1 && n2) {
                    setPivotChain([n1, n2]);
                    handleSelectNode(n2);
                  }
                }}
                className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 text-[10px] transition-all"
              >
                shadowfox → shadow_fox (98%)
              </button>
              <button
                onClick={() => {
                  const n1 = activeNodes.find(n => n.name.toLowerCase() === 'darkwolf');
                  const n2 = activeNodes.find(n => n.name.toLowerCase() === 'dw77');
                  if (n1 && n2) {
                    setPivotChain([n1, n2]);
                    handleSelectNode(n2);
                  }
                }}
                className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold border border-purple-500/40 text-[10px] transition-all"
              >
                darkwolf → dw77 (95%)
              </button>
              <button
                onClick={() => {
                  const n1 = activeNodes.find(n => n.name.toLowerCase() === 'cipherbyte');
                  const n2 = activeNodes.find(n => n.name.toLowerCase() === 'cipher_byte');
                  if (n1 && n2) {
                    setPivotChain([n1, n2]);
                    handleSelectNode(n2);
                  }
                }}
                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 text-[10px] transition-all"
              >
                cipherbyte → cipher_byte (98%)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

