// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { TestConfig } from '../conductor/test_config.js';
import { StateProvider } from '../e2e/conductor/state-provider.js';
import { Launcher } from '../e2e/shared/BrowserWrapper.js';
import { InspectedPage } from '../e2e/shared/InspectedPage.js';
export class AiEvalStateProvider extends StateProvider {
    static instance = new AiEvalStateProvider();
    async launchBrowser(settings) {
        return await Launcher.browserSetup({
            ...settings,
            chromeUsername: TestConfig.otaUsername,
        }, StateProvider.serverPort);
    }
    async browsingContext(browser) {
        return browser.browser.defaultBrowserContext();
    }
    async setupInspectedPage(context, serverPort) {
        const page = await context.newPage();
        return new InspectedPage(page, serverPort);
    }
    async cleanupState(state) {
        try {
            if (state.inspectedPage) {
                await state.inspectedPage.page.close().catch(() => { });
            }
        }
        catch {
            // Ignore cleanup error for default browser context.
        }
    }
}
//# sourceMappingURL=ai-eval-state-provider.js.map