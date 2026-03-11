"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJson = void 0;
const isJson = (text) => {
    if (!((text.startsWith('{') && text.endsWith('}')) ||
        (text.startsWith('[') && text.endsWith(']')))) {
        return false;
    }
    try {
        JSON.parse(text);
        return true;
    }
    catch {
        return false;
    }
};
exports.isJson = isJson;
//# sourceMappingURL=is-json.js.map