import { HttpsProxyAgent, type HttpsProxyAgentOptions } from 'https-proxy-agent';
import { type URL } from 'node:url';
import type http from 'node:http';
import type net from 'node:net';
declare const kTlsUpgradeOptions: unique symbol;
export declare class PatchedHttpsProxyAgent<T extends string> extends HttpsProxyAgent<T> {
    private readonly [kTlsUpgradeOptions]?;
    constructor(proxy: T | URL, opts?: HttpsProxyAgentOptions<T>);
    connect(req: http.ClientRequest, opts: Parameters<HttpsProxyAgent<T>['connect']>[1]): Promise<net.Socket>;
}
export {};
