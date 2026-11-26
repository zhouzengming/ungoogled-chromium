// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './simple_action_menu.js';
import '//resources/cr_elements/md_select.css.js';
import { I18nMixinLit } from '//resources/cr_elements/i18n_mixin_lit.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './font_menu.html.js';
import { getIndexOrDefault } from './menu_util.js';
const FontMenuElementBase = WebUiListenerMixinLit(I18nMixinLit(CrLitElement));
// Stores and propagates the data for the font menu used when read aloud is
// enabled.
export class FontMenuElement extends FontMenuElementBase {
    static get is() {
        return 'font-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            pageLanguage: { type: String },
            areFontsLoaded: { type: Boolean },
            options_: { type: Array },
            nonModal: { type: Boolean },
        };
    }
    #options__accessor_storage = [];
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    #areFontsLoaded_accessor_storage = false;
    get areFontsLoaded() { return this.#areFontsLoaded_accessor_storage; }
    set areFontsLoaded(value) { this.#areFontsLoaded_accessor_storage = value; }
    #pageLanguage_accessor_storage = '';
    get pageLanguage() { return this.#pageLanguage_accessor_storage; }
    set pageLanguage(value) { this.#pageLanguage_accessor_storage = value; }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    logger_ = ReadAnythingLogger.getInstance();
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('pageLanguage') ||
            changedProperties.has('areFontsLoaded') ||
            changedProperties.has('settingsPrefs')) {
            this.setFontOptions_(this.visualBrowserProxy_.getSupportedFonts());
        }
    }
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    currentFontIndex_() {
        return getIndexOrDefault(this.options_, this.visualBrowserProxy_.getFontName());
    }
    onFontChange_(event) {
        this.visualBrowserProxy_.onFontChange(event.detail.data);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.FONT_CHANGE);
        this.fire(ToolbarEvent.CLOSE_ALL_MENUS);
    }
    setFontOptions_(fontList) {
        this.options_ = fontList.map(font => ({
            title: this.getFontItemLabel_(font),
            data: font,
            style: `font-family:${font}`,
        }));
    }
    getFontItemLabel_(font) {
        // Before fonts are loaded, append the loading text to the font names
        // so that the names will appear in the font menu like:
        // Poppins (loading).
        return this.areFontsLoaded ?
            `${font}` :
            `${font}\u00A0${this.i18n('readingModeFontLoadingText')}`;
    }
}
customElements.define(FontMenuElement.is, FontMenuElement);
