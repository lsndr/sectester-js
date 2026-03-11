"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecScan = void 0;
const FunctionScanTarget_1 = require("./FunctionScanTarget");
const IssueFound_1 = require("./IssueFound");
const scan_1 = require("@sectester/scan");
class SecScan {
    constructor(settings, scanFactory, formatter, reporter) {
        this.settings = settings;
        this.scanFactory = scanFactory;
        this.formatter = formatter;
        this.reporter = reporter;
        this._threshold = scan_1.Severity.LOW;
        this._timeout = 600000;
        this._failFast = true;
    }
    async run(options) {
        var _a;
        let functionScanTarget;
        let targetOptions;
        if (this.isFunctionScanOptions(options)) {
            functionScanTarget = new FunctionScanTarget_1.FunctionScanTarget();
            const { url } = await functionScanTarget.start(options.fn);
            targetOptions = {
                url,
                method: 'POST',
                body: options.inputSample,
                ...(typeof options.inputSample === 'object'
                    ? { headers: { 'content-type': 'application/json' } }
                    : {})
            };
        }
        else {
            targetOptions = options;
        }
        const scan = await this.scanFactory.createScan({
            ...this.settings,
            target: targetOptions
        }, {
            timeout: this._timeout
        });
        try {
            await scan.expect(this._threshold, { failFast: this._failFast });
            await this.assert(scan);
        }
        finally {
            await scan.stop();
            await (functionScanTarget === null || functionScanTarget === void 0 ? void 0 : functionScanTarget.stop());
            await ((_a = this.reporter) === null || _a === void 0 ? void 0 : _a.report(scan));
        }
    }
    threshold(severity) {
        this._threshold = severity;
        return this;
    }
    timeout(value) {
        this._timeout = value;
        return this;
    }
    setFailFast(enable) {
        this._failFast = enable;
        return this;
    }
    async assert(scan) {
        const issue = await this.findExpectedIssue(scan);
        if (issue) {
            throw new IssueFound_1.IssueFound(issue, this.formatter);
        }
    }
    async findExpectedIssue(scan) {
        const issues = await scan.issues();
        if (this._threshold) {
            return issues.find(x => { var _a; return (_a = scan_1.severityRanges.get(this._threshold)) === null || _a === void 0 ? void 0 : _a.includes(x.severity); });
        }
    }
    isFunctionScanOptions(x) {
        return !!x.fn;
    }
}
exports.SecScan = SecScan;
//# sourceMappingURL=SecScan.js.map