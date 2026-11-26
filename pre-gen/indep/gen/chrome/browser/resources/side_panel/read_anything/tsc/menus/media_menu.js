// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Media menu element used for the improved Read Aloud UI.
import '//resources/cr_elements/cr_action_menu/cr_action_menu.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_lazy_render/cr_lazy_render_lit.js';
import '//resources/cr_elements/cr_toggle/cr_toggle.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { DEFAULT_SETTINGS, SettingsOption, ToolbarEvent } from '../content/read_anything_types.js';
import { openMenu } from '../shared/common.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getCss } from './action_menu.css.js';
import { getHtml } from './media_menu.html.js';
import { SettingsItemType } from './menu_util.js';
const MediaMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the media menu.
export class MediaMenuElement extends MediaMenuElementBase {
    static get is() {
        return 'media-menu';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            nonModal: { type: Boolean },
            isSpeechActive: { type: Boolean },
            options_: { type: Array },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    #isSpeechActive_accessor_storage = false;
    get isSpeechActive() { return this.#isSpeechActive_accessor_storage; }
    set isSpeechActive(value) { this.#isSpeechActive_accessor_storage = value; }
    #options__accessor_storage = [];
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('settingsPrefs') ||
            changedProperties.has('isSpeechActive')) {
            this.initializeMenuOptions_();
        }
    }
    initializeMenuOptions_() {
        this.options_ = [
            {
                id: SettingsOption.LINKS,
                icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                    'read-anything:link' :
                    'read-anything:links-enabled-old',
                title: loadTimeData.getString('linksLabel'),
                itemType: SettingsItemType.TOGGLE,
                checked: this.settingsPrefs.linksEnabled,
                disabled: this.isSpeechActive,
                ariaLabel: this.getLinkItemLabels_(),
            },
            {
                id: SettingsOption.IMAGES,
                icon: loadTimeData.getBoolean('webuiRoundedIconsEnabled') ?
                    'read-anything:image' :
                    'read-anything:images-enabled-old',
                title: loadTimeData.getString('imagesLabel'),
                itemType: SettingsItemType.TOGGLE,
                checked: this.settingsPrefs.imagesEnabled,
                disabled: this.isSpeechActive,
                ariaLabel: this.getImageItemLabels_(),
            },
        ];
    }
    open(anchor, showAtConfig) {
        openMenu(this.$.lazyMenu.get(), anchor, showAtConfig, /* onShow= */ undefined, this.nonModal);
    }
    close() {
        this.$.lazyMenu.get().close();
    }
    getImageItemLabels_() {
        if (this.visualBrowserProxy_.isImagesEnabled()) {
            return loadTimeData.getString('disableImagesLabel');
        }
        return loadTimeData.getString('enableImagesLabel');
    }
    getLinkItemLabels_() {
        if (this.visualBrowserProxy_.isLinksEnabled()) {
            return loadTimeData.getString('disableLinksLabel');
        }
        return loadTimeData.getString('enableLinksLabel');
    }
    onToggleItemClick_(e) {
        e.stopImmediatePropagation();
        if (this.isSpeechActive) {
            return;
        }
        const currentTarget = e.currentTarget;
        const index = Number.parseInt(currentTarget.dataset['index']);
        const item = this.options_[index];
        if (!item || item.disabled) {
            return;
        }
        if (item.id === SettingsOption.LINKS) {
            this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.LINKS_ENABLED_CHANGE);
            this.visualBrowserProxy_.onLinksEnabledToggled();
            this.fire(ToolbarEvent.LINKS);
            item.ariaLabel = this.getLinkItemLabels_();
            item.checked = this.visualBrowserProxy_.isLinksEnabled();
        }
        else if (item.id === SettingsOption.IMAGES) {
            this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.IMAGES_ENABLED_CHANGE);
            this.visualBrowserProxy_.onImagesEnabledToggled();
            this.fire(ToolbarEvent.IMAGES);
            item.ariaLabel = this.getImageItemLabels_();
            item.checked = this.visualBrowserProxy_.isImagesEnabled();
        }
        this.requestUpdate();
    }
}
customElements.define(MediaMenuElement.is, MediaMenuElement);
