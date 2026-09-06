import { TransformationJob, PipelineStage, JobStatus } from '../types/pipeline';
import { initialMockJobs } from '../data/mockJobs';
import { calculateFileSHA256 } from '../utils/hash';

let jobsState: TransformationJob[] = [...initialMockJobs];

export const pipelineService = {
  async getJobs(): Promise<TransformationJob[]> {
    await new Promise(r => setTimeout(r, 150));
    return [...jobsState];
  },

  async getJobById(id: string): Promise<TransformationJob | undefined> {
    await new Promise(r => setTimeout(r, 100));
    return jobsState.find(j => j.id === id);
  },

  async startIngestion(file: File, author: string = 'Content Operator'): Promise<TransformationJob> {
    const hash = await calculateFileSHA256(file);
    const newJob: TransformationJob = {
      id: `SF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      classification: 'Institutional Content Transformation',
      fileType: (file.name.split('.').pop()?.toUpperCase() as any) || 'PDF',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sha256: hash,
      stage: 2,
      stageLabel: 'Document Analysis',
      progressPct: 50,
      claimsTotal: 23,
      claimsVerified: 22,
      claimsFlagged: 1,
      updatedAt: new Date().toISOString(),
      status: 'NEEDS_REVIEW',
      primaryAuthor: author,
      detectedEntitiesCount: 17,
      topicSummary: 'Regional Transmission System Infrastructure & Compliance',
      detectedLanguage: 'English (Technical)',
      totalPages: 24
    };
    jobsState = [newJob, ...jobsState];
    return newJob;
  },

  async advanceStage(jobId: string, targetStage: PipelineStage): Promise<TransformationJob> {
    await new Promise(r => setTimeout(r, 200));
    const stageLabels: Record<PipelineStage, string> = {
      1: 'Source',
      2: 'Document Analysis',
      3: 'Choose Outputs',
      4: 'Review'
    };
    jobsState = jobsState.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          stage: targetStage,
          stageLabel: stageLabels[targetStage],
          progressPct: targetStage * 25,
          updatedAt: new Date().toISOString()
        };
      }
      return job;
    });
    const updated = jobsState.find(j => j.id === jobId);
    if (!updated) throw new Error('Job not found');
    return updated;
  },

  async updateJobStatus(jobId: string, status: JobStatus): Promise<TransformationJob> {
    await new Promise(r => setTimeout(r, 150));
    jobsState = jobsState.map(j => j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j);
    const updated = jobsState.find(j => j.id === jobId);
    if (!updated) throw new Error('Job not found');
    return updated;
  }
};
