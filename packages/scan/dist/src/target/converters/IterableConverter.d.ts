import { BodyConverter } from './BodyConverter';
export declare class IterableConverter implements BodyConverter<Iterable<Uint8Array>> {
    canHandle(data: unknown): data is Iterable<Uint8Array>;
    convert(data: Iterable<Uint8Array>): Promise<string>;
    getMimeType(_: Iterable<Uint8Array>): string;
}
