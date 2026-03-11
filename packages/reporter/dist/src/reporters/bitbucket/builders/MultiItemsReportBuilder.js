"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiItemsReportBuilder = void 0;
const BaseReportBuilder_1 = require("./BaseReportBuilder");
const scan_1 = require("@sectester/scan");
class MultiItemsReportBuilder extends BaseReportBuilder_1.BaseReportBuilder {
    constructor(issues, commitSha, testFilePath) {
        super(commitSha, testFilePath);
        this.issues = issues;
    }
    build() {
        const report = this.buildReport();
        const annotations = this.issues.map((issue, index) => this.convertIssueToAnnotation(issue, index));
        return { report, annotations };
    }
    buildReport() {
        const severityCounts = this.countSeverities();
        return {
            title: `SecTester (${this.issues.length} issues)`,
            details: this.buildDetails(),
            reporter: 'SecTester',
            report_type: 'SECURITY',
            result: 'FAILED',
            data: [
                {
                    title: 'Total Issues',
                    type: 'NUMBER',
                    value: this.issues.length
                },
                ...(severityCounts[scan_1.Severity.CRITICAL] > 0
                    ? [
                        {
                            title: 'Critical',
                            type: 'NUMBER',
                            value: severityCounts[scan_1.Severity.CRITICAL]
                        }
                    ]
                    : []),
                ...(severityCounts[scan_1.Severity.HIGH] > 0
                    ? [
                        {
                            title: 'High',
                            type: 'NUMBER',
                            value: severityCounts[scan_1.Severity.HIGH]
                        }
                    ]
                    : []),
                ...(severityCounts[scan_1.Severity.MEDIUM] > 0
                    ? [
                        {
                            title: 'Medium',
                            type: 'NUMBER',
                            value: severityCounts[scan_1.Severity.MEDIUM]
                        }
                    ]
                    : []),
                ...(severityCounts[scan_1.Severity.LOW] > 0
                    ? [
                        {
                            title: 'Low',
                            type: 'NUMBER',
                            value: severityCounts[scan_1.Severity.LOW]
                        }
                    ]
                    : [])
            ]
        };
    }
    countSeverities() {
        return this.issues.reduce((counts, issue) => {
            counts[issue.severity] = (counts[issue.severity] || 0) + 1;
            return counts;
        }, {});
    }
    buildDetails() {
        const severityCounts = this.countSeverities();
        const summaryParts = [];
        if (severityCounts[scan_1.Severity.CRITICAL]) {
            summaryParts.push(`${severityCounts[scan_1.Severity.CRITICAL]} Critical`);
        }
        if (severityCounts[scan_1.Severity.HIGH]) {
            summaryParts.push(`${severityCounts[scan_1.Severity.HIGH]} High`);
        }
        if (severityCounts[scan_1.Severity.MEDIUM]) {
            summaryParts.push(`${severityCounts[scan_1.Severity.MEDIUM]} Medium`);
        }
        if (severityCounts[scan_1.Severity.LOW]) {
            summaryParts.push(`${severityCounts[scan_1.Severity.LOW]} Low`);
        }
        const summary = summaryParts.length > 0
            ? `**${summaryParts.join(', ')}** severity issues found`
            : 'No issues found';
        const issuesList = this.issues
            .map(issue => {
            var _a, _b;
            const method = (_b = (_a = issue.originalRequest.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET';
            const pathname = new URL(issue.originalRequest.url).pathname;
            return `- **${issue.severity}**: ${issue.name} at ${method} ${pathname}`;
        })
            .join('\n');
        return `${summary}\n\n**Vulnerabilities detected:**\n${issuesList}`;
    }
}
exports.MultiItemsReportBuilder = MultiItemsReportBuilder;
//# sourceMappingURL=MultiItemsReportBuilder.js.map