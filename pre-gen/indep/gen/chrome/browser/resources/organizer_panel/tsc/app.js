// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar_search_field.js';
import './organizer_list.js';
import '/strings.m.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { getCss } from './app.css.js';
import { getHtml } from './app.html.js';
import { OpenTabsDelegate } from './delegates/open_tabs_delegate.js';
import { RecentTabsDelegate } from './delegates/recent_tabs_delegate.js';
import { TabGroupsDelegate } from './delegates/tab_groups_delegate.js';
export class OrganizerPanelAppElement extends CrLitElement {
    static get is() {
        return 'organizer-panel-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            shortcut_: { type: String },
            sectionDelegates_: { type: Array },
            searchQuery_: { type: String },
        };
    }
    #shortcut__accessor_storage = loadTimeData.getString('shortcutText');
    get shortcut_() { return this.#shortcut__accessor_storage; }
    set shortcut_(value) { this.#shortcut__accessor_storage = value; }
    #searchQuery__accessor_storage = '';
    get searchQuery_() { return this.#searchQuery__accessor_storage; }
    set searchQuery_(value) { this.#searchQuery__accessor_storage = value; }
    #sectionDelegates__accessor_storage = [
        new OpenTabsDelegate(),
        new RecentTabsDelegate(),
        new TabGroupsDelegate(),
    ];
    get sectionDelegates_() { return this.#sectionDelegates__accessor_storage; }
    set sectionDelegates_(value) { this.#sectionDelegates__accessor_storage = value; }
    onSearchChanged_(e) {
        this.searchQuery_ = e.detail;
    }
}
customElements.define(OrganizerPanelAppElement.is, OrganizerPanelAppElement);
