// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { createSelectorsForWorkerFile, expandFileTree, } from '../helpers/sources-helpers.js';
function createSelectorsForFile(fileName, inspectedPage) {
    return createSelectorsForWorkerFile(inspectedPage, fileName, 'test/e2e/resources/sources', fileName, 1);
}
async function openNestedWorkerFile(selectors, devToolsPage) {
    const workerFile = await expandFileTree(devToolsPage, selectors);
    return await workerFile.evaluate(node => node.textContent);
}
describe('The Sources Tab', function () {
    it('can show multiple dedicated workers with different scripts', async ({ devToolsPage, inspectedPage }) => {
        const worker1Selectors = createSelectorsForFile('worker1.js', inspectedPage);
        const worker2Selectors = createSelectorsForFile('worker2.js', inspectedPage);
        // Have the target load the page.
        await inspectedPage.goToResource('sources/different-workers.html');
        // Locate the button for switching to the sources tab.
        await devToolsPage.click('#tab-sources');
        // Wait for the navigation panel to show up
        await devToolsPage.waitFor('.navigator-file-tree-item');
        const worker1FileName = await openNestedWorkerFile(worker1Selectors, devToolsPage);
        assert.strictEqual(worker1FileName, 'worker1.js');
        const worker2FileName = await openNestedWorkerFile(worker2Selectors, devToolsPage);
        assert.strictEqual(worker2FileName, 'worker2.js');
    });
});
//# sourceMappingURL=can-show-multiple-workers.test.js.map