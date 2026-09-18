// ============================================================
// UNMASK // DATASET UPLOAD & PROCESSING STEPPER MODAL
// High-tech Cyber Intelligence Dataset Ingestion & Validation
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Database, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Layers,
  Cpu,
  Table as TableIcon,
  Target,
  ShieldCheck,
  Download
} from 'lucide-react';
import { 
  DatasetGraphProcessor, 
  type DatasetValidationResult,
  type SuspectAttribution
} from '../../services/datasetGraphProcessor';
import { IntelligenceExporter } from '../../services/intelligenceExporter';
import { useDataset } from '../../context/DatasetContext';

const PROCESSING_STEPS = [
  { id: 1, title: 'Uploading Dataset', desc: 'Ingesting raw binary telemetry file' },
  { id: 2, title: 'Validating Data', desc: 'Verifying structure, types & headers' },
  { id: 3, title: 'Normalizing Entities', desc: 'Mapping synonyms to intelligence schema' },
  { id: 4, title: 'Detecting Relationships', desc: 'Extracting deterministic cross-platform links' },
  { id: 5, title: 'Calculating Analytical Risk Scores', desc: 'Evaluating multi-signal risk metrics' },
  { id: 6, title: 'Building Threat Graph', desc: 'Constructing 3D/2D topological matrix' },
  { id: 7, title: 'Graph Ready', desc: 'Visualizing dynamic intelligence network' }
];

