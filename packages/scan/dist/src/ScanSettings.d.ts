import { AttackParamLocation, Test } from './models';
import { Target, TargetOptions } from './target';
export interface ScanSettingsOptions {
    tests: Test[];
    target: Target | TargetOptions;
    name?: string;
    repeaterId?: string;
    smart?: boolean;
    poolSize?: number;
    requestsRateLimit?: number;
    skipStaticParams?: boolean;
    attackParamLocations?: AttackParamLocation[];
    /**
     * Star metadata to be passed to the scan.
     * @internal
     */
    starMetadata?: Record<string, unknown>;
}
export declare class ScanSettings implements ScanSettingsOptions {
    private _starMetadata?;
    get starMetadata(): Record<string, unknown> | undefined;
    private set starMetadata(value);
    private _name;
    get name(): string;
    private set name(value);
    private _repeaterId?;
    get repeaterId(): string | undefined;
    private set repeaterId(value);
    private _skipStaticParams;
    get skipStaticParams(): boolean;
    private set skipStaticParams(value);
    private _smart;
    get smart(): boolean;
    set smart(value: boolean);
    private _target;
    get target(): Target;
    private set target(value);
    private _poolSize;
    get poolSize(): number;
    private set poolSize(value);
    private _requestsRateLimit;
    get requestsRateLimit(): number;
    private set requestsRateLimit(value);
    private _tests;
    get tests(): Test[];
    private set tests(value);
    private _attackParamLocations;
    get attackParamLocations(): AttackParamLocation[];
    private set attackParamLocations(value);
    constructor({ name, tests, target, repeaterId, smart, starMetadata, requestsRateLimit, // automatic rate limiting
    poolSize, // up to 2x more than default pool size
    skipStaticParams, attackParamLocations }: ScanSettingsOptions);
    private resolveAttackParamLocations;
    private detectAttackParamLocations;
}
