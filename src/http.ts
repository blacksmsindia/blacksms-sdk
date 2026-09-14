import { BlackSMSClientOptions } from './types.js';
import { BlackSMSAPIError, BlackSMSNetworkError, BlackSMSError } from './errors.js';

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly customHeaders: Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: BlackSMSClientOptions) {
    if (!options || typeof options.apiKey !== 'string' || options.apiKey.trim() === '') {
      throw new BlackSMSError('BlackSMS SDK initialized without an API key. Please pass { apiKey: "YOUR_API_KEY" }.');
    }

    this.apiKey = options.apiKey.trim();
    this.baseUrl = (options.baseUrl || 'https://blacksms.in').replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs ?? 15000;
    this.customHeaders = options.headers || {};
    this.fetchImpl = options.fetch || globalThis.fetch;

    if (typeof this.fetchImpl !== 'function') {
      throw new BlackSMSError(
        'No fetch implementation available in this environment. Please run on Node.js 18+ or pass a custom `fetch` function in client options.'
      );
    }
  }

  public async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    const headers: Record<string, string> = {
      'Authorization': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.customHeaders
    };

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), this.timeoutMs)
      : null;

    try {
      const response = await this.fetchImpl(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller?.signal
      });

      let json: unknown;
      const text = await response.text();

      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        json = { raw: text };
      }

      if (!response.ok) {
        const errorMsg =
          typeof json === 'object' && json !== null && 'message' in json && typeof (json as { message: unknown }).message === 'string'
            ? (json as { message: string }).message
            : `HTTP request failed with status ${response.status}`;
        throw new BlackSMSAPIError(errorMsg, response.status, json);
      }

      // Handle standard BlackSMS success/error status structures
      if (typeof json === 'object' && json !== null) {
        const obj = json as Record<string, unknown>;
        if (obj.status === 0 || obj.success === false) {
          const message = typeof obj.message === 'string' ? obj.message : 'BlackSMS API request failed';
          throw new BlackSMSAPIError(message, response.status, json);
        }
      }

      return json as T;
    } catch (err: unknown) {
      if (err instanceof BlackSMSError) {
        throw err;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new BlackSMSNetworkError(`Request timed out after ${this.timeoutMs}ms.`);
      }
      throw new BlackSMSNetworkError(
        err instanceof Error ? err.message : 'An unknown network error occurred',
        err instanceof Error ? err : undefined
      );
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
