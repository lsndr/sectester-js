import { RepeaterCommands } from './RepeaterCommands';
import { Request, Response, RequestRunner } from '../request-runner';
export declare class DefaultRepeaterCommands implements RepeaterCommands {
    private readonly requestRunners;
    constructor(requestRunners: RequestRunner[]);
    sendRequest(request: Request): Promise<Response>;
}
