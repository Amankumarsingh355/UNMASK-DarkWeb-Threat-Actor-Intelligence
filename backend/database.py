# ============================================================
# UNMASK SQLITE DATABASE ENGINE & PERSISTENCE LAYER
# NTRO Cyber Threat Intelligence Platform
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

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        status TEXT NOT NULL,
        uploaded_at TEXT NOT NULL,
        uploaded_by TEXT DEFAULT 'Admin_01',
        rows_count INTEGER DEFAULT 0,
        valid_rows INTEGER DEFAULT 0,
        skipped_rows INTEGER DEFAULT 0,
        accounts_count INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        forums_count INTEGER DEFAULT 0,
        wallets_count INTEGER DEFAULT 0,
        transactions_count INTEGER DEFAULT 0,
        relationships_count INTEGER DEFAULT 0,
        entities_count INTEGER DEFAULT 0,
        nodes_json TEXT,
        links_json TEXT,
        actors_json TEXT,
        posts_json TEXT,
        accounts_json TEXT,
        forums_json TEXT,
        wallets_json TEXT,
        transactions_json TEXT,
        schema_mapping_json TEXT,
        validation_summary_json TEXT,
        error_message TEXT
    )
    ''')

    # Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password_hash TEXT,
        display_name TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT NOT NULL DEFAULT 'USER',
        is_email_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_login_at TEXT
    )
    ''')

    # Auth Identities (Multiple login methods per user)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS auth_identities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_user_id TEXT NOT NULL,
        wallet_address TEXT,
        chain_id INTEGER,
        created_at TEXT NOT NULL,
        last_used_at TEXT,
        UNIQUE(provider, provider_user_id),
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
    ''')

    # Auth Events (Immutable Login & Security Audit Trail)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS auth_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        event_type TEXT NOT NULL,
        provider TEXT NOT NULL,
        success INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        ip_hash_or_safe_network_metadata TEXT,
        user_agent TEXT,
        details_json TEXT
    )
    ''')

    # Sessions Table (Secure Persistent Session Tokens)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sessions (
        session_token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        user_agent TEXT,
        ip_hash TEXT,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )
    ''')

    # MetaMask SIWE One-Time Nonces
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS metamask_nonces (
        nonce TEXT PRIMARY KEY,
        wallet_address TEXT,
        created_at REAL NOT NULL,
        expires_at REAL NOT NULL,
        is_used INTEGER DEFAULT 0
    )
    ''')

    # Dataset Invalid Row Errors (Allows processing large files without dropping entire dataset)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS dataset_errors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dataset_id TEXT NOT NULL,
        row_number INTEGER,
        sheet_name TEXT,
        field TEXT,
        error TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    # Scalable Partitioned Entities Table (Indexed lookup by dataset and entity)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS dataset_entities (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_key TEXT NOT NULL,
        label TEXT NOT NULL,
        risk_score REAL DEFAULT 50.0,
        category TEXT,
        data_json TEXT NOT NULL
    )
    ''')

    # Scalable Partitioned Relationships Table (Indexed source/target for neighborhood lookups)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS dataset_relationships (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        source TEXT NOT NULL,
        target TEXT NOT NULL,
        relationship TEXT NOT NULL,
        confidence REAL DEFAULT 80.0,
        data_json TEXT NOT NULL
    )
    ''')

    # Normalized Security Events Table (UNSW-NB15 and Network Intrusion Flow Records)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS security_events (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL,
        source_file TEXT NOT NULL,
        source_row_number INTEGER NOT NULL,
        source_ip TEXT,
        destination_ip TEXT,
        source_port INTEGER,
        destination_port INTEGER,
        protocol TEXT,
        service TEXT,
        state TEXT,
        duration REAL,
        bytes_source REAL,
        bytes_destination REAL,
        packets_source INTEGER,
        packets_destination INTEGER,
        rate REAL,
        srate REAL,
        drate REAL,
        attack_category TEXT,
        attack_label INTEGER,
        is_attack INTEGER DEFAULT 0,
        timestamp TEXT,
        raw_record TEXT,
        created_at TEXT NOT NULL
    )
    ''')

    # Ensure backward compatible columns exist if table was previously created
    cursor.execute("PRAGMA table_info(datasets)")
    existing_cols = [c[1] for c in cursor.fetchall()]
    all_new_cols = [
        ("posts_json", "TEXT"), ("accounts_json", "TEXT"), ("forums_json", "TEXT"), 
        ("wallets_json", "TEXT"), ("transactions_json", "TEXT"),
        ("file_size", "INTEGER DEFAULT 0"), ("progress_percent", "REAL DEFAULT 0.0"),
        ("total_rows", "INTEGER DEFAULT 0"), ("processed_rows", "INTEGER DEFAULT 0"),
        ("valid_rows", "INTEGER DEFAULT 0"), ("invalid_rows", "INTEGER DEFAULT 0"),
        ("entity_count", "INTEGER DEFAULT 0"), ("relationship_count", "INTEGER DEFAULT 0"),
        ("current_stage", "TEXT DEFAULT 'QUEUED'"), ("dataset_hash", "TEXT"),
        ("dataset_type", "TEXT DEFAULT 'DARK_WEB_INTELLIGENCE'"),
        ("source", "TEXT DEFAULT 'LOCAL_UPLOAD'"),
        ("source_identifier", "TEXT"),
        ("source_version", "TEXT"),
        ("created_at", "TEXT"), ("started_at", "TEXT"), ("completed_at", "TEXT"), ("updated_at", "TEXT")
    ]
    for col_name, col_type in all_new_cols:
        if col_name not in existing_cols:
            try:
                cursor.execute(f"ALTER TABLE datasets ADD COLUMN {col_name} {col_type}")
            except Exception:
                pass

    # High-Performance Indexes for Scalable Querying
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ds_status ON datasets(status, uploaded_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ds_hash ON datasets(dataset_hash)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ds_type ON datasets(dataset_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ent_ds_type ON dataset_entities(dataset_id, entity_type)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ent_ds_key ON dataset_entities(dataset_id, entity_key)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_rel_ds_src ON dataset_relationships(dataset_id, source)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_rel_ds_tgt ON dataset_relationships(dataset_id, target)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_err_ds ON dataset_errors(dataset_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sec_events_ds ON security_events(dataset_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sec_events_src_ip ON security_events(dataset_id, source_ip)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sec_events_dst_ip ON security_events(dataset_id, destination_ip)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sec_events_attack ON security_events(dataset_id, attack_category)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_sec_events_proto ON security_events(dataset_id, protocol)")

    # Seed Admin User if not present
    cursor.execute("SELECT COUNT(*) FROM users WHERE user_id = 'UNMASK-ADMIN-000001' OR email = 'k.raman.admin@ntro.gov.in'")
    admin_exists = cursor.fetchone()[0]
    if admin_exists == 0:
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        import argon2
        ph = argon2.PasswordHasher()
        admin_pw_hash = ph.hash("3083026")
        
        cursor.execute('''
        INSERT INTO users (
            user_id, email, password_hash, display_name, avatar_url, role,
            is_email_verified, is_active, created_at, updated_at, last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "UNMASK-ADMIN-000001",
            "k.raman.admin@ntro.gov.in",
            admin_pw_hash,
            "Commander K. Raman",
            "https://api.dicebear.com/7.x/bottts/svg?seed=Admin_01",
            "ADMIN",
            1,
            1,
            now_iso,
            now_iso,
            now_iso
        ))
        
        # Link identities for Admin_01
        cursor.execute('''
        INSERT OR IGNORE INTO auth_identities (
            user_id, provider, provider_user_id, created_at, last_used_at
        ) VALUES (?, ?, ?, ?, ?)
        ''', ("UNMASK-ADMIN-000001", "password", "Admin_01", now_iso, now_iso))
        
        cursor.execute('''
        INSERT OR IGNORE INTO auth_identities (
            user_id, provider, provider_user_id, created_at, last_used_at
        ) VALUES (?, ?, ?, ?, ?)
        ''', ("UNMASK-ADMIN-000001", "password", "k.raman.admin@ntro.gov.in", now_iso, now_iso))

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
        node_dict = {
            "id": node_id,
            "label": f"Citizen Report #{complaint_data['id'].split('-')[-1]}",
            "type": "COMPLAINT",
            "riskLevel": risk_level,
            "riskScore": risk_score,
            "complaintId": complaint_data["id"],
            "category": complaint_data["category"]
        }
        cursor.execute('''
        INSERT OR REPLACE INTO graph_nodes (id, label, type, risk_level, risk_score, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            node_id,
            node_dict["label"],
            node_dict["type"],
            risk_level,
            risk_score,
            json.dumps(node_dict)
        ))

        # Add links if suspect wallet exists
        if complaint_data.get("suspectWallet"):
            w_id = f"W-{complaint_data['suspectWallet'][:6]}"
            w_dict = {
                "id": w_id,
                "label": f"{complaint_data['suspectWallet'][:8]}... (Suspect)",
                "type": "WALLET",
                "riskLevel": "HIGH",
                "riskScore": 85,
                "address": complaint_data["suspectWallet"]
            }
            cursor.execute('''
            INSERT OR REPLACE INTO graph_nodes (id, label, type, risk_level, risk_score, metadata_json)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                w_id,
                w_dict["label"],
                w_dict["type"],
                "HIGH",
                85,
                json.dumps(w_dict)
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

    @staticmethod
    def create_dataset_record(dataset: Dict[str, Any]) -> str:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT OR REPLACE INTO datasets (
            id, filename, file_path, file_type, status, uploaded_at, uploaded_by,
            rows_count, valid_rows, skipped_rows, accounts_count, posts_count,
            forums_count, wallets_count, transactions_count, relationships_count,
            entities_count, nodes_json, links_json, actors_json,
            posts_json, accounts_json, forums_json, wallets_json, transactions_json,
            schema_mapping_json, validation_summary_json, error_message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            dataset["id"],
            dataset["filename"],
            dataset.get("filePath", ""),
            dataset.get("fileType", "csv"),
            dataset.get("status", "PROCESSING"),
            dataset.get("uploadedAt", ""),
            dataset.get("uploadedBy", "Admin_01"),
            dataset.get("rowsCount", 0),
            dataset.get("validRows", 0),
            dataset.get("skippedRows", 0),
            dataset.get("accountsCount", 0),
            dataset.get("postsCount", 0),
            dataset.get("forumsCount", 0),
            dataset.get("walletsCount", 0),
            dataset.get("transactionsCount", 0),
            dataset.get("relationshipsCount", 0),
            dataset.get("entitiesCount", 0),
            json.dumps(dataset.get("nodes", [])),
            json.dumps(dataset.get("links", [])),
            json.dumps(dataset.get("actors", [])),
            json.dumps(dataset.get("posts", [])),
            json.dumps(dataset.get("accounts", [])),
            json.dumps(dataset.get("forums", [])),
            json.dumps(dataset.get("wallets", [])),
            json.dumps(dataset.get("transactions", [])),
            json.dumps(dataset.get("schemaMapping", {})),
            json.dumps(dataset.get("validationSummary", {})),
            dataset.get("errorMessage", None)
        ))
        conn.commit()
        conn.close()
        return dataset["id"]

    @staticmethod
    def update_dataset_record(dataset_id: str, updates: Dict[str, Any]) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        fields = []
        values = []
        
        mapping = {
            "status": "status",
            "rowsCount": "rows_count",
            "validRows": "valid_rows",
            "skippedRows": "skipped_rows",
            "accountsCount": "accounts_count",
            "postsCount": "posts_count",
            "forumsCount": "forums_count",
            "walletsCount": "wallets_count",
            "transactionsCount": "transactions_count",
            "relationshipsCount": "relationships_count",
            "entitiesCount": "entities_count",
            "errorMessage": "error_message"
        }
        
        for k, col in mapping.items():
            if k in updates:
                fields.append(f"{col} = ?")
                values.append(updates[k])
                
        if "nodes" in updates:
            fields.append("nodes_json = ?")
            values.append(json.dumps(updates["nodes"]))
        if "links" in updates:
            fields.append("links_json = ?")
            values.append(json.dumps(updates["links"]))
        if "actors" in updates:
            fields.append("actors_json = ?")
            values.append(json.dumps(updates["actors"]))
        if "schemaMapping" in updates:
            fields.append("schema_mapping_json = ?")
            values.append(json.dumps(updates["schemaMapping"]))
        if "validationSummary" in updates:
            fields.append("validation_summary_json = ?")
            values.append(json.dumps(updates["validationSummary"]))
            
        if not fields:
            conn.close()
            return False
            
        values.append(dataset_id)
        query = f"UPDATE datasets SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(query, tuple(values))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_dataset_by_id(dataset_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_dataset(row)

    @staticmethod
    def get_active_dataset() -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE status = 'ACTIVE' ORDER BY uploaded_at DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_dataset(row)

    @staticmethod
    def get_active_dataset_id() -> Optional[str]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM datasets WHERE status = 'ACTIVE' ORDER BY uploaded_at DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return row["id"]

    @staticmethod
    def set_active_dataset(dataset_id: str) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Archive all other active datasets
        cursor.execute("UPDATE datasets SET status = 'ARCHIVED' WHERE status = 'ACTIVE'")
        # Activate target dataset
        cursor.execute("UPDATE datasets SET status = 'ACTIVE' WHERE id = ?", (dataset_id,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def activate_dataset_atomic(dataset_id: str) -> bool:
        return DatabaseService.set_active_dataset(dataset_id)

    @staticmethod
    def list_all_datasets() -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets ORDER BY uploaded_at DESC")
        rows = cursor.fetchall()
        conn.close()
        return [DatabaseService._row_to_dataset(r) for r in rows]

    @staticmethod
    def delete_dataset_record(dataset_id: str) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM datasets WHERE id = ?", (dataset_id,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def _row_to_dataset(r: sqlite3.Row) -> Dict[str, Any]:
        keys = r.keys()
        return {
            "id": r["id"],
            "datasetId": r["id"],
            "filename": r["filename"],
            "filePath": r["file_path"],
            "fileType": r["file_type"],
            "fileSize": r["file_size"] if "file_size" in keys else 0,
            "status": r["status"],
            "currentStage": r["current_stage"] if "current_stage" in keys else "READY",
            "progressPercent": r["progress_percent"] if "progress_percent" in keys else 100.0,
            "totalRows": r["total_rows"] if "total_rows" in keys else r["rows_count"],
            "processedRows": r["processed_rows"] if "processed_rows" in keys else r["rows_count"],
            "validRows": r["valid_rows"],
            "invalidRows": r["invalid_rows"] if "invalid_rows" in keys else r["skipped_rows"],
            "skippedRows": r["skipped_rows"],
            "rowsCount": r["rows_count"],
            "accountsCount": r["accounts_count"],
            "postsCount": r["posts_count"],
            "forumsCount": r["forums_count"],
            "walletsCount": r["wallets_count"],
            "transactionsCount": r["transactions_count"],
            "relationshipsCount": r["relationships_count"],
            "entitiesCount": r["entities_count"],
            "datasetHash": r["dataset_hash"] if "dataset_hash" in keys else None,
            "datasetType": r["dataset_type"] if "dataset_type" in keys else "DARK_WEB_INTELLIGENCE",
            "source": r["source"] if "source" in keys else "LOCAL_UPLOAD",
            "sourceIdentifier": r["source_identifier"] if "source_identifier" in keys else None,
            "sourceVersion": r["source_version"] if "source_version" in keys else None,
            "uploadedAt": r["uploaded_at"],
            "uploadedBy": r["uploaded_by"],
            "startedAt": r["started_at"] if "started_at" in keys else None,
            "completedAt": r["completed_at"] if "completed_at" in keys else None,
            "nodes": json.loads(r["nodes_json"]) if r["nodes_json"] else [],
            "links": json.loads(r["links_json"]) if r["links_json"] else [],
            "actors": json.loads(r["actors_json"]) if r["actors_json"] else [],
            "posts": json.loads(r["posts_json"]) if ("posts_json" in keys and r["posts_json"]) else [],
            "accounts": json.loads(r["accounts_json"]) if ("accounts_json" in keys and r["accounts_json"]) else [],
            "forums": json.loads(r["forums_json"]) if ("forums_json" in keys and r["forums_json"]) else [],
            "wallets": json.loads(r["wallets_json"]) if ("wallets_json" in keys and r["wallets_json"]) else [],
            "transactions": json.loads(r["transactions_json"]) if ("transactions_json" in keys and r["transactions_json"]) else [],
            "schemaMapping": json.loads(r["schema_mapping_json"]) if r["schema_mapping_json"] else {},
            "validationSummary": json.loads(r["validation_summary_json"]) if r["validation_summary_json"] else {},
            "errorMessage": r["error_message"]
        }

    # ============================================================
    # SCALABLE ASYNC DATASET & BATCH INGESTION METHODS
    # ============================================================

    @staticmethod
    def create_dataset_job(job_data: Dict[str, Any]) -> str:
        conn = get_db_connection()
        cursor = conn.cursor()
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        cursor.execute('''
        INSERT OR REPLACE INTO datasets (
            id, filename, file_path, file_type, file_size, status, current_stage,
            progress_percent, total_rows, processed_rows, valid_rows, invalid_rows,
            entity_count, relationship_count, dataset_hash, dataset_type, source,
            source_identifier, source_version, uploaded_at, uploaded_by,
            started_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            job_data["id"],
            job_data["filename"],
            job_data.get("filePath", ""),
            job_data.get("fileType", "csv"),
            job_data.get("fileSize", 0),
            job_data.get("status", "QUEUED"),
            job_data.get("currentStage", "QUEUED"),
            job_data.get("progressPercent", 0.0),
            job_data.get("totalRows", 0),
            0,
            0,
            0,
            0,
            0,
            job_data.get("datasetHash"),
            job_data.get("datasetType", "DARK_WEB_INTELLIGENCE"),
            job_data.get("source", "LOCAL_UPLOAD"),
            job_data.get("sourceIdentifier"),
            job_data.get("sourceVersion", "1.0.0"),
            now_iso,
            job_data.get("uploadedBy", "Admin_01"),
            now_iso,
            now_iso,
            now_iso
        ))
        conn.commit()
        conn.close()
        return job_data["id"]

    @staticmethod
    def update_dataset_progress(dataset_id: str, updates: Dict[str, Any]) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        fields = ["updated_at = ?"]
        values = [now_iso]
        
        column_map = {
            "status": "status",
            "currentStage": "current_stage",
            "progressPercent": "progress_percent",
            "totalRows": "total_rows",
            "processedRows": "processed_rows",
            "validRows": "valid_rows",
            "invalidRows": "invalid_rows",
            "rowsCount": "rows_count",
            "skippedRows": "skipped_rows",
            "entityCount": "entity_count",
            "relationshipCount": "relationship_count",
            "entitiesCount": "entities_count",
            "relationshipsCount": "relationships_count",
            "accountsCount": "accounts_count",
            "postsCount": "posts_count",
            "forumsCount": "forums_count",
            "walletsCount": "wallets_count",
            "transactionsCount": "transactions_count",
            "datasetType": "dataset_type",
            "source": "source",
            "sourceIdentifier": "source_identifier",
            "sourceVersion": "source_version",
            "errorMessage": "error_message",
            "completedAt": "completed_at",
            "startedAt": "started_at"
        }
        
        for k, col in column_map.items():
            if k in updates and updates[k] is not None:
                fields.append(f"{col} = ?")
                values.append(updates[k])

        if "nodes" in updates and updates["nodes"] is not None:
            fields.append("nodes_json = ?")
            values.append(json.dumps(updates["nodes"]))
        if "links" in updates and updates["links"] is not None:
            fields.append("links_json = ?")
            values.append(json.dumps(updates["links"]))
        if "actors" in updates and updates["actors"] is not None:
            fields.append("actors_json = ?")
            values.append(json.dumps(updates["actors"]))
        if "validationSummary" in updates and updates["validationSummary"] is not None:
            fields.append("validation_summary_json = ?")
            values.append(json.dumps(updates["validationSummary"]))
            
        values.append(dataset_id)
        query = f"UPDATE datasets SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(query, tuple(values))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def log_dataset_errors(errors: List[Dict[str, Any]]):
        if not errors:
            return
        conn = get_db_connection()
        cursor = conn.cursor()
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        rows = [
            (
                e.get("datasetId"),
                e.get("rowNumber", 0),
                e.get("sheetName", "default"),
                e.get("field", "unknown"),
                e.get("error", "validation error"),
                now_iso
            )
            for e in errors
        ]
        cursor.executemany('''
        INSERT INTO dataset_errors (dataset_id, row_number, sheet_name, field, error, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', rows)
        conn.commit()
        conn.close()

    @staticmethod
    def get_dataset_errors(dataset_id: str, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM dataset_errors WHERE dataset_id = ?", (dataset_id,))
        total_count = cursor.fetchone()[0]
        
        cursor.execute('''
        SELECT id, row_number, sheet_name, field, error, created_at
        FROM dataset_errors
        WHERE dataset_id = ?
        ORDER BY row_number ASC
        LIMIT ? OFFSET ?
        ''', (dataset_id, limit, offset))
        rows = cursor.fetchall()
        conn.close()
        
        return {
            "datasetId": dataset_id,
            "totalErrors": total_count,
            "limit": limit,
            "offset": offset,
            "errors": [
                {
                    "id": r["id"],
                    "rowNumber": r["row_number"],
                    "sheetName": r["sheet_name"],
                    "field": r["field"],
                    "error": r["error"],
                    "createdAt": r["created_at"]
                }
                for r in rows
            ]
        }

    @staticmethod
    def bulk_insert_entities(dataset_id: str, entities: List[Dict[str, Any]]):
        if not entities:
            return
        conn = get_db_connection()
        cursor = conn.cursor()
        
        rows = [
            (
                e["id"],
                dataset_id,
                e["entityType"],
                e.get("entityKey", e["id"]),
                e["label"],
                float(e.get("riskScore", 50.0)),
                e.get("category", "general"),
                json.dumps(e)
            )
            for e in entities
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO dataset_entities (id, dataset_id, entity_type, entity_key, label, risk_score, category, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', rows)
        conn.commit()
        conn.close()

    @staticmethod
    def bulk_insert_relationships(dataset_id: str, relationships: List[Dict[str, Any]]):
        if not relationships:
            return
        conn = get_db_connection()
        cursor = conn.cursor()
        
        rows = [
            (
                r["id"],
                dataset_id,
                r["source"],
                r["target"],
                r["relationship"],
                float(r.get("confidence", 80.0)),
                json.dumps(r)
            )
            for r in relationships
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO dataset_relationships (id, dataset_id, source, target, relationship, confidence, data_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', rows)
        conn.commit()
        conn.close()

    @staticmethod
    def check_duplicate_dataset_hash(dataset_hash: str) -> Optional[Dict[str, Any]]:
        if not dataset_hash:
            return None
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE dataset_hash = ? AND status IN ('READY', 'ACTIVE') ORDER BY uploaded_at DESC LIMIT 1", (dataset_hash,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return DatabaseService._row_to_dataset(row)
        return None

    @staticmethod
    def activate_dataset_atomic(target_dataset_id: str) -> bool:
        """
        Atomically sets target dataset to ACTIVE and archives any currently active dataset in one single transaction.
        """
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            # 1. Archive previously active datasets
            cursor.execute("UPDATE datasets SET status = 'ARCHIVED' WHERE status = 'ACTIVE' AND id != ?", (target_dataset_id,))
            # 2. Set target to ACTIVE
            cursor.execute("UPDATE datasets SET status = 'ACTIVE' WHERE id = ?", (target_dataset_id,))
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_paginated_graph(
        dataset_id: Optional[str] = None,
        limit: int = 100,
        cursor_offset: int = 0,
        min_risk: float = 0.0,
        entity_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Scalable paginated graph query returning only bounded nodes and links
        matching search / risk criteria without loading the entire graph into client memory.
        """
        d_id = dataset_id or DatabaseService.get_active_dataset_id() or "UNMASK-DATA-2026-001"
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query filtered nodes
        query = "SELECT data_json FROM dataset_entities WHERE dataset_id = ? AND risk_score >= ?"
        params = [d_id, min_risk]
        if entity_type and entity_type.upper() != "ALL":
            query += " AND entity_type = ?"
            params.append(entity_type.upper())
            
        query += " ORDER BY risk_score DESC LIMIT ? OFFSET ?"
        params.extend([limit, cursor_offset])
        
        cursor.execute(query, tuple(params))
        node_rows = cursor.fetchall()
        nodes = [json.loads(r["data_json"]) for r in node_rows]
        
        if not nodes:
            # Fallback to dataset record nodes if partitioned table not yet populated
            ds = DatabaseService.get_dataset_by_id(d_id)
            if ds and ds.get("nodes"):
                all_nodes = [n for n in ds["nodes"] if (n.get("riskScore", 0) >= min_risk) and (not entity_type or entity_type.upper() == "ALL" or n.get("type") == entity_type or n.get("entityType") == entity_type)]
                p_nodes = all_nodes[cursor_offset:cursor_offset+limit]
                p_node_ids = {n["id"] for n in p_nodes}
                p_links = [l for l in ds.get("links", []) if l["source"] in p_node_ids and l["target"] in p_node_ids]
                conn.close()
                return {
                    "datasetId": d_id,
                    "totalNodes": len(all_nodes),
                    "returnedNodes": len(p_nodes),
                    "returnedLinks": len(p_links),
                    "nextCursor": cursor_offset + limit if cursor_offset + limit < len(all_nodes) else None,
                    "nodes": p_nodes,
                    "links": p_links
                }

        node_ids = {n["id"] for n in nodes}
        
        # Query relationships between selected nodes
        if node_ids:
            placeholders = ",".join(["?"] * len(node_ids))
            rel_query = f'''
            SELECT data_json FROM dataset_relationships
            WHERE dataset_id = ? AND source IN ({placeholders}) AND target IN ({placeholders})
            LIMIT ?
            '''
            rel_params = [d_id] + list(node_ids) + list(node_ids) + [limit * 3]
            cursor.execute(rel_query, tuple(rel_params))
            link_rows = cursor.fetchall()
            links = [json.loads(r["data_json"]) for r in link_rows]
        else:
            links = []

        # Total count query for pagination
        count_query = "SELECT COUNT(*) FROM dataset_entities WHERE dataset_id = ? AND risk_score >= ?"
        count_params = [d_id, min_risk]
        if entity_type and entity_type.upper() != "ALL":
            count_query += " AND entity_type = ?"
            count_params.append(entity_type.upper())
        cursor.execute(count_query, tuple(count_params))
        total_nodes = cursor.fetchone()[0]
        conn.close()

        next_cursor = cursor_offset + limit if cursor_offset + limit < total_nodes else None

        return {
            "datasetId": d_id,
            "totalNodes": total_nodes,
            "returnedNodes": len(nodes),
            "returnedLinks": len(links),
            "nextCursor": next_cursor,
            "nodes": nodes,
            "links": links
        }

    @staticmethod
    def get_entity_neighborhood(dataset_id: Optional[str], entity_id: str, depth: int = 1, limit: int = 50) -> Dict[str, Any]:
        """
        On-demand neighborhood expansion for a specific clicked node.
        Returns immediate connected 1-hop / 2-hop nodes and edges.
        """
        d_id = dataset_id or DatabaseService.get_active_dataset_id() or "UNMASK-DATA-2026-001"
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 1. Fetch source entity
        cursor.execute("SELECT data_json FROM dataset_entities WHERE dataset_id = ? AND id = ?", (d_id, entity_id))
        center_row = cursor.fetchone()
        center_node = json.loads(center_row["data_json"]) if center_row else None
        
        if not center_node:
            # Fallback to dataset record
            ds = DatabaseService.get_dataset_by_id(d_id)
            if ds:
                center_node = next((n for n in ds.get("nodes", []) if n["id"] == entity_id), None)
                if center_node:
                    connected_links = [l for l in ds.get("links", []) if l["source"] == entity_id or l["target"] == entity_id][:limit]
                    connected_ids = {l["source"] for l in connected_links} | {l["target"] for l in connected_links}
                    neighbor_nodes = [n for n in ds.get("nodes", []) if n["id"] in connected_ids]
                    conn.close()
                    return {
                        "datasetId": d_id,
                        "centerNode": center_node,
                        "neighborCount": len(neighbor_nodes),
                        "nodes": neighbor_nodes,
                        "links": connected_links
                    }

        # 2. Query 1-hop relationships
        cursor.execute('''
        SELECT data_json, source, target FROM dataset_relationships
        WHERE dataset_id = ? AND (source = ? OR target = ?)
        LIMIT ?
        ''', (d_id, entity_id, entity_id, limit))
        rel_rows = cursor.fetchall()
        links = [json.loads(r["data_json"]) for r in rel_rows]
        
        neighbor_ids = set()
        for r in rel_rows:
            neighbor_ids.add(r["source"])
            neighbor_ids.add(r["target"])
        if entity_id in neighbor_ids:
            neighbor_ids.remove(entity_id)

        # 3. Fetch neighbor node records
        nodes = [center_node] if center_node else []
        if neighbor_ids:
            placeholders = ",".join(["?"] * len(neighbor_ids))
            cursor.execute(f"SELECT data_json FROM dataset_entities WHERE dataset_id = ? AND id IN ({placeholders})", tuple([d_id] + list(neighbor_ids)))
            for nr in cursor.fetchall():
                nodes.append(json.loads(nr["data_json"]))

        conn.close()
        return {
            "datasetId": d_id,
            "centerNode": center_node,
            "neighborCount": len(nodes),
            "nodes": nodes,
            "links": links
        }

    @staticmethod
    def get_actor_heatmap_aggregated(dataset_id: Optional[str], username: str) -> List[int]:
        """
        Returns exactly 168 aggregated values (24 hours x 7 days) for the actor's activity heatmap
        without sending raw post records to the frontend.
        """
        d_id = dataset_id or DatabaseService.get_active_dataset_id() or "UNMASK-DATA-2026-001"
        ds = DatabaseService.get_dataset_by_id(d_id)
        if not ds:
            return [0] * 168
            
        posts = [p for p in ds.get("posts", []) if p.get("username", "").lower() == username.lower()]
        grid = [0] * 168
        
        for p in posts:
            ts_str = p.get("timestamp", "")
            if ts_str:
                try:
                    import datetime
                    # Parse timestamp ISO
                    dt = datetime.datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
                    day_idx = dt.weekday() # 0 = Monday, 6 = Sunday
                    hour_idx = dt.hour     # 0 to 23
                    cell_idx = (day_idx * 24) + hour_idx
                    if 0 <= cell_idx < 168:
                        grid[cell_idx] += 1
                except Exception:
                    pass
                    
        # If no raw timestamps or sparse, generate representative activity profile
        if sum(grid) == 0:
            import random
            random.seed(abs(hash(username)) % 10000)
            for d in range(7):
                for h in range(24):
                    if 20 <= h or h <= 4: # Night activity typical for darknet actors
                        grid[(d * 24) + h] = random.choice([0, 1, 2, 3, 5])
                    else:
                        grid[(d * 24) + h] = random.choice([0, 0, 0, 1])
                        
        return grid

    # ============================================================
    # NETWORK SECURITY & UNSW-NB15 INGESTION METHODS
    # ============================================================

    @staticmethod
    def log_security_events_batch(events: List[Dict[str, Any]]) -> int:
        if not events:
            return 0
        conn = get_db_connection()
        cursor = conn.cursor()
        rows = [
            (
                e.get("id"),
                e.get("dataset_id"),
                e.get("source_file"),
                e.get("source_row_number"),
                e.get("source_ip"),
                e.get("destination_ip"),
                e.get("source_port"),
                e.get("destination_port"),
                e.get("protocol"),
                e.get("service"),
                e.get("state"),
                e.get("duration"),
                e.get("bytes_source"),
                e.get("bytes_destination"),
                e.get("packets_source"),
                e.get("packets_destination"),
                e.get("rate"),
                e.get("srate"),
                e.get("drate"),
                e.get("attack_category"),
                e.get("attack_label"),
                e.get("is_attack", 0),
                e.get("timestamp"),
                json.dumps(e.get("raw_record", {})) if isinstance(e.get("raw_record"), dict) else str(e.get("raw_record", "{}")),
                e.get("created_at")
            )
            for e in events
        ]
        cursor.executemany('''
        INSERT OR REPLACE INTO security_events (
            id, dataset_id, source_file, source_row_number, source_ip, destination_ip,
            source_port, destination_port, protocol, service, state, duration,
            bytes_source, bytes_destination, packets_source, packets_destination,
            rate, srate, drate, attack_category, attack_label, is_attack,
            timestamp, raw_record, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', rows)
        conn.commit()
        count = len(rows)
        conn.close()
        return count

    @staticmethod
    def get_security_events(
        dataset_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
        search: Optional[str] = None,
        attack_category: Optional[str] = None,
        protocol: Optional[str] = None,
        is_attack: Optional[int] = None
    ) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()

        where_clauses = []
        params = []

        if dataset_id:
            where_clauses.append("dataset_id = ?")
            params.append(dataset_id)

        if search and search.strip():
            term = f"%{search.strip()}%"
            where_clauses.append("(source_ip LIKE ? OR destination_ip LIKE ? OR protocol LIKE ? OR service LIKE ? OR attack_category LIKE ?)")
            params.extend([term, term, term, term, term])

        if attack_category:
            where_clauses.append("attack_category = ?")
            params.append(attack_category)

        if protocol:
            where_clauses.append("protocol = ?")
            params.append(protocol)

        if is_attack is not None:
            where_clauses.append("is_attack = ?")
            params.append(is_attack)

        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

        # Total count
        count_cursor = conn.cursor()
        count_cursor.execute(f"SELECT COUNT(*) FROM security_events {where_sql}", tuple(params))
        total = count_cursor.fetchone()[0]

        # Paginated rows
        cursor.execute(
            f"SELECT * FROM security_events {where_sql} ORDER BY source_row_number ASC LIMIT ? OFFSET ?",
            tuple(params + [limit, offset])
        )
        rows = cursor.fetchall()
        events = []
        for r in rows:
            events.append({
                "id": r["id"],
                "datasetId": r["dataset_id"],
                "sourceFile": r["source_file"],
                "sourceRowNumber": r["source_row_number"],
                "sourceIp": r["source_ip"],
                "destinationIp": r["destination_ip"],
                "sourcePort": r["source_port"],
                "destinationPort": r["destination_port"],
                "protocol": r["protocol"],
                "service": r["service"],
                "state": r["state"],
                "duration": r["duration"],
                "bytesSource": r["bytes_source"],
                "bytesDestination": r["bytes_destination"],
                "packetsSource": r["packets_source"],
                "packetsDestination": r["packets_destination"],
                "rate": r["rate"],
                "srate": r["srate"],
                "drate": r["drate"],
                "attackCategory": r["attack_category"],
                "attackLabel": r["attack_label"],
                "isAttack": bool(r["is_attack"]),
                "timestamp": r["timestamp"],
                "rawRecord": json.loads(r["raw_record"]) if r["raw_record"] else {},
                "createdAt": r["created_at"]
            })
        conn.close()
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "events": events
        }

    @staticmethod
    def get_security_events_statistics(dataset_id: Optional[str] = None) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()

        where_sql = "WHERE dataset_id = ?" if dataset_id else ""
        params = (dataset_id,) if dataset_id else ()

        cursor.execute(f'''
        SELECT 
            COUNT(*) as total_records,
            SUM(CASE WHEN is_attack = 1 THEN 1 ELSE 0 END) as attack_records,
            SUM(CASE WHEN is_attack = 0 THEN 1 ELSE 0 END) as normal_records,
            COUNT(DISTINCT source_ip) as unique_source_ips,
            COUNT(DISTINCT destination_ip) as unique_destination_ips,
            COUNT(DISTINCT protocol) as unique_protocols,
            SUM(COALESCE(bytes_source, 0) + COALESCE(bytes_destination, 0)) as total_bytes
        FROM security_events {where_sql}
        ''', params)
        agg = cursor.fetchone()

        # Attack Categories breakdown
        cursor.execute(f'''
        SELECT attack_category, COUNT(*) as count 
        FROM security_events {where_sql} 
        GROUP BY attack_category ORDER BY count DESC LIMIT 15
        ''', params)
        attack_cats = {r["attack_category"] or "Normal": r["count"] for r in cursor.fetchall()}

        # Protocols breakdown
        cursor.execute(f'''
        SELECT protocol, COUNT(*) as count 
        FROM security_events {where_sql} 
        GROUP BY protocol ORDER BY count DESC LIMIT 10
        ''', params)
        protocols = {r["protocol"] or "TCP": r["count"] for r in cursor.fetchall()}

        conn.close()

        total = agg["total_records"] if agg else 0
        attacks = agg["attack_records"] or 0 if agg else 0
        normal = agg["normal_records"] or 0 if agg else 0

        return {
            "dataset_id": dataset_id,
            "total_records": total,
            "attack_records": attacks,
            "normal_records": normal,
            "attack_percentage": round((attacks / max(1, total)) * 100, 2),
            "unique_source_ips": agg["unique_source_ips"] or 0 if agg else 0,
            "unique_destination_ips": agg["unique_destination_ips"] or 0 if agg else 0,
            "protocols_count": agg["unique_protocols"] or 0 if agg else 0,
            "traffic_volume_bytes": agg["total_bytes"] or 0 if agg else 0,
            "attack_categories": attack_cats,
            "protocols": protocols
        }

    # ============================================================
    # PRODUCTION USER & AUTHENTICATION METHODS
    # ============================================================

    @staticmethod
    def get_user_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_user(row)

    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        if not email:
            return None
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_user(row)

    @staticmethod
    def get_user_by_provider(provider: str, provider_user_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT u.* FROM users u
        JOIN auth_identities ai ON u.user_id = ai.user_id
        WHERE ai.provider = ? AND LOWER(ai.provider_user_id) = LOWER(?)
        LIMIT 1
        ''', (provider, provider_user_id.strip()))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_user(row)

    @staticmethod
    def get_user_by_wallet_address(wallet_address: str) -> Optional[Dict[str, Any]]:
        if not wallet_address:
            return None
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT u.* FROM users u
        JOIN auth_identities ai ON u.user_id = ai.user_id
        WHERE ai.provider = 'ethereum' AND LOWER(ai.wallet_address) = LOWER(?)
        LIMIT 1
        ''', (wallet_address.strip(),))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return DatabaseService._row_to_user(row)

    @staticmethod
    def get_next_user_id(prefix: str = "UNMASK-USER-") -> str:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT user_id FROM users WHERE user_id LIKE ? ORDER BY id DESC LIMIT 1", (f"{prefix}%",))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return f"{prefix}000001"
        try:
            last_num = int(row["user_id"].replace(prefix, ""))
            return f"{prefix}{last_num + 1:06d}"
        except Exception:
            import secrets
            return f"{prefix}{secrets.token_hex(3).upper()}"

    @staticmethod
    def create_user(
        user_id: str,
        email: Optional[str],
        password_hash: Optional[str],
        display_name: str,
        avatar_url: Optional[str] = None,
        role: str = "USER",
        is_email_verified: int = 0,
        auth_provider: str = "password",
        provider_user_id: Optional[str] = None,
        wallet_address: Optional[str] = None,
        chain_id: Optional[int] = None
    ) -> Dict[str, Any]:
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        if not avatar_url:
            avatar_url = f"https://api.dicebear.com/7.x/bottts/svg?seed={user_id}"

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO users (
            user_id, email, password_hash, display_name, avatar_url, role,
            is_email_verified, is_active, created_at, updated_at, last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
        ''', (
            user_id,
            email.strip().lower() if email else None,
            password_hash,
            display_name,
            avatar_url,
            role,
            is_email_verified,
            now_iso,
            now_iso,
            now_iso
        ))

        # Add initial auth identity
        p_user_id = provider_user_id or user_id or email or wallet_address or "default"
        cursor.execute('''
        INSERT OR IGNORE INTO auth_identities (
            user_id, provider, provider_user_id, wallet_address, chain_id, created_at, last_used_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            auth_provider,
            p_user_id,
            wallet_address.lower() if wallet_address else None,
            chain_id,
            now_iso,
            now_iso
        ))

        conn.commit()
        conn.close()

        return DatabaseService.get_user_by_user_id(user_id)

    @staticmethod
    def link_auth_identity(
        user_id: str,
        provider: str,
        provider_user_id: str,
        wallet_address: Optional[str] = None,
        chain_id: Optional[int] = None
    ) -> bool:
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT OR REPLACE INTO auth_identities (
            user_id, provider, provider_user_id, wallet_address, chain_id, created_at, last_used_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            provider,
            provider_user_id,
            wallet_address.lower() if wallet_address else None,
            chain_id,
            now_iso,
            now_iso
        ))
        
        cursor.execute("UPDATE users SET updated_at = ? WHERE user_id = ?", (now_iso, user_id))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_user_identities(user_id: str) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM auth_identities WHERE user_id = ? ORDER BY created_at ASC", (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [{
            "id": r["id"],
            "userId": r["user_id"],
            "provider": r["provider"],
            "providerUserId": r["provider_user_id"],
            "walletAddress": r["wallet_address"],
            "chainId": r["chain_id"],
            "createdAt": r["created_at"],
            "lastUsedAt": r["last_used_at"]
        } for r in rows]

    @staticmethod
    def update_user_last_login(user_id: str, provider: Optional[str] = None) -> bool:
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET last_login_at = ?, updated_at = ? WHERE user_id = ?", (now_iso, now_iso, user_id))
        
        if provider:
            cursor.execute('''
            UPDATE auth_identities SET last_used_at = ?
            WHERE user_id = ? AND provider = ?
            ''', (now_iso, user_id, provider))
            
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def create_session(session_token: str, user_id: str, role: str, expires_at: str, user_agent: str = "", ip_hash: str = "") -> bool:
        import datetime
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT OR REPLACE INTO sessions (
            session_token, user_id, role, created_at, expires_at, user_agent, ip_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (session_token, user_id, role, now_iso, expires_at, user_agent, ip_hash))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def get_session(session_token: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_token = ?", (session_token,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return {
            "sessionToken": row["session_token"],
            "userId": row["user_id"],
            "role": row["role"],
            "createdAt": row["created_at"],
            "expiresAt": row["expires_at"],
            "userAgent": row["user_agent"],
            "ipHash": row["ip_hash"]
        }

    @staticmethod
    def delete_session(session_token: str) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE session_token = ?", (session_token,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def create_auth_event(
        user_id: Optional[str],
        event_type: str,
        provider: str,
        success: bool,
        ip_hash: str = "",
        user_agent: str = "",
        details: Optional[Dict[str, Any]] = None
    ) -> str:
        import datetime, secrets
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        event_id = f"EVT-{int(datetime.datetime.now().timestamp() * 1000)}-{secrets.token_hex(3).upper()}"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT INTO auth_events (
            id, user_id, event_type, provider, success, created_at,
            ip_hash_or_safe_network_metadata, user_agent, details_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            event_id,
            user_id,
            event_type,
            provider,
            1 if success else 0,
            now_iso,
            ip_hash,
            user_agent,
            json.dumps(details or {})
        ))
        conn.commit()
        conn.close()
        return event_id

    @staticmethod
    def get_auth_events(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT * FROM auth_events
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        ''', (user_id, limit))
        rows = cursor.fetchall()
        conn.close()
        return [DatabaseService._row_to_auth_event(r) for r in rows]

    @staticmethod
    def get_all_auth_events(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT * FROM auth_events
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        ''', (limit, offset))
        rows = cursor.fetchall()
        conn.close()
        return [DatabaseService._row_to_auth_event(r) for r in rows]

    @staticmethod
    def store_metamask_nonce(nonce: str, wallet_address: Optional[str] = None, expires_in_seconds: int = 300) -> bool:
        import time
        now = time.time()
        expires_at = now + expires_in_seconds
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
        INSERT OR REPLACE INTO metamask_nonces (nonce, wallet_address, created_at, expires_at, is_used)
        VALUES (?, ?, ?, ?, 0)
        ''', (nonce, wallet_address.lower() if wallet_address else None, now, expires_at))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def verify_and_consume_metamask_nonce(nonce: str) -> bool:
        import time
        now = time.time()
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM metamask_nonces WHERE nonce = ? AND is_used = 0", (nonce,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return False
            
        if now > row["expires_at"]:
            cursor.execute("UPDATE metamask_nonces SET is_used = 1 WHERE nonce = ?", (nonce,))
            conn.commit()
            conn.close()
            return False
            
        cursor.execute("UPDATE metamask_nonces SET is_used = 1 WHERE nonce = ?", (nonce,))
        conn.commit()
        conn.close()
        return True

    @staticmethod
    def _row_to_user(r: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": r["id"],
            "userId": r["user_id"],
            "email": r["email"],
            "passwordHash": r["password_hash"],
            "displayName": r["display_name"],
            "avatarUrl": r["avatar_url"],
            "role": r["role"],
            "isEmailVerified": bool(r["is_email_verified"]),
            "isActive": bool(r["is_active"]),
            "createdAt": r["created_at"],
            "updatedAt": r["updated_at"],
            "lastLoginAt": r["last_login_at"]
        }

    @staticmethod
    def _row_to_auth_event(r: sqlite3.Row) -> Dict[str, Any]:
        return {
            "id": r["id"],
            "userId": r["user_id"],
            "eventType": r["event_type"],
            "provider": r["provider"],
            "success": bool(r["success"]),
            "createdAt": r["created_at"],
            "ipHash": r["ip_hash_or_safe_network_metadata"],
            "userAgent": r["user_agent"],
            "details": json.loads(r["details_json"]) if r["details_json"] else {}
        }


