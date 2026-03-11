import { ApiClient, ApiRequestInit } from './ApiClient';
import { RetryConfig } from './RetryHandler';
export interface ApiConfig {
    baseUrl: string;
    apiKey: string;
    apiKeyPrefix?: string;
    timeout?: number;
    userAgent?: string;
    retry?: Partial<RetryConfig>;
}
export declare class FetchApiClient implements ApiClient {
    private readonly config;
    private static readonly IDEMPOTENT_METHODS;
    private readonly retryHandler;
    private readonly rateLimiter;
    constructor(config: ApiConfig);
    request(path: string, options?: ApiRequestInit): Promise<Response>;
    private makeRequest;
    private handleResponse;
    private createHeaders;
}
