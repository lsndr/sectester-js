import type { Report } from '../types';
import { BaseReportBuilder } from './BaseReportBuilder';
import { ReportBuildResult } from './ReportBuilder';
import type { Comment, Issue } from '@sectester/scan';

export class SingleItemReportBuilder extends BaseReportBuilder {
  constructor(
    private readonly issue: Issue,
    commitSha: string | undefined,
    testFilePath: string
  ) {
    super(commitSha, testFilePath);
  }

  public build(): ReportBuildResult {
    const report = this.buildReport();
    const annotations = [this.convertIssueToAnnotation(this.issue, 0)];

    return { report, annotations };
  }

  private buildReport(): Report {
    return {
      title: `SecTester - ${this.buildEndpoint()}`,
      details: this.buildDetails(),
      reporter: 'SecTester',
      report_type: 'SECURITY',
      result: 'FAILED',
      link: this.issue.link,
      data: [
        {
          title: 'Vulnerability',
          type: 'TEXT',
          value: this.issue.name
        },
        {
          title: 'Severity',
          type: 'TEXT',
          value: this.issue.severity
        },
        {
          title: 'View in Bright',
          type: 'LINK',
          value: {
            text: 'Open in Bright UI',
            href: this.issue.link
          }
        }
      ]
    };
  }

  private buildEndpoint(): string {
    const method = this.issue.originalRequest.method?.toUpperCase() ?? 'GET';
    const pathname = new URL(this.issue.originalRequest.url).pathname;

    return `${method} ${pathname}`;
  }

  private buildDetails(): string {
    const parts = [
      `**${this.issue.name}** found at ${this.buildEndpoint()}`,
      '',
      `**Severity:** ${this.issue.severity}`,
      '',
      '**Remediation:**',
      this.issue.remedy,
      '',
      '**Details:**',
      this.issue.details
    ];

    if (this.issue.comments?.length) {
      parts.push('', '**Extra Details:**');
      for (const comment of this.issue.comments) {
        parts.push(this.formatIssueComment(comment));
      }
    }

    if (this.issue.resources?.length) {
      parts.push('', '**References:**');
      for (const resource of this.issue.resources) {
        parts.push(`- ${resource}`);
      }
    }

    return parts.join('\n');
  }

  private formatIssueComment({
    headline,
    text = '',
    links = []
  }: Comment): string {
    const parts = [`- **${headline}**`];

    if (text) {
      parts.push(`  ${text}`);
    }

    if (links.length > 0) {
      parts.push('  Links:');
      for (const link of links) {
        parts.push(`  - ${link}`);
      }
    }

    return parts.join('\n');
  }
}
