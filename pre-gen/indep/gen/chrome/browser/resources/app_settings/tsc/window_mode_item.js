// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './toggle_row.js';
import { assert, assertNotReached } from '//resources/js/assert.js';
import { browserProxyFactory, WindowMode } from 'chrome://resources/cr_components/app_management/app_management.mojom-webui.js';
import { AppManagementUserAction } from 'chrome://resources/cr_components/app_management/constants.js';
import { recordAppManagementUserAction } from 'chrome://resources/cr_components/app_management/util.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss } from './app_management_shared_style.css.js';
import { createDummyApp } from './web_app_settings_utils.js';
import { getHtml } from './window_mode_item.html.js';
function convertWindowModeToBool(windowMode) {
    switch (windowMode) {
        case WindowMode.kBrowser:
            return false;
        case WindowMode.kWindow:
            return true;
        default:
            assertNotReached();
    }
}
function getWindowModeBoolean(windowMode) {
    assert(windowMode !== WindowMode.kUnknown, 'Window Mode Not Set');
    return convertWindowModeToBool(windowMode);
}
export class WindowModeItemElement extends CrLitElement {
    static get is() {
        return 'app-management-window-mode-item';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            windowModeLabel: { type: String },
            app: { type: Object },
            hidden: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    #windowModeLabel_accessor_storage = '';
    get windowModeLabel() { return this.#windowModeLabel_accessor_storage; }
    set windowModeLabel(value) { this.#windowModeLabel_accessor_storage = value; }
    #app_accessor_storage = createDummyApp();
    get app() { return this.#app_accessor_storage; }
    set app(value) { this.#app_accessor_storage = value; }
    #hidden_accessor_storage = false;
    get hidden() { return this.#hidden_accessor_storage; }
    set hidden(value) { this.#hidden_accessor_storage = value; }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('app')) {
            this.hidden = this.isHidden_();
        }
    }
    firstUpdated() {
        this.addEventListener('click', this.onClick_);
        this.addEventListener('change', this.toggleWindowMode_);
    }
    getValue_() {
        return getWindowModeBoolean(this.app.windowMode);
    }
    onClick_() {
        this.shadowRoot.querySelector('#toggle-row').click();
    }
    toggleWindowMode_() {
        const currentWindowMode = this.app.windowMode;
        if (currentWindowMode === WindowMode.kUnknown) {
            assertNotReached();
        }
        const newWindowMode = (currentWindowMode === WindowMode.kBrowser) ?
            WindowMode.kWindow :
            WindowMode.kBrowser;
        browserProxyFactory.getInstance().handler.setWindowMode(this.app.id, newWindowMode);
        const booleanWindowMode = getWindowModeBoolean(newWindowMode);
        const windowModeChangeAction = booleanWindowMode ?
            AppManagementUserAction.WINDOW_MODE_CHANGED_TO_WINDOW :
            AppManagementUserAction.WINDOW_MODE_CHANGED_TO_BROWSER;
        recordAppManagementUserAction(this.app.type, windowModeChangeAction);
    }
    isHidden_() {
        return this.app.hideWindowMode;
    }
}
customElements.define(WindowModeItemElement.is, WindowModeItemElement);
