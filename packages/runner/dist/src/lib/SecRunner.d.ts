import { SecScanOptions } from './SecScanOptions';
import { SecScan } from './SecScan';
import { Configuration, ConfigurationOptions } from '@sectester/core';
export declare class SecRunner {
    static readonly SHUTDOWN_SIGNALS: readonly string[];
    private readonly configuration;
    private readonly logger;
    private repeater;
    private repeaterFactory;
    private repeatersManager;
    get repeaterId(): string | undefined;
    constructor(config: Configuration | ConfigurationOptions);
    init(): Promise<void>;
    clear(): Promise<void>;
    createScan(options: SecScanOptions): SecScan;
    private initConfiguration;
    private setupShutdown;
    private removeShutdownHandler;
    private readonly beforeShutdownSignalHandler;
}
