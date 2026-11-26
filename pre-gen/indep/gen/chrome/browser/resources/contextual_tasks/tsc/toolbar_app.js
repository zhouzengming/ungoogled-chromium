// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './top_toolbar.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl } from './contextual_tasks_browser_proxy.js';
import { ToolbarBrowserProxyImpl } from './contextual_tasks_toolbar_browser_proxy.js';
import { getCss } from './toolbar_app.css.js';
import { getHtml } from './toolbar_app.html.js';
import { recordAction } from './utils.js';
export class ContextualTasksToolbarAppElement extends CrLitElement {
    static get is() {
        return 'contextual-tasks-toolbar-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            threadTitle_: { type: String },
            darkMode_: {
                type: Boolean,
                reflect: true,
            },
            isAiPage_: {
                type: Boolean,
                reflect: true,
            },
            isAimEligible_: {
                type: Boolean,
                reflect: true,
            },
            isUserSignedIn_: { type: Boolean },
            onboardingTooltipShowing_: { type: Boolean },
        };
    }
    #threadTitle__accessor_storage = '';
    get threadTitle_() { return this.#threadTitle__accessor_storage; }
    set threadTitle_(value) { this.#threadTitle__accessor_storage = value; }
    #darkMode__accessor_storage = loadTimeData.getBoolean('darkMode');
    get darkMode_() { return this.#darkMode__accessor_storage; }
    set darkMode_(value) { this.#darkMode__accessor_storage = value; }
    #isAiPage__accessor_storage = loadTimeData.getBoolean('isAiPage');
    get isAiPage_() { return this.#isAiPage__accessor_storage; }
    set isAiPage_(value) { this.#isAiPage__accessor_storage = value; }
    #isAimEligible__accessor_storage = loadTimeData.getBoolean('isAimEligible');
    get isAimEligible_() { return this.#isAimEligible__accessor_storage; }
    set isAimEligible_(value) { this.#isAimEligible__accessor_storage = value; }
    #isUserSignedIn__accessor_storage = loadTimeData.getBoolean('isSignedIn');
    get isUserSignedIn_() { return this.#isUserSignedIn__accessor_storage; }
    set isUserSignedIn_(value) { this.#isUserSignedIn__accessor_storage = value; }
    #onboardingTooltipShowing__accessor_storage = false;
    get onboardingTooltipShowing_() { return this.#onboardingTooltipShowing__accessor_storage; }
    set onboardingTooltipShowing_(value) { this.#onboardingTooltipShowing__accessor_storage = value; }
    browserProxy_ = BrowserProxyImpl.getInstance();
    toolbarBrowserProxy_ = ToolbarBrowserProxyImpl.getInstance();
    listenerIds_ = [];
    toolbarListenerIds_ = [];
    connectedCallback() {
        super.connectedCallback();
        const callbackRouter = this.browserProxy_.callbackRouter;
        this.listenerIds_ = [
            callbackRouter.setThreadTitle.addListener((title) => {
                this.threadTitle_ = title;
                document.title = title || loadTimeData.getString('title');
            }),
            callbackRouter.onSidePanelStateChanged.addListener(() => {
                // Handle theme update if side panel state changes
                const url = new URL(window.location.href);
                this.updateThemeFromUrl(url);
            }),
        ];
        this.toolbarListenerIds_ = [
            this.toolbarBrowserProxy_.callbackRouter.onAiPageStatusChanged
                .addListener((isAiPage) => {
                this.isAiPage_ = isAiPage;
            }),
        ];
        const initialUrl = new URL(window.location.href);
        this.updateThemeFromUrl(initialUrl);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.listenerIds_.forEach(id => this.browserProxy_.callbackRouter.removeListener(id));
        this.listenerIds_ = [];
        this.toolbarListenerIds_.forEach(id => this.toolbarBrowserProxy_.callbackRouter.removeListener(id));
        this.toolbarListenerIds_ = [];
    }
    updateThemeFromUrl(url) {
        const csParam = url.searchParams.get('cs');
        if (csParam === '0') {
            this.darkMode_ = false;
        }
        else if (csParam === '1') {
            this.darkMode_ = true;
        }
    }
    onNewThreadClick_() {
        recordAction('ContextualTasks.WebUI.UserAction.OpenNewThread');
        this.browserProxy_.handler.createNewThread();
    }
}
customElements.define(ContextualTasksToolbarAppElement.is, ContextualTasksToolbarAppElement);
