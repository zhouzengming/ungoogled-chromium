import * as Mocha from 'mocha';
import { type TestCallback, type TestStateProvider } from './mocha-interface-helpers.js';
export interface MochaInterfaceOptions<TState = unknown, TSuiteSettings = unknown> {
    description: string;
    stateProvider?: TestStateProvider<TState, TSuiteSettings>;
}
export interface CustomItFunction<TState> {
    (title: string, fn?: TestCallback<TState> | Mocha.AsyncFunc): Mocha.Test;
    skip: (title: string, _fn?: TestCallback<TState> | Mocha.AsyncFunc) => Mocha.Test;
    only: (title: string, fn?: TestCallback<TState> | Mocha.AsyncFunc) => Mocha.Test;
}
export interface CustomDescribeFunction {
    (title: string, fn?: (this: Mocha.Suite) => void): Mocha.Suite;
    only: (title: string, fn?: (this: Mocha.Suite) => void) => Mocha.Suite;
    skip: (title: string, fn?: (this: Mocha.Suite) => void) => Mocha.Suite;
}
export interface CustomMochaGlobals<TState, TSuiteSettings> {
    describe: CustomDescribeFunction;
    setup?: (settings: TSuiteSettings) => void;
    it: CustomItFunction<TState>;
    before?: Mocha.HookFunction;
    after?: Mocha.HookFunction;
    beforeEach?: Mocha.HookFunction;
    afterEach?: Mocha.HookFunction;
    run?: () => void;
}
export declare function createMochaInterface<TState = unknown, TSuiteSettings = unknown>(options: MochaInterfaceOptions<TState, TSuiteSettings>): {
    (rootSuite: Mocha.Suite): void;
    description: string;
};
export declare const devtoolsTestInterface: {
    (rootSuite: Mocha.Suite): void;
    description: string;
};
