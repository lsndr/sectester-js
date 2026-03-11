import { ReportBuilder, ReportBuildResult } from './ReportBuilder';
import type { ReportAnnotation, AnnotationSeverity } from '../types';
import type { Issue } from '@sectester/scan';
import { Severity } from '@sectester/scan';
export declare abstract class BaseReportBuilder implements ReportBuilder {
    protected readonly commitSha: string | undefined;
    protected readonly testFilePath: string;
    protected readonly reportId: string;
    constructor(commitSha: string | undefined, testFilePath: string);
    abstract build(): ReportBuildResult;
    getReportId(): string;
    protected convertIssueToAnnotation(issue: Issue, index: number): ReportAnnotation;
    protected mapSeverity(severity: Severity): AnnotationSeverity;
}
