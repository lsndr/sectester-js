import { Formatter } from '@sectester/reporter';
import { SecTesterError } from '@sectester/core';
import { Issue } from '@sectester/scan';
export declare class IssueFound extends SecTesterError {
    readonly issue: Issue;
    constructor(issue: Issue, formatter: Formatter);
}
