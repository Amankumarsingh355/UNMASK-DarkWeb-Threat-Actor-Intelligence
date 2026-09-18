// ============================================================
// UNMASK // SCALABLE ADMIN DATASET MANAGEMENT & ASYNC PIPELINE HUD
// Multi-File Chunked Ingestion, Real-Time Progress Polling & Bounded Graph
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Network,
  Trash2,
  Eye,
  Sliders,
  Play,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  Info,
  Clock,
  User,
  Wallet,
  Globe,
  FileText,
  Activity,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Files,
  FolderOpen,
  StopCircle,
  AlertCircle
} from 'lucide-react';
import { 
  DatasetApi, 
  type DatasetRecord, 
  type DatasetStatusResponse,
  type DatasetJobStatus,
  type DatasetErrorsResponse
} from '../../services/datasetApi';
import { ThreatRelationsGraph2D } from '../ThreatGraph/ThreatRelationsGraph2D';
import { ApiClient } from '../../services/apiClient';
import type { GraphNode, GraphLink, EntityType } from '../../types/intelligence';

interface DatasetManagementProps {
  onNavigateToThreatGraph?: () => void;
  theme?: 'dark' | 'light';
}

function adaptDatasetNode(rawNode: any): GraphNode {
  return {
    id: rawNode.id,
    name: rawNode.label || rawNode.name || rawNode.id,
    label: rawNode.label || rawNode.name,
    type: (rawNode.type === 'SECURITY' ? 'CLUSTER' : (rawNode.type || 'ACTOR')) as EntityType,
    riskLevel: rawNode.riskScore >= 85 ? 'CRITICAL' : rawNode.riskScore >= 70 ? 'HIGH' : rawNode.riskScore >= 50 ? 'MEDIUM' : 'LOW',
    riskScore: rawNode.riskScore || 65,
    connectionsCount: rawNode.postCount || rawNode.txCount || 4,
    size: rawNode.size || 18,
    color: rawNode.color,
    firstSeen: rawNode.joinedDate || '2026-09-01',
    lastSeen: '2026-09-04',
    details: {
      bio: rawNode.bio,
      pgp: rawNode.pgp || rawNode.fingerprint,
      forumId: rawNode.forumId,
      fullAddress: rawNode.fullAddress,
      chain: rawNode.chain,
      balance: rawNode.balance ? `${rawNode.balance} ETH` : undefined,
      txCount: rawNode.txCount,
      postCount: rawNode.postCount
    }
  };
}

function adaptDatasetLink(rawLink: any): GraphLink {
  const src = typeof rawLink.source === 'object' ? rawLink.source.id : rawLink.source;
  const tgt = typeof rawLink.target === 'object' ? rawLink.target.id : rawLink.target;
  const conf = Number(rawLink.confidence || 90);
  const evItems = Array.isArray(rawLink.evidence)
    ? rawLink.evidence.map((e: any) => typeof e === 'string' ? { title: 'Verified Telemetry', description: e, confidenceContribution: conf } : e)
    : [{ title: 'Graph Relationship', description: 'Observed connection in intelligence registry', confidenceContribution: conf }];

  return {
    id: rawLink.id,
    source: src,
    target: tgt,
    relationship: (rawLink.relationship || 'CONNECTED_TO') as any,
    confidence: conf,
    isAnimated: conf >= 85,
    evidence: {
      sharedIdentifierScore: conf >= 90 ? 35 : 25,
      temporalOverlapScore: 20,
      aliasSimilarityScore: conf >= 80 ? 22 : 15,
      behavioralSimilarityScore: 18,
      infrastructureScore: 15,
      totalConfidence: conf,
      evidenceItems: evItems
    }
  };
}

