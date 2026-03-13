import 'reflect-metadata';
import { BitbucketReporter } from './BitbucketReporter';
import { BitbucketClient, BITBUCKET_CLIENT, BITBUCKET_CONFIG } from './api';
import { fullyDescribedIssue } from '../../__fixtures__/issues';
import { TEST_FILE_PATH_RESOLVER, TestFilePathResolver } from '../../utils';
import { Issue, Scan } from '@sectester/scan';
import { container } from 'tsyringe';
import { anything, instance, mock, reset, verify, when } from 'ts-mockito';
import { writeFile } from 'node:fs/promises';

jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(undefined)
}));

const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

describe('BitbucketReporter', () => {
  let reporter: BitbucketReporter;
  const mockedScan = mock<Scan>();
  const mockedBitbucketClient = mock<BitbucketClient>();
  const mockedTestFilePathResolver = mock<TestFilePathResolver>();

  const mockConfig = {
    token: 'test-token',
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123',
    testReportFilename: 'bb-test-report.xml'
  };

  const mockProxyConfig = {
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123',
    usePipelinesProxy: true,
    proxyUrl: 'http://localhost:29418',
    testReportFilename: 'bb-test-report.xml'
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

    mockedWriteFile.mockClear();

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
      expect(mockedWriteFile).not.toHaveBeenCalled();
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

    it('should write JUnit XML test report to file', async () => {
      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      const [fileName, content, encoding] = mockedWriteFile.mock.calls[0] as [
        string,
        string,
        string
      ];
      expect(fileName).toMatch(/^bb-test-report-.*\.xml$/);
      expect(encoding).toBe('utf-8');
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<testsuites>');
      expect(content).toContain('<testsuite');
      expect(content).toContain('Bright Tests');
      expect(content).toContain('<failure>');
      expect(content).toContain(fullyDescribedIssue.name);
    });

    it('should generate unique filenames for JUnit reports', async () => {
      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      const firstFileName = mockedWriteFile.mock.calls[0][0];

      mockedWriteFile.mockClear();
      reset<Scan>(mockedScan);
      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);

      await reporter.report(instance(mockedScan));

      const secondFileName = mockedWriteFile.mock.calls[0][0];
      expect(firstFileName).not.toBe(secondFileName);
    });

    it('should write JUnit report with multiple issues as test failures', async () => {
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

      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      const content = mockedWriteFile.mock.calls[0][1] as string;
      expect(content).toContain('tests="2"');
      expect(content).toContain('failures="2"');
    });

    it('should use default filename when testReportFilename is not set', async () => {
      container.clearInstances();
      const configWithoutFilename = { ...mockConfig };
      delete (configWithoutFilename as any).testReportFilename;
      container.register(BITBUCKET_CONFIG, {
        useValue: configWithoutFilename
      });
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

      when(mockedScan.issues()).thenResolve([fullyDescribedIssue] as Issue[]);
      when(
        mockedBitbucketClient.createOrUpdateReport(anything(), anything())
      ).thenResolve();
      when(
        mockedBitbucketClient.createAnnotations(anything(), anything())
      ).thenResolve();

      await reporter.report(instance(mockedScan));

      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
      const fileName = mockedWriteFile.mock.calls[0][0] as string;
      expect(fileName).toMatch(/^bb-test-report-.*\.xml$/);
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

      mockedWriteFile.mockClear();

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
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);
    });
  });
});
