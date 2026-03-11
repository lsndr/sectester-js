"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escape = void 0;
const escape = (str) => str.replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22');
exports.escape = escape;
//# sourceMappingURL=escape.js.map