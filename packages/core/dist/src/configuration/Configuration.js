"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const credentials_provider_1 = require("../credentials-provider");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const package_json_1 = require("../../package.json");
const Projects_1 = require("../Projects");
const tsyringe_1 = require("tsyringe");
class Configuration {
    get credentialProviders() {
        return this._credentialProviders;
    }
    get container() {
        return this._container;
    }
    get credentials() {
        if (!this._credentials) {
            throw new Error('Please provide credentials or try to load them using `loadCredentials()`.');
        }
        return this._credentials;
    }
    get projectId() {
        if (!this._projectId) {
            throw new Error('Please provide a project ID or call `fetchProjectId()` to use the default project.');
        }
        return this._projectId;
    }
    get baseURL() {
        return this._baseURL;
    }
    get logLevel() {
        return this._logLevel;
    }
    get version() {
        return package_json_1.version;
    }
    get name() {
        return package_json_1.secTester.name;
    }
    constructor({ hostname, credentials, projectId, logLevel = logger_1.LogLevel.ERROR, credentialProviders = [new credentials_provider_1.EnvCredentialProvider()] }) {
        this.SCHEMA_REGEXP = /^.+:\/\//;
        this.HOSTNAME_NORMALIZATION_REGEXP = /^(?!(?:\w+:)?\/\/)|^\/\//;
        this._container = tsyringe_1.container.createChildContainer();
        if (!credentials && !(credentialProviders === null || credentialProviders === void 0 ? void 0 : credentialProviders.length)) {
            throw new Error(`Please provide either 'credentials' or 'credentialProviders'`);
        }
        if (credentials) {
            this._credentials = new credentials_provider_1.Credentials(credentials);
        }
        this._credentialProviders = credentialProviders;
        this.resolveUrls(hostname ? hostname : 'app.brightsec.com');
        this._projectId = projectId;
        this._logLevel = logLevel;
        this._container.register(Configuration, { useValue: this });
    }
    async fetchProjectId() {
        if (this._projectId) {
            return;
        }
        if (!this._fetchProjectIdPromise) {
            this._fetchProjectIdPromise = (async () => {
                try {
                    const projects = this.container.resolve(Projects_1.Projects);
                    const { id } = await projects.getDefaultProject();
                    this._projectId = id;
                }
                catch (error) {
                    this._fetchProjectIdPromise = undefined;
                    throw error;
                }
            })();
        }
        await this._fetchProjectIdPromise;
    }
    async loadCredentials() {
        if (this._credentials) {
            return;
        }
        if (!this._loadCredentialsPromise) {
            this._loadCredentialsPromise = (async () => {
                var _a;
                try {
                    const chain = ((_a = this.credentialProviders) !== null && _a !== void 0 ? _a : []).map(provider => provider.get());
                    const credentials = await (0, utils_1.first)(chain, val => !!val);
                    if (!credentials) {
                        throw new Error('Could not load credentials from any providers');
                    }
                    this._credentials = new credentials_provider_1.Credentials(credentials);
                }
                catch (error) {
                    this._loadCredentialsPromise = undefined;
                    throw error;
                }
            })();
        }
        await this._loadCredentialsPromise;
    }
    resolveUrls(hostname) {
        if (!this.SCHEMA_REGEXP.test(hostname)) {
            hostname = hostname.replace(this.HOSTNAME_NORMALIZATION_REGEXP, 'https://');
        }
        try {
            ({ hostname } = new URL(hostname));
        }
        catch {
            throw new Error(`Please make sure that you pass correct 'hostname' option.`);
        }
        if (['localhost', '127.0.0.1'].includes(hostname)) {
            this._baseURL = `http://${hostname}:8000`;
        }
        else {
            this._baseURL = `https://${hostname}`;
        }
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map