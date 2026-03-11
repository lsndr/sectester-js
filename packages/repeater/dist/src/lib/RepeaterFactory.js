"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeaterFactory = void 0;
const tslib_1 = require("tslib");
const Repeater_1 = require("./Repeater");
const request_runner_1 = require("../request-runner");
const api_1 = require("../api");
const core_1 = require("@sectester/core");
const tsyringe_1 = require("tsyringe");
const node_crypto_1 = require("node:crypto");
/**
 *  A factory that is able to create a dedicated instance of the repeater with a bus and other dependencies.
 */
let RepeaterFactory = class RepeaterFactory {
    constructor(configuration) {
        this.configuration = configuration;
        this.MAX_NAME_LENGTH = 80;
        this.repeatersManager =
            this.configuration.container.resolve(api_1.RepeatersManager);
        this.runnerOptions =
            this.configuration.container.resolve(request_runner_1.RequestRunnerOptions);
    }
    async createRepeater({ description, disableRandomNameGeneration, namePrefix = 'sectester', ...options } = {}) {
        const { repeaterId } = await this.repeatersManager.createRepeater({
            description,
            projectId: this.configuration.projectId,
            name: this.generateName(namePrefix, disableRandomNameGeneration)
        });
        return this.createRepeaterInstance(repeaterId, options);
    }
    async createRepeaterFromExisting(repeaterId, options) {
        await this.repeatersManager.getRepeater(repeaterId);
        return this.createRepeaterInstance(repeaterId, options);
    }
    createRepeaterInstance(repeaterId, { requestRunnerOptions, requestRunners = [] } = {}) {
        const container = this.configuration.container.createChildContainer();
        container.register(Repeater_1.RepeaterId, { useValue: repeaterId });
        this.registerRequestRunnerOptions(container, requestRunnerOptions);
        this.registerRequestRunners(container, requestRunners !== null && requestRunners !== void 0 ? requestRunners : []);
        return container.resolve(Repeater_1.Repeater);
    }
    registerRequestRunners(container, requestRunners) {
        requestRunners.forEach(runner => {
            if (typeof runner === 'function') {
                container.register(request_runner_1.RequestRunner, {
                    useClass: runner
                }, {
                    lifecycle: tsyringe_1.Lifecycle.ContainerScoped
                });
            }
            else {
                container.register(request_runner_1.RequestRunner, {
                    useValue: runner
                });
            }
        });
    }
    registerRequestRunnerOptions(container, options) {
        container.register(request_runner_1.RequestRunnerOptions, {
            useValue: {
                ...this.runnerOptions,
                ...(options !== null && options !== void 0 ? options : {})
            }
        });
    }
    generateName(namePrefix, disableRandomNameGeneration = false) {
        const normalizedPrefix = namePrefix === null || namePrefix === void 0 ? void 0 : namePrefix.trim();
        const randomPostfix = disableRandomNameGeneration ? '' : `-${(0, node_crypto_1.randomUUID)()}`;
        const name = `${normalizedPrefix}${randomPostfix}`;
        if (name.length > this.MAX_NAME_LENGTH) {
            const maxPrefixLength = this.MAX_NAME_LENGTH - randomPostfix.length;
            throw new Error(`Name prefix must be less than or equal to ${maxPrefixLength} characters.`);
        }
        return name;
    }
};
exports.RepeaterFactory = RepeaterFactory;
exports.RepeaterFactory = RepeaterFactory = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Configuration])
], RepeaterFactory);
//# sourceMappingURL=RepeaterFactory.js.map