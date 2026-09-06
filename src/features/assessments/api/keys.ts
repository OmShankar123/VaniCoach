export const assessmentQueryKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...assessmentQueryKeys.lists(), filters] as const,
  details: () => [...assessmentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...assessmentQueryKeys.details(), id] as const,
};