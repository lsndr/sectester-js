"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["SILENT"] = 0] = "SILENT";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["NOTICE"] = 3] = "NOTICE";
    LogLevel[LogLevel["VERBOSE"] = 4] = "VERBOSE";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    get logLevel() {
        return this._logLevel;
    }
    set logLevel(value) {
        this._logLevel = value;
    }
    constructor(logLevel = LogLevel.NOTICE) {
        this.MAX_FORMATTED_LEVEL_LENGTH = Object.values(LogLevel).reduce((maxLength, level) => Math.max(maxLength, level.toString().length), 0);
        this._logLevel = logLevel;
    }
    error(message, ...args) {
        this.write(message, LogLevel.ERROR, ...args);
    }
    warn(message, ...args) {
        this.write(message, LogLevel.WARN, ...args);
    }
    log(message, ...args) {
        this.write(message, LogLevel.NOTICE, ...args);
    }
    debug(message, ...args) {
        this.write(message, LogLevel.VERBOSE, ...args);
    }
    write(message, level, ...args) {
        if (this.logLevel < level) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`${this.formatHeader(level)} - ${message}`, ...args);
    }
    formatHeader(level) {
        const header = `[${new Date().toJSON()}] [${this.formattedLevel(level)}]`;
        switch (level) {
            case LogLevel.ERROR:
                return chalk_1.default.red(header);
            case LogLevel.WARN:
                return chalk_1.default.yellow(header);
            case LogLevel.NOTICE:
                return chalk_1.default.green(header);
            case LogLevel.VERBOSE:
                return chalk_1.default.cyan(header);
        }
    }
    formattedLevel(level) {
        return LogLevel[level]
            .toString()
            .toUpperCase()
            .padEnd(this.MAX_FORMATTED_LEVEL_LENGTH, ' ');
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map