// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { waitForSourceFiles } from './sources-helpers.js';
export const QUICK_OPEN_SELECTOR = '[aria-label="Quick open"],[aria-label="Abrir rápido"]';
const QUICK_OPEN_ITEMS_SELECTOR = '.filtered-list-widget-item';
const QUICK_OPEN_SELECTED_ITEM_SELECTOR = `${QUICK_OPEN_ITEMS_SELECTOR}.selected`;
export const openCommandMenu = async (devToolsPage) => {
    await devToolsPage.pressKey('P', { control: true, shift: true });
    await devToolsPage.waitFor(QUICK_OPEN_SELECTOR);
};
export const openFileQuickOpen = async (devtoolsPage) => {
    await devtoolsPage.pressKey('P', { control: true });
    await devtoolsPage.waitFor(QUICK_OPEN_SELECTOR);
};
export async function readQuickOpenResults(devtoolsPage) {
    const items = await devtoolsPage.$$('.filtered-list-widget-item');
    return await Promise.all(items.map(element => element.evaluate(el => el.deepInnerText().split('\n')[0])));
}
/** Does not play well with pptr:evaluate scripts. crbug.com/391533572 */
export const openFileWithQuickOpen = async (devtoolsPage, sourceFile, filePosition = 0) => {
    await waitForSourceFiles(devtoolsPage, "source-file-loaded" /* SourceFileEvents.SOURCE_FILE_LOADED */, files => files.some(f => f.endsWith(sourceFile)), async () => {
        await openFileQuickOpen(devtoolsPage);
        await typeIntoQuickOpen(devtoolsPage, sourceFile);
        const firstItem = await getMenuItemAtPosition(devtoolsPage, filePosition);
        await firstItem.click();
    });
};
export async function runCommandWithQuickOpen(devtoolsPage, command) {
    await openCommandMenu(devtoolsPage);
    await devtoolsPage.typeText(command);
    // TODO: it should actually wait for rendering to finish.
    await devtoolsPage.drainTaskQueue();
    await devtoolsPage.pressKey('Enter');
}
export const openGoToLineQuickOpen = async (devtoolsPage) => {
    // This shortcut explicitly uses Control rather then meta on Mac
    // So we can't use our Helper.
    await devtoolsPage.page.keyboard.down('Control');
    await devtoolsPage.pressKey('G');
    await devtoolsPage.page.keyboard.up('Control');
    await devtoolsPage.waitFor(QUICK_OPEN_SELECTOR);
};
export const showSnippetsAutocompletion = async (devtoolsPage) => {
    // Clear the `>` character, as snippets use a `!` instead
    await devtoolsPage.pressKey('Backspace');
    await devtoolsPage.typeText('!');
};
export async function getAvailableSnippets(devtoolsPage) {
    const quickOpenElement = await devtoolsPage.waitFor(QUICK_OPEN_SELECTOR);
    const snippetsDOMElements = await devtoolsPage.$$(QUICK_OPEN_ITEMS_SELECTOR, quickOpenElement);
    const snippets = await Promise.all(snippetsDOMElements.map(elem => elem.evaluate(elem => elem.textContent)));
    return snippets;
}
export async function getMenuItemAtPosition(devtoolsPage, position) {
    const quickOpenElement = await devtoolsPage.waitFor(QUICK_OPEN_SELECTOR);
    await devtoolsPage.waitFor(QUICK_OPEN_ITEMS_SELECTOR);
    const itemsHandles = await devtoolsPage.$$(QUICK_OPEN_ITEMS_SELECTOR, quickOpenElement);
    const item = itemsHandles[position];
    assert.isOk(item, `Quick open: could not find item at position: ${position}.`);
    return item;
}
export async function getMenuItemTitleAtPosition(devtoolsPage, position) {
    const quickOpenElement = await devtoolsPage.waitFor(QUICK_OPEN_SELECTOR);
    await devtoolsPage.waitFor(QUICK_OPEN_ITEMS_SELECTOR);
    const itemsHandles = await devtoolsPage.$$(QUICK_OPEN_ITEMS_SELECTOR, quickOpenElement);
    const item = itemsHandles[position];
    assert.isOk(item, `Quick open: could not find item at position: ${position}.`);
    const title = await item.evaluate(elem => elem.deepInnerText().split('\n')[0]);
    return title;
}
export const closeDrawer = async (devToolsPage) => {
    await devToolsPage.click('[aria-label="Close drawer"]');
};
export const getSelectedItemText = async (devToolsPage) => {
    const quickOpenElement = await devToolsPage.waitFor(QUICK_OPEN_SELECTOR);
    const selectedRow = await devToolsPage.waitFor(QUICK_OPEN_SELECTED_ITEM_SELECTOR, quickOpenElement);
    const textContent = await selectedRow.getProperty('textContent');
    assert.isOk(textContent, 'Quick open: could not get selected item textContent');
    return await textContent.jsonValue();
};
export async function typeIntoQuickOpen(devtoolsPage, query, expectEmptyResults = false) {
    await openFileQuickOpen(devtoolsPage);
    const prompt = await devtoolsPage.waitFor('[aria-label="Quick open prompt"]');
    await prompt.type(query);
    if (expectEmptyResults) {
        await devtoolsPage.waitFor('.filtered-list-widget :not(.hidden).not-found-text');
    }
    else {
        await devtoolsPage.waitForFunction(async () => {
            const matches = await devtoolsPage.$$(`.filtered-list-widget-item devtools-highlight`);
            const ranges = await Promise.all(matches.map(async (m) => {
                return await m.evaluate(m => m.getAttribute('ranges'));
            }));
            return ranges.some(r => (r?.match(/,1/g) || []).length === query.length);
        });
    }
}
//# sourceMappingURL=quick_open-helpers.js.map