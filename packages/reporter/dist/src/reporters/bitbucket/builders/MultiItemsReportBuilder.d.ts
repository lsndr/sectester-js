import { BaseReportBuilder } from './BaseReportBuilder';
import { ReportBuildResult } from './ReportBuilder';
import type { Issue } from '@sectester/scan';
export declare class MultiItemsReportBuilder extends BaseReportBuilder {
    private readonly issues;
    constructor(issues: Issue[], commitSha: string | undefined, testFilePath: string);
    build(): ReportBuildResult;
    private buildReport;
    private countSeverities;
    private buildDetails;
}
