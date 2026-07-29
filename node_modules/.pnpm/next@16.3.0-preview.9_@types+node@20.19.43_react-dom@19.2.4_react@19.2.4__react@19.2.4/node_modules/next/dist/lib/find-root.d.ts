export declare function findRootDirAndLockFiles(cwd: string): {
    lockFiles: string[];
    rootDir: string;
};
export declare function warnDuplicatedLockFiles(lockFiles: string[]): void;
