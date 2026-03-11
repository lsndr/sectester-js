"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConverterRegistry = void 0;
class ConverterRegistry {
    constructor(converters) {
        this.converters = [];
        this.converters = converters;
    }
    getConverter(data, mimeType) {
        return this.converters.find(converter => converter.canHandle(data, mimeType));
    }
}
exports.ConverterRegistry = ConverterRegistry;
//# sourceMappingURL=ConverterRegistry.js.map