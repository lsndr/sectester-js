import { Request, Response } from '../request-runner';
export interface RepeaterCommands {
    sendRequest(request: Request): Promise<Response>;
}
export declare const RepeaterCommands: unique symbol;
