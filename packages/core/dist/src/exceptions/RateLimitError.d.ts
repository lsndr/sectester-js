import { ApiError } from './ApiError';
export declare class RateLimitError extends ApiError {
    readonly retryAfter: number;
    constructor(response: Response, retryAfter: number, message?: string);
}
