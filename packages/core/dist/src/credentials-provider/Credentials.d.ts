export interface CredentialsOptions {
    readonly token: string;
}
export declare class Credentials {
    private readonly TOKEN_VALIDATION_REGEXP;
    private _token;
    get token(): string;
    constructor({ token }: CredentialsOptions);
}
