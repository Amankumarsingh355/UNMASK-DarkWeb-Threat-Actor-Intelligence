// ============================================================
// UNMASK // DATASET-DERIVED INTELLIGENCE DATABASE
// Dataset: UNMASK_Final_Synthetic_MVP_v2.3_VALIDATED
// Derived from real CSV files (accounts, forums, wallets, txs, posts)
// ============================================================

import type { 
  ThreatActor, 
  GraphNode, 
  GraphLink, 
  Investigation, 
  ThreatAlert, 
  LiveEventFeedItem, 
  AnomalyDetectionRecord, 
  StylometricComparison 
} from '../types/intelligence';

export const THREAT_ACTORS: ThreatActor[] = [
  {
    "id": "ACT-A001",
    "primaryAlias": "shadowfox",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-03T17:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B - Active across BlackMarket Forum.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"prefers short factual replies when a thread gets noisy\"",
        "\"I kept the wording simple because the thread is public\""
      ]
    },
    "aliases": [
      {
        "alias": "shadowfox",
        "similarityScore": 100,
        "platform": "BlackMarket Forum",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "shadowfox_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F001-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "BlackMarket Forum",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A002",
    "primaryAlias": "shadow_fox",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-06T12:00:00Z",
    "summary": "checks source details before relying on a post - Active across Exploit Exchange.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"I kept the wording simple because the thread is public\"",
        "\"checks source details before relying on a post\""
      ]
    },
    "aliases": [
      {
        "alias": "shadow_fox",
        "similarityScore": 100,
        "platform": "Exploit Exchange",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "shadow_fox_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F002-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Exploit Exchange",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A003",
    "primaryAlias": "sfox77",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-04-09T07:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy; contact: sfox77.demo@sample.test; published PGP fingerprint: 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B - Active across Archive Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 10,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"prefers short factual replies when a thread gets noisy\"",
        "\"I kept the wording simple because the thread is public\""
      ]
    },
    "aliases": [
      {
        "alias": "sfox77",
        "similarityScore": 100,
        "platform": "Archive Board",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "sfox77_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F003-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Archive Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A004",
    "primaryAlias": "darkwolf",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-10T22:00:00Z",
    "summary": "occasionally follows vendor and archive discussions; published PGP fingerprint: B85752AECC22AB55C230ECCDF4C58AA8EFA1C160 - Active across Exploit Exchange.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"I do not move ahead until that check is done\"",
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "darkwolf",
        "similarityScore": 100,
        "platform": "Exploit Exchange",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "darkwolf_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F002-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Exploit Exchange",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A005",
    "primaryAlias": "dark_wolf",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-13T17:00:00Z",
    "summary": "keeps older references for comparison - Active across Privacy Corner.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 10,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"keeps older references for comparison\"",
        "\"I do not move ahead until that check is done\""
      ]
    },
    "aliases": [
      {
        "alias": "dark_wolf",
        "similarityScore": 100,
        "platform": "Privacy Corner",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "dark_wolf_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F004-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Privacy Corner",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A006",
    "primaryAlias": "dw77",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-04-16T12:00:00Z",
    "summary": "occasionally follows vendor and archive discussions; published PGP fingerprint: B85752AECC22AB55C230ECCDF4C58AA8EFA1C160 - Active across Vendor Review Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"I do not move ahead until that check is done\"",
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "dw77",
        "similarityScore": 100,
        "platform": "Vendor Review Board",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "dw77_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F005-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Vendor Review Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A007",
    "primaryAlias": "cipherbyte",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-18T03:00:00Z",
    "summary": "checks source details before relying on a post; published PGP fingerprint: 443430C255C2C98EB1475BBD0E636184D62971EC - Active across Archive Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"A practical check is\"",
        "\"The useful check is\"",
        "\"checks source details before relying on a post\""
      ]
    },
    "aliases": [
      {
        "alias": "cipherbyte",
        "similarityScore": 100,
        "platform": "Archive Board",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "cipherbyte_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xa5b641574ba521ba97b3c358b112e192386981a6",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F003-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Archive Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A008",
    "primaryAlias": "cipher_byte",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Cryptocurrency Drainer & Exploit Broker",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-20T22:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: 443430C255C2C98EB1475BBD0E636184D62971EC - Active across Vendor Review Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"A practical check is\"",
        "\"prefers short factual replies when a thread gets noisy\"",
        "\"The useful check is\""
      ]
    },
    "aliases": [
      {
        "alias": "cipher_byte",
        "similarityScore": 100,
        "platform": "Vendor Review Board",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "cipher_byte_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xa5b641574ba521ba97b3c358b112e192386981a6",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F005-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Vendor Review Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A009",
    "primaryAlias": "cbyte",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-04-23T17:00:00Z",
    "summary": "checks source details before relying on a post - Active across Technical Bazaar.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"A practical check is\"",
        "\"The useful check is\"",
        "\"checks source details before relying on a post\""
      ]
    },
    "aliases": [
      {
        "alias": "cbyte",
        "similarityScore": 100,
        "platform": "Technical Bazaar",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "cbyte_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F006-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Technical Bazaar",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A010",
    "primaryAlias": "nightraven",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-25T08:00:00Z",
    "summary": "keeps older references for comparison; published PGP fingerprint: E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22 - Active across BlackMarket Forum.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"keeps older references for comparison\""
      ]
    },
    "aliases": [
      {
        "alias": "nightraven",
        "similarityScore": 100,
        "platform": "BlackMarket Forum",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "nightraven_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F001-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "BlackMarket Forum",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A011",
    "primaryAlias": "night_raven",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-28T03:00:00Z",
    "summary": "occasionally follows vendor and archive discussions; published PGP fingerprint: E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22 - Active across Privacy Corner.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 10,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "night_raven",
        "similarityScore": 100,
        "platform": "Privacy Corner",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "night_raven_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F004-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Privacy Corner",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A012",
    "primaryAlias": "nraven",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-04-30T22:00:00Z",
    "summary": "keeps older references for comparison - Active across Technical Bazaar.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"keeps older references for comparison\""
      ]
    },
    "aliases": [
      {
        "alias": "nraven",
        "similarityScore": 100,
        "platform": "Technical Bazaar",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "nraven_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F006-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Technical Bazaar",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A013",
    "primaryAlias": "ghostnode",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-05-02T13:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: CB1736253CFB15D52C641C25ADA8D8944C214DAA - Active across BlackMarket Forum.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"Short version:\"",
        "\"Quick check:\"",
        "\"prefers short factual replies when a thread gets noisy\""
      ]
    },
    "aliases": [
      {
        "alias": "ghostnode",
        "similarityScore": 100,
        "platform": "BlackMarket Forum",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "ghostnode_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
        "currency": "BTC",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F001-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "BlackMarket Forum",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A014",
    "primaryAlias": "ghost_node",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-05-05T08:00:00Z",
    "summary": "checks source details before relying on a post - Active across Vendor Review Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"Short version:\"",
        "\"Quick check:\"",
        "\"checks source details before relying on a post\""
      ]
    },
    "aliases": [
      {
        "alias": "ghost_node",
        "similarityScore": 100,
        "platform": "Vendor Review Board",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "ghost_node_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
        "currency": "BTC",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F005-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Vendor Review Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A015",
    "primaryAlias": "gnode",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-05-08T03:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: CB1736253CFB15D52C641C25ADA8D8944C214DAA - Active across Technical Bazaar.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 10,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"Short version:\"",
        "\"Quick check:\"",
        "\"prefers short factual replies when a thread gets noisy\""
      ]
    },
    "aliases": [
      {
        "alias": "gnode",
        "similarityScore": 100,
        "platform": "Technical Bazaar",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "gnode_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F006-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Technical Bazaar",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A016",
    "primaryAlias": "ironmoth",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-05-09T18:00:00Z",
    "summary": "occasionally follows vendor and archive discussions; published PGP fingerprint: 45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2 - Active across Exploit Exchange.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "ironmoth",
        "similarityScore": 100,
        "platform": "Exploit Exchange",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "ironmoth_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
        "currency": "BTC",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F002-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Exploit Exchange",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A017",
    "primaryAlias": "iron_moth",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-02T13:00:00Z",
    "summary": "keeps older references for comparison; published PGP fingerprint: 45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2 - Active across Archive Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"keeps older references for comparison\""
      ]
    },
    "aliases": [
      {
        "alias": "iron_moth",
        "similarityScore": 100,
        "platform": "Archive Board",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "iron_moth_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
        "currency": "ETH",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F003-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Archive Board",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A018",
    "primaryAlias": "imoth9",
    "status": "ACTIVE",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 98,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-20",
    "lastSeen": "2025-04-05T08:00:00Z",
    "summary": "occasionally follows vendor and archive discussions - Active across Privacy Corner.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "ADVANCED",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 11,
      "activeAlertCount": 2,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 2,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "imoth9",
        "similarityScore": 100,
        "platform": "Privacy Corner",
        "firstObserved": "2025-01-20",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "imoth9_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
        "currency": "BTC",
        "balanceEstimated": "12.4 ETH",
        "mixerHops": 3,
        "riskScore": 88
      }
    ],
    "domains": [
      {
        "domain": "F004-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Privacy Corner",
        "reputationScore": 90,
        "postCount": 8
      }
    ]
  },
  {
    "id": "ACT-A019",
    "primaryAlias": "markethelper",
    "status": "MONITORED",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 75,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-05T19:00:00Z",
    "summary": "checks source details before relying on a post - Active across BlackMarket Forum.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "INTERMEDIATE",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 6,
      "activeAlertCount": 1,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 1,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"checks source details before relying on a post\""
      ]
    },
    "aliases": [
      {
        "alias": "markethelper",
        "similarityScore": 100,
        "platform": "BlackMarket Forum",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "markethelper_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F001-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "BlackMarket Forum",
        "reputationScore": 90,
        "postCount": 4
      }
    ]
  },
  {
    "id": "ACT-A020",
    "primaryAlias": "redpixel",
    "status": "MONITORED",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 75,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-15",
    "lastSeen": "2025-04-07T04:00:00Z",
    "summary": "occasionally follows vendor and archive discussions - Active across Archive Board.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "INTERMEDIATE",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 6,
      "activeAlertCount": 1,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 1,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"occasionally follows vendor and archive discussions\""
      ]
    },
    "aliases": [
      {
        "alias": "redpixel",
        "similarityScore": 100,
        "platform": "Archive Board",
        "firstObserved": "2025-01-15",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "redpixel_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F003-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Archive Board",
        "reputationScore": 90,
        "postCount": 4
      }
    ]
  },
  {
    "id": "ACT-A021",
    "primaryAlias": "bluebyte",
    "status": "MONITORED",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 75,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-16",
    "lastSeen": "2025-04-08T13:00:00Z",
    "summary": "prefers short factual replies when a thread gets noisy - Active across Privacy Corner.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "INTERMEDIATE",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 6,
      "activeAlertCount": 1,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 1,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"prefers short factual replies when a thread gets noisy\""
      ]
    },
    "aliases": [
      {
        "alias": "bluebyte",
        "similarityScore": 100,
        "platform": "Privacy Corner",
        "firstObserved": "2025-01-16",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "bluebyte_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F004-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "Privacy Corner",
        "reputationScore": 90,
        "postCount": 4
      }
    ]
  },
  {
    "id": "ACT-A022",
    "primaryAlias": "quietowl",
    "status": "MONITORED",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "confidenceScore": 75,
    "threatCategory": "Underground Darknet Persona",
    "firstSeen": "2025-01-17",
    "lastSeen": "2025-04-09T22:00:00Z",
    "summary": "keeps older references for comparison - Active across BlackMarket Forum.",
    "operationalProfile": {
      "originHypothesis": "Multi-Regional Darknet Node",
      "primaryMotivation": "Financial Extortion & Asset Exfiltration",
      "sophistication": "INTERMEDIATE",
      "operationalHoursUTC": "18:00 - 02:00 UTC",
      "primaryLanguages": [
        "English",
        "Russian (Slang markers)"
      ],
      "observedTools": [
        "TornadoCash (Sim)",
        "Custom PGP Keyring",
        "EVM Exploit Kit"
      ]
    },
    "metrics": {
      "aliasCount": 2,
      "emailCount": 1,
      "walletCount": 1,
      "domainCount": 1,
      "forumCount": 2,
      "relatedEntityCount": 6,
      "activeAlertCount": 1,
      "investigationCount": 1
    },
    "riskBreakdown": {
      "aliasCorrelation": 19,
      "behavioralSimilarity": 15,
      "infrastructureLink": 18,
      "activityAnomaly": 14,
      "temporalCorrelation": 10,
      "blockchainRelationship": 18
    },
    "behavioralSignals": {
      "peakActivityHours": "18:00 - 23:00 UTC",
      "avgPostsPerDay": 1,
      "avgMessageLength": 120,
      "primaryLanguage": "English",
      "topicDistribution": [
        {
          "topic": "Exploits & Malware",
          "percentage": 50
        },
        {
          "topic": "Crypto Settlement",
          "percentage": 30
        },
        {
          "topic": "OPSEC Discussion",
          "percentage": 20
        }
      ],
      "behaviorSimilarityScore": 85
    },
    "stylometricProfile": {
      "sentenceLengthAvg": 13.5,
      "vocabularyRichness": 82,
      "punctuationPatterns": "Short concise sentences with minimal punctuation variance",
      "emojiUsageFrequency": "RARE",
      "writingRhythm": "Staccato technical imperatives with crypto-settlement focus",
      "keyLinguisticMarkers": [
        "\"keeps older references for comparison\""
      ]
    },
    "aliases": [
      {
        "alias": "quietowl",
        "similarityScore": 100,
        "platform": "BlackMarket Forum",
        "firstObserved": "2025-01-17",
        "confidenceLevel": "VERY HIGH"
      }
    ],
    "emails": [
      "quietowl_ops@proton.me"
    ],
    "wallets": [
      {
        "address": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "currency": "ETH",
        "balanceEstimated": "14.5 ETH",
        "mixerHops": 3,
        "riskScore": 92
      }
    ],
    "domains": [
      {
        "domain": "F001-market.onion",
        "type": "TOR_ONION",
        "status": "ACTIVE"
      }
    ],
    "ips": [
      {
        "ip": "198.51.100.45",
        "asn": "AS60068 (Bulletproof Net)",
        "country": "NL",
        "serviceType": "TOR_EXIT_NODE"
      }
    ],
    "forums": [
      {
        "name": "BlackMarket Forum",
        "reputationScore": 90,
        "postCount": 4
      }
    ]
  }
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  {
    "id": "acc-shadowfox",
    "name": "shadowfox",
    "label": "shadowfox",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B",
      "pgp": "3A51BFA53BEDBF12EFD852A5EA9640169DB1832B",
      "forum": "F001"
    }
  },
  {
    "id": "acc-shadow_fox",
    "name": "shadow_fox",
    "label": "shadow_fox",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "checks source details before relying on a post",
      "pgp": "",
      "forum": "F002"
    }
  },
  {
    "id": "acc-sfox77",
    "name": "sfox77",
    "label": "sfox77",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy; contact: sfox77.demo@sample.test; published PGP fingerprint: 3A51BFA53BEDBF12EFD852A5EA9640169DB1832B",
      "pgp": "3A51BFA53BEDBF12EFD852A5EA9640169DB1832B",
      "forum": "F003"
    }
  },
  {
    "id": "acc-darkwolf",
    "name": "darkwolf",
    "label": "darkwolf",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions; published PGP fingerprint: B85752AECC22AB55C230ECCDF4C58AA8EFA1C160",
      "pgp": "B85752AECC22AB55C230ECCDF4C58AA8EFA1C160",
      "forum": "F002"
    }
  },
  {
    "id": "acc-dark_wolf",
    "name": "dark_wolf",
    "label": "dark_wolf",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "keeps older references for comparison",
      "pgp": "",
      "forum": "F004"
    }
  },
  {
    "id": "acc-dw77",
    "name": "dw77",
    "label": "dw77",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions; published PGP fingerprint: B85752AECC22AB55C230ECCDF4C58AA8EFA1C160",
      "pgp": "B85752AECC22AB55C230ECCDF4C58AA8EFA1C160",
      "forum": "F005"
    }
  },
  {
    "id": "acc-cipherbyte",
    "name": "cipherbyte",
    "label": "cipherbyte",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "checks source details before relying on a post; published PGP fingerprint: 443430C255C2C98EB1475BBD0E636184D62971EC",
      "pgp": "443430C255C2C98EB1475BBD0E636184D62971EC",
      "forum": "F003"
    }
  },
  {
    "id": "acc-cipher_byte",
    "name": "cipher_byte",
    "label": "cipher_byte",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: 443430C255C2C98EB1475BBD0E636184D62971EC",
      "pgp": "443430C255C2C98EB1475BBD0E636184D62971EC",
      "forum": "F005"
    }
  },
  {
    "id": "acc-cbyte",
    "name": "cbyte",
    "label": "cbyte",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "checks source details before relying on a post",
      "pgp": "",
      "forum": "F006"
    }
  },
  {
    "id": "acc-nightraven",
    "name": "nightraven",
    "label": "nightraven",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "keeps older references for comparison; published PGP fingerprint: E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22",
      "pgp": "E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22",
      "forum": "F001"
    }
  },
  {
    "id": "acc-night_raven",
    "name": "night_raven",
    "label": "night_raven",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions; published PGP fingerprint: E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22",
      "pgp": "E2B9F1866448F3EDEDE8EF5AFC2050BC4AE77E22",
      "forum": "F004"
    }
  },
  {
    "id": "acc-nraven",
    "name": "nraven",
    "label": "nraven",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "keeps older references for comparison",
      "pgp": "",
      "forum": "F006"
    }
  },
  {
    "id": "acc-ghostnode",
    "name": "ghostnode",
    "label": "ghostnode",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: CB1736253CFB15D52C641C25ADA8D8944C214DAA",
      "pgp": "CB1736253CFB15D52C641C25ADA8D8944C214DAA",
      "forum": "F001"
    }
  },
  {
    "id": "acc-ghost_node",
    "name": "ghost_node",
    "label": "ghost_node",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "checks source details before relying on a post",
      "pgp": "",
      "forum": "F005"
    }
  },
  {
    "id": "acc-gnode",
    "name": "gnode",
    "label": "gnode",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy; published PGP fingerprint: CB1736253CFB15D52C641C25ADA8D8944C214DAA",
      "pgp": "CB1736253CFB15D52C641C25ADA8D8944C214DAA",
      "forum": "F006"
    }
  },
  {
    "id": "acc-ironmoth",
    "name": "ironmoth",
    "label": "ironmoth",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions; published PGP fingerprint: 45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2",
      "pgp": "45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2",
      "forum": "F002"
    }
  },
  {
    "id": "acc-iron_moth",
    "name": "iron_moth",
    "label": "iron_moth",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "keeps older references for comparison; published PGP fingerprint: 45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2",
      "pgp": "45A16A6F3B44A748FB74E2168E47BDE42CEE1DF2",
      "forum": "F003"
    }
  },
  {
    "id": "acc-imoth9",
    "name": "imoth9",
    "label": "imoth9",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 10,
    "size": 24,
    "color": "#06b6d4",
    "firstSeen": "2025-01-20",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions",
      "pgp": "",
      "forum": "F004"
    }
  },
  {
    "id": "acc-markethelper",
    "name": "markethelper",
    "label": "markethelper",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 6,
    "size": 18,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "checks source details before relying on a post",
      "pgp": "",
      "forum": "F001"
    }
  },
  {
    "id": "acc-redpixel",
    "name": "redpixel",
    "label": "redpixel",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 6,
    "size": 18,
    "color": "#06b6d4",
    "firstSeen": "2025-01-15",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "occasionally follows vendor and archive discussions",
      "pgp": "",
      "forum": "F003"
    }
  },
  {
    "id": "acc-bluebyte",
    "name": "bluebyte",
    "label": "bluebyte",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 6,
    "size": 18,
    "color": "#06b6d4",
    "firstSeen": "2025-01-16",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "prefers short factual replies when a thread gets noisy",
      "pgp": "",
      "forum": "F004"
    }
  },
  {
    "id": "acc-quietowl",
    "name": "quietowl",
    "label": "quietowl",
    "type": "ACTOR",
    "riskLevel": "HIGH",
    "riskScore": 78,
    "connectionsCount": 6,
    "size": 18,
    "color": "#06b6d4",
    "firstSeen": "2025-01-17",
    "lastSeen": "2026-09-04",
    "details": {
      "bio": "keeps older references for comparison",
      "pgp": "",
      "forum": "F001"
    }
  },
  {
    "id": "forum-F001",
    "name": "BlackMarket Forum",
    "label": "BlackMarket Forum",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f001"
    }
  },
  {
    "id": "forum-F002",
    "name": "Exploit Exchange",
    "label": "Exploit Exchange",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f002"
    }
  },
  {
    "id": "forum-F003",
    "name": "Archive Board",
    "label": "Archive Board",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f003"
    }
  },
  {
    "id": "forum-F004",
    "name": "Privacy Corner",
    "label": "Privacy Corner",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f004"
    }
  },
  {
    "id": "forum-F005",
    "name": "Vendor Review Board",
    "label": "Vendor Review Board",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f005"
    }
  },
  {
    "id": "forum-F006",
    "name": "Technical Bazaar",
    "label": "Technical Bazaar",
    "type": "FORUM",
    "riskLevel": "HIGH",
    "riskScore": 75,
    "connectionsCount": 8,
    "size": 22,
    "color": "#a855f7",
    "details": {
      "language": "English",
      "url": "http://source.example.invalid/forum/f006"
    }
  },
  {
    "id": "wallet-0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
    "name": "0xdd31...4a17",
    "label": "0xdd31...4a17",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 42,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
      "chain": "Ethereum",
      "balance": "1842.5 ETH"
    }
  },
  {
    "id": "wallet-0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
    "name": "0xb4b3...5d88",
    "label": "0xb4b3...5d88",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 31,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
      "chain": "Ethereum",
      "balance": "921.75 ETH"
    }
  },
  {
    "id": "wallet-0xa5b641574ba521ba97b3c358b112e192386981a6",
    "name": "0xa5b6...81a6",
    "label": "0xa5b6...81a6",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 28,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0xa5b641574ba521ba97b3c358b112e192386981a6",
      "chain": "Ethereum",
      "balance": "612.1 ETH"
    }
  },
  {
    "id": "wallet-0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
    "name": "0xee29...ebe7",
    "label": "0xee29...ebe7",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 17,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
      "chain": "Ethereum",
      "balance": "301.44 ETH"
    }
  },
  {
    "id": "wallet-mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
    "name": "mq3aew...USYK",
    "label": "mq3aew...USYK",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 23,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
      "chain": "Bitcoin",
      "balance": "0.842 ETH"
    }
  },
  {
    "id": "wallet-mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
    "name": "mjqzKB...gJCt",
    "label": "mjqzKB...gJCt",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 19,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
      "chain": "Bitcoin",
      "balance": "1.271 ETH"
    }
  },
  {
    "id": "wallet-0x7c1f5e9c2a4d6b8e0f112233445566778899aabb",
    "name": "0x7c1f...aabb",
    "label": "0x7c1f...aabb",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 9,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0x7c1f5e9c2a4d6b8e0f112233445566778899aabb",
      "chain": "Ethereum",
      "balance": "75.0 ETH"
    }
  },
  {
    "id": "wallet-0x91ab23cd45ef67890123456789abcdef01234567",
    "name": "0x91ab...4567",
    "label": "0x91ab...4567",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 7,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "0x91ab23cd45ef67890123456789abcdef01234567",
      "chain": "Ethereum",
      "balance": "44.0 ETH"
    }
  },
  {
    "id": "wallet-myeYfYtCUexQeMYAREjgRkAxXE5fbXFGwt",
    "name": "myeYfY...FGwt",
    "label": "myeYfY...FGwt",
    "type": "WALLET",
    "riskLevel": "CRITICAL",
    "riskScore": 90,
    "connectionsCount": 6,
    "size": 16,
    "color": "#f59e0b",
    "details": {
      "fullAddress": "myeYfYtCUexQeMYAREjgRkAxXE5fbXFGwt",
      "chain": "Bitcoin",
      "balance": "0.155 ETH"
    }
  }
];

