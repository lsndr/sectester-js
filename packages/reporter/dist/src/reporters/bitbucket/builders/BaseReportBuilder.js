"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseReportBuilder = void 0;
const scan_1 = require("@sectester/scan");
class BaseReportBuilder {
    constructor(commitSha, testFilePath) {
        this.commitSha = commitSha;
        this.testFilePath = testFilePath;
        if (!commitSha) {
            throw new Error('Commit SHA is required');
        }
        this.reportId = `sectester-${Date.now()}`;
    }
    getReportId() {
        return this.reportId;
    }
    convertIssueToAnnotation(issue, index) {
        var _a, _b, _c;
        const { originalRequest, name, severity, link, details } = issue;
        const method = (_b = (_a = originalRequest.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET';
        const url = originalRequest.url;
        return {
            external_id: `sectester-${(_c = issue.id) !== null && _c !== void 0 ? _c : index}`,
            title: name,
            annotation_type: 'VULNERABILITY',
            summary: `${name} vulnerability found at ${method} ${url}`,
            details,
            result: 'FAILED',
            severity: this.mapSeverity(severity),
            path: this.testFilePath,
            line: 1,
            link
        };
    }
    mapSeverity(severity) {
        switch (severity) {
            case scan_1.Severity.CRITICAL:
                return 'CRITICAL';
            case scan_1.Severity.HIGH:
                return 'HIGH';
            case scan_1.Severity.MEDIUM:
                return 'MEDIUM';
            case scan_1.Severity.LOW:
                return 'LOW';
            default:
                return 'MEDIUM';
        }
    }
}
exports.BaseReportBuilder = BaseReportBuilder;
//# sourceMappingURL=BaseReportBuilder.js.map