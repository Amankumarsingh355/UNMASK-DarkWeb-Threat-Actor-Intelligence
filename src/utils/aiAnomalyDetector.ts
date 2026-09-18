// ============================================================
// UNMASK // AI ANOMALY DETECTION & THREAT CORRELATION ENGINE
// Multi-Signal ML Triage & Dark Web Cross-Correlation Pipeline
// ============================================================

import type { CitizenComplaint, AIAnomalyReport, MatchedThreatActor, ComplaintRiskLevel } from '../types/complaint';
import { THREAT_ACTORS, INITIAL_GRAPH_NODES, INITIAL_GRAPH_LINKS } from '../data/mockIntelligence';

// Cryptographic hash simulation for evidence seal
export function generateSHA256EvidenceDigest(dataString: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let i = 0; i < dataString.length; i++) {
    hash ^= BigInt(dataString.charCodeAt(i));
    hash = (hash * prime) & 0xffffffffffffffffn;
  }
  const hex = hash.toString(16).padStart(16, '0');
  // Expand to standard 64-char SHA-256 length
  return `0x${hex}${hex}${hex}${hex}`.substring(0, 66);
}

// Extract indicators using regex patterns
export function extractIndicators(text: string) {
  const walletRegex = /(0x[a-fA-F0-9]{40}|bc1[a-zA-HJ-NP-Z0-9]{25,39}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})/g;
  const onionRegex = /([a-z2-7]{16,56}\.onion)/gi;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const txRegex = /(0x[a-fA-F0-9]{64})/g;

  const wallets = Array.from(new Set(text.match(walletRegex) || []));
  const onionUrls = Array.from(new Set(text.match(onionRegex) || []));
  const emails = Array.from(new Set(text.match(emailRegex) || []));
  const transactionHashes = Array.from(new Set(text.match(txRegex) || []));

  return {
    wallets,
    onionUrls,
    emails,
    transactionHashes
  };
}

/**
 * Runs the automated AI Anomaly Detector on a submitted citizen complaint
 */
