import { IssuesGroup } from '../models';
import { Issue } from '@sectester/scan';
export declare class IssuesGrouper {
    static group(issues: Issue[]): IssuesGroup[];
    static groupComparator(a: IssuesGroup, b: IssuesGroup): number;
}
