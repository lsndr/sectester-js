"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchedHttpsProxyAgent = void 0;
const https_proxy_agent_1 = require("https-proxy-agent");
const kTlsUpgradeOptions = Symbol('tlsUpgradeOptions');
// ADHOC: This is a workaround for this issue: https://github.com/TooTallNate/node-https-proxy-agent/issues/89
class PatchedHttpsProxyAgent extends https_proxy_agent_1.HttpsProxyAgent {
    constructor(proxy, opts) {
        super(proxy, opts);
        this[kTlsUpgradeOptions] = opts;
    }
    connect(req, opts) {
        return super.connect(req, { ...this[kTlsUpgradeOptions], ...opts });
    }
}
exports.PatchedHttpsProxyAgent = PatchedHttpsProxyAgent;
//# sourceMappingURL=PatchedHttpsProxyAgent.js.map