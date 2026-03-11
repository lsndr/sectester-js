import { BodyConverter } from './BodyConverter';
export declare class StreamConverter implements BodyConverter<NodeJS.ReadableStream> {
    canHandle(data: unknown): data is NodeJS.ReadableStream;
    convert(data: NodeJS.ReadableStream): Promise<string>;
    getMimeType(_: NodeJS.ReadableStream): string;
}
