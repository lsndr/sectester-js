"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultProxyFactory = void 0;
const PatchedHttpsProxyAgent_1 = require("./PatchedHttpsProxyAgent");
const http_proxy_agent_1 = require("http-proxy-agent");
const socks_proxy_agent_1 = require("socks-proxy-agent");
class DefaultProxyFactory {
    createProxy({ proxyUrl, rejectUnauthorized = false }) {
        let protocol;
        try {
            ({ protocol } = new URL(proxyUrl));
        }
        catch (error) {
            throw new Error(`Invalid Proxy URL: '${proxyUrl}'. Please provide a valid URL.`);
        }
        switch (protocol) {
            case 'http:':
            case 'https:':
                return this.createHttpProxy(proxyUrl, rejectUnauthorized);
            case 'socks:':
            case 'socks4:':
            case 'socks4a:':
            case 'socks5:':
            case 'socks5h:':
                return this.createSocksProxy(proxyUrl);
            default:
                throw new Error(`Unsupported proxy protocol: '${protocol.replace(':', '')}'. Please use a supported protocol (HTTP(S), SOCKS4, or SOCKS5).`);
        }
    }
    createProxyForClient({ targetUrl, ...options }) {
        const proxies = this.createProxy(options);
        let protocol;
        try {
            ({ protocol } = new URL(targetUrl));
        }
        catch (error) {
            throw new Error(`Invalid Target URL: '${targetUrl}'. Please contact support at support@brightsec.com`);
        }
        switch (protocol) {
            case 'http:':
            case 'ws:':
                return proxies.httpAgent;
            case 'https:':
            case 'wss:':
                return proxies.httpsAgent;
            default:
                throw new Error(`Proxy not supported for protocol '${protocol}'. Please contact support at support@brightsec.com`);
        }
    }
    createHttpProxy(proxyUrl, rejectUnauthorized) {
        return {
            httpsAgent: new PatchedHttpsProxyAgent_1.PatchedHttpsProxyAgent(proxyUrl, {
                rejectUnauthorized
            }),
            httpAgent: new http_proxy_agent_1.HttpProxyAgent(proxyUrl, {
                rejectUnauthorized
            })
        };
    }
    createSocksProxy(proxyUrl) {
        const common = new socks_proxy_agent_1.SocksProxyAgent(proxyUrl);
        return { httpAgent: common, httpsAgent: common };
    }
}
exports.DefaultProxyFactory = DefaultProxyFactory;
//# sourceMappingURL=DefaultProxyFactory.js.map