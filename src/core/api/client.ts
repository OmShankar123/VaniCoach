import { ENV } from '@/shared';
import { parseResponseError, parseNetworkError, ApiException } from '@/core/api/errorHandler';
import { attachAuthHeader, handle401 } from '@/core/api/interceptors/auth';
import { logRequest, logResponse, logError } from '@/core/api/interceptors/logger';
import type { ApiResponse, RequestOptions } from '@/core/api/types';

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = ENV.API_URL, timeout: number = 15000) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  private async executeFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const timeout = options.timeoutMs ?? this.defaultTimeout;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) ?? {}),
    };

    const finalHeaders = attachAuthHeader(headers);
    logRequest(url, { ...options, headers: finalHeaders });

    try {
      let response = await fetch(url, {
        ...options,
        headers: finalHeaders,
        signal: controller.signal,
      });

      if (response.status === 401) {
        const refreshed = await handle401();
        if (refreshed) {
          const retryHeaders = attachAuthHeader(headers);
          response = await fetch(url, {
            ...options,
            headers: retryHeaders,
            signal: controller.signal,
          });
        }
      }

      if (!response.ok) {
        const error = await parseResponseError(response);
        logError(url, error);
        throw new ApiException(error);
      }

      const data: T = await response.json();
      logResponse(url, response.status, data);

      return {
        data,
        success: true,
      };
    } catch (err) {
      if (err instanceof ApiException) {
        throw err;
      }
      const networkError = parseNetworkError(err);
      logError(url, networkError);
      throw new ApiException(networkError);
    } finally {
      clearTimeout(timer);
    }
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeFetch<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.executeFetch<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export { ApiException };