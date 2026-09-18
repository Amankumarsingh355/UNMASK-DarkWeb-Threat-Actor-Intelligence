# ============================================================
# UNMASK // DATASET PIPELINE & THREAT GRAPH ENGINE
# Real Dataset Ingestion & Multi-Signal Entity Correlation
# Dynamically delegates to the active DatasetService database record
# ============================================================

import os
from typing import Dict, List, Any, Optional, Set
from backend.dataset_service import DatasetService

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

class DatasetLoader:
    """
    Singleton wrapper that routes all graph topology, entity lookup,
    and threat actor inquiries to the currently active DatasetService dataset.
    """
    _instance = None

    def __init__(self, data_path: str = DATA_DIR):
        self.data_path = data_path
        # Ensure active dataset initialized
        DatasetService.get_active_dataset()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @classmethod
    def reload_instance(cls):
        cls._instance = cls()
        return cls._instance

    def reload_from_db(self):
        DatasetService.invalidate_cache()
        DatasetService.get_active_dataset()
        return self

    def get_stats(self) -> Dict[str, Any]:
        """Returns live dataset statistics for the UI telemetry badge."""
        active = DatasetService.get_active_dataset()
        if not active or active.get("status") != "ACTIVE":
            return {
                "status": "UNAVAILABLE",
                "datasetVersion": "N/A",
                "datasetName": "None",
                "isAvailable": False,
                "error": active.get("errorMessage") if active else "No active dataset loaded",
                "accountsCount": 0,
                "postsCount": 0,
                "forumsCount": 0,
                "walletsCount": 0,
                "transactionsCount": 0,
                "relationshipsCount": 0,
                "correlatedPairsCount": 0,
                "nodesCount": 0
            }

        links = active.get("nodes", []) and active.get("links", []) or []
        nodes = active.get("nodes", [])

        return {
            "status": "ACTIVE",
            "datasetVersion": active.get("id", "UNMASK-DATA-2026-001"),
            "datasetName": active.get("filename", "UNMASK_Final_Synthetic_MVP_v2.3_VALIDATED"),
            "activeDatasetId": active.get("id"),
            "isAvailable": True,
            "error": None,
            "uploadedAt": active.get("uploadedAt"),
            "uploadedBy": active.get("uploadedBy", "Admin_01"),
            "accountsCount": active.get("accountsCount", 0),
            "postsCount": active.get("postsCount", 0),
            "forumsCount": active.get("forumsCount", 0),
            "walletsCount": active.get("walletsCount", 0),
            "transactionsCount": active.get("transactionsCount", 0),
            "relationshipsCount": active.get("relationshipsCount", len(links)),
            "correlatedPairsCount": len([l for l in links if l.get("relationship") == "CORRELATED_ACTOR"]),
            "nodesCount": active.get("entitiesCount", len(nodes))
        }

    def get_graph_topology(self) -> Dict[str, Any]:
        """Returns the complete dataset-backed graph topology."""
        active = DatasetService.get_active_dataset()
        if not active:
            return {
                "nodes": [],
                "links": [],
                "stats": self.get_stats(),
                "error": "No active dataset available"
            }

        return {
            "nodes": active.get("nodes", []),
            "links": active.get("links", []),
            "stats": self.get_stats(),
            "datasetId": active.get("id"),
            "datasetName": active.get("filename")
        }

    def get_node_details(self, node_id: str) -> Optional[Dict[str, Any]]:
        """Returns authentic related records for a specific clicked node."""
        active = DatasetService.get_active_dataset()
        if not active:
            return None

        nodes = active.get("nodes", [])
        links = active.get("links", [])

        norm_id = node_id.strip().lower()
        node = next((
            n for n in nodes 
            if n.get('id', '').lower() == norm_id or 
               n.get('label', '').lower() == norm_id or
               n.get('id', '').lower() == f"account-{norm_id}" or
               n.get('id', '').lower() == f"acc-{norm_id}" or
               n.get('id', '').lower() == f"wallet-{norm_id}" or
               n.get('id', '').lower() == f"forum-{norm_id}" or
               n.get('id', '').lower() == f"pgp-{norm_id}" or
               norm_id in n.get('id', '').lower() or
               norm_id in n.get('label', '').lower()
        ), None)
        
        if not node:
            return None

        # Find connected edges
        node_actual_id = node['id']
        connected_links = [
            l for l in links 
            if l.get('source') == node_actual_id or 
               l.get('target') == node_actual_id or 
               (isinstance(l.get('source'), dict) and l['source'].get('id') == node_actual_id) or
               (isinstance(l.get('target'), dict) and l['target'].get('id') == node_actual_id) or
               l.get('source') == node.get('label') or 
               l.get('target') == node.get('label')
        ]

        # Connected node IDs
        connected_ids = set()
        for l in connected_links:
            s = l['source']['id'] if isinstance(l['source'], dict) else str(l['source'])
            t = l['target']['id'] if isinstance(l['target'], dict) else str(l['target'])
            connected_ids.add(s)
            connected_ids.add(t)

        connected_nodes = [n for n in nodes if n['id'] in connected_ids and n['id'] != node['id']]

        return {
            "node": node,
            "connectedNodes": connected_nodes,
            "connectedLinks": connected_links,
            "posts": [],
            "evidence": [l.get('evidence', []) for l in connected_links]
        }

    def search_intelligence(self, query: str) -> List[Dict[str, Any]]:
        """Searches real dataset entities without mock index fabrication."""
        active = DatasetService.get_active_dataset()
        if not active or not query.strip():
            return []

        q = query.strip().lower()
        results: List[Dict[str, Any]] = []

        for node in active.get("nodes", []):
            label = str(node.get('label', '')).lower()
            full_addr = str(node.get('fullAddress', '')).lower()
            bio = str(node.get('bio', '')).lower()
            pgp = str(node.get('pgp', '') or node.get('fingerprint', '')).lower()
            
            if q in label or q in full_addr or q in bio or q in pgp:
                results.append(node)

        return results

    def get_all_actors(self) -> List[Dict[str, Any]]:
        """Returns all real account actors formatted for views and dossiers."""
        active = DatasetService.get_active_dataset()
        if not active:
            return []
        
        actors = active.get("actors", [])
        if actors:
            return actors

        # Fallback build from nodes
        nodes = active.get("nodes", [])
        actor_list = []
        for n in nodes:
            if n.get("entityType") == "ACCOUNT":
                actor_list.append({
                    "id": f"actor-{n.get('profileId', n['id'])}",
                    "primaryAlias": n.get('label'),
                    "displayName": n.get('displayName', n.get('label')),
                    "profileId": n.get('profileId', n['id']),
                    "forumId": n.get('forumId', ''),
                    "forumName": "Underground Forum",
                    "bio": n.get('bio', ''),
                    "pgp": n.get('pgp', ''),
                    "cryptoWallets": [],
                    "correlatedAliases": [],
                    "correlations": [],
                    "riskScore": n.get('riskScore', 75),
                    "confidenceScore": n.get('confidenceScore', 85),
                    "observedPostsCount": n.get('postCount', 1),
                    "locations": [],
                    "status": "ACTIVE_INVESTIGATION"
                })
        return actor_list

    @property
    def accounts_by_username(self) -> Dict[str, Any]:
        active = DatasetService.get_active_dataset() or {}
        nodes = active.get("nodes", [])
        res = {}
        for n in nodes:
            if n.get("entityType") == "ACCOUNT" or n.get("type") == "ACTOR" or "account" in str(n.get("id", "")):
                username = str(n.get("label") or n.get("name") or n.get("id", "")).lower()
                res[username] = n
        return res

    @property
    def correlated_pairs(self) -> List[Dict[str, Any]]:
        active = DatasetService.get_active_dataset() or {}
        links = active.get("links", [])
        pairs = []
        for l in links:
            if l.get("relationship") in ["CORRELATED_ACTOR", "SAME_ACTOR", "COLLABORATES_WITH"]:
                s = l['source']['id'] if isinstance(l.get('source'), dict) else str(l.get('source', ''))
                t = l['target']['id'] if isinstance(l.get('target'), dict) else str(l.get('target', ''))
                pairs.append({
                    "sourceUser": s.replace("account-", "").replace("acc-", "").lower(),
                    "targetUser": t.replace("account-", "").replace("acc-", "").lower(),
                    "confidence": l.get("confidence", 85),
                    "evidence": l.get("evidence", [])
                })
        return pairs

    @property
    def graph_links(self) -> List[Dict[str, Any]]:
        active = DatasetService.get_active_dataset() or {}
        return active.get("links", [])

    @property
    def graph_nodes(self) -> List[Dict[str, Any]]:
        active = DatasetService.get_active_dataset() or {}
        return active.get("nodes", [])

# Global singleton loader
dataset_loader = DatasetLoader.get_instance()