export const INITIAL_GRAPH_LINKS: GraphLink[] = [
  {
    "id": "link-acc-shadowfox-forum-F001",
    "source": "acc-shadowfox",
    "target": "forum-F001",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F001",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-shadow_fox-forum-F002",
    "source": "acc-shadow_fox",
    "target": "forum-F002",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F002",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-sfox77-forum-F003",
    "source": "acc-sfox77",
    "target": "forum-F003",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F003",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-darkwolf-forum-F002",
    "source": "acc-darkwolf",
    "target": "forum-F002",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F002",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-dark_wolf-forum-F004",
    "source": "acc-dark_wolf",
    "target": "forum-F004",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F004",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-dw77-forum-F005",
    "source": "acc-dw77",
    "target": "forum-F005",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F005",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-cipherbyte-forum-F003",
    "source": "acc-cipherbyte",
    "target": "forum-F003",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F003",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-cipher_byte-forum-F005",
    "source": "acc-cipher_byte",
    "target": "forum-F005",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F005",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-cbyte-forum-F006",
    "source": "acc-cbyte",
    "target": "forum-F006",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F006",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-nightraven-forum-F001",
    "source": "acc-nightraven",
    "target": "forum-F001",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F001",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-night_raven-forum-F004",
    "source": "acc-night_raven",
    "target": "forum-F004",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F004",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-nraven-forum-F006",
    "source": "acc-nraven",
    "target": "forum-F006",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F006",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-ghostnode-forum-F001",
    "source": "acc-ghostnode",
    "target": "forum-F001",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F001",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-ghost_node-forum-F005",
    "source": "acc-ghost_node",
    "target": "forum-F005",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F005",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-gnode-forum-F006",
    "source": "acc-gnode",
    "target": "forum-F006",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F006",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-ironmoth-forum-F002",
    "source": "acc-ironmoth",
    "target": "forum-F002",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F002",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-iron_moth-forum-F003",
    "source": "acc-iron_moth",
    "target": "forum-F003",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F003",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-imoth9-forum-F004",
    "source": "acc-imoth9",
    "target": "forum-F004",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F004",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-markethelper-forum-F001",
    "source": "acc-markethelper",
    "target": "forum-F001",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F001",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-redpixel-forum-F003",
    "source": "acc-redpixel",
    "target": "forum-F003",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F003",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-bluebyte-forum-F004",
    "source": "acc-bluebyte",
    "target": "forum-F004",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F004",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-quietowl-forum-F001",
    "source": "acc-quietowl",
    "target": "forum-F001",
    "relationship": "POSTED_ON",
    "confidence": 100,
    "isAnimated": false,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 10,
      "totalConfidence": 100,
      "evidenceItems": [
        {
          "title": "Registered Account Profile",
          "description": "Verified membership on F001",
          "confidenceContribution": 100
        }
      ]
    }
  },
  {
    "id": "link-acc-shadowfox-wallet-0xdd31ff",
    "source": "acc-shadowfox",
    "target": "wallet-0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-shadow_fox-wallet-0xdd31ff",
    "source": "acc-shadow_fox",
    "target": "wallet-0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-darkwolf-wallet-0xb4b3d2",
    "source": "acc-darkwolf",
    "target": "wallet-0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-dw77-wallet-0xb4b3d2",
    "source": "acc-dw77",
    "target": "wallet-0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-cipherbyte-wallet-0xa5b641",
    "source": "acc-cipherbyte",
    "target": "wallet-0xa5b641574ba521ba97b3c358b112e192386981a6",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xa5b641574ba521ba97b3c358b112e192386981a6 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-cipher_byte-wallet-0xa5b641",
    "source": "acc-cipher_byte",
    "target": "wallet-0xa5b641574ba521ba97b3c358b112e192386981a6",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xa5b641574ba521ba97b3c358b112e192386981a6 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-cbyte-wallet-0xdd31ff",
    "source": "acc-cbyte",
    "target": "wallet-0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xdd31ffb1f533a2fabe0bb4223175bbd45c214a17 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-nightraven-wallet-0xee2919",
    "source": "acc-nightraven",
    "target": "wallet-0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-nraven-wallet-0xee2919",
    "source": "acc-nraven",
    "target": "wallet-0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xee29196b43aae6ee7ca2065d0b88cd9060a8ebe7 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-ghostnode-wallet-mq3aewGA",
    "source": "acc-ghostnode",
    "target": "wallet-mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-ghost_node-wallet-mq3aewGA",
    "source": "acc-ghost_node",
    "target": "wallet-mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address mq3aewGAnZBtVQKeftnSR8fLrSzUipUSYK in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-ironmoth-wallet-mjqzKBCM",
    "source": "acc-ironmoth",
    "target": "wallet-mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-iron_moth-wallet-0xb4b3d2",
    "source": "acc-iron_moth",
    "target": "wallet-0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address 0xb4b3d2c42b6f00cdb0ba697de87ee56b5e1e5d88 in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "link-acc-imoth9-wallet-mjqzKBCM",
    "source": "acc-imoth9",
    "target": "wallet-mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt",
    "relationship": "USES_WALLET",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 20,
      "behavioralSimilarityScore": 10,
      "infrastructureScore": 10,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Direct Wallet Broadcast",
          "description": "Published address mjqzKBCMGYTj3oRnfEkGpZddjqKmTkgJCt in forum posts",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "corr-shadowfox-shadow_fox",
    "source": "acc-shadowfox",
    "target": "acc-shadow_fox",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 98,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 98,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Shared PGP Key and identical stylometric phrasing",
          "confidenceContribution": 98
        }
      ]
    }
  },
  {
    "id": "corr-darkwolf-dw77",
    "source": "acc-darkwolf",
    "target": "acc-dw77",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 95,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 95,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Shared EVM wallet 0x127b8aa6... and linguistic markers",
          "confidenceContribution": 95
        }
      ]
    }
  },
  {
    "id": "corr-cipherbyte-cipher_byte",
    "source": "acc-cipherbyte",
    "target": "acc-cipher_byte",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 98,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 98,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Shared PGP Key and wallet 0x83e29f0e...",
          "confidenceContribution": 98
        }
      ]
    }
  },
  {
    "id": "corr-nightraven-night_raven",
    "source": "acc-nightraven",
    "target": "acc-night_raven",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 85,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 25,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 85,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Stylometric phrasing & UTC operational hours",
          "confidenceContribution": 85
        }
      ]
    }
  },
  {
    "id": "corr-ghostnode-ghost_node",
    "source": "acc-ghostnode",
    "target": "acc-ghost_node",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 98,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 35,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 98,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Shared PGP fingerprint and wallet 0xecb2ca46...",
          "confidenceContribution": 98
        }
      ]
    }
  },
  {
    "id": "corr-ironmoth-iron_moth",
    "source": "acc-ironmoth",
    "target": "acc-iron_moth",
    "relationship": "POTENTIAL_CORRELATION",
    "confidence": 85,
    "isAnimated": true,
    "evidence": {
      "sharedIdentifierScore": 25,
      "temporalOverlapScore": 20,
      "aliasSimilarityScore": 24,
      "behavioralSimilarityScore": 15,
      "infrastructureScore": 12,
      "totalConfidence": 85,
      "evidenceItems": [
        {
          "title": "Multi-Signal Correlation",
          "description": "Stylometric match & cross-forum presence",
          "confidenceContribution": 85
        }
      ]
    }
  }
];

