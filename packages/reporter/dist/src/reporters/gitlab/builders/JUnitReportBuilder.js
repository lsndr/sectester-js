"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JUnitReportBuilder = void 0;
class JUnitReportBuilder {
    constructor(issues, testFilePath) {
        this.issues = issues;
        this.testFilePath = testFilePath;
    }
    build() {
        const testSuite = this.createTestSuite();
        return {
            testSuites: [testSuite]
        };
    }
    createTestSuite() {
        const testCases = this.issues.map(issue => this.convertIssueToTestCase(issue));
        const failures = testCases.filter(tc => tc.failure).length;
        return {
            testCases,
            failures,
            name: 'Bright Tests',
            tests: testCases.length,
            time: 0 // We don't have execution time
        };
    }
    convertIssueToTestCase(issue) {
        const { originalRequest, name } = issue;
        const failure = `${name} vulnerability found at ${originalRequest.method.toUpperCase()} ${originalRequest.url}`;
        const baseUrl = new URL(originalRequest.url);
        baseUrl.hash = '';
        baseUrl.search = '';
        return {
            failure,
            name,
            classname: `${originalRequest.method.toUpperCase()} ${baseUrl.toString()}`,
            file: this.testFilePath,
            time: 0,
            systemOut: JSON.stringify(issue)
        };
    }
}
exports.JUnitReportBuilder = JUnitReportBuilder;
//# sourceMappingURL=JUnitReportBuilder.js.map