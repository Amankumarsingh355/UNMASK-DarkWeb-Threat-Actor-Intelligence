// ============================================================
// UNMASK // THREAT RELATIONS GRAPH (2D CISCO/MISP STYLE CANVAS)
// Ultra-clean Threat Intelligence Link Analysis & Topology Visualizer
// Matches high-visibility forensic analyst graph with entity icons,
// category subtitles, dropdown indicators, and labeled arrow edges.
// ============================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { GraphNode, GraphLink, EntityType } from '../../types/intelligence';
import {
  Crosshair,
  Globe,
  Wallet,
  Key,
  FileText,
  Radio,
  Server,
  Monitor,
  ShieldAlert,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Filter,
  Eye,
  Layers,
  Sparkles,
  Search,
  X,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';

interface ThreatRelationsGraph2DProps {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNodeId: string | null;
  selectedLinkId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectLink: (link: GraphLink | null) => void;
  onPivotStep?: (node: GraphNode) => void;
  focusedActorName?: string | null;
  theme?: 'dark' | 'light';
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
  targetCategory: 'TARGET' | 'OBSERVABLE' | 'INDICATOR' | 'DOMAIN' | 'POST';
}

interface SimLink {
  id: string;
  source: SimNode;
  target: SimNode;
  relationship: string;
  confidence: number;
  color?: string;
  evidence?: any;
}

export const ThreatRelationsGraph2D: React.FC<ThreatRelationsGraph2DProps> = ({
  nodes: initialNodes,
  links: initialLinks,
  selectedNodeId,
  selectedLinkId,
  onSelectNode,
  onSelectLink,
  onPivotStep,
  focusedActorName,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [activeTab, setActiveTab] = useState<'ALL' | 'TARGETS' | 'OBSERVABLES' | 'INDICATORS' | 'DOMAINS'>('ALL');
  const [dispositionFilter, setDispositionFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'SIMPLIFIED' | 'DETAILED' | 'FULL'>('SIMPLIFIED');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Transform & Drag state
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<SimNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);

  // Categorize nodes for the top metric tabs
  const categorizedNodes = useMemo(() => {
    return initialNodes.map(n => {
      let targetCategory: 'TARGET' | 'OBSERVABLE' | 'INDICATOR' | 'DOMAIN' | 'POST' = 'OBSERVABLE';
      const t = (n.type || '').toUpperCase();
      const entityT = ((n as any).entityType || '').toUpperCase();

      if (t === 'ACTOR' || entityT === 'ACCOUNT' || n.name.toLowerCase() === (focusedActorName || '').toLowerCase()) {
        targetCategory = 'TARGET';
      } else if (t === 'WALLET' || entityT === 'WALLET' || t === 'IP') {
        targetCategory = 'OBSERVABLE';
      } else if (t === 'CLUSTER' || t === 'SECURITY' || entityT === 'PGP_KEY' || n.details?.pgp) {
        targetCategory = 'INDICATOR';
      } else if (t === 'FORUM' || t === 'INFRASTRUCTURE' || entityT === 'FORUM' || t === 'DOMAIN') {
        targetCategory = 'DOMAIN';
      } else if (t === 'POST' || entityT === 'POST') {
        targetCategory = 'POST';
      }

      return {
        ...n,
        targetCategory
      };
    });
  }, [initialNodes, focusedActorName]);

  // Counts for top tabs
  const targetCount = categorizedNodes.filter(n => n.targetCategory === 'TARGET').length;
  const observableCount = categorizedNodes.filter(n => n.targetCategory === 'OBSERVABLE').length;
  const indicatorCount = categorizedNodes.filter(n => n.targetCategory === 'INDICATOR').length;
  const domainCount = categorizedNodes.filter(n => n.targetCategory === 'DOMAIN').length;

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return categorizedNodes.filter(n => {
      // Tab filter
      if (activeTab === 'TARGETS' && n.targetCategory !== 'TARGET') return false;
      if (activeTab === 'OBSERVABLES' && n.targetCategory !== 'OBSERVABLE') return false;
      if (activeTab === 'INDICATORS' && n.targetCategory !== 'INDICATOR') return false;
      if (activeTab === 'DOMAINS' && n.targetCategory !== 'DOMAIN') return false;

      // Disposition filter
      if (dispositionFilter !== 'ALL') {
        const score = n.riskScore || 0;
        if (dispositionFilter === 'CRITICAL' && score < 80) return false;
        if (dispositionFilter === 'HIGH' && (score < 60 || score >= 80)) return false;
        if (dispositionFilter === 'MODERATE' && score >= 60) return false;
      }

      // Type filter
      if (typeFilter !== 'ALL') {
        if (typeFilter === 'ACTOR' && n.targetCategory !== 'TARGET') return false;
        if (typeFilter === 'WALLET' && n.type !== 'WALLET' && (n as any).entityType !== 'WALLET') return false;
        if (typeFilter === 'FORUM' && n.type !== 'FORUM' && (n as any).entityType !== 'FORUM') return false;
        if (typeFilter === 'PGP' && n.targetCategory !== 'INDICATOR') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = n.name.toLowerCase().includes(q) || 
                        n.id.toLowerCase().includes(q) || 
                        (n.details?.fullAddress && n.details.fullAddress.toLowerCase().includes(q)) ||
                        (n.details?.pgp && n.details.pgp.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [categorizedNodes, activeTab, dispositionFilter, typeFilter, searchQuery]);

  // Position Simulation layout
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);

  // Initialize Force Simulation
  useEffect(() => {
    if (filteredNodes.length === 0) {
      setSimNodes([]);
      setSimLinks([]);
      return;
    }

    const nodeMap = new Map<string, SimNode>();
    const count = filteredNodes.length;
    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 600;

    // Arrange nodes in cohesive concentric clusters
    const newSimNodes: SimNode[] = filteredNodes.map((n, i) => {
      let radius = 180;
      let angle = (i / Math.max(1, count)) * 2 * Math.PI;

      if (n.targetCategory === 'TARGET') {
        radius = 80 + (i % 3) * 60;
      } else if (n.targetCategory === 'OBSERVABLE') {
        radius = 240 + (i % 4) * 40;
      } else if (n.targetCategory === 'DOMAIN') {
        radius = 200 + (i % 3) * 50;
      } else if (n.targetCategory === 'INDICATOR') {
        radius = 300 + (i % 2) * 50;
      }

      const x = width / 2 + radius * Math.cos(angle) + (Math.sin(i * 4) * 30);
      const y = height / 2 + radius * Math.sin(angle) * 0.75 + (Math.cos(i * 3) * 30);

      const simNode: SimNode = {
        ...n,
        x,
        y,
        vx: 0,
        vy: 0
      };
      nodeMap.set(n.id, simNode);
      return simNode;
    });

    // Build SimLinks
    const newSimLinks: SimLink[] = [];
    initialLinks.forEach(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;

      const srcNode = nodeMap.get(srcId) || Array.from(nodeMap.values()).find(n => n.name === srcId);
      const tgtNode = nodeMap.get(tgtId) || Array.from(nodeMap.values()).find(n => n.name === tgtId);

      if (srcNode && tgtNode) {
        newSimLinks.push({
          id: l.id,
          source: srcNode,
          target: tgtNode,
          relationship: l.relationship || 'Connected To',
          confidence: l.confidence || 90,
          color: (l as any).color || '#64748b',
          evidence: l.evidence
        });
      }
    });

    setSimNodes(newSimNodes);
    setSimLinks(newSimLinks);

    // Run 40 quick force relaxation steps for aesthetic organic layout
    for (let step = 0; step < 40; step++) {
      // Repulsion
      for (let i = 0; i < newSimNodes.length; i++) {
        for (let j = i + 1; j < newSimNodes.length; j++) {
          const n1 = newSimNodes[i];
          const n2 = newSimNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 180) {
            const force = (180 - dist) / dist * 0.5;
            n1.x -= dx * force * 0.5;
            n1.y -= dy * force * 0.5;
            n2.x += dx * force * 0.5;
            n2.y += dy * force * 0.5;
          }
        }
      }

      // Link spring attraction
      for (const link of newSimLinks) {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 160;
        const force = (dist - targetDist) * 0.04;
        link.source.x += dx / dist * force;
        link.source.y += dy / dist * force;
        link.target.x -= dx / dist * force;
        link.target.y -= dy / dist * force;
      }
    }
  }, [filteredNodes, initialLinks]);

  // Search autocomplete & focus state
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching node suggestions
  const matchingNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return initialNodes.filter(n =>
      n.name.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q) ||
      (n.type && n.type.toLowerCase().includes(q)) ||
      (n.details?.fullAddress && n.details.fullAddress.toLowerCase().includes(q)) ||
      (n.details?.pgp && n.details.pgp.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery, initialNodes]);

  // Center / Fit Graph in view
  const handleResetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  const handleZoom = (delta: number) => {
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.3, Math.min(3, prev.k + delta))
    }));
  };

  // Focus and center canvas onto target node
  const focusOnNode = (node: GraphNode | SimNode) => {
    const targetSim = simNodes.find(n => n.id === node.id || n.name.toLowerCase() === node.name.toLowerCase());
    if (!targetSim) {
      onSelectNode(node);
      return;
    }

    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 600;
    const targetK = 1.35;

    setTransform({
      x: width / 2 - targetSim.x * targetK,
      y: height / 2 - targetSim.y * targetK,
      k: targetK
    });

    onSelectNode(targetSim);
    if (onPivotStep) onPivotStep(targetSim);
    setIsSearchDropdownOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (matchingNodes.length > 0) {
      focusOnNode(matchingNodes[0]);
    } else if (searchQuery.trim()) {
      const direct = initialNodes.find(n => 
        n.name.toLowerCase() === searchQuery.trim().toLowerCase() ||
        n.id.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (direct) focusOnNode(direct);
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      }));
    } else if (draggedNode) {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const newX = (e.clientX - containerRect.left - transform.x) / transform.k;
        const newY = (e.clientY - containerRect.top - transform.y) / transform.k;
        setSimNodes(prev => prev.map(n => n.id === draggedNode.id ? { ...n, x: newX, y: newY } : n));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  // Node Icon & Theme Renderer matching user screenshot
  const renderNodeIcon = (node: SimNode) => {
    const isSelected = selectedNodeId === node.id;
    const isHovered = hoveredNodeId === node.id;

    if (node.targetCategory === 'TARGET') {
      // Purple ring with monitor/actor in center (matching LIMESTONE-WIN10 in screenshot)
      return (
        <g className="cursor-pointer">
          {/* Target Crosshair Outer Ring */}
          <circle
            cx={0}
            cy={0}
            r={28}
            className={`transition-all ${
              isSelected 
                ? 'fill-purple-500/30 stroke-purple-400 stroke-[3]' 
                : isHovered 
                ? 'fill-purple-500/20 stroke-purple-400 stroke-2' 
                : 'fill-[#120e24] stroke-purple-500/80 stroke-2'
            }`}
          />
          {/* Crosshair ticks */}
          <line x1={0} y1={-33} x2={0} y2={-28} stroke="#a855f7" strokeWidth="2" />
          <line x1={0} y1={28} x2={0} y2={33} stroke="#a855f7" strokeWidth="2" />
          <line x1={-33} y1={0} x2={-28} y2={0} stroke="#a855f7" strokeWidth="2" />
          <line x1={28} y1={0} x2={33} y2={0} stroke="#a855f7" strokeWidth="2" />

          {/* Inner Badge Icon */}
          <rect x={-14} y={-11} width={28} height={20} rx={4} fill="#8b5cf6" />
          <rect x={-11} y={-8} width={22} height={14} rx={2} fill="#0d0a1a" />
          <circle cx={0} cy={-1} r={3} fill="#c084fc" />
          <rect x={-4} y={9} width={8} height={3} fill="#8b5cf6" />
        </g>
      );
    }

    if (node.targetCategory === 'DOMAIN') {
      // Red / Purple globe with search magnifying badge (matching Domains in screenshot)
      return (
        <g className="cursor-pointer">
          <circle
            cx={0}
            cy={0}
            r={20}
            className={`transition-all ${
              isSelected ? 'fill-rose-500/30 stroke-rose-400 stroke-2' : 'fill-[#180d14] stroke-rose-500/70 stroke-[1.5]'
            }`}
          />
          {/* Globe grid lines */}
          <circle cx={0} cy={0} r={13} fill="none" stroke="#f43f5e" strokeWidth="1.2" />
          <ellipse cx={0} cy={0} rx={6} ry={13} fill="none" stroke="#f43f5e" strokeWidth="1" />
          <line x1={-13} y1={0} x2={13} y2={0} stroke="#f43f5e" strokeWidth="1" />
          {/* Magnifier Badge */}
          <circle cx={14} cy={-14} r={6} fill="#0d1117" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1={18} y1={-10} x2={22} y2={-6} stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      );
    }

    if (node.targetCategory === 'OBSERVABLE') {
      // IP or Wallet icon (matching IP 146.112.61.105 in screenshot)
      return (
        <g className="cursor-pointer">
          <rect
            x={-18}
            y={-14}
            width={36}
            height={26}
            rx={5}
            className={`transition-all ${
              isSelected ? 'fill-amber-500/30 stroke-amber-400 stroke-2' : 'fill-[#17140e] stroke-amber-500/70 stroke-[1.5]'
            }`}
          />
          {/* Wallet / Network 3 dots */}
          <rect x={-14} y={-10} width={28} height={8} rx={2} fill="#d97706" />
          <circle cx={-8} cy={4} r={2} fill="#f59e0b" />
          <circle cx={0} cy={4} r={2} fill="#f59e0b" />
          <circle cx={8} cy={4} r={2} fill="#f59e0b" />
        </g>
      );
    }

    if (node.targetCategory === 'INDICATOR') {
      // Red / Amber Document with SHA-256 / PGP key (matching 9 SHA-256s in screenshot)
      return (
        <g className="cursor-pointer">
          <circle
            cx={0}
            cy={0}
            r={19}
            className={`transition-all ${
              isSelected ? 'fill-emerald-500/30 stroke-emerald-400 stroke-2' : 'fill-[#0d1814] stroke-emerald-500/70 stroke-[1.5]'
            }`}
          />
          <path d="M-6 -9 L3 -9 L8 -4 L8 9 L-6 9 Z" fill="#10b981" />
          <path d="M3 -9 L3 -4 L8 -4 Z" fill="#047857" />
          <line x1={-3} y1={-1} x2={5} y2={-1} stroke="#064e3b" strokeWidth="1" />
          <line x1={-3} y1={3} x2={5} y2={3} stroke="#064e3b" strokeWidth="1" />
        </g>
      );
    }

    // Default: Browser / URL / Post window
    return (
      <g className="cursor-pointer">
        <rect
          x={-16}
          y={-13}
          width={32}
          height={24}
          rx={4}
          className={`transition-all ${
            isSelected ? 'fill-orange-500/30 stroke-orange-400 stroke-2' : 'fill-[#1a110a] stroke-orange-500/70 stroke-[1.5]'
          }`}
        />
        <rect x={-16} y={-13} width={32} height={6} rx={2} fill="#ea580c" />
        <circle cx={-11} cy={-10} r={1.2} fill="#fff" />
        <circle cx={-7} cy={-10} r={1.2} fill="#fff" />
        <line x1={-10} y1={-1} x2={10} y2={-1} stroke="#fb923c" strokeWidth="1" />
        <line x1={-10} y1={4} x2={4} y2={4} stroke="#fb923c" strokeWidth="1" />
      </g>
    );
  };

  // Node Category Subtitle
  const getNodeCategorySubtitle = (node: SimNode): string => {
    if (node.targetCategory === 'TARGET') return 'Target Actor';
    if (node.targetCategory === 'DOMAIN') return node.type === 'FORUM' ? 'Darknet Forum' : 'Malicious Domain';
    if (node.targetCategory === 'OBSERVABLE') return node.type === 'WALLET' ? 'Crypto Wallet' : 'IP / Node';
    if (node.targetCategory === 'INDICATOR') return 'PGP Keyring';
    return 'Forum Post';
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[#1e90ff]/25 bg-[#030a1a]/40 backdrop-blur-md overflow-hidden select-none font-mono shadow-[0_0_25px_rgba(0,0,0,0.5)]">
      {/* ============================================================ */}
      {/* 1. TOP METRIC FILTER TABS (Cisco Threat Response Header)     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#1e90ff]/20 bg-[#020713]/40 backdrop-blur-md">
        {/* Targets Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'TARGETS' ? 'ALL' : 'TARGETS')}
          className={`p-3 text-left border-r border-[#1e90ff]/20 transition-all flex items-center justify-between group cursor-pointer relative ${
            activeTab === 'TARGETS' ? 'bg-purple-500/20 shadow-inner' : 'hover:bg-[#1e90ff]/05'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 shrink-0">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>{targetCount} Targets</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400">Threat Actors & Profiles</span>
            </div>
          </div>
          {activeTab === 'TARGETS' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></div>
          )}
        </button>

        {/* Observables Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'OBSERVABLES' ? 'ALL' : 'OBSERVABLES')}
          className={`p-3 text-left border-r border-[#1e90ff]/20 transition-all flex items-center justify-between group cursor-pointer relative ${
            activeTab === 'OBSERVABLES' ? 'bg-amber-500/20 shadow-inner' : 'hover:bg-[#1e90ff]/05'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>{observableCount} Observables</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400">IPs & Crypto Wallets</span>
            </div>
          </div>
          {activeTab === 'OBSERVABLES' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
          )}
        </button>

        {/* Indicators Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'INDICATORS' ? 'ALL' : 'INDICATORS')}
          className={`p-3 text-left border-r border-[#1e90ff]/20 transition-all flex items-center justify-between group cursor-pointer relative ${
            activeTab === 'INDICATORS' ? 'bg-emerald-500/15' : 'hover:bg-[#1e90ff]/05'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>{indicatorCount} Indicators</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400">PGP Keyrings & Hashes</span>
            </div>
          </div>
          {activeTab === 'INDICATORS' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
          )}
        </button>

        {/* Domains / Forums Tab */}
        <button
          onClick={() => setActiveTab(activeTab === 'DOMAINS' ? 'ALL' : 'DOMAINS')}
          className={`p-3 text-left transition-all flex items-center justify-between group cursor-pointer relative ${
            activeTab === 'DOMAINS' ? 'bg-rose-500/15' : 'hover:bg-[#1e90ff]/05'
          }`}
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <span>{domainCount} Forums/Domains</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400">Underground Markets</span>
            </div>
          </div>
          {activeTab === 'DOMAINS' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. RELATIONS GRAPH SUB-HEADER CONTROLS BAR                  */}
      {/* ============================================================ */}
      <div className="px-4 py-2.5 bg-[#020713]/30 backdrop-blur-md border-b border-[#1e90ff]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
          <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#38bdf8]" />
            Relations Graph
          </span>
          <span className="text-slate-600">|</span>

          {/* Disposition Filters */}
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-400">Filter:</span>
            <select
              value={dispositionFilter}
              onChange={(e) => setDispositionFilter(e.target.value as any)}
              className="bg-[#040c1e]/60 border border-[#1e3a6a] text-slate-200 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:border-[#1e90ff]"
            >
              <option value="ALL">All Dispositions ▾</option>
              <option value="CRITICAL">Critical (80+) ▾</option>
              <option value="HIGH">High (60-79) ▾</option>
              <option value="MODERATE">Moderate (&lt;60) ▾</option>
            </select>
          </div>
          <span className="text-slate-600">|</span>

          {/* Display Mode */}
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-400">Mode:</span>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as any)}
              className="bg-[#040c1e]/60 border border-[#1e3a6a] text-slate-200 rounded px-2 py-0.5 text-[11px] focus:outline-none font-bold text-[#38bdf8]"
            >
              <option value="SIMPLIFIED">Simplified ▾</option>
              <option value="DETAILED">Detailed Evidence ▾</option>
              <option value="FULL">Full Multi-Hop ▾</option>
            </select>
          </div>
          <span className="text-slate-600">•</span>

          {/* Telemetry Counter */}
          <span className="text-slate-400 text-[11px]">
            Showing <strong className="text-[#38bdf8] font-bold">{simNodes.length}</strong> of {initialNodes.length} nodes
          </span>
        </div>

        {/* Search & Canvas Tools */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Node Search Bar & Button */}
          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  placeholder="Search nodes (e.g. shadowfox, 0xdd31...)..."
                  className="w-52 sm:w-64 pl-8 pr-7 py-1 bg-[#020713]/70 border border-[#1e3a6a] focus:border-[#1e90ff] rounded-lg text-[11px] text-white placeholder-slate-500 focus:outline-none focus:shadow-[0_0_10px_rgba(30,144,255,0.4)] transition-all font-mono"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Explicit Search Button */}
              <button
                type="submit"
                className="px-2.5 py-1 hud-button-primary text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 transition-all shadow-sm cursor-pointer hover:shadow-[0_0_10px_rgba(30,144,255,0.5)]"
                title="Search and Focus on Node"
              >
                <Search className="w-3 h-3" />
                <span>Search</span>
              </button>
            </form>

            {/* Interactive Search Autocomplete Dropdown */}
            {isSearchDropdownOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 max-h-64 overflow-y-auto rounded-xl bg-[#030a1a]/95 backdrop-blur-xl border border-[#1e90ff]/40 shadow-2xl z-50 p-1.5 space-y-1 text-xs font-mono">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold border-b border-[#1e90ff]/20 flex justify-between items-center">
                  <span>Matching Graph Entities ({matchingNodes.length})</span>
                  <span className="text-cyan-400 text-[9px]">Click to Focus</span>
                </div>

                {matchingNodes.length === 0 ? (
                  <div className="p-3 text-center text-slate-400 text-[11px] italic">
                    No matching nodes found for "{searchQuery}"
                  </div>
                ) : (
                  matchingNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => focusOnNode(node)}
                        className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1e90ff]/30 text-white border border-[#1e90ff]/50'
                            : 'hover:bg-[#1e90ff]/15 text-slate-200 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <div className={`p-1 rounded text-[10px] font-bold shrink-0 ${
                            node.type === 'ACTOR' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                            node.type === 'WALLET' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            node.type === 'FORUM' || node.type === 'DOMAIN' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {node.type}
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-xs text-white block truncate">{node.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate font-sans">
                              {node.details?.fullAddress || node.details?.pgp || node.details?.bio || node.id}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                          (node.riskScore || 50) >= 80 ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' :
                          (node.riskScore || 50) >= 60 ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' :
                          'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {node.riskScore || 50} Risk
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <span className="text-slate-600">|</span>

          {/* Zoom & Canvas Tools */}
          <button
            onClick={() => handleZoom(0.2)}
            className="p-1.5 rounded-lg bg-[#040c1e]/60 hover:bg-[#081a38]/80 text-slate-300 border border-[#1e3a6a] hover:border-[#1e90ff]/50 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-1.5 rounded-lg bg-[#040c1e]/60 hover:bg-[#081a38]/80 text-slate-300 border border-[#1e3a6a] hover:border-[#1e90ff]/50 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg bg-[#040c1e]/60 hover:bg-[#081a38]/80 text-slate-300 border border-[#1e3a6a] hover:border-[#1e90ff]/50 transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE 2D SVG RELATIONS CANVAS                      */}
      {/* ============================================================ */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden bg-transparent"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(30, 144, 255, 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        <svg className="w-full h-full absolute inset-0 pointer-events-auto">
          <defs>
            {/* Arrowhead marker for edges */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
            {/* --- EDGES / LINKS --- */}
            {simLinks.map(link => {
              const isSelected = selectedLinkId === link.id;
              const isHovered = hoveredLinkId === link.id;
              const isSourceConnected = selectedNodeId === link.source.id || selectedNodeId === link.target.id;

              const midX = (link.source.x + link.target.x) / 2;
              const midY = (link.source.y + link.target.y) / 2;

              return (
                <g key={link.id} className="cursor-pointer">
                  {/* Background Hit Target */}
                  <line
                    x1={link.source.x}
                    y1={link.source.y}
                    x2={link.target.x}
                    y2={link.target.y}
                    stroke="transparent"
                    strokeWidth="14"
                    onMouseEnter={() => setHoveredLinkId(link.id)}
                    onMouseLeave={() => setHoveredLinkId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLink(link as any);
                    }}
                  />

                  {/* Visual Edge Line */}
                  <line
                    x1={link.source.x}
                    y1={link.source.y}
                    x2={link.target.x}
                    y2={link.target.y}
                    stroke={
                      isSelected 
                        ? '#38bdf8' 
                        : isSourceConnected 
                        ? '#818cf8' 
                        : isHovered 
                        ? '#cbd5e1' 
                        : '#334155'
                    }
                    strokeWidth={isSelected || isSourceConnected ? '2.5' : isHovered ? '2' : '1.2'}
                    strokeDasharray={link.relationship === 'CORRELATED_ACTOR' ? '4 3' : undefined}
                    markerEnd={isSelected || isSourceConnected ? 'url(#arrow-active)' : 'url(#arrow)'}
                    className="transition-colors duration-150"
                  />

                  {/* Edge Text Label (Connected To / POSTED_ON / etc.) */}
                  <g transform={`translate(${midX}, ${midY})`} className="pointer-events-none">
                    <rect
                      x={-40}
                      y={-8}
                      width={80}
                      height={14}
                      rx={3}
                      fill="#070c16"
                      stroke={isSelected ? '#38bdf8' : isHovered ? '#64748b' : '#1e293b'}
                      strokeWidth="0.8"
                    />
                    <text
                      x={0}
                      y={2}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#94a3b8'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {link.relationship.replace(/_/g, ' ')}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* --- NODES --- */}
            {simNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(node);
                    if (onPivotStep) onPivotStep(node);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggedNode(node);
                  }}
                >
                  {/* Node Icon Avatar */}
                  {renderNodeIcon(node)}

                  {/* Subtitle Category Label (e.g. Target Endpoint, IP, Domain) */}
                  <text
                    x={0}
                    y={32}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none font-medium uppercase tracking-wider"
                  >
                    {getNodeCategorySubtitle(node)}
                  </text>

                  {/* Primary Name with Dropdown Arrow ▾ (matching screenshot) */}
                  <g transform="translate(0, 44)" className="cursor-pointer">
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      fill={
                        isSelected 
                          ? '#38bdf8' 
                          : isHovered 
                          ? '#ffffff' 
                          : '#e2e8f0'
                      }
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="transition-colors"
                    >
                      {node.name.length > 18 ? `${node.name.slice(0, 16)}...` : node.name} ▾
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Quick Legend Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-2 rounded-xl bg-[#020713]/40 backdrop-blur-md border border-[#1e90ff]/30 text-[10px] text-slate-300 flex items-center space-x-3 pointer-events-none shadow-lg">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Target/Actor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Wallet / IP</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Forum / Domain</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>PGP Key / Hash</span>
          </div>
        </div>
      </div>
    </div>
  );
};