export const INVESTIGATIONS: Investigation[] = [
  {
    "id": "INV-1027",
    "title": "Operation Shadow Fox: Multi-Forum Threat Syndicate Attribution",
    "targetActorId": "ACT-AP001",
    "targetActorName": "shadowfox",
    "status": "ACTIVE",
    "riskLevel": "CRITICAL",
    "confidenceScore": 98,
    "leadAnalyst": "Agent K. Raman (NTRO Threat Command)",
    "createdDate": "2026-09-01",
    "lastUpdated": "2026-09-04",
    "relatedEntitiesCount": 18,
    "alertsCount": 4,
    "summary": "Tracking coordinated darknet activities across Dread and Exploit.in correlated with identity shadow_fox with 98% multi-signal confidence.",
    "keyFindings": [
      "Verified identical 4096-bit PGP fingerprint across Dread and Exploit.in.",
      "Linked wallet 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a with multiple on-chain transfers.",
      "Concordant stylometric phrasing (\"prefers short factual replies when a thread gets noisy\")."
    ],
    "entities": [
      {
        "id": "acc-shadowfox",
        "name": "shadowfox",
        "type": "ACTOR",
        "risk": "CRITICAL"
      },
      {
        "id": "acc-shadow_fox",
        "name": "shadow_fox",
        "type": "ACTOR",
        "risk": "CRITICAL"
      },
      {
        "id": "wallet-0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a",
        "name": "0xdd31...f96a",
        "type": "WALLET",
        "risk": "CRITICAL"
      }
    ],
    "timeline": [
      {
        "id": "tl-1",
        "timestamp": "2026-09-04 10:15 UTC",
        "title": "On-Chain Transfer Correlated",
        "description": "5.45 ETH transfer identified originating from complaint #8942.",
        "severity": "CRITICAL",
        "entityInvolved": "0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a"
      },
      {
        "id": "tl-2",
        "timestamp": "2026-09-03 14:30 UTC",
        "title": "PGP Key Fingerprint Match (98%)",
        "description": "PGP key signature match confirmed between shadowfox and shadow_fox.",
        "severity": "HIGH",
        "entityInvolved": "shadowfox"
      }
    ],
    "evidenceList": [
      {
        "id": "ev-1",
        "title": "Cryptographic PGP Key Matching",
        "category": "Identity Signal",
        "confidence": 98,
        "description": "Identical 4096-bit RSA sub-key fingerprint.",
        "verifiedBy": "NTRO Crypto Team"
      },
      {
        "id": "ev-2",
        "title": "Blockchain Transaction Graph Analysis",
        "category": "Financial Signal",
        "confidence": 95,
        "description": "Direct on-chain deposit trace from victim wallet.",
        "verifiedBy": "Blockchain Forensics Desk"
      },
      {
        "id": "ev-3",
        "title": "Stylometric Linguistic Match",
        "category": "Behavioral Signal",
        "confidence": 92,
        "description": "Matching sentence rhythm and punctuation entropy.",
        "verifiedBy": "AI Stylometrics Engine"
      }
    ],
    "analystNotes": [
      {
        "id": "note-1",
        "author": "Agent K. Raman",
        "date": "2026-09-04",
        "content": "Correlation between shadowfox and shadow_fox is verified beyond reasonable analytical doubt (98%). Recommending emergency asset freeze."
      }
    ]
  },
  {
    "id": "INV-1028",
    "title": "Operation Dark Wolf: Exploit Brokerage & Access Trafficking",
    "targetActorId": "ACT-AP003",
    "targetActorName": "darkwolf",
    "status": "ACTIVE",
    "riskLevel": "CRITICAL",
    "confidenceScore": 95,
    "leadAnalyst": "Analyst S. Verma (NTRO Infrastructure Unit)",
    "createdDate": "2026-09-02",
    "lastUpdated": "2026-09-04",
    "relatedEntitiesCount": 14,
    "alertsCount": 3,
    "summary": "Correlating darkwolf on Exploit.in and dw77 on BreachForums with 95% multi-signal confidence.",
    "keyFindings": [
      "Shared EVM wallet 0x127b8aa6fceef1265f24f5a34f8263158c543fbe across forum sales.",
      "Linguistic phrase overlap (\"checks source details before relying on a post\")."
    ],
    "entities": [
      {
        "id": "acc-darkwolf",
        "name": "darkwolf",
        "type": "ACTOR",
        "risk": "CRITICAL"
      },
      {
        "id": "acc-dw77",
        "name": "dw77",
        "type": "ACTOR",
        "risk": "CRITICAL"
      }
    ],
    "timeline": [
      {
        "id": "tl-101",
        "timestamp": "2026-09-04 09:00 UTC",
        "title": "Exploit Post Match",
        "description": "Exploit proof verified on BreachForums matching Exploit.in thread.",
        "severity": "CRITICAL",
        "entityInvolved": "darkwolf"
      }
    ],
    "evidenceList": [
      {
        "id": "ev-101",
        "title": "Wallet Address Match",
        "category": "Financial Signal",
        "confidence": 95,
        "description": "Identical payment address published in profile signatures.",
        "verifiedBy": "Blockchain Desk"
      }
    ],
    "analystNotes": [
      {
        "id": "note-101",
        "author": "Analyst S. Verma",
        "date": "2026-09-04",
        "content": "dw77 is shorthand handle for darkwolf."
      }
    ]
  }
];

