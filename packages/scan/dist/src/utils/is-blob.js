"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlobLike = void 0;
const isBlobLike = (object) => (Blob && object instanceof Blob) ||
    (!!object &&
        typeof object === 'object' &&
        (typeof object.stream === 'function' ||
            typeof object.arrayBuffer === 'function') &&
        /^(Blob|File)$/.test(object[Symbol.toStringTag]));
exports.isBlobLike = isBlobLike;
//# sourceMappingURL=is-blob.js.map