export interface RepeatersManager {
    getRepeater(repeaterId: string): Promise<{
        repeaterId: string;
    }>;
    createRepeater(options: {
        name: string;
        projectId?: string;
        description?: string;
    }): Promise<{
        repeaterId: string;
    }>;
    deleteRepeater(repeaterId: string): Promise<void>;
}
export declare const RepeatersManager: unique symbol;
