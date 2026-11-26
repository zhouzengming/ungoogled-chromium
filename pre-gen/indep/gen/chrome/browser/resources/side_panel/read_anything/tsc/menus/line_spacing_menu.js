// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './simple_action_menu.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { VisualBrowserProxyImpl } from '../app/visual_browser_proxy.js';
import { ToolbarEvent } from '../content/read_anything_types.js';
import { DEFAULT_SETTINGS } from '../content/read_anything_types.js';
import { ReadAnythingSettingsChange } from '../shared/metrics_browser_proxy.js';
import { ReadAnythingLogger } from '../shared/read_anything_logger.js';
import { getHtml } from './line_spacing_menu.html.js';
import { getIndexOfSetting } from './menu_util.js';
const LineSpacingMenuElementBase = WebUiListenerMixinLit(CrLitElement);
// Stores and propagates the data for the line spacing menu.
export class LineSpacingMenuElement extends LineSpacingMenuElementBase {
    static get is() {
        return 'line-spacing-menu';
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
    get options_() { return this.#options__accessor_storage; }
    set options_(value) { this.#options__accessor_storage = value; }
    logger_ = ReadAnythingLogger.getInstance();
    open(anchor, showAtConfig) {
        this.$.menu.open(anchor, showAtConfig);
    }
    close() {
        this.$.menu.close();
    }
    restoredLineSpacingIndex_() {
        return getIndexOfSetting(this.options_, this.settingsPrefs['lineSpacing']);
    }
    onLineSpacingChange_(event) {
        this.visualBrowserProxy_.onLineSpacingChange(event.detail.data);
        this.logger_.logTextSettingsChange(ReadAnythingSettingsChange.LINE_HEIGHT_CHANGE);
        this.fire(ToolbarEvent.CLOSE_ALL_MENUS);
    }
}
customElements.define(LineSpacingMenuElement.is, LineSpacingMenuElement);
