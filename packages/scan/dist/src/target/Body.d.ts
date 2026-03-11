export type BodyType = ArrayBuffer | AsyncIterable<Uint8Array> | Blob | FormData | NodeJS.ReadableStream | Iterable<Uint8Array> | NodeJS.ArrayBufferView | URLSearchParams | unknown | null;
export declare class Body {
    private readonly data;
    private readonly mimeType?;
    private static readonly converterRegistry;
    constructor(data: BodyType, mimeType?: string | undefined);
    text(): Promise<string | undefined>;
    type(): string;
}
