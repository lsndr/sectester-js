"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = void 0;
const truncate = (str, n) => str.length > n ? str.substring(0, n).replace(/\w$/gi, '…') : str;
exports.truncate = truncate;
//# sourceMappingURL=truncate.js.map