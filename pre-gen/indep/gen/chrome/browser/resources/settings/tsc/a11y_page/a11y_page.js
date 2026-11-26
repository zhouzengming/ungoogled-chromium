// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview
 * 'settings-a11y-page' is the small section of advanced settings with
 * a link to the web store accessibility page on most platforms, and
 * a subpage with lots of other settings on Chrome OS.
 */
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '../controls/settings_toggle_button.js';
import '../settings_page/settings_section.js';
import { getCss as getSettingsSharedCss } from '../settings_shared_lit.css.js';
// clang-format off
// 
import './ax_annotations_section.js';
// 
// 
// clang-format on
import { PrefService } from '/shared/settings/prefs2/pref_service.js';
import { WebUiListenerMixinLit } from 'chrome://resources/cr_elements/web_ui_listener_mixin_lit.js';
import { assert } from 'chrome://resources/js/assert.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { loadTimeData } from '../i18n_setup.js';
import { routes } from '../route.js';
import { Router } from '../router.js';
import { SettingsViewMixinLit } from '../settings_page/settings_view_mixin_lit.js';
import { AccessibilityBrowserProxyImpl } from './a11y_browser_proxy.js';
import { getHtml } from './a11y_page.html.js';
/**
 * Must be kept in sync with the C++ enum of the same name in
 * chrome/browser/ui/toasts/toast_metrics.h.
 */
export var ToastAlertLevel;
(function (ToastAlertLevel) {
    ToastAlertLevel[ToastAlertLevel["ALL"] = 0] = "ALL";
    ToastAlertLevel[ToastAlertLevel["ACTIONABLE"] = 1] = "ACTIONABLE";
    // Must be last.
    ToastAlertLevel[ToastAlertLevel["COUNT"] = 1] = "COUNT";
})(ToastAlertLevel || (ToastAlertLevel = {}));
const SettingsA11yPageElementBase = SettingsViewMixinLit(WebUiListenerMixinLit(CrLitElement));
// 
export class SettingsA11yPageElement extends SettingsA11yPageElementBase {
    static get is() {
        return 'settings-a11y-page';
    }
    static get styles() {
        return [
            getSettingsSharedCss(),
        ];
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            // 
            enableLiveCaption_: { type: Boolean },
            numericUncheckedToastAlertValues_: { type: Array },
            // 
            /**
             * Indicate whether a screen reader is enabled. Also, determine whether
             * to show accessibility labels settings.
             */
            hasScreenReader_: { type: Boolean },
            /**
             * Whether to show the AxTreeFixing subpage.
             */
            showAxTreeFixingSection_: { type: Boolean },
            // 
            /**
             * Whether to show the AxAnnotations subpage.
             */
            showAxAnnotationsSection_: { type: Boolean },
            // 
        };
    }
    browserProxy_ = AccessibilityBrowserProxyImpl.getInstance();
    #enableLiveCaption__accessor_storage = loadTimeData.getBoolean('enableLiveCaption');
    // 
    get enableLiveCaption_() { return this.#enableLiveCaption__accessor_storage; }
    set enableLiveCaption_(value) { this.#enableLiveCaption__accessor_storage = value; }
    #numericUncheckedToastAlertValues__accessor_storage = [ToastAlertLevel.ACTIONABLE];
    get numericUncheckedToastAlertValues_() { return this.#numericUncheckedToastAlertValues__accessor_storage; }
    set numericUncheckedToastAlertValues_(value) { this.#numericUncheckedToastAlertValues__accessor_storage = value; }
    #hasScreenReader__accessor_storage = false;
    // 
    get hasScreenReader_() { return this.#hasScreenReader__accessor_storage; }
    set hasScreenReader_(value) { this.#hasScreenReader__accessor_storage = value; }
    #showAxTreeFixingSection__accessor_storage = loadTimeData.getBoolean('axTreeFixingEnabled');
    get showAxTreeFixingSection_() { return this.#showAxTreeFixingSection__accessor_storage; }
    set showAxTreeFixingSection_(value) { this.#showAxTreeFixingSection__accessor_storage = value; }
    #showAxAnnotationsSection__accessor_storage = false;
    // 
    get showAxAnnotationsSection_() { return this.#showAxAnnotationsSection__accessor_storage; }
    set showAxAnnotationsSection_(value) { this.#showAxAnnotationsSection__accessor_storage = value; }
    // 
    connectedCallback() {
        super.connectedCallback();
        const updateScreenReaderState = (hasScreenReader) => {
            this.hasScreenReader_ = hasScreenReader;
        };
        this.browserProxy_.getScreenReaderState().then(updateScreenReaderState);
        this.addWebUiListener('screen-reader-state-changed', updateScreenReaderState);
    }
    // 
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has('hasScreenReader_')) {
            this.showAxAnnotationsSection_ = this.computeShowAxAnnotationsSection_();
        }
    }
    // 
    onA11yCaretBrowsingChange_(event) {
        if (event.target.checked) {
            chrome.metricsPrivate.recordUserAction('Accessibility.CaretBrowsing.EnableWithSettings');
        }
        else {
            chrome.metricsPrivate.recordUserAction('Accessibility.CaretBrowsing.DisableWithSettings');
        }
    }
    onA11yImageLabelsChange_(event) {
        const a11yImageLabelsOn = event.target.checked;
        if (a11yImageLabelsOn) {
            chrome.send('confirmA11yImageLabels');
        }
    }
    // 
    /**
     * Return whether to show the AxAnnotations subpage based on:
     *    1. If any annotation's feature flag is enabled.
     *    2. Whether a screen reader is enabled.
     * Note: on ChromeOS, the AxAnnotations subpage is shown on a different
     * settings page; i.e. Settings > Accessibility > Text-to-Speech.
     */
    computeShowAxAnnotationsSection_() {
        const anyAxAnnotationsFeatureEnabled = loadTimeData.getBoolean('mainNodeAnnotationsEnabled');
        return anyAxAnnotationsFeatureEnabled && this.hasScreenReader_;
    }
    onCaptionsClick_() {
        // 
        // 
        Router.getInstance().navigateTo(routes.CAPTIONS);
        // 
    }
    // 
    // 
    onFocusHighlightSettingBooleanControlChange_(event) {
        chrome.metricsPrivate.recordBoolean('Accessibility.FocusHighlight.ToggleEnabled', event.target.checked);
    }
    // 
    // 
    /** private */
    onMoreFeaturesLinkClick_() {
        window.open('https://chrome.google.com/webstore/category/collection/3p_accessibility_extensions');
    }
    // 
    onOverscrollHistoryNavigationChange_(event) {
        const enabled = event.target.checked;
        this.browserProxy_.recordOverscrollHistoryNavigationChanged(enabled);
    }
    // 
    // 
    // 
    onToastAlertLevelChange_() {
        chrome.metricsPrivate.recordEnumerationValue('Toast.FrequencyPrefChanged', PrefService.getInstance()
            .getPref('settings.toast.alert_level')
            .value, ToastAlertLevel.COUNT);
    }
    // 
    // 
    // SettingsViewMixin implementation.
    getFocusConfig() {
        const map = new Map();
        if (routes.CAPTIONS) {
            map.set(routes.CAPTIONS.path, '#captions');
        }
        return map;
    }
    // 
    // SettingsViewMixin implementation.
    getAssociatedControlFor(childViewId) {
        assert(childViewId === 'captions');
        const control = this.shadowRoot.querySelector('#captions');
        assert(control, `Failed to find associated control for child '${childViewId}'`);
        return control;
    }
}
customElements.define(SettingsA11yPageElement.is, SettingsA11yPageElement);
