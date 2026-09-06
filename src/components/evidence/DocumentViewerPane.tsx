import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { primaryMockDocument } from '../../data/mockDocuments';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FileText, ZoomIn, ZoomOut, Search, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';

export const DocumentViewerPane: React.FC = () => {
  const { selectedClaim, transformation } = useAppStore();
  const [currentPage, setCurrentPage] = useState<number>(selectedClaim ? selectedClaim.pageNumber : 19);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Sync active page with selected claim
  useEffect(() => {
    if (selectedClaim) {
      setCurrentPage(selectedClaim.pageNumber);
    }
  }, [selectedClaim]);

  const doc = primaryMockDocument;
  const activePageData = doc.pages.find(p => p.pageNumber === currentPage) || doc.pages[0];

  return (
    <div className="flex-1 bg-surface-container-low flex flex-col min-h-0 border-l border-outline-variant">
      
      {/* Viewer Control Strip */}
      <div className="h-11 px-4 bg-surface-container-lowest border-b border-outline-variant/80 flex items-center justify-between select-none text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="font-semibold text-on-surface truncate max-w-[260px]">
            {transformation.source.name || doc.fileName}
          </span>
          <Badge variant="hash">{transformation.source.type || doc.fileType} • {transformation.source.size || doc.fileSize}</Badge>
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/60 font-code-sm">
            <span>Page</span>
            <select
              value={currentPage}
              onChange={e => setCurrentPage(Number(e.target.value))}
              className="bg-transparent font-bold text-on-surface focus:outline-none cursor-pointer"
            >
              {doc.pages.map(p => (
                <option key={p.pageNumber} value={p.pageNumber}>
                  {p.pageNumber} ({p.sectionHeader.slice(0, 24)}...)
                </option>
              ))}
            </select>
            <span>of {transformation.source.pages || doc.totalPages}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-surface-container-low p-0.5 rounded border border-outline-variant/60">
            <button
              onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-code-sm text-[11px] px-1 font-semibold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Document Paper Frame */}
      <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
        <div
          className="w-full max-w-2xl bg-white border border-outline-variant rounded-lg shadow-paper p-8 lg:p-10 font-sans text-slate-900 transition-all relative"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none text-9xl font-bold text-slate-900 rotate-[-30deg]">
            SOURCEFLOW
          </div>

          {/* Institutional Document Letterhead Strip */}
          <div className="border-b border-slate-200 pb-3 mb-6 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <div>
              <p className="font-bold text-slate-800 uppercase">
                {transformation.title || 'Cybersecurity Threat Intelligence Assessment'}
              </p>
              <p>Reference: {transformation.id} // Threat Telemetry Audit Window</p>
            </div>
            <div className="text-right">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                PAGE {currentPage}
              </span>
            </div>
          </div>

          {/* Section Header */}
          <h3 className="font-bold text-base text-slate-900 font-mono border-b border-slate-100 pb-1 mb-4">
            {activePageData.sectionHeader}
          </h3>

          {/* Page Body with Grounding Highlight */}
          <div className="font-sans text-sm leading-relaxed space-y-4 text-slate-800">
            {selectedClaim && selectedClaim.pageNumber === currentPage && activePageData.content.includes(selectedClaim.anchorPassage) ? (
              <div>
                <p className="mb-3 text-slate-600">
                  {activePageData.content.split(selectedClaim.anchorPassage)[0]}
                </p>

                {/* Exact Highlighted Passage linked to the active claim */}
                <div className={`p-2.5 my-3 rounded border-2 transition-all ${
                  selectedClaim.status === 'NEEDS_REVIEW' || selectedClaim.status === 'UNSUPPORTED'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-medium'
                    : 'bg-yellow-100 border-yellow-400 text-slate-950 font-medium'
                }`}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase mb-1 text-slate-600">
                    <Bookmark className="w-3 h-3 text-secondary" />
                    <span>Exact Source Evidence Anchor [Claim #{selectedClaim.claimIndex}]</span>
                  </div>
                  <span>"{selectedClaim.anchorPassage}"</span>
                </div>

                <p className="mt-3 text-slate-600">
                  {activePageData.content.split(selectedClaim.anchorPassage)[1] || ''}
                </p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">
                {activePageData.content}
              </p>
            )}
          </div>

          {/* Document Footer & Hash Stamp */}
          <div className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>SF-CYBER-THREAT-INTEL-2026 // CLASSIFICATION: DEMO</span>
            <span>SHA256: {transformation.source.sha256 ? transformation.source.sha256.slice(0, 16) : doc.sha256.slice(0, 16)}...</span>
          </div>

        </div>
      </div>

    </div>
  );
};
