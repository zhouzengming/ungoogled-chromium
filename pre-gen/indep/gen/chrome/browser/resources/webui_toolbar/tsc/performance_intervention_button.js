// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '/strings.m.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl } from './browser_proxy.js';
import { getCss } from './performance_intervention_button.css.js';
import { getHtml } from './performance_intervention_button.html.js';
import { HelpBubbleAnchorMixin } from './toolbar_button.js';
const PerformanceInterventionButtonElementBase = HelpBubbleAnchorMixin(CrLitElement);
export class PerformanceInterventionButtonElement extends PerformanceInterventionButtonElementBase {
    static get is() {
        return 'performance-intervention-button';
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
        shouldBeShown: false,
        isActive: true,
    };
    get state() { return this.#state_accessor_storage; }
    set state(value) { this.#state_accessor_storage = value; }
    browserProxy_ = BrowserProxyImpl.getInstance();
    getLabel_() {
        return loadTimeData.getString('performanceInterventionButtonAccName');
    }
    getTooltip_() {
        return this.adjustTooltipForHelpBubble(loadTimeData.getString('performanceInterventionButtonTooltip'));
    }
    onClick_(e) {
        this.browserProxy_.toolbarUIHandler.onPerformanceInterventionButtonClicked(e.pointerType !== '');
    }
    onPointerdown_(e) {
        if (e.button === 0) {
            this.browserProxy_.toolbarUIHandler
                .onPerformanceInterventionButtonMousePressed();
        }
    }
}
customElements.define(PerformanceInterventionButtonElement.is, PerformanceInterventionButtonElement);
