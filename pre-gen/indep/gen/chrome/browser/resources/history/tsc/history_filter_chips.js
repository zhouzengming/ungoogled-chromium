/* Copyright 2026 The Chromium Authors
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. */
// 
import 'chrome://resources/cr_elements/cr_chip/cr_chip.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/icons.html.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { BrowserProxyImpl } from './browser_proxy.js';
import { getCss } from './history_filter_chips.css.js';
import { getHtml } from './history_filter_chips.html.js';
export class HistoryFilterChipsElement extends CrLitElement {
    static get is() {
        return 'history-filter-chips';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            userVisits: { type: Boolean },
            actorVisits: { type: Boolean },
        };
    }
    #userVisits_accessor_storage = true;
    // These values are used to filter the history query; true indicates that
    // results for the respective value should be included.
    get userVisits() { return this.#userVisits_accessor_storage; }
    set userVisits(value) { this.#userVisits_accessor_storage = value; }
    #actorVisits_accessor_storage = true;
    get actorVisits() { return this.#actorVisits_accessor_storage; }
    set actorVisits(value) { this.#actorVisits_accessor_storage = value; }
    isUserSelected() {
        return this.userVisits && !this.actorVisits;
    }
    isActorSelected() {
        return this.actorVisits && !this.userVisits;
    }
    onUserVisitsClick_() {
        this.userVisits = true;
        this.actorVisits = !this.actorVisits;
        this.recordMetrics_(this.userVisits, this.actorVisits);
        this.fireChange_(this.userVisits, this.actorVisits);
    }
    onActorVisitsClick_() {
        this.actorVisits = true;
        this.userVisits = !this.userVisits;
        this.recordMetrics_(this.userVisits, this.actorVisits);
        this.fireChange_(this.userVisits, this.actorVisits);
    }
    recordMetrics_(newUserState, newActorState) {
        let action = '';
        if (newUserState && newActorState) {
            action = 'HistoryPage_ShowAllEnabled';
        }
        else if (newUserState && !newActorState) {
            action = 'HistoryPage_ShowUserOnlyEnabled';
        }
        else if (!newUserState && newActorState) {
            action = 'HistoryPage_ShowActorOnlyEnabled';
        }
        if (action !== '') {
            BrowserProxyImpl.getInstance().recordAction(action);
        }
    }
    getUserVisitsIcon_() {
        if (this.isUserSelected()) {
            return 'cr:check';
        }
        return this.isCriticalActionsEnabled_() ? 'cr:person' : 'cr:person-filled';
    }
    getActorVisitsIcon_() {
        if (this.isActorSelected()) {
            return 'cr:check';
        }
        // 
        // 
        return '';
        // 
    }
    isCriticalActionsEnabled_() {
        return loadTimeData.valueExists('isCriticalActionsEnabled') &&
            loadTimeData.getBoolean('isCriticalActionsEnabled');
    }
    fireChange_(userVisits, actorVisits) {
        this.fire('filter-changed', { userVisits, actorVisits });
    }
}
customElements.define(HistoryFilterChipsElement.is, HistoryFilterChipsElement);
