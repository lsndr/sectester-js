"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeQualityReportBuilder = void 0;
const scan_1 = require("@sectester/scan");
const node_crypto_1 = require("node:crypto");
class CodeQualityReportBuilder {
    constructor(issues, testFilePath) {
        this.issues = issues;
        this.testFilePath = testFilePath;
    }
    build() {
        return this.issues.map(issue => this.convertIssueToCodeQualityIssue(issue));
    }
    convertIssueToCodeQualityIssue(issue) {
        const { originalRequest, name, severity } = issue;
        const description = `${name} vulnerability found at ${originalRequest.method.toUpperCase()} ${originalRequest.url}`;
        const fingerprint = this.createFingerprint(issue);
        const gitlabSeverity = this.mapSeverity(severity);
        return {
            description,
            fingerprint,
            check_name: name,
            severity: gitlabSeverity,
            raw_details: JSON.stringify(issue, null, 2),
            location: {
                path: this.testFilePath,
                lines: {
                    begin: 1
                }
            }
        };
    }
    createFingerprint(issue) {
        const content = `${issue.name}-${issue.entryPointId}`;
        return (0, node_crypto_1.createHash)('md5').update(content).digest('hex');
    }
    mapSeverity(severity) {
        switch (severity) {
            case scan_1.Severity.LOW:
                return 'minor';
            case scan_1.Severity.MEDIUM:
                return 'major';
            case scan_1.Severity.HIGH:
                return 'critical';
            case scan_1.Severity.CRITICAL:
                return 'blocker';
            default:
                return 'info';
        }
    }
}
exports.CodeQualityReportBuilder = CodeQualityReportBuilder;
//# sourceMappingURL=CodeQualityReportBuilder.js.map