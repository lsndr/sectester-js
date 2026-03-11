export interface GitHubConfig {
    token?: string;
    repository?: string;
    commitSha?: string;
}
export declare const GITHUB_CONFIG: unique symbol;
