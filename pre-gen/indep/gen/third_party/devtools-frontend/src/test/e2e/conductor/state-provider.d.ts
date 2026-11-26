import type * as Mocha from 'mocha';
import * as puppeteer from 'puppeteer-core';
import type { TestStateProvider } from '../../conductor/mocha-interface-helpers.js';
import { type BrowserSettings, type BrowserWrapper } from '../shared/BrowserWrapper.js';
import { type DevToolsPage } from '../shared/DevToolsPage.js';
import { type InspectedPage } from '../shared/InspectedPage.js';
export interface E2EState extends E2E.State {
    browsingContext: puppeteer.BrowserContext;
}
export interface ScreenshotState {
    browser?: {
        connected: boolean;
    };
    inspectedPage?: {
        screenshot(options?: {
            encoding: 'base64';
        }): Promise<string>;
    };
    devToolsPage?: {
        screenshot(options?: {
            encoding: 'base64';
        }): Promise<string>;
        screenshotLog?: Record<string, string>;
    };
}
export declare function screenshotError(state: ScreenshotState, error: Error): Promise<Error>;
export declare class StateProvider implements TestStateProvider<E2EState, E2E.SuiteSettings> {
    #private;
    static instance: StateProvider;
    static serverPort: number;
    /**
     * Provides a mapping between a stable key (sorted JSON)
     * created from the settings and a browser.
     * This allows us to have a single browser between test
     * that require the same settings.
     */
    protected settingToBrowser: Map<string, BrowserWrapper>;
    protected constructor();
    registerSuiteSettings(suite: Mocha.Suite, suiteSettings: E2E.SuiteSettings): void;
    prepareSuite(suite: Mocha.Suite): Promise<void>;
    resolveBrowser(suite?: Mocha.Suite): Promise<void>;
    createState(suite: Mocha.Suite): Promise<E2EState>;
    launchBrowser(settings: BrowserSettings): Promise<BrowserWrapper>;
    browsingContext(browser: BrowserWrapper): Promise<puppeteer.BrowserContext>;
    devToolsPage(inspectedPage: InspectedPage, settings: E2E.HarnessSettings): Promise<DevToolsPage>;
    setupInspectedPage(context: puppeteer.BrowserContext, serverPort: number): Promise<InspectedPage>;
    getState(suite: Mocha.Suite): Promise<E2EState>;
    cleanupState(state: E2EState): Promise<void>;
    onTestError(state: E2EState | undefined, error: Error): Promise<Error>;
    closeBrowsers(): Promise<void>;
}
export declare function mergeSettings(s1: E2E.SuiteSettings, s2: E2E.HarnessSettings): E2E.HarnessSettings;
