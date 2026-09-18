// ============================================================
// UNMASK // CITIZEN COMPLAINT REACTIVE STORE & REPOSITORY
// LocalStorage Persistence + Real-Time Reactive Listeners + FastAPI Backend Sync
// ============================================================

import type { CitizenComplaint, ComplaintStatus, AdminResolutionNote } from '../types/complaint';
import { runAIAnomalyDetection } from '../utils/aiAnomalyDetector';
import { ApiClient } from './apiClient';

const STORAGE_KEY = 'unmask_citizen_complaints_db_v1';

// Initial realistic seed complaints
const INITIAL_SEEDS: CitizenComplaint[] = [
  {
    id: 'UNMASK-CMP-2026-8942',
    title: 'DeFi Liquidity Drainer Scam & Dark Web Marketplace Laundering',
    category: 'CRYPTO_SCAM',
    incidentDate: '2026-09-02T14:30:00Z',
    approximateLoss: '5.45 ETH (₹ 13,80,000)',
    narrative: 'Transferred funds to an escrow contract advertised on Dread by seller shadowfox. Funds were immediately routed into deposit address 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a and bridged across multiple wallets.',
    suspectAlias: 'shadowfox',
    suspectWallet: '0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a',
    suspectOnionUrl: 'dreadmarket.onion',
    suspectEmail: 'shadowfox_support@proton.me',
    transactionHash: '0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b',
    evidenceFiles: [
      {
        id: 'ev-1',
        name: 'etherscan_tx_dump.txt',
        type: 'text/plain',
        size: 14200,
        sha256Hash: '0xca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
      }
    ],
    submittedBy: {
      provider: 'METAMASK',
      identifier: '0x3B8F...74A1',
      walletAddress: '0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a74a1',
      networkName: 'Ethereum Mainnet',
      chainId: 1,
      connectedAt: '2026-09-02T14:40:00Z'
    },
    blockchainProof: {
      txHash: '0x4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      blockNumber: 19842104,
      evidenceHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      signerAddress: '0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a74a1',
      signature: '0x9942a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f01b',
      network: 'Ethereum Mainnet',
      gasUsed: '21,000 Gwei',
      timestamp: '2026-09-02T14:45:12Z'
    },
    status: 'INVESTIGATING',
    submittedAt: '2026-09-02T14:45:12Z',
    updatedAt: '2026-09-04T10:15:00Z',
    aiAnomalyReport: {
      anomalyScore: 96,
      riskLevel: 'CRITICAL',
      confidenceScore: 98,
      matchedActors: [
        {
          actorName: 'shadowfox',
          threatLevel: 'CRITICAL',
          confidence: 98,
          matchedIndicators: [
            'Cryptographic PGP Key Fingerprint Correlation (98%)',
            'EVM Wallet Signature Match (0xdd31ffb1...)',
            'Cross-Forum Correlated Alias (shadow_fox)',
            'Stylometric Linguistic Match (prefers short factual replies)'
          ],
          riskScore: 92
        }
      ],
      detectedPatterns: [
        'Direct Ledger Link to Dataset Identity: shadowfox',
        'EVM Wallet Observed in Dataset: 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a',
        'High-Confidence Stylometric Signature Verified',
        '2 Forensic Evidence Artifact(s) Cryptographically Verified'
      ],
      forensicSummary: 'AI Anomaly Detection identified direct on-chain correlation with dataset entity shadowfox / shadow_fox. Correlated with wallet 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a with 98% multi-signal confidence.',
      recommendedAction: 'IMMEDIATE ACTION: Dispatch freeze request to crypto exchanges, view correlated graph cluster on Threat Graph, and notify Special Cyber Crime Cell.',
      extractedIndicators: {
        wallets: ['0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a'],
        onionUrls: ['dreadmarket.onion'],
        emails: ['shadowfox_support@proton.me'],
        transactionHashes: ['0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b'],
        aliases: ['shadowfox']
      },
      analyzedAt: '2026-09-02T14:45:15Z',
      engineVersion: 'UNMASK-AI-v4.2-CORRELATOR'
    },
    adminNotes: [
      {
        id: 'adm-1',
        adminName: 'ANALYST_K.RAMAN',
        note: 'Correlated on 3D Threat Graph with shadowfox and shadow_fox nodes. High confidence multi-signal PGP alignment verified.',
        statusChangedTo: 'INVESTIGATING',
        timestamp: '2026-09-03T09:20:00Z'
      }
    ]
  },
  {
    id: 'UNMASK-CMP-2026-7731',
    title: 'Dark Web Exploit Kit & Access Broker Extortion Incident',
    category: 'RANSOMWARE',
    incidentDate: '2026-09-03T18:00:00Z',
    approximateLoss: '₹ 18,50,000 Demanded',
    narrative: 'Internal database credentials compromised. Attacker operating under darknet handle darkwolf (also observed as dw77) posted exploit proofs on BreachForums demanding payment to wallet 0x127b8aa6fceef1265f24f5a34f8263158c543fbe.',
    suspectAlias: 'darkwolf',
    suspectWallet: '0x127b8aa6fceef1265f24f5a34f8263158c543fbe',
    suspectOnionUrl: 'breachforums.onion',
    suspectEmail: 'darkwolf_leaks@onionmail.org',
    evidenceFiles: [
      {
        id: 'ev-3',
        name: 'extortion_post_dump.txt',
        type: 'text/plain',
        size: 3200,
        sha256Hash: '0x18ac3e7343f016890c510e93f935261169d9e3f565436429830faf09340f4415'
      }
    ],
    submittedBy: {
      provider: 'GOOGLE',
      identifier: 'dr.anil.verma@carehospital.org',
      displayName: 'Dr. Anil Verma',
      connectedAt: '2026-09-03T19:10:00Z'
    },
    status: 'ESCALATED_CYBER_CELL',
    submittedAt: '2026-09-03T19:15:00Z',
    updatedAt: '2026-09-04T16:00:00Z',
    aiAnomalyReport: {
      anomalyScore: 92,
      riskLevel: 'CRITICAL',
      confidenceScore: 86,
      matchedActors: [
        {
          actorName: 'VoidKrypt',
          threatLevel: 'CRITICAL',
          confidence: 86,
          matchedIndicators: [
            'Ransomware Binary Note Hash Match',
            'Known Dark Web Leak Portal Association (cryptoleakshub.onion)',
            'High-Value Healthcare Targeting Signature'
          ],
          riskScore: 84
        }
      ],
      detectedPatterns: [
        'High-Velocity Asset Exfiltration Vector',
        'Active Hidden Service (.onion) Vector: cryptoleakshub.onion',
        'Underground Forum Handle Correlation: VoidKrypt_Op -> VoidKrypt'
      ],
      forensicSummary: 'Extortion narrative matches LockBit/VoidKrypt variant signatures. Recommended immediate network isolation and forensic snapshot preservation.',
      recommendedAction: 'IMMEDIATE ACTION: Dispatch emergency advisory to CERT-In and escalate directly to National Cyber Crime Coordination Centre (I4C).',
      extractedIndicators: {
        wallets: ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
        onionUrls: ['cryptoleakshub.onion'],
        emails: ['voidkrypt_ransom@onionmail.org'],
        transactionHashes: [],
        aliases: ['VoidKrypt_Op']
      },
      analyzedAt: '2026-09-03T19:15:03Z',
      engineVersion: 'UNMASK-AI-v4.2-CORRELATOR'
    },
    adminNotes: [
      {
        id: 'adm-2',
        adminName: 'ADMIN_SUPERVISOR',
        note: 'Escalated to CERT-In Incident Response Team. Decryption tool research initiated.',
        statusChangedTo: 'ESCALATED_CYBER_CELL',
        timestamp: '2026-09-04T16:00:00Z'
      }
    ]
  },
  {
    id: 'UNMASK-CMP-2026-5120',
    title: 'Phishing Credential Harvester & Telegram OTP Interception',
    category: 'PHISHING',
    incidentDate: '2026-09-04T11:00:00Z',
    approximateLoss: '₹ 75,000',
    narrative: 'Received a fake bank KYC update link on Telegram. When submitted, OTP was intercepted and funds routed through a payment gateway token.',
    suspectAlias: 'kyc_update_bot',
    suspectPhone: '+91 98765 43210',
    evidenceFiles: [],
    submittedBy: {
      provider: 'GOOGLE',
      identifier: 'priya.sharma99@gmail.com',
      displayName: 'Priya Sharma',
      connectedAt: '2026-09-04T12:00:00Z'
    },
    status: 'AI_ANALYZED',
    submittedAt: '2026-09-04T12:05:00Z',
    updatedAt: '2026-09-04T12:05:00Z',
    aiAnomalyReport: {
      anomalyScore: 65,
      riskLevel: 'HIGH',
      confidenceScore: 74,
      matchedActors: [],
      detectedPatterns: [
        'Telegram Bot API Phishing Exfiltration',
        'Smishing Phone Vector Identified'
      ],
      forensicSummary: 'Linguistic patterns match automated Telegram KYC credential harvesting campaign. No high-tier APT syndicate matched.',
      recommendedAction: 'PRIORITY ACTION: Block Telegram bot token and register suspect phone number with National Cyber Crime Reporting Portal.',
      extractedIndicators: {
        wallets: [],
        onionUrls: [],
        emails: [],
        transactionHashes: [],
        aliases: ['kyc_update_bot']
      },
      analyzedAt: '2026-09-04T12:05:02Z',
      engineVersion: 'UNMASK-AI-v4.2-CORRELATOR'
    },
    adminNotes: []
  }
];

