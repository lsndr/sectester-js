import type { CheckRunPayload, GitHubConfig } from '../types';
import type { GitHubClient } from './GitHubClient';
export declare class GitHubApiClient implements GitHubClient {
    private readonly config;
    constructor(config: GitHubConfig);
    createCheckRun(payload: CheckRunPayload): Promise<void>;
}
