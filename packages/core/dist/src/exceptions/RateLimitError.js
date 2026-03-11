"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = void 0;
const ApiError_1 = require("./ApiError");
class RateLimitError extends ApiError_1.ApiError {
    constructor(response, retryAfter, message = `Rate limited, retry after ${retryAfter} seconds`) {
        super(response, message);
        this.retryAfter = retryAfter;
    }
}
exports.RateLimitError = RateLimitError;
//# sourceMappingURL=RateLimitError.js.map