import { GroundingClaim } from './claim';
import { OutputDeliverable } from './output';
import { AuditRecord } from './audit';

export type { GroundingClaim } from './claim';
export type { OutputDeliverable } from './output';
export type { AuditRecord } from './audit';

export type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'TXT' | 'PNG' | 'JPG' | 'MP4' | 'URL';

export interface SourceDocument {
  id: string;
  name: string;
  type: FileType;
  pages: number;
  size: string;
  sha256: string;
  uploadedAt: string;
  url?: string;
}

export interface AnalysisSummary {
  findings: number;
  risks: number;
  recommendations: number;
  entities: number;
  evidence: number;
  importantData: number;
  keySummary: string[];
}

export interface AudienceProfile {
  id: string;
  name: string;
  tone: string;
  detailLevel: string;
  language: string;
  objective: string;
  deliverableType: 'Executive Brief' | 'Technical Advisory' | 'Communication Package' | 'Presentation Deck';
  defaultRecipients: string[];
  isSelected: boolean;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  role: string;
  type: 'TO' | 'CC';
}

export type ReviewStatus = 'PENDING' | 'READY_FOR_APPROVAL' | 'APPROVED';
export type DeliveryStatus = 'NOT_SENT' | 'SENT';

export interface Transformation {
  id: string; // e.g. "SF-2026-00124"
  title: string;
  source: SourceDocument;
  analysis: AnalysisSummary;
  profiles: AudienceProfile[];
  claims: GroundingClaim[];
  outputs: OutputDeliverable[];
  review: {
    status: ReviewStatus;
    reviewer: string | null;
    approvedAt: string | null;
  };
  delivery: {
    status: DeliveryStatus;
    recipients: EmailRecipient[];
    sentAt: string | null;
    subject: string;
    message: string;
  };
  audit: AuditRecord[];
}
