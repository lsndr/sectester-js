import type { Report, ReportAnnotation } from '../types';
export interface BitbucketClient {
    createOrUpdateReport(reportId: string, report: Report): Promise<void>;
    createAnnotations(reportId: string, annotations: ReportAnnotation[]): Promise<void>;
}
export declare const BITBUCKET_CLIENT: unique symbol;
