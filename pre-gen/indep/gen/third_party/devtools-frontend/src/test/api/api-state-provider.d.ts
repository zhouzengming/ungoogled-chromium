import type * as Mocha from 'mocha';
import type * as puppeteer from 'puppeteer-core';
import type { TestStateProvider } from '../conductor/mocha-interface-helpers.js';
import { type InspectedPage } from '../e2e/shared/InspectedPage.js';
export declare class ApiStateProvider implements TestStateProvider<API.State, API.SuiteSettings> {
    #private;
    static instance: ApiStateProvider;
    registerSuiteSettings(suite: Mocha.Suite, suiteSettings: API.SuiteSettings): void;
    prepareSuite(suite: Mocha.Suite): Promise<void>;
    resolveBrowser(suite?: Mocha.Suite): Promise<void>;
    setupInspectedPage(context: puppeteer.BrowserContext, serverPort: number): Promise<InspectedPage>;
    createState(suite: Mocha.Suite): Promise<API.State>;
    cleanupState(state: API.State): Promise<void>;
    closeBrowser(): Promise<void>;
}
