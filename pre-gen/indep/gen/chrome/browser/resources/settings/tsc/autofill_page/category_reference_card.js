// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview 'category-reference-card' is a card that shows a list of
 * chips related to a certain category.
 */
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '../settings_shared.css.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { getTemplate } from './category_reference_card.html.js';
export class CategoryReferenceCardElement extends PolymerElement {
    static get is() {
        return 'category-reference-card';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            cardTitle: String,
            categoryId: Number,
            chips: {
                type: Array,
                value: () => [],
            },
            isExternal: { type: Boolean },
        };
    }
    onDataCategoryClick_() {
        this.dispatchEvent(new CustomEvent('data-category-click', {
            bubbles: true,
            composed: true,
            detail: {
                categoryId: this.categoryId,
            },
        }));
    }
    onDataChipClick_(event) {
        const chip = event.model.item;
        this.dispatchEvent(new CustomEvent('data-chip-click', {
            bubbles: true,
            composed: true,
            detail: {
                chipId: chip.id,
            },
        }));
    }
    focus() {
        this.shadowRoot.querySelector('cr-link-row').focus();
    }
}
customElements.define(CategoryReferenceCardElement.is, CategoryReferenceCardElement);
