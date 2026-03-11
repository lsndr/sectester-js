"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestRunner = void 0;
const tslib_1 = require("tslib");
const Response_1 = require("./Response");
const models_1 = require("../models");
const RequestRunnerOptions_1 = require("./RequestRunnerOptions");
const utils_1 = require("../utils");
const core_1 = require("@sectester/core");
const tsyringe_1 = require("tsyringe");
const iconv_lite_1 = tslib_1.__importDefault(require("iconv-lite"));
const node_url_1 = require("node:url");
const node_http_1 = tslib_1.__importDefault(require("node:http"));
const node_https_1 = tslib_1.__importDefault(require("node:https"));
const node_events_1 = require("node:events");
const node_zlib_1 = require("node:zlib");
const node_util_1 = require("node:util");
let HttpRequestRunner = class HttpRequestRunner {
    get protocol() {
        return models_1.Protocol.HTTP;
    }
    constructor(logger, proxyFactory, options) {
        this.logger = logger;
        this.proxyFactory = proxyFactory;
        this.options = options;
        this.DEFAULT_MIME_TYPE = 'application/octet-stream';
        this.DEFAULT_ENCODING = 'utf8';
        if (this.options.proxyUrl) {
            ({ httpsAgent: this.httpsProxyAgent, httpAgent: this.httpProxyAgent } =
                this.proxyFactory.createProxy({ proxyUrl: this.options.proxyUrl }));
        }
        if (this.options.reuseConnection) {
            const agentOptions = {
                keepAlive: true,
                maxSockets: 100,
                timeout: this.options.timeout
            };
            this.httpsAgent = new node_https_1.default.Agent(agentOptions);
            this.httpAgent = new node_http_1.default.Agent(agentOptions);
        }
    }
    async run(options) {
        var _a;
        try {
            if (this.options.headers) {
                options.setHeaders(this.options.headers);
            }
            this.logger.debug('Executing HTTP request with following params: %j', options);
            const { res, body } = await this.request(options);
            return new Response_1.Response({
                body,
                protocol: this.protocol,
                statusCode: res.statusCode,
                headers: this.convertHeaders(res.headers),
                encoding: options.encoding
            });
        }
        catch (err) {
            const { cause } = err;
            const { message, code, syscall, name } = cause !== null && cause !== void 0 ? cause : err;
            const errorCode = (_a = code !== null && code !== void 0 ? code : syscall) !== null && _a !== void 0 ? _a : name;
            this.logger.error('Error executing request: "%s %s HTTP/1.1"', options.method, options.url);
            this.logger.error('Cause: %s', message);
            return new Response_1.Response({
                message,
                errorCode,
                protocol: this.protocol
            });
        }
    }
    convertHeaders(headers) {
        return Object.fromEntries(Object.entries(headers).map(([name, value]) => [
            name,
            value !== null && value !== void 0 ? value : ''
        ]));
    }
    async request(options) {
        let timer;
        let res;
        try {
            const req = this.createRequest(options);
            process.nextTick(() => req.end(options.encoding && options.body
                ? iconv_lite_1.default.encode(options.body, options.encoding)
                : options.body));
            timer = this.setTimeout(req, options.timeout);
            [res] = (await (0, node_events_1.once)(req, 'response'));
        }
        finally {
            clearTimeout(timer);
        }
        return this.truncateResponse(options, res);
    }
    createRequest(request) {
        const protocol = request.secureEndpoint ? node_https_1.default : node_http_1.default;
        const outgoingMessage = protocol.request(this.createRequestOptions(request));
        this.setHeaders(outgoingMessage, request);
        if (!outgoingMessage.hasHeader('accept-encoding')) {
            outgoingMessage.setHeader('accept-encoding', 'gzip, deflate');
        }
        return outgoingMessage;
    }
    setTimeout(req, timeout) {
        timeout !== null && timeout !== void 0 ? timeout : (timeout = this.options.timeout);
        if (typeof timeout === 'number') {
            return setTimeout(() => req.destroy(Object.assign(new Error('Waiting response has timed out'), {
                code: 'ETIMEDOUT'
            })), timeout);
        }
    }
    createRequestOptions(request) {
        var _a;
        const { auth, hostname, port, hash = '', pathname = '/', search = '' } = (0, node_url_1.parse)(request.url);
        const path = `${pathname !== null && pathname !== void 0 ? pathname : '/'}${search !== null && search !== void 0 ? search : ''}${hash !== null && hash !== void 0 ? hash : ''}`;
        const agent = this.getRequestAgent(request);
        const timeout = (_a = request.timeout) !== null && _a !== void 0 ? _a : this.options.timeout;
        return {
            hostname,
            port,
            path,
            auth,
            agent,
            timeout,
            method: request.method,
            rejectUnauthorized: false
        };
    }
    getRequestAgent(options) {
        var _a, _b;
        return options.secureEndpoint
            ? ((_a = this.httpsProxyAgent) !== null && _a !== void 0 ? _a : this.httpsAgent)
            : ((_b = this.httpProxyAgent) !== null && _b !== void 0 ? _b : this.httpAgent);
    }
    async truncateResponse({ decompress, encoding, maxContentSize }, res) {
        var _a;
        if (this.responseHasNoBody(res)) {
            this.logger.debug('The response does not contain any body.');
            return { res, body: '' };
        }
        const contentType = this.parseContentType(res);
        const { type } = contentType;
        const requiresTruncating = this.options.maxContentLength !== -1 &&
            !((_a = this.options.allowedMimes) === null || _a === void 0 ? void 0 : _a.some((mime) => type.startsWith(mime)));
        const maxBodySize = typeof maxContentSize === 'number'
            ? maxContentSize * 1024
            : this.options.maxContentLength
                ? Math.abs(this.options.maxContentLength) * 1024
                : undefined;
        const body = await this.parseBody(res, {
            decompress,
            maxBodySize: requiresTruncating ? maxBodySize : undefined
        });
        res.headers['content-length'] = body.byteLength.toFixed();
        if (decompress) {
            delete res.headers['content-encoding'];
        }
        return { res, body: iconv_lite_1.default.decode(body, encoding !== null && encoding !== void 0 ? encoding : contentType.encoding) };
    }
    parseContentType(res) {
        const contentType = res.headers['content-type'] || this.DEFAULT_MIME_TYPE;
        try {
            const { params, essence: type } = new node_util_1.MIMEType(contentType);
            let encoding = params.get('charset');
            if (!encoding || !iconv_lite_1.default.encodingExists(encoding)) {
                encoding = this.DEFAULT_ENCODING;
            }
            return { type, encoding };
        }
        catch (err) {
            this.logger.debug('Invalid content-type header "%s", falling back to defaults: %s', contentType, err instanceof Error ? err.message : String(err));
            return {
                type: this.DEFAULT_MIME_TYPE,
                encoding: this.DEFAULT_ENCODING
            };
        }
    }
    unzipBody(response) {
        let body = response;
        if (!this.responseHasNoBody(response)) {
            let contentEncoding = response.headers['content-encoding'] || 'identity';
            contentEncoding = contentEncoding.trim().toLowerCase();
            // Always using Z_SYNC_FLUSH is what cURL does.
            const zlibOptions = {
                flush: node_zlib_1.constants.Z_SYNC_FLUSH,
                finishFlush: node_zlib_1.constants.Z_SYNC_FLUSH
            };
            switch (contentEncoding) {
                case 'gzip':
                    body = response.pipe((0, node_zlib_1.createGunzip)(zlibOptions));
                    break;
                case 'deflate':
                    body = response
                        .pipe(new utils_1.NormalizeZlibDeflateTransformStream())
                        .pipe((0, node_zlib_1.createInflate)(zlibOptions));
                    break;
                case 'br':
                    body = response.pipe((0, node_zlib_1.createBrotliDecompress)());
                    break;
            }
        }
        return body;
    }
    responseHasNoBody(response) {
        return (response.method === 'HEAD' ||
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (response.statusCode >= 100 && response.statusCode < 200) ||
            response.statusCode === 204 ||
            response.statusCode === 304);
    }
    async parseBody(res, options) {
        const chunks = [];
        const stream = options.decompress ? this.unzipBody(res) : res;
        for await (const chuck of stream) {
            chunks.push(chuck);
        }
        let body = Buffer.concat(chunks);
        const truncated = typeof options.maxBodySize === 'number' &&
            body.byteLength > options.maxBodySize;
        if (truncated) {
            this.logger.debug('Truncate original response body to %i bytes', options.maxBodySize);
            body = body.subarray(0, options.maxBodySize);
        }
        return body;
    }
    /**
     * Allows to attack headers. Node.js does not accept any other characters
     * which violate [rfc7230](https://tools.ietf.org/html/rfc7230#section-3.2.6).
     * To override default behavior bypassing {@link OutgoingMessage.setHeader} method we have to set headers via internal symbol.
     */
    setHeaders(req, options) {
        var _a;
        const symbols = Object.getOwnPropertySymbols(req);
        const headersSymbol = symbols.find(
        // ADHOC: Node.js version < 12 uses "outHeadersKey" symbol to set headers
        item => ['Symbol(kOutHeaders)', 'Symbol(outHeadersKey)'].includes(item.toString()));
        if (!req.headersSent && headersSymbol && options.headers) {
            const headers = (req[headersSymbol] =
                (_a = req[headersSymbol]) !== null && _a !== void 0 ? _a : Object.create(null));
            Object.entries(options.headers).forEach(([key, value]) => {
                if (key) {
                    headers[key.toLowerCase()] = [key.toLowerCase(), value !== null && value !== void 0 ? value : ''];
                }
            });
        }
    }
};
exports.HttpRequestRunner = HttpRequestRunner;
exports.HttpRequestRunner = HttpRequestRunner = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(1, (0, tsyringe_1.inject)(utils_1.ProxyFactory)),
    tslib_1.__param(2, (0, tsyringe_1.inject)(RequestRunnerOptions_1.RequestRunnerOptions)),
    tslib_1.__metadata("design:paramtypes", [core_1.Logger, Object, Object])
], HttpRequestRunner);
//# sourceMappingURL=HttpRequestRunner.js.map