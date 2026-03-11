import { Reporter } from '../../lib';
import type { BitbucketClient } from './api';
import type { BitbucketConfig } from './types';
import { TestFilePathResolver } from '../../utils';
import type { Scan } from '@sectester/scan';
export declare class BitbucketReporter implements Reporter {
    private readonly config;
    private readonly bitbucketClient;
    private readonly testFilePathResolver;
    constructor(config: BitbucketConfig, bitbucketClient: BitbucketClient, testFilePathResolver: TestFilePathResolver);
    report(scan: Scan): Promise<void>;
    private createReportBuilder;
}
