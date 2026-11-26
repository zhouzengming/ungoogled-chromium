// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './simple_action_menu.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { AudioBrowserProxyImpl } from '../read_aloud/audio_browser_proxy.js';
import { ReadAloudSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './highlight_menu.html.js';
import { getIndexOfSetting } from './menu_util.js';
const HighlightMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the highlight menu.
export class HighlightMenuElement extends HighlightMenuElementBase {
    static get is() {
        return 'highlight-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            nonModal: { type: Boolean },
            options_: { type: Array },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    audioBrowserProxy_ = AudioBrowserProxyImpl.getInstance();
    #options__accessor_storage = [
        {
            title: loadTimeData.getString('autoHighlightTitle'),
            data: this.audioBrowserProxy_.getAutoHighlighting(),
        },
        {
            title: loadTimeData.getString('wordHighlightTitle'),
            data: this.audioBrowserProxy_.getWordHighlighting(),
        },
        ...(this.audioBrowserProxy_.isPhraseHighlightingEnabled() ? [{
                title: loadTimeData.getString('phraseHighlightTitle'),
                data: this.audioBrowserProxy_.getPhraseHighlighting(),
            }] : []),
        {
            title: loadTimeData.getString('sentenceHighlightTitle'),
            data: this.audioBrowserProxy_.getSentenceHighlighting(),
        },
        {
            title: loadTimeData.getString('noHighlightTitle'),
            data: this.audioBrowserProxy_.getNoHighlighting(),
        },
    ];
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    restoredHighlightIndex_() {
        return getIndexOfSetting(this.options_, this.settingsPrefs['highlightGranularity']);
    }
    onHighlightChange_(event) {
        this.audioBrowserProxy_.onHighlightGranularityChanged(event.detail.data);
        this.logger_.logSpeechSettingsChange(ReadAloudSettingsChange.HIGHLIGHT_CHANGE);
        this.logger_.logHighlightGranularity(event.detail.data);
        this.fire(ToolbarEvent.CLOSE_ALL_MENUS);
    }
}
customElements.define(HighlightMenuElement.is, HighlightMenuElement);
