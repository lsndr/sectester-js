"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncIterableConverter = void 0;
class AsyncIterableConverter {
    canHandle(data) {
        return typeof Object(data)[Symbol.asyncIterator] === 'function';
    }
    async convert(data) {
        const chunks = [];
        for await (const chunk of data) {
            chunks.push(chunk);
        }
        return new TextDecoder().decode(Buffer.concat(chunks));
    }
    getMimeType() {
        return 'application/octet-stream';
    }
}
exports.AsyncIterableConverter = AsyncIterableConverter;
//# sourceMappingURL=AsyncIterableConverter.js.map