"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataConverter = void 0;
const utils_1 = require("../../utils");
const normalize_linefeeds_1 = require("../../utils/normalize-linefeeds");
const node_crypto_1 = require("node:crypto");
class FormDataConverter {
    canHandle(data) {
        return data instanceof FormData;
    }
    async convert(data) {
        const array = new Uint32Array(10);
        const boundary = (0, utils_1.escape)(`----BrightFormBoundary${(0, node_crypto_1.getRandomValues)(array)}`);
        let formDataString = '';
        for (const [key, value] of data) {
            formDataString += `--${boundary}\r\n`;
            if (typeof value === 'string') {
                formDataString += `content-disposition: form-data; name="${(0, utils_1.escape)((0, normalize_linefeeds_1.normalizeLinefeeds)(key))}"\r\n\r\n`;
                formDataString += `${value}\r\n`;
            }
            else {
                formDataString += `content-disposition: form-data; name="${(0, utils_1.escape)((0, normalize_linefeeds_1.normalizeLinefeeds)(key))}"; filename="${(0, utils_1.escape)(value.type)}"\r\n`;
                formDataString += `content-type: ${value.type || 'application/octet-stream'}\r\n\r\n`;
                formDataString += `${await this.convertBlob(value)}\r\n`;
            }
        }
        formDataString += `--${boundary}--\r\n`;
        return formDataString;
    }
    getMimeType(_data) {
        return 'multipart/form-data';
    }
    async convertBlob(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return new TextDecoder().decode(arrayBuffer);
    }
}
exports.FormDataConverter = FormDataConverter;
//# sourceMappingURL=FormDataConverter.js.map