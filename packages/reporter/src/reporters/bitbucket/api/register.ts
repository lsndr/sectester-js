import 'reflect-metadata';
import { BITBUCKET_CLIENT } from './BitbucketClient';
import { BITBUCKET_CONFIG } from './BitbucketConfig';
import { BitbucketApiClient } from './BitbucketApiClient';
import { container } from 'tsyringe';

let commitSha: string | undefined;

if (process.env.BITBUCKET_COMMIT) {
  commitSha = process.env.BITBUCKET_COMMIT;
} else if (process.env.BITBUCKET_PR_DESTINATION_COMMIT) {
  commitSha = process.env.BITBUCKET_PR_DESTINATION_COMMIT;
}

// Detect if running in Bitbucket Pipelines
// In Pipelines, we can use the proxy at localhost:29418 for automatic authentication
const usePipelinesProxy = typeof process.env.BITBUCKET_BRANCH === 'string';

// Use BITBUCKET_REPO_OWNER for workspace if BITBUCKET_WORKSPACE is not set
// BITBUCKET_REPO_OWNER is the standard env var in Pipelines
const workspace =
  process.env.BITBUCKET_WORKSPACE || process.env.BITBUCKET_REPO_OWNER;

container.register(BITBUCKET_CONFIG, {
  useValue: {
    commitSha,
    token: process.env.BITBUCKET_TOKEN,
    workspace,
    repoSlug: process.env.BITBUCKET_REPO_SLUG,
    usePipelinesProxy,
    proxyUrl: 'http://localhost:29418',
    testReportFilename:
      process.env.BITBUCKET_TEST_REPORT_FILENAME || 'bb-test-report.xml'
  }
});
container.register(BITBUCKET_CLIENT, { useClass: BitbucketApiClient });
