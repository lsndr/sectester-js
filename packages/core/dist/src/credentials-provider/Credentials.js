"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credentials = void 0;
class Credentials {
    get token() {
        return this._token;
    }
    constructor({ token }) {
        this.TOKEN_VALIDATION_REGEXP = /^[A-Za-z0-9+/=]{7}\.nex[apr]\.[A-Za-z0-9+/=]{32}$/;
        if (!token) {
            throw new Error('Provide an API key.');
        }
        if (!this.TOKEN_VALIDATION_REGEXP.test(token)) {
            throw new Error('Unable to recognize the API key.');
        }
        this._token = token;
    }
}
exports.Credentials = Credentials;
//# sourceMappingURL=Credentials.js.map