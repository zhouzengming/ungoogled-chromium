// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { getFaviconForPageURL, getUrlForCss } from '//resources/js/icon.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './composebox_favicon_group.css.js';
import { getHtml } from './composebox_favicon_group.html.js';
// Keep in sync with the per-coin `--skeleton-stagger-delay` rules in
// composebox_favicon_group.css.
const MAX_DISPLAY_COUNT = 3;
export class ComposeboxFaviconGroupElement extends CrLitElement {
    static get is() {
        return 'composebox-favicon-group';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            tabs: { type: Array },
            visibleTabs_: { type: Array },
            remainingCount_: { type: Number },
            submittedTabIds: { type: Object },
        };
    }
    #tabs_accessor_storage = [];
    get tabs() { return this.#tabs_accessor_storage; }
    set tabs(value) { this.#tabs_accessor_storage = value; }
    #submittedTabIds_accessor_storage = new Set();
    get submittedTabIds() { return this.#submittedTabIds_accessor_storage; }
    set submittedTabIds(value) { this.#submittedTabIds_accessor_storage = value; }
    #visibleTabs__accessor_storage = [];
    get visibleTabs_() { return this.#visibleTabs__accessor_storage; }
    set visibleTabs_(value) { this.#visibleTabs__accessor_storage = value; }
    #remainingCount__accessor_storage = 0;
    get remainingCount_() { return this.#remainingCount__accessor_storage; }
    set remainingCount_(value) { this.#remainingCount__accessor_storage = value; }
    loadedFavicons_ = new Map();
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('tabs')) {
            this.onTabsChanged_();
        }
    }
    onTabsChanged_() {
        this.visibleTabs_ = this.tabs.slice(0, MAX_DISPLAY_COUNT);
        this.remainingCount_ = Math.max(0, this.tabs.length - MAX_DISPLAY_COUNT);
        // Subscribe to live favicon updates for visible browser tabs. Firing
        // 'wait-for-tab-load' prompts the C++ backend to observe the active tab
        // and return the fully loaded favicon URL once ready.
        for (const tab of this.visibleTabs_) {
            if (tab.tabId && !this.submittedTabIds.has(tab.tabId)) {
                this.fire('wait-for-tab-load', {
                    tabId: tab.tabId,
                    onTabLoaded: (faviconDataUrl) => {
                        if (faviconDataUrl) {
                            const newMap = new Map(this.loadedFavicons_);
                            newMap.set(tab.tabId, getUrlForCss(faviconDataUrl));
                            this.loadedFavicons_ = newMap;
                            this.requestUpdate();
                        }
                    },
                });
            }
        }
    }
    // Shows a skeleton coin while the tab strip shows the tab as loading.
    isTabLoading_(tab) {
        return tab.isLoading && !this.submittedTabIds.has(tab.tabId);
    }
    getFaviconUrl_(tab) {
        if (typeof tab === 'object' && tab !== null) {
            const tabObj = tab;
            const urlStr = typeof tabObj.url === 'string' ? tabObj.url : tabObj.url.url;
            const isSubmitted = tabObj.tabId && this.submittedTabIds.has(tabObj.tabId);
            return (tabObj.tabId && !isSubmitted &&
                this.loadedFavicons_.get(tabObj.tabId)) ||
                getFaviconForPageURL(urlStr, false);
        }
        return getFaviconForPageURL(tab, false);
    }
}
customElements.define(ComposeboxFaviconGroupElement.is, ComposeboxFaviconGroupElement);
