import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { AssessmentResult } from '@/features/assessments/types';

export const assessmentQueryKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...assessmentQueryKeys.all, 'detail', id] as const,
};

export function useAssessmentsQuery() {
  return useQuery({
    queryKey: assessmentQueryKeys.lists(),
    queryFn: () => apiClient.get<AssessmentResult[]>(API_ENDPOINTS.ASSESSMENTS),
    enabled: false,
  });
}

export function useSubmitAssessmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AssessmentResult>) =>
      apiClient.post<AssessmentResult>(API_ENDPOINTS.ASSESSMENT_SUBMIT, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assessmentQueryKeys.all });
    },
  });
}

export function useEvaluateAssessmentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<AssessmentResult>(API_ENDPOINTS.ASSESSMENT_EVALUATE(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assessmentQueryKeys.all });
    },
  });
}