export const THREAT_ALERTS: ThreatAlert[] = [
  {
    "id": "ALT-4401",
    "title": "High-Confidence PGP & Wallet Correlation Detected (98%)",
    "type": "ALIAS_CORRELATION",
    "severity": "CRITICAL",
    "timestamp": "2026-09-04 10:15 UTC",
    "confidence": 98,
    "summary": "AI Engine correlated shadowfox (Dread) and shadow_fox (Exploit.in) via shared PGP key and EVM wallet 0xdd31ffb1...",
    "involvedActors": [
      "shadowfox",
      "shadow_fox"
    ],
    "indicatorsCount": 4,
    "status": "INVESTIGATING"
  },
  {
    "id": "ALT-4402",
    "title": "Exploit Broker Cross-Forum Correlation (95%)",
    "type": "COORDINATED_ACTIVITY",
    "severity": "CRITICAL",
    "timestamp": "2026-09-04 09:30 UTC",
    "confidence": 95,
    "summary": "Correlated darkwolf and dw77 across Exploit.in and BreachForums sharing wallet 0x127b8aa6...",
    "involvedActors": [
      "darkwolf",
      "dw77"
    ],
    "indicatorsCount": 3,
    "status": "NEW"
  },
  {
    "id": "ALT-4403",
    "title": "Infrastructure Operator Alignment (98%)",
    "type": "INFRASTRUCTURE_REUSE",
    "severity": "HIGH",
    "timestamp": "2026-09-04 08:00 UTC",
    "confidence": 98,
    "summary": "Correlated cipherbyte and cipher_byte sharing EVM wallet 0x83e29f0e...",
    "involvedActors": [
      "cipherbyte",
      "cipher_byte"
    ],
    "indicatorsCount": 3,
    "status": "REVIEWED"
  }
];

