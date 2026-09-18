// ============================================================
// UNMASK // SCALABLE DATASET API SERVICE (ADMIN UPLOAD & ASYNC PIPELINE)
// Integrates with FastAPI Scalable Dataset Management Endpoints
// ============================================================

const BACKEND_BASE_URL = 'http://localhost:8000/api/v1';

export interface SheetPreviewData {
  sheetName: string;
  rowCount: number;
  columns: string[];
  previewRows: Record<string, string>[];
  detectedMappings: Record<string, string>;
  suggestedEntityType: string;
}

export interface UploadAsyncResponse {
  success: boolean;
  data: {
    dataset_id: string;
    datasetId: string;
    filename: string;
    status: 'QUEUED' | 'VALIDATING' | 'PROCESSING' | 'READY' | 'FAILED';
    message: string;
    uploadedAt: string;
  };
  error: string | null;
}

export interface DatasetJobStatus {
  dataset_id: string;
  datasetId: string;
  filename: string;
  status: 'QUEUED' | 'VALIDATING' | 'PROCESSING' | 'INDEXING' | 'ANALYZING' | 'READY' | 'FAILED' | 'CANCELLED' | 'ACTIVE' | 'ARCHIVED';
  current_stage: string;
  currentStage: string;
  progress_percent: number;
  progressPercent: number;
  total_rows: number;
  totalRows: number;
  processed_rows: number;
  processedRows: number;
  valid_rows: number;
  validRows: number;
  invalid_rows: number;
  invalidRows: number;
  entity_count: number;
  entityCount: number;
  relationship_count: number;
  relationshipCount: number;
  error_message: string | null;
  errorMessage: string | null;
  uploadedAt: string;
  completedAt: string | null;
}

export interface DatasetRecord {
  id: string;
  datasetId?: string;
  filename: string;
  filePath: string;
  fileType: string;
  fileSize?: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'PROCESSING' | 'READY' | 'QUEUED' | 'VALIDATING' | 'FAILED' | 'CANCELLED';
  currentStage?: string;
  progressPercent?: number;
  totalRows?: number;
  processedRows?: number;
  validRows?: number;
  invalidRows?: number;
  uploadedAt: string;
  uploadedBy: string;
  rowsCount: number;
  skippedRows: number;
  accountsCount: number;
  postsCount: number;
  forumsCount: number;
  walletsCount: number;
  transactionsCount: number;
  relationshipsCount: number;
  entitiesCount: number;
  validationSummary?: {
    totalRows?: number;
    validRows?: number;
    invalidRows?: number;
    schemaStatus?: string;
    sampleErrors?: Array<{ sheetName?: string; rowNumber?: number; field?: string; error?: string }>;
  };
}

export interface DatasetStatusResponse {
  active: {
    status: string;
    datasetVersion: string;
    datasetName: string;
    activeDatasetId: string;
    isAvailable: boolean;
    error: string | null;
    uploadedAt: string;
    uploadedBy: string;
    accountsCount: number;
    postsCount: number;
    forumsCount: number;
    walletsCount: number;
    transactionsCount: number;
    relationshipsCount: number;
    correlatedPairsCount: number;
    nodesCount: number;
  };
  datasetDetails: {
    id: string | null;
    filename: string | null;
    status: string;
    uploadedAt: string | null;
    uploadedBy: string | null;
    validationSummary: any;
    entitiesCount: number;
    relationshipsCount: number;
  };
}

export interface DatasetErrorsResponse {
  datasetId: string;
  totalErrors: number;
  limit: number;
  offset: number;
  errors: Array<{
    id: number;
    rowNumber: number;
    sheetName: string;
    field: string;
    error: string;
    createdAt: string;
  }>;
}

export class DatasetApi {
  /**
   * Asynchronously uploads one or more dataset files and immediately returns job tracking information.
   */
  static async uploadDatasetAsync(files: File | File[]): Promise<UploadAsyncResponse> {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach(f => formData.append('files', f));
    } else {
      formData.append('file', files);
    }

