import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { FileType } from '../../types/transformation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  Globe,
  Film,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  ShieldCheck
} from 'lucide-react';

interface Step1SourceProps {
  onContinue: () => void;
}

export const Step1Source: React.FC<Step1SourceProps> = ({ onContinue }) => {
  const { uploadSourceFile, analyzeSource, transformation } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setIsProcessing(true);
    await uploadSourceFile(file);
    await analyzeSource();
    setIsProcessing(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const loadPreset = async (name: string, _type: FileType, _sizeBytes: number) => {
    setIsProcessing(true);
    const dummyBlob = new Blob([`SOURCEFLOW SAMPLE CONTENT: ${name}`], { type: 'application/pdf' });
    const file = new File([dummyBlob], name, { type: 'application/pdf' });
    await uploadSourceFile(file);
    await analyzeSource();
    setIsProcessing(false);
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsProcessing(true);
    const dummyBlob = new Blob([`ARTICLE CONTENT FROM ${urlInput}`], { type: 'text/plain' });
    const file = new File([dummyBlob], `${urlInput.replace(/https?:\/\//, '').slice(0, 30)}.txt`, { type: 'text/plain' });
    await uploadSourceFile(file);
    await analyzeSource();
    setIsProcessing(false);
  };

  const formatIcons: { type: FileType; label: string; icon: React.ReactNode }[] = [
    { type: 'PDF', label: 'PDF Document', icon: <FileText className="w-3.5 h-3.5" /> },
    { type: 'DOCX', label: 'Word Document', icon: <FileCode className="w-3.5 h-3.5" /> },
    { type: 'XLSX', label: 'Spreadsheet', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { type: 'TXT', label: 'Plain Text', icon: <FileText className="w-3.5 h-3.5" /> },
    { type: 'PNG', label: 'Image (PNG/JPG)', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { type: 'MP4', label: 'Video (MP4)', icon: <Film className="w-3.5 h-3.5" /> },
    { type: 'URL', label: 'Article URL', icon: <Globe className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="font-headline-md text-xl font-bold text-on-surface">
          Add your source
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
          Upload the trusted information you want to transform.
        </p>
      </div>

      {/* Supported Formats Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-bold">
          Supported Formats:
        </span>
        {formatIcons.map(f => (
          <span
            key={f.type}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/60 font-code-sm text-[11px] text-on-surface"
          >
            {f.icon}
            <span>{f.type}</span>
          </span>
        ))}
      </div>

      {/* Upload Box / URL Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-1 transition-colors border-b-2 ${
              activeTab === 'upload' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            File Upload (PDF, DOCX, XLSX, TXT, Media)
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-1 transition-colors border-b-2 ${
              activeTab === 'url' ? 'border-secondary text-secondary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Article or Webpage URL
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-outline-variant hover:border-secondary/80 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xs"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.txt,.png,.jpg,.jpeg,.mp4"
              onChange={e => e.target.files && handleProcessFile(e.target.files[0])}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="font-headline-md text-base font-bold text-on-surface">
              {isProcessing ? 'Computing SHA-256 Checksum...' : 'Drop your document here or click to browse'}
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-md">
              Client-side cryptographic hashing via Web Crypto API ensures authentic provenance verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://agency.gov/reports/annual-cybersecurity-threat-intelligence"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
              <Button variant="primary" size="md" type="submit" disabled={isProcessing}>
                {isProcessing ? 'Ingesting...' : 'Import URL'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Preset Documents */}
      <div className="space-y-2">
        <span className="font-body-sm text-xs text-on-surface-variant font-medium">
          Or select an official benchmark sample document:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => loadPreset('Cybersecurity Threat Intelligence Research Report.pdf', 'PDF', 2936012)}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer space-y-1 ${
              transformation.source.name.includes('Cybersecurity')
                ? 'bg-secondary-fixed/20 border-secondary shadow-2xs'
                : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-secondary" />
                Cybersecurity Threat Intelligence Research Report
              </span>
              <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.5 rounded font-bold text-secondary">
                SELECTED
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-code-sm">
              PDF • 2.8 MB • 20 Pages • 23 Verifiable Claims
            </p>
          </div>

          <div
            onClick={() => loadPreset('Zero Trust Network Architecture Compliance Appraisal.pdf', 'PDF', 3565158)}
            className="p-3.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/80 hover:border-secondary cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                Zero Trust Network Architecture Compliance Appraisal
              </span>
              <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">
                PDF
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-code-sm">
              PDF • 3.4 MB • 24 Pages • 23 Verifiable Claims
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Document Info Card & Action CTA */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-tertiary-fixed flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-on-surface">
                {transformation.source.name}
              </h4>
              <span className="text-[10px] font-code-sm font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                UPLOADED & ATTESTED
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant font-code-sm mt-0.5">
              {transformation.source.type} • {transformation.source.size} • {transformation.source.pages} Pages • SHA-256: {transformation.source.sha256.slice(0, 16)}...
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          icon={<ArrowRight className="w-4 h-4 text-tertiary-fixed" />}
          className="shadow-xs font-semibold px-5"
        >
          Analyze Source
        </Button>
      </div>

    </div>
  );
};
