"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const BitbucketClient_1 = require("./BitbucketClient");
const BitbucketConfig_1 = require("./BitbucketConfig");
const BitbucketApiClient_1 = require("./BitbucketApiClient");
const tsyringe_1 = require("tsyringe");
let commitSha;
if (process.env.BITBUCKET_COMMIT) {
    commitSha = process.env.BITBUCKET_COMMIT;
}
else if (process.env.BITBUCKET_PR_DESTINATION_COMMIT) {
    commitSha = process.env.BITBUCKET_PR_DESTINATION_COMMIT;
}
// Detect if running in Bitbucket Pipelines
// In Pipelines, we can use the proxy at localhost:29418 for automatic authentication
const usePipelinesProxy = process.env.BITBUCKET_PIPELINES === 'true';
// Use BITBUCKET_REPO_OWNER for workspace if BITBUCKET_WORKSPACE is not set
// BITBUCKET_REPO_OWNER is the standard env var in Pipelines
const workspace = process.env.BITBUCKET_WORKSPACE || process.env.BITBUCKET_REPO_OWNER;
tsyringe_1.container.register(BitbucketConfig_1.BITBUCKET_CONFIG, {
    useValue: {
        commitSha,
        token: process.env.BITBUCKET_TOKEN,
        workspace,
        repoSlug: process.env.BITBUCKET_REPO_SLUG,
        usePipelinesProxy,
        proxyUrl: usePipelinesProxy ? 'http://localhost:29418' : undefined
    }
});
tsyringe_1.container.register(BitbucketClient_1.BITBUCKET_CLIENT, { useClass: BitbucketApiClient_1.BitbucketApiClient });
//# sourceMappingURL=register.js.map