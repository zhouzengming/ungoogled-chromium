// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Appearance menu element used for the improved Read Aloud UI.
import './grouped_action_menu.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { DEFAULT_SETTINGS, ToolbarEvent } from '../content/read_anything_types.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './appearance_menu.html.js';
const AppearanceMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the appearance menu.
export class AppearanceMenuElement extends AppearanceMenuElementBase {
    static get is() {
        return 'appearance-menu';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            settingsPrefs: { type: Object },
            nonModal: { type: Boolean },
            presentationState: { type: Number },
            groups_: { type: Array },
        };
    }
    #settingsPrefs_accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs() { return this.#settingsPrefs_accessor_storage; }
    set settingsPrefs(value) { this.#settingsPrefs_accessor_storage = value; }
    #nonModal_accessor_storage = false;
    get nonModal() { return this.#nonModal_accessor_storage; }
    set nonModal(value) { this.#nonModal_accessor_storage = value; }
    #presentationState_accessor_storage = 0;
    get presentationState() { return this.#presentationState_accessor_storage; }
    set presentationState(value) { this.#presentationState_accessor_storage = value; }
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    colorOptions_ = [
        {
            title: loadTimeData.getString('defaultColorTitle'),
            icon: 'read-anything-20:default-theme-custom',
            data: this.visualBrowserProxy_.getDefaultTheme(),
        },
        {
            title: loadTimeData.getString('lightColorTitle'),
            icon: 'read-anything-20:light-theme-custom',
            data: this.visualBrowserProxy_.getLightTheme(),
        },
        {
            title: loadTimeData.getString('darkColorTitle'),
            icon: 'read-anything-20:dark-theme-custom',
            data: this.visualBrowserProxy_.getDarkTheme(),
        },
        {
            title: loadTimeData.getString('yellowColorTitle'),
            icon: 'read-anything-20:yellow-theme-custom',
            data: this.visualBrowserProxy_.getYellowTheme(),
        },
        {
            title: loadTimeData.getString('blueColorTitle'),
            icon: 'read-anything-20:blue-theme-custom',
            data: this.visualBrowserProxy_.getBlueTheme(),
        },
        {
            title: loadTimeData.getString('highContrastColorTitle'),
            icon: 'read-anything-20:high-contrast-theme-custom',
            data: this.visualBrowserProxy_.getHighContrastTheme(),
        },
        {
            title: loadTimeData.getString('lowContrastLightColorTitle'),
            icon: 'read-anything-20:low-contrast-light-theme-custom',
            data: this.visualBrowserProxy_.getLowContrastLightTheme(),
        },
        {
            title: loadTimeData.getString('lowContrastDarkColorTitle'),
            icon: 'read-anything-20:low-contrast-dark-theme-custom',
            data: this.visualBrowserProxy_.getLowContrastDarkTheme(),
        },
    ];
    viewOptions_ = [
        {
            title: loadTimeData.getString('sidePanelLabel'),
            data: this.visualBrowserProxy_.getInSidePanelPresentationState(),
        },
        {
            title: loadTimeData.getString('fullPageLabel'),
            data: this.visualBrowserProxy_.getInImmersiveOverlayPresentationState(),
        },
    ];
    viewGroup_ = {
        header: {
            title: loadTimeData.getString('viewLabel'),
            separator: false,
        },
        items: this.viewOptions_,
        eventName: ToolbarEvent.PRESENTATION_CHANGE,
    };
    themeGroup_ = {
        header: {
            title: loadTimeData.getString('themeTitle'),
            separator: true,
        },
        items: this.colorOptions_,
        eventName: ToolbarEvent.THEME,
    };
    #groups__accessor_storage = this.computeGroups_();
    get groups_() { return this.#groups__accessor_storage; }
    set groups_(value) { this.#groups__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('settingsPrefs')) {
            this.updateOptionsForTheme_();
        }
        if (changedProperties.has('presentationState')) {
            this.updateOptionsForPresentation_();
        }
        if (changedProperties.has('settingsPrefs') ||
            changedProperties.has('presentationState')) {
            this.groups_ = this.computeGroups_();
        }
    }
    // The theme options are not shown in high contrast mode because reading mode
    // doesn't override system forced colors.
    computeGroups_() {
        return window.matchMedia('(forced-colors: active)').matches ?
            [this.viewGroup_] :
            [this.viewGroup_, this.themeGroup_];
    }
    open(anchor, showAtConfig) {
        // Recompute here in case the system forced colors setting changed since
        // this menu was last shown.
        this.groups_ = this.computeGroups_();
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    onThemeChange_(e) {
        const newTheme = e.detail.data;
        this.visualBrowserProxy_.onThemeChange(newTheme);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.THEME_CHANGE);
        this.settingsPrefs = {
            ...this.settingsPrefs,
            theme: newTheme,
        };
    }
    onPresentationChange_(e) {
        const newPresentationState = e.detail.data;
        if (newPresentationState !== this.presentationState) {
            this.visualBrowserProxy_.togglePresentation();
        }
    }
    updateOptionsForTheme_() {
        const currentTheme = this.settingsPrefs.theme;
        this.colorOptions_.forEach(option => {
            option.selected = option.data === currentTheme;
        });
    }
    updateOptionsForPresentation_() {
        this.viewOptions_.forEach(option => {
            option.selected = option.data === this.presentationState;
        });
    }
}
customElements.define(AppearanceMenuElement.is, AppearanceMenuElement);
