"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const url_1 = require("url");
class Request {
    get headers() {
        return this._headers;
    }
    get secureEndpoint() {
        return this.url.startsWith('https');
    }
    constructor({ protocol, method, url, body, timeout, maxContentSize, encoding, decompress = true, headers = {} }) {
        var _a;
        this._headers = {};
        this.protocol = protocol;
        this.method = (_a = method === null || method === void 0 ? void 0 : method.toUpperCase()) !== null && _a !== void 0 ? _a : 'GET';
        this.validateUrl(url);
        this.url = url.trim();
        this.precheckBody(body);
        this.body = body;
        this.setHeaders(headers);
        this.encoding = encoding;
        this.timeout = timeout;
        this.maxContentSize = maxContentSize;
        this.decompress = !!decompress;
    }
    setHeaders(headers) {
        const mergedHeaders = {
            ...this._headers,
            ...headers
        };
        this._headers = Object.fromEntries(Object.entries(mergedHeaders).map(([field, value]) => [
            field,
            Array.isArray(value) &&
                Request.SINGLE_VALUE_HEADERS.has(field.toLowerCase())
                ? value.join(', ')
                : value
        ]));
    }
    validateUrl(url) {
        try {
            new url_1.URL(url);
        }
        catch {
            throw new Error('Invalid URL.');
        }
    }
    precheckBody(body) {
        if (body && typeof body !== 'string') {
            throw new Error('Body must be string.');
        }
    }
}
exports.Request = Request;
Request.SINGLE_VALUE_HEADERS = new Set([
    'authorization',
    'content-disposition',
    'content-length',
    'content-type',
    'from',
    'host',
    'if-modified-since',
    'if-unmodified-since',
    'location',
    'max-forwards',
    'proxy-authorization',
    'referer',
    'user-agent'
]);
//# sourceMappingURL=Request.js.map