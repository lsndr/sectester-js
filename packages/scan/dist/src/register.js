"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Scans_1 = require("./Scans");
const DefaultScans_1 = require("./DefaultScans");
const ScanFactory_1 = require("./ScanFactory");
const DefaultDiscoveries_1 = require("./DefaultDiscoveries");
const Discoveries_1 = require("./Discoveries");
const tsyringe_1 = require("tsyringe");
const core_1 = require("@sectester/core");
tsyringe_1.container.register(Scans_1.Scans, { useClass: DefaultScans_1.DefaultScans });
tsyringe_1.container.register(Discoveries_1.Discoveries, { useClass: DefaultDiscoveries_1.DefaultDiscoveries });
tsyringe_1.container.register(ScanFactory_1.ScanFactory, {
    useFactory(childContainer) {
        return new ScanFactory_1.ScanFactory(childContainer.resolve(core_1.Configuration));
    }
});
//# sourceMappingURL=register.js.map