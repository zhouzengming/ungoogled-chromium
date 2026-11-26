// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export async function openPanelViaMoreTools(devToolsPage, panelTitle) {
    await devToolsPage.bringToFront();
    // Head to the triple dot menu.
    await devToolsPage.click('aria/Customize and control DevTools');
    await devToolsPage.waitForFunction(async () => {
        // Open the “More Tools” option.
        await devToolsPage.hover('aria/More tools[role="menuitem"]');
        return await devToolsPage.$(`${panelTitle}[role="menuitem"]`, undefined, 'aria');
    });
    // Click the desired menu item
    await devToolsPage.click(`aria/${panelTitle}[role="menuitem"]`);
    // Wait for the triple dot menu to be collapsed.
    const button = await devToolsPage.waitForAria('Customize and control DevTools');
    await devToolsPage.waitForFunction(async () => {
        const expanded = await button.evaluate(el => el.getAttribute('aria-expanded'));
        return expanded === null;
    });
    // Wait for the corresponding panel to appear.
    await devToolsPage.waitForAria(`${panelTitle} panel[role="tabpanel"]`);
}
export const openSettingsTab = async (devToolsPage, tabTitle) => {
    const gearIconSelector = 'devtools-button[aria-label="Settings"]';
    const settingsMenuSelector = `.tabbed-pane-header-tab[aria-label="${tabTitle}"]`;
    const panelSelector = `.view-container[aria-label="${tabTitle} panel"]`;
    // Click on the Settings Gear toolbar icon.
    await devToolsPage.click(gearIconSelector);
    // Click on the Settings tab and wait for the panel to appear.
    await devToolsPage.click(settingsMenuSelector);
    await devToolsPage.waitFor(panelSelector);
};
export const closeSettings = async (devToolsPage) => {
    await devToolsPage.click('.dialog-close-button');
};
export const togglePreferenceInSettingsTab = async (devToolsPage, label, shouldBeChecked) => {
    await openSettingsTab(devToolsPage, 'Preferences');
    const selector = `[aria-label="${label}"]`;
    await devToolsPage.scrollElementIntoView(selector);
    const preference = await devToolsPage.waitFor(selector);
    const value = await preference.evaluate(checkbox => checkbox.checked);
    if (value !== shouldBeChecked) {
        await devToolsPage.clickElement(preference);
        await devToolsPage.waitForFunction(async () => {
            const newValue = await preference.evaluate(checkbox => checkbox.checked);
            return newValue !== value;
        });
    }
    await closeSettings(devToolsPage);
};
export const setIgnoreListPattern = async (devToolsPage, pattern) => {
    await openSettingsTab(devToolsPage, 'Ignore list');
    await devToolsPage.click('[aria-label="Add a regular expression rule for the script’s URL"]');
    const textBox = await devToolsPage.waitFor('[aria-label="Add a regular expression rule for the script’s URL"]');
    await devToolsPage.clickElement(textBox);
    await textBox.type(pattern);
    await textBox.type('\n');
    await devToolsPage.waitFor(`[title="Ignore scripts whose names match '${pattern}'"]`);
    await closeSettings(devToolsPage);
};
export const toggleIgnoreListing = async (devToolsPage, enable) => {
    await openSettingsTab(devToolsPage, 'Ignore list');
    await devToolsPage.setCheckBox('[title="Ignore listing"]', enable);
    await closeSettings(devToolsPage);
};
//# sourceMappingURL=settings-helpers.js.map