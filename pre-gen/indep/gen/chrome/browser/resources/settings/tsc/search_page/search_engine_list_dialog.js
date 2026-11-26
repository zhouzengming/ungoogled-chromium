// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview
 *
 * 'settings-search-engine-list-dialog' is the dialog shown for displaying the
 * list of search engines from which the user can choose a default.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import 'chrome://resources/cr_elements/cr_radio_button/cr_radio_button.js';
import 'chrome://resources/cr_elements/cr_radio_group/cr_radio_group.js';
import 'chrome://resources/cr_elements/policy/cr_policy_indicator.js';
import './search_engine_icon.js';
import { WebUiListenerMixinLit } from 'chrome://resources/cr_elements/web_ui_listener_mixin_lit.js';
import { assert } from 'chrome://resources/js/assert.js';
import { isRTL } from 'chrome://resources/js/util.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss } from './search_engine_list_dialog.css.js';
import { getHtml } from './search_engine_list_dialog.html.js';
import { ChoiceMadeLocation, SearchEnginesBrowserProxyImpl } from './search_engines_browser_proxy.js';
const SettingsSearchEngineListDialogElementBase = WebUiListenerMixinLit(CrLitElement);
export class SettingsSearchEngineListDialogElement extends SettingsSearchEngineListDialogElementBase {
    static get is() {
        return 'settings-search-engine-list-dialog';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            /**
             * List of search engines available for the user to select as their
             * default search provider in the choice dialog (includes prepopulated
             * regional, default, managed policy, and recommended policy search
             * engines; excludes custom user-added engines).
             */
            searchEngines: { type: Array },
            /**
             * The id of the search engine that is selected by the user.
             */
            selectedEngineId_: { type: String },
            /**
             * Whether the checkbox to save the search engine choice in guest mode
             * should be shown.
             */
            showSaveGuestChoice_: { type: Boolean },
            /**
             * State of the checkbox to save the search engine in guest mode. Null if
             * checkbox is not displayed.
             */
            saveGuestChoice_: { type: Boolean },
        };
    }
    #searchEngines_accessor_storage = [];
    get searchEngines() { return this.#searchEngines_accessor_storage; }
    set searchEngines(value) { this.#searchEngines_accessor_storage = value; }
    #selectedEngineId__accessor_storage = '';
    get selectedEngineId_() { return this.#selectedEngineId__accessor_storage; }
    set selectedEngineId_(value) { this.#selectedEngineId__accessor_storage = value; }
    #saveGuestChoice__accessor_storage = null;
    get saveGuestChoice_() { return this.#saveGuestChoice__accessor_storage; }
    set saveGuestChoice_(value) { this.#saveGuestChoice__accessor_storage = value; }
    #showSaveGuestChoice__accessor_storage = false;
    get showSaveGuestChoice_() { return this.#showSaveGuestChoice__accessor_storage; }
    set showSaveGuestChoice_(value) { this.#showSaveGuestChoice__accessor_storage = value; }
    browserProxy_ = SearchEnginesBrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.browserProxy_.getSaveGuestChoice().then((saveGuestChoice) => {
            this.saveGuestChoice_ = saveGuestChoice;
        });
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('searchEngines')) {
            this.searchEnginesChanged_();
        }
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has('saveGuestChoice_')) {
            this.showSaveGuestChoice_ = this.saveGuestChoice_ !== null;
        }
    }
    onSetAsDefaultClick_() {
        const searchEngine = this.searchEngines.find(engine => engine.id === parseInt(this.selectedEngineId_));
        assert(searchEngine);
        this.browserProxy_.setDefaultSearchEngine(searchEngine.id, ChoiceMadeLocation.SEARCH_SETTINGS, this.saveGuestChoice_);
        this.fire('search-engine-changed', { searchEngine });
        this.$.dialog.close();
    }
    onCancelClick_() {
        this.$.dialog.close();
    }
    onDialogCancel_() {
        this.$.dialog.close();
    }
    searchEnginesChanged_() {
        if (!this.searchEngines.length) {
            this.selectedEngineId_ = '';
            return;
        }
        const defaultSearchEngine = this.searchEngines.find(searchEngine => searchEngine.default);
        assert(defaultSearchEngine);
        this.selectedEngineId_ = defaultSearchEngine.id.toString();
    }
    onRadioGroupSelectedChanged_(e) {
        this.selectedEngineId_ = e.detail.value;
    }
    onSaveGuestChoiceCheckedChanged_(e) {
        this.saveGuestChoice_ = e.detail.value;
    }
    getPolicyIndicatorTooltipPosition_() {
        return isRTL() ? 'right' : 'left';
    }
}
customElements.define(SettingsSearchEngineListDialogElement.is, SettingsSearchEngineListDialogElement);
