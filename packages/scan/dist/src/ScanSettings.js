"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanSettings = void 0;
const models_1 = require("./models");
const target_1 = require("./target");
const core_1 = require("@sectester/core");
class ScanSettings {
    get starMetadata() {
        return this._starMetadata;
    }
    set starMetadata(value) {
        this._starMetadata = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (value.length > 200) {
            throw new Error('Name must be less than 200 characters.');
        }
        this._name = value;
    }
    get repeaterId() {
        return this._repeaterId;
    }
    set repeaterId(value) {
        this._repeaterId = value;
    }
    get skipStaticParams() {
        return this._skipStaticParams;
    }
    set skipStaticParams(value) {
        this._skipStaticParams = !!value;
    }
    get smart() {
        return this._smart;
    }
    set smart(value) {
        this._smart = !!value;
    }
    get target() {
        return this._target;
    }
    set target(value) {
        this._target = new target_1.Target(value);
    }
    get poolSize() {
        return this._poolSize;
    }
    set poolSize(value) {
        if (!(0, core_1.checkBoundaries)(value, { min: 1, max: 50 })) {
            throw new Error('Invalid pool size.');
        }
        this._poolSize = value;
    }
    get requestsRateLimit() {
        return this._requestsRateLimit;
    }
    set requestsRateLimit(value) {
        if (!(0, core_1.checkBoundaries)(value, { min: 0, max: 1000 })) {
            throw new Error('Invalid requests rate limit.');
        }
        this._requestsRateLimit = value;
    }
    get tests() {
        return this._tests;
    }
    set tests(value) {
        if (value.length < 1) {
            throw new Error('Please provide at least one test.');
        }
        const simpleTests = new Set();
        const configurableTests = [];
        const seenTestConfigurations = new Set();
        for (const test of value) {
            const testName = typeof test === 'string' ? test : test.name;
            if (typeof test === 'string') {
                simpleTests.add(test);
                continue;
            }
            if (seenTestConfigurations.has(testName) || simpleTests.has(testName)) {
                throw new Error(`Please remove a duplicate for the ${testName} test`);
            }
            seenTestConfigurations.add(testName);
            configurableTests.push(test);
        }
        this._tests = [...simpleTests, ...configurableTests];
    }
    get attackParamLocations() {
        return this._attackParamLocations;
    }
    set attackParamLocations(value) {
        if (!(0, core_1.contains)(models_1.AttackParamLocation, value)) {
            throw new Error('Unknown attack param location supplied.');
        }
        this._attackParamLocations = this.resolveAttackParamLocations(value);
    }
    constructor({ name, tests, target, repeaterId, smart = true, starMetadata, requestsRateLimit = 0, // automatic rate limiting
    poolSize = 50, // up to 2x more than default pool size
    skipStaticParams = true, attackParamLocations = [] }) {
        this.target = target;
        const { method, parsedURL } = this.target;
        this.name = name || (0, core_1.truncate)(`${method} ${parsedURL.pathname}`, 200);
        this.poolSize = poolSize;
        this.requestsRateLimit = requestsRateLimit;
        this.repeaterId = repeaterId;
        this.skipStaticParams = skipStaticParams;
        this.smart = smart;
        this.tests = tests;
        this.attackParamLocations = attackParamLocations;
        this.starMetadata = starMetadata;
    }
    resolveAttackParamLocations(providedLocations) {
        if (providedLocations.length > 0) {
            return [...new Set(providedLocations)];
        }
        const detectedLocations = this.detectAttackParamLocations();
        // Use default locations if none detected
        return detectedLocations.length > 0
            ? detectedLocations
            : [
                models_1.AttackParamLocation.BODY,
                models_1.AttackParamLocation.QUERY,
                models_1.AttackParamLocation.FRAGMENT
            ];
    }
    detectAttackParamLocations() {
        const locations = [];
        const hasBody = this.target.body !== undefined &&
            this.target.method !== models_1.HttpMethod.GET &&
            this.target.method !== models_1.HttpMethod.HEAD;
        if (hasBody) {
            locations.push(models_1.AttackParamLocation.BODY);
        }
        if (this.target.query) {
            locations.push(models_1.AttackParamLocation.QUERY);
        }
        if (this.target.fragment) {
            locations.push(models_1.AttackParamLocation.FRAGMENT);
        }
        return locations;
    }
}
exports.ScanSettings = ScanSettings;
//# sourceMappingURL=ScanSettings.js.map