    const res = await fetch(`${BACKEND_BASE_URL}/dataset/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to upload dataset files' }));
      throw new Error(err.detail || 'Upload failed');
    }

    return await res.json();
  }

  /**
   * Polls real-time background processing status for a dataset job.
   */
  static async getJobStatus(datasetId: string): Promise<DatasetJobStatus> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}/status`);
    if (!res.ok) {
      throw new Error(`Failed to fetch status for job ${datasetId}`);
    }
    const json = await res.json();
    return json.data || json;
  }

  /**
   * Safely cancels an active dataset background processing job.
   */
  static async cancelJob(datasetId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) {
      throw new Error(`Failed to cancel job ${datasetId}`);
    }
    return await res.json();
  }

  /**
   * Retrieves active dataset status and live telemetry counts.
   */
  static async getStatus(): Promise<DatasetStatusResponse> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/status`);
    if (!res.ok) {
      throw new Error('Failed to fetch dataset status');
    }
    return await res.json();
  }

  /**
   * Retrieves history of all uploaded datasets.
   */
  static async getHistory(): Promise<{ count: number; datasets: DatasetRecord[] }> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/history`);
    if (!res.ok) {
      throw new Error('Failed to fetch dataset history');
    }
    return await res.json();
  }

  /**
   * Sets a specific dataset as the active source of truth.
   */
  static async activateDataset(datasetId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/activate/${encodeURIComponent(datasetId)}`, {
      method: 'POST'
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to activate dataset' }));
      throw new Error(err.detail || 'Activation failed');
    }

    return await res.json();
  }

  /**
   * Retrieves paginated row error reports for a dataset.
   */
  static async getErrorReports(datasetId: string, limit: number = 50, offset: number = 0): Promise<DatasetErrorsResponse> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}/errors?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      throw new Error('Failed to fetch dataset error report');
    }
    return await res.json();
  }

  /**
   * Deletes a dataset record and cleans its server artifacts.
   */
  static async deleteDataset(datasetId: string): Promise<{ success: boolean; deletedId: string }> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete dataset' }));
      throw new Error(err.detail || 'Deletion failed');
    }

    return await res.json();
  }

  /**
   * Fetches preview rows for a specific dataset.
   */
  static async getPreview(datasetId: string): Promise<any> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/preview/${encodeURIComponent(datasetId)}`);
    if (!res.ok) {
      throw new Error('Failed to fetch dataset preview');
    }
    return await res.json();
  }

  /**
   * Triggers asynchronous Kaggle dataset download and background ingestion.
   */
  static async importKaggleDataset(payload: {
    datasetIdentifier?: string;
    datasetId?: string;
    maxRowsPerFile?: number;
    autoActivate?: boolean;
  }): Promise<UploadAsyncResponse> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/import/kaggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to initiate Kaggle dataset import' }));
      throw new Error(err.detail || 'Kaggle import failed');
    }

    return await res.json();
  }

  /**
   * Retrieves aggregated security telemetry statistics for a network security dataset.
   */
  static async getSecurityStatistics(datasetId: string): Promise<SecurityStatisticsResponse> {
    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}/statistics`);
    if (!res.ok) {
      throw new Error('Failed to fetch security dataset statistics');
    }
    return await res.json();
  }

  /**
   * Retrieves paginated security events from the UNSW-NB15 flow suite.
   */
  static async getSecurityEvents(
    datasetId: string,
    params: {
      limit?: number;
      offset?: number;
      search?: string;
      attackCategory?: string;
      protocol?: string;
      isAttack?: number;
    } = {}
  ): Promise<SecurityEventsResponse> {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.offset !== undefined) query.append('offset', params.offset.toString());
    if (params.search) query.append('search', params.search);
    if (params.attackCategory) query.append('attack_category', params.attackCategory);
    if (params.protocol) query.append('protocol', params.protocol);
    if (params.isAttack !== undefined) query.append('is_attack', params.isAttack.toString());

    const res = await fetch(`${BACKEND_BASE_URL}/dataset/${encodeURIComponent(datasetId)}/events?${query.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch security events');
    }
    return await res.json();
  }
}

export interface SecurityEvent {
  id: string;
  datasetId: string;
  sourceFile: string;
  sourceRowNumber: number;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  service: string;
  state: string;
  duration: number;
  bytesSource: number;
  bytesDestination: number;
  packetsSource: number;
  packetsDestination: number;
  rate: number;
  srate: number;
  drate: number;
  attackCategory: string;
  attackLabel: number;
  isAttack: boolean;
  timestamp: string;
  rawRecord: Record<string, any>;
  createdAt: string;
}

export interface SecurityStatisticsResponse {
  success: boolean;
  datasetId: string;
  filename: string;
  statistics: {
    dataset_id: string;
    total_records: number;
    attack_records: number;
    normal_records: number;
    attack_percentage: number;
    unique_source_ips: number;
    unique_destination_ips: number;
    protocols_count: number;
    traffic_volume_bytes: number;
    attack_categories: Record<string, number>;
    protocols: Record<string, number>;
  };
}

export interface SecurityEventsResponse {
  success: boolean;
  datasetId: string;
  total: number;
  limit: number;
  offset: number;
  events: SecurityEvent[];
}

