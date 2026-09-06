import { OutputDossier, OutputVariant } from '../types/output';
import { primaryMockOutput } from '../data/mockOutputs';

let outputState: OutputDossier = { ...primaryMockOutput };

export const outputService = {
  async getOutputByJobId(jobId: string): Promise<OutputDossier> {
    await new Promise(r => setTimeout(r, 200));
    return { ...outputState, jobId };
  },

  async updateAdvisoryText(newText: Partial<OutputDossier['advisoryText']>): Promise<OutputDossier> {
    await new Promise(r => setTimeout(r, 200));
    outputState = {
      ...outputState,
      advisoryText: {
        ...outputState.advisoryText,
        ...newText
      }
    };
    return { ...outputState };
  },

  async exportDocument(jobId: string, format: 'PDF' | 'JSON-LD' | 'DOCX'): Promise<Blob> {
    await new Promise(r => setTimeout(r, 600));
    const content = format === 'JSON-LD'
      ? JSON.stringify(outputState, null, 2)
      : `SOURCEFLOW INSTITUTIONAL ADVISORY [${jobId}]\n\n${outputState.advisoryText.executiveSummary}\n\n${outputState.advisoryText.incidentAnalysis}`;
    return new Blob([content], { type: format === 'JSON-LD' ? 'application/ld+json' : 'text/plain' });
  }
};
