"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeaterServer = exports.RepeaterErrorCodes = void 0;
var RepeaterErrorCodes;
(function (RepeaterErrorCodes) {
    RepeaterErrorCodes["REPEATER_NOT_PERMITTED"] = "repeater_not_permitted";
    RepeaterErrorCodes["REPEATER_ALREADY_STARTED"] = "repeater_already_started";
    RepeaterErrorCodes["REPEATER_DEACTIVATED"] = "repeater_deactivated";
    RepeaterErrorCodes["REPEATER_UNAUTHORIZED"] = "repeater_unauthorized";
    RepeaterErrorCodes["REPEATER_NO_LONGER_SUPPORTED"] = "repeater_no_longer_supported";
    RepeaterErrorCodes["UNKNOWN_ERROR"] = "unknown_error";
    RepeaterErrorCodes["UNEXPECTED_ERROR"] = "unexpected_error";
})(RepeaterErrorCodes || (exports.RepeaterErrorCodes = RepeaterErrorCodes = {}));
exports.RepeaterServer = Symbol('RepeaterServer');
//# sourceMappingURL=RepeaterServer.js.map