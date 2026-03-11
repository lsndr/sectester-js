import { Target } from './target';
export interface Discoveries {
    createEntrypoint(target: Target, repeaterId?: string): Promise<{
        id: string;
    }>;
}
export declare const Discoveries: unique symbol;
