export declare class FunctionScanTarget {
    private readonly server;
    start<T>(fn: (input: T) => Promise<unknown>): Promise<{
        url: string;
    }>;
    stop(): Promise<void>;
    private handleRequest;
}
