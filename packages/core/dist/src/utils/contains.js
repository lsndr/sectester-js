"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = void 0;
const contains = (enumType, value) => (Array.isArray(value) ? value : [value]).every((x) => Object.values(enumType).includes(x));
exports.contains = contains;
//# sourceMappingURL=contains.js.map