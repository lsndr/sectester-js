import { HttpMethod, Severity } from '@sectester/scan';
export declare const issueWithoutResourcesText = "Issue in Bright UI:   http://app.brightsec.com/scans/pDzxcEXQC8df1fcz1QwPf9/issues/pDzxcEXQC8df1fcz1QwPf9\nName:                 Database connection crashed\nSeverity:             Medium\nRemediation:\nThe best way to protect against those kind of issues is making sure the Database resources are sufficient\nDetails:\nCross-site request forgery is a type of malicious website exploit.";
export declare const issueWithoutResources: {
    id: `${string}-${string}-${string}-${string}-${string}`;
    entryPointId: string;
    details: string;
    name: string;
    severity: Severity.MEDIUM;
    protocol: "http";
    remedy: string;
    cvss: string;
    time: Date;
    originalRequest: {
        method: HttpMethod.GET;
        url: string;
    };
    request: {
        method: HttpMethod.GET;
        url: string;
    };
    link: string;
    certainty: true;
};
export declare const fullyDescribedIssueText = "Issue in Bright UI:   http://app.brightsec.com/scans/pDzxcEXQC8df1fcz1QwPf9/issues/pDzxcEXQC8df1fcz1QwPf9\nName:                 Database connection crashed\nSeverity:             Medium\nRemediation:\nThe best way to protect against those kind of issues is making sure the Database resources are sufficient\nDetails:\nCross-site request forgery is a type of malicious website exploit.\nExtra Details:\n\u25CF Missing Strict-Transport-Security Header\n\tThe engine detected a missing Strict-Transport-Security header, which might cause data to be sent insecurely from the client to the server.\n\tLinks:\n\t\u25CF https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts\nReferences:\n\u25CF https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts";
export declare const fullyDescribedIssue: {
    comments: {
        headline: string;
        text: string;
        links: string[];
    }[];
    resources: string[];
    id: `${string}-${string}-${string}-${string}-${string}`;
    entryPointId: string;
    details: string;
    name: string;
    severity: Severity.MEDIUM;
    protocol: "http";
    remedy: string;
    cvss: string;
    time: Date;
    originalRequest: {
        method: HttpMethod.GET;
        url: string;
    };
    request: {
        method: HttpMethod.GET;
        url: string;
    };
    link: string;
    certainty: true;
};
export declare const issueWithoutExtraInfoText = "Issue in Bright UI:   http://app.brightsec.com/scans/pDzxcEXQC8df1fcz1QwPf9/issues/pDzxcEXQC8df1fcz1QwPf9\nName:                 Database connection crashed\nSeverity:             Medium\nRemediation:\nThe best way to protect against those kind of issues is making sure the Database resources are sufficient\nDetails:\nCross-site request forgery is a type of malicious website exploit.\nReferences:\n \u25CF https://www.owasp.org/index.php/OWASP_Secure_Headers_Project#hsts";
export declare const issueWithoutExtraInfo: {
    resources: string[];
    id: `${string}-${string}-${string}-${string}-${string}`;
    entryPointId: string;
    details: string;
    name: string;
    severity: Severity.MEDIUM;
    protocol: "http";
    remedy: string;
    cvss: string;
    time: Date;
    originalRequest: {
        method: HttpMethod.GET;
        url: string;
    };
    request: {
        method: HttpMethod.GET;
        url: string;
    };
    link: string;
    certainty: true;
};
