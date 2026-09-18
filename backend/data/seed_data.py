# ============================================================
# UNMASK SYNTHETIC INTELLIGENCE SEED DATA
# Dataset-Aligned Incident Reports & Intelligence Registry
# ============================================================

INITIAL_COMPLAINTS = [
    {
        "id": "UNMASK-CMP-2026-8942",
        "title": "DeFi Liquidity Drainer Scam & Dark Web Marketplace Laundering",
        "category": "CRYPTO_SCAM",
        "incidentDate": "2026-09-02T14:30:00Z",
        "approximateLoss": "5.45 ETH (₹ 13,80,000)",
        "narrative": "Transferred funds to an escrow contract advertised on Dread by seller shadowfox. Funds were immediately routed into deposit address 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a and bridged across multiple wallets.",
        "suspectAlias": "shadowfox",
        "suspectWallet": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "suspectOnionUrl": "dreadmarket.onion",
        "suspectEmail": "shadowfox_support@proton.me",
        "suspectPhone": None,
        "transactionHash": "0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
        "evidenceFiles": [
            {
                "id": "ev-1",
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
            "anomalyScore": 96,
            "riskLevel": "CRITICAL",
            "confidenceScore": 98,
            "matchedActors": [
                {
                    "actorName": "shadowfox",
                    "threatLevel": "CRITICAL",
                    "confidence": 98,
                    "matchedIndicators": [
                        "Cryptographic PGP Key Fingerprint Correlation (98%)",
                        "EVM Wallet Signature Match (0xdd31ffb1...)",
                        "Cross-Forum Correlated Alias (shadow_fox)",
                        "Stylometric Linguistic Match (prefers short factual replies)"
                    ],
                    "riskScore": 92
                }
            ],
            "detectedPatterns": [
                "Direct Ledger Link to Dataset Identity: shadowfox",
                "EVM Wallet Observed in Dataset: 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
                "High-Confidence Stylometric Signature Verified",
                "2 Forensic Evidence Artifact(s) Cryptographically Verified"
            ],
            "forensicSummary": "AI Anomaly Detection identified direct on-chain correlation with dataset entity shadowfox / shadow_fox. Correlated with wallet 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a with 98% multi-signal confidence.",
            "recommendedAction": "IMMEDIATE ACTION: Dispatch freeze request to crypto exchanges, view correlated graph cluster on Threat Graph, and notify Special Cyber Crime Cell.",
            "extractedIndicators": {
                "wallets": ["0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a"],
                "onionUrls": ["dreadmarket.onion"],
                "emails": ["shadowfox_support@proton.me"],
                "transactionHashes": ["0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b"],
                "aliases": ["shadowfox"]
            },
            "analyzedAt": "2026-09-02T14:45:15Z",
            "engineVersion": "UNMASK-AI-v4.2-CORRELATOR"
        },
        "adminNotes": [
            {
                "id": "adm-1",
                "adminName": "ANALYST_K.RAMAN",
                "note": "Correlated on 3D Threat Graph with shadowfox and shadow_fox nodes. High confidence multi-signal PGP alignment verified.",
                "statusChangedTo": "INVESTIGATING",
                "timestamp": "2026-09-03T09:20:00Z"
            }
        ]
    },
    {
        "id": "UNMASK-CMP-2026-7731",
        "title": "Dark Web Exploit Kit & Access Broker Extortion Incident",
        "category": "RANSOMWARE",
        "incidentDate": "2026-09-03T18:00:00Z",
        "approximateLoss": "₹ 18,50,000 Demanded",
        "narrative": "Internal database credentials compromised. Attacker operating under darknet handle darkwolf (also observed as dw77) posted exploit proofs on BreachForums demanding payment to wallet 0x127b8aa6fceef1265f24f5a34f8263158c543fbe.",
        "suspectAlias": "darkwolf",
        "suspectWallet": "0x127b8aa6fceef1265f24f5a34f8263158c543fbe",
        "suspectOnionUrl": "breachforums.onion",
        "suspectEmail": "darkwolf_leaks@onionmail.org",
        "suspectPhone": None,
        "transactionHash": None,
        "evidenceFiles": [
            {
                "id": "ev-3",
                "name": "extortion_post_dump.txt",
                "type": "text/plain",
                "size": 3200,
                "sha256Hash": "0x18ac3e7343f016890c510e93f935261169d9e3f565436429830faf09340f4415"
            }
        ],
        "submittedBy": {
            "provider": "GOOGLE",
            "identifier": "dr.anil.verma@carehospital.org",
            "displayName": "Dr. Anil Verma",
            "connectedAt": "2026-09-03T19:10:00Z"
        },
        "status": "ESCALATED_CYBER_CELL",
        "submittedAt": "2026-09-03T19:15:00Z",
        "updatedAt": "2026-09-04T16:00:00Z",
        "aiAnomalyReport": {
            "anomalyScore": 92,
            "riskLevel": "CRITICAL",
            "confidenceScore": 95,
            "matchedActors": [
                {
                    "actorName": "darkwolf",
                    "threatLevel": "CRITICAL",
                    "confidence": 95,
                    "matchedIndicators": [
                        "Wallet Address Match (0x127b8aa6...)",
                        "Cross-Forum Handle Shorthand Correlation (dw77 -> darkwolf)",
                        "Stylometric Linguistic Match (checks source details before relying on a post)",
                        "PGP Public Key Corroboration"
                    ],
                    "riskScore": 89
                }
            ],
            "detectedPatterns": [
                "Correlated Threat Actor Group: darkwolf / dw77",
                "Active Dataset Wallet: 0x127b8aa6fceef1265f24f5a34f8263158c543fbe",
                "Underground Forum Cross-Post Match: Exploit.in & BreachForums"
            ],
            "forensicSummary": "Threat telemetry matches dataset actor darkwolf (profile ap003) correlated with dw77 (profile ap004) across Exploit.in and BreachForums.",
            "recommendedAction": "IMMEDIATE ACTION: Dispatch advisory to CERT-In and escalate directly to National Cyber Crime Coordination Centre (I4C).",
            "extractedIndicators": {
                "wallets": ["0x127b8aa6fceef1265f24f5a34f8263158c543fbe"],
                "onionUrls": ["breachforums.onion"],
                "emails": ["darkwolf_leaks@onionmail.org"],
                "transactionHashes": [],
                "aliases": ["darkwolf", "dw77"]
            },
            "analyzedAt": "2026-09-03T19:15:03Z",
            "engineVersion": "UNMASK-AI-v4.2-CORRELATOR"
        },
        "adminNotes": [
            {
                "id": "adm-2",
                "adminName": "ADMIN_SUPERVISOR",
                "note": "Escalated to CERT-In Incident Response Team. Blockchain forensic tracing active.",
                "statusChangedTo": "ESCALATED_CYBER_CELL",
                "timestamp": "2026-09-04T16:00:00Z"
            }
        ]
    }
]

THREAT_ACTORS_SEED = [
    {
        "id": "ACT-001",
        "primaryAlias": "shadowfox",
        "status": "ACTIVE",
        "riskLevel": "CRITICAL",
        "riskScore": 92,
        "confidenceScore": 98,
        "category": "Cryptocurrency Drainer & Exploit Broker",
        "summary": "Primary dataset threat actor correlated with alias shadow_fox across Dread and Exploit.in with 98% multi-signal confidence.",
        "aliases": ["shadowfox", "shadow_fox", "sfox77"],
        "wallets": [
            "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a"
        ],
        "onionUrls": ["dreadmarket.onion", "exploitdark.onion"],
        "emails": ["shadowfox_support@proton.me"],
        "keywords": ["prefers short factual replies", "I kept the wording simple", "0xdd31ffb1"]
    },
    {
        "id": "ACT-002",
        "primaryAlias": "darkwolf",
        "status": "ACTIVE",
        "riskLevel": "CRITICAL",
        "riskScore": 89,
        "confidenceScore": 95,
        "category": "Exploit Broker & Data Trafficking",
        "summary": "Dataset threat actor operating under alias darkwolf on Exploit.in and dw77 on BreachForums.",
        "aliases": ["darkwolf", "dw77"],
        "wallets": [
            "0x127b8aa6fceef1265f24f5a34f8263158c543fbe"
        ],
        "onionUrls": ["breachforums.onion", "exploit.in"],
        "emails": ["darkwolf_leaks@onionmail.org"],
        "keywords": ["checks source details before relying on a post", "keeps older references", "0x127b8a"]
    },
    {
        "id": "ACT-003",
        "primaryAlias": "cipherbyte",
        "status": "ACTIVE",
        "riskLevel": "HIGH",
        "riskScore": 85,
        "confidenceScore": 98,
        "category": "Infrastructure Operator & Crypto Laundering",
        "summary": "Dataset threat actor correlated with cipher_byte across darknet forums with shared PGP key and EVM wallet.",
        "aliases": ["cipherbyte", "cipher_byte"],
        "wallets": [
            "0x83e29f0e13ebfe8f9e0cb744583161ca12657e28"
        ],
        "onionUrls": ["ciphernode.onion"],
        "emails": ["cipherbyte@secmail.pro"],
        "keywords": ["The useful check is", "A practical check is", "0x83e29f0e"]
    },
    {
        "id": "ACT-004",
        "primaryAlias": "nightraven",
        "status": "MONITORED",
        "riskLevel": "HIGH",
        "riskScore": 78,
        "confidenceScore": 85,
        "category": "Darknet Intelligence & Reconnaissance",
        "summary": "Dataset actor correlated with night_raven across forums with stylometric phrasing alignment.",
        "aliases": ["nightraven", "night_raven"],
        "wallets": [
            "0xa1026027fb464a4dcfb7a5a8bc12a97fbce2504b"
        ],
        "onionUrls": ["nightnet.onion"],
        "emails": ["nightraven@tuta.io"],
        "keywords": ["Quick check:", "Short version:", "0xa1026027"]
    }
]

GRAPH_TOPOLOGY_SEED = {
    "nodes": [
        {"id": "ACT-001", "label": "shadowfox", "type": "ACTOR", "riskLevel": "CRITICAL", "riskScore": 92},
        {"id": "ACT-002", "label": "darkwolf", "type": "ACTOR", "riskLevel": "CRITICAL", "riskScore": 89},
        {"id": "ACT-003", "label": "cipherbyte", "type": "ACTOR", "riskLevel": "HIGH", "riskScore": 85},
        {"id": "ACT-004", "label": "nightraven", "type": "ACTOR", "riskLevel": "HIGH", "riskScore": 78},
        {"id": "W-01", "label": "0xdd31...f96a (shadowfox)", "type": "WALLET", "riskLevel": "CRITICAL", "riskScore": 95},
        {"id": "W-02", "label": "0x127b...3fbe (darkwolf)", "type": "WALLET", "riskLevel": "HIGH", "riskScore": 88},
        {"id": "W-03", "label": "0x83e2...7e28 (cipherbyte)", "type": "WALLET", "riskLevel": "CRITICAL", "riskScore": 90},
        {"id": "CMP-8942", "label": "Incident #8942 (shadowfox)", "type": "COMPLAINT", "riskLevel": "CRITICAL", "riskScore": 96},
        {"id": "CMP-7731", "label": "Incident #7731 (darkwolf)", "type": "COMPLAINT", "riskLevel": "CRITICAL", "riskScore": 92}
    ],
    "links": [
        {"source": "ACT-001", "target": "W-01", "relationship": "CONTROLLED_WALLET", "strength": 0.98},
        {"source": "CMP-8942", "target": "W-01", "relationship": "DIRECT_FUNDS_STOLEN_TO", "strength": 0.98},
        {"source": "CMP-8942", "target": "ACT-001", "relationship": "ATTRIBUTED_ACTOR", "strength": 0.98},
        {"source": "ACT-002", "target": "W-02", "relationship": "CONTROLLED_WALLET", "strength": 0.95},
        {"source": "CMP-7731", "target": "W-02", "relationship": "EXTORTION_DEMAND_ADDRESS", "strength": 0.95},
        {"source": "CMP-7731", "target": "ACT-002", "relationship": "ATTRIBUTED_ACTOR", "strength": 0.95},
        {"source": "ACT-003", "target": "W-03", "relationship": "CONTROLLED_WALLET", "strength": 0.98}
    ]
}
