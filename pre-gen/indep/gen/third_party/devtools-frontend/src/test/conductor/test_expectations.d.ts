export type ExpectationResult = 'Failure' | 'Pass' | 'Skip';
export interface Expectation {
    /** The original line. If this is a comment or empty, other fields are undefined. */
    line: string;
    isCommentOrEmpty?: boolean;
    bugs?: string[];
    platforms?: string[];
    testName?: string;
    results?: ExpectationResult[];
}
export declare const parseExpectations: (content: string) => Expectation[];
export declare const serializeExpectations: (expectations: Expectation[]) => string;
export declare function getExpectedResults(testId: string): ExpectationResult[] | undefined;
export declare function isExpectedResult({ exactTestId, success, skipped }: {
    exactTestId: string;
    success: boolean;
    skipped: boolean;
}): boolean;
export declare function getSkippedTests(): string[];
