"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestFilePathResolver_1 = require("./TestFilePathResolver");
const JestTestFilePathResolver_1 = require("./JestTestFilePathResolver");
const tsyringe_1 = require("tsyringe");
tsyringe_1.container.registerSingleton(TestFilePathResolver_1.TEST_FILE_PATH_RESOLVER, JestTestFilePathResolver_1.JestTestFilePathResolver);
//# sourceMappingURL=register.js.map