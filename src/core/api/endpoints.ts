/**
 * API Endpoints
 * Pattern: AmrutamSuperApp
 *
 * All API endpoint paths in one place.
 * Dynamic routes are functions, static routes are strings.
 *
 * Usage:
 *   import { API_ENDPOINTS } from '@/core/api/endpoints';
 *   apiClient.get(API_ENDPOINTS.ASSESSMENTS);
 *   apiClient.get(API_ENDPOINTS.ASSESSMENT_DETAIL('abc123'));
 */

export const API_ENDPOINTS = {
  // ─── Auth ──────────────────────────────────────────────────────────────
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',

  // ─── Assessments ───────────────────────────────────────────────────────
  ASSESSMENTS: '/assessments',
  ASSESSMENT_DETAIL: (id: string) => `/assessments/${id}`,
  ASSESSMENT_SUBMIT: '/assessments/submit',
  ASSESSMENT_EVALUATE: (id: string) => `/assessments/${id}/evaluate`,

  // ─── Practice ──────────────────────────────────────────────────────────
  PRACTICE_SESSIONS: '/practice',
  PRACTICE_SESSION_DETAIL: (id: string) => `/practice/${id}`,
  PRACTICE_SUBMIT: '/practice/submit',
  PRACTICE_QUESTIONS: '/practice/questions',

  // ─── Analytics ─────────────────────────────────────────────────────────
  ANALYTICS_SUMMARY: '/analytics/summary',
  ANALYTICS_TRENDS: '/analytics/trends',
  ANALYTICS_SKILLS: '/analytics/skills',

  // ─── User / Profile ────────────────────────────────────────────────────
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
} as const;