"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const lib_1 = require("./lib");
const request_runner_1 = require("./request-runner");
const api_1 = require("./api");
const utils_1 = require("./utils");
const tsyringe_1 = require("tsyringe");
const core_1 = require("@sectester/core");
tsyringe_1.container.register(request_runner_1.RequestRunner, {
    useClass: request_runner_1.HttpRequestRunner
});
tsyringe_1.container.register(request_runner_1.RequestRunnerOptions, {
    useValue: {
        timeout: 30000,
        maxContentLength: 100,
        reuseConnection: false,
        allowedMimes: [
            'text/html',
            'text/plain',
            'text/css',
            'text/javascript',
            'text/markdown',
            'text/xml',
            'application/javascript',
            'application/x-javascript',
            'application/json',
            'application/xml',
            'application/x-www-form-urlencoded',
            'application/msgpack',
            'application/ld+json',
            'application/graphql'
        ]
    }
});
tsyringe_1.container.register(lib_1.RepeaterFactory, {
    useFactory(childContainer) {
        return new lib_1.RepeaterFactory(childContainer.resolve(core_1.Configuration));
    }
});
tsyringe_1.container.register(lib_1.DefaultRepeaterServerOptions, {
    useFactory: (childContainer) => {
        const configuration = childContainer.resolve(core_1.Configuration);
        return {
            uri: `${configuration.baseURL}/workstations`,
            token: configuration.credentials.token,
            connectTimeout: 10000
        };
    }
});
tsyringe_1.container.register(utils_1.ProxyFactory, { useClass: utils_1.DefaultProxyFactory });
tsyringe_1.container.register(lib_1.RepeaterServer, { useClass: lib_1.DefaultRepeaterServer });
tsyringe_1.container.register(lib_1.RepeaterCommands, { useClass: lib_1.DefaultRepeaterCommands });
tsyringe_1.container.register(api_1.RepeatersManager, { useClass: api_1.DefaultRepeatersManager });
//# sourceMappingURL=register.js.map