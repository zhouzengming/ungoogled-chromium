// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './simple_action_menu.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { DEFAULT_SETTINGS } from '../content/read_anything_types.js';
import { AudioBrowserProxyImpl } from '../read_aloud/audio_browser_proxy.js';
import { ReadAloudSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getIndexOfSetting } from './menu_util.js';
import { getHtml } from './rate_menu.html.js';
// 3x and 4x speeds are hidden on non-ChromeOS because natural voices on
// non-ChromeOS do not currently support 3x and 4x speeds.
export const RATE_OPTIONS = [
    0.5,
    0.8,
    1,
    1.2,
    1.5,
    2,
    // 
];
const RateMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the speech rate menu.
export class RateMenuElement extends RateMenuElementBase {
    static get is() {
        return 'rate-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            options_: { type: Array },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    audioBrowserProxy_ = AudioBrowserProxyImpl.getInstance();
    #options__accessor_storage = RATE_OPTIONS.map(rate => {
        return {
            title: loadTimeData.getStringF('voiceSpeedOptionTitle', rate.toLocaleString()),
            data: rate,
        };
    });
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    open(anchor) {
        this.$.menu.open(anchor);
    }
    restoredRateIndex_() {
        return getIndexOfSetting(this.options_, this.settingsPrefs['speechRate']);
    }
    onRateChange_(event) {
        this.audioBrowserProxy_.onSpeechRateChange(event.detail.data);
        this.logger_.logSpeechSettingsChange(ReadAloudSettingsChange.VOICE_SPEED_CHANGE);
        // Log which rate is chosen by index rather than the rate value itself.
        this.logger_.logVoiceSpeed(this.$.menu.currentSelectedIndex);
    }
}
customElements.define(RateMenuElement.is, RateMenuElement);