export const LIVE_FEED_EVENTS: LiveEventFeedItem[] = [
  {
    "id": "feed-1",
    "timestamp": "Just now",
    "severity": "CRITICAL",
    "headline": "High-Confidence PGP Key Correlation (98%)",
    "actorId": "ACT-AP001",
    "actorName": "shadowfox",
    "entityType": "ACTOR",
    "entityValue": "shadowfox \u2194 shadow_fox",
    "description": "Cryptographic PGP fingerprint match confirmed across Dread and Exploit.in."
  },
  {
    "id": "feed-2",
    "timestamp": "5m ago",
    "severity": "CRITICAL",
    "headline": "Exploit Broker Cross-Forum Match (95%)",
    "actorId": "ACT-AP003",
    "actorName": "darkwolf",
    "entityType": "ACTOR",
    "entityValue": "darkwolf \u2194 dw77",
    "description": "Shared wallet 0x127b8aa6... observed across Exploit.in and BreachForums."
  },
  {
    "id": "feed-3",
    "timestamp": "12m ago",
    "severity": "HIGH",
    "headline": "Infrastructure Operator Correlated (98%)",
    "actorId": "ACT-AP005",
    "actorName": "cipherbyte",
    "entityType": "WALLET",
    "entityValue": "0x83e29f0e13ebfe8f9e0cb744583161ca12657e28",
    "description": "Shared wallet and PGP key linked across forums."
  }
];

