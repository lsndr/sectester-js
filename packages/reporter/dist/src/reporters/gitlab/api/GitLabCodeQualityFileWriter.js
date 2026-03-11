"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitLabCIArtifactsFileWriter = void 0;
const tslib_1 = require("tslib");
const GitLabConfig_1 = require("./GitLabConfig");
const utils_1 = require("../utils");
const tsyringe_1 = require("tsyringe");
const promises_1 = require("node:fs/promises");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
let GitLabCIArtifactsFileWriter = class GitLabCIArtifactsFileWriter {
    constructor(config) {
        this.config = config;
    }
    async writeCodeQualityReport(report) {
        // This method writes GitLab Code Quality reports to a file.
        // To display these reports in GitLab merge requests, you need to configure your .gitlab-ci.yml:
        //   artifacts:
        //     reports:
        //       codequality: gl-code-quality-report.json
        const reportJson = JSON.stringify(report, null, 2);
        const filename = this.config.codeQualityReportFilename;
        await (0, promises_1.writeFile)(filename, reportJson, 'utf-8');
    }
    async writeTestReport(report) {
        const fileName = this.generateUniqueFileName();
        // This method writes GitLab Test reports in JUnit XML format to a file.
        // To display these reports in GitLab merge requests, you need to configure your .gitlab-ci.yml:
        //   artifacts:
        //     reports:
        //       junit: gl-test-report-*.xml
        // Note: Filenames are automatically made unique for concurrent test runs
        const reportXml = (0, utils_1.buildJUnitXML)(report);
        await (0, promises_1.writeFile)(fileName, reportXml, 'utf-8');
    }
    generateUniqueFileName() {
        const ext = (0, node_path_1.extname)(this.config.testReportFilename);
        const baseName = (0, node_path_1.basename)(this.config.testReportFilename, ext);
        const fileName = `${baseName}-${(0, node_crypto_1.randomUUID)()}.${ext}`;
        return fileName;
    }
};
exports.GitLabCIArtifactsFileWriter = GitLabCIArtifactsFileWriter;
exports.GitLabCIArtifactsFileWriter = GitLabCIArtifactsFileWriter = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(GitLabConfig_1.GITLAB_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GitLabCIArtifactsFileWriter);
//# sourceMappingURL=GitLabCodeQualityFileWriter.js.map