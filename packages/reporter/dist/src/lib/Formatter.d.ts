import { Issue } from '@sectester/scan';
export interface Formatter {
    format(issue: Issue): string;
}
export declare const Formatter: unique symbol;
