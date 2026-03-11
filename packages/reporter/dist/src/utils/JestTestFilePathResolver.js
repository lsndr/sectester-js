"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JestTestFilePathResolver = void 0;
const tslib_1 = require("tslib");
const tsyringe_1 = require("tsyringe");
const node_path_1 = require("node:path");
let JestTestFilePathResolver = class JestTestFilePathResolver {
    getTestFilePath() {
        var _a, _b;
        // Check if running in Jest environment
        const jestState = (_b = (_a = global.expect) === null || _a === void 0 ? void 0 : _a.getState) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (jestState) {
            const testPath = jestState.testPath;
            const rootDir = jestState.snapshotState._rootDir;
            return (0, node_path_1.join)((0, node_path_1.basename)(rootDir), (0, node_path_1.relative)(rootDir, testPath));
        }
        // Relies on `TestContext` from Node.js built-in test runner appearing in the stack
        const matchRes = String(new Error().stack).match(/\n\s+at (?:async )?TestContext.* \((.*):\d+:\d+\)\n/);
        return (matchRes === null || matchRes === void 0 ? void 0 : matchRes[1])
            ? (0, node_path_1.relative)(process.cwd(), matchRes[1] || '')
            : 'unknown';
    }
};
exports.JestTestFilePathResolver = JestTestFilePathResolver;
exports.JestTestFilePathResolver = JestTestFilePathResolver = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], JestTestFilePathResolver);
//# sourceMappingURL=JestTestFilePathResolver.js.map