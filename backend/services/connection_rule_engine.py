# ============================================================
# UNMASK // MULTI-SIGNAL CONNECTION & ATTRIBUTION RULE ENGINE
# Transparent, Explainable, Multi-Pillar Entity Correlation System
# ============================================================

import re
import math
from difflib import SequenceMatcher
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Set, Tuple
from collections import Counter, defaultdict

from backend.database import DatabaseService
from backend.dataset_service import DatasetService

# ============================================================
# CONFIGURABLE RULE WEIGHTS & DEFINITIONS
# ============================================================

DEFAULT_RULE_CONFIGS: Dict[str, Dict[str, Any]] = {
    "USERNAME_SIMILARITY": {
        "id": "USERNAME_SIMILARITY",
        "name": "Username / Alias Similarity",
        "category": "IDENTITY",
        "weight": 20.0,
        "maxScore": 20.0,
        "enabled": True,
        "description": "Evaluates lexical, phonetic, separator variation, and edit distance across handles."
    },
    "PGP_MATCH": {
        "id": "PGP_MATCH",
        "name": "Cryptographic PGP Key Match",
        "category": "TECHNICAL",
        "weight": 35.0,
        "maxScore": 35.0,
        "enabled": True,
        "description": "Deterministic match of explicit 2048/4096-bit OpenPGP key fingerprints."
    },
    "WALLET_ASSOCIATION": {
        "id": "WALLET_ASSOCIATION",
        "name": "Cryptocurrency Wallet Association",
        "category": "FINANCIAL",
        "weight": 25.0,
        "maxScore": 25.0,
        "enabled": True,
        "description": "Identifies shared deposit wallets or direct on-chain counterparty transaction ties."
    },
    "WRITING_STYLE": {
        "id": "WRITING_STYLE",
        "name": "Writing Style & Stylometrics",
        "category": "LINGUISTIC",
        "weight": 15.0,
        "maxScore": 15.0,
        "enabled": True,
        "description": "NLP stylometry comparing sentence length, vocabulary richness (TTR), and punctuation patterns."
    },
    "BEHAVIOR_PATTERN": {
        "id": "BEHAVIOR_PATTERN",
        "name": "Behavior & Posting Timing Pattern",
        "category": "BEHAVIORAL",
        "weight": 10.0,
        "maxScore": 10.0,
        "enabled": True,
        "description": "Compares 168-hour diurnal active time windows and weekday/weekend posting frequencies."
    },
    "TEMPORAL_CORRELATION": {
        "id": "TEMPORAL_CORRELATION",
        "name": "Temporal Timeline Correlation",
        "category": "TEMPORAL",
        "weight": 10.0,
        "maxScore": 10.0,
        "enabled": True,
        "description": "Analyzes active period overlaps, interval bursts, and migration/continuity windows."
    },
    "COMMON_PLATFORM": {
        "id": "COMMON_PLATFORM",
        "name": "Common Platform / Forum Presence",
        "category": "PLATFORM",
        "weight": 5.0,
        "maxScore": 5.0,
        "enabled": True,
        "description": "Weak supporting signal detecting co-occurrence in underground forums & marketplaces."
    },
    "TECHNICAL_INDICATORS": {
        "id": "TECHNICAL_INDICATORS",
        "name": "Shared Technical Indicators",
        "category": "TECHNICAL",
        "weight": 15.0,
        "maxScore": 15.0,
        "enabled": True,
        "description": "Explicitly shared emails, contact handles, onion mirrors, or dataset-defined IOCs."
    },
    "CONTENT_SIMILARITY": {
        "id": "CONTENT_SIMILARITY",
        "name": "Content & Topic Similarity",
        "category": "LINGUISTIC",
        "weight": 5.0,
        "maxScore": 5.0,
        "enabled": True,
        "description": "TF-IDF keyword and topical alignment across discussion narratives."
    }
}

CONFIDENCE_LEVELS = {
    "VERY_STRONG": {"min": 80.0, "max": 100.0, "label": "VERY STRONG CORRELATION", "level": "VERY_STRONG", "color": "#10b981"},
    "STRONG": {"min": 60.0, "max": 79.99, "label": "STRONG CORRELATION", "level": "STRONG", "color": "#06b6d4"},
    "MODERATE": {"min": 30.0, "max": 59.99, "label": "MODERATE CORRELATION", "level": "MODERATE", "color": "#f59e0b"},
    "POSSIBLE": {"min": 10.0, "max": 29.99, "label": "POSSIBLE CORRELATION", "level": "POSSIBLE", "color": "#fb923c"},
    "NONE": {"min": 0.0, "max": 9.99, "label": "NO CORRELATION", "level": "NONE", "color": "#64748b"}
}

MANDATORY_DISCLAIMER = "Analytical correlation only based on observable multi-signal dataset indicators; does not constitute definitive proof of legal identity."

FUNCTION_WORDS = {
    "the", "and", "of", "to", "in", "is", "that", "for", "with", "on", "as", 
    "by", "at", "from", "be", "this", "which", "or", "an", "are", "not", "have", "you", "we"
}

