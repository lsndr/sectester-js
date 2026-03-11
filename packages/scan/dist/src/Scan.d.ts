import { Scans } from './Scans';
import { Issue, ScanState, Severity } from './models';
import { Logger } from '@sectester/core';
export interface ScanOptions {
    id: string;
    scans: Scans;
    logger?: Logger;
    pollingInterval?: number;
    timeout?: number;
}
export declare class Scan {
    readonly id: string;
    private readonly ACTIVE_STATUSES;
    private readonly DONE_STATUSES;
    private readonly scans;
    private readonly pollingInterval;
    private readonly logger;
    private readonly timeout;
    private state;
    constructor({ id, scans, logger, timeout, pollingInterval }: ScanOptions);
    get active(): boolean;
    get done(): boolean;
    issues(): Promise<Issue[]>;
    status(): AsyncIterableIterator<ScanState>;
    expect(expectation: Severity | ((scan: Scan) => unknown), options?: {
        failFast?: boolean;
    }): Promise<void>;
    dispose(): Promise<void>;
    stop(): Promise<void>;
    private assert;
    private refreshState;
    private changingStatus;
    private createPredicate;
    private satisfyExpectation;
}
