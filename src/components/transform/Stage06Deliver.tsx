import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { OutputDeliverable } from '../../types/output';
import {
  CheckCircle2,
  Lock,
  Mail,
  Send,
  Download,
  Eye,
  Edit2,
  FileText,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Check,
  AlertCircle,
  Paperclip,
  Clock
} from 'lucide-react';

interface Stage06DeliverProps {
  onBack: () => void;
}

export const Stage06Deliver: React.FC<Stage06DeliverProps> = ({ onBack }) => {
  const {
    transformation,
    userSession,
    isApprovalBlocked,
    unsupportedClaimsCount,
    approveOutputs,
    sendCommunication,
    navigate
  } = useAppStore();

  const [activePreviewOutput, setActivePreviewOutput] = useState<OutputDeliverable | null>(null);
  const [isPreviewEmailOpen, setIsPreviewEmailOpen] = useState(false);
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  
  const [subject, setSubject] = useState(transformation.delivery.subject || 'Cybersecurity Threat Intelligence Update');
  const [messageBody, setMessageBody] = useState(
    transformation.delivery.message ||
    'Please find attached the formally verified Cybersecurity Threat Intelligence briefing and remediation directives, attested through 23 claims verified against primary source telemetry.'
  );

  const isApproved = transformation.review.status === 'APPROVED';
  const isSent = transformation.delivery.status === 'SENT';

  const handleApprove = async () => {
    await approveOutputs();
  };

  const handleSend = async () => {
    await sendCommunication({ subject, message: messageBody });
    setIsPreviewEmailOpen(false);
  };

  const handleExportOutput = (out: OutputDeliverable) => {
    const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(
      `SOURCEFLOW GENERATED ARTEFACT\nTITLE: ${out.title}\nAUDIENCE: ${out.audience}\nSECURITY CLASSIFICATION: RESTRICTED\nSTATUS: VERIFIED & ATTESTED\n\n${out.content}`
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${out.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      
      {/* Top Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-sans">
          Your outputs are ready.
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Review your synthesized artefacts, grant formal human approval, and dispatch the verified communication package to stakeholders.
        </p>
      </div>

      {/* Generated Artefacts Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Generated Artefacts ({transformation.outputs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transformation.outputs.map(out => (
            <div
              key={out.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                    <FileText className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {out.audience}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {out.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-3 mt-1 leading-relaxed">
                    {out.content.slice(0, 160)}...
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-stone-400">
                  {Math.max(1, Math.ceil(out.content.split(' ').length / 150))} min read
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePreviewOutput(out)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleExportOutput(out)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-teal-700 hover:text-teal-900 hover:bg-teal-50 font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Approval Section */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <span>Formal Human Review & Attestation Gate</span>
            </h3>
            <p className="text-xs text-stone-500">
              Required before outputs can be dispatched to institutional distribution lists.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                ✓ Approved
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono ${
                isApprovalBlocked
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-teal-50 text-teal-900 border border-teal-200'
              }`}>
                {isApprovalBlocked ? 'Pending Claim Resolution' : 'Ready for Sign-Off'}
              </span>
            )}
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium text-stone-800">Source verified (SHA-256)</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2.5">
            {unsupportedClaimsCount === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            )}
            <span className="font-medium text-stone-800">
              {unsupportedClaimsCount === 0 ? 'Claims resolved (23/23)' : `${unsupportedClaimsCount} unresolved claims`}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium text-stone-800">Outputs reviewed</span>
          </div>
        </div>

        {/* Approval Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-stone-500">
            {isApproved ? (
              <p>
                Approved by <span className="font-semibold text-stone-800">{transformation.review.reviewer || userSession.name}</span> • {new Date().toLocaleDateString()}
              </p>
            ) : (
              <p>
                Signer: <span className="font-semibold text-stone-800">{userSession.name} ({userSession.role})</span>
              </p>
            )}
          </div>

          {!isApproved && (
            <button
              onClick={handleApprove}
              disabled={isApprovalBlocked}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs transition-all shadow-subtle ${
                isApprovalBlocked
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer hover:shadow-card'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Approve outputs</span>
            </button>
          )}
        </div>
      </div>

      {/* Stakeholder Delivery Section (Unlocked only after Approval) */}
      <div className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-subtle space-y-6 transition-all ${
        isApproved ? 'border-stone-200 opacity-100' : 'border-stone-200/60 opacity-60'
      }`}>
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-700" />
              <span>Deliver Communication Package</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isApproved
                ? 'Approval confirmed. You may now dispatch to distribution lists.'
                : 'Locked until formal approval is recorded above.'}
            </p>
          </div>

          {isSent && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Dispatched ✓
            </span>
          )}
        </div>

        {/* Recipients & Details */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 text-[11px] block font-mono">TO:</span>
              <span className="font-semibold text-stone-800">
                director-office@agency.gov, ciso-board@agency.gov, soc-leads@agency.gov
              </span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 text-[11px] block font-mono">CC:</span>
              <span className="font-semibold text-stone-800">
                press-bureau@agency.gov, compliance-archive@agency.gov
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-stone-400 text-[11px] block font-mono">SUBJECT:</span>
            <span className="font-semibold text-stone-900">{subject}</span>
          </div>

          {/* Attachments list */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-stone-400 text-[11px] font-mono flex items-center gap-1">
              <Paperclip className="w-3 h-3" /> Attachments:
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
              Executive Summary.pdf
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
              Technical Advisory.pdf
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[11px]">
              Presentation.pptx
            </span>
          </div>
        </div>

        {/* Success State Banner if Dispatched */}
        {isSent && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Communication delivered successfully</span>
            </div>
            <p className="text-xs text-emerald-800">
              3 outputs delivered • 5 recipients • Cryptographic dispatch event logged to Activity timeline.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('#/activity')}
                className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-950"
              >
                View in Activity Timeline →
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewEmailOpen(true)}
              disabled={!isApproved}
              className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
            >
              Preview communication
            </button>

            <button
              onClick={() => setIsEditEmailOpen(prev => !prev)}
              disabled={!isApproved}
              className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
            >
              Edit communication
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!isApproved || isSent}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-subtle ${
              isApproved && !isSent
                ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer hover:shadow-card'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSent ? 'Delivered' : 'Send communication'}</span>
          </button>
        </div>

        {/* Inline Edit Email Drawer */}
        {isEditEmailOpen && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs animate-in fade-in">
            <h4 className="font-semibold text-stone-900">Edit Communication Subject & Message</h4>
            <div>
              <label className="block text-stone-500 font-mono text-[11px] mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-stone-500 font-mono text-[11px] mb-1">Message Body</label>
              <textarea
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-lg border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification</span>
        </button>

        <button
          onClick={() => navigate('#/overview')}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium transition-colors cursor-pointer"
        >
          Return to Overview
        </button>
      </div>

      {/* Output Preview Modal */}
      {activePreviewOutput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-floating border border-stone-200 space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {activePreviewOutput.title}
                </h3>
                <p className="text-xs text-stone-500">
                  Target: {activePreviewOutput.audience}
                </p>
              </div>
              <button
                onClick={() => setActivePreviewOutput(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-stone-50 rounded-xl font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
              {activePreviewOutput.content}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActivePreviewOutput(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleExportOutput(activePreviewOutput)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-medium"
              >
                Export Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {isPreviewEmailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-floating border border-stone-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-700" />
                <span>Institutional Communication Preview</span>
              </h3>
              <button
                onClick={() => setIsPreviewEmailOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1 font-mono text-[11px]">
                <p><span className="text-stone-400">TO:</span> director-office@agency.gov, ciso-board@agency.gov</p>
                <p><span className="text-stone-400">SUBJECT:</span> {subject}</p>
                <p><span className="text-stone-400">SECURITY CLASSIFICATION:</span> RESTRICTED DEMO INSTANCE</p>
              </div>

              <div className="p-4 bg-white border border-stone-200 rounded-xl text-stone-800 leading-relaxed text-xs">
                {messageBody}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] font-mono text-stone-600">
                Attached files: Executive Summary.pdf (245 KB), Advisory.pdf (412 KB), Presentation.pptx (1.2 MB)
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPreviewEmailOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium"
              >
                Close Preview
              </button>
              <button
                onClick={handleSend}
                disabled={isSent}
                className="px-5 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
