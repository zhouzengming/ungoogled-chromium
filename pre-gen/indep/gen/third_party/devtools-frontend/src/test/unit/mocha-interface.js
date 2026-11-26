// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './browser-globals.js';
export function installDevtoolsBdd() {
    const mochaGlobal = window.Mocha;
    const karmaConfig = window.__karma__.config;
    const checkoutRoot = karmaConfig.checkoutRoot;
    const pathSeparator = karmaConfig.pathSeparator;
    mochaGlobal.interfaces['devtools-bdd'] = function (suite) {
        mochaGlobal.interfaces.bdd(suite);
        suite.on('pre-require', function (context) {
            const originalDescribe = context.describe;
            const originalIt = context.it;
            function extractFileNameFromStack() {
                const stack = new Error().stack;
                const match = stack?.match(/\/base\/(.+?\.test\.(?:js|mjs))/);
                if (!match) {
                    throw new Error('Could not find file name in stack trace');
                }
                const file = decodeURIComponent(match[1]);
                return checkoutRoot + pathSeparator + file.replace(/\//g, pathSeparator);
            }
            function wrapDescribe(originalFn) {
                return function (title, fn) {
                    const s = originalFn
                        .call(this, title, fn);
                    if (s && !s.file) {
                        let file = s.parent?.file;
                        if (!file) {
                            file = extractFileNameFromStack();
                        }
                        s.file = file;
                    }
                    return s;
                };
            }
            context.describe = Object.assign(wrapDescribe(originalDescribe), {
                only: wrapDescribe(originalDescribe.only),
                skip: wrapDescribe(originalDescribe.skip),
            });
            function wrapIt(originalFn) {
                return function (titleOrFn, fn) {
                    const t = originalFn
                        .call(this, titleOrFn, fn);
                    if (t && t.parent) {
                        let file = t.parent.file;
                        if (!file) {
                            file = extractFileNameFromStack();
                        }
                        t.file = file;
                    }
                    return t;
                };
            }
            context.it = Object.assign(wrapIt(originalIt), {
                only: wrapIt(originalIt.only),
                skip: wrapIt(originalIt.skip),
                retries: originalIt.retries,
            });
        });
    };
    window.mocha.ui('devtools-bdd');
}
//# sourceMappingURL=mocha-interface.js.map