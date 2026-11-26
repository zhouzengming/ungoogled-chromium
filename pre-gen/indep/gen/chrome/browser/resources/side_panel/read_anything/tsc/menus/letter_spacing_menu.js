// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './simple_action_menu.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './letter_spacing_menu.html.js';
import { getIndexOfSetting } from './menu_util.js';
const LetterSpacingMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the letter spacing menu.
export class LetterSpacingMenuElement extends LetterSpacingMenuElementBase {
    static get is() {
        return 'letter-spacing-menu';
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
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    #options__accessor_storage = [
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
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    onLetterSpacingChange_(event) {
        this.visualBrowserProxy_.onLetterSpacingChange(event.detail.data);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.LETTER_SPACING_CHANGE);
        this.fire(ToolbarEvent.CLOSE_ALL_MENUS);
    }
    restoredLetterSpacingIndex_() {
        return getIndexOfSetting(this.options_, this.settingsPrefs['letterSpacing']);
    }
}
customElements.define(LetterSpacingMenuElement.is, LetterSpacingMenuElement);
