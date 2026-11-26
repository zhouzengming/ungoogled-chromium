// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_components/searchbox/searchbox_dropdown.js';
import '//resources/cr_components/searchbox/searchbox_input.js';
import { SearchboxBrowserProxy } from '//resources/cr_components/searchbox/searchbox_browser_proxy.js';
import { SearchboxMixin } from '//resources/cr_components/searchbox/searchbox_mixin.js';
import { I18nMixinLit } from '//resources/cr_elements/i18n_mixin_lit.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './webui_browser_searchbox.css.js';
import { getHtml } from './webui_browser_searchbox.html.js';
import { SearchboxSelectionMixin } from '//resources/cr_components/searchbox/searchbox_selection_mixin.js';
const WebuiBrowserSearchboxElementBase = SearchboxMixin(SearchboxSelectionMixin(I18nMixinLit(WebUiListenerMixinLit(CrLitElement))));
export class WebuiBrowserSearchboxElement extends WebuiBrowserSearchboxElementBase {
    get isAimButtonVisible() {
        return false;
    }
    get showContextEntrypoint() {
        return false;
    }
    get virtualFocusEnabled() {
        return loadTimeData.valueExists('webuiBrowserVirtualFocusNavigation') &&
            loadTimeData.getBoolean('webuiBrowserVirtualFocusNavigation');
    }
    static get is() {
        return 'webui-browser-searchbox';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            placeholderText: {
                type: String,
                reflect: true,
                notify: true,
            },
            searchboxChromeRefreshTheming: {
                type: Boolean,
                reflect: true,
            },
            searchboxSteadyStateShadow: {
                type: Boolean,
                reflect: true,
            },
            searchboxIcon_: { type: String },
            searchboxVoiceSearchEnabled_: {
                type: Boolean,
                reflect: true,
            },
            searchboxLensSearchEnabled_: {
                type: Boolean,
                reflect: true,
            },
            useWebkitSearchIcons_: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    #placeholderText_accessor_storage = '';
    get placeholderText() { return this.#placeholderText_accessor_storage; }
    set placeholderText(value) { this.#placeholderText_accessor_storage = value; }
    #searchboxChromeRefreshTheming_accessor_storage = loadTimeData.getBoolean('searchboxCr23Theming');
    get searchboxChromeRefreshTheming() { return this.#searchboxChromeRefreshTheming_accessor_storage; }
    set searchboxChromeRefreshTheming(value) { this.#searchboxChromeRefreshTheming_accessor_storage = value; }
    #searchboxSteadyStateShadow_accessor_storage = loadTimeData.getBoolean('searchboxCr23SteadyStateShadow');
    get searchboxSteadyStateShadow() { return this.#searchboxSteadyStateShadow_accessor_storage; }
    set searchboxSteadyStateShadow(value) { this.#searchboxSteadyStateShadow_accessor_storage = value; }
    #searchboxIcon__accessor_storage = loadTimeData.getString('searchboxDefaultIcon');
    get searchboxIcon_() { return this.#searchboxIcon__accessor_storage; }
    set searchboxIcon_(value) { this.#searchboxIcon__accessor_storage = value; }
    #searchboxVoiceSearchEnabled__accessor_storage = loadTimeData.getBoolean('searchboxVoiceSearch');
    get searchboxVoiceSearchEnabled_() { return this.#searchboxVoiceSearchEnabled__accessor_storage; }
    set searchboxVoiceSearchEnabled_(value) { this.#searchboxVoiceSearchEnabled__accessor_storage = value; }
    #searchboxLensSearchEnabled__accessor_storage = loadTimeData.getBoolean('searchboxLensSearch');
    get searchboxLensSearchEnabled_() { return this.#searchboxLensSearchEnabled__accessor_storage; }
    set searchboxLensSearchEnabled_(value) { this.#searchboxLensSearchEnabled__accessor_storage = value; }
    #useWebkitSearchIcons__accessor_storage = false;
    get useWebkitSearchIcons_() { return this.#useWebkitSearchIcons__accessor_storage; }
    set useWebkitSearchIcons_(value) { this.#useWebkitSearchIcons__accessor_storage = value; }
    pageHandler_;
    callbackRouter_;
    autocompleteResultChangedListenerId_ = null;
    constructor() {
        super();
        const browserProxy = SearchboxBrowserProxy.getInstance();
        this.pageHandler_ = browserProxy.handler;
        this.callbackRouter_ = browserProxy.callbackRouter;
    }
    connectedCallback() {
        super.connectedCallback();
        this.autocompleteResultChangedListenerId_ =
            this.callbackRouter_.autocompleteResultChanged.addListener(this.onAutocompleteResultChanged.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.autocompleteResultChangedListenerId_ !== null) {
            this.callbackRouter_.removeListener(this.autocompleteResultChangedListenerId_);
            this.autocompleteResultChangedListenerId_ = null;
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('searchboxChromeRefreshTheming')) {
            this.useWebkitSearchIcons_ = this.searchboxChromeRefreshTheming;
        }
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.initialInputScrollHeight = this.$.input.scrollHeight;
    }
    focusInput() {
        this.$.input.focus();
    }
    setInputText(text) {
        this.$.input.setInputText(text);
    }
    selectAll() {
        this.$.input.select();
    }
    //========================================================================
    // SearchboxMixin abstract method implementations
    //========================================================================
    getInputElement() {
        return this.$.input;
    }
    getDropdownElement() {
        return this.$.matches;
    }
    getWrapperElement() {
        return this.$.inputWrapper;
    }
    pageHandler() {
        return this.pageHandler_;
    }
    isInputEmpty() {
        // If this is called before first render, the input element will not exist.
        if (!this.shadowRoot?.querySelector('#input') || !this.$.input ||
            !this.$.input.lastInput()) {
            return true;
        }
        return !this.$.input.lastInput().text.trim();
    }
    shouldShowVoiceLens_(isEnabled) {
        if (!isEnabled) {
            return false;
        }
        if (!this.isInputEmpty()) {
            return false;
        }
        return true;
    }
    //========================================================================
    // Event handlers
    //========================================================================
    onInputFocusin_() {
        this.pageHandler_.onFocusChanged(true);
    }
    computePlaceholderText_() {
        if (this.placeholderText) {
            return this.placeholderText;
        }
        return this.i18n('searchBoxHint');
    }
    onSearchboxInputTextUpdated_(e) {
        this.onSearchboxInputTextUpdated(e);
    }
    onVoiceSearchClick_() {
        this.dispatchEvent(new Event('open-voice-search'));
    }
    onLensSearchClick_() {
        this.dropdownIsVisible = false;
        this.dispatchEvent(new Event('open-lens-search'));
    }
}
customElements.define(WebuiBrowserSearchboxElement.is, WebuiBrowserSearchboxElement);
