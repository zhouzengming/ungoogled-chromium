/**
 * @file Functions and state to tie error reporting and console output of
 * the browser process and frontend pages together.
 */
import type * as puppeteer from 'puppeteer-core';
export declare function setupBrowserProcessIO(browser: puppeteer.Browser): void;
export declare function installPageErrorHandlers(page: puppeteer.Page): void;
export declare class ErrorExpectation {
    #private;
    constructor(msg: string | RegExp);
    drop(): Error | puppeteer.ConsoleMessage | undefined;
    get caught(): Error | puppeteer.ConsoleMessage | undefined;
    check(consoleMessage: puppeteer.ConsoleMessage | Error): boolean;
}
export declare function expectError(msg: string | RegExp): ErrorExpectation;
export declare function dumpCollectedErrors(): void;
export declare let expectedErrors: string[];
