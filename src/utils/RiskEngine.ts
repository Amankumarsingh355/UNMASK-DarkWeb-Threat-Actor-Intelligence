// ============================================================
// DARKTRACE EXPLAINABLE RISK & CORRELATION ENGINE
// Multi-pillar weighted scoring & confidence separation
// ============================================================

import type { ThreatActor, RiskLevel } from '../types/intelligence';

export interface RiskEvaluationResult {
  totalScore: number;
  level: RiskLevel;
  breakdown: {
    aliasCorrelation: { score: number; max: number; description: string };
    behavioralSimilarity: { score: number; max: number; description: string };
    infrastructureLink: { score: number; max: number; description: string };
    activityAnomaly: { score: number; max: number; description: string };
    temporalCorrelation: { score: number; max: number; description: string };
    blockchainRelationship: { score: number; max: number; description: string };
  };
  explanation: string;
}

export function calculateExplainableRisk(actor: ThreatActor): RiskEvaluationResult {
  const b = actor.riskBreakdown;
  const total = Math.min(
    100,
    b.aliasCorrelation +
    b.behavioralSimilarity +
    b.infrastructureLink +
    b.activityAnomaly +
    b.temporalCorrelation +
    b.blockchainRelationship
  );

  let level: RiskLevel = 'LOW';
  if (total >= 80) level = 'CRITICAL';
  else if (total >= 60) level = 'HIGH';
  else if (total >= 30) level = 'MEDIUM';

  const explanation = `${actor.primaryAlias} evaluated with ${total}/100 [${level} RISK]. Primary drivers include high infrastructure linkage (${b.infrastructureLink}/20), alias correlation signals (${b.aliasCorrelation}/20), and blockchain transaction anomalies (${b.blockchainRelationship}/20).`;

  return {
    totalScore: total,
    level,
    breakdown: {
      aliasCorrelation: {
        score: b.aliasCorrelation,
        max: 20,
        description: 'Multi-platform alias phonetic, Levenshtein distance, and PGP key UID match weights.'
      },
      behavioralSimilarity: {
        score: b.behavioralSimilarity,
        max: 15,
        description: 'Stylometric analysis, topic distribution cosine similarity, and average message syntax.'
      },
      infrastructureLink: {
        score: b.infrastructureLink,
        max: 20,
        description: 'Shared ASN subnets, SSH hostkeys, TLS certificate serials, and Tor circuit re-use.'
      },
      activityAnomaly: {
        score: b.activityAnomaly,
        max: 15,
        description: 'Standard deviation deviations above established 30-day temporal baseline.'
      },
      temporalCorrelation: {
        score: b.temporalCorrelation,
        max: 10,
        description: 'Simultaneous session timestamps within ±15 minute correlation windows.'
      },
      blockchainRelationship: {
        score: b.blockchainRelationship,
        max: 20,
        description: 'Direct and nested crypto mixer hops, deposit re-use, and UTXO cluster analysis.'
      }
    },
    explanation
  };
}

export function getRiskBadgeClasses(level: RiskLevel): string {
  switch (level) {
    case 'CRITICAL':
      return 'bg-red-500/10 text-red-400 border border-red-500/30 glow-red';
    case 'HIGH':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30 glow-amber';
    case 'MEDIUM':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
    case 'LOW':
    default:
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  }
}
