// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import '/shared/settings/prefs/prefs.js';
import '../../controls/controlled_radio_button.js';
import '../../controls/settings_radio_group.js';
import '../../icons.html.js';
import '../../controls/settings_toggle_button.js';
import '../../settings_page/settings_section.js';
import '../../settings_page/settings_subpage.js';
import '../../simple_confirmation_dialog.js';
import './security_page_feature_row.js';
import './secure_dns.js';
import './secure_dns_v2.js';
import { PrefsMixin } from '/shared/settings/prefs/prefs_mixin.js';
import { CrSettingsPrefs } from '/shared/settings/prefs/prefs_types.js';
import { SecureDnsMode, SecureDnsUiManagementMode, SecurityPageBrowserProxyImpl } from '/shared/settings/security_page/security_page_browser_proxy.js';
import { WebUiListenerMixin } from 'chrome://resources/cr_elements/web_ui_listener_mixin.js';
import { assert, assertNotReachedCase } from 'chrome://resources/js/assert.js';
import { EventTracker } from 'chrome://resources/js/event_tracker.js';
import { focusWithoutInk } from 'chrome://resources/js/focus_without_ink.js';
import { OpenWindowProxyImpl } from 'chrome://resources/js/open_window_proxy.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { loadTimeData } from '../../i18n_setup.js';
import { MetricsBrowserProxyImpl, PrivacyElementInteractions, SafeBrowsingInteractions } from '../../metrics_browser_proxy.js';
import { routes } from '../../route.js';
import { RouteObserverMixin, Router } from '../../router.js';
import { SettingsViewMixin } from '../../settings_page/settings_view_mixin.js';
import { JavascriptOptimizerSetting } from '../../site_settings/constants.js';
import { HatsBrowserProxyImpl, SecurityPageV2Interaction } from '../hats_browser_proxy.js';
import { SafeBrowsingSetting } from './safe_browsing_types.js';
import { SecureDnsV2ResolverType } from './secure_dns_v2.js';
import { getTemplate } from './security_page_v2.html.js';
/** Enumeration of all security settings bundle modes.*/
// LINT.IfChange(SecuritySettingsBundleSetting)
export var SecuritySettingsBundleSetting;
(function (SecuritySettingsBundleSetting) {
    SecuritySettingsBundleSetting[SecuritySettingsBundleSetting["STANDARD"] = 0] = "STANDARD";
    SecuritySettingsBundleSetting[SecuritySettingsBundleSetting["ENHANCED"] = 1] = "ENHANCED";
})(SecuritySettingsBundleSetting || (SecuritySettingsBundleSetting = {}));
// LINT.ThenChange(/components/safe_browsing/core/common/safe_browsing_prefs.h:SecuritySettingsBundleSetting)
/** Enumeration of all HTTPS-First Mode setting states.*/
// LINT.IfChange(HttpsFirstModeSetting)
export var HttpsFirstModeSetting;
(function (HttpsFirstModeSetting) {
    HttpsFirstModeSetting[HttpsFirstModeSetting["DISABLED"] = 0] = "DISABLED";
    // DEPRECATED: A separate Incognito setting never shipped.
    // ENABLED_INCOGNITO = 1,
    HttpsFirstModeSetting[HttpsFirstModeSetting["ENABLED_FULL"] = 2] = "ENABLED_FULL";
    HttpsFirstModeSetting[HttpsFirstModeSetting["ENABLED_BALANCED"] = 3] = "ENABLED_BALANCED";
})(HttpsFirstModeSetting || (HttpsFirstModeSetting = {}));
const SettingsSecurityPageV2ElementBase = RouteObserverMixin(SettingsViewMixin(WebUiListenerMixin(PrefsMixin(PolymerElement))));
export class SettingsSecurityPageV2Element extends SettingsSecurityPageV2ElementBase {
    static get is() {
        return 'settings-security-page-v2';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            securitySettingsBundleSettingEnum_: {
                type: Object,
                value: SecuritySettingsBundleSetting,
            },
            safeBrowsingSettingEnum_: {
                type: Object,
                value: SafeBrowsingSetting,
            },
            httpsFirstModeSettingEnum_: {
                type: Object,
                value: HttpsFirstModeSetting,
            },
            isResetStandardBundleToDefaultsButtonVisible_: {
                type: Boolean,
                value: false,
            },
            isResetEnhancedBundleToDefaultsButtonVisible_: {
                type: Boolean,
                value: false,
            },
            // Whether the security-setting-bundle is being reset to default.
            isResettingToDefaults_: {
                type: Boolean,
                value: false,
            },
            isHttpsFirstModeEnabled_: {
                type: Boolean,
                value: true,
            },
            isSafeBrowsingEnabled_: {
                type: Boolean,
                value: true,
            },
            isSafeBrowsingWarningIconVisible_: {
                type: Boolean,
                value: false,
            },
            safeBrowsingOff_: {
                type: Array,
                value: () => [SafeBrowsingSetting.DISABLED],
            },
            httpsFirstModeUncheckedValues_: {
                type: Array,
                value: () => [HttpsFirstModeSetting.DISABLED],
            },
            javascriptGuardrailsOff_: {
                type: Array,
                value: () => [JavascriptOptimizerSetting.ALLOWED],
            },
            safeBrowsingStateTextMap_: {
                type: Object,
                value: () => ({
                    [SafeBrowsingSetting.ENHANCED]: loadTimeData.getString('securityFeatureRowStateEnhanced'),
                    [SafeBrowsingSetting.STANDARD]: loadTimeData.getString('securityFeatureRowStateStandard'),
                    [SafeBrowsingSetting.DISABLED]: loadTimeData.getString('securityFeatureRowStateOff'),
                }),
            },
            javascriptGuardrailsStateTextMap_: {
                type: Object,
                value: () => ({
                    [JavascriptOptimizerSetting.BLOCKED_FOR_UNFAMILIAR_SITES]: loadTimeData.getString('securityFeatureRowStateEnhanced'),
                    [JavascriptOptimizerSetting.ALLOWED]: loadTimeData.getString('securityFeatureRowStateStandard'),
                    [JavascriptOptimizerSetting.BLOCKED]: loadTimeData.getString('securityFeatureRowStateEnhancedStrict'),
                }),
            },
            httpsFirstModeStateTextMap_: {
                type: Object,
                value: () => ({
                    [HttpsFirstModeSetting.ENABLED_FULL]: loadTimeData.getString('securityFeatureRowStateEnhancedStrict'),
                    [HttpsFirstModeSetting.ENABLED_BALANCED]: loadTimeData.getString('securityFeatureRowStateEnhanced'),
                    [HttpsFirstModeSetting.DISABLED]: loadTimeData.getString('securityFeatureRowStateStandard'),
                }),
            },
            enableSecurityKeysSubpage_: {
                type: Boolean,
                readOnly: true,
                value() {
                    return loadTimeData.getBoolean('enableSecurityKeysSubpage');
                },
            },
            enableBundledSecuritySettingsSecureDnsV2_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean('enableBundledSecuritySettingsSecureDnsV2'),
            },
            javascriptOptimizerSettingEnum_: {
                type: Object,
                value: JavascriptOptimizerSetting,
            },
            isSecureDnsManagedByProxy_: {
                type: Boolean,
                value: false,
            },
            shouldHideBundles_: {
                type: Boolean,
                computed: 'computeShouldHideBundles_(' +
                    'prefs.generated.safe_browsing.*, ' +
                    'prefs.dns_over_https.mode.*, ' +
                    'prefs.generated.javascript_optimizer.*, ' +
                    'enableBundledSecuritySettingsSecureDnsV2_, ' +
                    'isSecureDnsManagedByProxy_)',
            },
            showDisableSafebrowsingDialog_: {
                type: Boolean,
                value: false,
            },
            showNewBadge_: {
                type: Boolean,
                value: false,
                notify: true,
            },
            currentSafeBrowsingSetting_: SafeBrowsingSetting,
        };
    }
    static get observers() {
        return [
            'updateResetButtonVisibility_(' +
                'isResettingToDefaults_,' +
                'prefs.generated.security_settings_bundle.value,' +
                'prefs.generated.safe_browsing.*,' +
                'prefs.dns_over_https.mode.*, ' +
                'prefs.dns_over_https.templates.*, ' +
                'prefs.dns_over_https.automatic_mode_fallback_to_doh.*,' +
                'prefs.generated.javascript_optimizer.*,' +
                'prefs.generated.https_first_mode_enabled.*),',
            'updateRowsState_(' +
                'prefs.generated.https_first_mode_enabled.*,' +
                'prefs.generated.safe_browsing.*,' +
                'prefs.generated.javascript_optimizer.*),',
        ];
    }
    lastFocusTime_;
    totalTimeInFocus_ = 0;
    interactions_ = new Set();
    safeBrowsingStateOnOpen_;
    securitySettingsBundleStateOnOpen_;
    isRouteSecurity_ = true;
    eventTracker_ = new EventTracker();
    browserProxy_ = SecurityPageBrowserProxyImpl.getInstance();
    hatsBrowserProxy_ = HatsBrowserProxyImpl.getInstance();
    metricsBrowserProxy_ = MetricsBrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        this.browserProxy_.getSecureDnsSetting().then((setting) => this.onSecureDnsPrefsChanged_(setting));
        this.addWebUiListener('secure-dns-setting-changed', (setting) => this.onSecureDnsPrefsChanged_(setting));
    }
    ready() {
        super.ready();
        // Initialize the last focus time on page load.
        this.lastFocusTime_ = this.hatsBrowserProxy_.now();
    }
    /**
     * RouteObserverMixin
     */
    currentRouteChanged(route) {
        if (route !== routes.SECURITY) {
            this.onBeforeUnload_();
            this.isRouteSecurity_ = false;
            this.eventTracker_.removeAll();
            return;
        }
        this.eventTracker_.add(window, 'focus', this.onFocus_.bind(this));
        this.eventTracker_.add(window, 'blur', this.onBlur_.bind(this));
        this.eventTracker_.add(window, 'beforeunload', this.onBeforeUnload_.bind(this));
        // When the route changes to the security page, reset the state.
        // This is done here instead of in ready() because the user may navigate to
        // another settings page in the same tab and then come back to this
        // security page. These would be treated as two different sessions.
        this.isRouteSecurity_ = true;
        this.interactions_.clear();
        this.totalTimeInFocus_ = 0;
        this.lastFocusTime_ = this.hatsBrowserProxy_.now();
        const queryParams = Router.getInstance().getQueryParameters();
        const highlight = queryParams.get('highlight');
        if (highlight === 'secureConnections') {
            const row = this.shadowRoot.querySelector('#httpsFirstModeRow');
            if (row) {
                row.classList.add('highlight');
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        CrSettingsPrefs.initialized.then(() => {
            // Capture the initial value of HFM bundle toast queued preference and set
            // the local showNewBadge_ property.
            const toastQueuedPref = this.getPref('https_first_mode_bundle_toast_queued');
            const isNew = toastQueuedPref ? !toastQueuedPref.value : true;
            this.showNewBadge_ = isNew;
            // Immediately mark the toast/badge as queued/shown so it is dismissed on
            // subsequent visits.
            this.setPrefValue('https_first_mode_bundle_toast_queued', true);
            this.safeBrowsingStateOnOpen_ =
                this.getPref('generated.safe_browsing').value;
            this.currentSafeBrowsingSetting_ =
                this.getPref('generated.safe_browsing').value;
            this.securitySettingsBundleStateOnOpen_ =
                this.getPref('generated.security_settings_bundle')
                    .value;
        });
    }
    /** Updates the total time in focus when the page loses focus. */
    onBlur_() {
        // If the user is not on the security page, we will not add to the total
        // time in focus.
        if (!this.isRouteSecurity_) {
            return;
        }
        // Add the amount of time a user spent on the page for the
        // current session to the total time in focus.
        const timeSinceLastFocus = this.hatsBrowserProxy_.now() - this.lastFocusTime_;
        this.totalTimeInFocus_ += timeSinceLastFocus;
        // Set the lastFocusTime_ variable to undefined. This indicates that the
        // totalTimeInFocus_ variable is up to date.
        this.lastFocusTime_ = undefined;
    }
    /**
     * Updates the timestamp when the user returns to this security page from
     * another tab.
     */
    onFocus_() {
        this.lastFocusTime_ = this.hatsBrowserProxy_.now();
    }
    onSecureDnsPrefsChanged_(setting) {
        this.isSecureDnsManagedByProxy_ =
            setting.managementMode !== SecureDnsUiManagementMode.NO_OVERRIDE;
    }
    /**
     * Trigger the securityPageHatsRequest api to potentially start the survey.
     */
    onBeforeUnload_() {
        if (!this.isRouteSecurity_) {
            return;
        }
        if (this.safeBrowsingStateOnOpen_ === undefined ||
            this.securitySettingsBundleStateOnOpen_ === undefined) {
            return;
        }
        // Calculate the total time spent on the page.
        if (this.lastFocusTime_ !== undefined) {
            this.totalTimeInFocus_ +=
                this.hatsBrowserProxy_.now() - this.lastFocusTime_;
        }
        const interactions = Array.from(this.interactions_);
        this.hatsBrowserProxy_.securityPageV2HatsRequest(interactions, this.safeBrowsingStateOnOpen_, this.totalTimeInFocus_, this.securitySettingsBundleStateOnOpen_);
    }
    /**
     * Handles clicks on the safe browsing row.
     */
    onSafeBrowsingRowClick_(e) {
        // Contains the new state of the row (true if expanded, false if collapsed).
        const isExpanded = e.detail.value;
        if (isExpanded) {
            this.interactions_.add(SecurityPageV2Interaction.SAFE_BROWSING_ROW_EXPANDED);
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.SafeBrowsingRowExpanded');
        }
    }
    onHttpsFirstModeRowClick_(e) {
        const isExpanded = e.detail.value;
        if (isExpanded) {
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.HttpsFirstModeRowExpanded');
            this.setPrefValue('https_first_mode_bundle_toast_queued', true);
        }
    }
    onSafeBrowsingToggleChange_() {
        this.interactions_.add(SecurityPageV2Interaction.SAFE_BROWSING_TOGGLE_CLICK);
        if (!this.isSafeBrowsingEnabled_) {
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.DisableSafeBrowsingClicked');
            this.showDisableSafebrowsingDialog_ = true;
        }
    }
    /**
     * Handles changes of the radio button selection inside the safe browsing
     * settings row.
     */
    onSafeBrowsingRadioChange_() {
        const selected = Number.parseInt(this.$.safeBrowsingRadioGroup.selected || '', 10);
        if (selected === SafeBrowsingSetting.STANDARD) {
            this.interactions_.add(SecurityPageV2Interaction.STANDARD_SAFE_BROWSING_RADIO_BUTTON_CLICK);
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.StandardProtectionClicked');
            this.currentSafeBrowsingSetting_ = SafeBrowsingSetting.STANDARD;
        }
        else if (selected === SafeBrowsingSetting.ENHANCED) {
            this.interactions_.add(SecurityPageV2Interaction.ENHANCED_SAFE_BROWSING_RADIO_BUTTON_CLICK);
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.EnhancedProtectionClicked');
            this.currentSafeBrowsingSetting_ = SafeBrowsingSetting.ENHANCED;
        }
    }
    /**
     * Handles the closure of the disable safebrowsing dialog, reselects the
     * appropriate radio button if the user cancels the dialog, and puts focus on
     * the safebrowsing row.
     */
    onDisableSafebrowsingDialogClose_() {
        const dialog = this.shadowRoot.querySelector('settings-simple-confirmation-dialog');
        assert(dialog);
        const confirmed = dialog.wasConfirmed();
        // Check if the dialog was confirmed before closing it.
        if (confirmed) {
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.DisableSafeBrowsingDialogConfirmed');
            this.metricsBrowserProxy_.recordSafeBrowsingInteractionHistogram(SafeBrowsingInteractions
                .SAFE_BROWSING_DISABLE_SAFE_BROWSING_DIALOG_CONFIRMED);
        }
        else {
            // Reset SafeBrowsing setting to previously selected option.
            this.setPrefValue('generated.safe_browsing', this.currentSafeBrowsingSetting_);
            this.metricsBrowserProxy_.recordAction('SafeBrowsing.Settings.DisableSafeBrowsingDialogDenied');
            this.metricsBrowserProxy_.recordSafeBrowsingInteractionHistogram(SafeBrowsingInteractions
                .SAFE_BROWSING_DISABLE_SAFE_BROWSING_DIALOG_DENIED);
        }
        this.showDisableSafebrowsingDialog_ = false;
        // Set focus back to the row regardless of user interaction
        // with the dialog, as it was the entry point to the dialog.
        focusWithoutInk(this.$.safeBrowsingRow);
    }
    onSecureDnsRowExpandedChange_(e) {
        // Contains the new state of the row (true if expanded, false if collapsed).
        const isExpanded = e.detail.value;
        if (isExpanded) {
            this.interactions_.add(SecurityPageV2Interaction.SECURE_DNS_V2_ROW_EXPANDED);
        }
    }
    onSecureDnsToggleChange_() {
        this.interactions_.add(SecurityPageV2Interaction.SECURE_DNS_V2_TOGGLE_CLICK);
    }
    onSecureDnsToggleClick_() {
        this.interactions_.add(SecurityPageV2Interaction.SECURE_DNS_TOGGLE_CLICK);
    }
    /**
     * Handles changes of the radio button selection inside the secure DNS
     * settings row.
     */
    onSecureDnsRadioGroupChange_(e) {
        const selected = e.detail.value;
        switch (selected) {
            case SecureDnsV2ResolverType.AUTOMATIC:
                this.interactions_.add(SecurityPageV2Interaction
                    .SECURE_DNS_V2_AUTOMATIC_RADIO_BUTTON_CLICK);
                break;
            case SecureDnsV2ResolverType.FALLBACK:
                this.interactions_.add(SecurityPageV2Interaction
                    .SECURE_DNS_V2_FALLBACK_RADIO_BUTTON_CLICK);
                break;
            case SecureDnsV2ResolverType.CUSTOM:
                this.interactions_.add(SecurityPageV2Interaction.SECURE_DNS_V2_CUSTOM_RADIO_BUTTON_CLICK);
                break;
            case SecureDnsV2ResolverType.BUILT_IN:
                // There is technically no button for the built-in resolver type.
                break;
            default:
                assertNotReachedCase(selected, 'Received unknown secure DNS radio button selection: ' + selected);
        }
    }
    onHttpsFirstModeToggleChange_() {
        this.interactions_.add(SecurityPageV2Interaction.HTTPS_FIRST_MODE_TOGGLE_CLICK);
    }
    onHttpsFirstModeRadioGroupChange_() {
        const selected = Number.parseInt(this.$.httpsFirstModeRadioGroup.selected || '', 10);
        if (selected === HttpsFirstModeSetting.ENABLED_BALANCED) {
            this.interactions_.add(SecurityPageV2Interaction
                .BALANCED_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK);
        }
        else if (selected === HttpsFirstModeSetting.ENABLED_FULL) {
            this.interactions_.add(SecurityPageV2Interaction.STRICT_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK);
        }
    }
    onPasswordsLeakToggleChange_() {
        this.interactions_.add(SecurityPageV2Interaction.PASSWORD_LEAK_DETECTION_TOGGLE_CLICK);
    }
    onManageCertificatesClick_() {
        this.metricsBrowserProxy_.recordSettingsPageHistogram(PrivacyElementInteractions.MANAGE_CERTIFICATES);
        OpenWindowProxyImpl.getInstance().openUrl(loadTimeData.getString('certManagementV2URL'));
    }
    onSecurityKeysClick_() {
        Router.getInstance().navigateTo(routes.SECURITY_KEYS);
    }
    onAdvancedProtectionProgramClick_(e) {
        OpenWindowProxyImpl.getInstance().openUrl(loadTimeData.getString('advancedProtectionURL'));
        // The Advanced Protection Program link is part of a string that is
        // contained in a link-row. The default link navigation action will
        // be ignored to ensure that the click will only be registered for
        // the link inside the string and not also for the link-row.
        if (e.target.tagName === 'A') {
            e.preventDefault();
            return;
        }
    }
    onManageSiteExceptionsClick_() {
        Router.getInstance().navigateTo(routes.SITE_SETTINGS_JAVASCRIPT_OPTIMIZER);
    }
    onSecurityBundleChanged_() {
        const selected = Number.parseInt(this.$.bundlesRadioGroup.selected || '', 10);
        if (selected === SecuritySettingsBundleSetting.STANDARD) {
            this.interactions_.add(SecurityPageV2Interaction.STANDARD_BUNDLE_RADIO_BUTTON_CLICK);
        }
        else if (selected === SecuritySettingsBundleSetting.ENHANCED) {
            this.interactions_.add(SecurityPageV2Interaction.ENHANCED_BUNDLE_RADIO_BUTTON_CLICK);
        }
        this.resetBundleToDefaults_();
    }
    onResetBundleToDefaultsButtonClick_() {
        this.resetBundleToDefaults_();
    }
    resetBundleToDefaults_() {
        this.isResettingToDefaults_ = true;
        const bundleSetting = this.getBundleSetting_();
        this.setPrefValue('generated.safe_browsing', this.getDefaultSafeBrowsingValue_(bundleSetting));
        this.currentSafeBrowsingSetting_ =
            this.getDefaultSafeBrowsingValue_(bundleSetting);
        this.setPrefValue('generated.javascript_optimizer', this.getDefaultJsGuardrailsValue_(bundleSetting));
        this.setPrefValue('generated.https_first_mode_enabled', this.getDefaultHttpsFirstModeValue_(bundleSetting));
        if (this.enableBundledSecuritySettingsSecureDnsV2_) {
            this.setPrefValue('dns_over_https.mode', this.getDefaultSecureDnsModeValue_());
            this.setPrefValue('dns_over_https.templates', this.getDefaultSecureDnsTemplatesValue_());
            this.setPrefValue('dns_over_https.automatic_mode_fallback_to_doh', this.getDefaultSecureDnsFallbackValue_(bundleSetting));
        }
        this.isResettingToDefaults_ = false;
    }
    getBundleSetting_() {
        return this
            .getPref('generated.security_settings_bundle')
            .value;
    }
    getDefaultSafeBrowsingValue_(bundleSetting) {
        return loadTimeData.getInteger((bundleSetting === SecuritySettingsBundleSetting.ENHANCED) ?
            'securityEnhancedBundleSafeBrowsingDefault' :
            'securityStandardBundleSafeBrowsingDefault');
    }
    getDefaultJsGuardrailsValue_(bundleSetting) {
        return loadTimeData.getInteger((bundleSetting === SecuritySettingsBundleSetting.ENHANCED) ?
            'securityEnhancedBundleJavascriptGuardrailsDefault' :
            'securityStandardBundleJavascriptGuardrailsDefault');
    }
    getDefaultHttpsFirstModeValue_(bundleSetting) {
        return (bundleSetting === SecuritySettingsBundleSetting.ENHANCED) ?
            HttpsFirstModeSetting.ENABLED_BALANCED :
            HttpsFirstModeSetting.DISABLED;
    }
    getDefaultSecureDnsModeValue_() {
        if (!this.enableBundledSecuritySettingsSecureDnsV2_) {
            return null;
        }
        return SecureDnsMode.AUTOMATIC;
    }
    getDefaultSecureDnsTemplatesValue_() {
        if (!this.enableBundledSecuritySettingsSecureDnsV2_) {
            return null;
        }
        return '';
    }
    getDefaultSecureDnsFallbackValue_(bundleSetting) {
        if (!this.enableBundledSecuritySettingsSecureDnsV2_) {
            return null;
        }
        return (bundleSetting === SecuritySettingsBundleSetting.ENHANCED);
    }
    updateResetButtonVisibility_() {
        this.isResetStandardBundleToDefaultsButtonVisible_ = false;
        this.isResetEnhancedBundleToDefaultsButtonVisible_ = false;
        if (this.isResettingToDefaults_) {
            return;
        }
        const bundleSetting = this.getBundleSetting_();
        // LINT.IfChange
        const prefsToCheck = [
            {
                prefKey: 'generated.safe_browsing',
                defaultValue: this.getDefaultSafeBrowsingValue_(bundleSetting),
            },
            {
                prefKey: 'dns_over_https.mode',
                defaultValue: this.getDefaultSecureDnsModeValue_(),
            },
            {
                prefKey: 'dns_over_https.templates',
                defaultValue: this.getDefaultSecureDnsTemplatesValue_(),
            },
            {
                prefKey: 'dns_over_https.automatic_mode_fallback_to_doh',
                defaultValue: this.getDefaultSecureDnsFallbackValue_(bundleSetting),
            },
            {
                prefKey: 'generated.javascript_optimizer',
                defaultValue: this.getDefaultJsGuardrailsValue_(bundleSetting),
            },
            {
                prefKey: 'generated.https_first_mode_enabled',
                defaultValue: this.getDefaultHttpsFirstModeValue_(bundleSetting),
            },
        ];
        // LINT.ThenChange(//chrome/browser/safe_browsing/safe_browsing_service.cc,//chrome/browser/safe_browsing/metrics/bundled_settings_metrics_provider.cc)
        for (const prefToCheck of prefsToCheck) {
            const pref = this.getPref(prefToCheck.prefKey);
            if (prefToCheck.defaultValue != null &&
                pref.value !== prefToCheck.defaultValue &&
                pref.controlledBy == null) {
                if (bundleSetting === SecuritySettingsBundleSetting.ENHANCED) {
                    this.isResetEnhancedBundleToDefaultsButtonVisible_ = true;
                }
                else {
                    this.isResetStandardBundleToDefaultsButtonVisible_ = true;
                }
                return;
            }
        }
    }
    updateRowsState_() {
        const httpsFirstModePref = this.getPref('generated.https_first_mode_enabled');
        this.isHttpsFirstModeEnabled_ = httpsFirstModePref.value !== undefined &&
            httpsFirstModePref.value !== HttpsFirstModeSetting.DISABLED;
        const safeBrowsingPref = this.getPref('generated.safe_browsing');
        this.isSafeBrowsingEnabled_ = safeBrowsingPref.value !== undefined &&
            safeBrowsingPref.value !== SafeBrowsingSetting.DISABLED;
        this.isSafeBrowsingWarningIconVisible_ = !this.isSafeBrowsingEnabled_ &&
            safeBrowsingPref.enforcement !==
                chrome.settingsPrivate.Enforcement.ENFORCED;
    }
    computeShouldHideBundles_() {
        if (this.getPref('generated.safe_browsing').enforcement ===
            chrome.settingsPrivate.Enforcement.ENFORCED) {
            return true;
        }
        if (this.enableBundledSecuritySettingsSecureDnsV2_) {
            if (this.getPref('dns_over_https.mode').enforcement ===
                chrome.settingsPrivate.Enforcement.ENFORCED ||
                this.isSecureDnsManagedByProxy_) {
                return true;
            }
        }
        if (this.getPref('generated.javascript_optimizer').enforcement ===
            chrome.settingsPrivate.Enforcement.ENFORCED &&
            this.getPref('generated.javascript_optimizer').controlledBy !==
                chrome.settingsPrivate.ControlledBy.SAFE_BROWSING_OFF) {
            return true;
        }
        return false;
    }
    // SettingsViewMixin implementation.
    focusBackButton() {
        this.shadowRoot.querySelector('settings-subpage').focusBackButton();
    }
}
customElements.define(SettingsSecurityPageV2Element.is, SettingsSecurityPageV2Element);
