import { GroundingClaim, ClaimStatus } from '../types/claim';
import { initialClaims23 } from '../data/demoData';
import { simulateDelay, createApiResponse, ApiResponse } from './api';

export class VerificationService {
  private claims: GroundingClaim[] = [...initialClaims23];

  async getClaims(transformationId: string): Promise<ApiResponse<GroundingClaim[]>> {
    await simulateDelay(200);
    return createApiResponse([...this.claims]);
  }

  async updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    reviewerName: string,
    note?: string
  ): Promise<ApiResponse<GroundingClaim>> {
    await simulateDelay(250);
    const index = this.claims.findIndex(c => c.id === claimId);
    if (index === -1) {
      throw new Error(`Claim ${claimId} not found`);
    }

    const updatedClaim: GroundingClaim = {
      ...this.claims[index],
      status,
      reviewerNote: note || this.claims[index].reviewerNote,
      modifiedBy: reviewerName,
      modifiedAt: new Date().toISOString()
    };

    this.claims[index] = updatedClaim;
    return createApiResponse(updatedClaim);
  }

  async editClaimPhrasing(
    claimId: string,
    newText: string,
    reviewerName: string,
    note?: string
  ): Promise<ApiResponse<GroundingClaim>> {
    await simulateDelay(300);
    const index = this.claims.findIndex(c => c.id === claimId);
    if (index === -1) {
      throw new Error(`Claim ${claimId} not found`);
    }

    const originalDraftText = this.claims[index].originalDraftText || this.claims[index].claimText;

    const updatedClaim: GroundingClaim = {
      ...this.claims[index],
      claimText: newText,
      originalDraftText,
      status: 'SUPPORTED',
      confidenceScore: 99,
      reviewerNote: note || 'Phrasing edited by reviewer to match exact source anchor passage.',
      modifiedBy: reviewerName,
      modifiedAt: new Date().toISOString(),
      flagReason: undefined
    };

    this.claims[index] = updatedClaim;
    return createApiResponse(updatedClaim);
  }

  async deleteClaim(claimId: string): Promise<ApiResponse<string>> {
    await simulateDelay(200);
    this.claims = this.claims.filter(c => c.id !== claimId);
    return createApiResponse(claimId);
  }
}

export const verificationService = new VerificationService();
