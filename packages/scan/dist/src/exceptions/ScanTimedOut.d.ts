import { ScanException } from './ScanException';
import { ScanExceptionCode } from './ScanExceptionCode';
export declare class ScanTimedOut extends ScanException {
    get type(): ScanExceptionCode;
    constructor(timeout: number);
}
