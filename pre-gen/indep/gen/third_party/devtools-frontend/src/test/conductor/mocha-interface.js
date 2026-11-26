// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Mocha from 'mocha';
// @ts-expect-error
import * as commonInterface from 'mocha/lib/interfaces/common.js';
import { DefaultPuppeteerStateProvider, InstrumentedTestFunction, } from './mocha-interface-helpers.js';
export function createMochaInterface(options) {
    const devtoolsTestInterface = function (rootSuite) {
        let defaultImplementation;
        let mochaGlobals;
        let mochaRoot;
        rootSuite.on(Mocha.Suite.constants.EVENT_FILE_PRE_REQUIRE, (context, file, mocha) => {
            mochaGlobals = context;
            mochaRoot = mocha;
            const defaultFactory = ('createCommon' in commonInterface
                ? commonInterface.createCommon
                : 'default' in commonInterface
                    ? commonInterface.default
                    : commonInterface);
            defaultImplementation = defaultFactory([rootSuite], context, mocha);
            if (mocha.options.delay) {
                context.run = defaultImplementation.runWithSuite(rootSuite);
            }
            mochaGlobals.describe = customDescribe(defaultImplementation.suite, file);
        });
        function customDescribe(suiteImplementation, file) {
            function withAugmentedTitle(suiteFn) {
                return function (title, describeBodyFn) {
                    const suite = suiteFn({
                        title,
                        file,
                        fn: function () {
                            const thisSuite = this;
                            const parentDefinitions = {
                                describe: mochaGlobals.describe,
                                setup: mochaGlobals.setup,
                                it: mochaGlobals.it,
                            };
                            mochaGlobals.describe = customDescribe(defaultImplementation.suite, file);
                            if (options.stateProvider?.registerSuiteSettings) {
                                mochaGlobals.setup = function (suiteSettings) {
                                    options.stateProvider.registerSuiteSettings(thisSuite, suiteSettings);
                                };
                            }
                            mochaGlobals.it = customIt(defaultImplementation.test, thisSuite, thisSuite.file || '', mochaRoot, options.stateProvider);
                            if (describeBodyFn) {
                                describeBodyFn.call(thisSuite);
                            }
                            // Restore definitions so when we come back from a nested describe
                            // we have the same definitions available as for the current block,
                            // therefore correctly handling the next describe block that is at
                            // the same level with this one.
                            mochaGlobals.describe = parentDefinitions.describe;
                            mochaGlobals.setup = parentDefinitions.setup;
                            mochaGlobals.it = parentDefinitions.it;
                        },
                    });
                    if (!suite.isPending() && options.stateProvider?.prepareSuite) {
                        suite.beforeEach(async function () {
                            this.timeout(0);
                            await options.stateProvider.prepareSuite(suite);
                        });
                    }
                    return suite;
                };
            }
            const describe = withAugmentedTitle(suiteImplementation.create.bind(suiteImplementation));
            describe.only = withAugmentedTitle(suiteImplementation.only.bind(suiteImplementation));
            describe.skip = withAugmentedTitle(suiteImplementation.skip.bind(suiteImplementation));
            return describe;
        }
    };
    devtoolsTestInterface.description = options.description;
    return devtoolsTestInterface;
}
function customIt(testImplementation, suite, file, mocha, stateProvider) {
    function createTest(title, itBodyFn) {
        const test = new Mocha.Test(title, suite.isPending() || !itBodyFn ? undefined :
            InstrumentedTestFunction.instrument(itBodyFn, 'test', suite, stateProvider));
        test.file = file;
        // Creates a proxy that changes the duration to return
        // our own timing.
        const proxyTest = new Proxy(test, {
            get(target, property, receiver) {
                if (property === 'duration' && target.realDuration) {
                    return (Reflect.get(target, 'realDuration', receiver) ?? Reflect.get(target, property, receiver));
                }
                return Reflect.get(target, property, receiver);
            },
        });
        suite.addTest(proxyTest);
        return proxyTest;
    }
    // Regular mocha it returns the test instance.
    const localIt = Object.assign(function (title, fn) {
        return createTest(title, fn);
    }, {
        skip: function (title, _fn) {
            return createTest(title);
        },
        only: function (title, fn) {
            return testImplementation.only(mocha, createTest(title, fn));
        },
    });
    return localIt;
}
export const devtoolsTestInterface = createMochaInterface({
    description: 'DevTools test interface',
    stateProvider: DefaultPuppeteerStateProvider.instance,
});
//# sourceMappingURL=mocha-interface.js.map