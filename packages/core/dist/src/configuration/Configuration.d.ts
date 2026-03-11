import { CredentialProvider, Credentials, CredentialsOptions } from '../credentials-provider';
import { LogLevel } from '../logger';
export interface ConfigurationOptions {
    hostname?: string;
    projectId?: string;
    logLevel?: LogLevel;
    credentials?: Credentials | CredentialsOptions;
    credentialProviders?: CredentialProvider[];
}
export declare class Configuration {
    private readonly SCHEMA_REGEXP;
    private readonly HOSTNAME_NORMALIZATION_REGEXP;
    private _fetchProjectIdPromise?;
    private _loadCredentialsPromise?;
    private _credentialProviders?;
    get credentialProviders(): readonly CredentialProvider[] | undefined;
    private _container;
    get container(): import("tsyringe").DependencyContainer;
    private _credentials?;
    get credentials(): Credentials;
    private _projectId?;
    get projectId(): string;
    private _baseURL;
    get baseURL(): string;
    private _logLevel?;
    get logLevel(): LogLevel | undefined;
    get version(): string;
    get name(): string;
    constructor({ hostname, credentials, projectId, logLevel, credentialProviders }: ConfigurationOptions);
    fetchProjectId(): Promise<void>;
    loadCredentials(): Promise<void>;
    private resolveUrls;
}
