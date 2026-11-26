// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { AssertionError } from 'chai';
export { platform } from '../conductor/platform.js';
export const step = async (description, step) => {
    try {
        return await step();
    }
    catch (error) {
        if (error instanceof AssertionError) {
            throw new AssertionError(`Unexpected Result in Step "${description}"
      ${error.message}`, error);
        }
        else {
            error.message += ` in Step "${description}"`;
            throw error;
        }
    }
};
export function matchString(actual, expected) {
    if (typeof expected === 'string') {
        if (actual !== expected) {
            return `Expected item "${actual}" to equal "${expected}"`;
        }
    }
    else if (!expected.test(actual)) {
        return `Expected item "${actual}" to match "${expected}"`;
    }
    return true;
}
export function matchArray(actual, expected, comparator) {
    if (actual.length !== expected.length) {
        return `Expected [${actual.map(x => `"${x}"`).join(', ')}] to have length ${expected.length}`;
    }
    for (let i = 0; i < expected.length; ++i) {
        const result = comparator(actual[i], expected[i]);
        if (result !== true) {
            return `Mismatch in row ${i}: ${result}`;
        }
    }
    return true;
}
export function matchTable(actual, expected, comparator) {
    return matchArray(actual, expected, (actual, expected) => matchArray(actual, expected, comparator));
}
export const matchStringArray = (actual, expected) => matchArray(actual, expected, matchString);
export const matchStringTable = (actual, expected) => matchTable(actual, expected, matchString);
export const replacePuppeteerUrl = (value) => {
    return value.replace(/pptr:.*:([0-9]+)$/, (_, match) => {
        return `(index):${match}`;
    });
};
//# sourceMappingURL=helper.js.map