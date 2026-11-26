// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { deinitializeGlobalLocaleVars, initializeGlobalLocaleVars } from '../../front_end/testing/LocaleHelpers.js';
import { StateProvider } from '../e2e/conductor/state-provider.js';
import { setupInspectedPage } from '../e2e/shared/InspectedPage.js';
import { createTargetUniverse } from './TargetUniverse.js';
export class ApiStateProvider {
    static instance = new ApiStateProvider();
    #suiteToSettingsMap = new WeakMap();
    #stateToCleanupMap = new WeakMap();
    registerSuiteSettings(suite, suiteSettings) {
        this.#suiteToSettingsMap.set(suite, suiteSettings);
    }
    async prepareSuite(suite) {
        await StateProvider.instance.resolveBrowser(suite);
    }
    async resolveBrowser(suite) {
        if (suite) {
            await StateProvider.instance.resolveBrowser(suite);
        }
    }
    #getSettings(suite) {
        return this.#suiteToSettingsMap.get(suite);
    }
    async setupInspectedPage(context, serverPort) {
        return await setupInspectedPage(context, serverPort);
    }
    async createState(suite) {
        await this.prepareSuite(suite);
        const browserWrapper = suite.browser;
        if (!browserWrapper || !browserWrapper.connected) {
            throw new Error('Browser disconnected unexpectedly');
        }
        const browser = browserWrapper.browser;
        const settings = this.#getSettings(suite);
        const browsingContext = await browser.createBrowserContext();
        const inspectedPage = await this.setupInspectedPage(browsingContext, StateProvider.serverPort);
        const targetUrl = settings?.targetUrl ?? `${inspectedPage.domain()}/test/e2e/resources/empty.html`;
        await inspectedPage.goTo(targetUrl);
        const session = await inspectedPage.page.createCDPSession();
        await initializeGlobalLocaleVars();
        const targetUniverse = await createTargetUniverse(session, settings?.creationOptions);
        const state = {
            inspectedPage,
            universe: targetUniverse.universe,
        };
        this.#stateToCleanupMap.set(state, targetUniverse.cleanup);
        return state;
    }
    async cleanupState(state) {
        try {
            const cleanup = this.#stateToCleanupMap.get(state);
            this.#stateToCleanupMap.delete(state);
            cleanup?.();
        }
        catch (e) {
            console.error('Unexpected error during target universe cleanup', e);
        }
        try {
            await state.inspectedPage.page.browserContext().close();
        }
        catch (e) {
            console.error('Unexpected error during cleanup', e);
        }
        deinitializeGlobalLocaleVars();
    }
    async closeBrowser() {
        await StateProvider.instance.closeBrowsers();
    }
}
//# sourceMappingURL=api-state-provider.js.map