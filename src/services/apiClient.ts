// ============================================================
// UNMASK // REST API CLIENT FOR FASTAPI BACKEND (PORT 8000)
// NTRO Cyber Threat Intelligence Platform
// ============================================================

import type { CitizenComplaint, ComplaintStatus } from '../types/complaint';

const BACKEND_BASE_URL = 'http://localhost:8000/api/v1';

export interface BackendHealth {
  status: string;
  system: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    type: string;
    complaintsCount: number;
    threatActorsCount: number;
    graphNodesCount: number;
    graphLinksCount: number;
  };
  aiEngine: {
    version: string;
    activePipelines: string[];
    status: string;
  };
}

export class ApiClient {
  static isBackendAvailable: boolean | null = null;

  static async checkHealth(): Promise<BackendHealth | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/system/health`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) {
        ApiClient.isBackendAvailable = true;
        return await res.json();
      }
    } catch {
      ApiClient.isBackendAvailable = false;
    }
    return null;
  }

  static async getComplaints(params?: { status?: string; category?: string; search?: string }): Promise<CitizenComplaint[] | null> {
    try {
      const url = new URL(`${BACKEND_BASE_URL}/complaints`);
      if (params?.status) url.searchParams.set('status', params.status);
      if (params?.category) url.searchParams.set('category', params.category);
      if (params?.search) url.searchParams.set('search', params.search);

      const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        ApiClient.isBackendAvailable = true;
        return await res.json();
      }
    } catch (e) {
      ApiClient.isBackendAvailable = false;
      console.warn('[UNMASK Backend] Offline or unreachable, falling back to local DB cache:', e);
    }
    return null;
  }

  static async submitComplaint(payload: any): Promise<CitizenComplaint | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/complaints/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        ApiClient.isBackendAvailable = true;
        return await res.json();
      }
    } catch (e) {
      ApiClient.isBackendAvailable = false;
      console.warn('[UNMASK Backend] Submit failed, falling back to local storage engine:', e);
    }
    return null;
  }

  static async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    note?: string,
    adminName = 'ANALYST_K.RAMAN'
  ): Promise<CitizenComplaint | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, adminName }),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        ApiClient.isBackendAvailable = true;
        return await res.json();
      }
    } catch (e) {
      ApiClient.isBackendAvailable = false;
      console.warn('[UNMASK Backend] Status update failed, falling back to local storage:', e);
    }
    return null;
  }

  static async getThreatActors(): Promise<any[] | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/actors`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async correlateIntelligence(payload: {
    queryText?: string;
    walletAddress?: string;
    onionUrl?: string;
    alias?: string;
    email?: string;
  }): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/correlate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async analyzeStylometrics(text: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/stylometrics/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async getAnalysisConfidence(analysisId = 'ANL-8942'): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/${analysisId}/confidence`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[UNMASK Backend] getAnalysisConfidence failed, falling back to local model:', e);
    }
    return null;
  }

  static async getConfidenceConfig(): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/confidence/config`, {
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async calculateConfidence(signals: any, weights?: any): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/confidence/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals, weights }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async getReportConfidence(reportId: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/reports/${reportId}/confidence`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  static async getDatasetStats(): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/dataset/stats`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[UNMASK Backend] getDatasetStats offline:', e);
    }
    return null;
  }

  static async getThreatGraphTopology(): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/graph/topology`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[UNMASK Backend] getThreatGraphTopology offline:', e);
    }
    return null;
  }

  static async getNodeDetails(nodeId: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/graph/node/${encodeURIComponent(nodeId)}`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[UNMASK Backend] getNodeDetails offline:', e);
    }
    return null;
  }

  static async searchIntelligence(query: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/search?q=${encodeURIComponent(query)}`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('[UNMASK Backend] searchIntelligence offline:', e);
    }
    return null;
  }

  static async getActorAnalysisProfile(entityId: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/${encodeURIComponent(entityId)}/profile`, {
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] getActorAnalysisProfile offline:', e);
    }
    return null;
  }

  static async getActorAttribution(entityId: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/${encodeURIComponent(entityId)}/attribution`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] getActorAttribution offline:', e);
    }
    return null;
  }

  static async getActorActivityHeatmap(entityId: string): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/analysis/${encodeURIComponent(entityId)}/activity-heatmap`, {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] getActorActivityHeatmap offline:', e);
    }
    return null;
  }

  static async correlateEntities(payload: {
    entityA: string;
    entityB: string;
    datasetId?: string;
    entityAData?: any;
    entityBData?: any;
  }): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/attribution/correlate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] correlateEntities offline:', e);
    }
    return null;
  }

  static async getCorrelatedPairs(datasetId?: string, minConfidence = 30): Promise<any[] | null> {
    try {
      const url = new URL(`${BACKEND_BASE_URL}/intelligence/attribution/correlations`);
      if (datasetId) url.searchParams.set('dataset_id', datasetId);
      url.searchParams.set('min_confidence', minConfidence.toString());

      const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] getCorrelatedPairs offline:', e);
    }
    return null;
  }

  static async getCorrelationRules(): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/attribution/rules`, {
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] getCorrelationRules offline:', e);
    }
    return null;
  }

  static async updateCorrelationRules(payload: any): Promise<any | null> {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/intelligence/attribution/rules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const json = await res.json();
        return json?.data || json;
      }
    } catch (e) {
      console.warn('[UNMASK Backend] updateCorrelationRules offline:', e);
    }
    return null;
  }
}