export const DatasetManagement: React.FC<DatasetManagementProps> = ({
  onNavigateToThreatGraph,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Master State
  const [activeStatus, setActiveStatus] = useState<DatasetStatusResponse | null>(null);
  const [datasetHistory, setDatasetHistory] = useState<DatasetRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Live Threat Graph State embedded in Dataset Management
  const [liveNodes, setLiveNodes] = useState<GraphNode[]>([]);
  const [liveLinks, setLiveLinks] = useState<GraphLink[]>([]);
  const [selectedLiveNode, setSelectedLiveNode] = useState<GraphNode | null>(null);
  const [selectedLiveLink, setSelectedLiveLink] = useState<GraphLink | null>(null);
  const [isGraphExpanded, setIsGraphExpanded] = useState<boolean>(true);

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Real-Time Asynchronous Processing Job Tracker
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<DatasetJobStatus | null>(null);
  const [jobStartTime, setJobStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Error Report Modal
  const [errorReportData, setErrorReportData] = useState<DatasetErrorsResponse | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isErrorLoading, setIsErrorLoading] = useState<boolean>(false);

  // Kaggle Ingestion Modal State
  const [showKaggleModal, setShowKaggleModal] = useState<boolean>(false);
  const [kaggleIdentifier, setKaggleIdentifier] = useState<string>('likkisamarthreddy/unsw15');
  const [kaggleRowLimit, setKaggleRowLimit] = useState<number>(25000);
  const [kaggleAutoActivate, setKaggleAutoActivate] = useState<boolean>(false);
  const [isKaggleSubmitting, setIsKaggleSubmitting] = useState<boolean>(false);

  // Security Events Telemetry Viewer Modal State
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [selectedSecurityDatasetId, setSelectedSecurityDatasetId] = useState<string | null>(null);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [securityStats, setSecurityStats] = useState<any | null>(null);
  const [securityTotalEvents, setSecurityTotalEvents] = useState<number>(0);
  const [securityPage, setSecurityPage] = useState<number>(0);
  const [securitySearch, setSecuritySearch] = useState<string>('');
  const [securityCategory, setSecurityCategory] = useState<string>('ALL');
  const [securityProtocol, setSecurityProtocol] = useState<string>('ALL');
  const [isSecurityLoading, setIsSecurityLoading] = useState<boolean>(false);
  const [selectedRawRecord, setSelectedRawRecord] = useState<Record<string, any> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load active status and historical datasets
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, historyRes, topoRes] = await Promise.all([
        DatasetApi.getStatus(),
        DatasetApi.getHistory(),
        ApiClient.getThreatGraphTopology()
      ]);
      setActiveStatus(statusRes);
      const history = historyRes.datasets || [];
      setDatasetHistory(history);

      // Auto-detect any active in-flight processing job from history
      if (!activeJobId) {
        const inProgress = history.find(d => ['QUEUED', 'VALIDATING', 'PROCESSING', 'INDEXING', 'ANALYZING'].includes(d.status));
        if (inProgress) {
          setActiveJobId(inProgress.id);
          setJobStartTime(Date.now());
        }
      }

      if (topoRes && topoRes.nodes && topoRes.nodes.length > 0) {
        setLiveNodes(topoRes.nodes.map(adaptDatasetNode));
        setLiveLinks((topoRes.links || []).map(adaptDatasetLink));
      }
    } catch (err: any) {
      console.error('Failed to load dataset status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Real-time polling timer when a job is active
  useEffect(() => {
    if (!activeJobId) return;

    const pollStatus = async () => {
      try {
        const status = await DatasetApi.getJobStatus(activeJobId);
        setJobStatus(status);

        if (jobStartTime) {
          setElapsedSeconds(Math.floor((Date.now() - jobStartTime) / 1000));
        }

        if (status.status === 'READY') {
          setActiveJobId(null);
          setActionMessage({
            type: 'success',
            text: `Dataset ${status.datasetId} (${status.filename}) processed successfully! ${status.valid_rows || status.validRows || 0} records indexed.`
          });
          refreshData();
        } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
          setActiveJobId(null);
          setActionMessage({
            type: 'error',
            text: `Dataset processing ${status.status.toLowerCase()}: ${status.error_message || 'Job terminated.'}`
          });
          refreshData();
        }
      } catch (err) {
        console.error('Polling job status error:', err);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 1500);

    return () => clearInterval(interval);
  }, [activeJobId, jobStartTime]);

  // Handle Kaggle Import Trigger
  const handleTriggerKaggleImport = async () => {
    setIsKaggleSubmitting(true);
    setActionMessage(null);

    try {
      const res = await DatasetApi.importKaggleDataset({
        datasetIdentifier: kaggleIdentifier.trim() || 'likkisamarthreddy/unsw15',
        maxRowsPerFile: kaggleRowLimit > 0 ? kaggleRowLimit : undefined,
        autoActivate: kaggleAutoActivate
      });

      if (res.success && res.data) {
        const jobId = res.data.dataset_id || res.data.datasetId;
        setActiveJobId(jobId);
        setJobStartTime(Date.now());
        setElapsedSeconds(0);
        setShowKaggleModal(false);

        setActionMessage({
          type: 'info',
          text: `Kaggle dataset UNSW-NB15 import initiated in background. Job ID: ${jobId}`
        });
        refreshData();
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to start Kaggle import'
      });
    } finally {
      setIsKaggleSubmitting(false);
    }
  };

  // Open Security Events Telemetry Drawer
  const handleOpenSecurityViewer = async (datasetId: string) => {
    setSelectedSecurityDatasetId(datasetId);
    setShowSecurityModal(true);
    setSecurityPage(0);
    loadSecurityTelemetry(datasetId, 0, securitySearch, securityCategory, securityProtocol);
  };

  const loadSecurityTelemetry = async (
    datasetId: string,
    page: number,
    search: string,
    cat: string,
    proto: string
  ) => {
    setIsSecurityLoading(true);
    try {
      const [statsRes, eventsRes] = await Promise.all([
        DatasetApi.getSecurityStatistics(datasetId).catch(() => null),
        DatasetApi.getSecurityEvents(datasetId, {
          limit: 20,
          offset: page * 20,
          search: search || undefined,
          attackCategory: cat !== 'ALL' ? cat : undefined,
          protocol: proto !== 'ALL' ? proto : undefined
        })
      ]);

      if (statsRes && statsRes.statistics) {
        setSecurityStats(statsRes.statistics);
      }
      if (eventsRes && eventsRes.events) {
        setSecurityEvents(eventsRes.events);
        setSecurityTotalEvents(eventsRes.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to load security telemetry:', err);
    } finally {
      setIsSecurityLoading(false);
    }
  };

  // Handle asynchronous file upload & job queueing
  const handleStartAsyncUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setActionMessage(null);

    try {
      const filesToSend = selectedFiles.length === 1 ? selectedFiles[0] : selectedFiles;
      const res = await DatasetApi.uploadDatasetAsync(filesToSend);
      if (res.success && res.data) {
        const jobId = res.data.dataset_id || res.data.datasetId;
        setActiveJobId(jobId);
        setJobStartTime(Date.now());
        setElapsedSeconds(0);
        setSelectedFiles([]);

        setActionMessage({
          type: 'info',
          text: `Dataset queued for background processing. Job ID: ${jobId}.`
        });
        refreshData();
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to upload dataset.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Cancel processing job
  const handleCancelJob = async () => {
    if (!activeJobId) return;
    try {
      await DatasetApi.cancelJob(activeJobId);
      setActionMessage({
        type: 'info',
        text: `Processing for job ${activeJobId} has been cancelled.`
      });
      setActiveJobId(null);
      setJobStatus(null);
      refreshData();
    } catch (err: any) {
      console.error('Cancel job failed:', err);
    }
  };

  // Activate a ready/archived dataset
  const handleActivateDataset = async (datasetId: string) => {
    try {
      setIsLoading(true);
      await DatasetApi.activateDataset(datasetId);
      setActionMessage({
        type: 'success',
        text: `Dataset ${datasetId} is now the active source of truth.`
      });
      await refreshData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to activate dataset.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View Error Report Modal
  const handleOpenErrorReport = async (datasetId: string) => {
    setIsErrorLoading(true);
    setShowErrorModal(true);
    try {
      const errReport = await DatasetApi.getErrorReports(datasetId);
      setErrorReportData(errReport);
    } catch (err) {
      console.error('Failed to load error report:', err);
    } finally {
      setIsErrorLoading(false);
    }
  };

  // Delete dataset
  const handleDeleteDataset = async (datasetId: string) => {
    if (!window.confirm(`Are you sure you want to remove dataset ${datasetId}?`)) return;
    try {
      setIsLoading(true);
      await DatasetApi.deleteDataset(datasetId);
      setActionMessage({
        type: 'success',
        text: `Dataset ${datasetId} was deleted.`
      });
      await refreshData();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to delete dataset.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add files to selection queue
  const handleAddFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    setSelectedFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name.toLowerCase()));
      const filtered = fileArray.filter(f => !existingNames.has(f.name.toLowerCase()));
      return [...prev, ...filtered];
    });
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 font-mono-code">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1e90ff]/10 border border-[#1e90ff]/30 rounded-xl text-[#38bdf8]">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Scalable Dataset Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/30">
                ASYNC CHUNKED STREAMING
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              High-throughput ingestion supporting large CSV & Excel workbooks, plus automated Kaggle UNSW-NB15 network threat ingestion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKaggleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1e90ff] to-blue-600 hover:from-[#1e90ff]/80 hover:to-blue-500 text-white text-sm font-bold rounded-lg shadow-md transition cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span>Import from Kaggle</span>
          </button>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#020713]/60 hover:bg-[#1e90ff]/20 text-slate-200 text-sm font-medium rounded-lg border border-[#1e3a6a] transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#38bdf8]' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-sm backdrop-blur-md ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : actionMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-[#1e90ff]/10 border-[#1e90ff]/30 text-[#38bdf8]'
        }`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {actionMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {actionMessage.type === 'info' && <Info className="w-5 h-5 text-[#38bdf8] shrink-0" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 2. Real-Time Active Job Progress Drawer */}
      {(activeJobId || (jobStatus && ['QUEUED', 'VALIDATING', 'PROCESSING', 'INDEXING', 'ANALYZING'].includes(jobStatus.status))) && (
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/30 p-5 rounded-xl shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1e90ff]/20 border border-[#1e90ff]/40 rounded-xl text-[#38bdf8] animate-pulse">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Processing Dataset: {jobStatus?.filename || 'Active Ingestion'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40 font-mono">
                    {jobStatus?.currentStage || 'STREAMING'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Job ID: {activeJobId || jobStatus?.datasetId} • Running asynchronously in background worker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
              </span>
              <button
                onClick={handleCancelJob}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Cancel Job</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>{jobStatus?.progressPercent || 5}% Complete</span>
              <span>
                {jobStatus?.processedRows ? jobStatus.processedRows.toLocaleString() : 0} / {jobStatus?.totalRows ? jobStatus.totalRows.toLocaleString() : 'Estimating'} rows
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-[#1e90ff] to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, jobStatus?.progressPercent || 5)}%` }}
              />
            </div>
          </div>

          {/* Telemetry Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#020713]/50 p-2.5 rounded-lg border border-[#1e3a6a]">
              <span className="text-slate-500 block font-sans text-[11px]">Valid Ingested Rows</span>
              <span className="font-bold text-emerald-400">{jobStatus?.validRows ? jobStatus.validRows.toLocaleString() : 0}</span>
            </div>
            <div className="bg-[#020713]/50 p-2.5 rounded-lg border border-[#1e3a6a]">
              <span className="text-slate-500 block font-sans text-[11px]">Invalid Rows Logged</span>
              <span className="font-bold text-amber-400">{jobStatus?.invalidRows ? jobStatus.invalidRows.toLocaleString() : 0}</span>
            </div>
            <div className="bg-[#020713]/50 p-2.5 rounded-lg border border-[#1e3a6a]">
              <span className="text-slate-500 block font-sans text-[11px]">Entities Extracted</span>
              <span className="font-bold text-[#38bdf8]">{jobStatus?.entityCount ? jobStatus.entityCount.toLocaleString() : 0}</span>
            </div>
            <div className="bg-[#020713]/50 p-2.5 rounded-lg border border-[#1e3a6a]">
              <span className="text-slate-500 block font-sans text-[11px]">Relationships Derived</span>
              <span className="font-bold text-purple-400">{jobStatus?.relationshipCount ? jobStatus.relationshipCount.toLocaleString() : 0}</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. Ingestion Control Panels (Manual File Upload + Kaggle Quick Access) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dropzone Upload (2 cols) */}
        <div className="lg:col-span-2 bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#38bdf8]" />
            Upload Local Dataset (.csv / .xlsx / .xls)
          </h2>

          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleAddFiles(e.dataTransfer.files);
              }
            }}
            className="border-2 border-dashed border-[#1e3a6a] hover:border-[#1e90ff] bg-[#020713]/40 hover:bg-[#020713]/60 p-7 rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center space-y-2.5"
          >
            <div className="p-3 bg-[#020713]/60 rounded-full text-[#38bdf8]">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop CSV or Excel files here, or <span className="text-[#38bdf8] underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Large file chunking & memory safety enabled.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleAddFiles(e.target.files);
              }}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-[#020713]/60 border border-[#1e3a6a] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Files ({selectedFiles.length})
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-slate-500 hover:text-rose-400 font-semibold cursor-pointer"
                >
                  Clear Queue
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {selectedFiles.map((f, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#030a1a] p-2.5 rounded-lg text-xs border border-[#1e3a6a]/40">
                    <div className="flex items-center gap-2 truncate">
                      <FileSpreadsheet className="w-4 h-4 text-[#38bdf8] shrink-0" />
                      <span className="text-slate-200 font-medium truncate">{f.name}</span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleStartAsyncUpload}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Process in Background</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kaggle UNSW-NB15 Quick Hub Card (1 col) */}
        <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-6 rounded-xl shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-1.5">
                <Network className="w-4 h-4" />
                Network Intelligence Suite
              </span>
              <span className="text-[10px] bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/30 px-2 py-0.5 rounded-full font-mono">
                KAGGLE HUB
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              UNSW-NB15 Benchmark Dataset
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ingest 1.26M+ normalized network intrusion flow records (DDoS, DoS, MQTT, Recon, Benign) into dedicated high-performance database tables.
            </p>

            <div className="space-y-1.5 text-[11px] font-mono text-slate-400 bg-[#020713]/60 p-3 rounded-lg border border-[#1e3a6a]">
              <div>• Dataset: <span className="text-[#38bdf8]">likkisamarthreddy/unsw15</span></div>
              <div>• Tables: <span className="text-emerald-300">security_events & graph_entities</span></div>
              <div>• Features: <span className="text-purple-300">46 network telemetry attributes</span></div>
            </div>
          </div>

          <button
            onClick={() => setShowKaggleModal(true)}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-[#1e90ff] hover:from-blue-500 hover:to-[#1e90ff]/80 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Kaggle Ingestion Modal</span>
          </button>
        </div>

      </div>

      {/* 4. Historical & Available Datasets Registry */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 rounded-xl overflow-hidden shadow-lg space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#38bdf8]" />
              Intelligence Datasets Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Isolated datasets with atomic activation, row metrics, and invalid row telemetry.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Datasets: {datasetHistory.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#020713]/60 text-slate-400 uppercase font-semibold tracking-wider border-b border-[#1e90ff]/20">
              <tr>
                <th className="py-3 px-4">Dataset ID</th>
                <th className="py-3 px-4">Dataset / Source</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Records / Rows</th>
                <th className="py-3 px-4">Entities / Links</th>
                <th className="py-3 px-4">Uploaded At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {datasetHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No datasets found in intelligence database.
                  </td>
                </tr>
              ) : (
                datasetHistory.map((ds) => {
                  const isActive = ds.status === 'ACTIVE';
                  const isReady = ds.status === 'READY';
                  const isProc = ds.status === 'PROCESSING' || ds.status === 'QUEUED';
                  const isFailed = ds.status === 'FAILED';
                  const isKaggle = (ds as any).source === 'KAGGLE' || (ds as any).datasetType === 'NETWORK_SECURITY_DATASET' || ds.filename.includes('UNSW-NB15');

                  return (
                    <tr key={ds.id} className={`hover:bg-slate-800/40 transition ${isActive ? 'bg-cyan-950/20' : ''}`}>
                      <td className="py-3 px-4 font-bold text-slate-300">
                        {ds.id}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          {isKaggle ? (
                            <Network className="w-4 h-4 text-blue-400 shrink-0" />
                          ) : (
                            <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
                          )}
                          <span className="truncate max-w-[220px]">{ds.filename}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {isKaggle ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            NETWORK SUITE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            DARK WEB
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isActive 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                            : isReady
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : isProc
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                                : isFailed
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {ds.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>{ds.rowsCount ? ds.rowsCount.toLocaleString() : (ds.totalRows || 0).toLocaleString()} rows</div>
                        {ds.invalidRows ? (
                          <div 
                            onClick={() => handleOpenErrorReport(ds.id)}
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            {ds.invalidRows} invalid rows (view)
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div>{ds.entitiesCount || ds.accountsCount || 0} entities</div>
                        <div className="text-[10px] text-slate-500">{ds.relationshipsCount || 0} links</div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-400 text-[11px]">
                        {ds.uploadedAt ? new Date(ds.uploadedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          {isKaggle && (
                            <button
                              onClick={() => handleOpenSecurityViewer(ds.id)}
                              className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded text-xs font-semibold flex items-center gap-1 transition"
                              title="Inspect Network Security Telemetry"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Telemetry</span>
                            </button>
                          )}
                          {!isActive && (isReady || ds.status === 'ARCHIVED') && (
                            <button
                              onClick={() => handleActivateDataset(ds.id)}
                              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold transition"
                            >
                              Activate
                            </button>
                          )}
                          {isActive && (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-xs font-bold">
                              Active
                            </span>
                          )}
                          {isProc && (
                            <button
                              onClick={() => {
                                setActiveJobId(ds.id);
                                setJobStartTime(Date.now());
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold transition"
                            >
                              Track
                            </button>
                          )}
                          {!isActive && (
                            <button
                              onClick={() => handleDeleteDataset(ds.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                              title="Delete dataset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Kaggle Ingestion Modal */}
      {showKaggleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Import UNSW-NB15 from Kaggle Hub
                </h3>
              </div>
              <button
                onClick={() => setShowKaggleModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Kaggle Dataset Identifier
                </label>
                <input
                  type="text"
                  value={kaggleIdentifier}
                  onChange={(e) => setKaggleIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. likkisamarthreddy/unsw15"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Downloads files directly using KaggleHub cache with zero manual zip downloads.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Sample Size Per Flow File
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '10,000', value: 10000 },
                    { label: '25,000', value: 25000 },
                    { label: '50,000', value: 50000 },
                    { label: 'All Rows (~1.26M)', value: 0 }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setKaggleRowLimit(opt.value)}
                      className={`p-2.5 rounded-lg border text-center font-semibold transition ${
                        kaggleRowLimit === opt.value
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  id="autoActivateKaggle"
                  checked={kaggleAutoActivate}
                  onChange={(e) => setKaggleAutoActivate(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="autoActivateKaggle" className="text-slate-300 text-xs cursor-pointer">
                  Automatically set as Active Source of Truth upon completion
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowKaggleModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerKaggleImport}
                disabled={isKaggleSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {isKaggleSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Initiating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Ingestion Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Security Events Telemetry & Flow Viewer Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl max-h-[90vh] rounded-2xl p-6 shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>UNSW-NB15 Security Telemetry Explorer</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                      {selectedSecurityDatasetId}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Normalized network intrusion events, attack breakdown, and 46-feature forensic flow inspector.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Metrics Overview Cards */}
            {securityStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block font-sans text-[11px]">Total Flows Monitored</span>
                  <span className="font-bold text-slate-200 text-sm">{securityStats.total_records?.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block font-sans text-[11px]">Attack Flows / Ratio</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {securityStats.attack_records?.toLocaleString()} ({securityStats.attack_percentage}%)
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block font-sans text-[11px]">Unique Threat IPs</span>
                  <span className="font-bold text-amber-400 text-sm">{securityStats.unique_source_ips} Sources</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block font-sans text-[11px]">Traffic Volume</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {(securityStats.traffic_volume_bytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <input
                  type="text"
                  value={securitySearch}
                  onChange={(e) => {
                    setSecuritySearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedSecurityDatasetId) {
                      setSecurityPage(0);
                      loadSecurityTelemetry(selectedSecurityDatasetId, 0, securitySearch, securityCategory, securityProtocol);
                    }
                  }}
                  placeholder="Filter by IP, Protocol, Service, or Category..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (selectedSecurityDatasetId) {
                      setSecurityPage(0);
                      loadSecurityTelemetry(selectedSecurityDatasetId, 0, securitySearch, securityCategory, securityProtocol);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-semibold"
                >
                  Search
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Category:</span>
                  <select
                    value={securityCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSecurityCategory(val);
                      if (selectedSecurityDatasetId) {
                        setSecurityPage(0);
                        loadSecurityTelemetry(selectedSecurityDatasetId, 0, securitySearch, val, securityProtocol);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Normal">Normal</option>
                    <option value="DDoS">DDoS</option>
                    <option value="DoS">DoS</option>
                    <option value="Reconnaissance">Reconnaissance</option>
                    <option value="MQTT Exploitation">MQTT Exploitation</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Protocol:</span>
                  <select
                    value={securityProtocol}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSecurityProtocol(val);
                      if (selectedSecurityDatasetId) {
                        setSecurityPage(0);
                        loadSecurityTelemetry(selectedSecurityDatasetId, 0, securitySearch, securityCategory, val);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value="ALL">All Protocols</option>
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                    <option value="ARP">ARP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {isSecurityLoading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                  Streaming security flow records...
                </div>
              ) : securityEvents.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  No matching security events found.
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold tracking-wider sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Event ID</th>
                      <th className="py-2.5 px-3">Source $\to$ Target</th>
                      <th className="py-2.5 px-3">Proto / Port</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Volume</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3 text-right">Raw Flow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {securityEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-800/50">
                        <td className="py-2 px-3 text-slate-400 font-bold">
                          {ev.id}
                        </td>
                        <td className="py-2 px-3 text-slate-200">
                          <span className={ev.isAttack ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                            {ev.sourceIp}
                          </span>
                          <span className="text-slate-500 mx-1.5">$\to$</span>
                          <span className="text-cyan-300">{ev.destinationIp}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-300">
                          <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 mr-1.5 font-bold">
                            {ev.protocol}
                          </span>
                          <span>:{ev.destinationPort}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            ev.isAttack
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {ev.attackCategory || (ev.isAttack ? 'Attack' : 'Normal')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">
                          {ev.bytesSource ? `${Math.round(ev.bytesSource)} B` : '-'}
                        </td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">
                          {ev.duration ? `${ev.duration}s` : '0s'}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => setSelectedRawRecord(ev.rawRecord || ev)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded text-[10px] font-bold transition"
                          >
                            JSON
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <span className="text-slate-400 font-mono">
                Showing {securityEvents.length} of {securityTotalEvents.toLocaleString()} records
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={securityPage === 0}
                  onClick={() => {
                    const newP = securityPage - 1;
                    setSecurityPage(newP);
                    if (selectedSecurityDatasetId) {
                      loadSecurityTelemetry(selectedSecurityDatasetId, newP, securitySearch, securityCategory, securityProtocol);
                    }
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-slate-400 font-mono px-2">
                  Page {securityPage + 1}
                </span>
                <button
                  disabled={(securityPage + 1) * 20 >= securityTotalEvents}
                  onClick={() => {
                    const newP = securityPage + 1;
                    setSecurityPage(newP);
                    if (selectedSecurityDatasetId) {
                      loadSecurityTelemetry(selectedSecurityDatasetId, newP, securitySearch, securityCategory, securityProtocol);
                    }
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. Raw Record JSON Inspector Modal */}
      {selectedRawRecord && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Activity className="w-4 h-4 text-cyan-400" />
                Raw UNSW-NB15 46-Feature Telemetry JSON
              </h3>
              <button
                onClick={() => setSelectedRawRecord(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96 border border-slate-800">
              {JSON.stringify(selectedRawRecord, null, 2)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRawRecord(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Error Report Modal (When invalid rows occur) */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Dataset Row-Level Error Report
                </h3>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {isErrorLoading ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                Loading error records...
              </div>
            ) : errorReportData && errorReportData.errors.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-xs">
                {errorReportData.errors.map((err) => (
                  <div key={err.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
                    <div>
                      <div className="text-slate-200 font-semibold">Row #{err.rowNumber} • Field: <span className="text-amber-400">{err.field}</span></div>
                      <div className="text-slate-400 mt-0.5">{err.error}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{err.sheetName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No error rows recorded for this dataset.
              </p>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
