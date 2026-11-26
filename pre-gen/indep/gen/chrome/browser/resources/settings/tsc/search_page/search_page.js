// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview
 * 'settings-search-page' is the settings page containing search settings.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_toast/cr_toast.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import '/shared/settings/controls/extension_controlled_indicator.js';
import './extension_controlled_message.js';
import './search_engine_icon.js';
import './search_engine_list_dialog.js';
import '../settings_page/settings_section.js';
import { PrefServiceObserverMixinLit } from '/shared/settings/prefs2/pref_service_observer_mixin_lit.js';
import { I18nMixinLit } from 'chrome://resources/cr_elements/i18n_mixin_lit.js';
import { WebUiListenerMixinLit } from 'chrome://resources/cr_elements/web_ui_listener_mixin_lit.js';
import { assert } from 'chrome://resources/js/assert.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { loadTimeData } from '../i18n_setup.js';
import { routes } from '../route.js';
import { Router } from '../router.js';
import { SettingsViewMixinLit } from '../settings_page/settings_view_mixin_lit.js';
import { SearchEnginesBrowserProxyImpl, SearchEnginesInteractions } from './search_engines_browser_proxy.js';
import { getCss } from './search_page.css.js';
import { getHtml } from './search_page.html.js';
const SettingsSearchPageElementBase = PrefServiceObserverMixinLit(SettingsViewMixinLit(WebUiListenerMixinLit(I18nMixinLit(CrLitElement))));
export class SettingsSearchPageElement extends SettingsSearchPageElementBase {
    static get is() {
        return 'settings-search-page';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            defaultSearchProviderDataPref_: { type: Object },
            /**
             * List of search engines available in the search engine list dialog.
             */
            searchEngines_: { type: Array },
            // The selected default search engine.
            defaultSearchEngine_: { type: Object },
            // The title of the page and the default search engine card.
            searchPageTitle_: { type: String },
            // Boolean to check whether we need to show the dialog or not.
            showSearchEngineListDialog_: { type: Boolean },
            // The label of the confirmation toast that is displayed when the user
            // chooses a default search engine.
            confirmationToastLabel_: { type: String },
            // With this enabled, the shortcuts settings are present on this page
            // rather than the search engines subpage.
            searchSettingsUpdateEnabled_: { type: Boolean },
        };
    }
    #defaultSearchProviderDataPref__accessor_storage;
    get defaultSearchProviderDataPref_() { return this.#defaultSearchProviderDataPref__accessor_storage; }
    set defaultSearchProviderDataPref_(value) { this.#defaultSearchProviderDataPref__accessor_storage = value; }
    #searchEngines__accessor_storage = [];
    get searchEngines_() { return this.#searchEngines__accessor_storage; }
    set searchEngines_(value) { this.#searchEngines__accessor_storage = value; }
    #showSearchEngineListDialog__accessor_storage = false;
    get showSearchEngineListDialog_() { return this.#showSearchEngineListDialog__accessor_storage; }
    set showSearchEngineListDialog_(value) { this.#showSearchEngineListDialog__accessor_storage = value; }
    #defaultSearchEngine__accessor_storage = null;
    get defaultSearchEngine_() { return this.#defaultSearchEngine__accessor_storage; }
    set defaultSearchEngine_(value) { this.#defaultSearchEngine__accessor_storage = value; }
    #searchSettingsUpdateEnabled__accessor_storage = loadTimeData.getBoolean('searchSettingsUpdate');
    get searchSettingsUpdateEnabled_() { return this.#searchSettingsUpdateEnabled__accessor_storage; }
    set searchSettingsUpdateEnabled_(value) { this.#searchSettingsUpdateEnabled__accessor_storage = value; }
    #searchPageTitle__accessor_storage = '';
    get searchPageTitle_() { return this.#searchPageTitle__accessor_storage; }
    set searchPageTitle_(value) { this.#searchPageTitle__accessor_storage = value; }
    #confirmationToastLabel__accessor_storage = '';
    get confirmationToastLabel_() { return this.#confirmationToastLabel__accessor_storage; }
    set confirmationToastLabel_(value) { this.#confirmationToastLabel__accessor_storage = value; }
    browserProxy_ = SearchEnginesBrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.mirrorPref('default_search_provider_data.template_url_data', 'defaultSearchProviderDataPref_');
        if (this.searchSettingsUpdateEnabled_) {
            // Only prepopulated regional search engines, the current default search
            // engine, and enterprise policy search engines (both mandatory and
            // recommended) should be visible in the search engine list dialog.
            // Standard custom user-added search engines are excluded. No need to
            // sort these since `activeSiteShortcuts` is already in the expected order
            // (sorted regional search engines first, then policy engines and the
            // default engine if not already in the list).
            const updateSearchEngines = (categorizedTemplateUrls) => {
                this.searchEngines_ =
                    categorizedTemplateUrls.activeSiteShortcuts.filter(engine => engine.isPrepopulated || engine.default ||
                        engine.isManaged || engine.isRecommendedFromPolicy);
            };
            this.browserProxy_.getCategorizedTemplateUrls().then(updateSearchEngines);
            this.addWebUiListener('search-engines-changed', updateSearchEngines);
            return;
        }
        const updateSearchEngines = (searchEngines) => {
            this.searchEngines_ = searchEngines.defaults;
        };
        this.browserProxy_.getSearchEnginesList().then(updateSearchEngines);
        this.addWebUiListener('search-engines-changed', updateSearchEngines);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has('searchEngines_')) {
            this.defaultSearchEngine_ = this.computeDefaultSearchEngine_();
        }
        if (changedPrivateProperties.has('searchSettingsUpdateEnabled_')) {
            this.searchPageTitle_ = this.computeSearchPageTitle_();
        }
    }
    onManageSearchEnginesClick_() {
        this.browserProxy_.recordSearchEnginesPageHistogram(SearchEnginesInteractions.SUBPAGE_NAVIGATED);
        Router.getInstance().navigateTo(routes.SEARCH_ENGINES);
    }
    isDefaultSearchControlledByPolicy_() {
        return !!this.defaultSearchProviderDataPref_ &&
            this.defaultSearchProviderDataPref_.controlledBy ===
                chrome.settingsPrivate.ControlledBy.USER_POLICY;
    }
    isDefaultSearchEngineEnforced_() {
        return !!this.defaultSearchProviderDataPref_ &&
            this.defaultSearchProviderDataPref_.enforcement ===
                chrome.settingsPrivate.Enforcement.ENFORCED;
    }
    computeSearchPageTitle_() {
        return this.i18n(this.searchSettingsUpdateEnabled_ ? 'defaultSearch' :
            'searchPageTitle');
    }
    computeDefaultSearchEngine_() {
        if (!this.searchEngines_.length) {
            return null;
        }
        return this.searchEngines_.find(engine => engine.default) || null;
    }
    onOpenDialogButtonClick_() {
        this.showSearchEngineListDialog_ = true;
        chrome.metricsPrivate.recordUserAction('ChooseDefaultSearchEngine');
    }
    onSearchEngineChanged_(e) {
        this.confirmationToastLabel_ = this.i18n('searchEnginesConfirmationToastLabel', e.detail.searchEngine.name);
        const confirmationToast = this.shadowRoot.querySelector('#confirmationToast');
        assert(confirmationToast);
        confirmationToast.show();
    }
    onSearchEngineListDialogClose_() {
        this.showSearchEngineListDialog_ = false;
    }
    // SettingsViewMixin implementation.
    getFocusConfig() {
        const map = new Map();
        if (!this.searchSettingsUpdateEnabled_) {
            map.set(routes.SEARCH_ENGINES.path, '#enginesSubpageTrigger');
        }
        return map;
    }
    // SettingsViewMixin implementation.
    getAssociatedControlFor(childViewId) {
        assert(!this.searchSettingsUpdateEnabled_);
        assert(childViewId === 'searchEngines');
        const control = this.shadowRoot.querySelector('#enginesSubpageTrigger');
        assert(control, `Failed to find associated control for child '${childViewId}'`);
        return control;
    }
}
customElements.define(SettingsSearchPageElement.is, SettingsSearchPageElement);
