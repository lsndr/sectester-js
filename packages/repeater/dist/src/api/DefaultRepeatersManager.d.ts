import { RepeatersManager } from './RepeatersManager';
import { ApiClient } from '@sectester/core';
export declare class DefaultRepeatersManager implements RepeatersManager {
    private readonly client;
    constructor(client: ApiClient);
    getRepeater(repeaterId: string): Promise<{
        repeaterId: string;
    }>;
    createRepeater({ projectId, ...options }: {
        name: string;
        description?: string;
        projectId?: string;
    }): Promise<{
        repeaterId: string;
    }>;
    deleteRepeater(repeaterId: string): Promise<void>;
}
