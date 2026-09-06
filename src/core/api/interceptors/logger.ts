import { ENV } from '@/shared';
import type { RequestOptions } from '@/core/api/types';

export function logRequest(url: string, options: RequestOptions): void {
  if (!ENV.isDevelopment) return;
  console.log(`[API Request] ${options.method ?? 'GET'} ${url}`);
}

export function logResponse(url: string, status: number, data: unknown): void {
  if (!ENV.isDevelopment) return;
  console.log(`[API Response] ${status} ${url}`, data);
}

export function logError(url: string, error: unknown): void {
  if (!ENV.isDevelopment) return;
  console.error(`[API Error] ${url}`, error);
}