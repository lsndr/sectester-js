import { Reporter } from '../../lib';
import type { GitLabCIArtifacts, GitLabConfig } from './api';
import { TestFilePathResolver } from '../../utils';
import type { Scan } from '@sectester/scan';
export declare class GitLabReporter implements Reporter {
    private readonly gitlabCIArtifacts;
    private readonly config;
    private readonly testFilePathResolver;
    constructor(gitlabCIArtifacts: GitLabCIArtifacts, config: GitLabConfig, testFilePathResolver: TestFilePathResolver);
    report(scan: Scan): Promise<void>;
    private generateCodeQualityReport;
    private generateTestReport;
    private createCodeQualityReportBuilder;
    private createJUnitReportBuilder;
}
