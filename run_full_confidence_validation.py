import urllib.request
import json
import time

def test_http(name, url, method="GET", payload=None):
    try:
        data_bytes = json.dumps(payload).encode("utf-8") if payload else None
        headers = {"Content-Type": "application/json"} if payload else {}
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=3) as resp:
            body = resp.read().decode("utf-8")
            res = json.loads(body) if "application/json" in resp.headers.get("Content-Type", "") else body
            print(f"  [PASS] {name} ({url}) -> Status {resp.status}")
            return res
    except Exception as e:
        print(f"  [FAIL] {name} ({url}) -> {e}")
        raise e

def main():
    print("================================================================")
    print("UNMASK AI CONFIDENCE & SCORING SYSTEM // FULL VALIDATION SUITE")
    print("================================================================")
    
    # 1. System Health
    health = test_http("Backend Health", "http://127.0.0.1:8000/api/v1/system/health")
    assert health["status"] == "OPERATIONAL"

    
    # 2. Confidence Configuration & Weights
    config = test_http("Confidence Configuration", "http://127.0.0.1:8000/api/v1/analysis/confidence/config")
    assert "formula" in config
    assert "classificationTiers" in config
    assert config["weights"]["aliasSimilarity"] == 0.20
    assert config["weights"]["sharedIndicators"] == 0.20
    print("   -> Scoring Formula:", config["formula"])
    print("   -> Tiers Configured:", list(config["classificationTiers"].keys()))

    # 3. Investigation Analysis ANL-8942
    anl8942 = test_http("Investigation ANL-8942 Confidence", "http://127.0.0.1:8000/api/v1/analysis/ANL-8942/confidence")
    assert 85.0 <= anl8942["confidenceScore"] <= 90.0
    assert anl8942["confidenceLevel"] == "HIGH"
    assert "The available evidence indicates" in anl8942["terminology"]
    assert "does not constitute definitive proof of identity" in anl8942["disclaimer"]
    assert len(anl8942["primarySignals"]) >= 4
    assert len(anl8942["uncertainSignals"]) >= 1
    assert len(anl8942["timeline"]) >= 4
    assert len(anl8942["edges"]) >= 2
    print("   -> Score:", anl8942["confidenceScore"], "% (", anl8942["confidenceClassification"], ")")
    print("   -> Primary Signals Count:", len(anl8942["primarySignals"]))
    print("   -> Caveats Count:", len(anl8942["uncertainSignals"]))

    # 4. Investigation Analysis ANL-7731 (Ransomware Extortion)
    anl7731 = test_http("Investigation ANL-7731 Confidence", "http://127.0.0.1:8000/api/v1/analysis/ANL-7731/confidence")
    assert anl7731["confidenceScore"] >= 80.0
    print("   -> ANL-7731 Score:", anl7731["confidenceScore"], "%")

    # 5. On-Demand Dynamic Scoring Simulation
    dyn_req = {
        "analysisId": "TEST-DYNAMIC-SIM",
        "signals": {
            "aliasSimilarity": 94.0,
            "stylometricSimilarity": 88.0,
            "behavioralSimilarity": 82.0,
            "temporalCorrelation": 90.0,
            "sharedIndicators": 95.0,
            "graphRelationship": 92.0
        }
    }
    dyn_res = test_http("Dynamic Score Calculation", "http://127.0.0.1:8000/api/v1/analysis/confidence/calculate", "POST", dyn_req)
    assert dyn_res["confidenceScore"] >= 90.0
    assert dyn_res["confidenceLevel"] == "VERY HIGH"
    print("   -> Dynamic Score:", dyn_res["confidenceScore"], "% (", dyn_res["confidenceClassification"], ")")

    # 6. Report Specific Confidence
    rep_conf = test_http("Report Specific Confidence", "http://127.0.0.1:8000/api/v1/analysis/reports/UNMASK-CMP-2026-8942/confidence")
    assert rep_conf["confidenceScore"] >= 75.0
    print("   -> Report Score:", rep_conf["confidenceScore"], "%")

    # 7. Threat Actor Specific Confidence
    actor_conf = test_http("Actor Specific Confidence", "http://127.0.0.1:8000/api/v1/analysis/actors/ACT-001/confidence")
    assert actor_conf["confidenceScore"] >= 75.0
    print("   -> Actor Score:", actor_conf["confidenceScore"], "%")

    # 8. Frontend Root & Portal Access
    test_http("Vite Frontend Server", "http://127.0.0.1:5173/")

    print("\n================================================================")
    print("ALL 8 CONFIDENCE & SCORING VALIDATION CHECKS PASSED (100%)!")
    print("================================================================")

if __name__ == "__main__":
    main()
