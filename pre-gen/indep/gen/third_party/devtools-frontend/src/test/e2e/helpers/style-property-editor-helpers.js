// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
export async function clickStylePropertyEditorButton(devToolsPage, title, editorElement) {
    const gridEditorButtons = await devToolsPage.$$(`[title="${title}"]`);
    assert.lengthOf(gridEditorButtons, 1);
    await devToolsPage.click(`[title="${title}"]`);
    await devToolsPage.waitFor(editorElement);
}
export async function clickPropertyButton(devToolsPage, selector) {
    await devToolsPage.waitFor(selector);
    const buttons = await devToolsPage.$$(selector);
    assert.lengthOf(buttons, 1);
    await devToolsPage.click(selector);
}
//# sourceMappingURL=style-property-editor-helpers.js.map