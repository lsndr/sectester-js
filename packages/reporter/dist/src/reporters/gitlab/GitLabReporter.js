"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabReporter = void 0;
const tslib_1 = require("tslib");
const api_1 = require("./api");
const builders_1 = require("./builders");
const utils_1 = require("../../utils");
const tsyringe_1 = require("tsyringe");
let GitLabReporter = class GitLabReporter {
    constructor(gitlabCIArtifacts, config, testFilePathResolver) {
        this.gitlabCIArtifacts = gitlabCIArtifacts;
        this.config = config;
        this.testFilePathResolver = testFilePathResolver;
    }
    async report(scan) {
        var _a;
        const issues = await scan.issues();
        if (issues.length > 0) {
            const reportFormat = (_a = this.config.reportFormat) !== null && _a !== void 0 ? _a : 'test';
            switch (reportFormat) {
                case 'code-quality':
                    await this.generateCodeQualityReport(issues);
                    break;
                case 'test':
                    await this.generateTestReport(issues);
                    break;
                case 'both':
                default:
                    await Promise.all([
                        this.generateCodeQualityReport(issues),
                        this.generateTestReport(issues)
                    ]);
                    break;
            }
        }
    }
    async generateCodeQualityReport(issues) {
        const testFilePath = this.testFilePathResolver.getTestFilePath();
        const codeQualityReport = this.createCodeQualityReportBuilder(issues, testFilePath).build();
        await this.gitlabCIArtifacts.writeCodeQualityReport(codeQualityReport);
    }
    async generateTestReport(issues) {
        const testFilePath = this.testFilePathResolver.getTestFilePath();
        const testReport = this.createJUnitReportBuilder(issues, testFilePath).build();
        await this.gitlabCIArtifacts.writeTestReport(testReport);
    }
    createCodeQualityReportBuilder(issues, testFilePath) {
        return new builders_1.CodeQualityReportBuilder(issues, testFilePath);
    }
    createJUnitReportBuilder(issues, testFilePath) {
        return new builders_1.JUnitReportBuilder(issues, testFilePath);
    }
};
exports.GitLabReporter = GitLabReporter;
exports.GitLabReporter = GitLabReporter = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(api_1.GITLAB_CI_ARTIFACTS)),
    tslib_1.__param(1, (0, tsyringe_1.inject)(api_1.GITLAB_CONFIG)),
    tslib_1.__param(2, (0, tsyringe_1.inject)(utils_1.TEST_FILE_PATH_RESOLVER)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], GitLabReporter);
//# sourceMappingURL=GitLabReporter.js.map