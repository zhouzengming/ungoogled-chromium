// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './omnibox_popup_searchbox.js';
import '/strings.m.js';
import { ColorChangeUpdater } from '//resources/cr_components/color_change_listener/colors_css_updater.js';
import { EventTracker } from '//resources/js/event_tracker.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getHtml } from './full_app.html.js';
export class OmniboxFullAppElement extends CrLitElement {
    static get is() {
        return 'omnibox-full-app';
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            webuiShadowEnabled_: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    #webuiShadowEnabled__accessor_storage = loadTimeData.getBoolean('omniboxFullWebUIShadowEnabled');
    // When true, this page paints the popup's background, rounded corners and
    // drop shadow instead of the Views frame.
    get webuiShadowEnabled_() { return this.#webuiShadowEnabled__accessor_storage; }
    set webuiShadowEnabled_(value) { this.#webuiShadowEnabled__accessor_storage = value; }
    eventTracker_ = new EventTracker();
    constructor() {
        super();
        ColorChangeUpdater.forDocument().start();
    }
    connectedCallback() {
        super.connectedCallback();
        // Force an initial refresh to avoid the race condition where the profile
        // theme loads after the page, but before the listener is ready.
        ColorChangeUpdater.forDocument().refreshColorsCss();
        // On mousedown, Blink focuses the nearest mouse-focusable ancestor of the
        // target, or clears focus if there is none. Only intervene in the latter
        // case, so clicks on the transparent shadow margin, the focus ring, or the
        // searchbox padding don't blur the input.
        this.eventTracker_.add(document, 'mousedown', (e) => {
            const hitsFocusable = e.composedPath().some(el => el instanceof HTMLElement &&
                (el.tabIndex >= 0 || el.hasAttribute('tabindex') ||
                    el.isContentEditable));
            if (!hitsFocusable) {
                e.preventDefault();
            }
        }, true /* capture */);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll();
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        performance.mark('OmniboxFullAppElement::firstUpdated');
    }
}
customElements.define(OmniboxFullAppElement.is, OmniboxFullAppElement);
