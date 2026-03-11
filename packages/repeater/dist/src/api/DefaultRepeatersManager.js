"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRepeatersManager = void 0;
const tslib_1 = require("tslib");
const tsyringe_1 = require("tsyringe");
const core_1 = require("@sectester/core");
let DefaultRepeatersManager = class DefaultRepeatersManager {
    constructor(client) {
        this.client = client;
    }
    async getRepeater(repeaterId) {
        const response = await this.client.request(`/api/v1/repeaters/${repeaterId}`);
        const repeater = (await response.json());
        return { repeaterId: repeater.id };
    }
    async createRepeater({ projectId, ...options }) {
        const response = await this.client.request('/api/v1/repeaters', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                ...options,
                ...(projectId ? { projectIds: [projectId] } : {})
            })
        });
        const repeater = (await response.json());
        return { repeaterId: repeater.id };
    }
    async deleteRepeater(repeaterId) {
        try {
            await this.client.request(`/api/v1/repeaters/${repeaterId}`, {
                method: 'DELETE'
            });
        }
        catch (error) {
            if (error instanceof core_1.ApiError && error.response.status === 404) {
                return;
            }
            throw error;
        }
    }
};
exports.DefaultRepeatersManager = DefaultRepeatersManager;
exports.DefaultRepeatersManager = DefaultRepeatersManager = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(core_1.ApiClient)),
    tslib_1.__metadata("design:paramtypes", [Object])
], DefaultRepeatersManager);
//# sourceMappingURL=DefaultRepeatersManager.js.map