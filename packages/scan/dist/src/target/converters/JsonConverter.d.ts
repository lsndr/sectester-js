import { BodyConverter } from './BodyConverter';
export declare class JsonConverter implements BodyConverter<unknown> {
    canHandle(data: unknown, mimeType?: string): data is unknown;
    convert(data: unknown): Promise<string>;
    getMimeType(_data: unknown): string;
}