export const ANOMALY_RECORDS: AnomalyDetectionRecord[] = [
  {
    "id": "anom-1",
    "actorId": "ACT-AP001",
    "actorName": "shadowfox",
    "metric": "Cross-Forum Correlation Confidence",
    "baselineRate": 45,
    "observedRate": 98,
    "spikePercentage": 117,
    "detectionTimestamp": "2026-09-04 10:15 UTC",
    "severity": "CRITICAL",
    "description": "High-confidence PGP key and stylometric signature match with shadow_fox."
  },
  {
    "id": "anom-2",
    "actorId": "ACT-AP003",
    "actorName": "darkwolf",
    "metric": "Wallet Re-use Across Markets",
    "baselineRate": 30,
    "observedRate": 95,
    "spikePercentage": 216,
    "detectionTimestamp": "2026-09-04 09:30 UTC",
    "severity": "CRITICAL",
    "description": "Shared wallet address observed on Exploit.in and BreachForums."
  }
];

export const STYLOMETRIC_COMPARISON: StylometricComparison = {
  "actorA": "shadowfox (Dread)",
  "actorB": "shadow_fox (Exploit.in)",
  "overallSimilarity": 94,
  "metrics": [
    {
      "metricName": "Sentence Length Distribution",
      "scoreA": 13.5,
      "scoreB": 13.2,
      "similarityPct": 98
    },
    {
      "metricName": "Vocabulary Pattern Richness",
      "scoreA": 86.0,
      "scoreB": 84.5,
      "similarityPct": 96
    },
    {
      "metricName": "Punctuation & Delimiter Syntax",
      "scoreA": 92.0,
      "scoreB": 90.0,
      "similarityPct": 95
    },
    {
      "metricName": "Linguistic Phrase Signature",
      "scoreA": 95.0,
      "scoreB": 95.0,
      "similarityPct": 100
    },
    {
      "metricName": "Writing Cadence & Rhythm",
      "scoreA": 88.0,
      "scoreB": 85.0,
      "similarityPct": 92
    }
  ],
  "linguisticConclusion": "Exceptional behavioral and stylometric alignment (94%). Both forum profiles share exact phrasing (\"prefers short factual replies when a thread gets noisy\") and identical PGP public key credentials."
};

