"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueFound = void 0;
const core_1 = require("@sectester/core");
class IssueFound extends core_1.SecTesterError {
    constructor(issue, formatter) {
        super(`Target is vulnerable\n\n${formatter.format(issue)}`);
        this.issue = issue;
    }
}
exports.IssueFound = IssueFound;
//# sourceMappingURL=IssueFound.js.map