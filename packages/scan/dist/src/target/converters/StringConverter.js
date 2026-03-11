"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringConverter = void 0;
const is_json_1 = require("../../utils/is-json");
const is_xml_1 = require("../../utils/is-xml");
class StringConverter {
    canHandle(data) {
        return typeof data === 'string';
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async convert(data) {
        return data;
    }
    getMimeType(data) {
        const trimmed = data.trim();
        if ((0, is_json_1.isJson)(trimmed)) {
            return 'application/json';
        }
        if ((0, is_xml_1.isXml)(trimmed)) {
            return 'application/xml';
        }
        return 'text/plain';
    }
}
exports.StringConverter = StringConverter;
//# sourceMappingURL=StringConverter.js.map