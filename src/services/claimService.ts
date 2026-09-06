import { GroundingClaim, ClaimStatus } from '../types/claim';
import { initialMockClaims } from '../data/mockClaims';

let claimsState: GroundingClaim[] = [...initialMockClaims];

export const claimService = {
  async getClaimsByJobId(jobId: string): Promise<GroundingClaim[]> {
    await new Promise(r => setTimeout(r, 100));
    return claimsState.filter(c => c.jobId === jobId || jobId === 'SF-2026-0984');
  },

  async updateClaimStatus(claimId: string, status: ClaimStatus, reviewerName: string = 'Reviewer', note?: string): Promise<GroundingClaim> {
    await new Promise(r => setTimeout(r, 150));
    claimsState = claimsState.map(claim => {
      if (claim.id === claimId) {
        return {
          ...claim,
          status,
          reviewerNote: note !== undefined ? note : claim.reviewerNote,
          modifiedBy: reviewerName,
          modifiedAt: new Date().toISOString()
        };
      }
      return claim;
    });
    const updated = claimsState.find(c => c.id === claimId);
    if (!updated) throw new Error('Claim not found');
    return updated;
  },

  async editClaimText(claimId: string, newText: string, reviewerName: string = 'Reviewer', note?: string): Promise<GroundingClaim> {
    await new Promise(r => setTimeout(r, 150));
    claimsState = claimsState.map(claim => {
      if (claim.id === claimId) {
        return {
          ...claim,
          claimText: newText,
          status: 'SUPPORTED',
          reviewerNote: note || 'Phrasing revised and verified against source evidence.',
          modifiedBy: reviewerName,
          modifiedAt: new Date().toISOString()
        };
      }
      return claim;
    });
    const updated = claimsState.find(c => c.id === claimId);
    if (!updated) throw new Error('Claim not found');
    return updated;
  },

  async deleteClaim(claimId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 150));
    claimsState = claimsState.filter(c => c.id !== claimId);
  }
};
