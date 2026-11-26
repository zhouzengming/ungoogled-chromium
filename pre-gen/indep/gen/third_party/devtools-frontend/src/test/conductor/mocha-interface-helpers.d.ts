import type * as Mocha from 'mocha';
declare global {
    namespace Mocha {
        interface Test {
            realDuration?: number;
        }
    }
}
export interface TestStateProvider<TState = unknown, TSuiteSettings = unknown> {
    /** Register custom settings for a suite (e.g. via setup({ ... })) */
    registerSuiteSettings?: (suite: Mocha.Suite, settings: TSuiteSettings) => void;
    /** Prepare suite resources before tests run (e.g. launch/resolve browser for suite) */
    prepareSuite?: (suite: Mocha.Suite) => Promise<void>;
    /** Create/acquire the test state for an individual test execution */
    createState: (suite: Mocha.Suite) => Promise<TState>;
    /** Clean up the state after test execution finishes */
    cleanupState?: (state: TState) => Promise<void>;
    /** Handle or enhance error when a test fails (e.g. taking screenshots) */
    onTestError?: (state: TState | undefined, error: Error) => Promise<Error>;
}
export type TestCallback<TState = void> = (this: Mocha.Context | void, state: TState) => PromiseLike<unknown>;
export declare class InstrumentedTestFunction<TState = unknown> {
    #private;
    /**
     * We track the initial timeouts for each context if we reset it back
     * Mocha check timing of the full executed function and fails
     * the test.
     * https://github.com/mochajs/mocha/blob/main/lib/runnable.js#L307
     */
    static timeoutByContext: WeakMap<Mocha.Context, number>;
    /**
     * We track the initial timeouts for each functions because mocha
     * does not reset test timeout for retries.
     */
    static timeoutByTestFunction: WeakMap<object, number>;
    state: TState | undefined;
    fn: TestCallback<TState> | Mocha.AsyncFunc;
    label: string;
    suite?: Mocha.Suite;
    stateProvider?: TestStateProvider<TState, never>;
    actualTimeout: number;
    originalContextTimeout: number;
    private constructor();
    static instrument<TState = unknown>(fn: TestCallback<TState> | Mocha.AsyncFunc, label: string, suite?: Mocha.Suite, stateProvider?: TestStateProvider<TState, never>): Mocha.AsyncFunc;
}
/**
 * Default state provider for conductor test suites that manage their browser pages
 * via puppeteer-state (such as extensions/cxx_debugging). Captures screenshots
 * on test failures or timeouts if active pages are registered.
 */
export declare class DefaultPuppeteerStateProvider implements TestStateProvider<unknown, unknown> {
    static instance: DefaultPuppeteerStateProvider;
    createState(): Promise<unknown>;
    onTestError(_state: unknown, error: Error): Promise<Error>;
}
export declare function makeInstrumentedTestFunction(fn: Mocha.AsyncFunc, label: string): Mocha.AsyncFunc;
