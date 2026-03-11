import { HttpMethod } from '../models';
import { BodyType } from './Body';
import { QueryParamsType } from './QueryParamsType';
type HeadersInit = NonNullable<ConstructorParameters<typeof Headers>[0]>;
export interface TargetOptions {
    url: string;
    query?: QueryParamsType;
    body?: BodyType;
    method?: HttpMethod | string;
    headers?: HeadersInit;
    auth?: string;
    serializeQuery?(params: QueryParamsType): string;
}
export declare class Target implements TargetOptions {
    private _parsedURL;
    get parsedURL(): URL;
    private _cachedUrl?;
    get url(): string;
    private set url(value);
    private _method;
    get method(): HttpMethod;
    private set method(value);
    private _queryString?;
    private _query?;
    get queryString(): string;
    get query(): QueryParamsType;
    private set query(value);
    get fragment(): string;
    private _parsedHeaders;
    private _headers?;
    get headers(): HeadersInit;
    private set headers(value);
    private _body?;
    private _parsedBody?;
    get body(): BodyType | undefined;
    private set body(value);
    private readonly _serializeQuery;
    get serializeQuery(): (params: QueryParamsType) => string;
    private authId?;
    get auth(): string | undefined;
    private set auth(value);
    constructor({ url, body, query, auth, headers, serializeQuery, method }: TargetOptions);
    text(): Promise<string | undefined>;
    private readonly defaultSerializeQuery;
}
export {};
