"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanException = void 0;
const core_1 = require("@sectester/core");
class ScanException extends core_1.SecTesterError {
    constructor(message) {
        super(message);
    }
}
exports.ScanException = ScanException;
//# sourceMappingURL=ScanException.js.map