import { CredentialsOptions } from './Credentials';
export interface CredentialProvider {
    get(): Promise<CredentialsOptions | undefined>;
}
export declare const CredentialProvider: unique symbol;
