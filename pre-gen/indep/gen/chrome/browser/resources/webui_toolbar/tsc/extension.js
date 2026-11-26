// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_button/cr_button.js';
import '/shared/icon_from_table.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl } from './browser_proxy.js';
import { getHtml } from './extension.html.js';
import { ToolbarActionMixin } from './toolbar_action_mixin.js';
import { getCss } from './toolbar_button.css.js';
import { getContextMenuSourceType } from './toolbar_button.js';
const initialState = {
    id: '',
    accessibleName: '',
    tooltip: '',
    isVisible: false,
    icon: { handleId: 0n },
};
const ExtensionElementBase = ToolbarActionMixin(CrLitElement, initialState);
export class ExtensionElement extends ExtensionElementBase {
    static get is() {
        return 'webui-toolbar-extension';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    browserProxy_ = BrowserProxyImpl.getInstance();
    getElementId(state) {
        return state.id === '' ? 'kExtensionsMenuButtonElementId' :
            'kToolbarActionViewElementId';
    }
    getSecondaryElementId() {
        return 'ext:' + this.state.id;
    }
    onClick_(e) {
        this.browserProxy_.toolbarUIHandler.executeExtensionAction(this.state.id, e.pointerType !== '');
    }
    onPointerdown_(e) {
        if (e.button === 0) {
            this.browserProxy_.toolbarUIHandler.onExtensionActionPointerDown(this.state.id);
        }
    }
    onContextmenu_(e) {
        e.preventDefault();
        this.browserProxy_.toolbarUIHandler.showExtensionContextMenu(this.state.id, getContextMenuSourceType(e));
    }
    getMimeType() {
        return 'application/x-webui-extension-action';
    }
    getItemId() {
        return this.state.id;
    }
    isDraggable() {
        return this.state.id !== '';
    }
    moveItemBy(delta) {
        this.browserProxy_.toolbarUIHandler.moveExtensionActionBy(this.state.id, delta);
    }
}
customElements.define(ExtensionElement.is, ExtensionElement);
