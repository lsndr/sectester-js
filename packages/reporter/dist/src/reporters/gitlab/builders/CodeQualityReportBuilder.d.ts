import type { CodeQualityReport } from '../types';
import { Issue } from '@sectester/scan';
export declare class CodeQualityReportBuilder {
    private readonly issues;
    private readonly testFilePath;
    constructor(issues: Issue[], testFilePath: string);
    build(): CodeQualityReport;
    private convertIssueToCodeQualityIssue;
    private createFingerprint;
    private mapSeverity;
}
