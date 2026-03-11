"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayBufferConverter = void 0;
class ArrayBufferConverter {
    canHandle(data) {
        return data instanceof ArrayBuffer || ArrayBuffer.isView(data);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async convert(data) {
        return new TextDecoder().decode(data);
    }
    getMimeType(_data) {
        return 'application/octet-stream';
    }
}
exports.ArrayBufferConverter = ArrayBufferConverter;
//# sourceMappingURL=ArrayBufferConverter.js.map