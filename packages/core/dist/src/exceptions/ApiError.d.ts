import { SecTesterError } from './SecTesterError';
export declare class ApiError extends SecTesterError {
    readonly response: Response;
    constructor(response: Response, message?: string);
}
