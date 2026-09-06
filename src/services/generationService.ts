import { AudienceProfile, OutputDeliverable } from '../types/transformation';
import { initialOutputs } from '../data/demoData';
import { simulateDelay, createApiResponse, ApiResponse } from './api';

export class GenerationService {
  async generateDeliverables(
    transformationId: string,
    profiles: AudienceProfile[]
  ): Promise<ApiResponse<OutputDeliverable[]>> {
    await simulateDelay(1200);
    // Filter/generate matching deliverables for selected audience profiles
    const selectedTypes = profiles.filter(p => p.isSelected).map(p => p.deliverableType);
    const deliverables = initialOutputs.filter(out => selectedTypes.includes(out.type));
    return createApiResponse(deliverables.length > 0 ? deliverables : initialOutputs);
  }
}

export const generationService = new GenerationService();
