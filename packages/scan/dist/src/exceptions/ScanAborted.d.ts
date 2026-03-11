import { ScanException } from './ScanException';
import { ScanExceptionCode } from './ScanExceptionCode';
import { ScanStatus } from '../models';
export declare class ScanAborted extends ScanException {
    get type(): ScanExceptionCode;
    constructor(status: ScanStatus);
}
