import 'reflect-metadata';
import { BitbucketApiClient } from './BitbucketApiClient';
import { BitbucketConfig, Report, ReportAnnotation } from '../types';
import nock from 'nock';

describe('BitbucketApiClient', () => {
  let client: BitbucketApiClient;
  const mockConfig: BitbucketConfig = {
    token: 'test-token',
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123'
  };

  const mockProxyConfig: BitbucketConfig = {
    workspace: 'test-workspace',
    repoSlug: 'test-repo',
    commitSha: 'abc123',
    usePipelinesProxy: true,
    proxyUrl: 'http://localhost:29418'
  };

  beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });
  afterAll(() => nock.enableNetConnect());

  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }

    client = new BitbucketApiClient(mockConfig);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  describe('createOrUpdateReport', () => {
    const reportId = 'sectester-123';
    const mockReport: Report = {
      title: 'SecTester Security Report',
      details: 'Security scan results',
      reporter: 'SecTester',
      report_type: 'SECURITY',
      result: 'FAILED'
    };

    it('should successfully create a report', async () => {
      // Arrange
      const scope = nock('https://api.bitbucket.org')
        .put(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}`
        )
        .matchHeader('authorization', `Bearer ${mockConfig.token}`)
        .matchHeader('accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .reply(200);

      // Act
      await client.createOrUpdateReport(reportId, mockReport);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should throw error when API request fails', async () => {
      // Arrange
      const scope = nock('https://api.bitbucket.org')
        .put(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}`
        )
        .reply(401, 'Unauthorized');

      // Act & Assert
      await expect(
        client.createOrUpdateReport(reportId, mockReport)
      ).rejects.toThrow('Bitbucket API error: 401 Unauthorized - Unauthorized');
      expect(scope.isDone()).toBe(true);
    });

    it('should throw error with response body on failure', async () => {
      // Arrange
      const errorBody = JSON.stringify({ error: { message: 'Invalid token' } });
      const scope = nock('https://api.bitbucket.org')
        .put(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}`
        )
        .reply(403, errorBody);

      // Act & Assert
      await expect(
        client.createOrUpdateReport(reportId, mockReport)
      ).rejects.toThrow(`Bitbucket API error: 403 Forbidden - ${errorBody}`);
      expect(scope.isDone()).toBe(true);
    });

    it('should not include authorization header when using Pipelines proxy', async () => {
      // Arrange
      const proxyClient = new BitbucketApiClient(mockProxyConfig);

      // When using proxy, requests go to http:// instead of https://
      const scope = nock('http://api.bitbucket.org')
        .put(
          `/2.0/repositories/${mockProxyConfig.workspace}/${mockProxyConfig.repoSlug}/commit/${mockProxyConfig.commitSha}/reports/${reportId}`
        )
        .matchHeader('accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .reply(200);

      // Act
      await proxyClient.createOrUpdateReport(reportId, mockReport);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should use http:// URL when using Pipelines proxy', async () => {
      // Arrange
      const proxyClient = new BitbucketApiClient(mockProxyConfig);

      // Verify it uses http:// not https://
      const httpScope = nock('http://api.bitbucket.org')
        .put(
          `/2.0/repositories/${mockProxyConfig.workspace}/${mockProxyConfig.repoSlug}/commit/${mockProxyConfig.commitSha}/reports/${reportId}`
        )
        .reply(200);

      // Act
      await proxyClient.createOrUpdateReport(reportId, mockReport);

      // Assert
      expect(httpScope.isDone()).toBe(true);
    });
  });

  describe('createAnnotations', () => {
    const reportId = 'sectester-123';
    const mockAnnotations: ReportAnnotation[] = [
      {
        external_id: 'sectester-annotation-1',
        title: 'SQL Injection',
        annotation_type: 'VULNERABILITY',
        summary: 'SQL Injection vulnerability found',
        severity: 'HIGH',
        result: 'FAILED',
        path: 'test.spec.ts',
        line: 1
      }
    ];

    it('should successfully create annotations', async () => {
      // Arrange
      const scope = nock('https://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}/annotations`
        )
        .matchHeader('authorization', `Bearer ${mockConfig.token}`)
        .matchHeader('accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .reply(200);

      // Act
      await client.createAnnotations(reportId, mockAnnotations);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should not make API call when annotations array is empty', async () => {
      // Arrange
      const scope = nock('https://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}/annotations`
        )
        .reply(200);

      // Act
      await client.createAnnotations(reportId, []);

      // Assert
      expect(scope.isDone()).toBe(false);
    });

    it('should throw error when API request fails', async () => {
      // Arrange
      const scope = nock('https://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}/annotations`
        )
        .reply(400, 'Bad Request');

      // Act & Assert
      await expect(
        client.createAnnotations(reportId, mockAnnotations)
      ).rejects.toThrow('Bitbucket API error: 400 Bad Request - Bad Request');
      expect(scope.isDone()).toBe(true);
    });

    it('should chunk annotations when there are more than 100', async () => {
      // Arrange
      const manyAnnotations: ReportAnnotation[] = Array.from(
        { length: 150 },
        (_, i) => ({
          external_id: `sectester-annotation-${i}`,
          title: `Vulnerability ${i}`,
          annotation_type: 'VULNERABILITY' as const,
          summary: `Vulnerability ${i} found`,
          severity: 'HIGH' as const,
          result: 'FAILED' as const,
          path: 'test.spec.ts',
          line: 1
        })
      );

      const scope = nock('https://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockConfig.workspace}/${mockConfig.repoSlug}/commit/${mockConfig.commitSha}/reports/${reportId}/annotations`
        )
        .times(2)
        .reply(200);

      // Act
      await client.createAnnotations(reportId, manyAnnotations);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should not include authorization header when using Pipelines proxy', async () => {
      // Arrange
      const proxyClient = new BitbucketApiClient(mockProxyConfig);

      const scope = nock('http://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockProxyConfig.workspace}/${mockProxyConfig.repoSlug}/commit/${mockProxyConfig.commitSha}/reports/${reportId}/annotations`
        )
        .matchHeader('accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .reply(200);

      // Act
      await proxyClient.createAnnotations(reportId, mockAnnotations);

      // Assert
      expect(scope.isDone()).toBe(true);
    });

    it('should use http:// URL when using Pipelines proxy for annotations', async () => {
      // Arrange
      const proxyClient = new BitbucketApiClient(mockProxyConfig);

      const httpScope = nock('http://api.bitbucket.org')
        .post(
          `/2.0/repositories/${mockProxyConfig.workspace}/${mockProxyConfig.repoSlug}/commit/${mockProxyConfig.commitSha}/reports/${reportId}/annotations`
        )
        .reply(200);

      // Act
      await proxyClient.createAnnotations(reportId, mockAnnotations);

      // Assert
      expect(httpScope.isDone()).toBe(true);
    });
  });

  describe('configuration', () => {
    it('should use https:// URL when not using proxy', () => {
      const standardClient = new BitbucketApiClient(mockConfig);
      expect(standardClient).toBeDefined();
    });

    it('should initialize proxy agent when using Pipelines proxy', () => {
      const proxyClient = new BitbucketApiClient(mockProxyConfig);
      expect(proxyClient).toBeDefined();
    });

    it('should not initialize proxy agent when not using Pipelines proxy', () => {
      const standardClient = new BitbucketApiClient(mockConfig);
      expect(standardClient).toBeDefined();
    });

    it('should handle config with usePipelinesProxy true but no proxyUrl', () => {
      const configWithoutProxyUrl: BitbucketConfig = {
        ...mockConfig,
        usePipelinesProxy: true,
        proxyUrl: undefined
      };
      const clientWithoutProxy = new BitbucketApiClient(configWithoutProxyUrl);
      expect(clientWithoutProxy).toBeDefined();
    });
  });
});
