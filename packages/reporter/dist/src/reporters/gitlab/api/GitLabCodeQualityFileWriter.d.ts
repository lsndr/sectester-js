import type { CodeQualityReport, TestReport } from '../types';
import type { GitLabCIArtifacts } from './GitLabCIArtifacts';
import type { GitLabConfig } from './GitLabConfig';
export declare class GitLabCIArtifactsFileWriter implements GitLabCIArtifacts {
    private readonly config;
    constructor(config: GitLabConfig);
    writeCodeQualityReport(report: CodeQualityReport): Promise<void>;
    writeTestReport(report: TestReport): Promise<void>;
    private generateUniqueFileName;
}
