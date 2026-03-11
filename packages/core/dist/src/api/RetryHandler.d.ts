export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    jitterFactor: number;
}
export interface RetryOptions {
    idempotent?: boolean;
    signal?: AbortSignal;
}
export declare class RetryHandler {
    private readonly config;
    private static readonly RETRIABLE_STATUS_CODES;
    constructor(config: RetryConfig);
    executeWithRetry<T>(operation: () => Promise<T>, options?: RetryOptions): Promise<T>;
    private handleRetryableError;
    private isEligibleForRetry;
    private isRetryableError;
    private isNetworkError;
    private isTimeoutError;
    private calculateBackoff;
}
