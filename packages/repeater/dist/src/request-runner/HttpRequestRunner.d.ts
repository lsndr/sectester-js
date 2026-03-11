import { RequestRunner } from './RequestRunner';
import { Response } from './Response';
import { Request } from './Request';
import { Protocol } from '../models';
import { RequestRunnerOptions } from './RequestRunnerOptions';
import { ProxyFactory } from '../utils';
import { Logger } from '@sectester/core';
export declare class HttpRequestRunner implements RequestRunner {
    private readonly logger;
    private readonly proxyFactory;
    private readonly options;
    readonly DEFAULT_MIME_TYPE = "application/octet-stream";
    readonly DEFAULT_ENCODING = "utf8";
    private readonly httpProxyAgent?;
    private readonly httpsProxyAgent?;
    private readonly httpAgent?;
    private readonly httpsAgent?;
    get protocol(): Protocol;
    constructor(logger: Logger, proxyFactory: ProxyFactory, options: RequestRunnerOptions);
    run(options: Request): Promise<Response>;
    private convertHeaders;
    private request;
    private createRequest;
    private setTimeout;
    private createRequestOptions;
    private getRequestAgent;
    private truncateResponse;
    private parseContentType;
    private unzipBody;
    private responseHasNoBody;
    private parseBody;
    /**
     * Allows to attack headers. Node.js does not accept any other characters
     * which violate [rfc7230](https://tools.ietf.org/html/rfc7230#section-3.2.6).
     * To override default behavior bypassing {@link OutgoingMessage.setHeader} method we have to set headers via internal symbol.
     */
    private setHeaders;
}
