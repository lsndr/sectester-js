import { CheckRunPayloadBuilder } from './CheckRunPayloadBuilder';
import { CheckRunAnnotation, CheckRunPayload } from '../types';
import type { Issue } from '@sectester/scan';
export declare abstract class BasePayloadBuilder implements CheckRunPayloadBuilder {
    protected readonly testFilePath: string;
    protected readonly commitSha: string;
    constructor(commitSha: string | undefined, testFilePath: string);
    abstract build(): CheckRunPayload;
    protected convertIssueToAnnotation(issue: Issue): CheckRunAnnotation;
}
