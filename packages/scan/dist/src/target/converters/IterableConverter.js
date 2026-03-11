"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IterableConverter = void 0;
class IterableConverter {
    canHandle(data) {
        return typeof Object(data)[Symbol.iterator] === 'function';
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async convert(data) {
        const chunks = [];
        for await (const chunk of data) {
            chunks.push(chunk);
        }
        return new TextDecoder().decode(Buffer.concat(chunks));
    }
    getMimeType(_) {
        return 'application/octet-stream';
    }
}
exports.IterableConverter = IterableConverter;
//# sourceMappingURL=IterableConverter.js.map