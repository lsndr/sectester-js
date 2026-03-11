"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.severityRanges = exports.Severity = void 0;
exports.severityToNumber = severityToNumber;
exports.severityComparator = severityComparator;
var Severity;
(function (Severity) {
    Severity["CRITICAL"] = "Critical";
    Severity["MEDIUM"] = "Medium";
    Severity["HIGH"] = "High";
    Severity["LOW"] = "Low";
})(Severity || (exports.Severity = Severity = {}));
exports.severityRanges = new Map(Object.values(Severity).map(severity => {
    switch (severity) {
        case Severity.MEDIUM:
            return [severity, [Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL]];
        case Severity.HIGH:
            return [severity, [Severity.HIGH, Severity.CRITICAL]];
        case Severity.CRITICAL:
            return [severity, [Severity.CRITICAL]];
        case Severity.LOW:
            return [severity, Object.values(Severity)];
    }
}));
function severityToNumber(s) {
    switch (s) {
        case Severity.LOW:
            return 1;
        case Severity.MEDIUM:
            return 2;
        case Severity.HIGH:
            return 3;
        case Severity.CRITICAL:
            return 4;
        default:
            throw new Error('Unknown severity value');
    }
}
function severityComparator(s1, s2) {
    return severityToNumber(s2) - severityToNumber(s1);
}
//# sourceMappingURL=Severity.js.map