// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as puppeteer from 'puppeteer-core';
import { querySelectorShadowTextAll, querySelectorShadowTextOne } from '../../conductor/custom-query-handlers.js';
import { ScreenshotError } from '../../conductor/screenshot-error.js';
import { TestConfig } from '../../conductor/test_config.js';
import { startServer } from '../../conductor/test_server.js';
import { DEFAULT_BROWSER_SETTINGS, Launcher, } from '../shared/BrowserWrapper.js';
import { DEFAULT_DEVTOOLS_SETTINGS, setupDevToolsPage } from '../shared/DevToolsPage.js';
import { setupInspectedPage } from '../shared/InspectedPage.js';
const DEFAULT_SETTINGS = {
    ...DEFAULT_BROWSER_SETTINGS,
    ...DEFAULT_DEVTOOLS_SETTINGS,
};
async function takeScreenshots(state) {
    try {
        // Keep the DevTools page screenshot first to minimize the
        // time between it and the error.
        const devToolsPage = await state.devToolsPage?.screenshot();
        const inspectedPage = await state.inspectedPage?.screenshot();
        return { inspectedPage, devToolsPage };
    }
    catch (err) {
        console.error('Error taking a screenshot', err);
        return {};
    }
}
export async function screenshotError(state, error) {
    if (state.browser && !state.browser.connected) {
        console.error('Browser was disconnected, skipping screenshots');
        return error;
    }
    console.error('Taking screenshots for the error:\n', error);
    if (!TestConfig.debug) {
        try {
            const screenshotTimeout = 5_000;
            let timer;
            const { inspectedPage, devToolsPage } = await Promise.race([
                takeScreenshots(state).then(result => {
                    clearTimeout(timer);
                    return result;
                }),
                new Promise(resolve => {
                    timer = setTimeout(resolve, screenshotTimeout);
                }).then(() => {
                    console.error(`Could not take screenshots within ${screenshotTimeout}ms.`);
                    return { inspectedPage: undefined, devToolsPage: undefined };
                }),
            ]);
            return ScreenshotError.fromBase64Images(error, inspectedPage, devToolsPage, state.devToolsPage?.screenshotLog);
        }
        catch (e) {
            console.error('Unexpected error saving screenshots', e);
            return e instanceof Error ? e : new Error(String(e));
        }
    }
    return error;
}
export class StateProvider {
    static instance = new StateProvider();
    static serverPort;
    /**
     * This provides a mapping whenever we have called the
     * {@link Mocha.setup | setup()} function with custom settings.
     */
    #suiteToSettingsMap = new WeakMap();
    /**
     * This provides a quick link between suite and browser with
     * the correct setting allowing us to skip some check
     * because we try to run the creation of browser in a beforeEach
     */
    #suiteToBrowser = new WeakMap();
    /**
     * Provides a mapping between a stable key (sorted JSON)
     * created from the settings and a browser.
     * This allows us to have a single browser between test
     * that require the same settings.
     */
    settingToBrowser = new Map();
    constructor() {
    }
    registerSuiteSettings(suite, suiteSettings) {
        this.#suiteToSettingsMap.set(suite, suiteSettings);
    }
    async prepareSuite(suite) {
        if (!StateProvider.serverPort) {
            StateProvider.serverPort = await StateProvider.#globalSetup();
        }
        let browser = this.#suiteToBrowser.get(suite);
        if (browser?.connected) {
            return;
        }
        const settings = this.#getSettings(suite);
        const browserSettings = {
            enabledFeatures: (settings.enabledFeatures ?? []).toSorted(),
            disabledFeatures: (settings.disabledFeatures ?? []).toSorted(),
            extensions: (settings.extensions ?? []).toSorted(),
            useCFT: settings.useCFT,
        };
        const browserKey = JSON.stringify(browserSettings);
        browser = this.settingToBrowser.get(browserKey);
        if (browser && !browser.connected) {
            browser?.browser.process()?.kill();
        }
        if (!browser?.connected) {
            browser = await this.launchBrowser(browserSettings);
            this.settingToBrowser.set(browserKey, browser);
        }
        this.#suiteToBrowser.set(suite, browser);
        // Suite needs to be aware of the browser instance to be able to create the
        // full state for the tests
        suite.browser = browser;
    }
    async resolveBrowser(suite) {
        if (suite) {
            await this.prepareSuite(suite);
        }
    }
    async createState(suite) {
        const settings = this.#getSettings(suite);
        const browser = suite.browser;
        if (!browser.connected) {
            throw new Error('Browser disconnected unexpectedly');
        }
        const browsingContext = await this.browsingContext(browser);
        const inspectedPage = await this.setupInspectedPage(browsingContext, StateProvider.serverPort);
        const devToolsPage = await this.devToolsPage(inspectedPage, settings);
        const state = {
            devToolsPage,
            inspectedPage,
            browser,
            browsingContext,
        };
        // Suite needs to be aware of the full state to be able to capture
        // screenshots on failures
        suite.state = state;
        return state;
    }
    async launchBrowser(settings) {
        return await Launcher.browserSetup(settings, StateProvider.serverPort);
    }
    async browsingContext(browser) {
        return await browser.createBrowserContext();
    }
    async devToolsPage(inspectedPage, settings) {
        return await setupDevToolsPage(inspectedPage, settings);
    }
    async setupInspectedPage(context, serverPort) {
        return await setupInspectedPage(context, serverPort);
    }
    async getState(suite) {
        return await this.createState(suite);
    }
    async cleanupState(state) {
        try {
            await state.browsingContext.close();
        }
        catch (e) {
            console.error('Unexpected error closing browsing context during cleanup', e);
        }
    }
    async onTestError(state, error) {
        if (!state) {
            console.error('Missing browsing state. Skipping screenshot taking for error:', error);
            return error;
        }
        if (error instanceof ScreenshotError) {
            return error;
        }
        return await screenshotError(state, error);
    }
    #getSettings(suite) {
        const settings = this.#suiteToSettingsMap.get(suite);
        if (settings) {
            return mergeSettings(settings, DEFAULT_SETTINGS);
        }
        return DEFAULT_SETTINGS;
    }
    static async #globalSetup() {
        const serverPort = Number(await startServer([]));
        // eslint-disable-next-line no-console
        console.log(`Started server on port ${serverPort}`);
        puppeteer.Puppeteer.registerCustomQueryHandler('pierceShadowText', {
            queryOne: querySelectorShadowTextOne,
            queryAll: querySelectorShadowTextAll,
        });
        return serverPort;
    }
    async closeBrowsers() {
        this.settingToBrowser.values().next().value?.copyCrashDumps();
        await Promise.allSettled([...this.settingToBrowser.values()].map(async (browser) => {
            await browser.browser.close();
        }));
    }
}
export function mergeSettings(s1, s2) {
    function mergeAsSet(arr1, arr2) {
        return Array.from(new Set(arr1 ?? []).union(new Set(arr2 ?? [])));
    }
    return {
        enabledFeatures: mergeAsSet(s1.enabledFeatures, s2.enabledFeatures),
        disabledFeatures: mergeAsSet(s1.disabledFeatures, s2.disabledFeatures),
        extensions: mergeAsSet(s1.extensions, s2.extensions),
        enabledDevToolsExperiments: mergeAsSet(s1.enabledDevToolsExperiments, s2.enabledDevToolsExperiments),
        disabledDevToolsExperiments: mergeAsSet(s1.disabledDevToolsExperiments, s2.disabledDevToolsExperiments),
        devToolsSettings: { ...(s2.devToolsSettings ?? {}), ...(s1.devToolsSettings ?? {}) },
        dockingMode: s1.dockingMode ?? s2.dockingMode,
        panel: s1.panel ?? s2.panel,
        useCFT: s1.useCFT ?? s2.useCFT,
    };
}
//# sourceMappingURL=state-provider.js.map