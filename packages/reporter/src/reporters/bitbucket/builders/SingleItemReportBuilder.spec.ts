import { SingleItemReportBuilder } from './SingleItemReportBuilder';
import {
  fullyDescribedIssue,
  issueWithoutResources
} from '../../../__fixtures__/issues';
import { Issue } from '@sectester/scan';

describe('SingleItemReportBuilder', () => {
  const commitSha = 'abc123';
  const testFilePath = 'test.spec.ts';

  describe('constructor', () => {
    it('should throw error if commitSha is not provided', () => {
      expect(
        () =>
          new SingleItemReportBuilder(
            fullyDescribedIssue as Issue,
            undefined,
            testFilePath
          )
      ).toThrow('Commit SHA is required');
    });

    it('should create builder with valid parameters', () => {
      expect(
        () =>
          new SingleItemReportBuilder(
            fullyDescribedIssue as Issue,
            commitSha,
            testFilePath
          )
      ).not.toThrow();
    });
  });

  describe('build', () => {
    it('should build report with correct title', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.title).toContain('SecTester');
      expect(report.title).toContain('GET');
    });

    it('should build report with SECURITY type', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.report_type).toBe('SECURITY');
    });

    it('should build report with FAILED result', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.result).toBe('FAILED');
    });

    it('should build report with SecTester as reporter', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.reporter).toBe('SecTester');
    });

    it('should build report with link to Bright UI', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.link).toBe(fullyDescribedIssue.link);
    });

    it('should build report with data fields', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.data).toBeDefined();
      expect(report.data?.length).toBeGreaterThan(0);

      const vulnerabilityField = report.data?.find(
        d => d.title === 'Vulnerability'
      );
      expect(vulnerabilityField).toBeDefined();
      expect(vulnerabilityField?.value).toBe(fullyDescribedIssue.name);

      const severityField = report.data?.find(d => d.title === 'Severity');
      expect(severityField).toBeDefined();
      expect(severityField?.value).toBe(fullyDescribedIssue.severity);
    });

    it('should build report with details containing issue information', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).toContain(fullyDescribedIssue.name);
      expect(report.details).toContain(fullyDescribedIssue.severity);
      expect(report.details).toContain(fullyDescribedIssue.remedy);
      expect(report.details).toContain(fullyDescribedIssue.details);
    });

    it('should build report with extra details from comments', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).toContain('Extra Details');
      expect(report.details).toContain(
        fullyDescribedIssue.comments?.[0].headline
      );
    });

    it('should build report with references from resources', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).toContain('References');
      expect(report.details).toContain(fullyDescribedIssue.resources?.[0]);
    });

    it('should build report without extra details when no comments', () => {
      const builder = new SingleItemReportBuilder(
        issueWithoutResources as Issue,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).not.toContain('Extra Details');
    });

    it('should create exactly one annotation', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations).toHaveLength(1);
    });

    it('should create annotation with VULNERABILITY type', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].annotation_type).toBe('VULNERABILITY');
    });

    it('should create annotation with FAILED result', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].result).toBe('FAILED');
    });

    it('should create annotation with correct severity mapping', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].severity).toBe('MEDIUM');
    });

    it('should create annotation with test file path', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].path).toBe(testFilePath);
    });

    it('should create annotation with link to Bright UI', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].link).toBe(fullyDescribedIssue.link);
    });

    it('should create annotation with summary containing vulnerability info', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].summary).toContain(fullyDescribedIssue.name);
      expect(annotations[0].summary).toContain('GET');
    });
  });

  describe('getReportId', () => {
    it('should return a report ID starting with sectester', () => {
      const builder = new SingleItemReportBuilder(
        fullyDescribedIssue as Issue,
        commitSha,
        testFilePath
      );

      const reportId = builder.getReportId();

      expect(reportId).toMatch(/^sectester-\d+$/);
    });
  });
});
