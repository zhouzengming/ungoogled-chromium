// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GEN_DIR, SOURCE_ROOT, TEST_ID_REGEX } from './paths.js';
import { platform } from './platform.js';
import { TestConfig } from './test_config.js';
import { parseExpectations as parse, serializeExpectations as serialize } from './test_expectations_parser.js';
export const parseExpectations = parse;
export const serializeExpectations = serialize;
const parsedExpectations = new Map();
export function getExpectedResults(testId) {
    const expectationsPath = TestConfig.expectationsFile ? path.resolve(TestConfig.expectationsFile) :
        path.join(SOURCE_ROOT, 'test', 'TestExpectations');
    if (!parsedExpectations.has(expectationsPath)) {
        if (fs.existsSync(expectationsPath)) {
            const content = fs.readFileSync(expectationsPath, 'utf8');
            parsedExpectations.set(expectationsPath, parseExpectations(content).filter(e => !e.isCommentOrEmpty));
        }
        else {
            parsedExpectations.set(expectationsPath, []);
        }
    }
    const expectations = parsedExpectations.get(expectationsPath);
    const match = expectations.find(e => {
        if (!e.testName) {
            return false;
        }
        if (e.platforms && e.platforms.length > 0) {
            if (!e.platforms.includes(platform)) {
                return false;
            }
        }
        if (TEST_ID_REGEX.test(e.testName)) {
            return testId === e.testName;
        }
        return testId === e.testName || testId.startsWith(e.testName + ':');
    });
    return match?.results;
}
export function isExpectedResult({ exactTestId, success, skipped }) {
    const expectedResults = getExpectedResults(exactTestId);
    if (!expectedResults) {
        return success || skipped;
    }
    if (skipped) {
        return expectedResults.includes('Skip');
    }
    if (success) {
        return expectedResults.includes('Pass');
    }
    return expectedResults.includes('Failure');
}
export function getSkippedTests() {
    const expectationsPath = TestConfig.expectationsFile ? path.resolve(TestConfig.expectationsFile) :
        path.join(SOURCE_ROOT, 'test', 'TestExpectations');
    if (!parsedExpectations.has(expectationsPath)) {
        if (fs.existsSync(expectationsPath)) {
            const content = fs.readFileSync(expectationsPath, 'utf8');
            parsedExpectations.set(expectationsPath, parseExpectations(content).filter(e => !e.isCommentOrEmpty));
        }
        else {
            parsedExpectations.set(expectationsPath, []);
        }
    }
    const expectations = parsedExpectations.get(expectationsPath);
    return expectations
        .filter(e => {
        if (!e.testName) {
            return false;
        }
        if (e.results && !e.results.includes('Skip')) {
            return false;
        }
        if (e.platforms && e.platforms.length > 0 && !e.platforms.includes(platform)) {
            return false;
        }
        return true;
    })
        .map(e => e.testName)
        .map(skipped => {
        const parts = skipped.split(':');
        const file = parts[0];
        const caseName = parts.slice(1).join(':');
        const jsFile = file.replace(/\.ts$/, '.js');
        const absoluteJsFile = path.isAbsolute(jsFile) ? jsFile : path.join(GEN_DIR, jsFile);
        return parts.length > 1 ? `${absoluteJsFile}:${caseName}` : absoluteJsFile;
    });
}
//# sourceMappingURL=test_expectations.js.map