type ComplaintListener = (complaints: CitizenComplaint[]) => void;
const listeners: Set<ComplaintListener> = new Set();

function notifyListeners(complaints: CitizenComplaint[]) {
  listeners.forEach(cb => {
    try {
      cb(complaints);
    } catch (err) {
      console.error('Error in complaint subscriber:', err);
    }
  });
}

export class ComplaintService {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.syncWithBackend();
  }

  static async syncWithBackend(): Promise<CitizenComplaint[]> {
    const backendComplaints = await ApiClient.getComplaints();
    if (backendComplaints && backendComplaints.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backendComplaints));
      notifyListeners(backendComplaints);
      return backendComplaints;
    }
    return this.getComplaints();
  }

  static getComplaints(): CitizenComplaint[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    }
    try {
      return JSON.parse(raw) as CitizenComplaint[];
    } catch (e) {
      console.error('Error parsing stored complaints:', e);
      return INITIAL_SEEDS;
    }
  }

  static getComplaintById(id: string): CitizenComplaint | undefined {
    const complaints = this.getComplaints();
    return complaints.find(c => c.id.toLowerCase() === id.toLowerCase());
  }

  static getComplaintsByUser(identifier: string): CitizenComplaint[] {
    const complaints = this.getComplaints();
    const cleanId = identifier.toLowerCase();
    return complaints.filter(c => 
      c.submittedBy.identifier.toLowerCase() === cleanId ||
      (c.submittedBy.walletAddress && c.submittedBy.walletAddress.toLowerCase() === cleanId)
    );
  }

  static submitComplaint(data: {
    title: string;
    category: any;
    incidentDate: string;
    approximateLoss?: string;
    narrative: string;
    suspectAlias?: string;
    suspectWallet?: string;
    suspectOnionUrl?: string;
    suspectEmail?: string;
    suspectPhone?: string;
    transactionHash?: string;
    evidenceFiles: any[];
    submittedBy: any;
    blockchainProof?: any;
  }): CitizenComplaint {
    const complaints = this.getComplaints();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `UNMASK-CMP-2026-${randomNum}`;
    const nowIso = new Date().toISOString();

    // Run AI Anomaly Detection Engine
    const aiReport = runAIAnomalyDetection({
      title: data.title,
      category: data.category,
      narrative: data.narrative,
      suspectAlias: data.suspectAlias,
      suspectWallet: data.suspectWallet,
      suspectOnionUrl: data.suspectOnionUrl,
      suspectEmail: data.suspectEmail,
      transactionHash: data.transactionHash,
      evidenceFiles: data.evidenceFiles
    });

    const newComplaint: CitizenComplaint = {
      id: trackingId,
      title: data.title,
      category: data.category,
      incidentDate: data.incidentDate || nowIso,
      approximateLoss: data.approximateLoss,
      narrative: data.narrative,
      suspectAlias: data.suspectAlias,
      suspectWallet: data.suspectWallet,
      suspectOnionUrl: data.suspectOnionUrl,
      suspectEmail: data.suspectEmail,
      suspectPhone: data.suspectPhone,
      transactionHash: data.transactionHash,
      evidenceFiles: data.evidenceFiles || [],
      submittedBy: data.submittedBy,
      blockchainProof: data.blockchainProof,
      status: 'AI_ANALYZED',
      submittedAt: nowIso,
      updatedAt: nowIso,
      aiAnomalyReport: aiReport,
      adminNotes: []
    };

    const updated = [newComplaint, ...complaints];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyListeners(updated);

    // Asynchronously dispatch to FastAPI backend (port 8000)
    ApiClient.submitComplaint(data).then(backendRes => {
      if (backendRes) {
        // Synchronize with returned backend entity
        const current = ComplaintService.getComplaints();
        const existingIdx = current.findIndex(c => c.id === newComplaint.id);
        if (existingIdx !== -1) {
          current[existingIdx] = backendRes;
        } else {
          current.unshift(backendRes);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        notifyListeners(current);
      }
    }).catch(err => {
      console.warn('Backend async submit sync note:', err);
    });

    return newComplaint;
  }

  static updateComplaintStatus(
    id: string, 
    newStatus: ComplaintStatus, 
    adminNoteText?: string, 
    adminName = 'ANALYST_K.RAMAN'
  ): CitizenComplaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex(c => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const target = { ...complaints[index] };
    target.status = newStatus;
    target.updatedAt = new Date().toISOString();

    if (adminNoteText) {
      const note: AdminResolutionNote = {
        id: `note-${Date.now()}`,
        adminName,
        note: adminNoteText,
        statusChangedTo: newStatus,
        timestamp: new Date().toISOString()
      };
      target.adminNotes = [note, ...(target.adminNotes || [])];
    }

    complaints[index] = target;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    notifyListeners(complaints);

    // Asynchronously update FastAPI backend
    ApiClient.updateComplaintStatus(id, newStatus, adminNoteText, adminName).catch(err => {
      console.warn('Backend async status update note:', err);
    });

    return target;
  }

  static subscribe(listener: ComplaintListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  static resetToSeed(): CitizenComplaint[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
    notifyListeners(INITIAL_SEEDS);
    return INITIAL_SEEDS;
  }
}

// Auto-trigger sync on load
ComplaintService.init();