interface DatasetUploadModalProps {
  onInspectSuspect?: (actorName: string) => void;
  onExploreGraph?: (actorName: string) => void;
}

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({
  onInspectSuspect,
  onExploreGraph
}) => {
  const { isUploadModalOpen, closeUploadModal, uploadAndProcessFile } = useDataset();
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [fileType, setFileType] = useState<'CSV' | 'JSON' | 'XLSX' | null>(null);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
  const [validationResult, setValidationResult] = useState<DatasetValidationResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [identifiedSuspect, setIdentifiedSuspect] = useState<SuspectAttribution | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset states on modal open/close
  useEffect(() => {
    if (isUploadModalOpen) {
      setFile(null);
      setParsedRows([]);
      setFileType(null);
      setColumnMappings({});
      setValidationResult(null);
      setIsProcessing(false);
      setActiveStep(0);
      setProcessingError(null);
      setIsSuccess(false);
      setIdentifiedSuspect(null);
    }
  }, [isUploadModalOpen]);

  if (!isUploadModalOpen) return null;

  const handleFileSelect = async (selectedFile: File) => {
    setProcessingError(null);
    setValidationResult(null);
    try {
      const { records, fileType: detectedType } = await DatasetGraphProcessor.parseFile(selectedFile);
      const cols = Object.keys(records[0] || {});
      const mappings = DatasetGraphProcessor.detectColumnMappings(cols);

      setFile(selectedFile);
      setFileType(detectedType);
      setParsedRows(records);
      setColumnMappings(mappings);
    } catch (err: any) {
      setProcessingError(err.message || 'Failed to read dataset file.');
      setFile(null);
      setParsedRows([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleValidate = () => {
    if (!parsedRows.length) return;
    const report = DatasetGraphProcessor.validateDataset(parsedRows, columnMappings);
    setValidationResult(report);
  };

  const handleGenerateGraph = async () => {
    if (!file || !parsedRows.length) return;

    setIsProcessing(true);
    setProcessingError(null);
    setActiveStep(1);

    try {
      // Step-by-step timed animation for smooth UI feedback
      for (let s = 1; s <= 7; s++) {
        setActiveStep(s);
        // Realistic step delays
        await new Promise(r => setTimeout(r, s === 4 || s === 6 ? 380 : 260));
      }

      const result = await uploadAndProcessFile(file, (step) => {
        setActiveStep(step);
      });

      if (result && result.primeSuspect) {
        setIdentifiedSuspect(result.primeSuspect);
      }
      setIsSuccess(true);
    } catch (err: any) {
      setIsProcessing(false);
      setProcessingError(err.message || 'Error processing dataset.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono-code animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#070e1c] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-500/20 bg-[#0b1428] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-cyan-400 tracking-wider">UNMASK INTELLIGENCE INGESTION</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                  CSV · JSON · XLSX
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Upload Dataset → Dynamic Threat Graph
              </h2>
            </div>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Processing / Result View */}
          {isProcessing ? (
            isSuccess && identifiedSuspect ? (
              /* Success / Result View: Prime Suspect Identified from Uploaded Dataset */
              <div className="py-2 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Dataset Analysis Complete // Main Suspect Identified
                  </h3>
                  <p className="text-xs text-slate-300 max-w-lg mx-auto">
                    Analyzed <strong className="text-cyan-300">{parsedRows.length} records</strong> from <span className="font-mono text-white underline">{file?.name}</span>. Multi-signal graph correlation has identified the following prime threat entity:
                  </p>
                </div>

                {/* Suspect Identification Dossier Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#06183d] via-[#020b1f] to-[#04112b] border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/50 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                        <Target className="w-3.5 h-3.5 text-rose-400" />
                        MAIN SUSPECT IDENTIFIED
                      </span>
                      <span className="text-xs text-slate-400">Entity Type: <strong className="text-cyan-300">{identifiedSuspect.type}</strong></span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Attribution Confidence</span>
                        <span className="text-xl font-black text-emerald-400 font-mono drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                          {identifiedSuspect.confidenceScore}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Threat Level</span>
                        <span className={`text-sm font-black font-mono ${
                          identifiedSuspect.riskLevel === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {identifiedSuspect.riskLevel} ({identifiedSuspect.riskScore}/100)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suspect Name & Category */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Suspect Identifier / Name</span>
                    <h2 className="text-2xl font-black text-white font-mono tracking-wider text-cyan-200">
                      {identifiedSuspect.name}
                    </h2>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {identifiedSuspect.category}
                    </p>
                  </div>

                  {/* Grounded "WHY" Reasons extracted from the uploaded CSV */}
                  <div className="p-4 bg-[#020713]/80 rounded-xl border border-cyan-500/30 space-y-2.5">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      The "Why" — Evidence Derived Directly From Your Uploaded CSV:
                    </span>
                    
                    <ul className="space-y-2 text-xs text-slate-200">
                      {identifiedSuspect.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-cyan-400 font-bold shrink-0 mt-0.5">▶</span>
                          <span className="leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Associated Indicators from file */}
                  {identifiedSuspect.associatedEntities.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Linked Indicators Discovered in Your File:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {identifiedSuspect.associatedEntities.map((ent, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5">
                            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 font-bold">{ent.type}</span>
                            <span className="truncate max-w-[200px]" title={ent.value}>{ent.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      IntelligenceExporter.downloadSuspectAttributionCSV(
                        identifiedSuspect,
                        [],
                        file?.name || 'Uploaded_Telemetry'
                      );
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center space-x-2 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
                    title="Download complete suspect attribution and evidence chain as CSV"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Suspect Findings (.CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      closeUploadModal();
                      onExploreGraph?.(identifiedSuspect.name);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Explore in 3D Threat Graph</span>
                  </button>

                  <button
                    onClick={() => {
                      closeUploadModal();
                      onInspectSuspect?.(identifiedSuspect.name);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                  >
                    <span>Inspect Full Suspect Dossier (Why)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={closeUploadModal}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Ingesting & Compiling Intelligence Matrix</h3>
                  <p className="text-xs text-slate-400">
                    Executing deterministic entity normalization and multi-signal risk topology...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(activeStep / PROCESSING_STEPS.length) * 100}%` }}
                  />
                </div>

                {/* Steps List */}
                <div className="space-y-2.5 max-w-lg mx-auto">
                  {PROCESSING_STEPS.map(step => {
                    const isDone = activeStep > step.id || (activeStep === 7 && isSuccess);
                    const isCurrent = activeStep === step.id && !isSuccess;
                    return (
                      <div 
                        key={step.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                          isDone 
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                            : isCurrent
                            ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : 'bg-slate-900/30 border-slate-800/60 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone 
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-cyan-500 text-slate-950 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
                          </div>
                          <div>
                            <span className="font-semibold block">{step.title}</span>
                            <span className="text-[10px] opacity-75">{step.desc}</span>
                          </div>
                        </div>

                        <div>
                          {isDone && <span className="text-emerald-400 font-bold text-[11px]">✓ Ready</span>}
                          {isCurrent && <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <>
              {/* Dropzone / File Picker */}
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'border-slate-800 hover:border-cyan-500/50 bg-[#091122]/60 hover:bg-[#091122]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.json,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Drag & Drop Dataset File Here
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Support for dark web dumps, forum telemetry, crypto transactions, and intelligence spreadsheets (.CSV, .JSON, .XLSX).
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 text-xs font-bold transition-all shadow-sm"
                  >
                    Select Local Dataset
                  </button>
                </div>
              ) : (
                /* File Loaded & Preview Card */
                <div className="space-y-4">
                  {/* File Metadata Pill */}
                  <div className="p-4 bg-[#0a1426] border border-cyan-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{file.name}</span>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                            {fileType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span className="text-cyan-300 font-semibold">{parsedRows.length.toLocaleString()} Records</span>
                          <span>•</span>
                          <span>{Object.keys(columnMappings).length} Columns</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFile(null);
                        setParsedRows([]);
                        setValidationResult(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
                    >
                      Change File
                    </button>
                  </div>

                  {/* Detected Column Role Mappings */}
                  <div className="p-3.5 bg-[#091122] rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                      Detected Column Entity Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(columnMappings).map(([col, role]) => (
                        <span 
                          key={col}
                          className="px-2.5 py-1 rounded bg-[#070d1a] border border-slate-700 text-[11px] text-slate-300 flex items-center space-x-1.5"
                        >
                          <span className="font-semibold text-slate-200">{col}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-cyan-400 font-bold uppercase">{role}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Raw Data Preview Table (First 5 Rows) */}
                  <div className="p-3 bg-[#091122] rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                        Dataset Preview (First {Math.min(5, parsedRows.length)} rows)
                      </span>
                      <span className="text-[10px] text-slate-500">Total: {parsedRows.length} entries</span>
                    </div>

                    <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-44">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead className="bg-[#0b1428] text-slate-300 border-b border-slate-800 font-bold sticky top-0">
                          <tr>
                            <th className="p-2 border-r border-slate-800 text-slate-500 w-10">#</th>
                            {Object.keys(columnMappings).map(col => (
                              <th key={col} className="p-2 border-r border-slate-800 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span>{col}</span>
                                  <span className="text-[9px] text-cyan-400 font-normal uppercase">
                                    {columnMappings[col]}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {parsedRows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/50">
                              <td className="p-2 border-r border-slate-800 text-slate-500">{idx + 1}</td>
                              {Object.keys(columnMappings).map(col => (
                                <td key={col} className="p-2 border-r border-slate-800 whitespace-nowrap max-w-[180px] truncate">
                                  {String(row[col] ?? '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Validation Feedback Alert */}
                  {validationResult && (
                    <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                      validationResult.isValid
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/20 border-red-500/40 text-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 font-bold">
                        {validationResult.isValid ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Dataset Validation Passed: Ready for Graph Ingestion</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>Dataset Validation Issues</span>
                          </>
                        )}
                      </div>

                      {validationResult.isValid && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                          <div className="bg-[#050e18] p-2 rounded border border-emerald-500/20">
                            <span className="text-slate-400 block">Total Records:</span>
                            <strong className="text-emerald-300">{validationResult.recordCount}</strong>
                          </div>
                          <div className="bg-[#050e18] p-2 rounded border border-emerald-500/20">
                            <span className="text-slate-400 block">Unique Entities:</span>
                            <strong className="text-cyan-300">
                              {validationResult.detectedEntities.reduce((acc, e) => acc + e.count, 0)}
                            </strong>
                          </div>
                          <div className="bg-[#050e18] p-2 rounded border border-emerald-500/20">
                            <span className="text-slate-400 block">Est. Relationships:</span>
                            <strong className="text-purple-300">{validationResult.detectedRelationshipCount}</strong>
                          </div>
                          <div className="bg-[#050e18] p-2 rounded border border-emerald-500/20">
                            <span className="text-slate-400 block">24h Timestamps:</span>
                            <strong className={validationResult.hasTimestamps ? 'text-emerald-300' : 'text-amber-400'}>
                              {validationResult.hasTimestamps ? 'Detected ✓' : 'None'}
                            </strong>
                          </div>
                        </div>
                      )}

                      {validationResult.warnings.length > 0 && (
                        <div className="text-[11px] text-amber-300 pt-1 space-y-0.5">
                          {validationResult.warnings.map((w, i) => (
                            <div key={i} className="flex items-center space-x-1.5">
                              <span className="text-amber-400">•</span>
                              <span>{w}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {validationResult.errors.length > 0 && (
                        <div className="text-[11px] text-red-300 pt-1 space-y-0.5">
                          {validationResult.errors.map((err, i) => (
                            <div key={i} className="flex items-center space-x-1.5">
                              <span className="text-red-400">•</span>
                              <span>{err}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error Alert */}
                  {processingError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{processingError}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isProcessing && (
          <div className="px-6 py-4 border-t border-cyan-500/20 bg-[#0b1428] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={closeUploadModal}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            {file && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 rounded-lg bg-[#142036] hover:bg-[#1b2b48] border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
                >
                  Validate Dataset
                </button>

                <button
                  onClick={handleGenerateGraph}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Threat Graph</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
