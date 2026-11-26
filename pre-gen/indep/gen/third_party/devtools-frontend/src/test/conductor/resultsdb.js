// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as fs from 'node:fs';
import * as http from 'node:http';
// Sinon fake timers will override globalThis.setTimeout when unit tests run in Node.js.
// Import setTimeout directly from node:timers to guarantee access to the native timer.
import { setTimeout as nativeSetTimeout } from 'node:timers';
/**
 * ResultSink checks the testId against the regex /^[[print]]{1,512}$/:
 * https://source.chromium.org/chromium/infra/infra/+/main:go/src/go.chromium.org/luci/resultdb/pbutil/test_result.go;l=43;drc=7ba090da753a71be5a0f37785558e9102e57fa10
 *
 * This function removes non-printable characters and truncates the string
 * to the max allowed length.
 **/
export function sanitizedTestId(rawTestId) {
    return rawTestId.replace(/[^\x20-\x7E]/g, '').substring(0, 512);
}
export function buildTestProperties(exactTestId, coarseName, fineName, caseName) {
    return {
        testId: sanitizedTestId(exactTestId),
        testIdStructured: {
            moduleName: 'devtools-frontend',
            moduleScheme: 'mocha',
            coarseName,
            fineName,
            caseNameComponents: caseName.split(':'),
        },
        testMetadata: {
            name: exactTestId,
            location: {
                repo: 'https://chromium.googlesource.com/devtools/devtools-frontend',
                fileName: `//${coarseName}${fineName}`,
            },
        },
    };
}
let resolvedSinkData = undefined;
function getSinkData() {
    if (resolvedSinkData !== undefined) {
        return resolvedSinkData;
    }
    resolvedSinkData = { url: undefined };
    if (!process.env.LUCI_CONTEXT || !fs.existsSync(process.env.LUCI_CONTEXT)) {
        return resolvedSinkData;
    }
    const luciConfig = fs.readFileSync(process.env.LUCI_CONTEXT, 'utf8');
    const sink = JSON.parse(luciConfig)['result_sink'];
    // LUCI_CONTEXT will not have a result_sink configuration when
    // ResultSink is unavailable.
    if (!sink) {
        return resolvedSinkData;
    }
    // Force IPv4 127.0.0.1 instead of localhost. On macOS, Node.js attempts IPv6 (::1)
    // first for localhost. Because rdb-stream binds only to IPv4, IPv6 SYN packets
    // hang until socket timeout on macOS, causing process hangs.
    const address = sink.address.startsWith('localhost:') ? sink.address.replace('localhost:', '127.0.0.1:') : sink.address;
    resolvedSinkData = {
        url: `http://${address}/prpc/luci.resultsink.v1.Sink/ReportTestResults`,
        authToken: sink.auth_token,
    };
    return resolvedSinkData;
}
export function available() {
    const sinkData = getSinkData();
    return sinkData.url !== undefined;
}
let pendingResults = [];
let currentBatchPromise = null;
function stringifyTestResults(results) {
    const testResults = results.map(result => {
        // SummaryHTML has a limit of 4096 bytes.
        if (result.summaryHtml) {
            const buf = Buffer.from(result.summaryHtml, 'utf8');
            if (buf.length > 4096) {
                // Note this may produce wrong last character
                // but node outputs � in that case which is OK.
                result.summaryHtml = buf.subarray(0, 4096).toString('utf8');
            }
        }
        return result;
    });
    return JSON.stringify({ testResults });
}
function takeAndSendResults() {
    if (currentBatchPromise !== null || pendingResults.length === 0) {
        return;
    }
    const sinkData = getSinkData();
    if (sinkData.url === undefined) {
        pendingResults = [];
        return;
    }
    currentBatchPromise = new Promise(resolve => {
        // nativeSetTimeout(..., 0) defers HTTP request dispatch to the next event-loop tick.
        // This ensures that when sendTestResult is called inside a Mocha test, the HTTP
        // request runs AFTER the test's afterEach hook has completed and unhooked any
        // active Sinon fake timers.
        nativeSetTimeout(() => {
            // Limit batch size to 50 to prevent huge payloads that cause rdb-stream to timeout
            const testResults = pendingResults.splice(0, 50);
            if (testResults.length === 0) {
                resolve();
                return;
            }
            const payload = stringifyTestResults(testResults);
            const postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `ResultSink ${sinkData.authToken}`,
                    'Content-Length': Buffer.byteLength(payload),
                    Connection: 'close',
                },
            };
            // As per ResultSink documentation, this will always be a localhost connection
            // and can be treated as reliable as a local file write.
            const request = http.request(sinkData.url, postOptions, res => {
                res.on('end', () => {
                    request.setTimeout(0);
                    resolve();
                });
                res.on('close', () => {
                    request.setTimeout(0);
                    resolve();
                });
                res.on('error', () => {
                    request.setTimeout(0);
                    resolve();
                });
                res.resume();
            });
            request.setTimeout(5000, () => {
                request.destroy();
                console.error('sending to rdb timed out');
                resolve();
            });
            request.on('error', err => {
                console.error('error sending to rdb:', err);
                resolve();
            });
            request.write(payload);
            request.end();
        }, 0);
    }).finally(() => {
        currentBatchPromise = null;
        if (pendingResults.length > 0) {
            takeAndSendResults();
        }
    });
}
/**
 * Call at the end of a test suite. Will send all `TestResult`s collected via
 * `recordTestResult` to the ResultSink endpoint (only if available).
 **/
export function sendTestResult(results) {
    const sinkData = getSinkData();
    if (sinkData.url === undefined) {
        return;
    }
    pendingResults.push(results);
    takeAndSendResults();
}
// When Node's event loop empties, flush all remaining queued batches sequentially before exiting.
if (typeof process !== 'undefined' && process.on) {
    process.on('beforeExit', async () => {
        while (pendingResults.length > 0 || currentBatchPromise !== null) {
            if (currentBatchPromise) {
                await currentBatchPromise;
            }
            else {
                takeAndSendResults();
            }
        }
    });
}
//# sourceMappingURL=resultsdb.js.map