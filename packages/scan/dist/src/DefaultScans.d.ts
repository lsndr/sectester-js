import { Scans } from './Scans';
import { Issue, ScanConfig, ScanState } from './models';
import { ApiClient, Configuration } from '@sectester/core';
export declare class DefaultScans implements Scans {
    private readonly configuration;
    private readonly client;
    constructor(configuration: Configuration, client: ApiClient);
    createScan(config: ScanConfig): Promise<{
        id: string;
    }>;
    listIssues(id: string): Promise<Issue[]>;
    stopScan(id: string): Promise<void>;
    deleteScan(id: string): Promise<void>;
    getScan(id: string): Promise<ScanState>;
    private convertToBackendFormat;
    private mapTest;
    private mapBrokenAccessControl;
}
