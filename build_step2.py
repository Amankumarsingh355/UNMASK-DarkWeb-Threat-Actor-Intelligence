# ==========================================
# 2. backend/data/seed_data.py
# ==========================================
seed_data_code = """# ============================================================
# UNMASK SYNTHETIC INTELLIGENCE SEED DATA
# NTRO Problem Statement NTRO Cyber Threat Platform
# ============================================================

INITIAL_COMPLAINTS = [
    {
        "id": "UNMASK-CMP-2026-8942",
        "title": "DeFi Liquidity Pool Drainer Scam & Wallet Exploit",
        "category": "CRYPTO_SCAM",
        "incidentDate": "2026-09-02T14:30:00Z",
        "approximateLoss": "4.85 ETH (₹ 11,20,000)",
        "narrative": "I connected my MetaMask to a fraudulent decentralized staking platform advertised on Telegram. Within 3 minutes, my wallet was drained into an intermediary mixer address 0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f. Suspect was using handle shadow_drainer on dark web forum Dread.",
        "suspectAlias": "shadow_drainer",
        "suspectWallet": "0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f",
        "suspectOnionUrl": "darksurvey77x.onion",
        "suspectEmail": "shadow77_support@proton.me",
        "suspectPhone": None,
        "transactionHash": "0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
        "evidenceFiles": [
            {
                "id": "ev-1",
                "name": "metamask_drain_receipt.png",
                "type": "image/png",
                "size": 245000,
                "sha256Hash": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            },
            {
                "id": "ev-2",
                "name": "etherscan_tx_dump.txt",
                "type": "text/plain",
                "size": 14200,
                "sha256Hash": "0xca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
            }
        ],
        "submittedBy": {
            "provider": "METAMASK",
            "identifier": "0x3B8F...74A1",
            "walletAddress": "0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a74a1",
            "networkName": "Ethereum Mainnet",
            "chainId": 1,
            "connectedAt": "2026-09-02T14:40:00Z"
        },
        "blockchainProof": {
            "txHash": "0x4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
            "blockNumber": 19842104,
            "evidenceHash": "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
            "signerAddress": "0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a74a1",
            "signature": "0x9942a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f01b",
            "network": "Ethereum Mainnet",
            "gasUsed": "21,000 Gwei",
            "timestamp": "2026-09-02T14:45:12Z"
        },
        "status": "INVESTIGATING",
        "submittedAt": "2026-09-02T14:45:12Z",
        "updatedAt": "2026-09-04T10:15:00Z",
        "aiAnomalyReport": {
            "anomalyScore": 94,
            "riskLevel": "CRITICAL",
            "confidenceScore": 92,
            "matchedActors": [
                {
                    "actorName": "ShadowX77",
                    "threatLevel": "CRITICAL",
                    "confidence": 92,
                    "matchedIndicators": [
                        "Crypto Wallet Signature Match (0x7a9f6d3b...)",
                        "On-Chain Mixer Flow Correlated (+92%)",
                        "Cross-Forum Temporal Activity Overlap"
                    ],
                    "riskScore": 87
                }
            ],
            "detectedPatterns": [
                "Direct Ledger Link to Threat Group: ShadowX77",
                "TornadoCash Multi-Sig Mixer Hop Traced",
                "Smart Contract Drainer Protocol Identified",
                "2 Forensic Evidence Artifact(s) Cryptographically Verified"
            ],
            "forensicSummary": "AI Anomaly Detection identified direct on-chain correlation with threat syndicate ShadowX77. Suspect wallet has laundered over 14.8 ETH across 3 decentralized mixing bridges.",
            "recommendedAction": "IMMEDIATE ACTION: Dispatch freeze request to crypto exchanges (Binance / OKX), correlate on 3D Threat Graph, and notify Special Cyber Crime Cell.",
            "extractedIndicators": {
                "wallets": ["0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f"],
                "onionUrls": ["darksurvey77x.onion"],
                "emails": ["shadow77_support@proton.me"],
                "transactionHashes": ["0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b"],
                "aliases": ["shadow_drainer"]
            },
            "analyzedAt": "2026-09-02T14:45:15Z",
            "engineVersion": "UNMASK-AI-v4.2-CORRELATOR"
        },
        "adminNotes": [
            {
                "id": "adm-1",
                "adminName": "ANALYST_K.RAMAN",
                "note": "Correlated on 3D Threat Graph with ShadowX77 node. Exchange freeze warrant submitted to FIU & Cyber Cell.",
                "statusChangedTo": "INVESTIGATING",
                "timestamp": "2026-09-03T09:20:00Z"
            }
        ]
    },
    {
        "id": "UNMASK-CMP-2026-7731",
        "title": "Hospital Patient Database Ransomware Extortion Threat",
        "category": "RANSOMWARE",
        "incidentDate": "2026-09-03T18:00:00Z",
        "approximateLoss": "₹ 25,00,000 Demanded",
        "narrative": "Our clinic servers were locked with .krypt extension. Attacker left a ransom note demanding Bitcoin payment to wallet bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh and threatened to publish confidential medical records on dark web portal cryptoleakshub.onion.",
        "suspectAlias": "VoidKrypt_Op",
        "suspectWallet": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        "suspectOnionUrl": "cryptoleakshub.onion",
        "suspectEmail": "voidkrypt_ransom@onionmail.org",
        "suspectPhone": None,
        "transactionHash": None,
        "evidenceFiles": [
            {
                "id": "ev-3",
                "name": "ransom_note_readme.txt",
                "type": "text/plain",
                "size": 3200,
                "sha256Hash": "0x18ac3e7343f016890c510e93f935261169d9e3f565436429830faf09340f4415"
            }
        ],
        "submittedBy": {
            "provider": "GOOGLE",
            "identifier": "dr.anil.verma@carehospital.org",
            "displayName": "Dr. Anil Verma",
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            "connectedAt": "2026-09-03T19:10:00Z"
        },
        "status": "ESCALATED_CYBER_CELL",
        "submittedAt": "2026-09-03T19:15:00Z",
        "updatedAt": "2026-09-04T16:00:00Z",
        "aiAnomalyReport": {
            "anomalyScore": 89,
            "riskLevel": "CRITICAL",
            "confidenceScore": 86,
            "matchedActors": [
                {
                    "actorName": "VoidKrypt",
                    "threatLevel": "CRITICAL",
                    "confidence": 86,
                    "matchedIndicators": [
                        "Ransomware Binary Note Hash Match",
                        "Known Dark Web Leak Portal Association (cryptoleakshub.onion)",
                        "High-Value Healthcare Targeting Signature"
                    ],
                    "riskScore": 84
                }
            ],
            "detectedPatterns": [
                "High-Velocity Asset Exfiltration Vector",
                "Active Hidden Service (.onion) Vector: cryptoleakshub.onion",
                "Underground Forum Handle Correlation: VoidKrypt_Op -> VoidKrypt"
            ],
            "forensicSummary": "Extortion narrative matches LockBit/VoidKrypt variant signatures. Recommended immediate network isolation and forensic snapshot preservation.",
            "recommendedAction": "IMMEDIATE ACTION: Dispatch emergency advisory to CERT-In and escalate directly to National Cyber Crime Coordination Centre (I4C).",
            "extractedIndicators": {
                "wallets": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"],
                "onionUrls": ["cryptoleakshub.onion"],
                "emails": ["voidkrypt_ransom@onionmail.org"],
                "transactionHashes": [],
                "aliases": ["VoidKrypt_Op"]
            },
            "analyzedAt": "2026-09-03T19:15:03Z",
            "engineVersion": "UNMASK-AI-v4.2-CORRELATOR"
        },
        "adminNotes": [
            {
                "id": "adm-2",
                "adminName": "ADMIN_SUPERVISOR",
                "note": "Escalated to CERT-In Incident Response Team. Decryption tool research initiated.",
                "statusChangedTo": "ESCALATED_CYBER_CELL",
                "timestamp": "2026-09-04T16:00:00Z"
            }
        ]
    },
    {
        "id": "UNMASK-CMP-2026-5120",
        "title": "Phishing Credential Harvester & Telegram OTP Interception",
        "category": "PHISHING",
        "incidentDate": "2026-09-04T11:00:00Z",
        "approximateLoss": "₹ 75,000",
        "narrative": "Received a fake bank KYC update link on Telegram. When submitted, OTP was intercepted and funds routed through a payment gateway token.",
        "suspectAlias": "kyc_update_bot",
        "suspectWallet": None,
        "suspectOnionUrl": None,
        "suspectEmail": None,
        "suspectPhone": "+91 98765 43210",
        "transactionHash": None,
        "evidenceFiles": [],
        "submittedBy": {
            "provider": "GOOGLE",
            "identifier": "priya.sharma99@gmail.com",
            "displayName": "Priya Sharma",
            "connectedAt": "2026-09-04T12:00:00Z"
        },
        "status": "AI_ANALYZED",
        "submittedAt": "2026-09-04T12:05:00Z",
        "updatedAt": "2026-09-04T12:05:00Z",
        "aiAnomalyReport": {
            "anomalyScore": 65,
            "riskLevel": "HIGH",
            "confidenceScore": 74,
            "matchedActors": [],
            "detectedPatterns": [
                "Telegram Bot API Phishing Exfiltration",
                "Smishing Phone Vector Identified"
            ],
            "forensicSummary": "Linguistic patterns match automated Telegram KYC credential harvesting campaign. No high-tier APT syndicate matched.",
            "recommendedAction": "PRIORITY ACTION: Block Telegram bot token and register suspect phone number with National Cyber Crime Reporting Portal.",
            "extractedIndicators": {
                "wallets": [],
                "onionUrls": [],
                "emails": [],
                "transactionHashes": [],
                "aliases": ["kyc_update_bot"]
            },
            "analyzedAt": "2026-09-04T12:05:02Z",
            "engineVersion": "UNMASK-AI-v4.2-CORRELATOR"
        },
        "adminNotes": []
    }
]

THREAT_ACTORS_SEED = [
    {
        "id": "ACT-001",
        "primaryAlias": "ShadowX77",
        "status": "ACTIVE",
        "riskLevel": "CRITICAL",
        "riskScore": 87,
        "confidenceScore": 91,
        "category": "Ransomware Broker & Credential Trafficking",
        "summary": "High-profile darknet broker specializing in high-tier corporate network access and cryptocurrency laundering via nested mixer services.",
        "aliases": ["shadowx_77", "Shadow_X", "Shadow-X", "sh4dow_root", "shadow_drainer"],
        "wallets": [
            "0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f",
            "0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
            "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        ],
        "onionUrls": ["darksurvey77x.onion", "shadowgate55.onion", "dreadforum77.onion"],
        "emails": ["shadow77_support@proton.me", "shadowx77@onionmail.org"],
        "keywords": ["escrow_locked", "instant_drop", "clean_utxo", "pgp_signed_only", "root_access", "vpn_dump"]
    },
    {
        "id": "ACT-002",
        "primaryAlias": "VoidKrypt",
        "status": "ACTIVE",
        "riskLevel": "CRITICAL",
        "riskScore": 84,
        "confidenceScore": 88,
        "category": "Healthcare & Critical Infrastructure Ransomware Syndicate",
        "summary": "Ransomware group deploying customized LockBit variants targeting hospital and financial records across South Asia.",
        "aliases": ["VoidKrypt_Op", "Void_Locker", "KryptVoid99", "krypt_master"],
        "wallets": [
            "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        ],
        "onionUrls": ["cryptoleakshub.onion", "voidkryptpress.onion"],
        "emails": ["voidkrypt_ransom@onionmail.org"],
        "keywords": ["readme_decrypt", "ransom_note", "private_key", "exfiltrated_data", "time_is_running"]
    },
    {
        "id": "ACT-003",
        "primaryAlias": "PhishStrike",
        "status": "MONITORED",
        "riskLevel": "HIGH",
        "riskScore": 76,
        "confidenceScore": 82,
        "category": "Banking Trojan & OTP Interception Ring",
        "summary": "Syndicate operating automated Telegram smishing kits and fake banking OAuth harvesting portals.",
        "aliases": ["phish_strike", "otp_master_india", "kyc_update_bot", "sms_blaster_v2"],
        "wallets": ["0x9f1c2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f"],
        "onionUrls": ["phishkitmarket.onion"],
        "emails": ["phishstrike@secmail.pro"],
        "keywords": ["kyc_update", "otp_bypass", "bank_apk", "fast_cashout", "sim_swap"]
    },
    {
        "id": "ACT-004",
        "primaryAlias": "SilkGhost",
        "status": "ACTIVE",
        "riskLevel": "HIGH",
        "riskScore": 79,
        "confidenceScore": 85,
        "category": "Dark Web Illicit Marketplace Vendor",
        "summary": "High-volume vendor operating synthetic ID forgery and stolen credit card dumps across multiple Tor markets.",
        "aliases": ["silk_ghost", "ghost_vendor", "silk_passports"],
        "wallets": ["0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d"],
        "onionUrls": ["silkpass88market.onion"],
        "emails": ["silkghost@tuta.io"],
        "keywords": ["fullz", "cvv_dump", "fake_aadhaar", "passport_scan", "high_validity"]
    }
]

GRAPH_TOPOLOGY_SEED = {
    "nodes": [
        {"id": "ACT-001", "label": "ShadowX77 (Syndicate)", "type": "ACTOR", "riskLevel": "CRITICAL", "riskScore": 87},
        {"id": "ACT-002", "label": "VoidKrypt (Ransomware)", "type": "ACTOR", "riskLevel": "CRITICAL", "riskScore": 84},
        {"id": "ACT-003", "label": "PhishStrike (Smishing)", "type": "ACTOR", "riskLevel": "HIGH", "riskScore": 76},
        {"id": "ACT-004", "label": "SilkGhost (ID Forgery)", "type": "ACTOR", "riskLevel": "HIGH", "riskScore": 79},
        {"id": "W-01", "label": "0x7a9f...6e7f (Mixer Inflow)", "type": "WALLET", "riskLevel": "CRITICAL", "riskScore": 95},
        {"id": "W-02", "label": "0x3b8f...74a1 (Drainer Bridge)", "type": "WALLET", "riskLevel": "HIGH", "riskScore": 80},
        {"id": "W-03", "label": "bc1qxy...0wlh (BTC Ransom)", "type": "WALLET", "riskLevel": "CRITICAL", "riskScore": 90},
        {"id": "ONION-01", "label": "darksurvey77x.onion", "type": "ONION_SERVICE", "riskLevel": "CRITICAL", "riskScore": 92},
        {"id": "ONION-02", "label": "cryptoleakshub.onion", "type": "ONION_SERVICE", "riskLevel": "CRITICAL", "riskScore": 88},
        {"id": "CMP-8942", "label": "DeFi Drainer Incident #8942", "type": "COMPLAINT", "riskLevel": "CRITICAL", "riskScore": 94},
        {"id": "CMP-7731", "label": "Hospital Ransom Incident #7731", "type": "COMPLAINT", "riskLevel": "CRITICAL", "riskScore": 89},
        {"id": "CMP-5120", "label": "Phishing Incident #5120", "type": "COMPLAINT", "riskLevel": "HIGH", "riskScore": 65}
    ],
    "links": [
        {"source": "ACT-001", "target": "W-01", "relationship": "CONTROLLED_WALLET", "strength": 0.95},
        {"source": "ACT-001", "target": "ONION-01", "relationship": "HOSTED_INFRASTRUCTURE", "strength": 0.92},
        {"source": "CMP-8942", "target": "W-01", "relationship": "DIRECT_FUNDS_STOLEN_TO", "strength": 0.96},
        {"source": "CMP-8942", "target": "ACT-001", "relationship": "ATTRIBUTED_ACTOR", "strength": 0.92},
        {"source": "ACT-002", "target": "W-03", "relationship": "RANSOM_COLLECTION_WALLET", "strength": 0.90},
        {"source": "ACT-002", "target": "ONION-02", "relationship": "LEAK_PORTAL_OPERATOR", "strength": 0.88},
        {"source": "CMP-7731", "target": "W-03", "relationship": "EXTORTION_DEMAND_ADDRESS", "strength": 0.94},
        {"source": "CMP-7731", "target": "ACT-002", "relationship": "ATTRIBUTED_ACTOR", "strength": 0.86},
        {"source": "ACT-001", "target": "ACT-004", "relationship": "CROSS_FORUM_COMMERCE", "strength": 0.65}
    ]
}
"""

with open("backend/data/seed_data.py", "w", encoding="utf-8") as f:
    f.write(seed_data_code)

print("backend/data/seed_data.py written.")
