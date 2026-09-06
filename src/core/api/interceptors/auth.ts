import { appStorage } from '@/core/storage';

const TOKEN_KEY = 'vani_auth_token';
const REFRESH_TOKEN_KEY = 'vani_refresh_token';

export function getAuthToken(): string | null {
  return appStorage.getString(TOKEN_KEY) ?? null;
}

export function setAuthToken(token: string): void {
  appStorage.set(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  return appStorage.getString(REFRESH_TOKEN_KEY) ?? null;
}

export function setRefreshToken(token: string): void {
  appStorage.set(REFRESH_TOKEN_KEY, token);
}

export function clearAuthTokens(): void {
  appStorage.remove(TOKEN_KEY);
  appStorage.remove(REFRESH_TOKEN_KEY);
}

export function attachAuthHeader(
  headers: Record<string, string>,
  skipAuth = false,
): Record<string, string> {
  if (skipAuth) return headers;
  const token = getAuthToken();
  if (token) return { ...headers, Authorization: `Bearer ${token}` };
  return headers;
}

export async function handle401(): Promise<boolean> {
  clearAuthTokens();
  return false;
}
