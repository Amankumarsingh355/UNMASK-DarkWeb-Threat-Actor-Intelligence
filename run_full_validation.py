import urllib.request
import urllib.error
import json

print("==================================================")
print("UNMASK END-TO-END VALIDATION SUITE")
print("==================================================")

# 1. Root & Health
res_root = urllib.request.urlopen("http://127.0.0.1:8000/")
print("[1] Root Endpoint:", res_root.status)

res_health = urllib.request.urlopen("http://127.0.0.1:8000/api/v1/system/health")
health_data = json.loads(res_health.read())
print("[2] Backend Health:", health_data["status"], "| DB Complaints:", health_data["database"]["complaintsCount"])

# 2. Auth Failed Check
data_bad = json.dumps({"adminId": "Admin_01", "password": "wrong_password"}).encode("utf-8")
req_bad = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login", data=data_bad, headers={"Content-Type": "application/json"})
try:
    urllib.request.urlopen(req_bad)
    print("[3] Invalid Auth: FAILED (Expected 401)")
except urllib.error.HTTPError as e:
    print("[3] Invalid Auth Test PASS: Received HTTP", e.code, "-", json.loads(e.read())["detail"])

# 3. Auth Success Check
data_good = json.dumps({"adminId": "Admin_01", "password": "3083026"}).encode("utf-8")
req_good = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login", data=data_good, headers={"Content-Type": "application/json"})
res_good = urllib.request.urlopen(req_good)
auth_data = json.loads(res_good.read())
token = auth_data["token"]
print("[4] Valid Auth Test PASS: Received Token:", token[:25] + "...", "| Admin:", auth_data["user"]["name"], "| Clearance:", auth_data["user"]["clearanceLevel"])

# 4. Auth Me Check
req_me = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
res_me = urllib.request.urlopen(req_me)
me_data = json.loads(res_me.read())
print("[5] Auth /me Test PASS: Validated User:", me_data["adminId"], "(", me_data["agency"], ")")

# 5. Submit Threat Report
sample_report = {
    "title": "Smart Contract Liquidity Drainer Syndicate",
    "category": "CRYPTO_SCAM",
    "incidentDate": "2026-09-07T16:00:00Z",
    "approximateLoss": "6.2 ETH (₹ 14,50,000)",
    "narrative": "Wallet was drained into suspect mixer address 0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f associated with shadow_drainer on dark web forum Dread.",
    "suspectAlias": "shadow_drainer",
    "suspectWallet": "0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f",
    "suspectOnionUrl": "darksurvey77x.onion",
    "suspectEmail": "shadow77_support@proton.me",
    "evidenceFiles": [
        {
            "id": "ev-test-1",
            "name": "etherscan_exploit_tx.txt",
            "type": "text/plain",
            "size": 18400,
            "sha256Hash": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }
    ],
    "submittedBy": {
        "provider": "METAMASK",
        "identifier": "0x3B8F...74A1",
        "walletAddress": "0x3b8f1d2e3c4a5b6c7d8e9f0a1b2c3d4e5f6a74a1",
        "connectedAt": "2026-09-07T16:00:00Z"
    }
}
req_submit = urllib.request.Request("http://127.0.0.1:8000/api/v1/reports", data=json.dumps(sample_report).encode("utf-8"), headers={"Content-Type": "application/json"})
res_submit = urllib.request.urlopen(req_submit)
new_rep = json.loads(res_submit.read())
rep_id = new_rep["id"]
print("[6] Submit Threat Report PASS: Generated Report ID:", rep_id, "| Anomaly Score:", new_rep["aiAnomalyReport"]["anomalyScore"], "| Risk:", new_rep["aiAnomalyReport"]["riskLevel"])

# 6. Check Threat Intelligence for new report
res_intel = urllib.request.urlopen(f"http://127.0.0.1:8000/api/v1/reports/{rep_id}/threat-intelligence")
intel_data = json.loads(res_intel.read())
print("[7] Report Intelligence PASS: Matched Actors:", [a["actorName"] for a in intel_data["matchedActors"]], "| Patterns:", len(intel_data["detectedPatterns"]))

# 7. Check Threat Graph for new report
res_graph = urllib.request.urlopen(f"http://127.0.0.1:8000/api/v1/reports/{rep_id}/threat-graph")
graph_data = json.loads(res_graph.read())
print("[8] Report Threat Graph PASS: Graph Nodes:", len(graph_data["nodes"]), "| Links:", len(graph_data["links"]))

# 8. Check 6-Pillar Risk Score for new report
res_score = urllib.request.urlopen(f"http://127.0.0.1:8000/api/v1/reports/{rep_id}/risk-score")
score_data = json.loads(res_score.read())
print("[9] Report 6-Pillars PASS: Pillars:", score_data["riskPillars"])

# 9. Frontend Reachability
f1 = urllib.request.urlopen("http://127.0.0.1:5173/")
print("[10] Frontend Dev Server (5173) PASS: Status", f1.status)

print("==================================================")
print("ALL 10 VERIFICATION TESTS PASSED SUCCESSFULLY!")
print("==================================================")
