"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanTimedOut = void 0;
const ScanException_1 = require("./ScanException");
const ScanExceptionCode_1 = require("./ScanExceptionCode");
class ScanTimedOut extends ScanException_1.ScanException {
    get type() {
        return ScanExceptionCode_1.ScanExceptionCode.TIMED_OUT;
    }
    constructor(timeout) {
        super(`The expectation was not satisfied within the ${timeout} ms timeout specified.`);
    }
}
exports.ScanTimedOut = ScanTimedOut;
//# sourceMappingURL=ScanTimedOut.js.map