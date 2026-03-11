"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamConverter = void 0;
const utils_1 = require("../../utils");
class StreamConverter {
    canHandle(data) {
        return (0, utils_1.isStream)(data);
    }
    async convert(data) {
        const chunks = [];
        for await (const chunk of data) {
            chunks.push(Buffer.from(chunk));
        }
        return new TextDecoder().decode(Buffer.concat(chunks));
    }
    getMimeType(_) {
        return 'application/octet-stream';
    }
}
exports.StreamConverter = StreamConverter;
//# sourceMappingURL=StreamConverter.js.map