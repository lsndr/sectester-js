"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePayloadBuilder = void 0;
class BasePayloadBuilder {
    constructor(commitSha, testFilePath) {
        this.testFilePath = testFilePath;
        if (!commitSha) {
            throw new Error('Commit SHA is required');
        }
        this.commitSha = commitSha;
    }
    convertIssueToAnnotation(issue) {
        const { originalRequest, name } = issue;
        const title = `${name} vulnerability found at ${originalRequest.method.toUpperCase()} ${originalRequest.url}`;
        return {
            path: this.testFilePath,
            start_line: 1,
            end_line: 1,
            annotation_level: 'failure',
            message: title,
            raw_details: JSON.stringify(issue, null, 2)
        };
    }
}
exports.BasePayloadBuilder = BasePayloadBuilder;
//# sourceMappingURL=BasePayloadBuilder.js.map