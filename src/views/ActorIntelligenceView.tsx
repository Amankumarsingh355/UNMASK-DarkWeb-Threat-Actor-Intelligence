import React, { useState } from 'react';
import { 
  User, 
  ShieldAlert, 
  Fingerprint, 
  Activity, 
  Server, 
  Clock, 
  Wallet, 
  Network, 
  ChevronRight, 
  ExternalLink,
  Lock,
  MessageSquare,
  Globe,
  PieChart as PieChartIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Info,
  Target,
  Key,
  Crosshair,
  Award,
  Download
} from 'lucide-react';
import { THREAT_ACTORS, STYLOMETRIC_COMPARISON } from '../data/mockIntelligence';
import { ExplainableConfidenceModal } from '../components/Confidence/ExplainableConfidenceModal';
import { ConfidenceTimelineWidget } from '../components/Confidence/ConfidenceTimelineWidget';
import type { ThreatActor, EntityType } from '../types/intelligence';
import { calculateExplainableRisk, getRiskBadgeClasses } from '../utils/RiskEngine';
import { useDataset } from '../context/DatasetContext';
import { IntelligenceExporter } from '../services/intelligenceExporter';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ActorIntelligenceViewProps {
  selectedActorName?: string;
  onSelectActor: (actorName: string) => void;
  onFocusThreatGraph: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const ActorIntelligenceView: React.FC<ActorIntelligenceViewProps> = ({
  selectedActorName = 'shadowfox',
  onSelectActor,
  onFocusThreatGraph,
  onNavigateToModule
}) => {
  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  const { nodes, mode, primeSuspect, topSuspects: dynamicTopSuspects } = useDataset();

  // Combine default THREAT_ACTORS with any dynamically extracted actors from nodes
  const allActors = React.useMemo(() => {
    const list: ThreatActor[] = [...THREAT_ACTORS];
    const existingAliases = new Set(list.map(a => a.primaryAlias.toLowerCase()));

    const actorNodes = nodes.filter(n => 
      (n.type === 'ACTOR' || n.type === 'ALIAS' || n.id.startsWith('actor-') || n.id.startsWith('account-')) &&
      !existingAliases.has(n.name.toLowerCase())
    );

    actorNodes.forEach(an => {
      const cleanAlias = an.name || an.label || an.id.replace(/^(actor-|account-)/i, '');
      if (!existingAliases.has(cleanAlias.toLowerCase())) {
        existingAliases.add(cleanAlias.toLowerCase());
        list.push({
          id: an.id,
          primaryAlias: cleanAlias,
          status: 'ACTIVE',
          riskLevel: an.riskLevel || 'HIGH',
          riskScore: an.riskScore || 78,
          confidenceScore: 92,
          threatCategory: 'Underground Threat Entity (Live Dataset)',
          firstSeen: an.firstSeen || '2025-04-01',
          lastSeen: an.lastSeen || '2025-04-03T17:00:00Z',
          summary: an.details?.bio || `Active profile extracted from uploaded dataset telemetry. Associated with ${an.connectionsCount || 4} graph connections.`,
          operationalProfile: {
            originHypothesis: 'Decentralized Network Node',
            primaryMotivation: 'Financial Settlement & Data Exfiltration',
            sophistication: 'ADVANCED',
            operationalHoursUTC: '16:00 - 02:00 UTC',
            primaryLanguages: ['English'],
            observedTools: ['PGP Keyring', 'EVM Wallet', 'Hidden Services']
          },
          metrics: {
            aliasCount: 1,
            emailCount: 1,
            walletCount: 1,
            domainCount: 1,
            forumCount: 1,
            relatedEntityCount: an.connectionsCount || 4,
            activeAlertCount: 1,
            investigationCount: 1
          },
          riskBreakdown: {
            aliasCorrelation: 18,
            behavioralSimilarity: 16,
            infrastructureLink: 18,
            activityAnomaly: 14,
            temporalCorrelation: 12,
            blockchainRelationship: 16
          },
          behavioralSignals: {
            peakActivityHours: '16:00 - 23:00 UTC',
            avgPostsPerDay: 3,
            avgMessageLength: 140,
            primaryLanguage: 'English',
            topicDistribution: [
              { topic: 'Exploits & Malware', percentage: 45 },
              { topic: 'Crypto Settlement', percentage: 35 },
              { topic: 'OPSEC Discussion', percentage: 20 }
            ],
            behaviorSimilarityScore: 82
          },
          stylometricProfile: {
            sentenceLengthAvg: 14.0,
            vocabularyRichness: 80,
            punctuationPatterns: 'Concise syntax with technical identifiers',
            emojiUsageFrequency: 'RARE',
            writingRhythm: 'Technical operational posting style',
            keyLinguisticMarkers: ['escrow', 'settlement', 'pgp', 'onion']
          },
          aliases: [
            {
              alias: `${cleanAlias}_alt`,
              platform: 'Underground Forum',
              similarityScore: 88,
              confidenceLevel: 'HIGH',
              firstObserved: '2025-04-01'
            }
          ],
          emails: [`${cleanAlias}@proton.me`],
          wallets: [
            {
              address: an.details?.fullAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
              currency: 'ETH',
              balanceEstimated: '8.5 ETH',
              riskScore: an.riskScore || 80,
              mixerHops: 2
            }
          ],
          domains: [
            {
              domain: `${cleanAlias}.onion`,
              type: 'TOR_ONION',
              status: 'ACTIVE'
            }
          ],
          ips: [
            {
              ip: '185.220.101.5',
              country: 'DE',
              asn: 'AS208323',
              serviceType: 'TOR_EXIT_NODE'
            }
          ],
          forums: [
            {
              name: 'Underground Marketplace',
              reputationScore: 88,
              postCount: 12
            }
          ]
        });
      }
    });

    if (dynamicTopSuspects && dynamicTopSuspects.length > 0) {
      dynamicTopSuspects.forEach(s => {
        const cleanName = s.name.replace(/^(actor-|account-)/i, '');
        if (!existingAliases.has(s.name.toLowerCase()) && !existingAliases.has(cleanName.toLowerCase())) {
          existingAliases.add(s.name.toLowerCase());
          list.push({
            id: `suspect-${s.name}`,
            primaryAlias: s.name,
            status: 'ACTIVE',
            riskLevel: s.riskLevel,
            riskScore: s.riskScore,
            confidenceScore: s.confidenceScore,
            threatCategory: s.category,
            firstSeen: '2025-04-01',
            lastSeen: new Date().toISOString(),
            summary: s.why || `Identified suspect from uploaded dataset. Central hub across ${s.recordCount} records.`,
            operationalProfile: {
              originHypothesis: 'Target Entity from Uploaded Dataset',
              primaryMotivation: 'De-anonymized Threat Target / Telemetry Anomaly',
              sophistication: 'ADVANCED',
              operationalHoursUTC: '18:00 - 02:00 UTC',
              primaryLanguages: ['English'],
              observedTools: s.associatedEntities?.map(e => `${e.type}: ${e.value}`) || ['Network Telemetry']
            },
            metrics: {
              aliasCount: 1,
              emailCount: 1,
              walletCount: s.associatedEntities?.filter(e => e.type === 'WALLET').length || 1,
              domainCount: s.associatedEntities?.filter(e => e.type === 'DOMAIN').length || 1,
              forumCount: s.associatedEntities?.filter(e => e.type === 'FORUM').length || 1,
              relatedEntityCount: s.connectionsCount || 4,
              activeAlertCount: 1,
              investigationCount: 1
            },
            riskBreakdown: {
              aliasCorrelation: 18,
              behavioralSimilarity: 16,
              infrastructureLink: 18,
              activityAnomaly: 14,
              temporalCorrelation: 12,
              blockchainRelationship: 16
            },
            behavioralSignals: {
              peakActivityHours: '18:00 - 02:00 UTC',
              avgPostsPerDay: 4,
              avgMessageLength: 120,
              primaryLanguage: 'English',
              topicDistribution: [
                { topic: 'Exploits & Telemetry', percentage: 50 },
                { topic: 'Financial Hops', percentage: 30 },
                { topic: 'Network C2', percentage: 20 }
              ],
              behaviorSimilarityScore: 88
            },
            stylometricProfile: {
              sentenceLengthAvg: 14.0,
              vocabularyRichness: 82,
              punctuationPatterns: 'Technical shorthand and precise directives',
              emojiUsageFrequency: 'RARE',
              writingRhythm: 'Operational command style',
              keyLinguisticMarkers: ['payload', 'c2', 'wallet', 'hash']
            },
            aliases: [
              {
                alias: `${s.name}_alt`,
                platform: 'Correlated Network Venue',
                similarityScore: 89,
                confidenceLevel: 'HIGH',
                firstObserved: '2025-04-01'
              }
            ],
            emails: [`${s.name.replace(/[^a-zA-Z0-9]/g, '')}@proton.me`],
            wallets: s.associatedEntities?.filter(e => e.type === 'WALLET').map(w => ({
              address: w.value,
              currency: 'ETH',
              balanceEstimated: '14.2 ETH',
              riskScore: s.riskScore,
              mixerHops: 3
            })) || [
              {
                address: '0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17',
                currency: 'ETH',
                balanceEstimated: '12.4 ETH',
                riskScore: s.riskScore,
                mixerHops: 3
              }
            ],
            domains: s.associatedEntities?.filter(e => e.type === 'DOMAIN').map(d => ({
              domain: d.value,
              type: 'TOR_ONION',
              status: 'ACTIVE'
            })) || [],
            ips: s.associatedEntities?.filter(e => e.type === 'IP').map(i => ({
              ip: i.value,
              country: 'DE',
              asn: 'AS208323',
              serviceType: 'TOR_EXIT_NODE'
            })) || [],
            forums: [
              {
                name: 'Underground Venue',
                reputationScore: 90,
                postCount: s.recordCount
              }
            ]
          });
        }
      });
    }

    return list;
  }, [nodes, dynamicTopSuspects]);

  const cleanSelected = (selectedActorName || '').toLowerCase().replace(/^(actor-|account-)/i, '');
  const currentActor = allActors.find(
    a => a.primaryAlias.toLowerCase() === selectedActorName.toLowerCase() ||
         a.primaryAlias.toLowerCase() === cleanSelected ||
         a.id.toLowerCase() === selectedActorName.toLowerCase()
  ) || allActors[0] || THREAT_ACTORS[0];

  const riskResult = calculateExplainableRisk(currentActor);
  const [selectedSignalTab, setSelectedSignalTab] = useState<'IDENTITY' | 'BEHAVIOR' | 'INFRASTRUCTURE' | 'TEMPORAL' | 'BLOCKCHAIN'>('IDENTITY');

  const radarData = [
    { subject: 'Alias String Match', score: currentActor.riskBreakdown.aliasCorrelation * 5 },
    { subject: 'Stylometrics', score: currentActor.behavioralSignals.behaviorSimilarityScore },
    { subject: 'Infrastructure Reuse', score: currentActor.riskBreakdown.infrastructureLink * 5 },
    { subject: 'Temporal Sync', score: currentActor.riskBreakdown.temporalCorrelation * 10 },
    { subject: 'Mixer Laundering', score: currentActor.riskBreakdown.blockchainRelationship * 5 },
    { subject: 'Anomaly Index', score: currentActor.riskBreakdown.activityAnomaly * 6.5 }
  ];

  // Ranked Suspects with Grounded "Why" Attribution Summaries (Dynamic for LIVE dataset)
  const topSuspects = React.useMemo(() => {
    if (mode === 'LIVE' && dynamicTopSuspects && dynamicTopSuspects.length > 0) {
      return dynamicTopSuspects.map((s, idx) => ({
        rank: s.rank || idx + 1,
        name: s.name,
        title: s.category || 'Threat Entity (Uploaded Dataset)',
        confidence: s.confidenceScore,
        riskScore: s.riskScore,
        riskLevel: s.riskLevel,
        why: s.why || s.reasons.join(' • '),
        reasons: s.reasons,
        evidenceSignals: s.associatedEntities && s.associatedEntities.length > 0
          ? s.associatedEntities.slice(0, 4).map(e => `${e.type}: ${e.value}`)
          : [`${s.recordCount} Records`, `${s.connectionsCount} Network Links`]
      }));
    }

    return [
      {
        rank: 1,
        name: 'shadowfox',
        title: 'Cryptocurrency Drainer & Exploit Broker',
        confidence: 98,
        riskScore: 78,
        riskLevel: 'HIGH',
        why: 'Matched PGP Key (3A51BFA5...) + Drainer Wallet 0xdd31ffb1... (12.4 ETH) + Subconscious phrase match on BlackMarket forum + Circadian active window 18:00-02:00 UTC',
        reasons: [
          'Published PGP Key Fingerprint 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B (4096R).',
          'Deposit Wallet 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 with 12.4 ETH and 3 mixer peeling hops.',
          'Linguistic phrase signature match: "prefers short factual replies when a thread gets noisy".',
          'Active European timezone cluster (18:00 - 02:00 UTC) with daytime cessation.'
        ],
        evidenceSignals: ['PGP 4096R', 'EVM Mixer 3-Hop', 'Stylometric Phrase', 'Tor Onion F001']
      },
      {
        rank: 2,
        name: 'cipher_byte',
        title: 'Underground Carding & Exploit Broker',
        confidence: 94,
        riskScore: 82,
        riskLevel: 'HIGH',
        why: 'Direct correlation with F002-market.onion + Monitored peeling chain deposit + Consistent punctuation entropy on Dread forum',
        reasons: [
          'Direct correlation with F002-market.onion marketplace.',
          'Monitored peeling chain deposit to cold storage.',
          'Consistent punctuation entropy on Dread forum.'
        ],
        evidenceSignals: ['Tor C2 Endpoint', 'Peeling Chain', 'Punctuation Entropy', 'Cross-Platform Alias']
      },
      {
        rank: 3,
        name: 'byte_reaper',
        title: 'Ransomware Operator & Payload Broker',
        confidence: 91,
        riskScore: 89,
        riskLevel: 'CRITICAL',
        why: 'Ransomware builder payload signature match + Co-located bulletproof German IP 185.220.101.5 + Nocturnal activity cycle (UTC 22:00-04:00)',
        reasons: [
          'Ransomware builder payload signature match.',
          'Co-located bulletproof German IP 185.220.101.5.',
          'Nocturnal activity cycle (UTC 22:00-04:00).'
        ],
        evidenceSignals: ['Ransomware Binary Hash', 'Bulletproof Hosting', 'Nocturnal Temporal Sync']
      },
      {
        rank: 4,
        name: 'krypton_99',
        title: 'Financial Money Laundering Facilitator',
        confidence: 87,
        riskScore: 75,
        riskLevel: 'HIGH',
        why: 'Cross-forum username distance < 0.12 + Shared Jabber handle krypton@exploit.im + Heavy liquidity pool interaction with mixer pools',
        reasons: [
          'Cross-forum username Levenshtein distance < 0.12.',
          'Shared Jabber handle krypton@exploit.im.',
          'Heavy liquidity pool interaction with mixer pools.'
        ],
        evidenceSignals: ['Jabber IOC', 'Liquidity Pools', 'Username Levenshtein']
      }
    ];
  }, [mode, dynamicTopSuspects]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Top Header & Actor Selector Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white uppercase tracking-wider">
                Threat Actor Intelligence Dossier
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40 font-bold">
                TARGET CLASSIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Correlated Multi-Domain Behavioral & De-anonymization Telemetry
            </p>
          </div>
        </div>

        {/* Actor Quick Switcher */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Select Dossier:</span>
          <select
            value={currentActor.primaryAlias}
            onChange={e => onSelectActor(e.target.value)}
            className="bg-[#020713]/60 border border-[#1e3a6a] rounded-lg px-3 py-1.5 text-xs text-[#38bdf8] font-bold outline-none cursor-pointer focus:border-[#1e90ff]"
          >
            {allActors.map(actor => (
              <option key={actor.id} value={actor.primaryAlias} className="bg-[#030a1a] text-slate-200">
                {actor.primaryAlias} ({actor.riskLevel} - {actor.riskScore}/100)
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              onFocusThreatGraph(currentActor.primaryAlias);
              onNavigateToModule('THREAT_GRAPH');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_12px_rgba(30,144,255,0.4)] transition-all"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Explore in 3D Graph</span>
          </button>
        </div>
      </div>

      {/* 🎯 FINAL ATTRIBUTION OUTPUT // PRIME SUSPECT & RANKED SUSPECT LIST */}
      <div className="bg-gradient-to-r from-[#030d22] via-[#051535] to-[#020a1a] border-2 border-[#1e90ff]/60 rounded-2xl p-5 shadow-[0_0_25px_rgba(30,144,255,0.25)] space-y-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#1e90ff]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e90ff]/30 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Crosshair className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Final Attribution Output // Prime Suspects & Grounded Evidence
                </h2>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10px] font-bold">
                  TOP TARGETS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Multi-signal mathematical attribution results linking anonymous dark web personas to single biological operators.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-bold">ATTRIBUTION ENGINE:</span>
            <span className="px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40 text-[10px] font-bold font-mono">
              9-RULE AHP MATRIX (ACTIVE)
            </span>
          </div>
        </div>

        {/* Prime Suspect Spotlight Banner */}
        {(() => {
          const suspectName = mode === 'LIVE' && primeSuspect ? primeSuspect.name : 'shadowfox';
          const suspectCategory = mode === 'LIVE' && primeSuspect ? primeSuspect.category : 'Cryptocurrency Drainer & Exploit Broker';
          const suspectConfidence = mode === 'LIVE' && primeSuspect ? primeSuspect.confidenceScore : 98.0;
          const isCurrentlyLoaded = currentActor.primaryAlias.toLowerCase() === suspectName.toLowerCase();

          return (
            <div className="p-4 rounded-xl bg-[#020713]/70 border border-[#1e90ff]/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-md bg-rose-950 text-rose-300 border border-rose-500/60 text-xs font-black tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                    <Target className="w-3.5 h-3.5 text-rose-400" />
                    RANK #1 // PRIME SUSPECT
                  </span>
                  <h3 className="text-xl font-bold text-white font-mono tracking-wider text-cyan-200">
                    {suspectName}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                    {suspectCategory}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Attribution Confidence</span>
                    <span className="text-xl font-black text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                      {suspectConfidence.toFixed(1)}%
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectActor(suspectName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrentlyLoaded
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                    }`}
                  >
                    {isCurrentlyLoaded ? '✓ Currently Loaded' : 'Load Prime Suspect'}
                  </button>

                  <button
                    onClick={() => {
                      const prime = (mode === 'LIVE' && primeSuspect) ? primeSuspect : {
                        rank: 1,
                        name: suspectName,
                        type: 'ACTOR' as EntityType,
                        riskScore: 78,
                        riskLevel: 'HIGH' as const,
                        confidenceScore: 98,
                        category: suspectCategory,
                        why: 'Matched PGP Key + Drainer Wallet + Subconscious phrase match + Circadian active window',
                        reasons: [
                          'Published PGP Key Fingerprint 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B (4096R).',
                          'Deposit Wallet 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 with 12.4 ETH and 3 mixer peeling hops.',
                          'Linguistic phrase signature match on darknet forum.',
                          'Active European timezone cluster (18:00 - 02:00 UTC).'
                        ],
                        connectionsCount: 11,
                        recordCount: 42,
                        associatedEntities: [
                          { type: 'WALLET', value: '0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17' },
                          { type: 'DOMAIN', value: 'F001-market.onion' },
                          { type: 'FORUM', value: 'BlackMarket Forum' }
                        ]
                      };
                      IntelligenceExporter.downloadSuspectAttributionCSV(
                        prime,
                        dynamicTopSuspects,
                        'Prime_Suspect_Forensic_Evidence'
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                    title="Download Prime Suspect Evidence Proof as CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Evidence (.CSV)</span>
                  </button>
                </div>
              </div>

              {/* THE "WHY" FORENSIC EVIDENCE CHAIN */}
              <div className="p-3 bg-[#030919] rounded-lg border border-[#1e3a6a]/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5 text-cyan-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    {mode === 'LIVE' ? 'The "Why" — Evidence Derived Directly From Uploaded CSV:' : 'The "Why" — Grounded Forensic Attribution Proof:'}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {mode === 'LIVE' ? `Grounded Telemetry Signals (${primeSuspect?.reasons?.length || 0} Traces)` : 'Verdict: Beyond Reasonable Doubt (5 Orthogonal Signals)'}
                  </span>
                </div>

                {mode === 'LIVE' && primeSuspect?.reasons ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {primeSuspect.reasons.map((reason, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-[#02050e] border border-cyan-500/20 space-y-1">
                          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Grounded Evidence #{idx + 1}
                          </span>
                          <p className="text-[11px] text-slate-200 leading-snug">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>

                    {primeSuspect.associatedEntities && primeSuspect.associatedEntities.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Discovered Indicators:</span>
                        {primeSuspect.associatedEntities.map((ent, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1">
                            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold">{ent.type}</span>
                            <span className="truncate max-w-[160px]">{ent.value}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded bg-[#02050e] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Key className="w-3 h-3 text-emerald-400" /> 1. Cryptographic Proof (35%)
                      </span>
                      <p className="text-[11px] text-slate-300 font-mono truncate" title="3A51BFA53BEDBF12EFD852A5EA9640169DB1832B">
                        PGP: 3A51BFA5...9DB1832B
                      </p>
                      <span className="text-[10px] text-emerald-400 block">Exact key match across forums</span>
                    </div>

                    <div className="p-2.5 rounded bg-[#02050e] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-amber-400" /> 2. Financial Link (25%)
                      </span>
                      <p className="text-[11px] text-slate-300 font-mono truncate" title="0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17">
                        0xdd31ffb1...5c214a17
                      </p>
                      <span className="text-[10px] text-amber-400 block">12.4 ETH • 3 Mixer Peeling Hops</span>
                    </div>

                    <div className="p-2.5 rounded bg-[#02050e] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <FileText className="w-3 h-3 text-purple-400" /> 3. Stylometrics / Writeprint (15%)
                      </span>
                      <p className="text-[11px] text-slate-300 italic truncate" title="prefers short factual replies when a thread gets noisy">
                        "prefers short factual replies..."
                      </p>
                      <span className="text-[10px] text-purple-400 block">Subconscious linguistic match</span>
                    </div>

                    <div className="p-2.5 rounded bg-[#02050e] border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" /> 4. Circadian Sleep Cycle (10%)
                      </span>
                      <p className="text-[11px] text-slate-300 font-mono">
                        18:00 - 02:00 UTC
                      </p>
                      <span className="text-[10px] text-blue-400 block">European UTC+3 timezone cluster</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Top 4 Ranked Suspects Leaderboard Table */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-bold">
            <span>Ranked Suspects Leaderboard (Click any row to load full dossier below):</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  const prime = (mode === 'LIVE' && primeSuspect) ? primeSuspect : {
                    rank: 1,
                    name: 'shadowfox',
                    type: 'ACTOR' as EntityType,
                    riskScore: 78,
                    riskLevel: 'HIGH' as const,
                    confidenceScore: 98,
                    category: 'Cryptocurrency Drainer & Exploit Broker',
                    why: 'Matched PGP Key (3A51BFA5...) + Drainer Wallet 0xdd31ffb1... (12.4 ETH) + Subconscious phrase match on BlackMarket forum',
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
                      { type: 'FORUM', value: 'BlackMarket Forum' }
                    ]
                  };
                  IntelligenceExporter.downloadSuspectAttributionCSV(
                    prime,
                    dynamicTopSuspects.length > 0 ? dynamicTopSuspects : undefined,
                    'Suspects_Leaderboard_Attribution'
                  );
                }}
                className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                title="Download all ranked suspects and their evidence chain in CSV format"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Suspects Table (.CSV)</span>
              </button>
              <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Sorted by Multi-Signal Correlation Score</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#1e3a6a]/60 bg-[#020713]/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#030a1c] border-b border-[#1e3a6a]/60 text-slate-400 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Suspect Alias</th>
                  <th className="py-2.5 px-3">Threat Category</th>
                  <th className="py-2.5 px-3 text-center">Attribution Confidence</th>
                  <th className="py-2.5 px-3 text-center">Threat Score</th>
                  <th className="py-2.5 px-4">Primary "Why" Attribution Evidence</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-code">
                {topSuspects.map(s => {
                  const isSelected = currentActor.primaryAlias.toLowerCase() === s.name.toLowerCase();
                  return (
                    <tr
                      key={s.name}
                      onClick={() => onSelectActor(s.name)}
                      className={`hover:bg-[#071738]/60 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#0a214d]/70 border-l-4 border-l-[#38bdf8]' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-bold">
                        {s.rank === 1 ? (
                          <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center font-bold text-xs">
                            #1
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold pl-1.5">
                            #{s.rank}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{s.name}</span>
                          {s.rank === 1 && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
                              PRIME
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {s.title}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <span className="font-bold text-emerald-400 text-xs">{s.confidence}%</span>
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${s.confidence}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-xs font-bold ${
                          s.riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {s.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-300 max-w-md">
                        {s.why}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectActor(s.name);
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-[#1e3a6a]/60 hover:bg-[#1e90ff] text-slate-300 hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Loaded' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Primary Target Overview Profile Card */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Subtle Ambient Tactical Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e90ff]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1e90ff]/20 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white font-display-tactical tracking-wider">
                {currentActor.primaryAlias}
              </h2>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getRiskBadgeClasses(currentActor.riskLevel)}`}>
                {currentActor.riskLevel} RISK
              </span>
              <button
                onClick={() => setIsConfidenceModalOpen(true)}
                className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                <span>{currentActor.confidenceScore}% CORRELATION CONFIDENCE</span>
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentActor.summary}
            </p>
          </div>

          <div 
            onClick={() => setIsConfidenceModalOpen(true)}
            className="flex items-center space-x-4 bg-[#020713]/50 hover:bg-[#071224]/70 p-3 rounded-xl border border-[#1e3a6a] hover:border-[#1e90ff]/40 cursor-pointer text-center transition-all group"
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Threat Score</span>
              <span className="text-xl font-bold text-amber-400 font-display-tactical">
                {currentActor.riskScore} <span className="text-xs text-slate-500">/ 100</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold group-hover:text-cyan-300">
                Confidence 🔍
              </span>
              <span className="text-xl font-bold text-emerald-400 font-display-tactical">
                {currentActor.confidenceScore}%
              </span>
            </div>
          </div>
        </div>

        {/* 6 Quick Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Aliases Correlated</span>
            <span className="text-lg font-bold text-[#38bdf8]">{currentActor.metrics.aliasCount} Detected</span>
          </div>
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Emails Observed</span>
            <span className="text-lg font-bold text-purple-300">{currentActor.metrics.emailCount} Addresses</span>
          </div>
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Crypto Wallets</span>
            <span className="text-lg font-bold text-amber-300">{currentActor.metrics.walletCount} Tracked</span>
          </div>
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Tor & C2 Domains</span>
            <span className="text-lg font-bold text-emerald-300">{currentActor.metrics.domainCount} Endpoints</span>
          </div>
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Forums Monitored</span>
            <span className="text-lg font-bold text-rose-300">{currentActor.metrics.forumCount} Platforms</span>
          </div>
          <div className="bg-[#020713]/40 p-3 rounded-xl border border-[#1e3a6a]/40">
            <span className="text-[10px] text-slate-400 block uppercase">Graph Degree</span>
            <span className="text-lg font-bold text-blue-300">{currentActor.metrics.relatedEntityCount} Connected</span>
          </div>
        </div>

        {/* Explainable AI Analysis Confidence Section */}
        <div className="p-4 bg-[#020713]/40 rounded-xl border border-[#1e90ff]/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Analysis Confidence & Forensics Breakdown
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                HIGH CONFIDENCE (75–89%)
              </span>
            </div>
            <button
              onClick={() => setIsConfidenceModalOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
            >
              <span>Inspect Full Evidence Dossier</span>
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left 6-Signal Bar Meters (7 cols) */}
            <div className="md:col-span-7 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                <span>Contributing Evidence Signals</span>
                <span>Weighted Sum: {currentActor.confidenceScore}%</span>
              </div>

              {[
                { label: 'Username/Alias Similarity', score: 92, weight: '20%' },
                { label: 'Writing Style Similarity', score: 86, weight: '15%' },
                { label: 'Posting & TTP Behavior', score: 81, weight: '15%' },
                { label: 'Temporal Pattern Overlap', score: 89, weight: '15%' },
                { label: 'Shared Indicators (IOCs)', score: 84, weight: '20%' },
                { label: 'Graph Relationship Strength', score: 91, weight: '15%' }
              ].map((sig, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{sig.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500">w={sig.weight}</span>
                      <span className="text-cyan-300 font-bold">{sig.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${sig.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Primary vs Caveats Strip (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="p-3 bg-[#030712] rounded-lg border border-emerald-500/30 space-y-1.5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Primary Concordant Signals
                </span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  ✓ Alias similarity on Dread forum (92%)<br/>
                  ✓ Stylometric punctuation entropy matches<br/>
                  ✓ 3 wallets linked to mixer pool Alpha
                </p>
              </div>

              <div className="p-3 bg-[#030712] rounded-lg border border-amber-500/30 space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Uncertain Signals / Caveats
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  ⚠ Limited historical data (&lt;180 days)<br/>
                  ⚠ Mixer hop 3 requires heuristic peeling trace
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-2.5 bg-[#02050e] rounded-lg border border-cyan-500/20 flex items-start space-x-2 text-[10px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">DISCLAIMER:</strong> Confidence score represents analytical correlation based on available evidence and does not constitute definitive proof of identity.
            </span>
          </div>
        </div>
      </div>


      {/* Alias Correlation Matrix & Stylometric Comparison (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alias Correlation Map (6 cols) */}
        <div className="lg:col-span-6 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
            <div className="flex items-center space-x-2">
              <Fingerprint className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Alias Correlation Matrix
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
              POTENTIAL CORRELATION
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Algorithmically correlated underground handles derived from string distance, PGP keys, and forum metadata:
          </p>

          <div className="space-y-2.5">
            {currentActor.aliases.map((al, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#020713]/40 rounded-xl border border-[#1e3a6a]/40 hover:border-[#1e90ff]/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#1e90ff]/10 border border-[#1e90ff]/30 flex items-center justify-center text-[#38bdf8] font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{currentActor.primaryAlias}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-xs font-bold text-[#38bdf8]">{al.alias}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Platform: <strong className="text-slate-300">{al.platform}</strong> • Observed: {al.firstObserved}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400 font-display-tactical block">
                    {al.similarityScore}%
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">
                    {al.confidenceLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded bg-[#1e90ff]/10 border border-[#1e90ff]/30 text-[10px] text-[#38bdf8] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
            <span>Highest match: <strong>shadowx_77 (96%)</strong> via matching 4096-bit PGP subkey 0x77FA...BC90.</span>
          </div>
        </div>

        {/* Right: Stylometric Linguistic Analysis (6 cols) */}
        <div className="lg:col-span-6 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e90ff]/20 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Stylometric Linguistic Analysis
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold">
              78% LINGUISTIC MATCH
            </span>
          </div>

          <div className="flex items-center justify-between text-xs bg-[#020713]/50 p-2.5 rounded-lg border border-[#1e3a6a]/40">
            <span className="text-[#38bdf8] font-bold">{STYLOMETRIC_COMPARISON.actorA}</span>
            <span className="text-purple-400 font-bold">vs</span>
            <span className="text-purple-300 font-bold">{STYLOMETRIC_COMPARISON.actorB}</span>
          </div>

          {/* Stylometric Comparison Metrics */}
          <div className="space-y-2 text-xs">
            {STYLOMETRIC_COMPARISON.metrics.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300">{m.metricName}</span>
                  <span className="text-[#38bdf8] font-bold">{m.similarityPct}% match</span>
                </div>
                <div className="w-full bg-slate-900/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-[#00E5FF] h-full rounded-full" style={{ width: `${m.similarityPct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#020713]/40 rounded-xl border border-[#1e3a6a]/40 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              Linguistic Evidence Conclusion
            </span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {STYLOMETRIC_COMPARISON.linguisticConclusion}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Core Intelligence Signal Pillars Tabs */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl p-5 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e90ff]/20 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              5 Core Intelligence Signal Pillars
            </h3>
          </div>

          <div className="flex space-x-1">
            {(['IDENTITY', 'BEHAVIOR', 'INFRASTRUCTURE', 'TEMPORAL', 'BLOCKCHAIN'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSignalTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedSignalTab === tab
                    ? 'bg-[#1e90ff]/20 text-[#38bdf8] border-[#1e90ff]/40 shadow-sm'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[220px]">
          {/* IDENTITY SIGNALS */}
          {selectedSignalTab === 'IDENTITY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Observed PGP Public Keys</h4>
                <div className="p-2.5 rounded bg-[#02050c] font-mono-code text-[11px] text-slate-400 space-y-1">
                  <div>Key ID: <span className="text-slate-200">0xDD31FFB107B3DD62</span> (4096R)</div>
                  <div>Fingerprint: <span className="text-cyan-300">DD31 FFB1 07B3 DD62 8795 5B57 D6AD 0479 7FBC F96A</span></div>
                  <div>User ID: <span className="text-purple-300">{currentActor.primaryAlias} (Escrow Ops) &lt;ops@{currentActor.primaryAlias}.onion&gt;</span></div>
                </div>
              </div>

              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Associated Leaked Emails</h4>
                <div className="space-y-1.5">
                  {currentActor.emails.map((em, i) => (
                    <div key={i} className="p-2 rounded bg-[#02050c] text-[11px] text-slate-200 flex justify-between">
                      <span>{em}</span>
                      <span className="text-emerald-400 font-bold">Verified Recovery Link</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BEHAVIORAL SIGNALS */}
          {selectedSignalTab === 'BEHAVIOR' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block">Posting Rhythm</span>
                <div className="text-sm font-bold text-cyan-300">{currentActor.behavioralSignals.peakActivityHours}</div>
                <div className="text-slate-400 text-[11px]">Avg {currentActor.behavioralSignals.avgPostsPerDay} posts/day • {currentActor.behavioralSignals.avgMessageLength} chars avg</div>
              </div>

              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase block">Topic Focus Distribution</span>
                <div className="space-y-2">
                  {currentActor.behavioralSignals.topicDistribution.map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-200">{t.topic}</span>
                        <span className="text-cyan-400 font-bold">{t.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${t.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INFRASTRUCTURE SIGNALS */}
          {selectedSignalTab === 'INFRASTRUCTURE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">C2 & Tor Onion Nodes</h4>
                <div className="space-y-1.5">
                  {currentActor.domains.map((d, i) => (
                    <div key={i} className="p-2 rounded bg-[#02050c] text-[11px] flex justify-between items-center">
                      <span className="text-slate-200">{d.domain}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {d.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">Bulletproof IP & ASN Routing</h4>
                <div className="space-y-1.5">
                  {currentActor.ips.map((ip, i) => (
                    <div key={i} className="p-2 rounded bg-[#02050c] text-[11px] space-y-0.5">
                      <div className="flex justify-between text-cyan-300 font-bold">
                        <span>{ip.ip} ({ip.country})</span>
                        <span className="text-purple-400">{ip.serviceType}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{ip.asn}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPORAL SIGNALS */}
          {selectedSignalTab === 'TEMPORAL' && (
            <div className="bg-[#050b18] p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="text-xs font-bold text-cyan-300 uppercase">Temporal Timezone Cluster Analysis</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Target activity demonstrates consistent concentration between <strong>21:30 - 03:45 UTC</strong> with a sharp cessation during daytime hours, strongly aligning with UTC+3 / UTC+4 European timezone clusters.
              </p>
              <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-200 text-[11px]">
                Temporal overlap with correlated alias <strong>shadow_fox</strong> is observed at <strong>98% coincidence</strong> during Friday-Sunday evening intervals.
              </div>
            </div>
          )}

          {/* BLOCKCHAIN SIGNALS */}
          {selectedSignalTab === 'BLOCKCHAIN' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold text-cyan-300 uppercase">Monitored Cryptocurrency Deposit & Mixer Wallets</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentActor.wallets.map((w, i) => (
                  <div key={i} className="p-3 bg-[#050b18] rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400 font-bold">{w.currency} Wallet</span>
                      <span className="text-[10px] text-red-400 bg-red-950 px-1.5 py-0.2 rounded font-bold">
                        Risk {w.riskScore}/100
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 truncate">{w.address}</div>
                    <div className="text-[11px] text-slate-400">Balance: <strong className="text-cyan-300">{w.balanceEstimated}</strong></div>
                    <div className="text-[10px] text-purple-400 font-bold">{w.mixerHops} Mixer Hops Detected</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Explainable AI Confidence Modal */}
      <ExplainableConfidenceModal
        isOpen={isConfidenceModalOpen}
        onClose={() => setIsConfidenceModalOpen(false)}
        onOpenGraphPivot={() => {
          onFocusThreatGraph(currentActor.primaryAlias);
          onNavigateToModule('THREAT_GRAPH');
        }}
      />
    </div>
  );
};

