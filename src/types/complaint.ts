// ============================================================
// UNMASK // Citizen Complaints & AI Anomaly Detection Types
// ============================================================

export type AuthProviderType = 'GOOGLE' | 'METAMASK';

export interface CitizenAuthUser {
  provider: AuthProviderType;
  identifier: string; // Email or Wallet Address
  displayName?: string;
  avatarUrl?: string;
  walletAddress?: string;
  networkName?: string;
  chainId?: number;
  balance?: string;
  authToken?: string;
  connectedAt: string;
}

export type ComplaintCategory = 
  | 'CRYPTO_SCAM'
  | 'RANSOMWARE'
  | 'DARK_WEB_LEAK'
  | 'PHISHING'
  | 'MARKETPLACE_FRAUD'
  | 'IDENTITY_THEFT'
  | 'TELEGRAM_EXTORTION'
  | 'OTHER';

export type ComplaintStatus = 
  | 'PENDING'
  | 'AI_ANALYZED'
  | 'INVESTIGATING'
  | 'ESCALATED_CYBER_CELL'
  | 'RESOLVED'
  | 'DISMISSED';

export type ComplaintRiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceAttachment {
  id: string;
  name: string;
  type: string; // image/png, text/plain, etc.
  size: number;
  dataUrl?: string;
  previewUrl?: string;
  sha256Hash: string;
}

export interface BlockchainProof {
  txHash: string;
  blockNumber: number;
  evidenceHash: string;
  signerAddress: string;
  signature: string;
  network: string;
  gasUsed: string;
  timestamp: string;
  contractAddress?: string;
}

export interface MatchedThreatActor {
  actorName: string;
  threatLevel: ComplaintRiskLevel;
  confidence: number; // 0 - 100
  matchedIndicators: string[]; // e.g., ["0x7A9f... (Shared Wallet)", "darksurvey77x.onion", "Stylometric Match"]
  riskScore: number;
}

export interface AIAnomalyReport {
  anomalyScore: number; // 0 - 100
  riskLevel: ComplaintRiskLevel;
  confidenceScore: number; // 0 - 100
  matchedActors: MatchedThreatActor[];
  detectedPatterns: string[]; // e.g. ["Illicit Mixer Interaction", "High-Frequency Fund Laundering", "Known Phishing Vector"]
  forensicSummary: string;
  recommendedAction: string;
  extractedIndicators: {
    wallets: string[];
    onionUrls: string[];
    emails: string[];
    transactionHashes: string[];
    aliases: string[];
  };
  analyzedAt: string;
  engineVersion: string;
}

export interface AdminResolutionNote {
  id: string;
  adminName: string;
  note: string;
  statusChangedTo?: ComplaintStatus;
  timestamp: string;
}

export interface CitizenComplaint {
  id: string; // Tracking ID, e.g. UNMASK-CMP-2026-8942
  title: string;
  category: ComplaintCategory;
  incidentDate: string;
  approximateLoss?: string; // e.g. "₹ 4,50,000" or "2.5 ETH"
  narrative: string;
  
  // Suspect indicators provided by user
  suspectAlias?: string;
  suspectWallet?: string;
  suspectOnionUrl?: string;
  suspectEmail?: string;
  suspectPhone?: string;
  transactionHash?: string;
  
  // Attachments & Evidence
  evidenceFiles: EvidenceAttachment[];
  
  // User Authentication & Identity
  submittedBy: CitizenAuthUser;
  
  // Web3 Blockchain Seal
  blockchainProof?: BlockchainProof;
  
  // Operational Status
  status: ComplaintStatus;
  submittedAt: string;
  updatedAt: string;
  
  // AI Anomaly Triage Engine Output
  aiAnomalyReport: AIAnomalyReport;
  
  // Admin Action Log
  adminNotes: AdminResolutionNote[];
}
