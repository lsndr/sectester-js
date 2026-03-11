"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const api_1 = require("./api");
const configuration_1 = require("./configuration");
const logger_1 = require("./logger");
const DefaultProjects_1 = require("./DefaultProjects");
const Projects_1 = require("./Projects");
const tsyringe_1 = require("tsyringe");
tsyringe_1.container.register(logger_1.Logger, {
    useFactory: (0, tsyringe_1.instancePerContainerCachingFactory)((child) => child.isRegistered(configuration_1.Configuration, true)
        ? new logger_1.Logger(child.resolve(configuration_1.Configuration).logLevel)
        : new logger_1.Logger())
});
tsyringe_1.container.register(api_1.ApiClient, {
    useFactory(childContainer) {
        const configuration = childContainer.resolve(configuration_1.Configuration);
        return new api_1.FetchApiClient({
            baseUrl: configuration.baseURL,
            apiKey: configuration.credentials.token,
            userAgent: `${configuration.name}/${configuration.version}`
        });
    }
});
tsyringe_1.container.register(Projects_1.Projects, {
    useClass: DefaultProjects_1.DefaultProjects
}, {
    lifecycle: tsyringe_1.Lifecycle.ContainerScoped
});
//# sourceMappingURL=register.js.map