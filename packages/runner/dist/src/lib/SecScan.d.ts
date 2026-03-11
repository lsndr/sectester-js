import { Formatter, Reporter } from '@sectester/reporter';
import { BodyType, ScanFactory, ScanSettingsOptions, Severity, TargetOptions } from '@sectester/scan';
export interface FunctionScanOptions<T> {
    inputSample: T;
    fn: (input: T) => Promise<unknown>;
}
export declare class SecScan {
    private readonly settings;
    private readonly scanFactory;
    private readonly formatter;
    private readonly reporter?;
    private _threshold;
    private _timeout;
    private _failFast;
    constructor(settings: Omit<ScanSettingsOptions, 'target'>, scanFactory: ScanFactory, formatter: Formatter, reporter?: Reporter | undefined);
    run<T extends BodyType>(options: TargetOptions | FunctionScanOptions<T>): Promise<void>;
    threshold(severity: Severity): SecScan;
    timeout(value: number): SecScan;
    setFailFast(enable: boolean): SecScan;
    private assert;
    private findExpectedIssue;
    private isFunctionScanOptions;
}
