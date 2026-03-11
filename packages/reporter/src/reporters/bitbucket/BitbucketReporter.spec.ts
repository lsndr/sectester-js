import 'reflect-metadata';
import { BitbucketReporter } from './BitbucketReporter';
import { BitbucketClient, BITBUCKET_CLIENT, BITBUCKET_CONFIG } from './api';
import { fullyDescribedIssue } from '../../__fixtures__/issues';
import { TEST_FILE_PATH_RESOLVER, TestFilePathResolver } from '../../utils';
import { Issue, Scan } from '@sectester/scan';
import { container } from 'tsyringe';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';

describe('BitbucketReporter', () => {
  let reporter: BitbucketReporter;
  const mockedScan = mock<Scan>();
  const mockedBitbucketClient = mock<BitbucketClient>();
  const mockedTestFilePathResolver = mock<TestFilePathResolver>();

  const mockConfig = {
    token: 'test-token',
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123'
  };

  const mockProxyConfig = {
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123',
    usePipelinesProxy: true,
    proxyUrl: 'http://localhost:29418'
  };

  beforeEach(() => {
    container.clearInstances();

    container.register(BITBUCKET_CONFIG, { useValue: mockConfig });
    container.register(BITBUCKET_CLIENT, {
      useValue: instance(mockedBitbucketClient)
    });
    container.register(TEST_FILE_PATH_RESOLVER, {
      useValue: instance(mockedTestFilePathResolver)
    });

    when(mockedTestFilePathResolver.getTestFilePath()).thenReturn(
      'test.spec.ts'
    );

    reporter = container.resolve(BitbucketReporter);
  });

  afterEach(() => {
    reset<Scan>(mockedScan);
    reset<BitbucketClient>(mockedBitbucketClient);
    reset<TestFilePathResolver>(mockedTestFilePathResolver);
  });

  describe('constructor', () => {
    it('should throw error if token is not set and not using proxy', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockConfig, token: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket token is not set');
    });

    it('should not throw error if token is not set but using Pipelines proxy', () => {
      expect(
        () =>
          new BitbucketReporter(
            mockProxyConfig,
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).not.toThrow();
    });

    it('should throw error if workspace is not set', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockConfig, workspace: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket workspace is not set');
    });

    it('should throw error if repoSlug is not set', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockConfig, repoSlug: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket repoSlug is not set');
    });

    it('should throw error if commitSha is not set', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockConfig, commitSha: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket commitSha is not set');
    });

    it('should throw error if workspace is not set when using proxy', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockProxyConfig, workspace: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket workspace is not set');
    });

    it('should throw error if repoSlug is not set when using proxy', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockProxyConfig, repoSlug: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket repoSlug is not set');
    });

    it('should throw error if commitSha is not set when using proxy', () => {
      expect(
        () =>
          new BitbucketReporter(
            { ...mockProxyConfig, commitSha: '' },
            instance(mockedBitbucketClient),
            instance(mockedTestFilePathResolver)
          )
      ).toThrow('Bitbucket commitSha is not set');
    });
  });

  describe('report', () => {
    it('should not create report if there are no issues', async () => {
      when(mockedScan.issues()).thenResolve([]);

      await reporter.report(instance(mockedScan));

      verify(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).never();
      verify(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).never();
    });

    it('should create report with single issue', async () => {
      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      verify(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).once();
      verify(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).once();
    });

    it('should create report with multiple issues', async () => {
      when(mockedScan.issues()).thenResolve([
        fullyDescribedIssue,
        fullyDescribedIssue
      ] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      verify(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).once();
      verify(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).once();
    });
  });

  describe('report with proxy config', () => {
    beforeEach(() => {
      container.clearInstances();

      container.register(BITBUCKET_CONFIG, { useValue: mockProxyConfig });
      container.register(BITBUCKET_CLIENT, {
        useValue: instance(mockedBitbucketClient)
      });
      container.register(TEST_FILE_PATH_RESOLVER, {
        useValue: instance(mockedTestFilePathResolver)
      });

      when(mockedTestFilePathResolver.getTestFilePath()).thenReturn(
        'test.spec.ts'
      );

      reporter = container.resolve(BitbucketReporter);
    });

    it('should create report when using Pipelines proxy without token', async () => {
      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      verify(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).once();
      verify(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).once();
    });
  });
});
