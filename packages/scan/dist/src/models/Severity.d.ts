export declare enum Severity {
    CRITICAL = "Critical",
    MEDIUM = "Medium",
    HIGH = "High",
    LOW = "Low"
}
export declare const severityRanges: Map<Severity, Severity[]>;
export declare function severityToNumber(s: Severity): number;
export declare function severityComparator(s1: Severity, s2: Severity): number;
