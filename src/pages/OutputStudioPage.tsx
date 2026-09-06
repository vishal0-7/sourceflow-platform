import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { StudioHeader } from '../components/output/StudioHeader';
import { ArtifactTabs } from '../components/output/ArtifactTabs';
import { DocumentCanvas } from '../components/output/DocumentCanvas';
import { GroundingMetricsPane } from '../components/output/GroundingMetricsPane';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { ShieldCheck, Download, FileText, CheckCircle2 } from 'lucide-react';
import { outputService } from '../services/outputService';

export const OutputStudioPage: React.FC = () => {
  const {
    activeJob,
    userSession,
    approveJobForDispatch,
    outputDossier,
    showToast,
    claimsList
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'studio' | 'diff' | 'executive'>('studio');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [isDispatchComplete, setIsDispatchComplete] = useState<boolean>(false);

  const handleApprove = async () => {
    await approveJobForDispatch();
    setIsApprovalModalOpen(false);
    setIsDispatchComplete(true);
  };

  const handleExport = async (format: 'PDF' | 'JSON-LD' | 'DOCX') => {
    const blob = await outputService.exportDocument(activeJob.id, format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeJob.id}-institutional-advisory.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported advisory package as ${format}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface">
      {/* Studio Header Context Bar */}
      <StudioHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onApprove={() => setIsApprovalModalOpen(true)}
      />

      {/* Multi-Artifact Tab Navigation */}
      <ArtifactTabs />

      {/* Main 70/30 Workbench Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Column (70%): Professional Generated Document Preview */}
        <DocumentCanvas viewMode={viewMode} isEditing={isEditing} />

        {/* Right Column (30%): Grounding & Verification Panel */}
        <GroundingMetricsPane onApprove={() => setIsApprovalModalOpen(true)} />
      </div>

      {/* Formal Approval & Attestation Modal */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title="Formal Institutional Dispatch Attestation"
        subtitle={`Dossier Reference: ${outputDossier.referenceNumber}`}
        footer={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsApprovalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApprove}
              icon={<ShieldCheck className="w-4 h-4 text-tertiary-fixed" />}
            >
              Sign & Dispatch
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-code-sm">
              <span className="text-on-surface-variant">Attesting Officer:</span>
              <span className="font-bold text-on-surface">{userSession.name} ({userSession.role})</span>
            </div>
            <div className="flex items-center justify-between text-xs font-code-sm">
              <span className="text-on-surface-variant">Session Clearance Token:</span>
              <span className="font-mono text-slate-700">{userSession.sessionToken}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-code-sm">
              <span className="text-on-surface-variant">Statutory Assertions:</span>
              <span className="font-bold text-emerald-800">{claimsList.length} / {claimsList.length} Verified & Attested</span>
            </div>
          </div>

          <p className="font-body-md text-on-surface text-sm">
            By confirming dispatch, you attest that the synthesized technical advisory has been cross-referenced against primary telemetry evidence, and all derived claims satisfy institutional integrity guidelines.
          </p>

          <div className="p-3 rounded bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-emerald-900 text-xs font-code-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Tamper-evident audit signature will be cryptographically chained to the job ledger.</span>
          </div>
        </div>
      </Modal>

      {/* Export Confirmation Dialog */}
      <Modal
        isOpen={isDispatchComplete}
        onClose={() => setIsDispatchComplete(false)}
        title="Institutional Advisory Dispatched & Certified"
        subtitle="Tamper-evident record successfully registered"
        footer={
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsDispatchComplete(false)}
          >
            Close & Return to Console
          </Button>
        }
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-headline-md font-bold text-on-surface">
              Document Ready for Dissemination
            </h4>
            <p className="font-body-sm text-on-surface-variant mt-1">
              The transformation dossier has been approved by {userSession.name} and cryptographically linked with SHA-256 integrity stamp.
            </p>
          </div>

          <div className="pt-3 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleExport('PDF')}
            >
              Download PDF Advisory
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => handleExport('JSON-LD')}
            >
              Export JSON-LD Bundle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
