"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const GitHubClient_1 = require("./GitHubClient");
const GitHubConfig_1 = require("./GitHubConfig");
const GitHubApiClient_1 = require("./GitHubApiClient");
const tsyringe_1 = require("tsyringe");
let commitSha;
if (process.env.GITHUB_EVENT_PATH) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const eventData = require(process.env.GITHUB_EVENT_PATH);
    if (process.env.GITHUB_EVENT_NAME === 'check_suite') {
        ({ head_sha: commitSha } = (_a = eventData.check_suite) !== null && _a !== void 0 ? _a : {});
    }
    else if (process.env.GITHUB_EVENT_NAME === 'check_run') {
        ({ head_sha: commitSha } = (_c = (_b = eventData.check_run) === null || _b === void 0 ? void 0 : _b.check_suite) !== null && _c !== void 0 ? _c : {});
    }
    else if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
        commitSha = eventData.pull_request.head.sha;
    }
    else if (process.env.GITHUB_EVENT_NAME === 'push') {
        commitSha = eventData.after;
    }
    else {
        throw new Error('No pull-request and commit data available for the request.');
    }
}
tsyringe_1.container.register(GitHubConfig_1.GITHUB_CONFIG, {
    useValue: {
        commitSha,
        token: process.env.GITHUB_TOKEN,
        repository: process.env.GITHUB_REPOSITORY
    }
});
tsyringe_1.container.register(GitHubClient_1.GITHUB_CLIENT, { useClass: GitHubApiClient_1.GitHubApiClient });
//# sourceMappingURL=register.js.map