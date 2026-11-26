import type * as puppeteer from 'puppeteer-core';
import { type E2EState, StateProvider } from '../e2e/conductor/state-provider.js';
import { type BrowserSettings, type BrowserWrapper } from '../e2e/shared/BrowserWrapper.js';
import { InspectedPage } from '../e2e/shared/InspectedPage.js';
export declare class AiEvalStateProvider extends StateProvider {
    static instance: AiEvalStateProvider;
    launchBrowser(settings: BrowserSettings): Promise<BrowserWrapper>;
    browsingContext(browser: BrowserWrapper): Promise<puppeteer.BrowserContext>;
    setupInspectedPage(context: puppeteer.BrowserContext, serverPort: number): Promise<InspectedPage>;
    cleanupState(state: E2EState): Promise<void>;
}
