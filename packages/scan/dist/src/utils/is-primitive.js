"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = void 0;
const isPrimitive = (value) => typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined;
exports.isPrimitive = isPrimitive;
//# sourceMappingURL=is-primitive.js.map