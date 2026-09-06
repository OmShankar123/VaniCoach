import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { AssessmentResult } from '@/features/assessments/types';
import { assessmentQueryKeys } from '@/features/assessments/api/keys';

export const submitAssessment = async (
  data: Partial<AssessmentResult>
): Promise<AssessmentResult> => {
  const response = await apiClient.post<AssessmentResult>(API_ENDPOINTS.ASSESSMENT_SUBMIT, data);
  return response.data;
};

export const useSubmitAssessmentMutation = (
  options?: UseMutationOptions<AssessmentResult, Error, Partial<AssessmentResult>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAssessment,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assessmentQueryKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};