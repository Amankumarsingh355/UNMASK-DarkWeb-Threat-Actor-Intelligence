import urllib.request
import json

def test_endpoint(name, url, payload=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8') if payload else None,
        headers={'Content-Type': 'application/json'} if payload else {}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"[PASS] {name} -> status {resp.status}, score: {data.get('confidenceScore', 'N/A')}")
        return data

def main():
    print("============================================================")
    print("TESTING UNMASK AI CONFIDENCE & SCORING BACKEND ENDPOINTS")
    print("============================================================")
    
    # 1. Config endpoint
    config = test_endpoint("Confidence Config", "http://127.0.0.1:8000/api/v1/analysis/confidence/config")
    assert "weights" in config, "Weights missing in config"
    assert "classificationTiers" in config, "Classification tiers missing"
    assert "disclaimer" in config, "Disclaimer missing"
    print("  -> Formula:", config.get("formula"))
    print("  -> Disclaimer:", config.get("disclaimer"))

    # 2. Analysis ANL-8942
    anl8942 = test_endpoint("Analysis ANL-8942", "http://127.0.0.1:8000/api/v1/analysis/ANL-8942/confidence")
    assert 87.0 <= anl8942["confidenceScore"] <= 88.0, f"Expected ~87.3, got {anl8942['confidenceScore']}"
    assert anl8942["confidenceLevel"] == "HIGH"
    assert len(anl8942["primarySignals"]) >= 4
    assert len(anl8942["timeline"]) >= 4
    print("  -> Signals:", anl8942["signals"])
    print("  -> Classification:", anl8942["confidenceClassification"])
    print("  -> Primary signals count:", len(anl8942["primarySignals"]))

    # 3. Dynamic Calculation
    calc = test_endpoint("Dynamic Calculation", "http://127.0.0.1:8000/api/v1/analysis/confidence/calculate", {
        "signals": {
            "aliasSimilarity": 92,
            "stylometricSimilarity": 86,
            "behavioralSimilarity": 81,
            "temporalCorrelation": 89,
            "sharedIndicators": 84,
            "graphRelationship": 91
        }
    })
    assert 87.0 <= calc["confidenceScore"] <= 88.0
    print("  -> Calculated Score:", calc["confidenceScore"])


    # 4. Report specific confidence
    rep = test_endpoint("Report Confidence", "http://127.0.0.1:8000/api/v1/analysis/reports/UNMASK-CMP-2026-8942/confidence")
    assert rep["confidenceScore"] >= 50
    print("  -> Report Confidence Score:", rep["confidenceScore"])

    print("\n[SUCCESS] All Confidence Backend API Endpoints validated with 100% accuracy!")

if __name__ == "__main__":
    main()
