"use strict";
var DefaultDiscoveries_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDiscoveries = void 0;
const tslib_1 = require("tslib");
const tsyringe_1 = require("tsyringe");
const core_1 = require("@sectester/core");
let DefaultDiscoveries = DefaultDiscoveries_1 = class DefaultDiscoveries {
    constructor(configuration, client) {
        this.configuration = configuration;
        this.client = client;
    }
    async createEntrypoint(target, repeaterId) {
        const payload = {
            repeaterId,
            authObjectId: target.auth,
            request: {
                method: target.method,
                url: target.url,
                headers: target.headers,
                body: await target.text()
            }
        };
        const requestOptions = {
            signal: AbortSignal.timeout(DefaultDiscoveries_1.REQUEST_TIMEOUT),
            body: JSON.stringify(payload),
            headers: { 'content-type': 'application/json' }
        };
        try {
            const response = await this.client.request(`/api/v2/projects/${this.configuration.projectId}/entry-points`, { ...requestOptions, handle409Redirects: false, method: 'POST' });
            const data = (await response.json());
            return data;
        }
        catch (error) {
            if (this.isConflictError(error)) {
                return this.handleConflictError(error, requestOptions);
            }
            throw error;
        }
    }
    isConflictError(error) {
        if (!(error instanceof core_1.ApiError) || error.response.status !== 409) {
            return false;
        }
        const location = error.response.headers.get('location');
        return !!location && location.trim() !== '';
    }
    async handleConflictError(error, requestOptions) {
        const location = error.response.headers.get('location');
        try {
            await this.client.request(location, {
                ...requestOptions,
                method: 'PUT'
            });
            const response = await this.client.request(location);
            const data = (await response.json());
            return data;
        }
        catch (putError) {
            if (putError instanceof core_1.ApiError) {
                throw new Error(`Failed to update existing entrypoint at ${location}: ${putError.message}`);
            }
            throw putError;
        }
    }
};
exports.DefaultDiscoveries = DefaultDiscoveries;
DefaultDiscoveries.REQUEST_TIMEOUT = 120000;
exports.DefaultDiscoveries = DefaultDiscoveries = DefaultDiscoveries_1 = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(1, (0, tsyringe_1.inject)(core_1.ApiClient)),
    tslib_1.__metadata("design:paramtypes", [core_1.Configuration, Object])
], DefaultDiscoveries);
//# sourceMappingURL=DefaultDiscoveries.js.map