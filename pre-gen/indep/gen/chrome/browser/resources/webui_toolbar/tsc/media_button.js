// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '/strings.m.js';
import './icons.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl, ContextMenuType } from './browser_proxy.js';
import { getHtml } from './media_button.html.js';
import { OverflowableButtonMixin } from './overflowable_button.js';
import { getCss } from './toolbar_button.css.js';
import { getContextMenuPosition, HelpBubbleAnchorMixin, PressHandler } from './toolbar_button.js';
const MediaButtonElementBase = HelpBubbleAnchorMixin(OverflowableButtonMixin(CrLitElement));
export class MediaButtonElement extends MediaButtonElementBase {
    static get is() {
        return 'media-button';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            ...super.properties,
            state: { type: Object },
        };
    }
    #state_accessor_storage = {
        enabled: true,
        shouldBeShown: false,
        isContextMenuVisible: false,
    };
    get state() { return this.#state_accessor_storage; }
    set state(value) { this.#state_accessor_storage = value; }
    pressHandler_ = new PressHandler(this.onLongPress_.bind(this), this.onShortPress_.bind(this));
    getTooltip_() {
        return loadTimeData.getString('mediaButtonTooltip');
    }
    browserProxy_ = BrowserProxyImpl.getInstance();
    onLongPress_(source) {
        this.browserProxy_.toolbarUIHandler.showContextMenu(ContextMenuType.kMedia, getContextMenuPosition(this), source, 
        /*showMenuToken=*/ null);
    }
    onShortPress_(e) {
        this.browserProxy_.toolbarUIHandler.onMediaButtonClicked(e instanceof PointerEvent && e.pointerType !== '');
    }
    onClick_(e) {
        // Only keyboard `click` (Enter/Space) are handled here, which triggers a
        // left-click equivalent. Keyboard 'click' has detail === 0.
        if (e.detail === 0) {
            this.onShortPress_(e);
        }
    }
    onPointerdown_(e) {
        if (e.button === 0) {
            this.browserProxy_.toolbarUIHandler.onMediaButtonMousePressed();
        }
        this.pressHandler_.onPointerdown(e);
    }
}
customElements.define(MediaButtonElement.is, MediaButtonElement);