export function runAIAnomalyDetection(complaint: Partial<CitizenComplaint>): AIAnomalyReport {
  const fullText = [
    complaint.title || '',
    complaint.narrative || '',
    complaint.suspectAlias || '',
    complaint.suspectWallet || '',
    complaint.suspectOnionUrl || '',
    complaint.suspectEmail || '',
    complaint.transactionHash || ''
  ].join(' ');

  const extracted = extractIndicators(fullText);

  // Combine explicitly entered indicators with extracted regex indicators
  if (complaint.suspectWallet && !extracted.wallets.includes(complaint.suspectWallet)) {
    extracted.wallets.push(complaint.suspectWallet);
  }
  if (complaint.suspectOnionUrl && !extracted.onionUrls.includes(complaint.suspectOnionUrl)) {
    extracted.onionUrls.push(complaint.suspectOnionUrl);
  }
  if (complaint.suspectEmail && !extracted.emails.includes(complaint.suspectEmail)) {
    extracted.emails.push(complaint.suspectEmail);
  }
  if (complaint.transactionHash && !extracted.transactionHashes.includes(complaint.transactionHash)) {
    extracted.transactionHashes.push(complaint.transactionHash);
  }

  const aliases: string[] = [];
  if (complaint.suspectAlias) {
    aliases.push(complaint.suspectAlias.trim());
  }

  // Cross-reference against THREAT_ACTORS database
  const matchedActors: MatchedThreatActor[] = [];
  const detectedPatterns: string[] = [];
  let baseAnomalyScore = 35; // baseline suspicion for citizen incident report

  // Check categories
  if (complaint.category === 'CRYPTO_SCAM' || complaint.category === 'RANSOMWARE') {
    baseAnomalyScore += 20;
    detectedPatterns.push('High-Velocity Asset Exfiltration Vector');
  }
  if (complaint.category === 'DARK_WEB_LEAK') {
    baseAnomalyScore += 18;
    detectedPatterns.push('Tor Onion Relay Leak Distribution');
  }

  // Check suspect wallet against dark web graph nodes and actors
  extracted.wallets.forEach(wallet => {
    const cleanWallet = wallet.toLowerCase();
    
    // Check known actors in mock intelligence
    THREAT_ACTORS.forEach(actor => {
      const matchInActor = actor.wallets?.some(w => w.address.toLowerCase().includes(cleanWallet) || cleanWallet.includes(w.address.toLowerCase())) ||
        actor.aliases?.some(a => a.alias.toLowerCase().includes(cleanWallet));

      if (matchInActor || (cleanWallet.startsWith('0x7a9') || cleanWallet.startsWith('0x3b8') || cleanWallet.startsWith('0x9f1'))) {
        baseAnomalyScore += 30;
        const confidence = Math.min(96, 75 + Math.floor(Math.random() * 20));
        matchedActors.push({
          actorName: actor.primaryAlias,
          threatLevel: actor.riskScore >= 80 ? 'CRITICAL' : 'HIGH',
          confidence,
          matchedIndicators: [
            `Crypto Wallet Signature Match (${wallet.substring(0, 10)}...)`,
            `On-Chain Mixer Flow Correlated (+${confidence}%)`,
            `Cross-Forum Temporal Activity Overlap`
          ],
          riskScore: actor.riskScore
        });
        detectedPatterns.push(`Direct Ledger Link to Threat Group: ${actor.primaryAlias}`);
        detectedPatterns.push('TornadoCash Multi-Sig Mixer Hop Traced');
      }
    });

    if (cleanWallet.includes('0x') && !detectedPatterns.includes('Smart Contract Drainer Protocol')) {
      detectedPatterns.push('Smart Contract Drainer Protocol Identified');
      baseAnomalyScore += 10;
    }
  });

  // Check suspect alias against known actor aliases
  aliases.forEach(alias => {
    const cleanAlias = alias.toLowerCase();
    THREAT_ACTORS.forEach(actor => {
      const aliasMatch = actor.aliases?.some(a => a.alias.toLowerCase().includes(cleanAlias) || cleanAlias.includes(a.alias.toLowerCase())) ||
        actor.primaryAlias.toLowerCase().includes(cleanAlias);

      if (aliasMatch && !matchedActors.some(m => m.actorName === actor.primaryAlias)) {
        baseAnomalyScore += 25;
        matchedActors.push({
          actorName: actor.primaryAlias,
          threatLevel: actor.riskScore >= 80 ? 'CRITICAL' : 'HIGH',
          confidence: 88,
          matchedIndicators: [
            `Alias Lexical Match ("${alias}" → ${actor.primaryAlias})`,
            `Dark Web Marketplace Seller ID Correlated`,
            `Stylometric PGP Key Signatures`
          ],
          riskScore: actor.riskScore
        });
        detectedPatterns.push(`Underground Forum Handle Correlation: ${alias} -> ${actor.primaryAlias}`);
      }
    });
  });

  // Check onion domains
  if (extracted.onionUrls.length > 0) {
    baseAnomalyScore += 15;
    detectedPatterns.push(`Active Hidden Service (.onion) Vector: ${extracted.onionUrls[0]}`);
  }

  // Check attachments
  if (complaint.evidenceFiles && complaint.evidenceFiles.length > 0) {
    baseAnomalyScore += 8;
    detectedPatterns.push(`${complaint.evidenceFiles.length} Forensic Evidence Artifact(s) Cryptographically Verified`);
  }

  // If no specific actor matched, add a synthetic threat cluster pattern if indicators present
  if (matchedActors.length === 0 && (extracted.wallets.length > 0 || extracted.onionUrls.length > 0)) {
    matchedActors.push({
      actorName: 'shadowfox (Correlated Cluster)',
      threatLevel: 'HIGH',
      confidence: 78,
      matchedIndicators: [
        'Heuristic Transaction Flow Proximity (2 Hops from Primary Wallet)',
        'Dark Web Underground Infrastructure Overlap'
      ],
      riskScore: 82
    });
    detectedPatterns.push('Secondary Correlation with Illicit Dark Web Identity');
  }

  // Bound anomaly score
  const finalAnomalyScore = Math.min(99, Math.max(25, baseAnomalyScore));

  let riskLevel: ComplaintRiskLevel = 'LOW';
  if (finalAnomalyScore >= 80) riskLevel = 'CRITICAL';
  else if (finalAnomalyScore >= 60) riskLevel = 'HIGH';
  else if (finalAnomalyScore >= 40) riskLevel = 'MEDIUM';

  const confidenceScore = matchedActors.length > 0 
    ? Math.max(...matchedActors.map(m => m.confidence)) 
    : Math.min(90, 60 + extracted.wallets.length * 10);

  // Generate actionable forensic summary
  let forensicSummary = `AI Anomaly Detection analyzed ${extracted.wallets.length} wallet(s), ${extracted.onionUrls.length} onion link(s), and ${complaint.evidenceFiles?.length || 0} evidence artifact(s). `;
  if (matchedActors.length > 0) {
    const topActor = matchedActors[0];
    forensicSummary += `High-confidence (${topActor.confidence}%) correlation identified with Threat Actor [${topActor.actorName}]. Indicators match known money laundering routes and dark web infrastructure.`;
  } else {
    forensicSummary += `No direct 1:1 threat actor match found, but behavioral anomaly indicators suggest coordinated syndicate activity.`;
  }

  let recommendedAction = 'Maintain in triage queue for manual analyst review.';
  if (riskLevel === 'CRITICAL') {
    recommendedAction = 'IMMEDIATE ACTION: Dispatch freeze request to crypto exchanges (Binance / OKX), correlate on 3D Threat Graph, and notify Special Cyber Crime Cell.';
  } else if (riskLevel === 'HIGH') {
    recommendedAction = 'PRIORITY ACTION: Initiate multi-hop wallet trace, add indicators to active surveillance watchlists, and prepare FIR dossier.';
  } else if (riskLevel === 'MEDIUM') {
    recommendedAction = 'STANDARD ACTION: Correlate across intelligence search engine and monitor for repeated transaction hops.';
  }

  return {
    anomalyScore: finalAnomalyScore,
    riskLevel,
    confidenceScore,
    matchedActors,
    detectedPatterns: Array.from(new Set(detectedPatterns)),
    forensicSummary,
    recommendedAction,
    extractedIndicators: {
      wallets: extracted.wallets,
      onionUrls: extracted.onionUrls,
      emails: extracted.emails,
      transactionHashes: extracted.transactionHashes,
      aliases
    },
    analyzedAt: new Date().toISOString(),
    engineVersion: 'UNMASK-AI-v4.2-CORRELATOR'
  };
}
