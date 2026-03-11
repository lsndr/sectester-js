import { Protocol } from '../models';
export declare class Response {
    readonly protocol: Protocol;
    readonly statusCode?: number;
    readonly headers?: Record<string, string | string[]>;
    readonly body?: string;
    readonly encoding?: 'base64';
    readonly message?: string;
    readonly errorCode?: string;
    constructor({ protocol, statusCode, headers, body, message, errorCode, encoding }: {
        protocol: Protocol;
        statusCode?: number;
        message?: string;
        errorCode?: string;
        headers?: Record<string, string | string[]>;
        body?: string;
        encoding?: 'base64';
    });
}
