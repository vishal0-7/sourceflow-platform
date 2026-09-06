import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { truncateHash } from '../utils/hash';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Layers,
  FileCheck,
  Share2,
  Presentation,
  AlignLeft
} from 'lucide-react';

export const TransformationPage: React.FC = () => {
  const { uploadSourceFile, activeJob, advanceWorkflowStage, navigate } = useAppStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [selectedOutputs, setSelectedOutputs] = useState<{
    advisory: boolean;
    summary: boolean;
    presentation: boolean;
    social: boolean;
  }>({
    advisory: true,
    summary: true,
    presentation: true,
    social: true
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setIsProcessing(true);
    await uploadSourceFile(file);
    setIsProcessing(false);
    setCurrentStep(2);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const loadPreset = async (title: string, type: 'PDF' | 'DOCX') => {
    const dummyContent = `SOURCEFLOW DOCUMENT ASSESSMENT\nTITLE: ${title}\nDATE: ${new Date().toISOString()}\nCONTENT: Source document containing infrastructure telemetry and statutory assertions.`;
    const blob = new Blob([dummyContent], { type: type === 'PDF' ? 'application/pdf' : 'text/plain' });
    const file = new File([blob], `${title.replace(/\s+/g, '-')}.${type.toLowerCase()}`, { type: blob.type });
    await handleProcessFile(file);
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    await advanceWorkflowStage(3);
    await advanceWorkflowStage(4);
    setIsProcessing(false);
    navigate('#/output-studio');
  };

  return (
    <div className="flex-1 bg-surface p-console-margin overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 py-2">
        
        {/* Page Top Header & Simple 4-Step Progress Ribbon */}
        <div className="space-y-4 pb-4 border-b border-outline-variant/60">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface">
              New Content Transformation
            </h1>
            <p className="font-body-sm text-on-surface-variant text-sm mt-0.5">
              Follow the guided steps to analyze trusted source material and generate verified communication.
            </p>
          </div>

          {/* Simple Step Indicator */}
          <div className="flex items-center justify-between max-w-2xl pt-2">
            {[
              { num: 1, label: '1. Source Upload' },
              { num: 2, label: '2. Document Analysis' },
              { num: 3, label: '3. Choose Outputs' },
              { num: 4, label: '4. Generate' }
            ].map((step, i, arr) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => currentStep > step.num && setCurrentStep(step.num)}
                    disabled={currentStep < step.num}
                    className={`flex items-center gap-1.5 text-xs font-body-sm transition-colors ${
                      isCurrent
                        ? 'text-secondary font-bold'
                        : isDone
                        ? 'text-emerald-700 font-semibold'
                        : 'text-on-surface-variant/60'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-secondary text-white'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {isDone ? '✓' : step.num}
                    </span>
                    <span>{step.label}</span>
                  </button>

                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${currentStep > step.num ? 'bg-emerald-300' : 'bg-outline-variant/60'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STEP 1: UPLOAD SOURCE DOCUMENT */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant hover:border-secondary/80 bg-surface-container-lowest hover:bg-surface-container-low rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-2xs"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={e => e.target.files && handleProcessFile(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="font-headline-md text-base font-bold text-on-surface">
                {isProcessing ? 'Reading & Computing SHA-256 Hash...' : 'Upload Source Document (PDF Recommended)'}
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-md">
                Drag and drop your file here or click to browse. Real cryptographic checksum is calculated immediately via Web Crypto.
              </p>

              <div className="mt-4 flex gap-2 font-code-sm text-[11px]">
                <span className="px-2.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">.PDF</span>
                <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant">.DOCX</span>
                <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface-variant">.TXT</span>
              </div>
            </div>

            {/* Quick Benchmark Presets */}
            <div className="space-y-2">
              <span className="font-body-sm text-xs text-on-surface-variant font-medium">
                Or select a sample document for demonstration:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => loadPreset('Regional Power Grid Telemetry & Compliance Document', 'PDF')}
                  className="p-3.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/80 hover:border-secondary cursor-pointer transition-all space-y-1 shadow-2xs"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-on-surface">
                    <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>Regional Grid Telemetry & Compliance Dossier</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-code-sm">
                    PDF • 14.8 MB • 24 Pages • 23 Verifiable Claims
                  </p>
                </div>

                <div
                  onClick={() => loadPreset('Renewable Grid Integration Strategy 2026-2030', 'PDF')}
                  className="p-3.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/80 hover:border-secondary cursor-pointer transition-all space-y-1 shadow-2xs"
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-on-surface">
                    <FileText className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>Renewable Grid Integration Strategy 2026–2030</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-code-sm">
                    PDF • 8.2 MB • 32 Pages • 34 Claims
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DOCUMENT ANALYSIS */}
        {currentStep === 2 && (
          <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-6 space-y-6 shadow-2xs">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                Step 2 of 4
              </span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface mt-0.5">
                Document Analysis Summary
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                The document intelligence parser has processed the structure and extracted key assertions.
              </p>
            </div>

            {/* Clean 4-Item Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-body-sm">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <span className="text-on-surface-variant text-[11px]">Document</span>
                <p className="font-bold text-on-surface text-sm mt-0.5 truncate" title={activeJob.title}>
                  {activeJob.title}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <span className="text-on-surface-variant text-[11px]">Pages & Size</span>
                <p className="font-bold text-on-surface text-sm mt-0.5">
                  {activeJob.totalPages || 24} Pages ({activeJob.fileSize})
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <span className="text-on-surface-variant text-[11px]">Language</span>
                <p className="font-bold text-on-surface text-sm mt-0.5">
                  {activeJob.detectedLanguage || 'English (Technical)'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <span className="text-on-surface-variant text-[11px]">Identified Topic</span>
                <p className="font-bold text-on-surface text-sm mt-0.5 truncate">
                  {activeJob.topicSummary || 'Energy Transmission'}
                </p>
              </div>
            </div>

            {/* Key Information Extraction Box */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/60 space-y-2">
              <h4 className="font-body-sm text-xs font-bold text-on-surface">
                Key Information Extracted:
              </h4>
              <ul className="space-y-1.5 text-xs text-on-surface-variant list-disc pl-5 font-body-md">
                <li>17 Ultra-High-Voltage (UHV) interconnect substations identified with complete telemetry coverage.</li>
                <li>23 statutory and technical assertions parsed for ground-truth verification.</li>
                <li>Zero N-1 transmission violations detected under peak 48,250 MW load.</li>
                <li>1 frequency excursion event recorded at 14:32:10 IST with automatic governor intervention.</li>
              </ul>
            </div>

            {/* Collapsible Processing Details */}
            <div className="border-t border-outline-variant/60 pt-3">
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="flex items-center gap-1.5 text-xs font-code-sm text-secondary hover:underline"
              >
                {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{isDetailsOpen ? 'Hide processing details' : 'View processing details & cryptographic hash'}</span>
              </button>

              {isDetailsOpen && (
                <div className="mt-3 p-3 bg-surface-container text-on-surface rounded-lg font-mono text-xs space-y-1 border border-outline-variant/60">
                  <p>SHA-256 Checksum: <span className="font-bold">{activeJob.sha256}</span></p>
                  <p>Optical Layout Engine: Complete (24 frames parsed)</p>
                  <p>Grounding Engine: 23 claims linked to source references</p>
                </div>
              )}
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(1)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Upload
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(3)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Continue to Choose Outputs
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE OUTPUTS */}
        {currentStep === 3 && (
          <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-6 space-y-6 shadow-2xs">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                Step 3 of 4
              </span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface mt-0.5">
                Choose Communication Deliverables
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Select the transformed output formats to generate from this document.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'advisory',
                  title: '1. Official Advisory (Memorandum)',
                  desc: 'Full-length institutional document with sectioned statutory findings and citations.',
                  icon: <FileText className="w-4 h-4 text-secondary" />
                },
                {
                  id: 'summary',
                  title: '2. Executive Summary',
                  desc: 'High-density analytical briefing highlighting major metrics and conclusions.',
                  icon: <AlignLeft className="w-4 h-4 text-secondary" />
                },
                {
                  id: 'presentation',
                  title: '3. Presentation Slide Deck',
                  desc: 'Slide-by-slide executive briefing cards with grounded assertions.',
                  icon: <Presentation className="w-4 h-4 text-secondary" />
                },
                {
                  id: 'social',
                  title: '4. Public Advisory Social Posts',
                  desc: 'Citizen and stakeholder advisory alerts with verified claims.',
                  icon: <Share2 className="w-4 h-4 text-secondary" />
                }
              ].map(opt => {
                const isSelected = (selectedOutputs as any)[opt.id];
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOutputs(prev => ({ ...prev, [opt.id]: !isSelected }))}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-secondary bg-surface-container-low shadow-2xs'
                        : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 rounded text-secondary focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-bold text-xs text-on-surface">
                        {opt.icon}
                        <span>{opt.title}</span>
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(2)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back to Analysis
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                disabled={isProcessing}
                icon={<Sparkles className="w-3.5 h-3.5 text-tertiary-fixed" />}
              >
                {isProcessing ? 'Generating Outputs...' : 'Generate Outputs (Studio)'}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
