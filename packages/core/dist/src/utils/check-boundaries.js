"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBoundaries = void 0;
const checkMinimum = (value, { min, exclusiveMin = false }) => (exclusiveMin ? value > min : value >= min);
const checkMaximum = (value, { max, exclusiveMax = false }) => (exclusiveMax ? value < max : value <= max);
const isNumber = (value) => typeof value === 'number' && !isNaN(value);
const checkBoundaries = (value, { min, max, exclusiveMax, exclusiveMin } = {}) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    if (!isNumber(value)) {
        return false;
    }
    let valid = true;
    if (isNumber(max)) {
        valid = checkMaximum(value, { max, exclusiveMax });
    }
    if (valid && isNumber(min)) {
        valid = checkMinimum(value, { min, exclusiveMin });
    }
    return valid;
};
exports.checkBoundaries = checkBoundaries;
//# sourceMappingURL=check-boundaries.js.map