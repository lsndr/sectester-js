"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isXml = void 0;
const isXml = (text) => text.startsWith('<?xml') ||
    (text.startsWith('<') &&
        !text.startsWith('<!DOCTYPE html') &&
        !text.startsWith('<!--') &&
        (text.includes('</') || text.includes('/>')) &&
        text.endsWith('>'));
exports.isXml = isXml;
//# sourceMappingURL=is-xml.js.map