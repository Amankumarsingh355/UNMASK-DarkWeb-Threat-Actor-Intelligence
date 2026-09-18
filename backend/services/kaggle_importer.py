# ============================================================
# UNMASK // KAGGLE UNSW-NB15 DATASET INGESTION WORKER
# Memory-Safe Chunked Streaming, Schema Normalization & Graph Integration
# ============================================================

import os
import glob
import json
import time
import hashlib
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional, Set, Tuple

import pandas as pd
import kagglehub

from backend.database import DatabaseService

CHUNK_SIZE = int(os.getenv("DATASET_CHUNK_SIZE", 5000))

class KaggleImporter:
    _instance: Optional['KaggleImporter'] = None

    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="KaggleWorker")
        self.cancelled_jobs: Set[str] = set()
        self.running_jobs: Set[str] = set()
        self._lock = threading.Lock()

    @classmethod
    def get_instance(cls) -> 'KaggleImporter':
        if cls._instance is None:
            cls._instance = KaggleImporter()
        return cls._instance

    def cancel_job(self, dataset_id: str) -> bool:
        with self._lock:
            self.cancelled_jobs.add(dataset_id)
        DatabaseService.update_dataset_progress(dataset_id, {
            "status": "CANCELLED",
            "currentStage": "CANCELLED_BY_USER",
            "errorMessage": "Kaggle import cancelled by user request."
        })
        return True

    def is_cancelled(self, dataset_id: str) -> bool:
        with self._lock:
            return dataset_id in self.cancelled_jobs

    def start_import(
        self,
        dataset_identifier: str = "likkisamarthreddy/unsw15",
        dataset_id: Optional[str] = None,
        max_rows_per_file: Optional[int] = None,
        auto_activate: bool = False
    ) -> str:
        """
        Enqueues an asynchronous Kaggle dataset download, normalization,
        and database ingestion background task.
        """
        if not dataset_id:
            dataset_id = f"UNSW-NB15-KAGGLE-{int(time.time()) % 100000:05d}"

        # Initialize dataset registry entry
        job_info = {
            "id": dataset_id,
            "filename": f"UNSW-NB15 Kaggle Suite ({dataset_identifier})",
            "filePath": "kagglehub://likkisamarthreddy/unsw15",
            "fileType": "kaggle_csv_suite",
            "fileSize": 0,
            "status": "QUEUED",
            "currentStage": "QUEUED_FOR_IMPORT",
            "progressPercent": 0.0,
            "totalRows": 0,
            "datasetType": "NETWORK_SECURITY_DATASET",
            "source": "KAGGLE",
            "sourceIdentifier": dataset_identifier,
            "sourceVersion": "1.0.0",
            "uploadedBy": "Admin_01 (Kaggle Pipeline)"
        }
        DatabaseService.create_dataset_job(job_info)

        self.executor.submit(
            self._worker_run_import,
            dataset_id,
            dataset_identifier,
            max_rows_per_file,
            auto_activate
        )

        return dataset_id

    def _worker_run_import(
        self,
        dataset_id: str,
        dataset_identifier: str,
        max_rows_per_file: Optional[int],
        auto_activate: bool
    ):
        with self._lock:
            self.running_jobs.add(dataset_id)

        try:
            # Stage 1: Download / Locate from Kagglehub
            DatabaseService.update_dataset_progress(dataset_id, {
                "status": "PROCESSING",
                "currentStage": "DOWNLOADING_KAGGLE_DATASET",
                "progressPercent": 5.0,
                "startedAt": datetime.now(timezone.utc).isoformat()
            })

            print(f"[KaggleImporter] Initiating kagglehub download for: {dataset_identifier}...")
            kaggle_path = kagglehub.dataset_download(dataset_identifier)
            print(f"[KaggleImporter] Dataset files downloaded/located at: {kaggle_path}")

            if self.is_cancelled(dataset_id):
                return

            # Stage 2: Discover CSV Files
            DatabaseService.update_dataset_progress(dataset_id, {
                "currentStage": "DISCOVERING_FILES",
                "progressPercent": 12.0,
                "filePath": kaggle_path
            })

            csv_files = glob.glob(os.path.join(kaggle_path, "**", "*.csv"), recursive=True)
            if not csv_files:
                raise FileNotFoundError(f"No CSV files found in Kaggle dataset directory '{kaggle_path}'")

            # Sort files so BENIGN comes first, then attack sets
            csv_files.sort(key=lambda x: (0 if "benign" in os.path.basename(x).lower() else 1, os.path.basename(x)))
            total_file_size = sum(os.path.getsize(f) for f in csv_files)

            # Stage 3: Inspect schema & compute row counts
            DatabaseService.update_dataset_progress(dataset_id, {
                "currentStage": "INSPECTING_SCHEMA",
                "progressPercent": 18.0,
                "fileSize": total_file_size
            })

            file_row_counts = {}
            total_expected_rows = 0
            for cf in csv_files:
                # Fast line count estimate
                try:
                    with open(cf, 'rb') as f:
                        lines = sum(1 for _ in f) - 1
                    target_rows = min(lines, max_rows_per_file) if max_rows_per_file and max_rows_per_file > 0 else lines
                    file_row_counts[cf] = target_rows
                    total_expected_rows += target_rows
                except Exception:
                    file_row_counts[cf] = 50000
                    total_expected_rows += 50000

            DatabaseService.update_dataset_progress(dataset_id, {
                "totalRows": total_expected_rows,
                "currentStage": "PROCESSING_CHUNKS",
                "progressPercent": 20.0
            })

            # Stage 4: Chunked Streaming & Normalization
            total_processed = 0
            total_valid = 0
            global_event_idx = 0
            
            # Base timestamp for timeline generation
            base_time = datetime.now(timezone.utc) - timedelta(days=3)

            # Accumulators for Graph Entities & Relationships
            attacker_ip_counts: Dict[str, int] = {}
            victim_ip_counts: Dict[str, int] = {}
            attack_cat_counts: Dict[str, int] = {}
            proto_counts: Dict[str, int] = {}
            ip_attack_map: Dict[str, str] = {}

            for file_idx, cf in enumerate(csv_files):
                if self.is_cancelled(dataset_id):
                    return

                fname = os.path.basename(cf)
                file_tag = os.path.splitext(fname)[0].upper()
                target_limit = file_row_counts.get(cf, 50000)
                file_rows_read = 0

                print(f"[KaggleImporter] Streaming chunks from {fname} (target: {target_limit} rows)...")

                chunk_iter = pd.read_csv(cf, chunksize=CHUNK_SIZE, low_memory=False)
                for chunk_df in chunk_iter:
                    if self.is_cancelled(dataset_id):
                        return

                    # Slice chunk if exceeding target limit
                    if max_rows_per_file and max_rows_per_file > 0:
                        remaining = target_limit - file_rows_read
                        if remaining <= 0:
                            break
                        if len(chunk_df) > remaining:
                            chunk_df = chunk_df.iloc[:remaining]

                    events_chunk = []
                    for row_idx, row in chunk_df.iterrows():
                        global_event_idx += 1
                        raw_dict = row.to_dict()

                        # 1. Label & Attack Classification
                        raw_label = str(raw_dict.get("Label", "Benign")).strip()
                        is_benign = raw_label.lower() in ["benign", "normal", "0", "0.0"]
                        is_attack = 0 if is_benign else 1

                        if is_benign:
                            attack_category = "Normal"
                        elif "ddos" in raw_label.lower():
                            attack_category = "DDoS"
                        elif "dos" in raw_label.lower():
                            attack_category = "DoS"
                        elif "mqtt" in raw_label.lower():
                            attack_category = "MQTT Exploitation"
                        elif "port_scan" in raw_label.lower() or "scan" in raw_label.lower():
                            attack_category = "Reconnaissance"
                        elif "recon" in raw_label.lower():
                            attack_category = "Reconnaissance"
                        elif "bot" in raw_label.lower():
                            attack_category = "Botnet"
                        else:
                            attack_category = raw_label.split("-")[1] if "-" in raw_label else raw_label

                        attack_cat_counts[attack_category] = attack_cat_counts.get(attack_category, 0) + 1

                        # 2. Protocol Normalization
                        proto_val = raw_dict.get("Protocol Type")
                        if proto_val == 6.0 or proto_val == 6 or raw_dict.get("TCP") == 1.0:
                            protocol = "TCP"
                        elif proto_val == 17.0 or proto_val == 17 or raw_dict.get("UDP") == 1.0:
                            protocol = "UDP"
                        elif proto_val == 1.0 or proto_val == 1 or raw_dict.get("ICMP") == 1.0:
                            protocol = "ICMP"
                        elif proto_val == 2.0 or proto_val == 2 or raw_dict.get("IGMP") == 1.0:
                            protocol = "IGMP"
                        elif raw_dict.get("ARP") == 1.0:
                            protocol = "ARP"
                        else:
                            protocol = "TCP"

                        proto_counts[protocol] = proto_counts.get(protocol, 0) + 1

                        # 3. Service & Ports Normalization
                        if "MQTT" in raw_label or file_tag == "MQTT":
                            service = "MQTT"
                            dst_port = 1883
                        elif raw_dict.get("HTTPS") == 1.0:
                            service = "HTTPS"
                            dst_port = 443
                        elif raw_dict.get("HTTP") == 1.0:
                            service = "HTTP"
                            dst_port = 80
                        elif raw_dict.get("DNS") == 1.0:
                            service = "DNS"
                            dst_port = 53
                        elif raw_dict.get("SSH") == 1.0:
                            service = "SSH"
                            dst_port = 22
                        elif raw_dict.get("Telnet") == 1.0:
                            service = "Telnet"
                            dst_port = 23
                        elif raw_dict.get("SMTP") == 1.0:
                            service = "SMTP"
                            dst_port = 25
                        elif attack_category == "Reconnaissance":
                            service = "-"
                            dst_port = 20 + (global_event_idx % 1024)
                        else:
                            service = "-"
                            dst_port = 80 if protocol == "TCP" else (53 if protocol == "UDP" else 0)

                        src_port = 49152 + (global_event_idx % 16383)

                        # 4. Deterministic IP Topology Synthesis
                        if is_benign:
                            src_ip = f"192.168.1.{50 + (global_event_idx % 45)}"
                            dst_ip = "192.168.1.1" if (global_event_idx % 3 == 0) else "192.168.1.10"
                        elif attack_category == "DDoS":
                            subnets = [
                                f"198.51.100.{10 + (global_event_idx % 240)}",
                                f"103.20.12.{5 + (global_event_idx % 240)}",
                                f"185.190.140.{1 + (global_event_idx % 250)}"
                            ]
                            src_ip = subnets[global_event_idx % len(subnets)]
                            dst_ip = "192.168.1.10" # Target Web Infrastructure
                        elif attack_category == "DoS":
                            dos_sources = ["198.51.100.22", "192.0.2.45", "45.33.32.156"]
                            src_ip = dos_sources[global_event_idx % len(dos_sources)]
                            dst_ip = "192.168.1.10"
                        elif attack_category == "MQTT Exploitation":
                            src_ip = f"172.16.0.{10 + (global_event_idx % 80)}"
                            dst_ip = "192.168.1.25" # IoT Gateway / MQTT Broker
                        elif attack_category == "Reconnaissance":
                            recon_sources = ["45.33.32.156", "185.220.101.5", "203.0.113.88"]
                            src_ip = recon_sources[global_event_idx % len(recon_sources)]
                            dst_ip = f"192.168.1.{(global_event_idx % 30) + 1}"
                        else:
                            src_ip = f"198.51.100.{(global_event_idx % 200) + 1}"
                            dst_ip = "192.168.1.10"

                        if is_attack:
                            attacker_ip_counts[src_ip] = attacker_ip_counts.get(src_ip, 0) + 1
                            ip_attack_map[src_ip] = attack_category
                        victim_ip_counts[dst_ip] = victim_ip_counts.get(dst_ip, 0) + 1

                        # 5. Connection State
                        if raw_dict.get("rst_flag_number", 0) > 0:
                            state = "RST"
                        elif raw_dict.get("fin_flag_number", 0) > 0:
                            state = "FIN"
                        elif raw_dict.get("syn_flag_number", 0) > 0:
                            state = "SYN"
                        else:
                            state = "CON"

                        # Flow Duration & Metrics
                        duration = float(raw_dict.get("Duration", 0.0))
                        bytes_src = float(raw_dict.get("Tot sum", 0.0))
                        bytes_dst = float(raw_dict.get("Tot size", 0.0))
                        pkts_src = int(float(raw_dict.get("Number", 1.0)))
                        pkts_dst = int(float(raw_dict.get("ack_count", 0.0)))
                        rate = float(raw_dict.get("Rate", 0.0))
                        srate = float(raw_dict.get("Srate", 0.0))
                        drate = float(raw_dict.get("Drate", 0.0))

                        event_ts = (base_time + timedelta(seconds=global_event_idx * 0.25)).isoformat()

                        events_chunk.append({
                            "id": f"SE-{dataset_id[:8]}-{file_tag[:3]}-{global_event_idx:07d}",
                            "dataset_id": dataset_id,
                            "source_file": fname,
                            "source_row_number": global_event_idx,
                            "source_ip": src_ip,
                            "destination_ip": dst_ip,
                            "source_port": src_port,
                            "destination_port": dst_port,
                            "protocol": protocol,
                            "service": service,
                            "state": state,
                            "duration": duration,
                            "bytes_source": bytes_src,
                            "bytes_destination": bytes_dst,
                            "packets_source": pkts_src,
                            "packets_destination": pkts_dst,
                            "rate": rate,
                            "srate": srate,
                            "drate": drate,
                            "attack_category": attack_category,
                            "attack_label": is_attack,
                            "is_attack": is_attack,
                            "timestamp": event_ts,
                            "raw_record": raw_dict,
                            "created_at": datetime.now(timezone.utc).isoformat()
                        })

                    # Batch write into SQLite
                    inserted = DatabaseService.log_security_events_batch(events_chunk)
                    total_processed += len(events_chunk)
                    total_valid += inserted
                    file_rows_read += len(events_chunk)

                    # Update progress in real-time
                    pct = min(90.0, 20.0 + (total_processed / max(1, total_expected_rows)) * 70.0)
                    DatabaseService.update_dataset_progress(dataset_id, {
                        "processedRows": total_processed,
                        "validRows": total_valid,
                        "rowsCount": total_valid,
                        "progressPercent": round(pct, 1),
                        "currentStage": f"INGESTING_{file_tag}"
                    })

            # Stage 5: Build Graph Entities and Topologies for Network Threat Fusion
            DatabaseService.update_dataset_progress(dataset_id, {
                "currentStage": "INDEXING_GRAPH_ENTITIES",
                "progressPercent": 93.0
            })

            entities_to_insert = []
            relationships_to_insert = []

            # 1. Target Servers (Victims)
            for victim_ip, hits in victim_ip_counts.items():
                v_label = f"Target {victim_ip} ({'Web Server' if '10' in victim_ip else ('IoT Gateway' if '25' in victim_ip else 'Router')})"
                entities_to_insert.append({
                    "id": f"HOST-{victim_ip.replace('.', '_')}",
                    "entityType": "HOST",
                    "entityKey": victim_ip,
                    "label": v_label,
                    "riskScore": 45.0,
                    "category": "INFRASTRUCTURE",
                    "postCount": hits,
                    "txCount": hits,
                    "size": 24,
                    "color": "#3b82f6",
                    "details": {
                        "ipAddress": victim_ip,
                        "role": "Target Infrastructure",
                        "totalFlowsReceived": hits
                    }
                })

            # 2. Top Attacking IPs
            top_attackers = sorted(attacker_ip_counts.items(), key=lambda x: x[1], reverse=True)[:30]
            for atk_ip, hits in top_attackers:
                cat = ip_attack_map.get(atk_ip, "Threat Actor Node")
                risk = 95.0 if "DDoS" in cat or "DoS" in cat else (88.0 if "MQTT" in cat else 80.0)
                node_id = f"IP-{atk_ip.replace('.', '_')}"

                entities_to_insert.append({
                    "id": node_id,
                    "entityType": "SECURITY",
                    "entityKey": atk_ip,
                    "label": f"{atk_ip} ({cat})",
                    "riskScore": risk,
                    "category": "NETWORK_ATTACKER",
                    "postCount": hits,
                    "txCount": hits,
                    "size": 20,
                    "color": "#ef4444" if risk >= 90 else "#f97316",
                    "details": {
                        "ipAddress": atk_ip,
                        "attackCategory": cat,
                        "flowsDetected": hits,
                        "reputation": "MALICIOUS",
                        "originCountry": "Distributed"
                    }
                })

                # Link attacker to primary target host
                target_host = "HOST-192_168_1_25" if "MQTT" in cat else "HOST-192_168_1_10"
                relationships_to_insert.append({
                    "id": f"REL-NET-{atk_ip.replace('.', '_')}-TGT",
                    "source": node_id,
                    "target": target_host,
                    "relationship": "ATTACKED",
                    "confidence": 95.0,
                    "evidence": [f"Observed {hits} malicious {cat} telemetry flows in UNSW-NB15 suite."]
                })

            # Save entities & relationships into scalable tables
            DatabaseService.bulk_insert_entities(dataset_id, entities_to_insert)
            DatabaseService.bulk_insert_relationships(dataset_id, relationships_to_insert)

            # Stage 6: Finalize Dataset Record
            DatabaseService.update_dataset_progress(dataset_id, {
                "status": "READY",
                "currentStage": "COMPLETED",
                "progressPercent": 100.0,
                "totalRows": total_valid,
                "processedRows": total_valid,
                "validRows": total_valid,
                "entityCount": len(entities_to_insert),
                "relationshipCount": len(relationships_to_insert),
                "entitiesCount": len(entities_to_insert),
                "relationshipsCount": len(relationships_to_insert),
                "completedAt": datetime.now(timezone.utc).isoformat(),
                "errorMessage": None,
                "validationSummary": {
                    "source": "Kaggle (likkisamarthreddy/unsw15)",
                    "filesProcessed": [os.path.basename(f) for f in csv_files],
                    "totalRecords": total_valid,
                    "attackCategories": attack_cat_counts,
                    "protocols": proto_counts,
                    "uniqueAttackingIps": len(attacker_ip_counts),
                    "uniqueTargetIps": len(victim_ip_counts)
                }
            })

            print(f"[KaggleImporter] Successfully ingested {total_valid} UNSW-NB15 security records for {dataset_id}!")

            if auto_activate:
                DatabaseService.activate_dataset_atomic(dataset_id)
                print(f"[KaggleImporter] Dataset {dataset_id} set to ACTIVE source of truth.")

        except Exception as e:
            print(f"[KaggleImporter] Ingestion failed for {dataset_id}: {str(e)}")
            import traceback
            traceback.print_exc()
            DatabaseService.update_dataset_progress(dataset_id, {
                "status": "FAILED",
                "currentStage": "ERROR_TERMINATED",
                "errorMessage": str(e),
                "completedAt": datetime.now(timezone.utc).isoformat()
            })
        finally:
            with self._lock:
                self.running_jobs.discard(dataset_id)
