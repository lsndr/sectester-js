import { BodyConverter } from './BodyConverter';
export declare class ConverterRegistry {
    private readonly converters;
    constructor(converters: BodyConverter<unknown>[]);
    getConverter(data: unknown, mimeType?: string): BodyConverter<unknown> | undefined;
}
