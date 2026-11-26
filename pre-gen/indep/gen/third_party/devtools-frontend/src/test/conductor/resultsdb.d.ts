import type { ArtifactGroup } from './screenshot-error.js';
/**
 * This type mirrors test_result.proto but it might fall behind.
 * TODO(liviurau): Update at convenient times.
 * https://source.chromium.org/chromium/infra/infra/+/main:go/src/go.chromium.org/luci/resultdb/sink/proto/v1/test_result.proto
 **/
export interface TestResult {
    testId?: string;
    testIdStructured?: {
        moduleName: string;
        moduleScheme: string;
        coarseName: string;
        fineName: string;
        caseNameComponents: string[];
    };
    expected?: boolean;
    status?: 'PASS' | 'FAIL' | 'SKIP' | 'CRASH' | 'ABORT';
    summaryHtml?: string;
    duration?: string;
    tags?: Array<{
        key: string;
        value: string;
    }>;
    artifacts?: ArtifactGroup;
    testMetadata?: {
        name: string;
        location?: {
            repo: string;
            fileName: string;
        };
    };
}
export type SanitizedTestId = string & {
    _sanitizedTag?: string;
};
/**
 * ResultSink checks the testId against the regex /^[[print]]{1,512}$/:
 * https://source.chromium.org/chromium/infra/infra/+/main:go/src/go.chromium.org/luci/resultdb/pbutil/test_result.go;l=43;drc=7ba090da753a71be5a0f37785558e9102e57fa10
 *
 * This function removes non-printable characters and truncates the string
 * to the max allowed length.
 **/
export declare function sanitizedTestId(rawTestId: string): SanitizedTestId;
export declare function buildTestProperties(exactTestId: string, coarseName: string, fineName: string, caseName: string): {
    testId: SanitizedTestId;
    testIdStructured: {
        moduleName: string;
        moduleScheme: string;
        coarseName: string;
        fineName: string;
        caseNameComponents: string[];
    };
    testMetadata: {
        name: string;
        location: {
            repo: string;
            fileName: string;
        };
    };
};
export declare function available(): boolean;
/**
 * Call at the end of a test suite. Will send all `TestResult`s collected via
 * `recordTestResult` to the ResultSink endpoint (only if available).
 **/
export declare function sendTestResult(results: TestResult): void;
