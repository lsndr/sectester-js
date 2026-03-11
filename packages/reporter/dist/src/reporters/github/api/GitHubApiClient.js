"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubApiClient = void 0;
const tslib_1 = require("tslib");
const GitHubConfig_1 = require("./GitHubConfig");
const tsyringe_1 = require("tsyringe");
let GitHubApiClient = class GitHubApiClient {
    constructor(config) {
        this.config = config;
    }
    async createCheckRun(payload) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${this.config.token}`,
                'accept': 'application/vnd.github.v3+json',
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        const res = await fetch(`https://api.github.com/repos/${this.config.repository}/check-runs`, requestOptions);
        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }
    }
};
exports.GitHubApiClient = GitHubApiClient;
exports.GitHubApiClient = GitHubApiClient = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(GitHubConfig_1.GITHUB_CONFIG)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GitHubApiClient);
//# sourceMappingURL=GitHubApiClient.js.map