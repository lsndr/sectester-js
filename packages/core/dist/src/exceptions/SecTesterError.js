"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecTesterError = void 0;
class SecTesterError extends Error {
    constructor(message) {
        super(message);
        this.name = new.target.name;
    }
}
exports.SecTesterError = SecTesterError;
//# sourceMappingURL=SecTesterError.js.map