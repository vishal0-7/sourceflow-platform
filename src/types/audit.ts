export type AuditAction = 
  | 'DOCUMENT_UPLOADED' 
  | 'INTELLIGENCE_EXTRACTED' 
  | 'TRANSFORMATION_GENERATED' 
  | 'CLAIMS_VERIFIED' 
  | 'CLAIM_EDITED'
  | 'CLAIM_RESOLVED'
  | 'HUMAN_EDITED' 
  | 'CLAIM_APPROVED'
  | 'REVIEWER_APPROVED'
  | 'OFFICER_APPROVED' 
  | 'DOCUMENT_EXPORTED'
  | 'COMMUNICATION_DELIVERED';

export interface AuditRecord {
  id: string;
  timestamp: string;
  jobId: string;
  actor: string;
  actorRole: 'Content Operator' | 'Reviewer' | 'Approver' | 'System Automated' | string;
  action: AuditAction;
  details: string;
  version: string;
  previousHash: string;
  currentHash: string;
  verificationStatus: 'VALID_TAMPER_EVIDENT';
}
