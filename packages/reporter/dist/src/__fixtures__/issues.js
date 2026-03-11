"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueWithoutExtraInfo = exports.issueWithoutExtraInfoText = exports.fullyDescribedIssue = exports.fullyDescribedIssueText = exports.issueWithoutResources = exports.issueWithoutResourcesText = void 0;
const scan_1 = require("@sectester/scan");
const crypto_1 = require("crypto");
exports.issueWithoutResourcesText = `Issue in Bright UI:   http://app.brightsec.com/scans/pDzxcEXQC8df1fcz1QwPf9/issues/pDzxcEXQC8df1fcz1QwPf9
Name:                 Database connection crashed
Severity:             Medium
Remediation:
The best way to protect against those kind of issues is making sure the Database resources are sufficient
Details:
Cross-site request forgery is a type of malicious website exploit.`;
exports.issueWithoutResources = {
    id: (0, crypto_1.randomUUID)(),
    entryPointId: 'upmVm5iPkddvzY6RisT7Cr',
    details: 'Cross-site request forgery is a type of malicious website exploit.',
    name: 'Database connection crashed',
    severity: scan_1.Severity.MEDIUM,
    protocol: 'http',
    remedy: 'The best way to protect against those kind of issues is making sure the Database resources are sufficient',
    cvss: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:L',
    time: new Date(),
    originalRequest: {
        method: scan_1.HttpMethod.GET,
        url: 'https://brokencrystals.com/'
    },
    request: {
        method: scan_1.HttpMethod.GET,
        url: 'https://brokencrystals.com/'
    },
    link: 'http://app.brightsec.com/scans/pDzxcEXQC8df1fcz1QwPf9/issues/pDzxcEXQC8df1fcz1QwPf9',
    certainty: true
};
exports.fullyDescribedIssueText = `${exports.issueWithoutResourcesText}
Extra Details:
● Missing Strict-Transport-Security Header
\tThe engine detected a missing Strict-Transport-Security header, which might cause data to be sent insecurely from the client to the server.
\tLinks:
\t● https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts
References:
● https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts`;
exports.fullyDescribedIssue = {
    ...exports.issueWithoutResources,
    comments: [
        {
            headline: 'Missing Strict-Transport-Security Header',
            text: 'The engine detected a missing Strict-Transport-Security header, which might cause data to be sent insecurely from the client to the server.',
            links: [
                'https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts'
            ]
        }
    ],
    resources: [
        'https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts'
    ]
};
exports.issueWithoutExtraInfoText = `${exports.issueWithoutResourcesText}
References:
 ● https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts`;
exports.issueWithoutExtraInfo = {
    ...exports.issueWithoutResources,
    resources: [
        'https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts'
    ]
};
//# sourceMappingURL=issues.js.map