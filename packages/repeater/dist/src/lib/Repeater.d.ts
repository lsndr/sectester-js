import { RepeaterServer } from './RepeaterServer';
import { RepeaterCommands } from './RepeaterCommands';
import { RequestRunnerOptions } from '../request-runner';
import { Logger } from '@sectester/core';
export declare enum RunningStatus {
    OFF = 0,
    STARTING = 1,
    RUNNING = 2
}
export type RepeaterId = string;
export declare const RepeaterId: unique symbol;
export declare class Repeater {
    readonly repeaterId: RepeaterId;
    private readonly logger;
    private readonly repeaterServer;
    private readonly repeaterCommands;
    private readonly requestRunnerOptions;
    private _runningStatus;
    private deploymentPromise?;
    get runningStatus(): RunningStatus;
    constructor(repeaterId: RepeaterId, logger: Logger, repeaterServer: RepeaterServer, repeaterCommands: RepeaterCommands, requestRunnerOptions: RequestRunnerOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    private connect;
    private deploy;
    private subscribeEvents;
    private handleError;
    private normalizeMessage;
    private isCriticalError;
    private handleCriticalError;
    private upgradeAvailable;
    private reconnectAttempt;
    private limitsReceived;
    private reconnectionFailed;
    private requestReceived;
}
