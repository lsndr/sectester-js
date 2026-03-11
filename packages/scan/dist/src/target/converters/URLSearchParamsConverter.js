"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLSearchParamsConverter = void 0;
class URLSearchParamsConverter {
    canHandle(data) {
        return data instanceof URLSearchParams;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async convert(data) {
        return data.toString();
    }
    getMimeType(_data) {
        return 'application/x-www-form-urlencoded';
    }
}
exports.URLSearchParamsConverter = URLSearchParamsConverter;
//# sourceMappingURL=URLSearchParamsConverter.js.map