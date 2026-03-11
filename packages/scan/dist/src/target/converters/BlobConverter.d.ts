import { BodyConverter } from './BodyConverter';
export declare class BlobConverter implements BodyConverter<Blob> {
    canHandle(data: unknown): data is Blob;
    convert(data: Blob): Promise<string>;
    getMimeType(data: Blob): string;
}
