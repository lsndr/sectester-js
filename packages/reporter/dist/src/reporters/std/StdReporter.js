"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdReporter = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../../utils");
const scan_1 = require("@sectester/scan");
const tty_table_1 = tslib_1.__importDefault(require("tty-table"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
class StdReporter {
    constructor() {
        this.severityColorFn = {
            [scan_1.Severity.CRITICAL]: chalk_1.default.redBright,
            [scan_1.Severity.HIGH]: chalk_1.default.red,
            [scan_1.Severity.MEDIUM]: chalk_1.default.yellow,
            [scan_1.Severity.LOW]: chalk_1.default.blue
        };
        this.severityPrintFn = {
            /* eslint-disable no-console */
            [scan_1.Severity.CRITICAL]: console.error,
            [scan_1.Severity.HIGH]: console.error,
            [scan_1.Severity.MEDIUM]: console.warn,
            [scan_1.Severity.LOW]: console.log
            /* eslint-enable no-console */
        };
    }
    async report(scan) {
        const issues = await scan.issues();
        if (!issues.length) {
            return;
        }
        [scan_1.Severity.CRITICAL, scan_1.Severity.HIGH, scan_1.Severity.MEDIUM, scan_1.Severity.LOW].forEach((severity) => {
            const message = this.formatFindingsMessage(issues, severity);
            if (message) {
                this.print(message, severity);
            }
        });
        // eslint-disable-next-line no-console
        console.log(this.renderDetailsTable(issues));
    }
    formatFindingsMessage(issues, severity) {
        const filtered = issues.filter(issue => issue.severity === severity);
        if (filtered.length) {
            return this.colorize(`Found ${filtered.length} ${severity} severity ${this.pluralize('issue', filtered.length)}.`, severity);
        }
    }
    renderDetailsTable(issues) {
        const issueGroups = utils_1.IssuesGrouper.group(issues);
        return (0, tty_table_1.default)([
            this.getHeaderConfig('severity', {
                formatter: x => this.colorize(x, x),
                width: 12
            }),
            this.getHeaderConfig('name'),
            this.getHeaderConfig('issues', {
                alias: 'Quantity',
                formatter: items => items.length,
                align: 'center',
                width: 12
            }),
            this.getHeaderConfig('issues', {
                alias: 'Targets',
                formatter: (items) => items
                    .map((item, idx) => `${idx + 1}.\u00A0${item.request.url}`)
                    .join('\n')
            })
        ], issueGroups).render();
    }
    getHeaderConfig(fieldName, options = {}) {
        const defaultHeaderConfig = {
            width: '',
            headerColor: '',
            align: 'left',
            headerAlign: 'left',
            value: fieldName,
            alias: `${fieldName.charAt(0).toUpperCase()}${fieldName.substring(1)}`
        };
        return {
            ...defaultHeaderConfig,
            ...options
        };
    }
    pluralize(word, quantity) {
        return quantity > 1 ? `${word}s` : word;
    }
    colorize(message, severity) {
        return this.severityColorFn[severity](message);
    }
    print(message, severity) {
        return this.severityPrintFn[severity](message);
    }
}
exports.StdReporter = StdReporter;
//# sourceMappingURL=StdReporter.js.map