import { Scan } from './Scan';
import { ScanSettings, ScanSettingsOptions } from './ScanSettings';
import { Configuration } from '@sectester/core';
export declare class ScanFactory {
    private readonly configuration;
    private readonly scans;
    private readonly discoveries;
    private readonly container;
    private readonly logger;
    constructor(configuration: Configuration);
    createScan(settings: ScanSettings | ScanSettingsOptions, options?: {
        timeout?: number;
        pollingInterval?: number;
    }): Promise<Scan>;
    private createScanConfig;
}
