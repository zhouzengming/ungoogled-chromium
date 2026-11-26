// Copyright (c) 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const MIN_SCHEME = 0;
const DEFAULT_SCHEME = 3;
const MAX_SCHEME = 5;
const getEnabled = async () => {
    const { enabled } = await chrome.storage.local.get(['enabled']);
    return String(enabled) === 'true';
};
const setEnabled = async (enabled) => {
    await chrome.storage.local.set({ enabled: String(enabled) });
};
const getDefaultScheme = async () => {
    const { scheme } = await chrome.storage.local.get(['scheme']);
    const validated = parseInt(scheme, 10);
    if (validated >= MIN_SCHEME && validated <= MAX_SCHEME) {
        return validated >= MIN_SCHEME ? validated : DEFAULT_SCHEME;
    }
    await chrome.storage.local.set({ scheme: DEFAULT_SCHEME });
    return DEFAULT_SCHEME;
};
const getSiteScheme = async (site) => {
    const [scheme, storage] = await Promise.all([
        getDefaultScheme(),
        chrome.storage.local.get(['siteschemes']),
    ]);
    try {
        const parsed = JSON.parse(storage.siteschemes || '{}');
        const candidate = parseInt(parsed[site], 10);
        if (candidate >= MIN_SCHEME && candidate <= MAX_SCHEME) {
            return candidate;
        }
    }
    catch {
    }
    return scheme;
};
const setSiteScheme = async (site, scheme) => {
    if (!(scheme >= MIN_SCHEME && scheme <= MAX_SCHEME)) {
        const validated = await getDefaultScheme();
        await applySiteScheme(site, validated);
        return;
    }
    await applySiteScheme(site, scheme);
};
const applySiteScheme = async (site, scheme) => {
    const { siteschemes } = await chrome.storage.local.get(['siteschemes']);
    let parsed = {};
    try {
        parsed = JSON.parse(siteschemes || '{}');
    }
    catch {
        parsed = {};
    }
    parsed[site] = scheme;
    await chrome.storage.local.set({ siteschemes: JSON.stringify(parsed) });
};
const siteFromUrl = (url) => new URL(url).hostname;
function isMacOS() {
    const userAgentData = navigator.userAgentData;
    const platform = userAgentData?.platform ?? navigator.platform;
    return platform.toLowerCase().includes('mac');
}

// Copyright (c) 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const injectContentScripts = async () => {
    const windows = await chrome.windows.getAll({ populate: true });
    for (const w of windows) {
        for (const tab of w.tabs ?? []) {
            const url = tab.url;
            if (!url || url.startsWith('chrome') || url.startsWith('about')) {
                continue;
            }
            await chrome.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                files: ['highcontrast.js'],
                injectImmediately: true,
            });
        }
    }
};
const toggleEnabled = async () => {
    const current = await getEnabled();
    await setEnabled(!current);
};
const toggleSite = async (url) => {
    const site = siteFromUrl(url);
    const currentScheme = await getSiteScheme(site);
    const scheme = currentScheme > MIN_SCHEME ? MIN_SCHEME : await getDefaultScheme();
    await setSiteScheme(site, scheme);
};
chrome.runtime.onInstalled.addListener(() => {
    void injectContentScripts();
});
chrome.runtime.onMessage.addListener((message, sender, _) => {
    if (message['toggle_global']) {
        toggleEnabled();
    }
    if (message['toggle_site']) {
        const url = sender.tab?.url ?? 'https://www.example.com';
        toggleSite(url);
    }
    return false;
});
if (isMacOS()) {
    chrome.action.setTitle({
        title: 'High Contrast (Cmd+Shift+F11)',
    });
}
//# sourceMappingURL=service_worker.rollup.js.map
