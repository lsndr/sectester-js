import type { CheckRunPayload } from '../types';
export interface GitHubClient {
    createCheckRun(payload: CheckRunPayload): Promise<void>;
}
export declare const GITHUB_CLIENT: unique symbol;
