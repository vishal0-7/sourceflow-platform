import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UploadCloud, FileText, CheckCircle2, Shield, Sparkles, FileSpreadsheet, Image } from 'lucide-react';
import { calculateFileSHA256 } from '../../utils/hash';

interface FileUploadDropzoneProps {
  onFileIngested: () => void;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ onFileIngested }) => {
  const { uploadSourceFile, activeJob } = useAppStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    await uploadSourceFile(file);
    setIsProcessing(false);
    onFileIngested();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const loadDemoPreset = async (title: string, sizeMB: number, type: 'PDF' | 'DOCX') => {
    // Generate simulated File object with actual content bytes to compute real Web Crypto SHA-256
    const dummyContent = `SOURCEFLOW INSTITUTIONAL DATASET\nTITLE: ${title}\nTIMESTAMP: ${new Date().toISOString()}\nCONTENT: Comprehensive institutional assessment and telemetry audit baseline.`;
    const blob = new Blob([dummyContent], { type: type === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const file = new File([blob], `${title.replace(/\s+/g, '-')}.${type.toLowerCase()}`, { type: blob.type });
    await processFile(file);
  };

  return (
    <div className="space-y-space-md">
      <div>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
          Source Ingestion & Dossier Upload
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          Ingest institutional PDFs, documents, or data packages. Client-side SHA-256 is computed via Web Crypto API.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-secondary bg-secondary-container/20 scale-[1.01]'
            : 'border-outline-variant hover:border-secondary/80 bg-surface-container-lowest hover:bg-surface-container-low'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.png,.jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-3">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h4 className="font-headline-sm font-bold text-on-surface text-sm">
          {isProcessing ? 'Computing Web Crypto SHA-256 Hash...' : 'Drag & Drop Source Dossier (PDF Priority)'}
        </h4>
        <p className="font-body-sm text-xs text-on-surface-variant mt-1">
          Supported Formats: <strong className="text-on-surface">.PDF</strong> (Primary), .DOCX, .TXT, .IMAGE (Max 50MB)
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5 font-code-sm text-[10px]">
          <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">PDF (Recommended)</span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">DOCX</span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">JSON-LD</span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">TXT</span>
        </div>
      </div>

      {/* Demo Benchmark Presets */}
      <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/80 space-y-2">
        <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
          Quick Demo Benchmark Presets (One-Click Ingestion):
        </span>

        <div className="space-y-1.5">
          <button
            onClick={() => loadDemoPreset('Regional Power Grid Telemetry & Incident Report', 14.8, 'PDF')}
            className="w-full text-left p-2.5 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
              <div>
                <p className="font-bold text-on-surface">Regional Power Grid Telemetry & Compliance Dossier</p>
                <p className="font-code-sm text-[10px] text-on-surface-variant">PDF • 14.8 MB • 24 Pages • 23 Claims</p>
              </div>
            </div>
            <span className="font-code-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-semibold">
              Select Preset
            </span>
          </button>

          <button
            onClick={() => loadDemoPreset('National Renewable Energy Integration Assessment', 8.2, 'PDF')}
            className="w-full text-left p-2.5 rounded bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-on-surface">Renewable Grid Integration Strategy 2026–2030</p>
                <p className="font-code-sm text-[10px] text-on-surface-variant">PDF • 8.2 MB • 32 Pages • 34 Claims</p>
              </div>
            </div>
            <span className="font-code-sm text-[10px] bg-surface-container text-on-surface font-semibold">
              Select Preset
            </span>
          </button>
        </div>
      </div>

      {/* Active Ingested Document Digest Card */}
      {activeJob && (
        <div className="p-3.5 rounded-lg bg-surface-container-lowest border border-outline-variant space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-label-caps uppercase text-on-surface-variant font-bold">Active Ingestion Target</span>
            <Badge status={activeJob.status} />
          </div>
          <p className="font-body-sm font-bold text-on-surface">{activeJob.title}</p>
          <div className="p-2 rounded bg-surface-container-low font-mono text-[11px] text-on-surface-variant flex items-center justify-between">
            <span className="truncate max-w-[240px]">SHA-256: {activeJob.sha256}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">VERIFIED</span>
          </div>
        </div>
      )}
    </div>
  );
};
