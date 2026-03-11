import { Project, Projects } from './Projects';
import { ApiClient } from './api';
export declare class DefaultProjects implements Projects {
    private readonly client;
    constructor(client: ApiClient);
    getDefaultProject(): Promise<Project>;
}
