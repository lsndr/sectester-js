import { BodyConverter } from './BodyConverter';
export declare class URLSearchParamsConverter implements BodyConverter<URLSearchParams> {
    canHandle(data: unknown): data is URLSearchParams;
    convert(data: URLSearchParams): Promise<string>;
    getMimeType(_data: URLSearchParams): string;
}
