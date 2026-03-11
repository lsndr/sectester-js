"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchApiClient = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const RateLimitError_1 = require("../exceptions/RateLimitError");
const RateLimiter_1 = require("./RateLimiter");
const RetryHandler_1 = require("./RetryHandler");
const node_util_1 = require("node:util");
const node_crypto_1 = require("node:crypto");
class FetchApiClient {
    constructor(config) {
        this.config = config;
        this.rateLimiter = new RateLimiter_1.RateLimiter();
        this.retryHandler = new RetryHandler_1.RetryHandler({
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 30000,
            jitterFactor: 0.3,
            ...config.retry
        });
    }
    request(path, options) {
        var _a, _b, _c;
        const url = new URL(path, this.config.baseUrl);
        const requestOptions = {
            redirect: 'follow',
            keepalive: true,
            ...options,
            headers: this.createHeaders(options === null || options === void 0 ? void 0 : options.headers),
            method: ((_a = options === null || options === void 0 ? void 0 : options.method) !== null && _a !== void 0 ? _a : 'GET').toUpperCase(),
            handle409Redirects: (_b = options === null || options === void 0 ? void 0 : options.handle409Redirects) !== null && _b !== void 0 ? _b : true
        };
        const idempotent = FetchApiClient.IDEMPOTENT_METHODS.has(requestOptions.method);
        return this.retryHandler.executeWithRetry(() => this.makeRequest(url, requestOptions), {
            idempotent,
            signal: (_c = requestOptions.signal) !== null && _c !== void 0 ? _c : undefined
        });
    }
    async makeRequest(url, options) {
        var _a, _b;
        const { handle409Redirects = true, ...requestOptions } = options !== null && options !== void 0 ? options : {};
        const signal = (_a = requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.signal) !== null && _a !== void 0 ? _a : AbortSignal.timeout((_b = this.config.timeout) !== null && _b !== void 0 ? _b : 10000);
        const response = await fetch(url, {
            ...requestOptions,
            signal
        });
        return this.handleResponse(response, handle409Redirects);
    }
    // eslint-disable-next-line complexity
    async handleResponse(response, handle409Redirects = true) {
        var _a;
        if (!response.ok) {
            if (response.status === 409 &&
                response.headers.has('location') &&
                handle409Redirects) {
                const locationPath = response.headers.get('location');
                // eslint-disable-next-line max-depth
                if (locationPath) {
                    // Handle both absolute and relative URLs
                    const locationUrl = new URL(locationPath, this.config.baseUrl);
                    return this.request(locationUrl.toString());
                }
            }
            const rateLimitInfo = this.rateLimiter.extractRateLimitInfo(response);
            const contentType = response.headers.get('content-type');
            const mimeType = contentType ? new node_util_1.MIMEType(contentType) : undefined;
            const responseBody = (mimeType === null || mimeType === void 0 ? void 0 : mimeType.type) === 'text' ? await response.clone().text() : undefined;
            if (response.status === 429) {
                const retryAfter = parseInt((_a = response.headers.get('retry-after')) !== null && _a !== void 0 ? _a : rateLimitInfo.reset.toString(), 10);
                throw new RateLimitError_1.RateLimitError(response, retryAfter, responseBody);
            }
            throw new ApiError_1.ApiError(response, responseBody);
        }
        return response;
    }
    createHeaders(headersInit = {}) {
        var _a;
        const headers = new Headers({
            ...headersInit,
            'idempotency-key': (0, node_crypto_1.randomUUID)(),
            ...(this.config.userAgent ? { 'user-agent': this.config.userAgent } : {})
        });
        if (this.config.apiKey) {
            const prefix = (_a = this.config.apiKeyPrefix) !== null && _a !== void 0 ? _a : 'Api-Key';
            headers.set('authorization', `${prefix} ${this.config.apiKey}`);
        }
        return headers;
    }
}
exports.FetchApiClient = FetchApiClient;
FetchApiClient.IDEMPOTENT_METHODS = new Set([
    'GET',
    'HEAD',
    'PUT',
    'DELETE',
    'OPTIONS',
    'TRACE'
]);
//# sourceMappingURL=FetchApiClient.js.map