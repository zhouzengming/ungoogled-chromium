// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './organizer_list_section.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './organizer_list.css.js';
import { getHtml } from './organizer_list.html.js';
export class OrganizerListElement extends CrLitElement {
    static get is() {
        return 'organizer-list';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            sectionDelegates: { type: Array },
            searchQuery: { type: String },
        };
    }
    #sectionDelegates_accessor_storage = [];
    get sectionDelegates() { return this.#sectionDelegates_accessor_storage; }
    set sectionDelegates(value) { this.#sectionDelegates_accessor_storage = value; }
    #searchQuery_accessor_storage = '';
    get searchQuery() { return this.#searchQuery_accessor_storage; }
    set searchQuery(value) { this.#searchQuery_accessor_storage = value; }
}
customElements.define(OrganizerListElement.is, OrganizerListElement);
