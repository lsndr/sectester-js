import type { Report, ReportAnnotation, BitbucketConfig } from '../types';
import type { BitbucketClient } from './BitbucketClient';
export declare class BitbucketApiClient implements BitbucketClient {
    private readonly config;
    private readonly proxyAgent;
    constructor(config: BitbucketConfig);
    createOrUpdateReport(reportId: string, report: Report): Promise<void>;
    createAnnotations(reportId: string, annotations: ReportAnnotation[]): Promise<void>;
    private buildUrl;
    private getHeaders;
    private chunkArray;
}
