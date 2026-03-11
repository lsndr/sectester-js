import { Reporter } from '../../lib';
import type { GitHubClient } from './api';
import type { GitHubConfig } from './types';
import { TestFilePathResolver } from '../../utils';
import type { Scan } from '@sectester/scan';
export declare class GitHubCheckRunReporter implements Reporter {
    private readonly config;
    private readonly githubClient;
    private readonly testFilePathResolver;
    constructor(config: GitHubConfig, githubClient: GitHubClient, testFilePathResolver: TestFilePathResolver);
    report(scan: Scan): Promise<void>;
    private createCheckRunPayloadBuilder;
}
