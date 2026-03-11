"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubCheckRunReporter = void 0;
const tslib_1 = require("tslib");
const api_1 = require("./api");
const builders_1 = require("./builders");
const utils_1 = require("../../utils");
const tsyringe_1 = require("tsyringe");
// TODO add `GitHubCheckRunReporter` description to README
let GitHubCheckRunReporter = class GitHubCheckRunReporter {
    constructor(config, githubClient, testFilePathResolver) {
        this.config = config;
        this.githubClient = githubClient;
        this.testFilePathResolver = testFilePathResolver;
        if (!this.config.token) {
            throw new Error('GitHub token is not set');
        }
        if (!this.config.repository) {
            throw new Error('GitHub repository is not set');
        }
        if (!this.config.commitSha) {
            throw new Error('GitHub commitSha is not set');
        }
    }
    async report(scan) {
        const issues = await scan.issues();
        if (issues.length === 0)
            return;
        const checkRunPayload = this.createCheckRunPayloadBuilder(issues).build();
        await this.githubClient.createCheckRun(checkRunPayload);
    }
    createCheckRunPayloadBuilder(issues) {
        const testFilePath = this.testFilePathResolver.getTestFilePath();
        return issues.length === 1
            ? new builders_1.SingleItemPayloadBuilder(issues[0], this.config.commitSha, testFilePath)
            : new builders_1.MultiItemsPayloadBuilder(issues, this.config.commitSha, testFilePath);
    }
};
exports.GitHubCheckRunReporter = GitHubCheckRunReporter;
exports.GitHubCheckRunReporter = GitHubCheckRunReporter = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(api_1.GITHUB_CONFIG)),
    tslib_1.__param(1, (0, tsyringe_1.inject)(api_1.GITHUB_CLIENT)),
    tslib_1.__param(2, (0, tsyringe_1.inject)(utils_1.TEST_FILE_PATH_RESOLVER)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], GitHubCheckRunReporter);
//# sourceMappingURL=GitHubCheckRunReporter.js.map