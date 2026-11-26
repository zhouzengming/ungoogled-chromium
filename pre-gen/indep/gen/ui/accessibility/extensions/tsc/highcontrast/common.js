// Copyright (c) 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export const MIN_SCHEME = 0;
export const DEFAULT_SCHEME = 3;
export const MAX_SCHEME = 5;
export const $ = (id) => document.getElementById(id);
export const getEnabled = async () => {
    const { enabled } = await chrome.storage.local.get(['enabled']);
    return String(enabled) === 'true';
};
export const setEnabled = async (enabled) => {
    await chrome.storage.local.set({ enabled: String(enabled) });
};
export const getKeyAction = async () => {
    const { keyAction } = await chrome.storage.local.get(['keyaction']);
    if (keyAction === 'global' || keyAction === 'site') {
        return keyAction;
    }
    else {
        await chrome.storage.local.set({ keyaction: 'global' });
        return 'global';
    }
};
export const setKeyAction = async (keyAction) => {
    if (keyAction !== 'global' && keyAction !== 'site') {
        keyAction = 'global';
    }
    await chrome.storage.local.set({ keyaction: keyAction });
};
export const getDefaultScheme = async () => {
    const { scheme } = await chrome.storage.local.get(['scheme']);
    const validated = parseInt(scheme, 10);
    if (validated >= MIN_SCHEME && validated <= MAX_SCHEME) {
        return validated >= MIN_SCHEME ? validated : DEFAULT_SCHEME;
    }
    await chrome.storage.local.set({ scheme: DEFAULT_SCHEME });
    return DEFAULT_SCHEME;
};
export const setDefaultScheme = async (scheme) => {
    if (!(scheme >= MIN_SCHEME && scheme <= MAX_SCHEME)) {
        scheme = DEFAULT_SCHEME;
    }
    await chrome.storage.local.set({ scheme: scheme });
};
export const getSiteScheme = async (site) => {
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
export const setSiteScheme = async (site, scheme) => {
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
export const resetSiteSchemes = async () => {
    await chrome.storage.local.set({ siteschemes: '{}' });
};
export const siteFromUrl = (url) => new URL(url).hostname;
export const isDisallowedUrl = (url) => {
    return url.startsWith('chrome') || url.startsWith('about');
};
export function isMacOS() {
    const userAgentData = navigator.userAgentData;
    const platform = userAgentData?.platform ?? navigator.platform;
    return platform.toLowerCase().includes('mac');
}
