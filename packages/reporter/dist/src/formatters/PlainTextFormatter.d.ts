import { Formatter } from '../lib';
import { Issue } from '@sectester/scan';
export declare class PlainTextFormatter implements Formatter {
    private readonly BULLET_POINT;
    private readonly NEW_LINE;
    private readonly TABULATION;
    format(issue: Issue): string;
    private generateTemplate;
    private formatExtraInfo;
    private indent;
    private formatList;
    private combineList;
}
