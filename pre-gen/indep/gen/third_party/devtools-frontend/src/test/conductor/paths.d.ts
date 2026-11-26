export declare const SOURCE_ROOT: string;
export declare const CHECKOUT_ROOT: string;
export declare const BUILD_ROOT: string;
export declare const GEN_DIR: string;
export declare const BUILD_WITH_CHROMIUM: boolean;
export declare const TEST_ID_REGEX: RegExp;
export declare function isContainedInDirectory(contained: string, directory: string): boolean;
export declare class PathPair {
    readonly sourcePath: string;
    readonly buildPath: string;
    protected constructor(sourcePath: string, buildPath: string);
    static get(pathname: string): PathPair | null;
}
export declare class TestId<Pair extends PathPair = PathPair> {
    readonly pathPair: Pair;
    readonly subTestId?: string;
    protected constructor(pathPair: Pair, subTestId?: string);
    toBuildTestId(): string;
    static create(testId: string): TestId<PathPair> | null;
}
export declare function defaultChromePath(): string;
