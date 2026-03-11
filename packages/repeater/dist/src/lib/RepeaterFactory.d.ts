import { Repeater } from './Repeater';
import { RepeaterRequestRunnerOptions } from './RepeaterRequestRunnerOptions';
import { RepeaterOptions } from './RepeaterOptions';
import { Configuration } from '@sectester/core';
/**
 *  A factory that is able to create a dedicated instance of the repeater with a bus and other dependencies.
 */
export declare class RepeaterFactory {
    private readonly configuration;
    private readonly MAX_NAME_LENGTH;
    private readonly repeatersManager;
    private readonly runnerOptions;
    constructor(configuration: Configuration);
    createRepeater({ description, disableRandomNameGeneration, namePrefix, ...options }?: RepeaterOptions): Promise<Repeater>;
    createRepeaterFromExisting(repeaterId: string, options?: RepeaterRequestRunnerOptions): Promise<Repeater>;
    private createRepeaterInstance;
    private registerRequestRunners;
    private registerRequestRunnerOptions;
    private generateName;
}
