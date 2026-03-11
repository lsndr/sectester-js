import { BodyConverter } from './BodyConverter';
export declare class AsyncIterableConverter implements BodyConverter<AsyncIterable<Uint8Array>> {
    canHandle(data: unknown): data is AsyncIterable<Uint8Array>;
    convert(data: AsyncIterable<Uint8Array>): Promise<string>;
    getMimeType(): string;
}
