// ============================================================
// UNMASK // DATASET CONTEXT & LIVE INTELLIGENCE STATE
// Central state orchestrator for Demo vs. Live Dataset Mode
// ============================================================

import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { GraphNode, GraphLink } from '../types/intelligence';
import { 
  INITIAL_GRAPH_NODES, 
  INITIAL_GRAPH_LINKS, 
  TIMELINE_24H_DATA 
} from '../data/mockIntelligence';
import { 
  DatasetGraphProcessor, 
  type DatasetMetadata, 
  type ProcessedGraphResult,
  type SuspectAttribution
} from '../services/datasetGraphProcessor';

export interface DynamicStats {
  nodesCount: number;
  edgesCount: number;
  actorsCount: number;
  platformsCount: number;
  aliasesCount: number;
  walletsCount: number;
  pgpCount: number;
  domainsCount: number;
  emailsCount: number;
  ipsCount: number;
  highRiskCount: number;
}

interface DatasetContextType {
  mode: 'DEMO' | 'LIVE';
  metadata: DatasetMetadata | null;
  nodes: GraphNode[];
  links: GraphLink[];
  stats: DynamicStats;
  timelineData: { time: string; totalEvents: number; anomalyScore: number }[];
  hasTimelineData: boolean;
  rawRecords: Record<string, any>[];
  primeSuspect: SuspectAttribution;
  topSuspects: SuspectAttribution[];
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  uploadAndProcessFile: (
    file: File, 
    onProgress?: (step: number, label: string) => void
  ) => Promise<ProcessedGraphResult>;
  switchMode: (mode: 'DEMO' | 'LIVE') => void;
  resetToDemo: () => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

// Initial Demo Stats computed from INITIAL_GRAPH_NODES & INITIAL_GRAPH_LINKS
const DEMO_STATS: DynamicStats = {
  nodesCount: INITIAL_GRAPH_NODES.length,
  edgesCount: INITIAL_GRAPH_LINKS.length,
  actorsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'ACTOR').length,
  platformsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'FORUM').length,
  aliasesCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'ALIAS').length,
  walletsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'WALLET').length,
  pgpCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'CLUSTER' || n.name.includes('PGP') || n.name.includes('0xDD31')).length,
  domainsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'DOMAIN').length,
  emailsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'EMAIL').length,
  ipsCount: INITIAL_GRAPH_NODES.filter(n => n.type === 'IP').length,
  highRiskCount: INITIAL_GRAPH_NODES.filter(n => n.riskLevel === 'HIGH' || n.riskLevel === 'CRITICAL').length
};

const DEMO_PRIME_SUSPECT: SuspectAttribution = {
  rank: 1,
  name: 'shadowfox',
  type: 'ACTOR',
  riskScore: 78,
  riskLevel: 'HIGH',
  confidenceScore: 98,
  category: 'Cryptocurrency Drainer & Exploit Broker',
  why: 'Matched PGP Key (3A51BFA5...) + Drainer Wallet 0xdd31ffb1... (12.4 ETH) + Subconscious phrase match on BlackMarket forum + Circadian active window 18:00-02:00 UTC',
  reasons: [
    'Published PGP Key Fingerprint 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B (4096R).',
    'Deposit Wallet 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 with 12.4 ETH and 3 mixer peeling hops.',
    'Linguistic phrase signature match: "prefers short factual replies when a thread gets noisy".',
    'Active European timezone cluster (18:00 - 02:00 UTC) with daytime cessation.'
  ],
  connectionsCount: 11,
  recordCount: 42,
  associatedEntities: [
    { type: 'WALLET', value: '0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17' },
    { type: 'DOMAIN', value: 'F001-market.onion' },
    { type: 'FORUM', value: 'BlackMarket Forum' },
    { type: 'IP', value: '185.220.101.5' }
  ]
};

