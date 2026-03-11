"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobConverter = void 0;
const utils_1 = require("../../utils");
class BlobConverter {
    canHandle(data) {
        return (0, utils_1.isBlobLike)(data);
    }
    async convert(data) {
        return new TextDecoder().decode(await data.arrayBuffer());
    }
    getMimeType(data) {
        return data.type || 'application/octet-stream';
    }
}
exports.BlobConverter = BlobConverter;
//# sourceMappingURL=BlobConverter.js.map