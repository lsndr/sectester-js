"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionScanTarget = void 0;
const tslib_1 = require("tslib");
const fastify_1 = tslib_1.__importDefault(require("fastify"));
class FunctionScanTarget {
    constructor() {
        this.server = (0, fastify_1.default)();
    }
    async start(fn) {
        this.server.post('/', (request, reply) => this.handleRequest(request, reply, fn));
        const url = await this.server.listen({ port: 0, host: '127.0.0.1' });
        return { url };
    }
    async stop() {
        await this.server.close();
    }
    async handleRequest(request, reply, fn) {
        try {
            const result = await fn(request.body);
            await reply.send(result !== null && result !== void 0 ? result : '');
        }
        catch (err) {
            await reply.status(500).send(err);
        }
    }
}
exports.FunctionScanTarget = FunctionScanTarget;
//# sourceMappingURL=FunctionScanTarget.js.map