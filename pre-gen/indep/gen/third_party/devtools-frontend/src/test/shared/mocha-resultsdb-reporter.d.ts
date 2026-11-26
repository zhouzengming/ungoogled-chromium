import * as Mocha from 'mocha';
import * as fs from 'node:fs';
export declare class ResultsDbReporter extends Mocha.reporters.Base {
    private suitePrefix?;
    private n;
    private expectedFailuresCount;
    private unexpectedPassesCount;
    private failedTestIds;
    htmlResult: fs.WriteStream | undefined;
    localResultsPath(): string | undefined;
    constructor(runner: Mocha.Runner, options?: Mocha.MochaOptions);
    private onTestPass;
    private onTestFail;
    private maybeHook;
    private onTestSkip;
    private buildDefaultTestResultFrom;
    epilogue(): void;
}
