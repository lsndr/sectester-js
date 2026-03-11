import { CredentialProvider } from './CredentialsProvider';
import { CredentialsOptions } from './Credentials';
export declare class EnvCredentialProvider implements CredentialProvider {
    get(): Promise<CredentialsOptions | undefined>;
}
