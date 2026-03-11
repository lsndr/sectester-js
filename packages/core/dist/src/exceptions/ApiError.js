"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const SecTesterError_1 = require("./SecTesterError");
class ApiError extends SecTesterError_1.SecTesterError {
    constructor(response, message) {
        super(message !== null && message !== void 0 ? message : `API request failed with status ${response.status}`);
        this.response = response;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map