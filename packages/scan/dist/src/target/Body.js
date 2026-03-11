"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = void 0;
const converters_1 = require("./converters");
class Body {
    constructor(data, mimeType) {
        this.data = data;
        this.mimeType = mimeType;
    }
    async text() {
        if (this.data === null) {
            return 'null';
        }
        const converter = Body.converterRegistry.getConverter(this.data, this.mimeType);
        if (converter) {
            return converter.convert(this.data, this.mimeType);
        }
        // Fallback to string conversion for any other types
        return String(this.data);
    }
    type() {
        if (this.mimeType) {
            return this.mimeType;
        }
        if (this.data === null) {
            return 'text/plain';
        }
        const converter = Body.converterRegistry.getConverter(this.data);
        if (converter) {
            return converter.getMimeType(this.data);
        }
        // Default type for unknown data
        return '';
    }
}
exports.Body = Body;
Body.converterRegistry = new converters_1.ConverterRegistry([
    new converters_1.ArrayBufferConverter(),
    new converters_1.FormDataConverter(),
    new converters_1.URLSearchParamsConverter(),
    new converters_1.BlobConverter(),
    new converters_1.StreamConverter(),
    new converters_1.JsonConverter(),
    new converters_1.StringConverter(),
    new converters_1.IterableConverter(),
    new converters_1.AsyncIterableConverter()
]);
//# sourceMappingURL=Body.js.map