import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  Send,
  Mail,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Lock,
  ArrowLeft,
  Check,
  Paperclip,
  Users,
  Eye,
  Edit3
} from 'lucide-react';

interface Step5DeliveryProps {
  onBack: () => void;
}

export const Step5Delivery: React.FC<Step5DeliveryProps> = ({ onBack }) => {
  const {
    transformation,
    userSession,
    isApprovalBlocked,
    unsupportedClaimsCount,
    approveOutputs,
    sendCommunication,
    showToast
  } = useAppStore();

  const [activeOutputId, setActiveOutputId] = useState<string>(transformation.outputs[0]?.id || 'DELIV-001');
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [isPreviewEmailOpen, setIsPreviewEmailOpen] = useState<boolean>(false);
  const [emailSubject, setEmailSubject] = useState<string>(transformation.delivery.subject);
  const [emailMessage, setEmailMessage] = useState<string>(transformation.delivery.message);
  const [isSending, setIsSending] = useState<boolean>(false);

  const activeOutput = transformation.outputs.find(o => o.id === activeOutputId) || transformation.outputs[0];
  const isApproved = transformation.review.status === 'APPROVED';
  const isSent = transformation.delivery.status === 'SENT';

  const handleApproveClick = async () => {
    await approveOutputs();
  };

  const handleSendClick = async () => {
    setIsSending(true);
    await sendCommunication({ subject: emailSubject, message: emailMessage });
    setIsSending(false);
  };

  const handleExport = (format: string) => {
    showToast(`Exported ${activeOutput?.title} as ${format} ✓`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Progression Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-base font-bold text-on-surface">
            Document Review, Human Approval & Delivery
          </h2>
          <div className="flex items-center gap-3 text-xs font-code-sm text-on-surface-variant mt-0.5">
            <span>Lifecycle Stages:</span>
            <span className="font-semibold text-on-surface">1. Source Upload</span>
            <span>→</span>
            <span className="font-semibold text-on-surface">2. Intelligence Extraction</span>
            <span>→</span>
            <span className="font-semibold text-emerald-800">3. Verification</span>
            <span>→</span>
            <span className={`font-bold ${isApproved ? 'text-emerald-800' : 'text-secondary'}`}>
              {isApproved ? '4. Human Approved ✓' : '4. Human Approval Pending'}
            </span>
            <span>→</span>
            <span className={`font-bold ${isSent ? 'text-emerald-800' : 'text-slate-400'}`}>
              {isSent ? '5. Dispatched ✓' : '5. Delivery Ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              HUMAN APPROVED FOR DELIVERY
            </span>
          ) : isApprovalBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              APPROVAL BLOCKED ({unsupportedClaimsCount} UNRESOLVED)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-700" />
              READY FOR FORMAL APPROVAL
            </span>
          )}
        </div>
      </div>

      {/* Main Review Tabs & Document Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Document Canvas & Output Selector */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Deliverable Format Tabs */}
          <div className="flex border-b border-outline-variant/80 gap-2 bg-surface-container-low p-1 rounded-xl">
            {transformation.outputs.map(out => {
              const isActive = out.id === activeOutputId;
              return (
                <button
                  key={out.id}
                  onClick={() => setActiveOutputId(out.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-surface-container-lowest text-secondary shadow-xs border border-outline-variant/40'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{out.type}</span>
                  <span className="text-[10px] font-mono bg-surface-container px-1 py-0.2 rounded text-on-surface-variant">
                    {out.version}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Document Paper Preview Card */}
          {activeOutput && (
            <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-8 shadow-paper space-y-6">
              <div className="border-b border-outline-variant/60 pb-4 flex items-start justify-between gap-4">
                <div>
                  <span className="font-label-caps text-[10px] uppercase text-secondary font-bold tracking-wider">
                    TARGET AUDIENCE: {activeOutput.audience}
                  </span>
                  <h3 className="font-headline-lg text-lg font-bold text-on-surface mt-1">
                    {activeOutput.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-code-sm text-on-surface-variant mt-1">
                    <span className="text-emerald-800 font-semibold">✓ Verified</span>
                    <span>•</span>
                    <span>{activeOutput.sourceReferencesCount} Source References</span>
                    <span>•</span>
                    <span>Version {activeOutput.version}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('PDF')}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('DOCX')}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    DOCX
                  </Button>
                </div>
              </div>

              {/* Document Text Body */}
              <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-on-surface bg-surface-container-low/40 p-6 rounded-lg border border-outline-variant/40">
                {activeOutput.content}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Separated Approval Panel & Delivery Dispatch */}
        <div className="space-y-4">
          
          {/* Box 1: Formal Human Approval Gate */}
          <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <div>
                <h4 className="font-headline-md text-sm font-bold text-on-surface">
                  1. Formal Human Approval
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Mandatory sign-off before communication dispatch.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-body-sm">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface-variant">Claims Grounded:</span>
                <span className="font-bold text-emerald-800">{transformation.claims.length} / {transformation.claims.length} Verified ✓</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface-variant">Unresolved Issues:</span>
                <span className={`font-bold ${unsupportedClaimsCount === 0 ? 'text-emerald-800' : 'text-amber-900'}`}>
                  {unsupportedClaimsCount} remaining
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface-variant">Approving Reviewer:</span>
                <span className="font-bold text-on-surface">{userSession.name}</span>
              </div>
            </div>

            {isApproved ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Approved by {transformation.review.reviewer}</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Timestamp: {transformation.review.approvedAt ? new Date(transformation.review.approvedAt).toLocaleTimeString() : 'Recorded'} • Cryptographic block chained.
                </p>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleApproveClick}
                disabled={isApprovalBlocked}
                icon={<ShieldCheck className="w-4 h-4 text-tertiary-fixed" />}
                className="w-full justify-center shadow-xs font-semibold"
              >
                {isApprovalBlocked ? `Resolve ${unsupportedClaimsCount} Claims to Approve` : 'Approve Outputs'}
              </Button>
            )}
          </div>

          {/* Box 2: Communication Delivery Dispatch (Strictly Unlocked ONLY After Approval) */}
          <div className={`rounded-xl p-5 space-y-4 border transition-all ${
            isApproved
              ? 'bg-surface-container-lowest border-outline-variant/80 shadow-2xs'
              : 'bg-surface-container-low/60 border-outline-variant/40 opacity-70'
          }`}>
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <h4 className="font-headline-md text-sm font-bold text-on-surface">
                    2. Communication Delivery
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    {isApproved ? 'Ready for recipient dispatch' : 'Locked until outputs are formally approved'}
                  </p>
                </div>
              </div>

              {!isApproved && <Lock className="w-4 h-4 text-on-surface-variant" />}
            </div>

            {isSent ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-emerald-950">
                    Communication Sent Successfully
                  </h5>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Dispatched to {transformation.delivery.recipients.length} stakeholders at {transformation.delivery.sentAt ? new Date(transformation.delivery.sentAt).toLocaleTimeString() : 'Now'}.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-600 bg-white/80 p-2 rounded border border-emerald-200 text-left space-y-0.5">
                  <p><strong>Subject:</strong> {emailSubject}</p>
                  <p><strong>Recipients:</strong> {transformation.delivery.recipients.map(r => r.email).join(', ')}</p>
                  <p><strong>Attachments:</strong> 3 verified deliverable artifacts</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Recipients List */}
                <div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">
                    Configured Recipients ({transformation.delivery.recipients.length}):
                  </span>
                  <div className="space-y-1 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/60 max-h-28 overflow-y-auto font-mono text-[11px]">
                    {transformation.delivery.recipients.map(r => (
                      <div key={r.id} className="flex items-center justify-between">
                        <span className="text-on-surface">{r.email}</span>
                        <span className="text-[10px] text-on-surface-variant font-sans font-medium">{r.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Subject / Message Preview Card */}
                {isEditingEmail ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Email Subject:</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                    />
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Email Body:</label>
                    <textarea
                      value={emailMessage}
                      onChange={e => setEmailMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded p-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="primary" size="sm" onClick={() => setIsEditingEmail(false)}>
                        Save Content
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/60">
                    <p className="font-bold text-on-surface text-[11px] truncate">
                      Subject: {emailSubject}
                    </p>
                    <p className="text-on-surface-variant text-[11px] line-clamp-2">
                      {emailMessage}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="text-secondary text-[10px] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Email</span>
                      </button>
                      <button
                        onClick={() => setIsPreviewEmailOpen(true)}
                        className="text-on-surface-variant hover:text-on-surface text-[10px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview Email</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-code-sm">
                  <Paperclip className="w-3 h-3" />
                  <span>3 Attachments: Executive Brief, Technical Advisory, Comm Package</span>
                </div>

                {/* Dispatch Button */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSendClick}
                  disabled={!isApproved || isSending}
                  icon={<Send className="w-3.5 h-3.5 text-tertiary-fixed" />}
                  className="w-full justify-center shadow-xs font-semibold"
                >
                  {isSending ? 'Dispatching Communication...' : 'Send Communication'}
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Back Action */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={onBack}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back to Verification
        </Button>
      </div>

      {/* Email Preview Modal */}
      {isPreviewEmailOpen && (
        <Modal
          isOpen={isPreviewEmailOpen}
          onClose={() => setIsPreviewEmailOpen(false)}
          title="Email Dispatch Preview"
          subtitle="Preview the finalized communication as it will be delivered to stakeholders"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsPreviewEmailOpen(false)}>
                Close Preview
              </Button>
              {isApproved && !isSent && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsPreviewEmailOpen(false);
                    handleSendClick();
                  }}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Now
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60 space-y-1.5 font-mono text-[11px]">
              <p><strong className="text-on-surface">To:</strong> {transformation.delivery.recipients.filter(r => r.type === 'TO').map(r => r.email).join(', ')}</p>
              <p><strong className="text-on-surface">Cc:</strong> {transformation.delivery.recipients.filter(r => r.type === 'CC').map(r => r.email).join(', ')}</p>
              <p><strong className="text-on-surface">Subject:</strong> {emailSubject}</p>
            </div>

            <div className="p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/80 text-on-surface whitespace-pre-wrap leading-relaxed">
              {emailMessage}
            </div>

            <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/60 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-on-surface">
                <Paperclip className="w-3.5 h-3.5 text-secondary" />
                Attached Deliverables (3 Files):
              </span>
              <span className="text-on-surface-variant font-mono">
                Executive_Brief.pdf, Technical_Advisory.pdf, Communication_Package.pdf
              </span>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
