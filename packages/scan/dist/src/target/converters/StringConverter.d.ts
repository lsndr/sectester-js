import { BodyConverter } from './BodyConverter';
export declare class StringConverter implements BodyConverter<string> {
    canHandle(data: unknown): data is string;
    convert(data: string): Promise<string>;
    getMimeType(data: string): string;
}
