import React from 'react';
import { useAppStore } from '../store/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockDocumentsList } from '../data/demoData';
import {
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Layers,
  ShieldCheck,
  Send
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { userSession, navigate, transformation, unsupportedClaimsCount, supportedClaimsCount } = useAppStore();

  const handleRowClick = (_docId: string) => {
    navigate('#/transform');
  };

  const isApproved = transformation.review.status === 'APPROVED';

  // Dynamic table reflecting live transformation state
  const liveDocuments = mockDocumentsList.map(doc => {
    if (doc.id === transformation.id) {
      return {
        ...doc,
        title: transformation.title || doc.title,
        status: isApproved ? 'APPROVED' : (unsupportedClaimsCount > 0 ? 'NEEDS_REVIEW' : 'READY_FOR_APPROVAL'),
        outputs: transformation.outputs.map(o => o.type),
        lastActivity: 'Just now'
      };
    }
    return doc;
  });

  return (
    <div className="flex-1 bg-surface p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Welcome Header & Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              Good morning, {userSession.role === 'Approver' ? 'Director' : 'Operator'}.
            </h1>
            <p className="font-body-md text-on-surface-variant text-xs mt-1">
              Transform trusted organizational information into verified communication.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('#/transform')}
            icon={<Plus className="w-4 h-4 text-tertiary-fixed" />}
            className="shadow-xs font-semibold px-4"
          >
            + New Transformation
          </Button>
        </div>

        {/* 4 Compact Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              Transformations
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-lg text-2xl font-bold text-on-surface">
                12
              </span>
              <FileText className="w-4 h-4 text-secondary opacity-70" />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Active document pipelines</p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              Deliverables
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-lg text-2xl font-bold text-on-surface">
                36
              </span>
              <Layers className="w-4 h-4 text-secondary opacity-70" />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Tailored audience briefs</p>
          </div>

          <div
            onClick={() => navigate('#/review')}
            className={`p-4 rounded-xl border shadow-2xs cursor-pointer transition-all ${
              unsupportedClaimsCount > 0 
                ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400' 
                : 'bg-surface-container-lowest border-outline-variant/80 hover:border-secondary'
            }`}
          >
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              Pending Review
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className={`font-headline-lg text-2xl font-bold ${unsupportedClaimsCount > 0 ? 'text-amber-950' : 'text-on-surface'}`}>
                {unsupportedClaimsCount}
              </span>
              <Clock className={`w-4 h-4 ${unsupportedClaimsCount > 0 ? 'text-amber-700' : 'text-slate-400'}`} />
            </div>
            <p className={`text-[10px] font-semibold mt-1 ${unsupportedClaimsCount > 0 ? 'text-amber-800' : 'text-slate-500'}`}>
              {unsupportedClaimsCount > 0 ? `${unsupportedClaimsCount} claims require decision` : '0 items pending review'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant font-medium">
              Approved
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-headline-lg text-2xl font-bold text-on-surface">
                {isApproved ? 11 : 10}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700 opacity-70" />
            </div>
            <p className="text-[10px] text-emerald-800 font-medium mt-1">
              {isApproved ? 'All outputs attested' : 'Ready or dispatched'}
            </p>
          </div>

        </div>

        {/* Recent Transformations Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs space-y-2">
          <div className="p-4 border-b border-outline-variant/60 flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-base font-bold text-on-surface">
                Recent Transformations
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Overview of organizational documents, outputs, and verification status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low font-label-caps text-[11px] uppercase text-on-surface-variant border-b border-outline-variant/60">
                <tr>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Outputs</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {liveDocuments.map(doc => (
                  <tr
                    key={doc.id}
                    onClick={() => handleRowClick(doc.id)}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-surface-container text-secondary flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-xs leading-snug">
                            {doc.title}
                          </p>
                          <p className="font-code-sm text-[10px] text-on-surface-variant font-mono">
                            {doc.id} • {doc.fileType} ({doc.size})
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge status={doc.status as any} />
                    </td>

                    <td className="px-4 py-3.5 font-body-sm text-xs text-on-surface-variant">
                      {doc.outputs.join(' · ')}
                    </td>

                    <td className="px-4 py-3.5 font-body-sm text-on-surface-variant text-[11px]">
                      {doc.lastActivity}
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRowClick(doc.id)}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {doc.status === 'NEEDS_REVIEW' ? 'Review Claims' : 'Open Pipeline'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
