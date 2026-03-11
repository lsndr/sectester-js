export declare enum LogLevel {
    SILENT = 0,
    ERROR = 1,
    WARN = 2,
    NOTICE = 3,
    VERBOSE = 4
}
export declare class Logger {
    private MAX_FORMATTED_LEVEL_LENGTH;
    get logLevel(): LogLevel;
    set logLevel(value: LogLevel);
    private _logLevel;
    constructor(logLevel?: LogLevel);
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    log(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    private write;
    private formatHeader;
    private formattedLevel;
}
