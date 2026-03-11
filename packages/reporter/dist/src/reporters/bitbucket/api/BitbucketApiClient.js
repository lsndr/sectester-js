"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitbucketApiClient = void 0;
const tslib_1 = require("tslib");
const BitbucketConfig_1 = require("./BitbucketConfig");
const http_proxy_agent_1 = require("http-proxy-agent");
const tsyringe_1 = require("tsyringe");
let BitbucketApiClient = class BitbucketApiClient {
    constructor(config) {
        this.config = config;
        if (this.config.usePipelinesProxy && this.config.proxyUrl) {
            this.proxyAgent = new http_proxy_agent_1.HttpProxyAgent(this.config.proxyUrl);
        }
    }
    async createOrUpdateReport(reportId, report) {
        const url = this.buildUrl(`/repositories/${this.config.workspace}/${this.config.repoSlug}/commit/${this.config.commitSha}/reports/${reportId}`);
        const res = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(report),
            ...(this.proxyAgent && { dispatcher: this.proxyAgent })
        });
        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Bitbucket API error: ${res.status} ${res.statusText} - ${errorBody}`);
        }
    }
    async createAnnotations(reportId, annotations) {
        if (annotations.length === 0) {
            return;
        }
        const url = this.buildUrl(`/repositories/${this.config.workspace}/${this.config.repoSlug}/commit/${this.config.commitSha}/reports/${reportId}/annotations`);
        // Bitbucket API allows up to 100 annotations per request
        const chunks = this.chunkArray(annotations, 100);
        for (const chunk of chunks) {
            const res = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(chunk),
                ...(this.proxyAgent && { dispatcher: this.proxyAgent })
            });
            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`Bitbucket API error: ${res.status} ${res.statusText} - ${errorBody}`);
            }
        }
    }
    buildUrl(path) {
        // When using the Pipelines proxy, use http:// instead of https://
        // The proxy handles authentication automatically
        const baseUrl = this.config.usePipelinesProxy
            ? 'http://api.bitbucket.org/2.0'
            : 'https://api.bitbucket.org/2.0';
        return `${baseUrl}${path}`;
    }
    getHeaders() {
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        };
        // Only add authorization header when not using the Pipelines proxy
        // The proxy automatically adds authentication
        if (!this.config.usePipelinesProxy && this.config.token) {
            headers['authorization'] = `Bearer ${this.config.token}`;
        }
        return headers;
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
};
exports.BitbucketApiClient = BitbucketApiClient;
exports.BitbucketApiClient = BitbucketApiClient = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(BitbucketConfig_1.BITBUCKET_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], BitbucketApiClient);
//# sourceMappingURL=BitbucketApiClient.js.map