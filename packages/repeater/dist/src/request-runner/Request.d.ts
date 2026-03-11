import { Protocol } from '../models';
export interface RequestOptions {
    protocol: Protocol;
    url: string;
    headers?: Record<string, string | string[]>;
    method?: string;
    body?: string;
    encoding?: 'base64';
    maxContentSize?: number;
    timeout?: number;
    decompress?: boolean;
}
export declare class Request {
    static readonly SINGLE_VALUE_HEADERS: ReadonlySet<string>;
    readonly protocol: Protocol;
    readonly url: string;
    readonly method: string;
    readonly body?: string;
    readonly encoding?: 'base64';
    readonly maxContentSize?: number;
    readonly decompress?: boolean;
    readonly timeout?: number;
    private _headers;
    get headers(): Readonly<Record<string, string | string[]>>;
    get secureEndpoint(): boolean;
    constructor({ protocol, method, url, body, timeout, maxContentSize, encoding, decompress, headers }: RequestOptions);
    setHeaders(headers: Record<string, string | string[]>): void;
    private validateUrl;
    private precheckBody;
}
