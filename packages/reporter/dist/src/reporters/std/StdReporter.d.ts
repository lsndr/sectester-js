import { Reporter } from '../../lib';
import { Scan } from '@sectester/scan';
export declare class StdReporter implements Reporter {
    private readonly severityColorFn;
    private readonly severityPrintFn;
    report(scan: Scan): Promise<void>;
    private formatFindingsMessage;
    private renderDetailsTable;
    private getHeaderConfig;
    private pluralize;
    private colorize;
    private print;
}
