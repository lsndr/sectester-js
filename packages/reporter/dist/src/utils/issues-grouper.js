"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesGrouper = void 0;
const scan_1 = require("@sectester/scan");
class IssuesGrouper {
    static group(issues) {
        const grouped = issues.reduce((res, issue) => {
            const issuesGroup = res.find((group) => group.severity === issue.severity && group.name === issue.name);
            if (issuesGroup) {
                issuesGroup.issues.push(issue);
            }
            else {
                res.push({
                    severity: issue.severity,
                    name: issue.name,
                    issues: [issue]
                });
            }
            return res;
        }, []);
        grouped.sort(this.groupComparator);
        return grouped;
    }
    static groupComparator(a, b) {
        const res = (0, scan_1.severityComparator)(a.severity, b.severity);
        return res ? res : b.issues.length - a.issues.length;
    }
}
exports.IssuesGrouper = IssuesGrouper;
//# sourceMappingURL=issues-grouper.js.map