import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { AssessmentResult } from '@/features/assessments/types';
import { assessmentQueryKeys } from '@/features/assessments/api/keys';

export const evaluateAssessment = async (id: string): Promise<AssessmentResult> => {
  const response = await apiClient.post<AssessmentResult>(API_ENDPOINTS.ASSESSMENT_EVALUATE(id));
  return response.data;
};

export const useEvaluateAssessmentMutation = (
  options?: UseMutationOptions<AssessmentResult, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: evaluateAssessment,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assessmentQueryKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
