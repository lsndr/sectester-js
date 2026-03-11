import { ReportBuilder, ReportBuildResult } from './ReportBuilder';
import type { ReportAnnotation, AnnotationSeverity } from '../types';
import type { Issue } from '@sectester/scan';
import { Severity } from '@sectester/scan';

export abstract class BaseReportBuilder implements ReportBuilder {
  protected readonly reportId: string;

  constructor(
    protected readonly commitSha: string | undefined,
    protected readonly testFilePath: string
  ) {
    if (!commitSha) {
      throw new Error('Commit SHA is required');
    }
    this.reportId = `sectester-${Date.now()}`;
  }

  public abstract build(): ReportBuildResult;

  public getReportId(): string {
    return this.reportId;
  }

  protected convertIssueToAnnotation(
    issue: Issue,
    index: number
  ): ReportAnnotation {
    const { originalRequest, name, severity, link, details } = issue;
    const method = originalRequest.method?.toUpperCase() ?? 'GET';
    const url = originalRequest.url;

    return {
      external_id: `sectester-${issue.id ?? index}`,
      title: name,
      annotation_type: 'VULNERABILITY',
      summary: `${name} vulnerability found at ${method} ${url}`,
      details,
      result: 'FAILED',
      severity: this.mapSeverity(severity),
      path: this.testFilePath,
      line: 1,
      link
    };
  }

  protected mapSeverity(severity: Severity): AnnotationSeverity {
    switch (severity) {
      case Severity.CRITICAL:
        return 'CRITICAL';
      case Severity.HIGH:
        return 'HIGH';
      case Severity.MEDIUM:
        return 'MEDIUM';
      case Severity.LOW:
        return 'LOW';
      default:
        return 'MEDIUM';
    }
  }
}
