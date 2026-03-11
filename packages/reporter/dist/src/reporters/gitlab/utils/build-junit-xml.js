"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJUnitXML = buildJUnitXML;
const fast_xml_parser_1 = require("fast-xml-parser");
const xmlBuilder = new fast_xml_parser_1.XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    suppressEmptyNode: true,
    suppressUnpairedNode: false
});
function buildJUnitXML(report) {
    const xmlObject = {
        '?xml': {
            '@_version': '1.0',
            '@_encoding': 'UTF-8'
        },
        'testsuites': {
            testsuite: report.testSuites.map(suite => buildTestSuiteObject(suite))
        }
    };
    return xmlBuilder.build(xmlObject);
}
function buildTestSuiteObject(testsuite) {
    const suiteObject = {
        '@_name': testsuite.name,
        '@_tests': testsuite.tests.toString()
    };
    if (testsuite.failures !== undefined) {
        suiteObject['@_failures'] = testsuite.failures.toString();
    }
    if (testsuite.errors !== undefined) {
        suiteObject['@_errors'] = testsuite.errors.toString();
    }
    if (testsuite.skipped !== undefined) {
        suiteObject['@_skipped'] = testsuite.skipped.toString();
    }
    if (testsuite.time !== undefined) {
        suiteObject['@_time'] = testsuite.time.toString();
    }
    if (testsuite.testCases.length > 0) {
        suiteObject.testcase = testsuite.testCases.map(testcase => buildTestCaseObject(testcase));
    }
    return suiteObject;
}
function addBasicTestCaseProperties(caseObject, testcase) {
    if (testcase.file) {
        caseObject['@_file'] = testcase.file;
    }
    if (testcase.time !== undefined) {
        caseObject['@_time'] = testcase.time.toString();
    }
}
function addTestCaseResults(caseObject, testcase) {
    if (testcase.failure) {
        caseObject.failure = {
            '#text': testcase.failure
        };
    }
    if (testcase.error) {
        caseObject.error = {
            '#text': testcase.error
        };
    }
    if (testcase.skipped) {
        caseObject.skipped = {
            '#text': testcase.skipped
        };
    }
}
function addTestCaseOutputs(caseObject, testcase) {
    if (testcase.systemOut) {
        caseObject['system-out'] = { '#text': testcase.systemOut };
    }
    if (testcase.systemErr) {
        caseObject['system-err'] = { '#text': testcase.systemErr };
    }
}
function buildTestCaseObject(testcase) {
    const caseObject = {
        '@_classname': testcase.classname,
        '@_name': testcase.name
    };
    addBasicTestCaseProperties(caseObject, testcase);
    addTestCaseResults(caseObject, testcase);
    addTestCaseOutputs(caseObject, testcase);
    return caseObject;
}
//# sourceMappingURL=build-junit-xml.js.map