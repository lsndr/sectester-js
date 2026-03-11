"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    extractRateLimitInfo(response) {
        var _a, _b, _c;
        const rateLimitHeader = response.headers.get('ratelimit');
        const policyHeader = response.headers.get('ratelimit-policy');
        const rateLimit = this.parseRateLimitHeader(rateLimitHeader);
        const policy = this.parsePolicyHeader(policyHeader);
        return {
            policy,
            limit: (_a = rateLimit.limit) !== null && _a !== void 0 ? _a : 0,
            remaining: (_b = rateLimit.remaining) !== null && _b !== void 0 ? _b : 0,
            reset: (_c = rateLimit.reset) !== null && _c !== void 0 ? _c : 0
        };
    }
    parseRateLimitHeader(header) {
        if (!header)
            return {};
        const parts = header.split(',');
        const result = {};
        parts.forEach(part => {
            const [key, value] = part.split('=');
            switch (key) {
                case 'limit':
                    result.limit = parseInt(value, 10);
                    break;
                case 'remaining':
                    result.remaining = parseInt(value, 10);
                    break;
                case 'reset':
                    result.reset = parseInt(value, 10);
                    break;
            }
        });
        return result;
    }
    parsePolicyHeader(header) {
        if (!header)
            return undefined;
        const parts = header.split(';');
        if (parts.length < 3)
            return undefined;
        const result = {
            limit: 0,
            window: 0,
            type: ''
        };
        const [limit, ...rest] = parts;
        result.limit = parseInt(limit, 10);
        rest.forEach(part => {
            const [key, value] = part
                .split('=', 2)
                .map(s => s.trim());
            switch (key) {
                case 'window':
                    result.window = parseInt(value, 10);
                    break;
                case 'type':
                    result.type = value;
                    break;
            }
        });
        if (result.limit && result.window && result.type) {
            return result;
        }
        return undefined;
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=RateLimiter.js.map