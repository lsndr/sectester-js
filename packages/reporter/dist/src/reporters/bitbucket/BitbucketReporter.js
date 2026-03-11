"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketReporter = void 0;
const tslib_1 = require("tslib");
const api_1 = require("./api");
const builders_1 = require("./builders");
const utils_1 = require("../../utils");
const tsyringe_1 = require("tsyringe");
let BitbucketReporter = class BitbucketReporter {
    constructor(config, bitbucketClient, testFilePathResolver) {
        this.config = config;
        this.bitbucketClient = bitbucketClient;
        this.testFilePathResolver = testFilePathResolver;
        // Token is only required when NOT using the Pipelines proxy
        // The proxy automatically handles authentication
        if (!this.config.usePipelinesProxy && !this.config.token) {
            throw new Error('Bitbucket token is not set');
        }
        if (!this.config.workspace) {
            throw new Error('Bitbucket workspace is not set');
        }
        if (!this.config.repoSlug) {
            throw new Error('Bitbucket repoSlug is not set');
        }
        if (!this.config.commitSha) {
            throw new Error('Bitbucket commitSha is not set');
        }
    }
    async report(scan) {
        const issues = await scan.issues();
        if (issues.length === 0)
            return;
        const builder = this.createReportBuilder(issues);
        const { report, annotations } = builder.build();
        const reportId = builder.getReportId();
        await this.bitbucketClient.createOrUpdateReport(reportId, report);
        await this.bitbucketClient.createAnnotations(reportId, annotations);
    }
    createReportBuilder(issues) {
        const testFilePath = this.testFilePathResolver.getTestFilePath();
        return issues.length === 1
            ? new builders_1.SingleItemReportBuilder(issues[0], this.config.commitSha, testFilePath)
            : new builders_1.MultiItemsReportBuilder(issues, this.config.commitSha, testFilePath);
    }
};
exports.BitbucketReporter = BitbucketReporter;
exports.BitbucketReporter = BitbucketReporter = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(api_1.BITBUCKET_CONFIG)),
    tslib_1.__param(1, (0, tsyringe_1.inject)(api_1.BITBUCKET_CLIENT)),
    tslib_1.__param(2, (0, tsyringe_1.inject)(utils_1.TEST_FILE_PATH_RESOLVER)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], BitbucketReporter);
//# sourceMappingURL=BitbucketReporter.js.map