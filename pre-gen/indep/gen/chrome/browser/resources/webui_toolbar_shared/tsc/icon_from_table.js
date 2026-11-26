// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon/cr_icon.js';
import { skColorToRgba } from '//resources/js/color_utils.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './icon_from_table.css.js';
import { getHtml } from './icon_from_table.html.js';
import { IconTable } from './icon_table.js';
// Size is controlled by --icon-size CSS variable.
export class IconFromTableElement extends CrLitElement {
    static get is() {
        return 'icon-from-table';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            /**
             * Handle to the icon to show here. See toolbar_ui_api.mojom.IconHandle.
             */
            iconHandle: { type: Object },
            /**
             * Internally cached information on the icon.
             */
            iconInfo_: { type: Object },
        };
    }
    #iconHandle_accessor_storage = {
        handleId: 0n,
    };
    get iconHandle() { return this.#iconHandle_accessor_storage; }
    set iconHandle(value) { this.#iconHandle_accessor_storage = value; }
    #iconInfo__accessor_storage;
    get iconInfo_() { return this.#iconInfo__accessor_storage; }
    set iconInfo_(value) { this.#iconInfo__accessor_storage = value; }
    iconTable_ = IconTable.getInstance();
    constructor() {
        super();
        this.iconInfo_ = this.iconTable_.getIconInfo(this.iconHandle);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('iconHandle')) {
            this.iconInfo_ = this.iconTable_.getIconInfo(this.iconHandle);
        }
    }
    // Computes the CSS needed to configure the embedded rendering element,
    // whether cr-icon or our own use of mask-image, to render the icon in
    // the color it specifies.
    //
    // Will be undefined if the icon doesn't request to be rendered in a specific
    // color (including when it's multicolor).
    getIconColorCss_() {
        if (!this.iconInfo_ || !this.iconInfo_.color) {
            return undefined;
        }
        const rgba = skColorToRgba(this.iconInfo_.color);
        return `color: ${rgba}; --iron-icon-fill-color: ${rgba};`;
    }
}
customElements.define(IconFromTableElement.is, IconFromTableElement);
