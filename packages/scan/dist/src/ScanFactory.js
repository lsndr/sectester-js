"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanFactory = void 0;
const Scans_1 = require("./Scans");
const Scan_1 = require("./Scan");
const ScanSettings_1 = require("./ScanSettings");
const target_1 = require("./target");
const Discoveries_1 = require("./Discoveries");
const core_1 = require("@sectester/core");
class ScanFactory {
    constructor(configuration) {
        this.configuration = configuration;
        this.container = this.configuration.container.createChildContainer();
        this.scans = this.container.resolve(Scans_1.Scans);
        this.discoveries = this.container.resolve(Discoveries_1.Discoveries);
        this.logger = this.container.resolve(core_1.Logger);
    }
    async createScan(settings, options = {}) {
        const config = await this.createScanConfig(new ScanSettings_1.ScanSettings(settings));
        const { id } = await this.scans.createScan(config);
        return new Scan_1.Scan({ id, logger: this.logger, scans: this.scans, ...options });
    }
    async createScanConfig({ name, tests, target, repeaterId, smart, poolSize, requestsRateLimit, skipStaticParams, attackParamLocations, starMetadata }) {
        const { id: entrypointId } = await this.discoveries.createEntrypoint(new target_1.Target(target), repeaterId);
        return {
            name,
            smart,
            poolSize,
            requestsRateLimit,
            skipStaticParams,
            starMetadata,
            projectId: this.configuration.projectId,
            entryPointIds: [entrypointId],
            attackParamLocations: [...attackParamLocations],
            tests: [...tests],
            repeaters: repeaterId ? [repeaterId] : undefined
        };
    }
}
exports.ScanFactory = ScanFactory;
//# sourceMappingURL=ScanFactory.js.map