"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleItemPayloadBuilder = void 0;
const BasePayloadBuilder_1 = require("./BasePayloadBuilder");
class SingleItemPayloadBuilder extends BasePayloadBuilder_1.BasePayloadBuilder {
    constructor(issue, commitSha, testFilePath) {
        super(commitSha, testFilePath);
        this.issue = issue;
    }
    build() {
        return {
            name: `SecTester - ${this.buildEndpoint()}`,
            head_sha: this.commitSha,
            conclusion: 'failure',
            output: {
                title: this.buildTitle(),
                summary: this.buildSummary(),
                text: this.buildDetails(),
                annotations: [this.convertIssueToAnnotation(this.issue)]
            }
        };
    }
    buildEndpoint() {
        return `${this.issue.originalRequest.method} ${new URL(this.issue.originalRequest.url).pathname}`;
    }
    buildTitle() {
        return `${this.issue.name} found at ${this.buildEndpoint()}`;
    }
    buildSummary() {
        return [
            `Name: ${this.issue.name}`,
            `Severity: ${this.issue.severity}`,
            `Bright UI link: ${this.issue.link}`,
            `\nRemediation:\n${this.issue.remedy}`
        ].join('\n');
    }
    buildDetails() {
        var _a, _b;
        const extraDetails = ((_a = this.issue.comments) === null || _a === void 0 ? void 0 : _a.length)
            ? this.formatList(this.issue.comments.map(x => this.formatIssueComment(x)))
            : '';
        const references = ((_b = this.issue.resources) === null || _b === void 0 ? void 0 : _b.length)
            ? this.formatList(this.issue.resources)
            : '';
        return [
            `${this.issue.details}`,
            ...(extraDetails ? [`\nExtra Details:\n${extraDetails}`] : []),
            ...(references ? [`\nReferences:\n${references}`] : [])
        ].join('\n');
    }
    formatList(items) {
        return items.map(x => `- ${x}`).join('\n');
    }
    formatIssueComment({ headline, text = '', links = [] }) {
        const body = [
            text,
            ...(links.length ? [`Links:\n${this.formatList(links)}`] : [])
        ].join('\n');
        const indentedBody = body
            .split('\n')
            .map(x => `\t${x}`)
            .join('\n');
        return [headline, indentedBody].join('\n');
    }
}
exports.SingleItemPayloadBuilder = SingleItemPayloadBuilder;
//# sourceMappingURL=SingleItemPayloadBuilder.js.map