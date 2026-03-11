import { BaseReportBuilder } from './BaseReportBuilder';
import { ReportBuildResult } from './ReportBuilder';
import type { Issue } from '@sectester/scan';
export declare class SingleItemReportBuilder extends BaseReportBuilder {
    private readonly issue;
    constructor(issue: Issue, commitSha: string | undefined, testFilePath: string);
    build(): ReportBuildResult;
    private buildReport;
    private buildEndpoint;
    private buildDetails;
    private formatIssueComment;
}
