export interface RateLimitPolicy {
    limit: number;
    window: number;
    type: string;
}
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
    policy?: RateLimitPolicy;
}
export declare class RateLimiter {
    extractRateLimitInfo(response: Response): RateLimitInfo;
    parseRateLimitHeader(header: string | null): Partial<RateLimitInfo>;
    parsePolicyHeader(header: string | null): RateLimitPolicy | undefined;
}
