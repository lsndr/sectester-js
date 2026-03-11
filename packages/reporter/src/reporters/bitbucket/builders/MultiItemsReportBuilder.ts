import type { Report } from '../types';
import { BaseReportBuilder } from './BaseReportBuilder';
import { ReportBuildResult } from './ReportBuilder';
import type { Issue } from '@sectester/scan';
import { Severity } from '@sectester/scan';

export class MultiItemsReportBuilder extends BaseReportBuilder {
  constructor(
    private readonly issues: Issue[],
    commitSha: string | undefined,
    testFilePath: string
  ) {
    super(commitSha, testFilePath);
  }

  public build(): ReportBuildResult {
    const report = this.buildReport();
    const annotations = this.issues.map((issue, index) =>
      this.convertIssueToAnnotation(issue, index)
    );

    return { report, annotations };
  }

  private buildReport(): Report {
    const severityCounts = this.countSeverities();

    return {
      title: `SecTester (${this.issues.length} issues)`,
      details: this.buildDetails(),
      reporter: 'SecTester',
      report_type: 'SECURITY',
      result: 'FAILED',
      data: [
        {
          title: 'Total Issues',
          type: 'NUMBER',
          value: this.issues.length
        },
        ...(severityCounts[Severity.CRITICAL] > 0
          ? [
              {
                title: 'Critical',
                type: 'NUMBER' as const,
                value: severityCounts[Severity.CRITICAL]
              }
            ]
          : []),
        ...(severityCounts[Severity.HIGH] > 0
          ? [
              {
                title: 'High',
                type: 'NUMBER' as const,
                value: severityCounts[Severity.HIGH]
              }
            ]
          : []),
        ...(severityCounts[Severity.MEDIUM] > 0
          ? [
              {
                title: 'Medium',
                type: 'NUMBER' as const,
                value: severityCounts[Severity.MEDIUM]
              }
            ]
          : []),
        ...(severityCounts[Severity.LOW] > 0
          ? [
              {
                title: 'Low',
                type: 'NUMBER' as const,
                value: severityCounts[Severity.LOW]
              }
            ]
          : [])
      ]
    };
  }

  private countSeverities(): Record<Severity, number> {
    return this.issues.reduce(
      (counts, issue) => {
        counts[issue.severity] = (counts[issue.severity] || 0) + 1;

        return counts;
      },
      {} as Record<Severity, number>
    );
  }

  private buildDetails(): string {
    const severityCounts = this.countSeverities();

    const summaryParts: string[] = [];
    if (severityCounts[Severity.CRITICAL]) {
      summaryParts.push(`${severityCounts[Severity.CRITICAL]} Critical`);
    }
    if (severityCounts[Severity.HIGH]) {
      summaryParts.push(`${severityCounts[Severity.HIGH]} High`);
    }
    if (severityCounts[Severity.MEDIUM]) {
      summaryParts.push(`${severityCounts[Severity.MEDIUM]} Medium`);
    }
    if (severityCounts[Severity.LOW]) {
      summaryParts.push(`${severityCounts[Severity.LOW]} Low`);
    }

    const summary =
      summaryParts.length > 0
        ? `**${summaryParts.join(', ')}** severity issues found`
        : 'No issues found';

    const issuesList = this.issues
      .map(issue => {
        const method = issue.originalRequest.method?.toUpperCase() ?? 'GET';
        const pathname = new URL(issue.originalRequest.url).pathname;

        return `- **${issue.severity}**: ${issue.name} at ${method} ${pathname}`;
      })
      .join('\n');

    return `${summary}\n\n**Vulnerabilities detected:**\n${issuesList}`;
  }
}
