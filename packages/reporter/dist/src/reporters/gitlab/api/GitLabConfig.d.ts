export type GitLabReportFormat = 'code-quality' | 'test' | 'both';
export interface GitLabConfig {
    codeQualityReportFilename: string;
    testReportFilename: string;
    reportFormat?: GitLabReportFormat;
}
export declare const GITLAB_CONFIG: unique symbol;
