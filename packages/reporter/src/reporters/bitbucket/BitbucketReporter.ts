import { Reporter } from '../../lib';
import { BITBUCKET_CLIENT, BITBUCKET_CONFIG } from './api';
import type { BitbucketClient } from './api';
import type { BitbucketConfig } from './types';
import {
  SingleItemReportBuilder,
  MultiItemsReportBuilder,
  BaseReportBuilder
} from './builders';
import { TEST_FILE_PATH_RESOLVER, TestFilePathResolver } from '../../utils';
import { inject, injectable } from 'tsyringe';
import type { Issue, Scan } from '@sectester/scan';

@injectable()
export class BitbucketReporter implements Reporter {
  constructor(
    @inject(BITBUCKET_CONFIG) private readonly config: BitbucketConfig,
    @inject(BITBUCKET_CLIENT) private readonly bitbucketClient: BitbucketClient,
    @inject(TEST_FILE_PATH_RESOLVER)
    private readonly testFilePathResolver: TestFilePathResolver
  ) {
    // Token is only required when NOT using the Pipelines proxy
    // The proxy automatically handles authentication
    if (!this.config.usePipelinesProxy && !this.config.token) {
      throw new Error('Bitbucket token is not set');
    }

    if (!this.config.workspace) {
      throw new Error('Bitbucket workspace is not set');
    }

    if (!this.config.repoSlug) {
      throw new Error('Bitbucket repoSlug is not set');
    }

    if (!this.config.commitSha) {
      throw new Error('Bitbucket commitSha is not set');
    }
  }

  public async report(scan: Scan): Promise<void> {
    const issues = await scan.issues();
    if (issues.length === 0) return;

    const builder = this.createReportBuilder(issues);
    const { report, annotations } = builder.build();
    const reportId = builder.getReportId();

    await this.bitbucketClient.createOrUpdateReport(reportId, report);
    await this.bitbucketClient.createAnnotations(reportId, annotations);
  }

  private createReportBuilder(issues: Issue[]): BaseReportBuilder {
    const testFilePath = this.testFilePathResolver.getTestFilePath();

    return issues.length === 1
      ? new SingleItemReportBuilder(
          issues[0],
          this.config.commitSha,
          testFilePath
        )
      : new MultiItemsReportBuilder(
          issues,
          this.config.commitSha,
          testFilePath
        );
  }
}
