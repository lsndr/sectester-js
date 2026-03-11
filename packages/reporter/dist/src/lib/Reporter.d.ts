import { Scan } from '@sectester/scan';
export interface Reporter {
    report(scan: Scan): Promise<void>;
}
export declare const Reporter: unique symbol;
