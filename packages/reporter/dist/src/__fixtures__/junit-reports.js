"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleTestSuitesReport = exports.testReportWithoutFailures = exports.testReportWithSpecialCharacters = exports.testReportWithSystemOut = exports.minimalTestReport = exports.highBrightTestSuite = exports.criticalBrightTestSuite = exports.brightTestSuite = exports.createTestSuite = exports.createPassingTestCase = exports.createTestCaseWithSpecialChars = exports.createTestCaseWithSystemOut = exports.createVulnerabilityTestCase = void 0;
const createVulnerabilityTestCase = (method, endpoint, vulnerability, time = 0) => ({
    time,
    classname: `${method} ${endpoint}`,
    name: vulnerability,
    file: 'test.spec.ts',
    failure: `${vulnerability} vulnerability found at ${method} ${endpoint}`
});
exports.createVulnerabilityTestCase = createVulnerabilityTestCase;
const createTestCaseWithSystemOut = (baseTestCase, systemOut) => ({
    ...baseTestCase,
    systemOut
});
exports.createTestCaseWithSystemOut = createTestCaseWithSystemOut;
const createTestCaseWithSpecialChars = (failure) => ({
    failure,
    classname: 'GET https://example.com/api/search',
    name: 'XSS',
    file: 'test.spec.ts',
    time: 0
});
exports.createTestCaseWithSpecialChars = createTestCaseWithSpecialChars;
const createPassingTestCase = (classname, name, time = 0.5) => ({
    classname,
    name,
    time,
    file: 'test.spec.ts'
});
exports.createPassingTestCase = createPassingTestCase;
const createTestSuite = (name, testCases, failures) => ({
    name,
    testCases,
    tests: testCases.length,
    failures: failures !== null && failures !== void 0 ? failures : testCases.filter(tc => tc.failure).length
});
exports.createTestSuite = createTestSuite;
exports.brightTestSuite = (0, exports.createTestSuite)('Bright Tests', [
    (0, exports.createVulnerabilityTestCase)('POST', 'https://example.com/api/users', 'SQLi')
]);
exports.criticalBrightTestSuite = (0, exports.createTestSuite)('Critical Bright Tests', [(0, exports.createVulnerabilityTestCase)('POST', 'https://example.com/api/users', 'SQLi')]);
exports.highBrightTestSuite = (0, exports.createTestSuite)('High Bright Tests', [
    (0, exports.createVulnerabilityTestCase)('PUT', 'https://example.com/api/profile', 'XSS')
]);
exports.minimalTestReport = {
    testSuites: [exports.brightTestSuite]
};
exports.testReportWithSystemOut = {
    testSuites: [
        (0, exports.createTestSuite)('Bright Tests', [
            (0, exports.createTestCaseWithSystemOut)((0, exports.createVulnerabilityTestCase)('GET', 'https://example.com/api/search', 'XSS'), '{"id": "issue-1", "name": "XSS"}')
        ])
    ]
};
exports.testReportWithSpecialCharacters = {
    testSuites: [
        (0, exports.createTestSuite)('Bright Tests & More', [
            (0, exports.createTestCaseWithSpecialChars)('XSS vulnerability found at GET https://example.com/api/search?q=Bar & Co')
        ])
    ]
};
exports.testReportWithoutFailures = {
    testSuites: [
        (0, exports.createTestSuite)('Bright Tests', [(0, exports.createPassingTestCase)('GET https://example.com/api/search', 'XSS')], 0)
    ]
};
exports.multipleTestSuitesReport = {
    testSuites: [exports.criticalBrightTestSuite, exports.highBrightTestSuite]
};
//# sourceMappingURL=junit-reports.js.map