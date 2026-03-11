"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryHandler = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const RateLimitError_1 = require("../exceptions/RateLimitError");
const promises_1 = require("node:timers/promises");
class RetryHandler {
    constructor(config) {
        this.config = config;
    }
    async executeWithRetry(operation, options = {}) {
        const { idempotent = true, signal } = options;
        let attempt = 0;
        for (;;) {
            // Check if the operation has been aborted
            if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                throw signal.reason;
            }
            try {
                return await operation();
            }
            catch (error) {
                // eslint-disable-next-line max-depth
                if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                    throw error;
                }
                await this.handleRetryableError(error, attempt, idempotent, signal);
                attempt++;
            }
        }
    }
    async handleRetryableError(error, attempt, idempotent, signal) {
        if (attempt >= this.config.maxRetries) {
            throw error;
        }
        if (!this.isEligibleForRetry(error, idempotent)) {
            throw error;
        }
        const delay = error instanceof RateLimitError_1.RateLimitError
            ? error.retryAfter * 1000
            : this.calculateBackoff(attempt);
        await (0, promises_1.setTimeout)(delay, undefined, { signal });
    }
    isEligibleForRetry(error, idempotent) {
        return ((this.isRetryableError(error) && idempotent) ||
            this.isNetworkError(error) ||
            error instanceof RateLimitError_1.RateLimitError);
    }
    isRetryableError(error) {
        // Don't retry if the operation was deliberately aborted
        if (error instanceof DOMException && error.name === 'AbortError') {
            return false;
        }
        return ((error instanceof ApiError_1.ApiError &&
            RetryHandler.RETRIABLE_STATUS_CODES.has(error.response.status)) ||
            this.isTimeoutError(error));
    }
    isNetworkError(error) {
        return (error instanceof TypeError &&
            (error.message.includes('fetch failed') ||
                error.message.includes('terminated')));
    }
    isTimeoutError(error) {
        return error instanceof DOMException && error.name === 'TimeoutError';
    }
    calculateBackoff(attempt) {
        const delay = Math.min(this.config.maxDelay, this.config.baseDelay * Math.pow(2, attempt));
        const jitter = delay * this.config.jitterFactor * Math.random();
        return delay + jitter;
    }
}
exports.RetryHandler = RetryHandler;
RetryHandler.RETRIABLE_STATUS_CODES = new Set([408, 409, 429, 500, 502, 503, 504]);
//# sourceMappingURL=RetryHandler.js.map