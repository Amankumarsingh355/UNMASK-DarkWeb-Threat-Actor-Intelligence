// ============================================================
// UNMASK // NTRO CYBER INTELLIGENCE DATA TYPES
// Dark Web Threat Actor De-anonymization Platform
// ============================================================

export type EntityType = 
  | 'ACTOR'
  | 'ALIAS'
  | 'EMAIL'
  | 'DOMAIN'
  | 'IP'
  | 'WALLET'
  | 'TRANSACTION'
  | 'FORUM'
  | 'POST'
  | 'CLUSTER'
  | 'EVENT';

export type RelationshipType = 
  | 'USES_ALIAS'
  | 'USES_EMAIL'
  | 'USES_WALLET'
  | 'POSTED_ON'
  | 'MENTIONED'
  | 'CONNECTED_TO'
  | 'TRANSACTED_WITH'
  | 'SHARED_INDICATOR'
  | 'SIMILAR_BEHAVIOR'
  | 'TEMPORAL_OVERLAP'
  | 'POTENTIAL_CORRELATION';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatActor {
  id: string;
  primaryAlias: string;
  status: 'ACTIVE' | 'MONITORED' | 'DORMANT';
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100%
  threatCategory: string; // e.g. "Ransomware Operations", "Initial Access Broker", "Credential Extractor"
  firstSeen: string;
  lastSeen: string;
  summary: string;
  operationalProfile: {
    originHypothesis: string;
    primaryMotivation: string;
    sophistication: 'LOW' | 'INTERMEDIATE' | 'ADVANCED' | 'STATE-ALIGNED';
    operationalHoursUTC: string;
    primaryLanguages: string[];
    observedTools: string[];
  };
  metrics: {
    aliasCount: number;
    emailCount: number;
    walletCount: number;
    domainCount: number;
    forumCount: number;
    relatedEntityCount: number;
    activeAlertCount: number;
    investigationCount: number;
  };
  riskBreakdown: {
    aliasCorrelation: number;     // max 20
    behavioralSimilarity: number; // max 15
    infrastructureLink: number;   // max 20
    activityAnomaly: number;      // max 15
    temporalCorrelation: number;  // max 10
    blockchainRelationship: number; // max 20
  };
  behavioralSignals: {
    peakActivityHours: string;
    avgPostsPerDay: number;
    avgMessageLength: number;
    primaryLanguage: string;
    topicDistribution: { topic: string; percentage: number }[];
    behaviorSimilarityScore: number;
  };
  stylometricProfile: {
    sentenceLengthAvg: number;
    vocabularyRichness: number; // 0-100
    punctuationPatterns: string;
    emojiUsageFrequency: 'RARE' | 'OCCASIONAL' | 'FREQUENT';
    writingRhythm: string;
    keyLinguisticMarkers: string[];
  };
  aliases: {
    alias: string;
    similarityScore: number; // percentage
    platform: string;
    firstObserved: string;
    confidenceLevel: string;
  }[];
  emails: string[];
  wallets: {
    address: string;
    currency: 'BTC' | 'ETH' | 'XMR';
    balanceEstimated: string;
    mixerHops: number;
    riskScore: number;
  }[];
  domains: {
    domain: string;
    type: 'TOR_ONION' | 'CLEARNET_PROXY' | 'C2_NODE';
    status: 'ACTIVE' | 'SEIZED' | 'OFFLINE';
  }[];
  ips: {
    ip: string;
    asn: string;
    country: string;
    serviceType: 'TOR_EXIT_NODE' | 'BULLETPROOF_VPN' | 'RESIDENTIAL_PROXY';
  }[];
  forums: {
    name: string;
    reputationScore: number;
    postCount: number;
  }[];
}

