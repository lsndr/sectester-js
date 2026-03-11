"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainTextFormatter = void 0;
const util_1 = require("util");
class PlainTextFormatter {
    constructor() {
        this.BULLET_POINT = '●';
        this.NEW_LINE = '\n';
        this.TABULATION = '\t';
    }
    format(issue) {
        const { link, name, severity, remedy, details, comments = [], resources = [] } = issue;
        const template = this.generateTemplate({
            extraInfo: comments.length > 0,
            references: resources.length > 0
        });
        const message = (0, util_1.format)(template, link, name, severity, remedy, details, this.formatList(comments, comment => this.formatExtraInfo(comment)), this.formatList(resources));
        return message.trim();
    }
    generateTemplate(options) {
        return `
Issue in Bright UI:   %s
Name:                 %s
Severity:             %s
Remediation:
%s
Details:
%s${options.extraInfo ? `\nExtra Details:\n%s` : ''}${options.references ? `\nReferences:\n%s` : ''}`.trim();
    }
    formatExtraInfo({ headline, text = '', links = [] }) {
        const footer = links.length
            ? this.combineList(['Links:', this.formatList(links)])
            : '';
        const blocks = [text, footer].map(x => this.indent(x));
        const document = this.combineList(blocks);
        return this.combineList([headline, document]);
    }
    indent(x, length = 1) {
        const lines = x.split(this.NEW_LINE);
        return this.combineList(lines.map(line => `${this.TABULATION.repeat(length)}${line}`));
    }
    formatList(list, map) {
        const items = list.map(x => `${this.BULLET_POINT} ${typeof map == 'function' ? map(x) : x}`);
        return this.combineList(items);
    }
    combineList(list, sep) {
        return list.join(sep !== null && sep !== void 0 ? sep : this.NEW_LINE);
    }
}
exports.PlainTextFormatter = PlainTextFormatter;
//# sourceMappingURL=PlainTextFormatter.js.map