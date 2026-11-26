// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_components/composebox/composebox.js';
import './omnibox_composebox.js';
import '/strings.m.js';
import { ColorChangeUpdater } from '//resources/cr_components/color_change_listener/colors_css_updater.js';
import { EventTracker } from '//resources/js/event_tracker.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './aim_app.css.js';
import { getHtml } from './aim_app.html.js';
import { browserProxyFactory } from './omnibox_popup_aim.mojom-webui.js';
export class OmniboxAimAppElement extends CrLitElement {
    static get is() {
        return 'omnibox-aim-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            searchboxLayoutMode_: { type: String },
            hasAllowedInputs_: { type: Boolean },
            caretAnimationsEnabled_: { type: Boolean },
            disableComposeboxAnimation_: { type: Boolean },
            energyEffectEnabled_: {
                type: Boolean,
                reflect: true,
            },
            energyEffectAnimationEnabled_: {
                type: Boolean,
                reflect: true,
            },
            disableVoiceSearchAnimation_: { type: Boolean },
            usePecApi_: { type: Boolean },
            smartTabSharingVisible_: { type: Boolean },
            contextManagementInComposeboxEnabled_: { type: Boolean },
            isOblongShape_: { type: Boolean },
            webuiOmniboxSimplificationEnabled_: { type: Boolean },
            webuiOmniboxFullPopupEnabled_: { type: Boolean },
            smartComposeEnabled_: { type: Boolean },
            webuiShadowEnabled_: {
                type: Boolean,
                reflect: true,
            },
        };
    }
    #searchboxLayoutMode__accessor_storage = loadTimeData.getString('searchboxLayoutMode');
    get searchboxLayoutMode_() { return this.#searchboxLayoutMode__accessor_storage; }
    set searchboxLayoutMode_(value) { this.#searchboxLayoutMode__accessor_storage = value; }
    #hasAllowedInputs__accessor_storage = false;
    get hasAllowedInputs_() { return this.#hasAllowedInputs__accessor_storage; }
    set hasAllowedInputs_(value) { this.#hasAllowedInputs__accessor_storage = value; }
    #disableComposeboxAnimation__accessor_storage = loadTimeData.getBoolean('composeboxAnimationDisabled');
    get disableComposeboxAnimation_() { return this.#disableComposeboxAnimation__accessor_storage; }
    set disableComposeboxAnimation_(value) { this.#disableComposeboxAnimation__accessor_storage = value; }
    #disableVoiceSearchAnimation__accessor_storage = !loadTimeData.getBoolean('voiceSearchCoherenceComposeboxesEnabled');
    // Voice search animation is disabled outside of voice coherence.
    get disableVoiceSearchAnimation_() { return this.#disableVoiceSearchAnimation__accessor_storage; }
    set disableVoiceSearchAnimation_(value) { this.#disableVoiceSearchAnimation__accessor_storage = value; }
    #caretAnimationsEnabled__accessor_storage = loadTimeData.getBoolean('caretAnimationEnabled');
    get caretAnimationsEnabled_() { return this.#caretAnimationsEnabled__accessor_storage; }
    set caretAnimationsEnabled_(value) { this.#caretAnimationsEnabled__accessor_storage = value; }
    #energyEffectEnabled__accessor_storage = loadTimeData.getBoolean('energyEffectEnabled');
    get energyEffectEnabled_() { return this.#energyEffectEnabled__accessor_storage; }
    set energyEffectEnabled_(value) { this.#energyEffectEnabled__accessor_storage = value; }
    #energyEffectAnimationEnabled__accessor_storage = loadTimeData.getBoolean('energyEffectEnabled');
    // The use of energyEffectEnabled to set energyEffectAnimationEnabled_ is
    // intentional. This is to align the gating properties for energy effects
    // across all surfaces (= Nextbox, Omnibox, and Realbox).
    get energyEffectAnimationEnabled_() { return this.#energyEffectAnimationEnabled__accessor_storage; }
    set energyEffectAnimationEnabled_(value) { this.#energyEffectAnimationEnabled__accessor_storage = value; }
    #usePecApi__accessor_storage = loadTimeData.getBoolean('contextualMenuUsePecApi');
    get usePecApi_() { return this.#usePecApi__accessor_storage; }
    set usePecApi_(value) { this.#usePecApi__accessor_storage = value; }
    #smartTabSharingVisible__accessor_storage = loadTimeData.getBoolean('composeboxSmartTabSharingVisible');
    get smartTabSharingVisible_() { return this.#smartTabSharingVisible__accessor_storage; }
    set smartTabSharingVisible_(value) { this.#smartTabSharingVisible__accessor_storage = value; }
    #contextManagementInComposeboxEnabled__accessor_storage = loadTimeData.getBoolean('contextManagementInComposeboxEnabled');
    get contextManagementInComposeboxEnabled_() { return this.#contextManagementInComposeboxEnabled__accessor_storage; }
    set contextManagementInComposeboxEnabled_(value) { this.#contextManagementInComposeboxEnabled__accessor_storage = value; }
    #isOblongShape__accessor_storage = loadTimeData.getBoolean('contextButtonShapeIsOblong');
    get isOblongShape_() { return this.#isOblongShape__accessor_storage; }
    set isOblongShape_(value) { this.#isOblongShape__accessor_storage = value; }
    #webuiOmniboxSimplificationEnabled__accessor_storage = loadTimeData.getBoolean('webuiOmniboxSimplificationEnabled');
    get webuiOmniboxSimplificationEnabled_() { return this.#webuiOmniboxSimplificationEnabled__accessor_storage; }
    set webuiOmniboxSimplificationEnabled_(value) { this.#webuiOmniboxSimplificationEnabled__accessor_storage = value; }
    #webuiOmniboxFullPopupEnabled__accessor_storage = loadTimeData.getBoolean('webuiOmniboxFullPopupEnabled');
    get webuiOmniboxFullPopupEnabled_() { return this.#webuiOmniboxFullPopupEnabled__accessor_storage; }
    set webuiOmniboxFullPopupEnabled_(value) { this.#webuiOmniboxFullPopupEnabled__accessor_storage = value; }
    #smartComposeEnabled__accessor_storage = loadTimeData.getBoolean('composeboxSmartComposeEnabled');
    get smartComposeEnabled_() { return this.#smartComposeEnabled__accessor_storage; }
    set smartComposeEnabled_(value) { this.#smartComposeEnabled__accessor_storage = value; }
    #webuiShadowEnabled__accessor_storage = loadTimeData.getBoolean('omniboxAimWebUIShadowEnabled');
    // When true, this page paints the popup's background, rounded corners and
    // drop shadow instead of the Views frame.
    get webuiShadowEnabled_() { return this.#webuiShadowEnabled__accessor_storage; }
    set webuiShadowEnabled_(value) { this.#webuiShadowEnabled__accessor_storage = value; }
    eventTracker_ = new EventTracker();
    browserProxy_;
    listenerIds_ = [];
    preserveContextOnClose_ = false;
    constructor() {
        super();
        ColorChangeUpdater.forDocument().start();
        this.browserProxy_ = browserProxyFactory.getInstance();
    }
    connectedCallback() {
        super.connectedCallback();
        // Force an initial refresh to avoid the race condition where the profile
        // theme loads after the page, but before the listener is ready.
        ColorChangeUpdater.forDocument().refreshColorsCss();
        this.listenerIds_ = [
            this.browserProxy_.callbackRouter.onPopupShown.addListener(this.onPopupShown_.bind(this)),
            this.browserProxy_.callbackRouter.addContext.addListener(this.addContext_.bind(this)),
            this.browserProxy_.callbackRouter.focusInput.addListener(this.focusInput_.bind(this)),
            this.browserProxy_.callbackRouter.clearPopup.addListener(this.clearPopup_.bind(this)),
            this.browserProxy_.callbackRouter.setPreserveContextOnClose.addListener(this.setPreserveContextOnClose_.bind(this)),
            this.browserProxy_.callbackRouter.onContextMenuClosed.addListener(this.onContextMenuClosed_.bind(this)),
        ];
        this.eventTracker_.add(this.$.composebox, 'input-state-changed', (e) => {
            const inputState = e.detail.inputState;
            this.hasAllowedInputs_ = inputState.allowedModels.length > 0 ||
                inputState.allowedTools.length > 0 ||
                inputState.allowedInputTypes.length > 0;
        });
        this.focusInput_();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll();
        for (const listenerId of this.listenerIds_) {
            this.browserProxy_.callbackRouter.removeListener(listenerId);
        }
        this.listenerIds_ = [];
    }
    getSearchboxLayoutMode_() {
        if (this.searchboxLayoutMode_.startsWith('Tall') &&
            !this.hasAllowedInputs_) {
            return 'Compact';
        }
        return this.searchboxLayoutMode_;
    }
    onContextMenuEntrypointClick_(e) {
        e.preventDefault();
        const point = {
            x: e.detail.x,
            y: e.detail.y,
        };
        // Force the button to keep its hover background visually while
        // the menu is open, even if the mouse doesn't move out of the button
        // area after clicking.
        const contextButton = this.$.composebox.getContextEntrypointElement();
        if (contextButton) {
            contextButton.classList.add('menu-open');
        }
        this.browserProxy_.handler.showContextMenu(point);
    }
    onContextMenuClosed_() {
        const contextButton = this.$.composebox.getContextEntrypointElement();
        if (contextButton) {
            contextButton.classList.remove('menu-open');
        }
    }
    // Fired from voice search component in cr-composebox if minimum height
    // and width are non zero when permission prompt is displayed, or any time
    // when permission prompt hides. Change the css class here to avoid
    // adding css classes in the shared composebox component itself, and
    // so omnibox searchbox can reuse this code later (not just composebox).
    onVoicePermissionPromptChanged(e) {
        if (e.detail.isOpened) { // Permission prompt opened.
            if (this.$.composebox) {
                this.$.composebox.classList.add('has-permission-prompt');
                this.$.composebox.style.setProperty('--cr_composebox_minimum_height', `${e.detail.height}px`);
                this.$.composebox.style.setProperty('--cr_composebox_minimum_width', `${e.detail.width}px`);
            }
        }
        else { // Permission prompt closed.
            if (this.$.composebox) {
                this.$.composebox.classList.remove('has-permission-prompt');
                this.$.composebox.style.removeProperty('--cr_composebox_minimum_height');
                this.$.composebox.style.removeProperty('--cr_composebox_minimum_width');
            }
        }
    }
    /**
     * Forwards close requests along with the active composebox input text so the
     * browser can transfer any typed draft back to the Omnibox.
     */
    onCloseComposebox_(e) {
        this.browserProxy_.handler.requestClose(e.detail.composeboxText);
    }
    setPreserveContextOnClose_(preserveContextOnClose) {
        this.preserveContextOnClose_ = preserveContextOnClose;
    }
    onPopupShown_(context) {
        if (!this.preserveContextOnClose_) {
            // Avoid showing the glow animation when coming back from a preserved
            // context on close as this indicates that the user is returning to the
            // widget after adding context.
            this.$.composebox.playGlowAnimation();
            this.$.composebox.setDefaultModel();
        }
        this.$.composebox.addSearchContext(context);
        this.focusInput_();
        this.preserveContextOnClose_ = false;
    }
    addContext_(context) {
        this.$.composebox.addSearchContext(context);
        this.focusInput_();
        // Reset `preserveContextOnClose_` so subsequent popup closes correctly
        // clear searchbox state (e.g. after adding context via Drive picker while
        // popup stayed open).
        this.setPreserveContextOnClose_(false);
    }
    focusInput_() {
        this.$.composebox.focusInput();
    }
    async clearPopup_() {
        const input = this.$.composebox.input;
        if (!this.preserveContextOnClose_) {
            this.$.composebox.resetSession();
        }
        await this.updateComplete;
        // Transfer input text to the location bar.
        return Promise.resolve({ input });
    }
    onComposeboxSubmit_() {
        this.$.composebox.clearAllInputs(/* querySubmitted= */ true, 
        /* shouldBlockAutoSuggestedTabs= */ false);
    }
    setSearchboxLayoutModeForTesting(mode) {
        this.searchboxLayoutMode_ = mode;
    }
    setHasAllowedInputsForTesting(hasAllowedInputs) {
        this.hasAllowedInputs_ = hasAllowedInputs;
    }
    getSearchboxLayoutModeForTesting() {
        return this.getSearchboxLayoutMode_();
    }
    getHasAllowedInputsForTesting() {
        return this.hasAllowedInputs_;
    }
}
customElements.define(OmniboxAimAppElement.is, OmniboxAimAppElement);
