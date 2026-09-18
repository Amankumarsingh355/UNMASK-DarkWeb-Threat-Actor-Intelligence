# ============================================================
# UNMASK NLP STYLOMETRIC AUTHORSHIP ATTRIBUTION ENGINE
# NTRO Cyber Threat Intelligence Platform
# ============================================================

import re
import math
from typing import Dict, Any, List, Optional

DARK_WEB_SLANG = {
    "escrow_locked": 3.0,
    "instant_drop": 2.5,
    "clean_utxo": 3.0,
    "pgp_signed": 2.0,
    "root_access": 2.0,
    "vpn_dump": 2.5,
    "readme_decrypt": 3.5,
    "ransom_note": 3.0,
    "private_key": 2.0,
    "exfiltrated": 2.5,
    "kyc_update": 2.5,
    "otp_bypass": 3.0,
    "bank_apk": 3.0,
    "fullz": 3.5,
    "cvv_dump": 3.5,
    "mixer": 2.0,
    "drainer": 3.0,
    "fud": 2.0
}

ACTOR_PROFILES = [
    {
        "actorName": "shadowfox",
        "vocabularyProfile": "Technical, terse, crypto-slang heavy, clean UTXO escrow, PGP key verification",
        "avgSentenceLength": 14.2,
        "characteristicTokens": ["escrow_locked", "instant_drop", "clean_utxo", "pgp_signed", "0xdd31"],
        "baseRisk": 92
    },
    {
        "actorName": "darkwolf",
        "vocabularyProfile": "Formal extortion threats, root access dumps, binary exploit kits (.krypt)",
        "avgSentenceLength": 18.5,
        "characteristicTokens": ["readme_decrypt", "ransom_note", "private_key", "root_access", "0x127b"],
        "baseRisk": 88
    },
    {
        "actorName": "cipherbyte",
        "vocabularyProfile": "Urgent database exfiltration listings, VPN credentials, high-volume KYC records",
        "avgSentenceLength": 11.8,
        "characteristicTokens": ["vpn_dump", "fullz", "exfiltrated", "database", "0x981a"],
        "baseRisk": 84
    },
    {
        "actorName": "nightraven",
        "vocabularyProfile": "Marketplace listings, banking APK bypasses, smishing kits, fast escrow drops",
        "avgSentenceLength": 12.0,
        "characteristicTokens": ["otp_bypass", "bank_apk", "cvv_dump", "drainer", "0x632e"],
        "baseRisk": 81
    }
]

def analyze_stylometrics(text: str, candidate_aliases: Optional[List[str]] = None) -> Dict[str, Any]:
    # Clean and tokenize
    raw_tokens = re.findall(r"\w+", text.lower())
    token_count = max(1, len(raw_tokens))
    unique_tokens = set(raw_tokens)
    
    # Vocabulary richness (Type-Token Ratio adjusted for length)
    ttr = len(unique_tokens) / (token_count ** 0.5)
    vocabulary_richness = min(100.0, round(ttr * 20.0, 1))

    # Sentence segmentation
    sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
    sentence_count = max(1, len(sentences))
    avg_sentence_len = round(token_count / sentence_count, 1)

    # Punctuation entropy
    punct_count = len(re.findall(r"[-_,;:!?@#$%^&*()]", text))
    punct_entropy = min(100.0, round((punct_count / token_count) * 250, 1))

    # Crypto & Dark Web Slang Density
    slang_matches = []
    slang_score = 0.0
    for term, weight in DARK_WEB_SLANG.items():
        if term in text.lower():
            slang_matches.append(term)
            slang_score += weight

    crypto_slang_density = min(100.0, round((slang_score / (token_count ** 0.5 + 1)) * 30, 1))

    # Score against known actor profiles
    matched_profiles = []
    for profile in ACTOR_PROFILES:
        score = 0.0
        # Sentence length similarity
        len_diff = abs(avg_sentence_len - profile["avgSentenceLength"])
        score += max(0, 30.0 - len_diff * 2)

        # Keyword overlap
        matched_kw = [k for k in profile["characteristicTokens"] if k.lower() in text.lower()]
        score += len(matched_kw) * 20.0

        confidence = min(96.0, max(20.0, round(score, 1)))
        if confidence >= 40.0:
            matched_profiles.append({
                "actorName": profile["actorName"],
                "confidence": confidence,
                "characteristicVocabulary": profile["vocabularyProfile"],
                "matchedTokens": matched_kw,
                "threatRisk": profile["baseRisk"]
            })

    matched_profiles.sort(key=lambda x: x["confidence"], reverse=True)

    if matched_profiles:
        top = matched_profiles[0]
        attribution_verdict = f"High stylometric probability (+{top['confidence']}%) matching authorship signature of [{top['actorName']}]. Linguistic traits: {top['characteristicVocabulary']}."
        top_confidence = top["confidence"]
    else:
        attribution_verdict = "Text presents generic dark web vernacular; inconclusive single-actor 1:1 authorship attribution."
        top_confidence = 35.0

    snippet = text[:120] + "..." if len(text) > 120 else text

    return {
        "analyzedTextSnippet": snippet,
        "tokenCount": token_count,
        "vocabularyRichnessScore": vocabulary_richness,
        "avgSentenceLength": avg_sentence_len,
        "punctuationEntropy": punct_entropy,
        "cryptoSlangDensity": crypto_slang_density,
        "matchedProfiles": matched_profiles,
        "confidence": top_confidence,
        "attributionVerdict": attribution_verdict
    }
