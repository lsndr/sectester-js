"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanAborted = void 0;
const ScanException_1 = require("./ScanException");
const ScanExceptionCode_1 = require("./ScanExceptionCode");
class ScanAborted extends ScanException_1.ScanException {
    get type() {
        return ScanExceptionCode_1.ScanExceptionCode.ABORTED;
    }
    constructor(status) {
        super(`Scan ${status}.`);
    }
}
exports.ScanAborted = ScanAborted;
//# sourceMappingURL=ScanAborted.js.map