import type { CheckRunPayload } from '../types';
import { BasePayloadBuilder } from './BasePayloadBuilder';
import type { Issue } from '@sectester/scan';
export declare class SingleItemPayloadBuilder extends BasePayloadBuilder {
    private readonly issue;
    constructor(issue: Issue, commitSha: string | undefined, testFilePath: string);
    build(): CheckRunPayload;
    private buildEndpoint;
    private buildTitle;
    private buildSummary;
    private buildDetails;
    private formatList;
    private formatIssueComment;
}
