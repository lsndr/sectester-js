export interface BitbucketConfig {
  token?: string;
  workspace?: string;
  repoSlug?: string;
  commitSha?: string;
  /**
   * Whether to use the Bitbucket Pipelines proxy for authentication.
   * When running in Bitbucket Pipelines, requests can be sent through
   * a proxy at localhost:29418 which automatically adds authentication.
   */
  usePipelinesProxy?: boolean;
  /**
   * The proxy URL to use for Bitbucket Pipelines authentication.
   * Defaults to 'http://localhost:29418' when usePipelinesProxy is true.
   */
  proxyUrl?: string;
  /**
   * The filename for the JUnit test report XML file.
   * Defaults to 'bb-test-report.xml'.
   */
  testReportFilename?: string;
}

export const BITBUCKET_CONFIG = Symbol('BITBUCKET_CONFIG');