const DEMO_TOP_SUSPECTS: SuspectAttribution[] = [
  DEMO_PRIME_SUSPECT,
  {
    rank: 2,
    name: 'cipher_byte',
    type: 'ACTOR',
    riskScore: 82,
    riskLevel: 'HIGH',
    confidenceScore: 94,
    category: 'Underground Carding & Exploit Broker',
    why: 'Direct correlation with F002-market.onion + Monitored peeling chain deposit + Consistent punctuation entropy on Dread forum',
    reasons: [
      'Hosting infrastructure tied to F002-market.onion hidden service.',
      'Cryptocurrency deposit trace linked to carding escrow peeling chain.',
      'High punctuation entropy similarity on darknet forums.'
    ],
    connectionsCount: 8,
    recordCount: 29,
    associatedEntities: [
      { type: 'DOMAIN', value: 'F002-market.onion' },
      { type: 'WALLET', value: '0x3a92...bc14' }
    ]
  },
  {
    rank: 3,
    name: 'byte_reaper',
    type: 'ACTOR',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    confidenceScore: 91,
    category: 'Ransomware Operator & Payload Broker',
    why: 'Ransomware builder payload signature match + Co-located bulletproof German IP 185.220.101.5 + Nocturnal activity cycle (UTC 22:00-04:00)',
    reasons: [
      'Ransomware binary payload cryptographic digest match.',
      'Bulletproof German hosting infrastructure (185.220.101.5).',
      'Nocturnal operational temporal window (22:00 - 04:00 UTC).'
    ],
    connectionsCount: 9,
    recordCount: 34,
    associatedEntities: [
      { type: 'IP', value: '185.220.101.5' }
    ]
  },
  {
    rank: 4,
    name: 'krypton_99',
    type: 'ACTOR',
    riskScore: 75,
    riskLevel: 'HIGH',
    confidenceScore: 87,
    category: 'Financial Money Laundering Facilitator',
    why: 'Cross-forum username distance < 0.12 + Shared Jabber handle krypton@exploit.im + Heavy liquidity pool interaction with mixer pools',
    reasons: [
      'Shared Jabber handle krypton@exploit.im.',
      'Heavy liquidity pool routing through mixer contracts.',
      'Low Levenshtein distance across forum handles.'
    ],
    connectionsCount: 6,
    recordCount: 19,
    associatedEntities: [
      { type: 'EMAIL', value: 'krypton@exploit.im' }
    ]
  }
];

export const DatasetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [liveDataset, setLiveDataset] = useState<ProcessedGraphResult | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const uploadAndProcessFile = async (
    file: File,
    onProgress?: (step: number, label: string) => void
  ): Promise<ProcessedGraphResult> => {
    // 1. Parse file (CSV, JSON, XLSX)
    const { records, fileType } = await DatasetGraphProcessor.parseFile(file);
    const columns = Object.keys(records[0] || {});
    
    // 2. Detect column mapping
    const mappings = DatasetGraphProcessor.detectColumnMappings(columns);

    // 3. Process into dynamic graph
    const result = DatasetGraphProcessor.processDataset(file, records, mappings, onProgress);
    
    // 4. Update live state
    setLiveDataset(result);
    setMode('LIVE');
    return result;
  };

  const switchMode = (newMode: 'DEMO' | 'LIVE') => {
    if (newMode === 'LIVE' && !liveDataset) {
      openUploadModal();
      return;
    }
    setMode(newMode);
  };

  const resetToDemo = () => {
    setMode('DEMO');
  };

  // Active data based on mode
  const currentNodes = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.nodes;
    }
    return INITIAL_GRAPH_NODES;
  }, [mode, liveDataset]);

  const currentLinks = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.links;
    }
    return INITIAL_GRAPH_LINKS;
  }, [mode, liveDataset]);

  const currentStats = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.stats;
    }
    return DEMO_STATS;
  }, [mode, liveDataset]);

  const currentTimelineData = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.timelineData;
    }
    return TIMELINE_24H_DATA;
  }, [mode, liveDataset]);

  const hasTimelineData = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.hasTimelineData;
    }
    return true; // Demo data has timeline
  }, [mode, liveDataset]);

  const currentMetadata = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.metadata;
    }
    return null;
  }, [mode, liveDataset]);

  const currentRawRecords = useMemo(() => {
    if (mode === 'LIVE' && liveDataset) {
      return liveDataset.rawRecords;
    }
    return [];
  }, [mode, liveDataset]);

  const currentPrimeSuspect = useMemo(() => {
    if (mode === 'LIVE' && liveDataset?.primeSuspect) {
      return liveDataset.primeSuspect;
    }
    return DEMO_PRIME_SUSPECT;
  }, [mode, liveDataset]);

  const currentTopSuspects = useMemo(() => {
    if (mode === 'LIVE' && liveDataset?.topSuspects && liveDataset.topSuspects.length > 0) {
      return liveDataset.topSuspects;
    }
    return DEMO_TOP_SUSPECTS;
  }, [mode, liveDataset]);

  return (
    <DatasetContext.Provider
      value={{
        mode,
        metadata: currentMetadata,
        nodes: currentNodes,
        links: currentLinks,
        stats: currentStats,
        timelineData: currentTimelineData,
        hasTimelineData,
        rawRecords: currentRawRecords,
        primeSuspect: currentPrimeSuspect,
        topSuspects: currentTopSuspects,
        isUploadModalOpen,
        openUploadModal,
        closeUploadModal,
        uploadAndProcessFile,
        switchMode,
        resetToDemo
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = (): DatasetContextType => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};
