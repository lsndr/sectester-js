"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleItemReportBuilder = void 0;
const BaseReportBuilder_1 = require("./BaseReportBuilder");
class SingleItemReportBuilder extends BaseReportBuilder_1.BaseReportBuilder {
    constructor(issue, commitSha, testFilePath) {
        super(commitSha, testFilePath);
        this.issue = issue;
    }
    build() {
        const report = this.buildReport();
        const annotations = [this.convertIssueToAnnotation(this.issue, 0)];
        return { report, annotations };
    }
    buildReport() {
        return {
            title: `SecTester - ${this.buildEndpoint()}`,
            details: this.buildDetails(),
            reporter: 'SecTester',
            report_type: 'SECURITY',
            result: 'FAILED',
            link: this.issue.link,
            data: [
                {
                    title: 'Vulnerability',
                    type: 'TEXT',
                    value: this.issue.name
                },
                {
                    title: 'Severity',
                    type: 'TEXT',
                    value: this.issue.severity
                },
                {
                    title: 'View in Bright',
                    type: 'LINK',
                    value: {
                        text: 'Open in Bright UI',
                        href: this.issue.link
                    }
                }
            ]
        };
    }
    buildEndpoint() {
        var _a, _b;
        const method = (_b = (_a = this.issue.originalRequest.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET';
        const pathname = new URL(this.issue.originalRequest.url).pathname;
        return `${method} ${pathname}`;
    }
    buildDetails() {
        var _a, _b;
        const parts = [
            `**${this.issue.name}** found at ${this.buildEndpoint()}`,
            '',
            `**Severity:** ${this.issue.severity}`,
            '',
            '**Remediation:**',
            this.issue.remedy,
            '',
            '**Details:**',
            this.issue.details
        ];
        if ((_a = this.issue.comments) === null || _a === void 0 ? void 0 : _a.length) {
            parts.push('', '**Extra Details:**');
            for (const comment of this.issue.comments) {
                parts.push(this.formatIssueComment(comment));
            }
        }
        if ((_b = this.issue.resources) === null || _b === void 0 ? void 0 : _b.length) {
            parts.push('', '**References:**');
            for (const resource of this.issue.resources) {
                parts.push(`- ${resource}`);
            }
        }
        return parts.join('\n');
    }
    formatIssueComment({ headline, text = '', links = [] }) {
        const parts = [`- **${headline}**`];
        if (text) {
            parts.push(`  ${text}`);
        }
        if (links.length > 0) {
            parts.push('  Links:');
            for (const link of links) {
                parts.push(`  - ${link}`);
            }
        }
        return parts.join('\n');
    }
}
exports.SingleItemReportBuilder = SingleItemReportBuilder;
//# sourceMappingURL=SingleItemReportBuilder.js.map