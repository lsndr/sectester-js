"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scan = void 0;
const models_1 = require("./models");
const exceptions_1 = require("./exceptions");
const promises_1 = require("node:timers/promises");
class Scan {
    constructor({ id, scans, logger, timeout, pollingInterval = 5 * 1000 }) {
        this.ACTIVE_STATUSES = new Set([
            models_1.ScanStatus.PENDING,
            models_1.ScanStatus.RUNNING,
            models_1.ScanStatus.QUEUED
        ]);
        this.DONE_STATUSES = new Set([
            models_1.ScanStatus.DISRUPTED,
            models_1.ScanStatus.DONE,
            models_1.ScanStatus.FAILED,
            models_1.ScanStatus.STOPPED
        ]);
        this.state = { status: models_1.ScanStatus.PENDING };
        this.scans = scans;
        this.logger = logger;
        this.id = id;
        this.pollingInterval = pollingInterval;
        this.timeout = timeout;
    }
    get active() {
        return this.ACTIVE_STATUSES.has(this.state.status);
    }
    get done() {
        return this.DONE_STATUSES.has(this.state.status);
    }
    async issues() {
        await this.refreshState();
        return this.scans.listIssues(this.id);
    }
    async *status() {
        while (this.active) {
            await (0, promises_1.setTimeout)(this.pollingInterval);
            yield this.refreshState();
        }
        return this.state;
    }
    async expect(expectation, options = { failFast: true }) {
        var _a;
        const signal = this.timeout ? AbortSignal.timeout(this.timeout) : undefined;
        const predicate = this.createPredicate(expectation);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        for await (const _ of this.status()) {
            if (this.done || (signal === null || signal === void 0 ? void 0 : signal.aborted)) {
                break;
            }
            if (((_a = options.failFast) !== null && _a !== void 0 ? _a : true) && (await predicate())) {
                break;
            }
        }
        this.assert(signal === null || signal === void 0 ? void 0 : signal.aborted);
    }
    async dispose() {
        try {
            await this.refreshState();
            if (!this.active) {
                await this.scans.deleteScan(this.id);
            }
        }
        catch {
            // noop
        }
    }
    async stop() {
        try {
            await this.refreshState();
            if (this.active) {
                await this.scans.stopScan(this.id);
            }
        }
        catch {
            // noop
        }
    }
    assert(timeoutPassed) {
        var _a;
        const { status } = this.state;
        if (this.done && status !== models_1.ScanStatus.DONE) {
            throw new exceptions_1.ScanAborted(status);
        }
        if (timeoutPassed) {
            throw new exceptions_1.ScanTimedOut((_a = this.timeout) !== null && _a !== void 0 ? _a : 0);
        }
    }
    async refreshState() {
        if (!this.done) {
            const lastState = this.state;
            this.state = await this.scans.getScan(this.id);
            this.changingStatus(lastState.status, this.state.status);
        }
        return this.state;
    }
    changingStatus(from, to) {
        var _a, _b;
        if (from !== models_1.ScanStatus.QUEUED && to === models_1.ScanStatus.QUEUED) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.warn('The maximum amount of concurrent scans has been reached for the organization, ' +
                'the execution will resume once a free engine will be available. ' +
                'If you want to increase the execution concurrency, ' +
                'please upgrade your subscription or contact your system administrator');
        }
        if (from === models_1.ScanStatus.QUEUED && to !== models_1.ScanStatus.QUEUED) {
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.log('Connected to engine, resuming execution');
        }
    }
    createPredicate(expectation) {
        return () => {
            try {
                return typeof expectation === 'function'
                    ? expectation(this)
                    : this.satisfyExpectation(expectation);
            }
            catch {
                // noop
            }
        };
    }
    satisfyExpectation(severity) {
        var _a;
        const issueGroups = (_a = this.state.issuesBySeverity) !== null && _a !== void 0 ? _a : [];
        return issueGroups.some((x) => { var _a; return ((_a = models_1.severityRanges.get(severity)) === null || _a === void 0 ? void 0 : _a.includes(x.type)) && x.number > 0; });
    }
}
exports.Scan = Scan;
//# sourceMappingURL=Scan.js.map