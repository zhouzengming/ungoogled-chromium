// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Mocha from 'mocha';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { formatFailedTestsSummary, generateExactTestId } from '../../front_end/testing/TestIdGeneration.js';
import * as DiffUtils from '../conductor/diff-utils.js';
import { GEN_DIR, SOURCE_ROOT } from '../conductor/paths.js';
import * as ResultsDb from '../conductor/resultsdb.js';
import { ScreenshotError, } from '../conductor/screenshot-error.js';
import { TestConfig } from '../conductor/test_config.js';
import { isExpectedResult } from '../conductor/test_expectations.js';
const { EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_PASS, EVENT_TEST_RETRY, EVENT_TEST_PENDING, } = Mocha.Runner.constants;
function getErrorMessage(error) {
    if (error instanceof Error) {
        if (error.cause) {
            // TypeScript types error.cause as {}, which doesn't allow us to access
            // properties on it or check for them. So we have to cast it to allow us
            // to read the `message` property.
            const cause = error.cause;
            const causeMessage = cause.message || '';
            return `${error.message}\n${causeMessage}`;
        }
        return error.stack ?? error.message;
    }
    return `${error}`;
}
export class ResultsDbReporter extends Mocha.reporters.Base {
    suitePrefix;
    n = 0;
    expectedFailuresCount = 0;
    unexpectedPassesCount = 0;
    failedTestIds = new Set();
    htmlResult;
    localResultsPath() {
        return !ResultsDb.available() && this.suitePrefix ? path.join(GEN_DIR, 'test', this.suitePrefix, 'results.html') :
            undefined;
    }
    constructor(runner, options) {
        super(runner, options);
        // `reportOptions` doesn't work with .mocharc.js (configuring via exports).
        // BUT, every module.exports is forwarded onto the options object.
        this.suitePrefix = options?.suiteName;
        const localResults = this.localResultsPath();
        if (localResults) {
            fs.mkdirSync(path.dirname(localResults), { recursive: true });
            this.htmlResult = fs.createWriteStream(localResults, {});
        }
        runner.on(EVENT_TEST_PASS, this.onTestPass.bind(this));
        runner.on(EVENT_TEST_FAIL, this.onTestFail.bind(this));
        runner.on(EVENT_TEST_RETRY, this.onTestFail.bind(this));
        runner.on(EVENT_TEST_PENDING, this.onTestSkip.bind(this));
        runner.once(EVENT_RUN_END, this.epilogue.bind(this));
    }
    onTestPass(test) {
        const { exactTestId } = generateExactTestId(GEN_DIR, test.file, test.titlePath(), SOURCE_ROOT);
        this.failedTestIds.delete(exactTestId);
        const isExpected = isExpectedResult({ exactTestId, success: true, skipped: false });
        if (!isExpected) {
            this.unexpectedPassesCount++;
            process.stdout.write(`\n[TestExpectations] Unexpected pass: ${exactTestId}\n`);
        }
        if (!TestConfig.isAiAgent) {
            process.stdout.write(`[PASS] ${exactTestId} ${test.duration}ms\n`);
        }
        const testResult = this.buildDefaultTestResultFrom(test);
        testResult.status = 'PASS';
        testResult.expected = isExpected;
        // @ts-expect-error state exists on non-hosted conductor tests.
        const devToolsPage = test.parent?.state?.devToolsPage;
        if (devToolsPage) {
            testResult.artifacts = ScreenshotError.saveArtifacts(devToolsPage.screenshotLog);
        }
        ResultsDb.sendTestResult(testResult);
    }
    onTestFail(test, error) {
        let targetTest;
        const isHook = test.type === 'hook';
        if (isHook) {
            if (!test.ctx?.currentTest) {
                throw new Error(`Hook ${test.id} is missing currentTest`);
            }
            targetTest = test.ctx.currentTest;
        }
        else {
            targetTest = test;
        }
        const { exactTestId } = generateExactTestId(GEN_DIR, targetTest.file, targetTest.titlePath(), SOURCE_ROOT);
        const isExpected = isExpectedResult({ exactTestId, success: false, skipped: false });
        if (isExpected) {
            this.expectedFailuresCount++;
            process.stdout.write(`\n[TestExpectations] Expected failure: ${exactTestId}\n`);
        }
        else {
            this.failedTestIds.add(exactTestId);
        }
        if (!TestConfig.isAiAgent) {
            this.n++;
            process.stdout.write(`[FAIL] ${exactTestId} ${targetTest.duration}ms\n`);
        }
        const testResult = this.buildDefaultTestResultFrom(targetTest);
        testResult.status = 'FAIL';
        testResult.expected = isExpected;
        if (error instanceof ScreenshotError) {
            testResult.artifacts = error.screenshots;
            testResult.summaryHtml = error.toMiloSummary();
            if (error.screenshotPath) {
                testResult.tags?.push({ key: 'screenshot_path', value: error.screenshotPath });
            }
        }
        else {
            const errorMessage = getErrorMessage(error);
            const assertionDiff = DiffUtils.resultAssertionsDiff([error]);
            const diffText = DiffUtils.formatDiffText(assertionDiff);
            testResult.summaryHtml = DiffUtils.formatSummary(errorMessage, diffText);
        }
        if (isHook) {
            testResult.summaryHtml = `Failed in ${test.title}:<br>${testResult.summaryHtml}`;
        }
        if (this.htmlResult) {
            this.htmlResult.write(testResult.summaryHtml);
            if (error instanceof ScreenshotError) {
                for (const artifactId in error.screenshots) {
                    this.htmlResult.write(`<br>${artifactId}<br><img src="${error.screenshots[artifactId].filePath}">`);
                }
            }
        }
        ResultsDb.sendTestResult(testResult);
    }
    maybeHook(test) {
        if (!(test instanceof Mocha.Hook)) {
            return undefined;
        }
        const hook = test;
        const suite = hook.parent;
        const hookNames = ['afterAll', 'afterEach', 'beforeAll', 'beforeEach'];
        return hookNames.find(hookName => suite[`_${hookName}`].includes(test) ? hookName : undefined);
    }
    onTestSkip(test) {
        if (!TestConfig.isAiAgent) {
            process.stdout.write(`[SKIP] ${generateExactTestId(GEN_DIR, test.file, test.titlePath(), SOURCE_ROOT).exactTestId}\n`);
        }
        const testResult = this.buildDefaultTestResultFrom(test);
        const { exactTestId } = generateExactTestId(GEN_DIR, test.file, test.titlePath(), SOURCE_ROOT);
        testResult.status = 'SKIP';
        testResult.expected = isExpectedResult({ exactTestId, success: false, skipped: true });
        ResultsDb.sendTestResult(testResult);
    }
    buildDefaultTestResultFrom(test) {
        const testRetry = test;
        const { exactTestId, coarseName, fineName, caseName } = generateExactTestId(GEN_DIR, test.file, test.titlePath(), SOURCE_ROOT);
        const result = {
            duration: `${((test.duration || 1) * .001).toFixed(3)}s`,
            tags: [{ key: 'run', value: String(testRetry.currentRetry() + 1) }],
            ...ResultsDb.buildTestProperties(exactTestId, coarseName, fineName, caseName),
        };
        const hookName = this.maybeHook(test);
        if (hookName) {
            result.tags.push({ key: 'hook', value: hookName });
        }
        return result;
    }
    epilogue() {
        super.epilogue();
        const summary = formatFailedTestsSummary(this.failedTestIds);
        if (summary) {
            process.stdout.write(summary);
        }
        const unexpectedFailures = this.failures.length - this.expectedFailuresCount;
        if (this.failures.length > 0 && unexpectedFailures === 0) {
            process.stdout.write('\n[TestExpectations] All failures were expected! Overriding exit code to 0.\n');
            process.exitCode = 0;
        }
        if (this.unexpectedPassesCount > 0) {
            process.stdout.write(`\n[TestExpectations] ${this.unexpectedPassesCount} unexpected passes! Overriding exit code to 1.\n`);
            process.exitCode = 1;
        }
        const localResults = this.localResultsPath();
        if (this.failures.length > 0 && localResults) {
            console.error(`Results have been written to file://${localResults}`);
        }
    }
}
//# sourceMappingURL=mocha-resultsdb-reporter.js.map