export const ENV = {
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.vani.coach/v1',
  COACHING_SERVICE_URL:
    process.env.EXPO_PUBLIC_COACHING_SERVICE_URL || 'https://experience.vani.coach',
  AI_MODEL: process.env.EXPO_PUBLIC_AI_EVALUATION_MODEL || 'vani-coaching-eval-v2',
  MOCK_AI_DELAY_MS: Number(process.env.EXPO_PUBLIC_MOCK_AI_DELAY_MS) || 2200,
  ENABLE_VOICE_RECORDING: process.env.EXPO_PUBLIC_ENABLE_VOICE_RECORDING !== 'false',
  ENABLE_DEBUG_STATS: process.env.EXPO_PUBLIC_ENABLE_DEBUG_STATS === 'true',

  get isDevelopment(): boolean {
    return this.APP_ENV === 'development';
  },
  get isProduction(): boolean {
    return this.APP_ENV === 'production';
  },
} as const;