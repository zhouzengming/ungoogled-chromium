import * as puppeteer from 'puppeteer-core';
export declare class BrowserWrapper {
    #private;
    browser: puppeteer.Browser;
    constructor(b: puppeteer.Browser);
    get connected(): boolean;
    createBrowserContext(): Promise<puppeteer.BrowserContext>;
    copyCrashDumps(): void;
}
export interface BrowserSettings {
    chromeUsername?: string;
    enabledFeatures: string[];
    disabledFeatures: string[];
    extensions?: string[];
    useCFT?: boolean;
}
export declare class Launcher {
    static browserSetup(settings: BrowserSettings, serverPort: number): Promise<BrowserWrapper>;
    static launchChrome(settings: BrowserSettings, serverPort: number): Promise<puppeteer.Browser>;
}
export declare const DEFAULT_BROWSER_SETTINGS: BrowserSettings;
