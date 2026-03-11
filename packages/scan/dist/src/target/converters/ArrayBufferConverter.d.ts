import { BodyConverter } from './BodyConverter';
export declare class ArrayBufferConverter implements BodyConverter<ArrayBuffer | NodeJS.ArrayBufferView> {
    canHandle(data: unknown): data is ArrayBuffer | NodeJS.ArrayBufferView;
    convert(data: ArrayBuffer | NodeJS.ArrayBufferView): Promise<string>;
    getMimeType(_data: ArrayBuffer | NodeJS.ArrayBufferView): string;
}
