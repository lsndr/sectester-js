import { MultiItemsReportBuilder } from './MultiItemsReportBuilder';
import {
  fullyDescribedIssue,
  issueWithoutResources
} from '../../../__fixtures__/issues';
import { Issue, Severity } from '@sectester/scan';

describe('MultiItemsReportBuilder', () => {
  const commitSha = 'abc123';
  const testFilePath = 'test.spec.ts';

  describe('constructor', () => {
    it('should throw error if commitSha is not provided', () => {
      expect(
        () =>
          new MultiItemsReportBuilder(
            [fullyDescribedIssue as Issue],
            undefined,
            testFilePath
          )
      ).toThrow('Commit SHA is required');
    });

    it('should create builder with valid parameters', () => {
      expect(
        () =>
          new MultiItemsReportBuilder(
            [fullyDescribedIssue as Issue],
            commitSha,
            testFilePath
          )
      ).not.toThrow();
    });
  });

  describe('build', () => {
    it('should build report with title containing issue count', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.title).toBe('SecTester (2 issues)');
    });

    it('should build report with SECURITY type', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.report_type).toBe('SECURITY');
    });

    it('should build report with FAILED result', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.result).toBe('FAILED');
    });

    it('should build report with SecTester as reporter', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.reporter).toBe('SecTester');
    });

    it('should build report with data field for total issues', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.data).toBeDefined();
      const totalField = report.data?.find(d => d.title === 'Total Issues');
      expect(totalField).toBeDefined();
      expect(totalField?.value).toBe(2);
    });

    it('should build report with data fields for severity counts', () => {
      const mediumIssue = { ...fullyDescribedIssue, severity: Severity.MEDIUM };
      const highIssue = { ...fullyDescribedIssue, severity: Severity.HIGH };
      const issues = [mediumIssue as Issue, highIssue as Issue];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.data).toBeDefined();

      const mediumField = report.data?.find(d => d.title === 'Medium');
      expect(mediumField).toBeDefined();
      expect(mediumField?.value).toBe(1);

      const highField = report.data?.find(d => d.title === 'High');
      expect(highField).toBeDefined();
      expect(highField?.value).toBe(1);
    });

    it('should not include severity count data if count is zero', () => {
      const mediumIssue = { ...fullyDescribedIssue, severity: Severity.MEDIUM };
      const issues = [mediumIssue as Issue, mediumIssue as Issue];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.data).toBeDefined();

      const criticalField = report.data?.find(d => d.title === 'Critical');
      expect(criticalField).toBeUndefined();

      const highField = report.data?.find(d => d.title === 'High');
      expect(highField).toBeUndefined();

      const lowField = report.data?.find(d => d.title === 'Low');
      expect(lowField).toBeUndefined();
    });

    it('should build report with details containing severity summary', () => {
      const mediumIssue = { ...fullyDescribedIssue, severity: Severity.MEDIUM };
      const highIssue = { ...fullyDescribedIssue, severity: Severity.HIGH };
      const issues = [mediumIssue as Issue, highIssue as Issue];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).toContain('1 High');
      expect(report.details).toContain('1 Medium');
      expect(report.details).toContain('severity issues found');
    });

    it('should build report with details containing vulnerabilities list', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { report } = builder.build();

      expect(report.details).toContain('Vulnerabilities detected');
      expect(report.details).toContain(fullyDescribedIssue.name);
    });

    it('should create annotations for each issue', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations).toHaveLength(2);
    });

    it('should create annotations with VULNERABILITY type', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].annotation_type).toBe('VULNERABILITY');
      expect(annotations[1].annotation_type).toBe('VULNERABILITY');
    });

    it('should create annotations with FAILED result', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].result).toBe('FAILED');
      expect(annotations[1].result).toBe('FAILED');
    });

    it('should create annotations with test file path', () => {
      const issues = [
        fullyDescribedIssue as Issue,
        issueWithoutResources as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].path).toBe(testFilePath);
      expect(annotations[1].path).toBe(testFilePath);
    });

    it('should create annotations with unique external IDs', () => {
      const issue1 = { ...fullyDescribedIssue, id: 'unique-id-1' } as Issue;
      const issue2 = { ...issueWithoutResources, id: 'unique-id-2' } as Issue;
      const issues = [issue1, issue2];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].external_id).not.toBe(annotations[1].external_id);
    });

    it('should map severity correctly for each annotation', () => {
      const criticalIssue = {
        ...fullyDescribedIssue,
        severity: Severity.CRITICAL
      };
      const highIssue = { ...fullyDescribedIssue, severity: Severity.HIGH };
      const mediumIssue = { ...fullyDescribedIssue, severity: Severity.MEDIUM };
      const lowIssue = { ...fullyDescribedIssue, severity: Severity.LOW };
      const issues = [
        criticalIssue as Issue,
        highIssue as Issue,
        mediumIssue as Issue,
        lowIssue as Issue
      ];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const { annotations } = builder.build();

      expect(annotations[0].severity).toBe('CRITICAL');
      expect(annotations[1].severity).toBe('HIGH');
      expect(annotations[2].severity).toBe('MEDIUM');
      expect(annotations[3].severity).toBe('LOW');
    });
  });

  describe('getReportId', () => {
    it('should return a report ID starting with sectester', () => {
      const issues = [fullyDescribedIssue as Issue];
      const builder = new MultiItemsReportBuilder(
        issues,
        commitSha,
        testFilePath
      );

      const reportId = builder.getReportId();

      expect(reportId).toMatch(/^sectester-\d+$/);
    });
  });
});