export interface GraphNode {
  id: string;
  name: string;
  label?: string;
  type: EntityType;
  riskLevel?: RiskLevel;
  riskScore?: number;
  connectionsCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  details?: Record<string, any>;
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface RelationshipEvidence {
  sharedIdentifierScore: number; // e.g. 30
  temporalOverlapScore: number;  // e.g. 20
  aliasSimilarityScore: number;  // e.g. 18
  behavioralSimilarityScore: number; // e.g. 20
  infrastructureScore: number;   // e.g. 12
  totalConfidence: number;       // e.g. 88
  evidenceItems: {
    icon?: string;
    title: string;
    description: string;
    confidenceContribution: number;
  }[];
}

export interface GraphLink {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  relationship: RelationshipType | string;
  confidence: number; // 0 - 100
  evidence?: RelationshipEvidence | string[] | any;
  evidence_count?: number;
  signals?: string[];
  ruleEvaluations?: RuleEvaluation[];
  attributionResult?: AttributionResult;
  disclaimer?: string;
  color?: string;
  value?: number;
  timestamp?: string;
  isAnimated?: boolean;
}

export interface Investigation {
  id: string;
  title: string;
  targetActorId: string;
  targetActorName: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'CLOSED';
  riskLevel: RiskLevel;
  confidenceScore: number;
  leadAnalyst: string;
  createdDate: string;
  lastUpdated: string;
  relatedEntitiesCount: number;
  alertsCount: number;
  summary: string;
  keyFindings: string[];
  entities: { id: string; name: string; type: EntityType; risk: RiskLevel }[];
  timeline: {
    id: string;
    timestamp: string;
    title: string;
    description: string;
    severity: RiskLevel;
    entityInvolved: string;
  }[];
  evidenceList: {
    id: string;
    title: string;
    category: string;
    confidence: number;
    description: string;
    verifiedBy: string;
  }[];
  analystNotes: {
    id: string;
    author: string;
    date: string;
    content: string;
  }[];
}

export interface ThreatAlert {
  id: string;
  title: string;
  type: 'COORDINATED_ACTIVITY' | 'MIXER_TRANSACTION' | 'ALIAS_CORRELATION' | 'TEMPORAL_SPIKE' | 'INFRASTRUCTURE_REUSE';
  severity: RiskLevel;
  timestamp: string;
  confidence: number;
  summary: string;
  involvedActors: string[];
  indicatorsCount: number;
  activitySpikePercentage?: number;
  status: 'NEW' | 'INVESTIGATING' | 'REVIEWED';
}

export interface LiveEventFeedItem {
  id: string;
  timestamp: string;
  severity: RiskLevel;
  headline: string;
  actorId?: string;
  actorName?: string;
  entityType: EntityType;
  entityValue: string;
  description: string;
}

export interface AnomalyDetectionRecord {
  id: string;
  actorId: string;
  actorName: string;
  metric: string;
  baselineRate: number; // e.g. 15 posts/day
  observedRate: number; // e.g. 92 posts/day
  spikePercentage: number; // e.g. +513%
  detectionTimestamp: string;
  severity: RiskLevel;
  description: string;
}

export interface StylometricComparison {
  actorA: string;
  actorB: string;
  overallSimilarity: number;
  metrics: {
    metricName: string;
    scoreA: number;
    scoreB: number;
    similarityPct: number;
  }[];
  linguisticConclusion: string;
}

// ============================================================
// AI ANALYSIS CONFIDENCE & SCORING TYPES
// ============================================================

export type ConfidenceTier = 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';

export interface ConfidenceSignals {
  aliasSimilarity: number;
  stylometricSimilarity: number;
  behavioralSimilarity: number;
  temporalCorrelation: number;
  sharedIndicators: number;
  graphRelationship: number;
}

export interface ConfidenceWeights {
  aliasSimilarity: number;
  stylometricSimilarity: number;
  behavioralSimilarity: number;
  temporalCorrelation: number;
  sharedIndicators: number;
  graphRelationship: number;
}

export interface PrimarySignalItem {
  name: string;
  detail: string;
  status: string;
  score: number;
}

export interface UncertainSignalItem {
  name: string;
  detail: string;
  status: string;
  impact: string;
}

export interface ConfidenceTimelineStage {
  stage: string;
  score: number;
  step: number;
  description: string;
  unlockedSignal: string;
}

export interface EdgeConfidenceItem {
  source: string;
  target: string;
  relationshipType: string;
  confidenceScore: number;
  confidenceLevel: string;
  evidenceCount: number;
  sourceCategory: string;
  lastObserved: string;
  explanation: string;
}

export interface AnalysisConfidenceData {
  analysisId: string;
  confidenceScore: number;
  confidenceLevel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  confidenceClassification: string;
  signals: ConfidenceSignals;
  weights: ConfidenceWeights;
  evidenceCount: number;
  strongCorrelationsCount: number;
  supportingCorrelationsCount: number;
  primarySignals: PrimarySignalItem[];
  uncertainSignals: UncertainSignalItem[];
  timeline: ConfidenceTimelineStage[];
  edges: EdgeConfidenceItem[];
  disclaimer: string;
  terminology: string;
}

// ============================================================
// ACTOR INTELLIGENCE PROFILE & 168-HOUR HEATMAP TYPES
// ============================================================

export interface ActorOverview {
  username: string;
  entityType: string;
  primaryForum: string;
  firstDetected: string;
  lastActivity: string;
  postCount: number;
  walletCount: number;
  forumCount: number;
  pgpCount: number;
  bio?: string;
  status: string;
}

export type EvidenceQuality = 'DIRECT' | 'STRONG' | 'MODERATE' | 'WEAK' | 'INSUFFICIENT';

export type RuleCategory = 'IDENTITY' | 'TECHNICAL' | 'FINANCIAL' | 'LINGUISTIC' | 'BEHAVIORAL' | 'TEMPORAL' | 'PLATFORM';

export interface RuleEvaluation {
  rule: string;
  name: string;
  category: RuleCategory;
  score: number;
  maxScore: number;
  strength: EvidenceQuality;
  contributed: boolean;
  summary: string;
  evidence: Record<string, any>;
}

export interface AttributionResult {
  entityA: {
    id: string;
    username: string;
    postCount: number;
    pgpCount: number;
    walletCount: number;
  };
  entityB: {
    id: string;
    username: string;
    postCount: number;
    pgpCount: number;
    walletCount: number;
  };
  confidenceScore: number;
  confidenceLevel: string;
  correlationLevel: string;
  color: string;
  evidenceCount: number;
  contributingCategoriesCount: number;
  contributingCategories: string[];
  synergyBoost: number;
  negativePenalties: number;
  rules: RuleEvaluation[];
  supportingSignals: string[];
  contradictingSignals: string[];
  disclaimer: string;
  reasoningSummary: string;
}

export interface AttributionSignal {
  name: string;
  contribution: number;
  description: string;
  source: string;
  category?: RuleCategory;
  strength?: EvidenceQuality;
  evidence?: Record<string, any>;
}

export interface AttributionAnalysisData {
  has_candidate: boolean;
  source_actor?: string;
  target_candidate: string | null;
  pair_display?: string;
  confidence: number | null;
  confidence_level: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'INSUFFICIENT_EVIDENCE' | string;
  correlation_level?: string;
  color?: string;
  signals: AttributionSignal[];
  rules?: RuleEvaluation[];
  evidence_count: number;
  synergy_boost?: number;
  negative_penalties?: number;
  supporting_signals?: string[];
  contradicting_signals?: string[];
  reasoning_summary?: string;
  disclaimer?: string;
  message?: string;
}

export interface HeatmapActivityRecord {
  postId: string;
  forumId: string;
  timestamp: string;
  timeStr: string;
  dayName: string;
  content: string;
}

export interface TemporalActivityData {
  entity_id: string;
  dataset_id: string;
  timezone: string;
  total_activity: number;
  active_days: number;
  peak_day: string;
  peak_hour: string;
  active_window: string;
  heatmap: number[]; // 168 elements (7 days x 24 hours)
  matrix: number[][]; // 7 rows x 24 columns
  cell_records: Record<string, HeatmapActivityRecord[]>; // "dayIdx_hourIdx" -> list of records
  insights: string[];
  has_sufficient_data: boolean;
}

export interface SupportingEvidenceItem {
  id: string;
  type: string;
  title: string;
  indicator: string;
  sourceFile: string;
  confidenceContribution: number;
  description: string;
}

export interface RelatedEntitiesData {
  forums: { forumId: string; forumName: string; forumType: string }[];
  wallets: { address: string; chain: string; balance: number; txCount: number; riskScore: number }[];
  pgp: { fingerprint: string; keyLength: string; status: string }[];
  posts: { postId: string; forumId: string; timestamp: string; content: string }[];
}

export interface ActorProfileData {
  entity_id: string;
  entity_type: string;
  username: string;
  display_name: string;
  overview: ActorOverview;
  threat_score: number;
  attribution: AttributionAnalysisData;
  activity: TemporalActivityData;
  evidence: SupportingEvidenceItem[];
  related_entities: RelatedEntitiesData;
}


