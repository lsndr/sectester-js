"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeZlibDeflateTransformStream = void 0;
const node_stream_1 = require("node:stream");
class NormalizeZlibDeflateTransformStream extends node_stream_1.Transform {
    constructor() {
        super(...arguments);
        this.hasCheckedHead = false;
        this.header = Buffer.from([0x78, 0x9c]);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _transform(chunk, encoding, callback) {
        if (!this.hasCheckedHead && chunk.length !== 0) {
            // ADHOC: detects raw deflate: https://stackoverflow.com/a/37528114
            if (chunk.compare(this.header, 0, 1, 0, 1) !== 0) {
                this.push(this.header, encoding);
            }
            this.hasCheckedHead = true;
        }
        this.push(chunk, encoding);
        callback();
    }
}
exports.NormalizeZlibDeflateTransformStream = NormalizeZlibDeflateTransformStream;
//# sourceMappingURL=NormalizeZlibDeflateTransformStream.js.map