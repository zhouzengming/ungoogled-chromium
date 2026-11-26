// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './grouped_action_menu.js';
import { I18nMixinLit } from '//resources/cr_elements/i18n_mixin_lit.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './text_menu.html.js';
const TextMenuElementBase = WebUiListenerMixinLit(I18nMixinLit(CrLitElement));
export class TextMenuElement extends TextMenuElementBase {
    static get is() {
        return 'text-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            nonModal: { type: Boolean },
            areFontsLoaded: { type: Boolean },
            pageLanguage: { type: String },
            groups_: { type: Array },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    #areFontsLoaded_accessor_storage = false;
    get areFontsLoaded() { return this.#areFontsLoaded_accessor_storage; }
    set areFontsLoaded(value) { this.#areFontsLoaded_accessor_storage = value; }
    #pageLanguage_accessor_storage = '';
    get pageLanguage() { return this.#pageLanguage_accessor_storage; }
    set pageLanguage(value) { this.#pageLanguage_accessor_storage = value; }
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    fontOptions_ = [];
    lineSpacingOptions_ = [
        {
            title: loadTimeData.getString('lineSpacingStandardTitle'),
            icon: 'read-anything:line-spacing-standard-custom',
            data: this.visualBrowserProxy_.getStandardLineSpacing(),
        },
        {
            title: loadTimeData.getString('lineSpacingLooseTitle'),
            icon: 'read-anything:line-spacing-loose-custom',
            data: this.visualBrowserProxy_.getLooseLineSpacing(),
        },
        {
            title: loadTimeData.getString('lineSpacingVeryLooseTitle'),
            icon: 'read-anything:line-spacing-very-loose-custom',
            data: this.visualBrowserProxy_.getVeryLooseLineSpacing(),
        },
    ];
    letterSpacingOptions_ = [
        {
            title: loadTimeData.getString('letterSpacingStandardTitle'),
            icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                'read-anything:format-letter-spacing-standard' :
                'read-anything:letter-spacing-standard-old',
            data: this.visualBrowserProxy_.getStandardLetterSpacing(),
        },
        {
            title: loadTimeData.getString('letterSpacingWideTitle'),
            icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                'read-anything:format-letter-spacing-wide' :
                'read-anything:letter-spacing-wide-old',
            data: this.visualBrowserProxy_.getWideLetterSpacing(),
        },
        {
            title: loadTimeData.getString('letterSpacingVeryWideTitle'),
            icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                'read-anything:format-letter-spacing-wider' :
                'read-anything:letter-spacing-very-wide-old',
            data: this.visualBrowserProxy_.getVeryWideLetterSpacing(),
        },
    ];
    #groups__accessor_storage = [
        {
            header: {
                title: loadTimeData.getString('fontNameTitle'),
                separator: false,
            },
            items: this.fontOptions_,
            eventName: ToolbarEvent.FONT,
        },
        {
            header: {
                title: loadTimeData.getString('lineSpacingTitle'),
                separator: true,
            },
            items: this.lineSpacingOptions_,
            eventName: ToolbarEvent.LINE_SPACING,
        },
        {
            header: {
                title: loadTimeData.getString('letterSpacingTitle'),
                separator: true,
            },
            items: this.letterSpacingOptions_,
            eventName: ToolbarEvent.LETTER_SPACING,
        },
    ];
    get groups_() { return this.#groups__accessor_storage; }
    set groups_(value) { this.#groups__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('pageLanguage') ||
            changedProperties.has('areFontsLoaded')) {
            this.computeFontOptions_();
        }
        if (changedProperties.has('settingsPrefs') ||
            changedProperties.has('pageLanguage') ||
            changedProperties.has('areFontsLoaded')) {
            this.updateOptionsForFont_();
            this.updateOptionsForLineSpacing_();
            this.updateOptionsForLetterSpacing_();
            this.groups_ = [...this.groups_];
        }
    }
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    onFontChange_(event) {
        const newFont = event.detail.data;
        this.visualBrowserProxy_.onFontChange(newFont);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.FONT_CHANGE);
    }
    onLineSpacingChange_(event) {
        const newSpacing = event.detail.data;
        this.visualBrowserProxy_.onLineSpacingChange(newSpacing);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.LINE_HEIGHT_CHANGE);
    }
    onLetterSpacingChange_(event) {
        const newSpacing = event.detail.data;
        this.visualBrowserProxy_.onLetterSpacingChange(newSpacing);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.LETTER_SPACING_CHANGE);
    }
    updateOptionsForFont_() {
        const currentFont = this.visualBrowserProxy_.getFontName();
        this.fontOptions_.forEach(option => {
            option.selected = option.data === currentFont;
        });
    }
    updateOptionsForLineSpacing_() {
        const currentSpacing = this.settingsPrefs.lineSpacing;
        this.lineSpacingOptions_.forEach(option => {
            option.selected = option.data === currentSpacing;
        });
    }
    updateOptionsForLetterSpacing_() {
        const currentSpacing = this.settingsPrefs.letterSpacing;
        this.letterSpacingOptions_.forEach(option => {
            option.selected = option.data === currentSpacing;
        });
    }
    computeFontOptions_() {
        const fonts = this.visualBrowserProxy_.getSupportedFonts();
        this.fontOptions_ = fonts.map(font => ({
            title: this.areFontsLoaded ?
                font :
                `${font}\u00A0${this.i18n('readingModeFontLoadingText')}`,
            data: font,
            style: `font-family:${font}`,
        }));
        if (this.groups_[0]) {
            this.groups_[0].items = this.fontOptions_;
        }
    }
}
customElements.define(TextMenuElement.is, TextMenuElement);
