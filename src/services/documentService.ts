import { SourceDocument, AnalysisSummary, FileType } from '../types/transformation';
import { simulateDelay, createApiResponse, ApiResponse } from './api';

export class DocumentService {
  async computeSHA256(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      // Fallback pseudo-hash if crypto.subtle is unavailable
      return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
  }

  async uploadDocument(file: File): Promise<ApiResponse<SourceDocument>> {
    await simulateDelay(600);
    const sha256 = await this.computeSHA256(file);
    const extension = file.name.split('.').pop()?.toUpperCase() as FileType || 'PDF';

    const sourceDoc: SourceDocument = {
      id: `SRC-${Date.now().toString().slice(-4)}`,
      name: file.name,
      type: extension,
      pages: Math.max(1, Math.floor(file.size / 150000)),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sha256,
      uploadedAt: new Date().toISOString()
    };

    return createApiResponse(sourceDoc);
  }

  async analyzeDocument(documentId: string): Promise<ApiResponse<AnalysisSummary>> {
    await simulateDelay(800);
    const analysis: AnalysisSummary = {
      findings: 3,
      risks: 5,
      recommendations: 7,
      entities: 18,
      evidence: 12,
      importantData: 9,
      keySummary: [
        'Advanced persistent threat group (APT-44) identified targeting state energy infrastructure.',
        'Zero-day exploit chain detected affecting SCADA telemetry gateway firmware v4.1.',
        'Automatic isolation protocols prevented unauthorized control command execution.',
        'Mandatory patching and multi-factor hardware attestation recommended within 72 hours.'
      ]
    };

    return createApiResponse(analysis);
  }
}

export const documentService = new DocumentService();
