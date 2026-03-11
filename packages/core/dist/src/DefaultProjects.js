"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultProjects = void 0;
const tslib_1 = require("tslib");
const api_1 = require("./api");
const tsyringe_1 = require("tsyringe");
let DefaultProjects = class DefaultProjects {
    constructor(client) {
        this.client = client;
    }
    async getDefaultProject() {
        const filters = new URLSearchParams();
        filters.set('predefined', true.toString());
        const response = await this.client.request(`/api/v2/projects?${filters.toString()}`);
        const { items: [project] } = (await response.json());
        if (!project) {
            throw new Error('No default project found');
        }
        return project;
    }
};
exports.DefaultProjects = DefaultProjects;
exports.DefaultProjects = DefaultProjects = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)(api_1.ApiClient)),
    tslib_1.__metadata("design:paramtypes", [Object])
], DefaultProjects);
//# sourceMappingURL=DefaultProjects.js.map