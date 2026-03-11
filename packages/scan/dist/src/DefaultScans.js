"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultScans = void 0;
const tslib_1 = require("tslib");
const tsyringe_1 = require("tsyringe");
const core_1 = require("@sectester/core");
const ci_info_1 = tslib_1.__importDefault(require("ci-info"));
let DefaultScans = class DefaultScans {
    constructor(configuration, client) {
        this.configuration = configuration;
        this.client = client;
    }
    async createScan(config) {
        const response = await this.client.request('/api/v1/scans', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                ...this.convertToBackendFormat(config),
                info: {
                    source: 'utlib',
                    provider: ci_info_1.default.name,
                    client: {
                        name: this.configuration.name,
                        version: this.configuration.version
                    }
                }
            })
        });
        const result = (await response.json());
        return result;
    }
    async listIssues(id) {
        const response = await this.client.request(`/api/v1/scans/${id}/issues`);
        const issues = (await response.json());
        return issues.map(x => ({
            ...x,
            time: new Date(x.time),
            link: `${this.configuration.baseURL}/scans/${id}/issues/${x.id}`
        }));
    }
    async stopScan(id) {
        try {
            await this.client.request(`/api/v1/scans/${id}/stop`);
        }
        catch (error) {
            if (error instanceof core_1.ApiError && error.response.status === 404) {
                return;
            }
            throw error;
        }
    }
    async deleteScan(id) {
        try {
            await this.client.request(`/api/v1/scans/${id}`, {
                method: 'DELETE'
            });
        }
        catch (error) {
            if (error instanceof core_1.ApiError && error.response.status === 404) {
                return;
            }
            throw error;
        }
    }
    async getScan(id) {
        const response = await this.client.request(`/api/v1/scans/${id}`);
        const result = (await response.json());
        return result;
    }
    convertToBackendFormat(config) {
        if (!config.tests) {
            return { ...config };
        }
        const mapped = config.tests.map(test => this.mapTest(test));
        const tests = mapped.map(t => t.name);
        const testMetadata = mapped.reduce((acc, { metadata }) => {
            if (!metadata)
                return acc;
            if (!acc)
                return metadata;
            return {
                ...acc,
                ...metadata
            };
        }, undefined);
        return { ...config, tests, ...(testMetadata && { testMetadata }) };
    }
    mapTest(test) {
        if (typeof test === 'string') {
            return { name: test };
        }
        switch (test.name) {
            case 'broken_access_control':
                return this.mapBrokenAccessControl(test);
            default:
                throw new Error(`Unsupported configurable test: ${test.name}`);
        }
    }
    mapBrokenAccessControl(test) {
        const { auth } = test.options;
        const authObjectId = typeof auth === 'string' ? [null, auth] : [auth[0], auth[1]];
        return {
            name: test.name,
            metadata: {
                broken_access_control: {
                    authObjectId
                }
            }
        };
    }
};
exports.DefaultScans = DefaultScans;
exports.DefaultScans = DefaultScans = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(1, (0, tsyringe_1.inject)(core_1.ApiClient)),
    tslib_1.__metadata("design:paramtypes", [core_1.Configuration, Object])
], DefaultScans);
//# sourceMappingURL=DefaultScans.js.map