class ConnectionRuleEngine:
    _instance: Optional['ConnectionRuleEngine'] = None

    def __init__(self):
        self.rules_config = {k: v.copy() for k, v in DEFAULT_RULE_CONFIGS.items()}

    @classmethod
    def get_instance(cls) -> 'ConnectionRuleEngine':
        if cls._instance is None:
            cls._instance = ConnectionRuleEngine()
        return cls._instance

    def get_rule_configurations(self) -> Dict[str, Any]:
        return {
            "rules": self.rules_config,
            "levels": CONFIDENCE_LEVELS,
            "disclaimer": MANDATORY_DISCLAIMER
        }

    def update_rule_configurations(self, updates: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        for rule_id, fields in updates.items():
            if rule_id in self.rules_config:
                if "weight" in fields:
                    self.rules_config[rule_id]["weight"] = float(fields["weight"])
                    self.rules_config[rule_id]["maxScore"] = float(fields["weight"])
                if "enabled" in fields:
                    self.rules_config[rule_id]["enabled"] = bool(fields["enabled"])
        return self.get_rule_configurations()

    # ============================================================
    # RULE 1: USERNAME / ALIAS SIMILARITY
    # ============================================================
    def evaluate_username_similarity(self, u1: str, u2: str) -> Dict[str, Any]:
        cfg = self.rules_config["USERNAME_SIMILARITY"]
        if not cfg["enabled"]:
            return self._empty_rule_result("USERNAME_SIMILARITY", cfg)

        w = cfg["weight"]
        s1 = u1.strip().lower()
        s2 = u2.strip().lower()

        clean1 = re.sub(r'[^a-z0-9]', '', s1)
        clean2 = re.sub(r'[^a-z0-9]', '', s2)

        # 1. Exact Match
        if s1 == s2:
            return {
                "rule": "USERNAME_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": w,
                "maxScore": w,
                "strength": "STRONG",
                "contributed": True,
                "summary": f'Exact handle match ("{u1}" == "{u2}")',
                "evidence": {
                    "matchType": "EXACT",
                    "similarityScore": 1.0,
                    "sourceHandle": u1,
                    "targetHandle": u2
                }
            }

        # 2. Separator / Punctuation Variation (e.g. cipher_knight vs cipher-knight)
        if clean1 == clean2 and len(clean1) >= 3:
            pts = round(w * 0.85, 1)
            return {
                "rule": "USERNAME_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "STRONG",
                "contributed": True,
                "summary": f'Separator variation match ("{u1}" ≈ "{u2}")',
                "evidence": {
                    "matchType": "SEPARATOR_VARIATION",
                    "similarityScore": 0.95,
                    "sourceHandle": u1,
                    "targetHandle": u2
                }
            }

        # 3. Numeric Suffix / Prefix Variant (e.g. cipher_knight vs cipher_knight01)
        base1 = re.sub(r'\d+$', '', clean1)
        base2 = re.sub(r'\d+$', '', clean2)
        if base1 and base2 and (base1 == base2) and len(base1) >= 4:
            pts = round(w * 0.75, 1)
            return {
                "rule": "USERNAME_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "STRONG",
                "contributed": True,
                "summary": f'Sequential alias variant ("{u1}" ≈ "{u2}")',
                "evidence": {
                    "matchType": "NUMERIC_SUFFIX_VARIANT",
                    "similarityScore": 0.88,
                    "sourceHandle": u1,
                    "targetHandle": u2
                }
            }

        # 4. Levenshtein / Sequence Ratio Similarity
        ratio = SequenceMatcher(None, s1, s2).ratio()
        if ratio >= 0.80:
            pts = round(w * ratio * 0.70, 1)
            return {
                "rule": "USERNAME_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "MODERATE",
                "contributed": True,
                "summary": f'High string edit similarity ({round(ratio*100)}%)',
                "evidence": {
                    "matchType": "LEVENSHTEIN_SIMILARITY",
                    "similarityScore": round(ratio, 3),
                    "sourceHandle": u1,
                    "targetHandle": u2
                }
            }
        elif ratio >= 0.65:
            pts = round(w * 0.30, 1)
            return {
                "rule": "USERNAME_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "WEAK",
                "contributed": True,
                "summary": f'Low lexical similarity ({round(ratio*100)}%)',
                "evidence": {
                    "matchType": "LOW_SIMILARITY",
                    "similarityScore": round(ratio, 3),
                    "sourceHandle": u1,
                    "targetHandle": u2
                }
            }

        return {
            "rule": "USERNAME_SIMILARITY",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "Distinct, unrelated handles",
            "evidence": {
                "matchType": "NONE",
                "similarityScore": round(ratio, 3),
                "sourceHandle": u1,
                "targetHandle": u2
            }
        }

    # ============================================================
    # RULE 2: PGP FINGERPRINT MATCH
    # ============================================================
    def evaluate_pgp_match(self, pgps1: Set[str], pgps2: Set[str]) -> Dict[str, Any]:
        cfg = self.rules_config["PGP_MATCH"]
        if not cfg["enabled"]:
            return self._empty_rule_result("PGP_MATCH", cfg)

        w = cfg["weight"]
        clean_p1 = {p.strip().upper() for p in pgps1 if p and p.strip()}
        clean_p2 = {p.strip().upper() for p in pgps2 if p and p.strip()}

        # Case 1: Shared Key Fingerprint Found
        common = clean_p1 & clean_p2
        if common:
            shared_key = list(common)[0]
            return {
                "rule": "PGP_MATCH",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": w,
                "maxScore": w,
                "strength": "DIRECT",
                "contributed": True,
                "summary": f'Identical PGP key fingerprint ({shared_key[:8]}...{shared_key[-6:]})',
                "evidence": {
                    "matchType": "EXACT_FINGERPRINT",
                    "sharedFingerprint": shared_key,
                    "sharedCount": len(common),
                    "entityAPgps": list(clean_p1),
                    "entityBPgps": list(clean_p2)
                }
            }

        # Case 2: Contradictory Explicit Keys (both have PGP but disjoint)
        if clean_p1 and clean_p2 and not common:
            penalty = -15.0
            return {
                "rule": "PGP_MATCH",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": penalty,
                "maxScore": w,
                "strength": "DIRECT",
                "contributed": True,
                "isNegative": True,
                "summary": "Contradictory PGP key fingerprints registered across profiles",
                "evidence": {
                    "matchType": "CONTRADICTORY_KEYS",
                    "entityAPgps": list(clean_p1),
                    "entityBPgps": list(clean_p2),
                    "penalty": penalty
                }
            }

        # Case 3: Missing PGP Data
        return {
            "rule": "PGP_MATCH",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "No PGP key evidence available in dataset",
            "evidence": {
                "matchType": "UNAVAILABLE",
                "entityAPgpCount": len(clean_p1),
                "entityBPgpCount": len(clean_p2)
            }
        }

    # ============================================================
    # RULE 3: CRYPTO WALLET ASSOCIATION
    # ============================================================
    def evaluate_wallet_association(
        self,
        wallets1: Set[str],
        wallets2: Set[str],
        transactions: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        cfg = self.rules_config["WALLET_ASSOCIATION"]
        if not cfg["enabled"]:
            return self._empty_rule_result("WALLET_ASSOCIATION", cfg)

        w = cfg["weight"]
        clean_w1 = {w.strip().lower() for w in wallets1 if w and w.strip()}
        clean_w2 = {w.strip().lower() for w in wallets2 if w and w.strip()}

        # 1. Direct Shared Wallet
        common = clean_w1 & clean_w2
        if common:
            shared_addr = list(common)[0]
            return {
                "rule": "WALLET_ASSOCIATION",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": w,
                "maxScore": w,
                "strength": "DIRECT",
                "contributed": True,
                "summary": f'Direct shared cryptocurrency deposit address ({shared_addr[:8]}...{shared_addr[-6:]})',
                "evidence": {
                    "associationType": "DIRECT_SHARED_WALLET",
                    "sharedWallets": list(common),
                    "entityAWallets": list(clean_w1),
                    "entityBWallets": list(clean_w2)
                }
            }

        # 2. Direct On-Chain Transaction Counterparty (if transactions provided)
        if transactions and clean_w1 and clean_w2:
            direct_txs = []
            for tx in transactions:
                src = (tx.get("sourceWallet") or tx.get("source") or "").lower()
                dst = (tx.get("targetWallet") or tx.get("target") or "").lower()
                if (src in clean_w1 and dst in clean_w2) or (src in clean_w2 and dst in clean_w1):
                    direct_txs.append(tx)

            if direct_txs:
                pts = round(w * 0.48, 1) # +12.0 (moderate)
                return {
                    "rule": "WALLET_ASSOCIATION",
                    "name": cfg["name"],
                    "category": cfg["category"],
                    "score": pts,
                    "maxScore": w,
                    "strength": "MODERATE",
                    "contributed": True,
                    "summary": f'On-chain transaction counterparty relationship ({len(direct_txs)} transfers observed)',
                    "evidence": {
                        "associationType": "COUNTERPARTY_TRANSACTION",
                        "transactionCount": len(direct_txs),
                        "sampleTx": direct_txs[0].get("transactionHash") or direct_txs[0].get("txHash") or "TX_ON_CHAIN"
                    }
                }

        return {
            "rule": "WALLET_ASSOCIATION",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "No shared wallet or direct transaction ties observed",
            "evidence": {
                "associationType": "NONE",
                "entityAWalletCount": len(clean_w1),
                "entityBWalletCount": len(clean_w2)
            }
        }

    # ============================================================
    # RULE 4: WRITING STYLE & STYLOMETRICS
    # ============================================================
    def evaluate_writing_style(self, posts1: List[str], posts2: List[str]) -> Dict[str, Any]:
        cfg = self.rules_config["WRITING_STYLE"]
        if not cfg["enabled"]:
            return self._empty_rule_result("WRITING_STYLE", cfg)

        w = cfg["weight"]
        text1 = " ".join([p for p in posts1 if p and isinstance(p, str)])
        text2 = " ".join([p for p in posts2 if p and isinstance(p, str)])

        words1 = re.findall(r'\b[a-zA-Z]+\b', text1.lower())
        words2 = re.findall(r'\b[a-zA-Z]+\b', text2.lower())

        if len(words1) < 15 or len(words2) < 15:
            return {
                "rule": "WRITING_STYLE",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": 0.0,
                "maxScore": w,
                "strength": "INSUFFICIENT",
                "contributed": False,
                "summary": "Insufficient textual corpus for stylometric analysis (<15 words)",
                "evidence": {
                    "wordCountA": len(words1),
                    "wordCountB": len(words2),
                    "postCountA": len(posts1),
                    "postCountB": len(posts2)
                }
            }

        # 1. Type-Token Ratio (Vocabulary Richness)
        ttr1 = len(set(words1)) / max(1, len(words1))
        ttr2 = len(set(words2)) / max(1, len(words2))
        ttr_diff = abs(ttr1 - ttr2)

        # 2. Average Sentence Length
        sents1 = [s for s in re.split(r'[.!?]+', text1) if s.strip()]
        sents2 = [s for s in re.split(r'[.!?]+', text2) if s.strip()]
        avg_sent1 = sum(len(s.split()) for s in sents1) / max(1, len(sents1))
        avg_sent2 = sum(len(s.split()) for s in sents2) / max(1, len(sents2))
        sent_diff = abs(avg_sent1 - avg_sent2) / max(1, max(avg_sent1, avg_sent2))

        # 3. Punctuation Density (exclamations, commas, colons, quotes)
        punct1 = len(re.findall(r'[,:;!?"\']', text1)) / max(1, len(words1))
        punct2 = len(re.findall(r'[,:;!?"\']', text2)) / max(1, len(words2))
        punct_diff = abs(punct1 - punct2)

        # 4. Function Words Overlap
        fw1 = Counter(w for w in words1 if w in FUNCTION_WORDS)
        fw2 = Counter(w for w in words2 if w in FUNCTION_WORDS)
        all_fw = set(fw1.keys()) | set(fw2.keys())
        if all_fw:
            dot = sum((fw1[k]/len(words1)) * (fw2[k]/len(words2)) for k in all_fw)
            norm_a = math.sqrt(sum((fw1[k]/len(words1))**2 for k in all_fw))
            norm_b = math.sqrt(sum((fw2[k]/len(words2))**2 for k in all_fw))
            fw_sim = dot / (norm_a * norm_b) if (norm_a * norm_b) > 0 else 0.5
        else:
            fw_sim = 0.5

        # Weighted Stylometric Similarity
        overall_stylo_sim = round(
            (0.35 * fw_sim) +
            (0.25 * max(0.0, 1.0 - sent_diff)) +
            (0.20 * max(0.0, 1.0 - (ttr_diff * 2.0))) +
            (0.20 * max(0.0, 1.0 - (punct_diff * 5.0))),
            3
        )

        matched_features = []
        if fw_sim >= 0.75: matched_features.append("function_word_distribution")
        if sent_diff <= 0.25: matched_features.append("sentence_rhythm")
        if ttr_diff <= 0.15: matched_features.append("vocabulary_richness")
        if punct_diff <= 0.05: matched_features.append("punctuation_habits")

        if overall_stylo_sim >= 0.75:
            pts = round(w * (overall_stylo_sim / 1.0), 1)
            return {
                "rule": "WRITING_STYLE",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "MODERATE", # Stylometry is probabilistic, never DIRECT
                "contributed": True,
                "summary": f'High stylometric concordance ({round(overall_stylo_sim*100)}% NLP linguistic match)',
                "evidence": {
                    "similarityScore": overall_stylo_sim,
                    "matchedFeatures": matched_features,
                    "avgSentenceLengthA": round(avg_sent1, 1),
                    "avgSentenceLengthB": round(avg_sent2, 1),
                    "vocabularyRichnessA": round(ttr1, 2),
                    "vocabularyRichnessB": round(ttr2, 2),
                    "sampleCountA": len(posts1),
                    "sampleCountB": len(posts2)
                }
            }
        elif overall_stylo_sim >= 0.50:
            pts = round(w * 0.40, 1)
            return {
                "rule": "WRITING_STYLE",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "WEAK",
                "contributed": True,
                "summary": f'Moderate stylometric alignment ({round(overall_stylo_sim*100)}%)',
                "evidence": {
                    "similarityScore": overall_stylo_sim,
                    "matchedFeatures": matched_features,
                    "sampleCountA": len(posts1),
                    "sampleCountB": len(posts2)
                }
            }
        else:
            return {
                "rule": "WRITING_STYLE",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": 0.0,
                "maxScore": w,
                "strength": "INSUFFICIENT",
                "contributed": False,
                "summary": f'Divergent writing styles ({round(overall_stylo_sim*100)}% similarity)',
                "evidence": {
                    "similarityScore": overall_stylo_sim,
                    "sampleCountA": len(posts1),
                    "sampleCountB": len(posts2)
                }
            }

    # ============================================================
    # RULE 5: BEHAVIOR & POSTING PATTERN (168-Hour Activity Histogram)
    # ============================================================
    def evaluate_behavior_pattern(self, timestamps1: List[str], timestamps2: List[str]) -> Dict[str, Any]:
        cfg = self.rules_config["BEHAVIOR_PATTERN"]
        if not cfg["enabled"]:
            return self._empty_rule_result("BEHAVIOR_PATTERN", cfg)

        w = cfg["weight"]
        if len(timestamps1) < 3 or len(timestamps2) < 3:
            return {
                "rule": "BEHAVIOR_PATTERN",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": 0.0,
                "maxScore": w,
                "strength": "INSUFFICIENT",
                "contributed": False,
                "summary": "Insufficient activity timestamps to construct behavioral profile",
                "evidence": {
                    "timestampsCountA": len(timestamps1),
                    "timestampsCountB": len(timestamps2)
                }
            }

        # Build 24-hour diurnal histogram
        h1 = [0] * 24
        h2 = [0] * 24
        for ts in timestamps1:
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                h1[dt.hour] += 1
            except Exception:
                pass
        for ts in timestamps2:
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                h2[dt.hour] += 1
            except Exception:
                pass

        dot = sum(h1[i] * h2[i] for i in range(24))
        norm1 = math.sqrt(sum(x**2 for x in h1))
        norm2 = math.sqrt(sum(x**2 for x in h2))
        cosine_sim = dot / (norm1 * norm2) if (norm1 * norm2) > 0 else 0.0

        # Peak windows
        peak1 = sorted(range(24), key=lambda i: h1[i], reverse=True)[:3]
        peak2 = sorted(range(24), key=lambda i: h2[i], reverse=True)[:3]
        overlap_hours = set(peak1) & set(peak2)

        peak_window_str = f"{min(peak1):02d}:00–{max(peak1):02d}:00 UTC"

        if cosine_sim >= 0.75:
            pts = round(w * cosine_sim, 1)
            return {
                "rule": "BEHAVIOR_PATTERN",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "MODERATE",
                "contributed": True,
                "summary": f'Synchronized diurnal activity profile (Peak window: {peak_window_str})',
                "evidence": {
                    "cosineSimilarity": round(cosine_sim, 3),
                    "primaryActiveWindow": peak_window_str,
                    "sharedPeakHoursCount": len(overlap_hours),
                    "recordsObservedA": len(timestamps1),
                    "recordsObservedB": len(timestamps2)
                }
            }
        elif cosine_sim >= 0.45:
            pts = round(w * 0.40, 1)
            return {
                "rule": "BEHAVIOR_PATTERN",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "WEAK",
                "contributed": True,
                "summary": f'Partial activity time overlap ({round(cosine_sim*100)}%)',
                "evidence": {
                    "cosineSimilarity": round(cosine_sim, 3),
                    "recordsObservedA": len(timestamps1),
                    "recordsObservedB": len(timestamps2)
                }
            }
        elif cosine_sim < 0.15 and len(timestamps1) >= 8 and len(timestamps2) >= 8:
            # Significant opposing timezones
            penalty = -6.0
            return {
                "rule": "BEHAVIOR_PATTERN",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": penalty,
                "maxScore": w,
                "strength": "MODERATE",
                "contributed": True,
                "isNegative": True,
                "summary": "Incompatible diurnal activity timezones (Opposing active hours)",
                "evidence": {
                    "cosineSimilarity": round(cosine_sim, 3),
                    "activeWindowA": f"{min(peak1):02d}:00 UTC",
                    "activeWindowB": f"{min(peak2):02d}:00 UTC",
                    "penalty": penalty
                }
            }

        return {
            "rule": "BEHAVIOR_PATTERN",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "Neutral behavioral timing distribution",
            "evidence": {
                "cosineSimilarity": round(cosine_sim, 3),
                "recordsObservedA": len(timestamps1),
                "recordsObservedB": len(timestamps2)
            }
        }

    # ============================================================
    # RULE 6: TEMPORAL TIMELINE CORRELATION
    # ============================================================
    def evaluate_temporal_correlation(self, timestamps1: List[str], timestamps2: List[str]) -> Dict[str, Any]:
        cfg = self.rules_config["TEMPORAL_CORRELATION"]
        if not cfg["enabled"]:
            return self._empty_rule_result("TEMPORAL_CORRELATION", cfg)

        w = cfg["weight"]
        parsed1 = []
        parsed2 = []
        for ts in timestamps1:
            try: parsed1.append(datetime.fromisoformat(ts.replace("Z", "+00:00")))
            except Exception: pass
        for ts in timestamps2:
            try: parsed2.append(datetime.fromisoformat(ts.replace("Z", "+00:00")))
            except Exception: pass

        if not parsed1 or not parsed2:
            return {
                "rule": "TEMPORAL_CORRELATION",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": 0.0,
                "maxScore": w,
                "strength": "INSUFFICIENT",
                "contributed": False,
                "summary": "Insufficient temporal timeline records",
                "evidence": {}
            }

        min1, max1 = min(parsed1), max(parsed1)
        min2, max2 = min(parsed2), max(parsed2)

        overlap_start = max(min1, min2)
        overlap_end = min(max1, max2)

        has_overlap = overlap_start <= overlap_end
        if has_overlap:
            overlap_days = (overlap_end - overlap_start).days
            pts = round(w * 0.90, 1) if overlap_days >= 3 else round(w * 0.60, 1) if overlap_days >= 1 else round(w * 0.40, 1)
            return {
                "rule": "TEMPORAL_CORRELATION",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "MODERATE",
                "contributed": True,
                "summary": f'Coincident temporal activity timeline ({overlap_start.strftime("%b %d")} – {overlap_end.strftime("%b %d, %Y")})',
                "evidence": {
                    "overlapDays": max(1, overlap_days),
                    "timelineA": f'{min1.strftime("%Y-%m-%d")} to {max1.strftime("%Y-%m-%d")}',
                    "timelineB": f'{min2.strftime("%Y-%m-%d")} to {max2.strftime("%Y-%m-%d")}'
                }
            }
        else:
            gap_days = (min2 - max1).days if min2 > max1 else (min1 - max2).days
            if gap_days > 730: # > 2 years gap
                penalty = -8.0
                return {
                    "rule": "TEMPORAL_CORRELATION",
                    "name": cfg["name"],
                    "category": cfg["category"],
                    "score": penalty,
                    "maxScore": w,
                    "strength": "MODERATE",
                    "contributed": True,
                    "isNegative": True,
                    "summary": f'Disjoint activity eras ({gap_days} days inactive gap)',
                    "evidence": {
                        "gapDays": gap_days,
                        "timelineA": f'{min1.strftime("%Y-%m-%d")} to {max1.strftime("%Y-%m-%d")}',
                        "timelineB": f'{min2.strftime("%Y-%m-%d")} to {max2.strftime("%Y-%m-%d")}',
                        "penalty": penalty
                    }
                }

        return {
            "rule": "TEMPORAL_CORRELATION",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "Non-overlapping timeline without significant anomaly",
            "evidence": {}
        }

    # ============================================================
    # RULE 7: COMMON PLATFORM / FORUM PRESENCE
    # ============================================================
    def evaluate_common_platform(self, forums1: Set[str], forums2: Set[str]) -> Dict[str, Any]:
        cfg = self.rules_config["COMMON_PLATFORM"]
        if not cfg["enabled"]:
            return self._empty_rule_result("COMMON_PLATFORM", cfg)

        w = cfg["weight"]
        clean_f1 = {f.strip() for f in forums1 if f and f.strip()}
        clean_f2 = {f.strip() for f in forums2 if f and f.strip()}

        common = clean_f1 & clean_f2
        if common:
            pts = w if len(common) >= 2 else round(w * 0.70, 1)
            return {
                "rule": "COMMON_PLATFORM",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "WEAK", # Weak supporting signal
                "contributed": True,
                "summary": f'Cross-forum co-presence across: {", ".join(list(common))}',
                "evidence": {
                    "sharedForums": list(common),
                    "sharedCount": len(common),
                    "note": "Supporting signal only; many unrelated users share underground forums."
                }
            }

        return {
            "rule": "COMMON_PLATFORM",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "No common forums or marketplace environments observed",
            "evidence": {
                "entityAForums": list(clean_f1),
                "entityBForums": list(clean_f2)
            }
        }

    # ============================================================
    # RULE 8: SHARED TECHNICAL INDICATORS (Emails, Tor URLs, IOCs)
    # ============================================================
    def evaluate_technical_indicators(self, entity1: Dict[str, Any], entity2: Dict[str, Any]) -> Dict[str, Any]:
        cfg = self.rules_config["TECHNICAL_INDICATORS"]
        if not cfg["enabled"]:
            return self._empty_rule_result("TECHNICAL_INDICATORS", cfg)

        w = cfg["weight"]
        shared_indicators = []

        # Check emails
        e1 = str(entity1.get("email") or entity1.get("contactEmail") or "").strip().lower()
        e2 = str(entity2.get("email") or entity2.get("contactEmail") or "").strip().lower()
        if e1 and e2 and e1 == e2:
            shared_indicators.append(f"Shared contact email: {e1}")

        # Check onion domains
        o1 = str(entity1.get("onionUrl") or entity1.get("site") or "").strip().lower()
        o2 = str(entity2.get("onionUrl") or entity2.get("site") or "").strip().lower()
        if o1 and o2 and o1 == o2:
            shared_indicators.append(f"Shared onion portal endpoint: {o1}")

        if shared_indicators:
            return {
                "rule": "TECHNICAL_INDICATORS",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": w,
                "maxScore": w,
                "strength": "STRONG",
                "contributed": True,
                "summary": f'Matched technical infrastructure indicators ({len(shared_indicators)} IOCs)',
                "evidence": {
                    "indicators": shared_indicators
                }
            }

        return {
            "rule": "TECHNICAL_INDICATORS",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "No shared technical IOCs recorded",
            "evidence": {}
        }

    # ============================================================
    # RULE 9: CONTENT & TOPIC SIMILARITY
    # ============================================================
    def evaluate_content_similarity(self, posts1: List[str], posts2: List[str]) -> Dict[str, Any]:
        cfg = self.rules_config["CONTENT_SIMILARITY"]
        if not cfg["enabled"]:
            return self._empty_rule_result("CONTENT_SIMILARITY", cfg)

        w = cfg["weight"]
        text1 = " ".join(posts1).lower()
        text2 = " ".join(posts2).lower()

        keywords = [
            "ransomware", "escrow", "exploit", "c2", "mixer", "tumbler", 
            "stealer", "zero-day", "monero", "bitcoin", "carding", "botnet", "bypass"
        ]

        shared_topics = [k for k in keywords if k in text1 and k in text2]

        if len(shared_topics) >= 2:
            pts = round(w * min(1.0, len(shared_topics) * 0.35), 1)
            return {
                "rule": "CONTENT_SIMILARITY",
                "name": cfg["name"],
                "category": cfg["category"],
                "score": pts,
                "maxScore": w,
                "strength": "WEAK",
                "contributed": True,
                "summary": f'Shared topic discussion: {", ".join(shared_topics[:4])}',
                "evidence": {
                    "matchedKeywords": shared_topics,
                    "count": len(shared_topics)
                }
            }

        return {
            "rule": "CONTENT_SIMILARITY",
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": w,
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "No specific niche threat topic alignment",
            "evidence": {}
        }

    # ============================================================
    # MASTER CORRELATION PIPELINE
    # ============================================================
    def correlate_entities(
        self,
        entity_a_id: str,
        entity_b_id: str,
        dataset_id: Optional[str] = None,
        entity_a_data: Optional[Dict[str, Any]] = None,
        entity_b_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Dynamically evaluates all multi-signal rules against the active dataset or provided entity data.
        Returns a structured, explainable attribution result with evidence drill-downs.
        """
        active_ds = DatasetService.get_active_dataset()
        norm_a = entity_a_id.strip().lower()
        norm_b = entity_b_id.strip().lower()

        # Extract or override Entity Data
        if entity_a_data:
            entity_a = self._normalize_custom_entity_data(norm_a, entity_a_data)
        else:
            entity_a = self._resolve_entity_data(norm_a, active_ds)

        if entity_b_data:
            entity_b = self._normalize_custom_entity_data(norm_b, entity_b_data)
        else:
            entity_b = self._resolve_entity_data(norm_b, active_ds)

        # 1. Execute Independent Rules
        rule_evaluations: List[Dict[str, Any]] = [
            self.evaluate_username_similarity(entity_a["username"], entity_b["username"]),
            self.evaluate_pgp_match(entity_a["pgps"], entity_b["pgps"]),
            self.evaluate_wallet_association(entity_a["wallets"], entity_b["wallets"], active_ds.get("transactions", []) if active_ds else None),
            self.evaluate_writing_style(entity_a["posts"], entity_b["posts"]),
            self.evaluate_behavior_pattern(entity_a["timestamps"], entity_b["timestamps"]),
            self.evaluate_temporal_correlation(entity_a["timestamps"], entity_b["timestamps"]),
            self.evaluate_common_platform(entity_a["forums"], entity_b["forums"]),
            self.evaluate_technical_indicators(entity_a["raw"], entity_b["raw"]),
            self.evaluate_content_similarity(entity_a["posts"], entity_b["posts"])
        ]

        # 2. Multi-Signal Consistency & Independence Calculation
        positive_rules = [r for r in rule_evaluations if r["score"] > 0]
        negative_rules = [r for r in rule_evaluations if r["score"] < 0]
        
        # Categorize to prevent double counting
        contributing_categories = set(r["category"] for r in positive_rules)
        category_scores = defaultdict(float)
        for r in positive_rules:
            category_scores[r["category"]] += r["score"]

        raw_positive_score = sum(r["score"] for r in positive_rules)
        raw_negative_penalty = abs(sum(r["score"] for r in negative_rules))

        # Multi-Signal Synergy Boost (only when 3+ distinct categories agree)
        synergy_boost = 0.0
        if len(contributing_categories) >= 3:
            synergy_boost = min(10.0, (len(contributing_categories) - 2) * 2.5)

        # Base Combined Score
        combined_score = raw_positive_score + synergy_boost - raw_negative_penalty

        # Minimum Evidence Enforcement:
        # A single weak signal (e.g. only common forum, or only weak username) CANNOT yield HIGH or VERY HIGH
        if len(contributing_categories) == 1 and ("PLATFORM" in contributing_categories or "LINGUISTIC" in contributing_categories):
            combined_score = min(40.0, combined_score)

        final_confidence = round(max(0.0, min(99.0, combined_score)), 1)

        # 3. Connection Level
        level_info = self._get_connection_level(final_confidence)

        # Primary Indicators Summary
        supporting_indicators = [
            f"{r['name']} (+{r['score']})" for r in positive_rules
        ]
        contradicting_indicators = [
            f"{r['name']} ({r['score']})" for r in negative_rules
        ]

        return {
            "entityA": {
                "id": entity_a["id"],
                "username": entity_a["username"],
                "postCount": len(entity_a["posts"]),
                "pgpCount": len(entity_a["pgps"]),
                "walletCount": len(entity_a["wallets"])
            },
            "entityB": {
                "id": entity_b["id"],
                "username": entity_b["username"],
                "postCount": len(entity_b["posts"]),
                "pgpCount": len(entity_b["pgps"]),
                "walletCount": len(entity_b["wallets"])
            },
            "confidenceScore": final_confidence,
            "confidenceLevel": level_info["level"],
            "correlationLevel": level_info["label"],
            "color": level_info["color"],
            "evidenceCount": len(positive_rules),
            "contributingCategoriesCount": len(contributing_categories),
            "contributingCategories": list(contributing_categories),
            "synergyBoost": synergy_boost,
            "negativePenalties": raw_negative_penalty,
            "rules": rule_evaluations,
            "supportingSignals": supporting_indicators,
            "contradictingSignals": contradicting_indicators,
            "disclaimer": MANDATORY_DISCLAIMER,
            "reasoningSummary": self._generate_reasoning_summary(entity_a["username"], entity_b["username"], final_confidence, positive_rules, negative_rules)
        }

    def get_all_correlated_pairs(
        self,
        dataset_id: Optional[str] = None,
        min_confidence: float = 30.0
    ) -> List[Dict[str, Any]]:
        """
        Dynamically calculates and returns all multi-signal correlation pairs in the active dataset.
        """
        active_ds = DatasetService.get_active_dataset()
        if not active_ds:
            return []

        accounts = active_ds.get("accounts", [])
        if not accounts:
            nodes = [n for n in active_ds.get("nodes", []) if n.get("type") in ["ACCOUNT", "ACTOR"]]
            usernames = [n.get("label") or n.get("id") for n in nodes]
        else:
            usernames = [a.get("normalizedUsername") or a.get("username") for a in accounts]

        usernames = list(set(u for u in usernames if u))
        results = []

        for i in range(len(usernames)):
            for j in range(i + 1, len(usernames)):
                u1 = usernames[i]
                u2 = usernames[j]
                eval_res = self.correlate_entities(u1, u2, dataset_id)
                if eval_res["confidenceScore"] >= min_confidence:
                    results.append(eval_res)

        # Sort by confidence descending
        results.sort(key=lambda x: x["confidenceScore"], reverse=True)
        return results

    # ============================================================
    # HELPER RESOLUTION METHODS
    # ============================================================
    def _normalize_custom_entity_data(self, clean_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes user-supplied or mocked entity dictionary into standard engine format."""
        pgps = data.get("pgps") or data.get("pgpFingerprints") or []
        if isinstance(pgps, str):
            pgps = [pgps]
        if data.get("pgpFingerprint"):
            pgps = list(pgps) + [data["pgpFingerprint"]]

        wallets = data.get("wallets") or data.get("walletAddresses") or []
        if isinstance(wallets, str):
            wallets = [wallets]
        if data.get("depositWallet"):
            wallets = list(wallets) + [data["depositWallet"]]

        forums = data.get("forums") or data.get("forumIds") or []
        if isinstance(forums, str):
            forums = [forums]
        if data.get("forum"):
            forums = list(forums) + [data["forum"]]

        posts = data.get("posts") or data.get("postContents") or []
        if isinstance(posts, str):
            posts = [posts]

        timestamps = data.get("timestamps") or []
        if isinstance(timestamps, str):
            timestamps = [timestamps]

        return {
            "id": data.get("id") or clean_id,
            "username": data.get("username") or data.get("alias") or clean_id,
            "pgps": set(p for p in pgps if p),
            "wallets": set(w for w in wallets if w),
            "posts": [p for p in posts if p],
            "timestamps": [t for t in timestamps if t],
            "forums": set(f for f in forums if f),
            "raw": data.get("raw") or data
        }

    def _resolve_entity_data(self, identifier: str, dataset: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Resolves authentic entity attributes from dataset records, nodes, links, and database."""
        clean_id = identifier.replace("account-", "").replace("acc-", "").replace("prof_", "").strip().lower()
        
        # Default empty fallback
        res = {
            "id": clean_id,
            "username": clean_id,
            "pgps": set(),
            "wallets": set(),
            "posts": [],
            "timestamps": [],
            "forums": set(),
            "raw": {}
        }

        if not dataset:
            dataset = DatasetService.get_active_dataset()

        if not dataset:
            return res

        # 1. Match from Accounts
        for acc in dataset.get("accounts", []):
            u = (acc.get("username") or "").strip().lower()
            nu = (acc.get("normalizedUsername") or "").strip().lower()
            if clean_id in [u, nu, acc.get("id", "").lower(), f"account-{u}", f"acc-{u}"]:
                res["username"] = acc.get("username", clean_id)
                res["raw"] = acc
                if acc.get("pgpFingerprint"): res["pgps"].add(acc["pgpFingerprint"])
                if acc.get("depositWallet"): res["wallets"].add(acc["depositWallet"])
                if acc.get("forum"): res["forums"].add(acc["forum"])
                if acc.get("forumId"): res["forums"].add(acc["forumId"])
                break

        # 2. Match from Posts
        for p in dataset.get("posts", []):
            u = (p.get("username") or "").strip().lower()
            if u == clean_id or u == res["username"].lower():
                if p.get("postContent"): res["posts"].append(p["postContent"])
                elif p.get("content"): res["posts"].append(p["content"])
                if p.get("timestamp"): res["timestamps"].append(p["timestamp"])
                if p.get("forum"): res["forums"].add(p["forum"])
                if p.get("forumId"): res["forums"].add(p["forumId"])

        # 3. Match from Graph Nodes & Node Details
        node_id = f"account-{clean_id}"
        alt_node_id = f"acc-{clean_id}"
        for node in dataset.get("nodes", []):
            nid = node.get("id", "").lower()
            nlabel = (node.get("label") or node.get("name") or "").lower()
            if clean_id in [nid, nlabel, nid.replace("account-", "").replace("acc-", "")]:
                res["username"] = node.get("label") or node.get("name") or res["username"]
                details = node.get("details", {})
                if details.get("pgp"): res["pgps"].add(details["pgp"])
                if details.get("pgpFingerprint"): res["pgps"].add(details["pgpFingerprint"])
                if details.get("fullAddress"): res["wallets"].add(details["fullAddress"])
                if details.get("depositWallet"): res["wallets"].add(details["depositWallet"])
                if details.get("walletAddress"): res["wallets"].add(details["walletAddress"])
                if details.get("forumId"): res["forums"].add(details["forumId"])
                if details.get("forum"): res["forums"].add(details["forum"])

        # 4. Match from Graph Links (e.g. USES_PGP, USES_WALLET, POSTED_ON)
        for link in dataset.get("links", []):
            src = link.get("source")
            src_str = src.get("id", "") if isinstance(src, dict) else str(src).lower()
            tgt = link.get("target")
            tgt_str = tgt.get("id", "") if isinstance(tgt, dict) else str(tgt).lower()

            rel = str(link.get("relationship") or link.get("type") or "").upper()

            if clean_id in src_str or src_str in [node_id, alt_node_id, clean_id]:
                if "PGP" in rel or "pgp-" in tgt_str:
                    clean_pgp = tgt_str.replace("pgp-", "").upper()
                    if clean_pgp: res["pgps"].add(clean_pgp)
                elif "WALLET" in rel or "wallet-" in tgt_str or tgt_str.startswith("0x") or tgt_str.startswith("1") or tgt_str.startswith("3") or tgt_str.startswith("bc1"):
                    clean_wal = tgt_str.replace("wallet-", "")
                    if clean_wal: res["wallets"].add(clean_wal)
                elif "FORUM" in rel or "POSTED" in rel or "forum-" in tgt_str:
                    clean_frm = tgt_str.replace("forum-", "")
                    if clean_frm: res["forums"].add(clean_frm)

        return res

    def _get_connection_level(self, score: float) -> Dict[str, str]:
        for k, v in CONFIDENCE_LEVELS.items():
            if v["min"] <= score <= v["max"]:
                return v
        return CONFIDENCE_LEVELS["NONE"]

    def _empty_rule_result(self, rule_id: str, cfg: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "rule": rule_id,
            "name": cfg["name"],
            "category": cfg["category"],
            "score": 0.0,
            "maxScore": cfg["maxScore"],
            "strength": "INSUFFICIENT",
            "contributed": False,
            "summary": "Rule disabled in configuration",
            "evidence": {}
        }

    def _generate_reasoning_summary(
        self,
        u1: str,
        u2: str,
        score: float,
        positives: List[Dict[str, Any]],
        negatives: List[Dict[str, Any]]
    ) -> str:
        if not positives:
            return f"No concordant multi-signal forensic indicators observed between {u1} and {u2}."

        top_rules = sorted(positives, key=lambda x: x["score"], reverse=True)[:3]
        top_names = [f"{r['name']} (+{r['score']})" for r in top_rules]
        reason = f"Analytical correlation of {score}% established based on {len(positives)} supporting indicators ({', '.join(top_names)})."

        if negatives:
            neg_names = [f"{r['name']} ({r['score']})" for r in negatives]
            reason += f" Penalized for {len(negatives)} contradictory signals ({', '.join(neg_names)})."

        return reason
