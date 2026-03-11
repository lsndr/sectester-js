"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const GitLabCodeQualityFileWriter_1 = require("./GitLabCodeQualityFileWriter");
const GitLabCIArtifacts_1 = require("./GitLabCIArtifacts");
const GitLabConfig_1 = require("./GitLabConfig");
const tsyringe_1 = require("tsyringe");
tsyringe_1.container.register(GitLabConfig_1.GITLAB_CONFIG, {
    useValue: {
        codeQualityReportFilename: process.env.GITLAB_CODE_QUALITY_REPORT_FILENAME ||
            'gl-code-quality-report.json',
        testReportFilename: process.env.GITLAB_TEST_REPORT_FILENAME || 'gl-test-report.xml',
        reportFormat: process.env.GITLAB_REPORT_FORMAT || 'both'
    }
});
tsyringe_1.container.register(GitLabCIArtifacts_1.GITLAB_CI_ARTIFACTS, {
    useClass: GitLabCodeQualityFileWriter_1.GitLabCIArtifactsFileWriter
});
//# sourceMappingURL=register.js.map