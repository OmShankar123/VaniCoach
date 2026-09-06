import type { ApiError } from '@/core/api/types';

export class ApiException extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.statusCode = error.statusCode;
    this.code = error.code;
  }
}

const STATUS_CODE_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
};

export async function parseResponseError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`;
  try {
    const json = await response.json();
    if (json?.message) message = json.message;
    else if (json?.error) message = json.error;
  } catch {
    // non-JSON body
  }
  return {
    message,
    statusCode: response.status,
    code: STATUS_CODE_MAP[response.status] ?? 'UNKNOWN_ERROR',
  };
}

export function parseNetworkError(error: unknown): ApiError {
  if (error instanceof ApiException) {
    return { message: error.message, statusCode: error.statusCode, code: error.code };
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred';

  if (
    message.includes('Network request failed') ||
    message.includes('Failed to fetch') ||
    message.includes('Network offline')
  ) {
    return { message: 'No internet connection', statusCode: 0, code: 'NETWORK_OFFLINE' };
  }

  if (message.includes('timeout') || message.includes('AbortError')) {
    return { message: 'Request timed out', statusCode: 408, code: 'TIMEOUT' };
  }

  return { message, statusCode: 0, code: 'UNKNOWN_ERROR' };
}

export function isUnauthorized(error: ApiError): boolean {
  return error.statusCode === 401 || error.code === 'UNAUTHORIZED';
}

export function isOffline(error: ApiError): boolean {
  return error.code === 'NETWORK_OFFLINE' || error.statusCode === 0;
}