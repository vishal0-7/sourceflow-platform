import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockDocumentsList } from '../data/demoData';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { navigate, unsupportedClaimsCount, transformation } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEEDS_REVIEW' | 'APPROVED'>('ALL');

  // Dynamic list reflecting current transformation status for the active document
  const documents = mockDocumentsList.map(doc => {
    if (doc.id === transformation.id) {
      return {
        ...doc,
        title: transformation.title || doc.title,
        status: unsupportedClaimsCount > 0 ? 'NEEDS_REVIEW' : (transformation.review.status === 'APPROVED' ? 'APPROVED' : 'READY_FOR_APPROVAL'),
        claimsFlagged: unsupportedClaimsCount,
        claimsVerified: transformation.claims.length - unsupportedClaimsCount,
        claimsTotal: transformation.claims.length,
        outputs: transformation.outputs.map(o => o.title)
      };
    }
    return doc;
  });

  const filteredDocs = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'NEEDS_REVIEW' && (doc.status === 'NEEDS_REVIEW' || doc.status === 'READY_FOR_APPROVAL')) ||
      (statusFilter === 'APPROVED' && doc.status === 'APPROVED');

    return matchesSearch && matchesStatus;
  });

  const handleOpenDoc = (docId: string) => {
    navigate('#/transform');
  };

  return (
    <div className="flex-1 bg-surface p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              Documents Repository
            </h1>
            <p className="font-body-md text-on-surface-variant text-xs mt-1">
              Source documents, intelligence extraction records, and transformed deliverables.
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

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-surface-container-lowest border border-outline-variant/80 rounded-lg px-3 py-1.5 shadow-2xs">
            <Search className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
            <input
              type="text"
              placeholder="Search documents by title, ID, or file name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/60 font-body-sm text-xs">
            {[
              { id: 'ALL', label: 'All Documents' },
              { id: 'NEEDS_REVIEW', label: `Needs Review (${unsupportedClaimsCount > 0 ? unsupportedClaimsCount : 1})` },
              { id: 'APPROVED', label: 'Approved' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-2xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low font-label-caps text-[11px] uppercase text-on-surface-variant border-b border-outline-variant/60">
                <tr>
                  <th className="px-4 py-3">Source Document</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Grounding Claims</th>
                  <th className="px-4 py-3">Outputs</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    onClick={() => handleOpenDoc(doc.id)}
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
                            ID: {doc.id} • {doc.pages} pages • {doc.size}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-code-sm text-[11px] text-on-surface-variant">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[10px]">
                        {doc.fileType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge status={doc.status as any} />
                    </td>

                    <td className="px-4 py-3.5 font-code-sm text-[11px]">
                      <span className="text-on-surface font-semibold">{doc.claimsVerified}</span> / {doc.claimsTotal} verified
                      {doc.claimsFlagged > 0 && (
                        <span className="ml-1.5 text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                          {doc.claimsFlagged} flagged
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-body-sm text-xs text-on-surface-variant">
                      {doc.outputs.join(' · ')}
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {doc.claimsFlagged > 0 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDoc(doc.id)}
                            className="border-amber-300 text-amber-950 hover:bg-amber-50 text-xs"
                          >
                            Review Claims
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenDoc(doc.id)}
                            icon={<ArrowRight className="w-3.5 h-3.5" />}
                            className="text-xs"
                          >
                            Open Pipeline
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-sm">
                      No documents found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
