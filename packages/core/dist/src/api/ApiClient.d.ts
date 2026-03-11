export interface ApiRequestInit extends RequestInit {
    handle409Redirects?: boolean;
}
export interface ApiClient {
    request(path: string, options?: ApiRequestInit): Promise<Response>;
}
export declare const ApiClient: unique symbol;
