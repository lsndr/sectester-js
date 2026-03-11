import { ProxyFactory, ProxyOptions, TargetProxyOptions } from './ProxyFactory';
import { PatchedHttpsProxyAgent } from './PatchedHttpsProxyAgent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import https from 'node:https';
import http from 'node:http';
export declare class DefaultProxyFactory implements ProxyFactory {
    createProxy({ proxyUrl, rejectUnauthorized }: ProxyOptions): {
        httpsAgent: PatchedHttpsProxyAgent<string>;
        httpAgent: HttpProxyAgent<string>;
    } | {
        httpAgent: SocksProxyAgent;
        httpsAgent: SocksProxyAgent;
    };
    createProxyForClient({ targetUrl, ...options }: TargetProxyOptions): https.Agent | http.Agent;
    private createHttpProxy;
    private createSocksProxy;
}
