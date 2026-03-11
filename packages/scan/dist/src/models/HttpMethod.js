"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpMethod = exports.HttpMethod = void 0;
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["POST"] = "POST";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["COPY"] = "COPY";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["LINK"] = "LINK";
    HttpMethod["UNLINK"] = "UNLINK";
    HttpMethod["PURGE"] = "PURGE";
    HttpMethod["LOCK"] = "LOCK";
    HttpMethod["UNLOCK"] = "UNLOCK";
    HttpMethod["PROPFIND"] = "PROPFIND";
    HttpMethod["VIEW"] = "VIEW";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
const isHttpMethod = (value) => Object.values(HttpMethod).includes(value.toUpperCase());
exports.isHttpMethod = isHttpMethod;
//# sourceMappingURL=HttpMethod.js.map