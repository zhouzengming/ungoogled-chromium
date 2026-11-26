// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { loadExtension } from '../helpers/extension-helpers.js';
import { getTextFilterContent, waitForNetworkTab } from '../helpers/network-helpers.js';
describe('The Extension API', () => {
    it('can reveal the network panel', async ({ devToolsPage, inspectedPage }) => {
        await inspectedPage.goToResource('empty.html');
        const extension = await loadExtension(devToolsPage, inspectedPage, 'TestExtension', undefined, undefined);
        await extension.evaluate(() => window.chrome.devtools.panels.network.show());
        await waitForNetworkTab(devToolsPage);
    });
    it('can reveal the network panel with filters', async ({ devToolsPage, inspectedPage }) => {
        await inspectedPage.goToResource('empty.html');
        const extension = await loadExtension(devToolsPage, inspectedPage, 'TestExtension', undefined, undefined);
        await extension.evaluate(() => window.chrome.devtools.panels.network.show({ filter: 'foobar' }));
        await waitForNetworkTab(devToolsPage);
        const textFilterContent = await getTextFilterContent(devToolsPage);
        assert.strictEqual('foobar ', textFilterContent);
    });
});
//# sourceMappingURL=can-reveal-requests.test.js.map