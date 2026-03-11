import type { TestReport } from '../types';
import { type Issue } from '@sectester/scan';
export declare class JUnitReportBuilder {
    private readonly issues;
    private readonly testFilePath;
    constructor(issues: Issue[], testFilePath: string);
    build(): TestReport;
    private createTestSuite;
    private convertIssueToTestCase;
}
