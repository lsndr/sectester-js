import type { CheckRunPayload } from '../types';
import { BasePayloadBuilder } from './BasePayloadBuilder';
import type { Issue } from '@sectester/scan';
export declare class MultiItemsPayloadBuilder extends BasePayloadBuilder {
    private readonly issues;
    constructor(issues: Issue[], commitSha: string | undefined, testFilePath: string);
    build(): CheckRunPayload;
    private buildSummary;
    private buildDetails;
}
