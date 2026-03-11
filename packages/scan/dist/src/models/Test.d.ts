export type Test = string | BrokenAccessControlTest;
export type BrokenAccessControlOptions = {
    auth: string;
} | {
    auth: [string, string];
};
export type BrokenAccessControlTest = {
    name: 'broken_access_control';
    options: BrokenAccessControlOptions;
};
