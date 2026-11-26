// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './toolbar_chip_button.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import './icons.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl, ContextMenuType } from './browser_proxy.js';
import { getCss } from './glic_button.css.js';
import { getHtml } from './glic_button.html.js';
import { getContextMenuPosition, getContextMenuSourceType, HelpBubbleAnchorMixin, setHasHelpBubble } from './toolbar_button.js';
const GlicButtonElementBase = HelpBubbleAnchorMixin(CrLitElement);
export class GlicButtonElement extends GlicButtonElementBase {
    static get is() {
        return 'glic-button';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            enabled: { type: Boolean },
            state: { type: Object },
            label: { type: String },
        };
    }
    #enabled_accessor_storage = true;
    get enabled() { return this.#enabled_accessor_storage; }
    set enabled(value) { this.#enabled_accessor_storage = value; }
    #state_accessor_storage = {
        open: false,
        shouldShow: false,
        isContextMenuVisible: false,
        nudgeLabel: null,
    };
    get state() { return this.#state_accessor_storage; }
    set state(value) { this.#state_accessor_storage = value; }
    #label_accessor_storage = loadTimeData.getString('glicButtonLabel');
    get label() { return this.#label_accessor_storage; }
    set label(value) { this.#label_accessor_storage = value; }
    browserProxy_ = BrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.registerHelpBubble('kGlicButtonElementId', this.$.button, {
            onHighlightChanged: (highlighted) => {
                this.classList.toggle('anchor-highlight', highlighted);
            },
            onHelpBubbleShown: () => setHasHelpBubble(this, true),
            onHelpBubbleHidden: () => setHasHelpBubble(this, false),
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.unregisterHelpBubble('kGlicButtonElementId');
    }
    focus() {
        this.$.button.focus();
    }
    getLabel_() {
        return this.state.nudgeLabel || this.label;
    }
    getTooltip_() {
        return this.adjustTooltipForHelpBubble(loadTimeData.getString(this.state.open ? 'glicButtonTooltipClose' : 'glicButtonTooltip'));
    }
    getAriaLabel_() {
        return loadTimeData.getString('glicButtonAccName');
    }
    onClick_() {
        this.browserProxy_.toolbarUIHandler.onGlicButtonClicked();
    }
    onContextmenu_(e) {
        e.preventDefault();
        this.browserProxy_.toolbarUIHandler.showContextMenu(ContextMenuType.kGlic, getContextMenuPosition(this), getContextMenuSourceType(e), /*showMenuToken=*/ null);
    }
}
customElements.define(GlicButtonElement.is, GlicButtonElement);