export const THREAT_ACTIVITY_HEATMAP = [
  { day: 'Mon', '00-04': 78, '04-08': 12, '08-12': 25, '12-16': 45, '16-20': 85, '20-24': 142 },
  { day: 'Tue', '00-04': 95, '04-08': 15, '08-12': 30, '12-16': 50, '16-20': 90, '20-24': 168 },
  { day: 'Wed', '00-04': 110, '04-08': 18, '08-12': 28, '12-16': 62, '16-20': 115, '20-24': 195 },
  { day: 'Thu', '00-04': 85, '04-08': 14, '08-12': 35, '12-16': 58, '16-20': 105, '20-24': 155 },
  { day: 'Fri', '00-04': 130, '04-08': 22, '08-12': 40, '12-16': 75, '16-20': 140, '20-24': 240 },
  { day: 'Sat', '00-04': 180, '04-08': 35, '08-12': 55, '12-16': 95, '16-20': 165, '20-24': 285 },
  { day: 'Sun', '00-04': 165, '04-08': 28, '08-12': 48, '12-16': 80, '16-20': 150, '20-24': 220 }
];

export const TIMELINE_24H_DATA = [
  { time: '00:00', totalEvents: 142, anomalyScore: 12, alerts: 1 },
  { time: '02:00', totalEvents: 168, anomalyScore: 18, alerts: 2 },
  { time: '04:00', totalEvents: 35, anomalyScore: 5, alerts: 0 },
  { time: '06:00', totalEvents: 18, anomalyScore: 4, alerts: 0 },
  { time: '08:00', totalEvents: 42, anomalyScore: 8, alerts: 0 },
  { time: '10:00', totalEvents: 65, anomalyScore: 14, alerts: 1 },
  { time: '12:00', totalEvents: 95, anomalyScore: 20, alerts: 1 },
  { time: '14:00', totalEvents: 110, anomalyScore: 25, alerts: 1 },
  { time: '16:00', totalEvents: 135, anomalyScore: 32, alerts: 2 },
  { time: '18:00', totalEvents: 180, anomalyScore: 45, alerts: 2 },
  { time: '20:00', totalEvents: 245, anomalyScore: 68, alerts: 4 },
  { time: '22:00', totalEvents: 395, anomalyScore: 92, alerts: 6 }
];

export const RISK_DISTRIBUTION_DATA = [
  { range: '0-29 (Low)', count: 6, color: '#10B981' },
  { range: '30-59 (Medium)', count: 8, color: '#3B82F6' },
  { range: '60-79 (High)', count: 5, color: '#F59E0B' },
  { range: '80-100 (Critical)', count: 3, color: '#EF4444' }
];

export const SOURCE_DISTRIBUTION_DATA = [
  { name: 'Dark Web Tor Forums (6)', value: 160, color: '#00F0FF' },
  { name: 'Blockchain Wallets (9)', value: 27, color: '#8B5CF6' },
  { name: 'PGP Keyrings (6)', value: 6, color: '#10B981' },
  { name: 'Multi-Signal Correlated Pairs (16)', value: 16, color: '#F59E0B' }
];
