"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Target = void 0;
const models_1 = require("../models");
const Body_1 = require("./Body");
const core_1 = require("@har-sdk/core");
const util_1 = require("util");
class Target {
    get parsedURL() {
        return this._parsedURL;
    }
    get url() {
        if (!this._cachedUrl) {
            this._cachedUrl = this._parsedURL.toString();
        }
        return this._cachedUrl;
    }
    set url(value) {
        this._parsedURL = new URL((0, core_1.normalizeUrl)(value));
        this._cachedUrl = undefined;
        this._query = undefined;
        this._queryString = undefined;
    }
    get method() {
        return this._method;
    }
    set method(value) {
        this._method = value;
    }
    get queryString() {
        if (!this._queryString) {
            const params = this._query || this._parsedURL.search;
            this._queryString =
                typeof params !== 'string'
                    ? this.serializeQuery(params)
                    : params.replace(/^\?/, '');
        }
        return this._queryString;
    }
    get query() {
        var _a;
        return (_a = this._query) !== null && _a !== void 0 ? _a : '';
    }
    set query(queryString) {
        this._query = queryString;
        this._queryString = undefined;
        this._parsedURL.search = this.queryString;
        this._cachedUrl = undefined;
    }
    get fragment() {
        return this._parsedURL.hash;
    }
    get headers() {
        if (this._headers) {
            return this._headers;
        }
        if (!this._parsedHeaders.has('content-type') && this._parsedBody) {
            const contentType = this._parsedBody.type();
            if (contentType) {
                this._parsedHeaders.set('content-type', contentType);
            }
        }
        this._headers = Object.fromEntries(this._parsedHeaders);
        return this._headers;
    }
    set headers(value) {
        this._parsedHeaders = new Headers(value);
        delete this._headers;
    }
    get body() {
        return this._body;
    }
    set body(value) {
        if (value !== undefined &&
            (this.method === models_1.HttpMethod.GET || this.method === models_1.HttpMethod.HEAD)) {
            throw new Error('Cannot set body for GET or HEAD requests');
        }
        this._body = value;
        if (value !== undefined) {
            const contentType = this._parsedHeaders.get('content-type');
            const { essence } = contentType ? new util_1.MIMEType(contentType) : {};
            this._parsedBody = new Body_1.Body(value, essence);
        }
    }
    get serializeQuery() {
        return this._serializeQuery;
    }
    get auth() {
        return this.authId;
    }
    set auth(value) {
        this.authId = value;
    }
    constructor({ url, body, query, auth, headers = {}, serializeQuery, method = models_1.HttpMethod.GET }) {
        this.defaultSerializeQuery = (params) => new URLSearchParams(params).toString();
        this.url = url;
        this.method = (0, models_1.isHttpMethod)(method) ? method : models_1.HttpMethod.GET;
        this.headers = headers;
        this._serializeQuery = serializeQuery !== null && serializeQuery !== void 0 ? serializeQuery : this.defaultSerializeQuery;
        if (auth) {
            this.auth = auth;
        }
        if (body !== undefined) {
            this.body = body;
        }
        if (query) {
            this.query = query;
        }
    }
    async text() {
        var _a;
        return (_a = this._parsedBody) === null || _a === void 0 ? void 0 : _a.text();
    }
}
exports.Target = Target;
//# sourceMappingURL=Target.js.map