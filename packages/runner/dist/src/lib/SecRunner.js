"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecRunner = void 0;
const SecScan_1 = require("./SecScan");
const core_1 = require("@sectester/core");
const repeater_1 = require("@sectester/repeater");
const scan_1 = require("@sectester/scan");
const reporter_1 = require("@sectester/reporter");
class SecRunner {
    get repeaterId() {
        var _a;
        return (_a = this.repeater) === null || _a === void 0 ? void 0 : _a.repeaterId;
    }
    constructor(config) {
        this.beforeShutdownSignalHandler = async () => {
            try {
                await this.clear();
            }
            catch (e) {
                this.logger.error(e.message);
            }
        };
        this.configuration =
            config instanceof core_1.Configuration ? config : new core_1.Configuration(config);
        this.logger = this.configuration.container.resolve(core_1.Logger);
    }
    async init() {
        if (this.repeatersManager && this.repeaterFactory) {
            throw new Error('Already initialized.');
        }
        await this.initConfiguration(this.configuration);
        this.repeatersManager =
            this.configuration.container.resolve(repeater_1.RepeatersManager);
        this.repeaterFactory =
            this.configuration.container.resolve(repeater_1.RepeaterFactory);
        this.setupShutdown();
        this.repeater = await this.repeaterFactory.createRepeater();
        await this.repeater.start();
    }
    async clear() {
        try {
            if (this.repeater && this.repeatersManager) {
                await this.repeater.stop();
                await this.repeatersManager.deleteRepeater(this.repeater.repeaterId);
            }
        }
        finally {
            this.removeShutdownHandler();
            delete this.repeater;
            delete this.repeatersManager;
            delete this.repeaterFactory;
        }
    }
    createScan(options) {
        if (!this.repeater) {
            throw new Error('Must be initialized first.');
        }
        return new SecScan_1.SecScan({
            ...options,
            repeaterId: this.repeater.repeaterId
        }, this.configuration.container.resolve(scan_1.ScanFactory), this.configuration.container.resolve(reporter_1.Formatter), this.configuration.container.resolve(reporter_1.Reporter));
    }
    async initConfiguration(configuration) {
        await configuration.loadCredentials();
        await configuration.fetchProjectId();
        configuration.container.register(reporter_1.Formatter, {
            useClass: reporter_1.PlainTextFormatter
        });
        if (process.env.GITHUB_ACTIONS === 'true') {
            configuration.container.register(reporter_1.Reporter, {
                useClass: reporter_1.GitHubCheckRunReporter
            });
        }
        else if (process.env.GITLAB_CI === 'true') {
            configuration.container.register(reporter_1.Reporter, {
                useClass: reporter_1.GitLabReporter
            });
        }
        else if (process.env.BITBUCKET_PIPELINES === 'true') {
            configuration.container.register(reporter_1.Reporter, {
                useClass: reporter_1.BitbucketReporter
            });
        }
        else {
            configuration.container.register(reporter_1.Reporter, {
                useClass: reporter_1.StdReporter
            });
        }
    }
    setupShutdown() {
        SecRunner.SHUTDOWN_SIGNALS.forEach(event => process.once(event, this.beforeShutdownSignalHandler));
    }
    removeShutdownHandler() {
        SecRunner.SHUTDOWN_SIGNALS.forEach(event => process.removeListener(event, this.beforeShutdownSignalHandler));
    }
}
exports.SecRunner = SecRunner;
SecRunner.SHUTDOWN_SIGNALS = [
    'SIGTERM',
    'SIGINT',
    'SIGHUP'
];
//# sourceMappingURL=SecRunner.js.map