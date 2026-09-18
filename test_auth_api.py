import urllib.request
import urllib.error
import json

print("1. Testing Valid Admin Login (Admin_01 / 3083026)...")
data_valid = json.dumps({"adminId": "Admin_01", "password": "3083026"}).encode("utf-8")
req1 = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login", data=data_valid, headers={"Content-Type": "application/json"})
res1 = urllib.request.urlopen(req1)
json_res = json.loads(res1.read())
print("Status:", res1.status)
print("Token:", json_res.get("token")[:25] + "...")
print("Admin Name:", json_res.get("user", {}).get("name"))
print("Clearance:", json_res.get("user", {}).get("clearanceLevel"))

print("\n2. Testing Invalid Admin Login (Admin_01 / wrong_password)...")
data_invalid = json.dumps({"adminId": "Admin_01", "password": "wrong_password"}).encode("utf-8")
req2 = urllib.request.Request("http://127.0.0.1:8000/api/v1/auth/login", data=data_invalid, headers={"Content-Type": "application/json"})
try:
    urllib.request.urlopen(req2)
    print("Error: Should have failed!")
except urllib.error.HTTPError as e:
    print("HTTP Code:", e.code)
    print("Error Message:", json.loads(e.read())["detail"])

print("\n3. Testing /api/v1/reports/UNMASK-CMP-2026-8942/threat-intelligence...")
req3 = urllib.request.Request("http://127.0.0.1:8000/api/v1/reports/UNMASK-CMP-2026-8942/threat-intelligence")
res3 = urllib.request.urlopen(req3)
print("Reports Intel:", json.dumps(json.loads(res3.read()), indent=2))
