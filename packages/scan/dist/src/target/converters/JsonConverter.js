"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConverter = void 0;
const is_json_serializable_1 = require("../../utils/is-json-serializable");
const is_primitive_1 = require("../../utils/is-primitive");
class JsonConverter {
    canHandle(data, mimeType) {
        if (mimeType === 'application/json')
            return true;
        return (0, is_json_serializable_1.isJsonSerializable)(data) && !(0, is_primitive_1.isPrimitive)(data);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async convert(data) {
        return JSON.stringify(data);
    }
    getMimeType(_data) {
        return 'application/json';
    }
}
exports.JsonConverter = JsonConverter;
//# sourceMappingURL=JsonConverter.js.map