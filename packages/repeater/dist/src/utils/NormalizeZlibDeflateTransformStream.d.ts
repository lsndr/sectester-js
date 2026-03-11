import { Transform, TransformCallback } from 'node:stream';
export declare class NormalizeZlibDeflateTransformStream extends Transform {
    private hasCheckedHead;
    private readonly header;
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
}
