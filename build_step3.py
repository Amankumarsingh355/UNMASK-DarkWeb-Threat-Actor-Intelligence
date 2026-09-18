# ==========================================
# 3. backend/database.py
# ==========================================
database_code = """# ============================================================
# UNMASK SQLITE DATABASE ENGINE & PERSISTENCE LAYER
# NTRO Problem Statement NTRO Cyber Threat Platform
# ============================================================

import sqlite3
import json
import os
from typing import List, Optional, Dict, Any
from backend.data.seed_data import INITIAL_COMPLAINTS, THREAT_ACTORS_SEED, GRAPH_TOPOLOGY_SEED

DB_PATH = os.path.join(os.path.dirname(__file__), "unmask_intelligence.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed: bool = False):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        incident_date TEXT,
        approximate_loss TEXT,
        narrative TEXT NOT NULL,
        suspect_alias TEXT,
        suspect_wallet TEXT,
        suspect_onion_url TEXT,
        suspect_email TEXT,
        suspect_phone TEXT,
        transaction_hash TEXT,
        evidence_files_json TEXT,
        submitted_by_json TEXT NOT NULL,
        blockchain_proof_json TEXT,
        status TEXT NOT NULL,
        submitted_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        ai_anomaly_report_json TEXT NOT NULL,
        admin_notes_json TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS threat_actors (
        id TEXT PRIMARY KEY,
        primary_alias TEXT NOT NULL,
        status TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        risk_score REAL NOT NULL,
        confidence_score REAL NOT NULL,
        category TEXT NOT NULL,
        summary TEXT,
        data_json TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS graph_nodes (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        type TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        risk_score REAL NOT NULL,
        metadata_json TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS graph_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        relationship TEXT NOT NULL,
        strength REAL NOT NULL,
        metadata_json TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        target_id TEXT,
        admin_name TEXT,
        timestamp TEXT NOT NULL,
        details_json TEXT
    )
    ''')

    conn.commit()

    # Check if seeding is required
    cursor.execute("SELECT COUNT(*) FROM complaints")
    complaints_count = cursor.fetchone()[0]

    if complaints_count == 0 or force_reseed:
        if force_reseed:
            cursor.execute("DELETE FROM complaints")
            cursor.execute("DELETE FROM threat_actors")
            cursor.execute("DELETE FROM graph_nodes")
            cursor.execute("DELETE FROM graph_links")
            cursor.execute("DELETE FROM audit_logs")

        # Seed initial complaints
        for c in INITIAL_COMPLAINTS:
            cursor.execute('''
            INSERT OR REPLACE INTO complaints (
                id, title, category, incident_date, approximate_loss, narrative,
                suspect_alias, suspect_wallet, suspect_onion_url, suspect_email, suspect_phone,
                transaction_hash, evidence_files_json, submitted_by_json, blockchain_proof_json,
                status, submitted_at, updated_at, ai_anomaly_report_json, admin_notes_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                c["id"],
                c["title"],
                c["category"],
                c.get("incidentDate"),
                c.get("approximateLoss"),
                c["narrative"],
                c.get("suspectAlias"),
                c.get("suspectWallet"),
                c.get("suspectOnionUrl"),
                c.get("suspectEmail"),
                c.get("suspectPhone"),
                c.get("transactionHash"),
                json.dumps(c.get("evidenceFiles", [])),
                json.dumps(c["submittedBy"]),
                json.dumps(c.get("blockchainProof")) if c.get("blockchainProof") else None,
                c["status"],
                c["submittedAt"],
                c["updatedAt"],
                json.dumps(c["aiAnomalyReport"]),
                json.dumps(c.get("adminNotes", []))
            ))

        # Seed Threat Actors
        for actor in THREAT_ACTORS_SEED:
            cursor.execute('''
            INSERT OR REPLACE INTO threat_actors (
                id, primary_alias, status, risk_level, risk_score, confidence_score, category, summary, data_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                actor["id"],
                actor["primaryAlias"],
                actor["status"],
                actor["riskLevel"],
                actor["riskScore"],
                actor["confidenceScore"],
                actor["category"],
                actor.get("summary", ""),
                json.dumps(actor)
            ))

        # Seed Graph Nodes
        for node in GRAPH_TOPOLOGY_SEED["nodes"]:
            cursor.execute('''
            INSERT OR REPLACE INTO graph_nodes (
                id, label, type, risk_level, risk_score, metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                node["id"],
                node["label"],
                node["type"],
                node["riskLevel"],
                node["riskScore"],
                json.dumps(node)
            ))

        # Seed Graph Links
        for link in GRAPH_TOPOLOGY_SEED["links"]:
            cursor.execute('''
            INSERT INTO graph_links (
                source, target, relationship, strength, metadata_json
            ) VALUES (?, ?, ?, ?, ?)
            ''', (
                link["source"],
                link["target"],
                link["relationship"],
                link["strength"],
                json.dumps(link)
            ))

        conn.commit()

    conn.close()

# Database Query Helper Methods
class DatabaseService:
    @staticmethod
    def complaint_from_row(row: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": row["id"],
            "title": row["title"],
            "category": row["category"],
            "incidentDate": row["incident_date"] or row["submitted_at"],
            "approximateLoss": row["approximate_loss"],
            "narrative": row["narrative"],
            "suspectAlias": row["suspect_alias"],
            "suspectWallet": row["suspect_wallet"],
            "suspectOnionUrl": row["suspect_onion_url"],
            "suspectEmail": row["suspect_email"],
            "suspectPhone": row["suspect_phone"],
            "transactionHash": row["transaction_hash"],
            "evidenceFiles": json.loads(row["evidence_files_json"]) if row["evidence_files_json"] else [],
            "submittedBy": json.loads(row["submitted_by_json"]) if row["submitted_by_json"] else {},
            "blockchainProof": json.loads(row["blockchain_proof_json"]) if row["blockchain_proof_json"] else None,
            "status": row["status"],
            "submittedAt": row["submitted_at"],
            "updatedAt": row["updated_at"],
            "aiAnomalyReport": json.loads(row["ai_anomaly_report_json"]) if row["ai_anomaly_report_json"] else {},
            "adminNotes": json.loads(row["admin_notes_json"]) if row["admin_notes_json"] else []
        }

    @staticmethod
    def get_all_complaints(status: Optional[str] = None, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM complaints WHERE 1=1"
        params = []

        if status:
            query += " AND status = ?"
            params.append(status)
        if category:
            query += " AND category = ?"
            params.append(category)
        if search:
            query += " AND (title LIKE ? OR narrative LIKE ? OR id LIKE ? OR suspect_alias LIKE ? OR suspect_wallet LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param, s_param, s_param, s_param])

        query += " ORDER BY submitted_at DESC"
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        return [DatabaseService.complaint_from_row(r) for r in rows]

    @staticmethod
    def get_complaint_by_id(complaint_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM complaints WHERE LOWER(id) = LOWER(?)", (complaint_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService.complaint_from_row(row)

    @staticmethod
    def insert_complaint(complaint_data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO complaints (
            id, title, category, incident_date, approximate_loss, narrative,
            suspect_alias, suspect_wallet, suspect_onion_url, suspect_email, suspect_phone,
            transaction_hash, evidence_files_json, submitted_by_json, blockchain_proof_json,
            status, submitted_at, updated_at, ai_anomaly_report_json, admin_notes_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            complaint_data["id"],
            complaint_data["title"],
            complaint_data["category"],
            complaint_data.get("incidentDate"),
            complaint_data.get("approximateLoss"),
            complaint_data["narrative"],
            complaint_data.get("suspectAlias"),
            complaint_data.get("suspectWallet"),
            complaint_data.get("suspectOnionUrl"),
            complaint_data.get("suspectEmail"),
            complaint_data.get("suspectPhone"),
            complaint_data.get("transactionHash"),
            json.dumps(complaint_data.get("evidenceFiles", [])),
            json.dumps(complaint_data["submittedBy"]),
            json.dumps(complaint_data.get("blockchainProof")) if complaint_data.get("blockchainProof") else None,
            complaint_data["status"],
            complaint_data["submittedAt"],
            complaint_data["updatedAt"],
            json.dumps(complaint_data["aiAnomalyReport"]),
            json.dumps(complaint_data.get("adminNotes", []))
        ))

        # Also add a complaint node to graph_nodes
        node_id = f"CMP-{complaint_data['id'].split('-')[-1]}"
        risk_level = complaint_data["aiAnomalyReport"].get("riskLevel", "MEDIUM")
        risk_score = complaint_data["aiAnomalyReport"].get("anomalyScore", 50)
        cursor.execute('''
        INSERT OR REPLACE INTO graph_nodes (id, label, type, risk_level, risk_score, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            node_id,
            f"Citizen Report #{complaint_data['id'].split('-')[-1]}",
            "COMPLAINT",
            risk_level,
            risk_score,
            json.dumps({"complaintId": complaint_data["id"], "category": complaint_data["category"]})
        ))

        # Add links if suspect wallet exists
        if complaint_data.get("suspectWallet"):
            w_id = f"W-{complaint_data['suspectWallet'][:6]}"
            cursor.execute('''
            INSERT OR REPLACE INTO graph_nodes (id, label, type, risk_level, risk_score, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                w_id,
                f"{complaint_data['suspectWallet'][:8]}... (Suspect)",
                "WALLET",
                "HIGH",
                85,
                json.dumps({"address": complaint_data["suspectWallet"]})
            ))
            cursor.execute('''
            INSERT INTO graph_links (source, target, relationship, strength, metadata_json)
            VALUES (?, ?, ?, ?, ?)
            ''', (
                node_id,
                w_id,
                "REPORTED_FUNDS_FLOW",
                0.95,
                json.dumps({"reportedAt": complaint_data["submittedAt"]})
            ))

        conn.commit()
        conn.close()
        return complaint_data

    @staticmethod
    def update_complaint_status(complaint_id: str, status: str, admin_note_text: Optional[str] = None, admin_name: str = "ANALYST_K.RAMAN") -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM complaints WHERE LOWER(id) = LOWER(?)", (complaint_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None

        complaint = DatabaseService.complaint_from_row(row)
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        complaint["status"] = status
        complaint["updatedAt"] = now_iso

        if admin_note_text:
            note = {
                "id": f"note-{int(datetime.datetime.now().timestamp() * 1000)}",
                "adminName": admin_name,
                "note": admin_note_text,
                "statusChangedTo": status,
                "timestamp": now_iso
            }
            complaint["adminNotes"] = [note] + complaint.get("adminNotes", [])

        cursor.execute('''
        UPDATE complaints
        SET status = ?, updated_at = ?, admin_notes_json = ?
        WHERE LOWER(id) = LOWER(?)
        ''', (
            complaint["status"],
            complaint["updatedAt"],
            json.dumps(complaint["adminNotes"]),
            complaint_id
        ))

        # Log to audit logs
        cursor.execute('''
        INSERT INTO audit_logs (id, action, target_id, admin_name, timestamp, details_json)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            f"AUDIT-{int(datetime.datetime.now().timestamp() * 1000)}",
            "UPDATE_STATUS",
            complaint_id,
            admin_name,
            now_iso,
            json.dumps({"status": status, "note": admin_note_text})
        ))

        conn.commit()
        conn.close()
        return complaint

    @staticmethod
    def get_all_actors() -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT data_json FROM threat_actors")
        rows = cursor.fetchall()
        conn.close()
        return [json.loads(r["data_json"]) for r in rows]

    @staticmethod
    def get_graph_topology() -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT metadata_json FROM graph_nodes")
        node_rows = cursor.fetchall()
        nodes = [json.loads(r["metadata_json"]) for r in node_rows]

        cursor.execute("SELECT source, target, relationship, strength, metadata_json FROM graph_links")
        link_rows = cursor.fetchall()
        links = []
        for r in link_rows:
            links.append({
                "source": r["source"],
                "target": r["target"],
                "relationship": r["relationship"],
                "strength": r["strength"]
            })
        conn.close()
        return {"nodes": nodes, "links": links}
"""

with open("backend/database.py", "w", encoding="utf-8") as f:
    f.write(database_code)

print("backend/database.py written.")
