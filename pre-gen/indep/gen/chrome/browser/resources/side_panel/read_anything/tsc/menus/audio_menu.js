// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './grouped_action_menu.js';
import '../read_aloud/accent_menu.js';
import '../read_aloud/voice_selection_dialog.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { AudioBrowserProxyImpl } from '../read_aloud/audio_browser_proxy.js';
import { getVoiceDisplayName, getVoiceTitleAndNatureNaming } from '../read_aloud/voice_menu_display.js';
import { ReadAloudSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './audio_menu.html.js';
import { SettingsItemType } from './menu_util.js';
const AudioMenuElementBase = WebUiListenerMixinLit(CrLitElement);
export class AudioMenuElement extends AudioMenuElementBase {
    static get is() {
        return 'audio-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            selectedVoice: { type: Object },
            previewVoicePlaying: { type: Object },
            showVoiceSelectionDialog_: { type: Boolean },
            nonModal: { type: Boolean },
            groups_: { type: Array },
            enabledLangs: { type: Array },
            availableVoices: { type: Array },
            localeToDisplayName: { type: Object },
            selectedLang: { type: String },
            showAccentMenuDialog_: { type: Boolean },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    #enabledLangs_accessor_storage = [];
    get enabledLangs() { return this.#enabledLangs_accessor_storage; }
    set enabledLangs(value) { this.#enabledLangs_accessor_storage = value; }
    #availableVoices_accessor_storage = [];
    get availableVoices() { return this.#availableVoices_accessor_storage; }
    set availableVoices(value) { this.#availableVoices_accessor_storage = value; }
    #localeToDisplayName_accessor_storage = {};
    get localeToDisplayName() { return this.#localeToDisplayName_accessor_storage; }
    set localeToDisplayName(value) { this.#localeToDisplayName_accessor_storage = value; }
    #previewVoicePlaying_accessor_storage = null;
    get previewVoicePlaying() { return this.#previewVoicePlaying_accessor_storage; }
    set previewVoicePlaying(value) { this.#previewVoicePlaying_accessor_storage = value; }
    #selectedLang_accessor_storage = '';
    get selectedLang() { return this.#selectedLang_accessor_storage; }
    set selectedLang(value) { this.#selectedLang_accessor_storage = value; }
    #selectedVoice_accessor_storage = null;
    get selectedVoice() { return this.#selectedVoice_accessor_storage; }
    set selectedVoice(value) { this.#selectedVoice_accessor_storage = value; }
    #showAccentMenuDialog__accessor_storage = false;
    get showAccentMenuDialog_() { return this.#showAccentMenuDialog__accessor_storage; }
    set showAccentMenuDialog_(value) { this.#showAccentMenuDialog__accessor_storage = value; }
    #showVoiceSelectionDialog__accessor_storage = false;
    get showVoiceSelectionDialog_() { return this.#showVoiceSelectionDialog__accessor_storage; }
    set showVoiceSelectionDialog_(value) { this.#showVoiceSelectionDialog__accessor_storage = value; }
    audioBrowserProxy_ = AudioBrowserProxyImpl.getInstance();
    highlightOptions_ = [
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
    #groups__accessor_storage = [
        {
            header: {
                title: loadTimeData.getString('voiceLabel'),
                separator: false,
            },
            items: [
                {
                    // TODO (crbug.com/562064993): Include trailing ellipsis for
                    // ACTION menu items.
                    title: loadTimeData.getString('voiceSelectionLabel'),
                    icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                        'read-anything:voice-selection' :
                        'read-anything:voice-selection-old',
                    data: 'open-voice-selection-dialog',
                    itemType: SettingsItemType.ACTION,
                    eventName: 'open-voice-selection-dialog',
                    opensDialog: true,
                },
                {
                    title: loadTimeData.getString('accentMenuLabel'),
                    icon: 'read-anything:translate',
                    itemType: SettingsItemType.ACTION,
                    data: 'open-accent-menu',
                    eventName: 'open-accent-menu',
                    opensDialog: true,
                },
            ],
        },
        {
            header: {
                title: loadTimeData.getString('voiceHighlightLabel'),
                separator: true,
            },
            items: this.highlightOptions_,
            eventName: ToolbarEvent.HIGHLIGHT_CHANGE,
        },
    ];
    get groups_() { return this.#groups__accessor_storage; }
    set groups_(value) { this.#groups__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('settingsPrefs')) {
            this.updateOptionsForHighlight_();
        }
        if (changedProperties.has('selectedVoice')) {
            this.updateOptionsForVoice_();
        }
        if (changedProperties.has('settingsPrefs') ||
            changedProperties.has('selectedVoice')) {
            this.groups_ = [...this.groups_];
        }
    }
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    onHighlightChange_(event) {
        const data = event.detail.data;
        this.audioBrowserProxy_.onHighlightGranularityChanged(data);
        this.logger_.logSpeechSettingsChange(ReadAloudSettingsChange.HIGHLIGHT_CHANGE);
        this.logger_.logHighlightGranularity(data);
        this.settingsPrefs = {
            ...this.settingsPrefs,
            highlightGranularity: data,
        };
    }
    onOpenAccentMenu_() {
        this.showAccentMenuDialog_ = true;
    }
    onAccentMenuClose_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showAccentMenuDialog_ = false;
    }
    onOpenVoiceSelectionDialog_() {
        this.showVoiceSelectionDialog_ = true;
        this.fire(ToolbarEvent.VOICE_MENU_OPEN);
    }
    onVoiceSelectionDialogClose_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.showVoiceSelectionDialog_ = false;
        this.fire(ToolbarEvent.VOICE_MENU_CLOSE);
    }
    updateOptionsForHighlight_() {
        const currentHighlight = this.settingsPrefs.highlightGranularity;
        this.highlightOptions_.forEach(option => {
            option.selected = option.data === currentHighlight;
        });
    }
    updateOptionsForVoice_() {
        const voiceGroup = this.groups_[0];
        if (!voiceGroup || !voiceGroup.items[0]) {
            return;
        }
        const naming = getVoiceTitleAndNatureNaming(this.selectedVoice);
        voiceGroup.items[0] = {
            ...voiceGroup.items[0],
            title: getVoiceDisplayName(naming),
        };
        voiceGroup.items = [...voiceGroup.items];
    }
}
customElements.define(AudioMenuElement.is, AudioMenuElement);
