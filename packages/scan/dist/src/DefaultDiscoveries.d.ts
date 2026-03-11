import { Target } from './target';
import { Discoveries } from './Discoveries';
import { ApiClient, Configuration } from '@sectester/core';
export declare class DefaultDiscoveries implements Discoveries {
    private readonly configuration;
    private readonly client;
    private static readonly REQUEST_TIMEOUT;
    constructor(configuration: Configuration, client: ApiClient);
    createEntrypoint(target: Target, repeaterId: string): Promise<{
        id: string;
    }>;
    private isConflictError;
    private handleConflictError;
}
