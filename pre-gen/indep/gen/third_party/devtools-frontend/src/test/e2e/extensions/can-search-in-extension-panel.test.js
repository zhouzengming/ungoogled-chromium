// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { expectError } from '../../conductor/events.js';
import { loadExtension } from '../helpers/extension-helpers.js';
const PAGE_TITLE = 'TestPanel';
describe('Extension panels', () => {
    it('can perform search actions', async ({ devToolsPage, inspectedPage }) => {
        expectError('Unknown VE context: \'https://localhostTestPanel\'');
        await inspectedPage.goToResource('empty.html');
        const extension = await loadExtension(devToolsPage, inspectedPage, 'TestExtension', undefined, undefined);
        const page = new URL(`${inspectedPage.getResourcesPath()}/extensions/test_panel.html`).pathname;
        await extension.evaluate(async (page) => {
            window.searchEvents = [];
            const panel = await new Promise(r => window.chrome.devtools.panels.create('TestPanel', '', page, r));
            panel.onSearch.addListener((action, queryString) => window.searchEvents.push({ action, queryString }));
        }, page);
        await devToolsPage.clickMoreTabsButton();
        await devToolsPage.click(`[aria-label=${PAGE_TITLE}]`);
        await devToolsPage.pressKey('F', { control: true });
        const search = await devToolsPage.waitFor('#search-input-field');
        await search.type('abc');
        const queries = await devToolsPage.waitForFunction(() => {
            return extension.evaluate(() => window.searchEvents.length > 0 ? window.searchEvents : undefined);
        });
        assert.deepEqual(queries, [{ action: 'performSearch', queryString: 'abc' }]);
    });
});
//# sourceMappingURL=can-search-in-extension-panel.test.js.map