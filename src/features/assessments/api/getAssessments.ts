import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { AssessmentResult } from '@/features/assessments/types';
import { assessmentQueryKeys } from '@/features/assessments/api/keys';

export const getAssessments = async (): Promise<AssessmentResult[]> => {
  const response = await apiClient.get<AssessmentResult[]>(API_ENDPOINTS.ASSESSMENTS);
  return response.data;
};

export const useAssessmentsQuery = (
  options?: Partial<UseQueryOptions<AssessmentResult[], Error>>
) => {
  return useQuery({
    queryKey: assessmentQueryKeys.lists(),
    queryFn: getAssessments,
    enabled: false,
    ...options,
  });
};