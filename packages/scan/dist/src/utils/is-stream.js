"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStream = void 0;
const isStream = (obj) => !!obj && typeof obj.pipe === 'function';
exports.isStream = isStream;
//# sourceMappingURL=is-stream.js.map