import { BodyConverter } from './BodyConverter';
export declare class FormDataConverter implements BodyConverter<FormData> {
    canHandle(data: unknown): data is FormData;
    convert(data: FormData): Promise<string>;
    getMimeType(_data: FormData): string;
    private convertBlob;
}
