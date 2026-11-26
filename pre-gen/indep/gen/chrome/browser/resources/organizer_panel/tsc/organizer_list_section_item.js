// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_elements/cr_url_list_item/cr_url_list_item.js';
import './organizer_list_section_item_description.js';
import './organizer_list_section_item_title.js';
import './stacked_favicons.js';
import { MouseHoverableMixinLit } from '//resources/cr_elements/mouse_hoverable_mixin_lit.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './organizer_list_section_item.css.js';
import { getHtml } from './organizer_list_section_item.html.js';
const OrganizerListSectionItemElementBase = MouseHoverableMixinLit(CrLitElement);
export class OrganizerListSectionItemElement extends OrganizerListSectionItemElementBase {
    static get is() {
        return 'organizer-list-section-item';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            item: { type: Object },
        };
    }
    #item_accessor_storage = {
        title: [],
    };
    get item() { return this.#item_accessor_storage; }
    set item(value) { this.#item_accessor_storage = value; }
    listFormatter_ = new Intl.ListFormat(document.documentElement.lang || undefined, { style: 'narrow', type: 'conjunction' });
    boundOnContextmenu_ = this.onContextmenu_.bind(this);
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('contextmenu', this.boundOnContextmenu_);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('contextmenu', this.boundOnContextmenu_);
    }
    getAriaLabel_() {
        return this.listFormatter_.format(this.item.title);
    }
    getAriaDescription_() {
        return this.item.description ?
            this.listFormatter_.format(this.item.description.map(d => d.text)) :
            '';
    }
    hasDescription_() {
        return !!this.item.description && this.item.description.length > 0;
    }
    hasSuffix_() {
        return !!(this.item.trailingIcon || this.item.hoveredActionButton);
    }
    hasActionButton_() {
        return !!this.item.hoveredActionButton;
    }
    onActionButtonClick_(e) {
        e.stopPropagation();
        this.fire('action-button-click', {
            item: this.item,
            buttonElement: e.currentTarget,
        });
    }
    onContextmenu_(e) {
        e.preventDefault();
        e.stopPropagation();
        this.fire('context-menu-click', {
            item: this.item,
            x: e.clientX,
            y: e.clientY,
        });
    }
    titleHighlightRanges_() {
        return this.item.highlightRanges?.title ?? this.item.title.map(() => []);
    }
    descriptionHighlightRanges_() {
        return this.item.highlightRanges?.description ??
            (this.item.description?.map(() => []) || []);
    }
    resetActionButtonStateIfNeeded() {
        this.$.actionButton.blur();
    }
}
customElements.define(OrganizerListSectionItemElement.is, OrganizerListSectionItemElement);
