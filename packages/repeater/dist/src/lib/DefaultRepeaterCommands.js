"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRepeaterCommands = void 0;
const tslib_1 = require("tslib");
const request_runner_1 = require("../request-runner");
const tsyringe_1 = require("tsyringe");
let DefaultRepeaterCommands = class DefaultRepeaterCommands {
    constructor(requestRunners) {
        this.requestRunners = requestRunners;
    }
    async sendRequest(request) {
        const { protocol } = request;
        const requestRunner = this.requestRunners.find(x => x.protocol === protocol);
        if (!requestRunner) {
            throw new Error(`Unsupported protocol "${protocol}"`);
        }
        return requestRunner.run(request);
    }
};
exports.DefaultRepeaterCommands = DefaultRepeaterCommands;
exports.DefaultRepeaterCommands = DefaultRepeaterCommands = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.injectAll)(request_runner_1.RequestRunner)),
    tslib_1.__metadata("design:paramtypes", [Array])
], DefaultRepeaterCommands);
//# sourceMappingURL=DefaultRepeaterCommands.js.map