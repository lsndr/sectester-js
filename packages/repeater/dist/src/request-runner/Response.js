"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
class Response {
    constructor({ protocol, statusCode, headers, body, message, errorCode, encoding }) {
        this.protocol = protocol;
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
        this.errorCode = errorCode;
        this.message = message;
        this.encoding = encoding;
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map