export type AssessmentType = 'Recorded' | 'Text';
export type AssessmentStatus = 'Completed' | 'Pending';
export type PerformanceGrade = 'Good' | 'Needs Improvement';

export interface AssessmentResult {
  id: string;
  question: string;
  assessmentType: AssessmentType;
  score: number | null;
  status: AssessmentStatus;
  feedback: string | null;
  submittedAt?: string;
  duration?: string; // e.g. "1m 45s" for recorded or "180 words" for text
  audioUri?: string;
}

export type AssessmentFilterType = 'All' | 'Recorded' | 'Text';
export type PerformanceFilterType = 'All' | 'Good' | 'Needs Improvement';
export type AssessmentStatusFilter = 'All' | 'Completed' | 'Pending';

export interface AssessmentStatsSummary {
  totalAttempted: number;
  completedCount: number;
  pendingCount: number;
  averageScore: number;
  goodCount: number;
  needsImprovementCount: number;
}