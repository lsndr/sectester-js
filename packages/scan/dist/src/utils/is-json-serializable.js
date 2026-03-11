"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonSerializable = void 0;
const isJsonSerializable = (data) => {
    try {
        const serialized = JSON.stringify(data);
        // Check it's not just an empty object (which Maps/Sets would produce)
        if (serialized === '{}' &&
            Object.prototype.toString.call(data) !== '[object Object]') {
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
};
exports.isJsonSerializable = isJsonSerializable;
//# sourceMappingURL=is-json-serializable.js.map