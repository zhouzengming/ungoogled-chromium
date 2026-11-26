// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_components/composebox/composebox_favicon_group.js';
import 'chrome://resources/cr_components/composebox/composebox_tab_favicon.js';
import 'chrome://resources/cr_components/composebox/icons.html.js';
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/icons.html.js';
import { recordTabPickerTabSelected, TabPickerSurface } from 'chrome://resources/cr_components/composebox/common.js';
import { AnchorAlignment } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import { I18nMixinLit } from 'chrome://resources/cr_elements/i18n_mixin_lit.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss } from './tab_picker_app.css.js';
import { getHtml } from './tab_picker_app.html.js';
import { TabPickerBrowserProxyImpl } from './tab_picker_browser_proxy.js';
const TabPickerAppElementBase = I18nMixinLit(CrLitElement);
export class TabPickerAppElement extends TabPickerAppElementBase {
    static get is() {
        return 'tab-picker-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            tabSuggestions: { type: Array },
            selectedTabs: { type: Array },
            tabMenuOpen: { type: Boolean },
            recentTabId: { type: Number },
            sharingTabsText_: { type: String },
            useUnbounded: {
                type: Boolean,
                reflect: true,
            },
            darkMode: {
                type: Boolean,
                reflect: true,
                attribute: 'dark-mode',
            },
        };
    }
    #tabSuggestions_accessor_storage = [];
    get tabSuggestions() { return this.#tabSuggestions_accessor_storage; }
    set tabSuggestions(value) { this.#tabSuggestions_accessor_storage = value; }
    #selectedTabs_accessor_storage = [];
    get selectedTabs() { return this.#selectedTabs_accessor_storage; }
    set selectedTabs(value) { this.#selectedTabs_accessor_storage = value; }
    #tabMenuOpen_accessor_storage = false;
    get tabMenuOpen() { return this.#tabMenuOpen_accessor_storage; }
    set tabMenuOpen(value) { this.#tabMenuOpen_accessor_storage = value; }
    #recentTabId_accessor_storage = null;
    get recentTabId() { return this.#recentTabId_accessor_storage; }
    set recentTabId(value) { this.#recentTabId_accessor_storage = value; }
    #sharingTabsText__accessor_storage = '';
    get sharingTabsText_() { return this.#sharingTabsText__accessor_storage; }
    set sharingTabsText_(value) { this.#sharingTabsText__accessor_storage = value; }
    #useUnbounded_accessor_storage = true;
    get useUnbounded() { return this.#useUnbounded_accessor_storage; }
    set useUnbounded(value) { this.#useUnbounded_accessor_storage = value; }
    #darkMode_accessor_storage = false;
    get darkMode() { return this.#darkMode_accessor_storage; }
    set darkMode(value) { this.#darkMode_accessor_storage = value; }
    closeTimer_ = null;
    browserProxy_ = TabPickerBrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.darkMode = this.isDarkModeEnabled_();
        this.updateSharingTabsText_();
        this.fetchTabSuggestions_();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.cancelCloseTimer_();
    }
    firstUpdated() {
        this.initializeUnboundedMenu_();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('selectedTabs')) {
            this.updateSharingTabsText_();
        }
        if (changedProperties.has('useUnbounded')) {
            this.initializeUnboundedMenu_();
        }
    }
    async initializeUnboundedMenu_() {
        if (this.isUnboundedMenuEnabled_()) {
            await this.$.tabMenu.setUnbounded();
        }
    }
    async fetchTabSuggestions_() {
        try {
            const { tabs } = await this.browserProxy_.getRecentTabs();
            this.tabSuggestions = tabs || [];
            if (this.tabSuggestions.length > 0) {
                this.recentTabId = this.tabSuggestions[0].tabId;
            }
        }
        catch {
            // Standalone or test environment without proxy implementation.
        }
    }
    isUnboundedMenuEnabled_() {
        if (loadTimeData.isInitialized() &&
            loadTimeData.valueExists('contextualTasksUnboundedMenuEnabled') &&
            !loadTimeData.getBoolean('contextualTasksUnboundedMenuEnabled')) {
            return false;
        }
        return this.useUnbounded;
    }
    isDarkModeEnabled_() {
        const params = new URLSearchParams(window.location.search);
        return params.get('cs') === '1';
    }
    get hasTabSuggestions_() {
        return this.tabSuggestions.length > 0;
    }
    updateSharingTabsText_() {
        const count = this.selectedTabs.length;
        if (count === 0) {
            const hasI18n = loadTimeData.isInitialized();
            this.sharingTabsText_ =
                (hasI18n && this.i18nExists('shareTabs') && this.i18n('shareTabs')) ||
                    (hasI18n && this.i18nExists('addTabs') && this.i18n('addTabs')) ||
                    'Add tabs';
            return;
        }
        this.browserProxy_.getPluralString('sharingTabs', count)
            .then((s) => {
            this.sharingTabsText_ = s;
        })
            .catch(() => {
            this.sharingTabsText_ =
                count === 1 ? 'Sharing 1 tab' : `Sharing ${count} tabs`;
        });
    }
    getRecentTabsSuffix_() {
        const hasI18n = loadTimeData.isInitialized();
        return (hasI18n && this.i18nExists('recentTabsSuffix') &&
            this.i18n('recentTabsSuffix')) ||
            'Recent';
    }
    isRecentTab_(tabId) {
        return tabId === this.recentTabId;
    }
    isTabSelected_(tab) {
        return this.selectedTabs.some(t => t.tabId === tab.tabId);
    }
    onShareTabsRowPointerenter_() {
        this.cancelCloseTimer_();
        this.openTabMenu_();
    }
    onShareTabsRowPointerleave_() {
        this.$.shareTabsTrigger.blur();
        this.scheduleCloseTimer_();
    }
    onShareTabsRowClick_() {
        if (this.$.tabMenu.open) {
            this.$.tabMenu.close();
        }
        else {
            this.openTabMenu_();
        }
    }
    onShareTabsRowKeydown_(e) {
        if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openTabMenu_();
        }
    }
    onMenuPointerenter_() {
        this.cancelCloseTimer_();
    }
    onMenuPointerleave_() {
        this.scheduleCloseTimer_();
    }
    onMenuClose_() {
        this.tabMenuOpen = false;
        requestAnimationFrame(() => {
            this.$.shareTabsTrigger.blur();
        });
    }
    onTabClick_(e) {
        e.stopPropagation();
        const target = e.currentTarget;
        const index = Number(target.dataset['index']);
        const tab = this.tabSuggestions[index];
        if (!tab) {
            return;
        }
        const isSelected = this.isTabSelected_(tab);
        if (isSelected) {
            this.selectedTabs = this.selectedTabs.filter(t => t.tabId !== tab.tabId);
            this.browserProxy_.deleteTabContext(tab.tabId);
        }
        else {
            this.selectedTabs = [...this.selectedTabs, tab];
            this.browserProxy_.addTabContext(tab.tabId);
            const hasActiveTab = this.tabSuggestions.some(t => t.showInCurrentTabChip);
            recordTabPickerTabSelected(TabPickerSurface.CONTEXTUAL_TASKS_EXTENSION, tab.showInCurrentTabChip, index, hasActiveTab);
        }
        this.fire('tab-selected', { tab, selected: !isSelected });
    }
    async openTabMenu_() {
        if (!this.hasTabSuggestions_ || this.$.tabMenu.open) {
            return;
        }
        if (this.isUnboundedMenuEnabled_() &&
            !this.$.tabMenu.getDialog().hasAttribute('unbounded')) {
            await this.$.tabMenu.setUnbounded();
        }
        this.tabMenuOpen = true;
        this.$.tabMenu.showAt(this.$.shareTabsTrigger, {
            anchorAlignmentX: AnchorAlignment.AFTER_END,
            anchorAlignmentY: AnchorAlignment.AFTER_START,
            noOffset: true,
        });
    }
    scheduleCloseTimer_() {
        this.cancelCloseTimer_();
        this.closeTimer_ = window.setTimeout(() => {
            if (this.$.tabMenu.open) {
                this.$.tabMenu.close();
                this.$.shareTabsTrigger.blur();
            }
        }, 300);
    }
    cancelCloseTimer_() {
        if (this.closeTimer_ !== null) {
            window.clearTimeout(this.closeTimer_);
            this.closeTimer_ = null;
        }
    }
    setDarkModeForTesting(darkMode) {
        this.darkMode = darkMode;
    }
    getDarkModeForTesting() {
        return this.darkMode;
    }
}
customElements.define(TabPickerAppElement.is, TabPickerAppElement);
