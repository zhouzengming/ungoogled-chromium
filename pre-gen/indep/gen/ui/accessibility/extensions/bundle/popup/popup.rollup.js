// Copyright (c) 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const MIN_SCHEME = 0;
const DEFAULT_SCHEME = 3;
const MAX_SCHEME = 5;
const $ = (id) => document.getElementById(id);
const getEnabled = async () => {
    const { enabled } = await chrome.storage.local.get(['enabled']);
    return String(enabled) === 'true';
};
const setEnabled = async (enabled) => {
    await chrome.storage.local.set({ enabled: String(enabled) });
};
const getKeyAction = async () => {
    const { keyAction } = await chrome.storage.local.get(['keyaction']);
    if (keyAction === 'global' || keyAction === 'site') {
        return keyAction;
    }
    else {
        await chrome.storage.local.set({ keyaction: 'global' });
        return 'global';
    }
};
const setKeyAction = async (keyAction) => {
    if (keyAction !== 'global' && keyAction !== 'site') {
        keyAction = 'global';
    }
    await chrome.storage.local.set({ keyaction: keyAction });
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
const setDefaultScheme = async (scheme) => {
    if (!(scheme >= MIN_SCHEME && scheme <= MAX_SCHEME)) {
        scheme = DEFAULT_SCHEME;
    }
    await chrome.storage.local.set({ scheme: scheme });
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
const resetSiteSchemes = async () => {
    await chrome.storage.local.set({ siteschemes: '{}' });
};
const siteFromUrl = (url) => new URL(url).hostname;
const isDisallowedUrl = (url) => {
    return url.startsWith('chrome') || url.startsWith('about');
};
function isMacOS() {
    const userAgentData = navigator.userAgentData;
    const platform = userAgentData?.platform ?? navigator.platform;
    return platform.toLowerCase().includes('mac');
}

// Copyright (c) 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license.
let site = null;
let key1;
let key2;
const setRadio = (name, value, disabled) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach((radio) => {
        radio.checked = radio.value == String(value);
        if (disabled !== undefined) {
            radio.disabled = disabled;
        }
    });
};
const update = async () => {
    const enabled = await getEnabled();
    document.body.className = enabled ? '' : 'disabled';
    const title = $('title');
    const toggle = $('toggle');
    const subcontrols = $('subcontrols');
    const makeDefault = $('make_default');
    if (enabled) {
        title.innerText = chrome.i18n.getMessage('highcontrast_enabled');
        toggle.innerHTML = `<b>${chrome.i18n.getMessage('highcontrast_disable')}</b><br><span class="kb">(${key1})</span>`;
        subcontrols.style.display = 'block';
    }
    else {
        title.innerText = chrome.i18n.getMessage('highcontrast_disabled');
        toggle.innerHTML = `<b>${chrome.i18n.getMessage('highcontrast_enable')}</b><br><span class="kb">(${key1})</span>`;
        subcontrols.style.display = 'none';
    }
    const keyActionValue = await getKeyAction();
    setRadio('keyaction', keyActionValue, !enabled);
    if (site) {
        const [siteScheme, defaultScheme] = await Promise.all([
            getSiteScheme(site),
            getDefaultScheme(),
        ]);
        setRadio('scheme', siteScheme, !enabled);
        if (makeDefault)
            makeDefault.disabled = siteScheme === defaultScheme;
    }
    else {
        const defaultScheme = await getDefaultScheme();
        setRadio('scheme', defaultScheme, !enabled);
    }
    const scheme = site ? await getSiteScheme(site) : await getDefaultScheme();
    document.documentElement.setAttribute('hc', enabled ? 'a' + scheme : 'a0');
};
const onToggle = async () => {
    const current = await getEnabled();
    await setEnabled(!current);
    await update();
};
const onForget = async () => {
    await resetSiteSchemes();
    await update();
};
const onRadioChange = async (name, value) => {
    switch (name) {
        case 'keyaction':
            await setKeyAction(value);
            break;
        case 'scheme':
            const numeric = parseInt(value, 10);
            if (site) {
                await setSiteScheme(site, numeric);
            }
            else {
                await setDefaultScheme(numeric);
            }
            break;
    }
    await update();
};
const onMakeDefault = async () => {
    if (!site)
        return;
    const siteScheme = await getSiteScheme(site);
    await setDefaultScheme(siteScheme);
    await update();
};
const addRadioListeners = (name) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach((radio) => {
        const handler = (evt) => {
            const target = evt.target;
            onRadioChange(target.name, target.value);
        };
        radio.addEventListener('change', handler, false);
        radio.addEventListener('click', handler, false);
    });
};
const setKeyboardShortcuts = () => {
    if (isMacOS()) {
        key1 = '&#x2318;+Shift+F11';
        key2 = '&#x2318;+Shift+F12';
    }
    else {
        key1 = 'Shift+F11';
        key2 = 'Shift+F12';
    }
};
const init = async () => {
    const i18nElements = document.querySelectorAll('[i18n-content]');
    i18nElements.forEach((elem) => {
        const msg = elem.getAttribute('i18n-content');
        if (msg) {
            elem.innerHTML = chrome.i18n.getMessage(msg);
        }
    });
    addRadioListeners('keyaction');
    addRadioListeners('scheme');
    $('toggle')?.addEventListener('click', onToggle, false);
    $('make_default')?.addEventListener('click', onMakeDefault, false);
    $('forget')?.addEventListener('click', onForget, false);
    setKeyboardShortcuts();
    const win = await chrome.windows.getLastFocused({ populate: true });
    const activeTab = win.tabs?.find((tab) => tab.active);
    const schemeTitle = $('scheme_title');
    const makeDefault = $('make_default');
    if (activeTab?.url && !isDisallowedUrl(activeTab.url)) {
        site = siteFromUrl(activeTab.url);
        schemeTitle.innerHTML = chrome.i18n.getMessage('highcontrast_', `<b>${site}</b>:<br><span class="kb">(${key2})</span>`);
        makeDefault.style.display = 'block';
    }
    else {
        schemeTitle.innerText = chrome.i18n.getMessage('highcontrast_default');
        makeDefault.style.display = 'none';
    }
    await update();
};
window.addEventListener('load', init, false);
//# sourceMappingURL=popup.rollup.js.map
