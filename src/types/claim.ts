export type ClaimStatus = 
  | 'SUPPORTED' 
  | 'UNSUPPORTED' 
  | 'NEEDS_REVIEW' 
  | 'EDITED' 
  | 'RESOLVED' 
  | 'HUMAN_APPROVED' 
  | 'REJECTED';

export interface GroundingClaim {
  id: string;
  jobId: string;
  claimIndex: number;
  sectionTitle: string;
  claimText: string;
  originalDraftText?: string;
  status: ClaimStatus;
  confidenceScore: number;
  sourceDocument: string;
  pageNumber: number;
  anchorPassage: string;
  sourceReference: string;
  flagReason?: string;
  reviewerNote?: string;
  modifiedBy?: string;
  modifiedAt?: string;
}
