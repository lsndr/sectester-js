"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiItemsPayloadBuilder = void 0;
const BasePayloadBuilder_1 = require("./BasePayloadBuilder");
const scan_1 = require("@sectester/scan");
class MultiItemsPayloadBuilder extends BasePayloadBuilder_1.BasePayloadBuilder {
    constructor(issues, commitSha, testFilePath) {
        super(commitSha, testFilePath);
        this.issues = issues;
    }
    build() {
        return {
            name: `SecTester (${this.issues.length} issues)`,
            head_sha: this.commitSha,
            conclusion: 'failure',
            output: {
                title: `${this.issues.length} vulnerabilities detected in application endpoints`,
                summary: this.buildSummary(),
                text: this.buildDetails(),
                annotations: this.issues.map(issue => this.convertIssueToAnnotation(issue))
            }
        };
    }
    buildSummary() {
        const severityCounts = this.issues.reduce((counts, issue) => {
            counts[issue.severity] = (counts[issue.severity] || 0) + 1;
            return counts;
        }, {});
        const parts = [];
        if (severityCounts[scan_1.Severity.CRITICAL]) {
            parts.push(`${severityCounts[scan_1.Severity.CRITICAL]} Critical`);
        }
        if (severityCounts[scan_1.Severity.HIGH]) {
            parts.push(`${severityCounts[scan_1.Severity.HIGH]} High`);
        }
        if (severityCounts[scan_1.Severity.MEDIUM]) {
            parts.push(`${severityCounts[scan_1.Severity.MEDIUM]} Medium`);
        }
        if (severityCounts[scan_1.Severity.LOW]) {
            parts.push(`${severityCounts[scan_1.Severity.LOW]} Low`);
        }
        return parts.length > 0
            ? `${parts.join(', ')} severity issues found`
            : 'No issues found';
    }
    buildDetails() {
        return this.issues
            .map(issue => {
            var _a, _b;
            const method = (_b = (_a = issue.originalRequest.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET';
            const pathname = new URL(issue.originalRequest.url).pathname;
            return `- ${method} ${pathname}: ${issue.name}`;
        })
            .join('\n');
    }
}
exports.MultiItemsPayloadBuilder = MultiItemsPayloadBuilder;
//# sourceMappingURL=MultiItemsPayloadBuilder.js.map