"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repeater = exports.RepeaterId = exports.RunningStatus = void 0;
const tslib_1 = require("tslib");
const RepeaterServer_1 = require("./RepeaterServer");
const RepeaterCommands_1 = require("./RepeaterCommands");
const request_runner_1 = require("../request-runner");
const core_1 = require("@sectester/core");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const tsyringe_1 = require("tsyringe");
var RunningStatus;
(function (RunningStatus) {
    RunningStatus[RunningStatus["OFF"] = 0] = "OFF";
    RunningStatus[RunningStatus["STARTING"] = 1] = "STARTING";
    RunningStatus[RunningStatus["RUNNING"] = 2] = "RUNNING";
})(RunningStatus || (exports.RunningStatus = RunningStatus = {}));
exports.RepeaterId = Symbol('RepeaterId');
let Repeater = class Repeater {
    get runningStatus() {
        return this._runningStatus;
    }
    constructor(repeaterId, logger, repeaterServer, repeaterCommands, requestRunnerOptions) {
        this.repeaterId = repeaterId;
        this.logger = logger;
        this.repeaterServer = repeaterServer;
        this.repeaterCommands = repeaterCommands;
        this.requestRunnerOptions = requestRunnerOptions;
        this._runningStatus = RunningStatus.OFF;
        this.deploy = async () => {
            this.logger.log('Deploying the Repeater (%s)', this.repeaterId);
            await this.repeaterServer.deploy({
                repeaterId: this.repeaterId
            });
            this.logger.log('The Repeater (%s) started', this.repeaterId);
        };
        this.handleError = ({ code, message, remediation }) => {
            const normalizedMessage = this.normalizeMessage(message);
            const normalizedRemediation = this.normalizeMessage(remediation !== null && remediation !== void 0 ? remediation : '');
            if (this.isCriticalError(code)) {
                this.handleCriticalError(normalizedMessage, normalizedRemediation);
            }
            else {
                this.logger.error(normalizedMessage);
            }
        };
        this.upgradeAvailable = (event) => {
            this.logger.warn('%s: A new Repeater version (%s) is available, for update instruction visit https://docs.brightsec.com/docs/installation-options', chalk_1.default.yellow('(!) IMPORTANT'), event.version);
        };
        this.reconnectAttempt = ({ attempt, maxAttempts }) => {
            this.logger.warn('Failed to connect to Bright cloud (attempt %d/%d)', attempt, maxAttempts);
        };
        this.limitsReceived = ({ maxBodySize }) => {
            this.logger.debug('Limits received: %d', maxBodySize);
            this.requestRunnerOptions.maxContentLength = maxBodySize;
        };
        this.reconnectionFailed = ({ error }) => {
            this.logger.error(error.message);
            this.stop().catch(this.logger.error);
        };
        this.requestReceived = async (event) => {
            const response = await this.repeaterCommands.sendRequest(new request_runner_1.Request({ ...event }));
            const { statusCode, message, errorCode, body, headers, protocol, encoding } = response;
            return {
                protocol,
                body,
                headers,
                statusCode,
                errorCode,
                message,
                encoding
            };
        };
    }
    async start() {
        if (this.runningStatus !== RunningStatus.OFF) {
            throw new Error('Repeater is already active.');
        }
        this._runningStatus = RunningStatus.STARTING;
        try {
            await this.connect();
            this._runningStatus = RunningStatus.RUNNING;
        }
        catch (e) {
            this._runningStatus = RunningStatus.OFF;
            throw e;
        }
    }
    async stop() {
        if (this.runningStatus !== RunningStatus.RUNNING) {
            return;
        }
        this._runningStatus = RunningStatus.OFF;
        this.repeaterServer.disconnect();
        this.deploymentPromise = undefined;
        return Promise.resolve();
    }
    async connect() {
        this.logger.log('Connecting the Bridges');
        this.subscribeEvents();
        await this.repeaterServer.connect();
        await this.deploymentPromise;
    }
    subscribeEvents() {
        this.repeaterServer.on("connected" /* RepeaterServerEvents.CONNECTED */, () => (this.deploymentPromise = this.deploy()));
        this.repeaterServer.on("error" /* RepeaterServerEvents.ERROR */, this.handleError);
        this.repeaterServer.on("reconnection_failed" /* RepeaterServerEvents.RECONNECTION_FAILED */, this.reconnectionFailed);
        this.repeaterServer.on("request" /* RepeaterServerEvents.REQUEST */, this.requestReceived);
        this.repeaterServer.on("update_available" /* RepeaterServerEvents.UPDATE_AVAILABLE */, this.upgradeAvailable);
        this.repeaterServer.on("reconnect_attempt" /* RepeaterServerEvents.RECONNECT_ATTEMPT */, this.reconnectAttempt);
        this.repeaterServer.on("reconnection_succeeded" /* RepeaterServerEvents.RECONNECTION_SUCCEEDED */, () => this.logger.log('The Repeater (%s) connected', this.repeaterId));
        this.repeaterServer.on("limits" /* RepeaterServerEvents.LIMITS */, this.limitsReceived);
    }
    normalizeMessage(message) {
        return message.replace(/\.$/, '');
    }
    isCriticalError(code) {
        return [
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_DEACTIVATED,
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_NO_LONGER_SUPPORTED,
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_UNAUTHORIZED,
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_ALREADY_STARTED,
            RepeaterServer_1.RepeaterErrorCodes.REPEATER_NOT_PERMITTED,
            RepeaterServer_1.RepeaterErrorCodes.UNEXPECTED_ERROR
        ].includes(code);
    }
    handleCriticalError(message, remediation) {
        this.logger.error('%s: %s. %s', chalk_1.default.red('(!) CRITICAL'), message, remediation);
        this.stop().catch(this.logger.error);
    }
};
exports.Repeater = Repeater;
exports.Repeater = Repeater = tslib_1.__decorate([
    (0, tsyringe_1.scoped)(tsyringe_1.Lifecycle.ContainerScoped),
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(exports.RepeaterId)),
    tslib_1.__param(2, (0, tsyringe_1.inject)(RepeaterServer_1.RepeaterServer)),
    tslib_1.__param(3, (0, tsyringe_1.inject)(RepeaterCommands_1.RepeaterCommands)),
    tslib_1.__param(4, (0, tsyringe_1.inject)(request_runner_1.RequestRunnerOptions)),
    tslib_1.__metadata("design:paramtypes", [String, core_1.Logger, Object, Object, Object])
], Repeater);
//# sourceMappingURL=Repeater.js.map