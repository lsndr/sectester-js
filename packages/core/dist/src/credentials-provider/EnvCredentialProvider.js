"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvCredentialProvider = void 0;
class EnvCredentialProvider {
    // eslint-disable-next-line @typescript-eslint/require-await
    async get() {
        const token = process.env.BRIGHT_TOKEN;
        return token ? { token } : undefined;
    }
}
exports.EnvCredentialProvider = EnvCredentialProvider;
//# sourceMappingURL=EnvCredentialProvider.js.map