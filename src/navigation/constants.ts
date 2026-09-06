export const NAVIGATION = {
  MAIN_TABS: 'MainTabs',
  RESULTS: 'Results',
  PRACTICE: 'Practice',
  ANALYTICS: 'Analytics',
} as const;

export type NavigationRoute = (typeof NAVIGATION)[keyof typeof NAVIGATION];