import type {
  TokenMetricsClientConfig,
  TokenMetricsDailyOhlcvResponse,
  TokenMetricsTokensResponse,
} from './types';

type RequestParams = Record<string, string | number | boolean | undefined | null>;

class TokenMetricsRequestError extends Error {
  constructor(message: string, readonly retryable: boolean) {
    super(message);
    this.name = 'TokenMetricsRequestError';
  }
}

export class TokenMetricsClient {
  private readonly baseUrl: string;

  private readonly apiKey: string;

  private readonly timeoutMs: number;

  private readonly apiVersion: 'v2' | 'v3';

  constructor(config: TokenMetricsClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? 8000;
    this.apiVersion = config.apiVersion;
  }

  async fetchTokens(params: RequestParams): Promise<TokenMetricsTokensResponse> {
    const endpoints = this.apiVersion === 'v3'
      ? ['/tokens', '/tokens/info']
      : ['/tokens', '/tokens/info'];

    return this.request<TokenMetricsTokensResponse>(endpoints, params);
  }

  async fetchDailyOhlcv(params: RequestParams): Promise<TokenMetricsDailyOhlcvResponse> {
    const endpoints = this.apiVersion === 'v3'
      ? ['/daily-ohlcv', '/ohlcv/daily']
      : ['/daily-ohlcv', '/ohlcv/daily'];

    return this.request<TokenMetricsDailyOhlcvResponse>(endpoints, params);
  }

  private async request<T>(path: string | string[], params: RequestParams): Promise<T> {
    const candidates = Array.isArray(path) ? path : [path];
    let lastError: Error | null = null;

    for (const candidate of candidates) {
      const url = new URL(`${this.baseUrl}${candidate}`);
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .forEach(([key, value]) => {
          url.searchParams.set(key, String(value));
        });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-api-key': this.apiKey,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = await response.text();
          const retryable = response.status === 404 && candidate !== candidates[candidates.length - 1];
          throw new TokenMetricsRequestError(
            `Token Metrics request failed (${response.status}) [${candidate}]: ${body}`,
            retryable,
          );
        }

        return (await response.json()) as T;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        lastError = err;

        if (err instanceof TokenMetricsRequestError && err.retryable) {
          continue;
        }

        throw err;
      } finally {
        clearTimeout(timeout);
      }
    }

    throw lastError ?? new Error('Token Metrics request failed: no endpoint candidates succeeded');
  }
}
