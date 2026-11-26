// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_components/composebox/composebox_favicon_group.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { getCss } from './context_library.css.js';
import { getHtml } from './context_library.html.js';
export class ContextLibraryElement extends CrLitElement {
    static get is() {
        return 'context-library';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            tabs: { type: Array },
            submittedTabIds: { type: Object },
        };
    }
    #tabs_accessor_storage = [];
    get tabs() { return this.#tabs_accessor_storage; }
    set tabs(value) { this.#tabs_accessor_storage = value; }
    #submittedTabIds_accessor_storage = new Set();
    get submittedTabIds() { return this.#submittedTabIds_accessor_storage; }
    set submittedTabIds(value) { this.#submittedTabIds_accessor_storage = value; }
    resizeObserver_ = null;
    messageListener_ = null;
    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver_ = new ResizeObserver(() => {
            window.requestResize?.();
        });
        this.resizeObserver_.observe(this);
        this.messageListener_ = (event) => {
            if (event.data?.type === 'SET_TABS' && Array.isArray(event.data.tabs)) {
                this.tabs = event.data.tabs;
            }
        };
        window.addEventListener('message', this.messageListener_);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.resizeObserver_?.disconnect();
        this.resizeObserver_ = null;
        if (this.messageListener_) {
            window.removeEventListener('message', this.messageListener_);
            this.messageListener_ = null;
        }
    }
    // <composebox-favicon-group> fires this to request a live favicon for a tab
    // that is still loading. Handled here so the event does not escape the
    // component; invoking `onTabLoaded` swaps in the higher fidelity favicon.
    onWaitForTabLoad_(_e) {
        // TODO(crbug.com/): Forward to the browser and call `onTabLoaded` with the
        // resolved favicon data URL. Until then the group falls back to
        // getFaviconForPageURL().
    }
}
customElements.define(ContextLibraryElement.is, ContextLibraryElement);
