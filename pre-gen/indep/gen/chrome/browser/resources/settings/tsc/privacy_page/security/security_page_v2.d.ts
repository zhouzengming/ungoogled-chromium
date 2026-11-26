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
import type { CrButtonElement } from 'chrome://resources/cr_elements/cr_button/cr_button.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { ControlledRadioButtonElement } from '../../controls/controlled_radio_button.js';
import type { SettingsRadioGroupElement } from '../../controls/settings_radio_group.js';
import type { SettingsToggleButtonElement } from '../../controls/settings_toggle_button.js';
import type { Route } from '../../router.js';
import { JavascriptOptimizerSetting } from '../../site_settings/constants.js';
import { SafeBrowsingSetting } from './safe_browsing_types.js';
import type { SettingsSecureDnsV2Element } from './secure_dns_v2.js';
import type { SecurityPageFeatureRowElement } from './security_page_feature_row.js';
/** Enumeration of all security settings bundle modes.*/
export declare enum SecuritySettingsBundleSetting {
    STANDARD = 0,
    ENHANCED = 1
}
/** Enumeration of all HTTPS-First Mode setting states.*/
export declare enum HttpsFirstModeSetting {
    DISABLED = 0,
    ENABLED_FULL = 2,
    ENABLED_BALANCED = 3
}
export interface SettingsSecurityPageV2Element {
    $: {
        blockForAllSites: ControlledRadioButtonElement;
        blockForUnfamiliarSites: ControlledRadioButtonElement;
        bundlesRadioGroup: SettingsRadioGroupElement;
        enhancedProtectionButton: ControlledRadioButtonElement;
        httpsFirstModeEnabledBalanced: ControlledRadioButtonElement;
        httpsFirstModeEnabledStrict: ControlledRadioButtonElement;
        httpsFirstModeRadioGroup: SettingsRadioGroupElement;
        httpsFirstModeRow: SecurityPageFeatureRowElement;
        httpsFirstModeToggle: SettingsToggleButtonElement;
        javascriptGuardrailsRow: SecurityPageFeatureRowElement;
        manageSiteExceptionsButton: CrButtonElement;
        passwordsLeakToggle: SettingsToggleButtonElement;
        resetEnhancedBundleToDefaultsButton: CrButtonElement;
        resetStandardBundleToDefaultsButton: CrButtonElement;
        securitySettingsBundleEnhanced: ControlledRadioButtonElement;
        securitySettingsBundleStandard: ControlledRadioButtonElement;
        safeBrowsingRadioGroup: SettingsRadioGroupElement;
        safeBrowsingRow: SecurityPageFeatureRowElement;
        secureDnsV2Row: SettingsSecureDnsV2Element;
        standardProtectionButton: ControlledRadioButtonElement;
    };
}
declare const SettingsSecurityPageV2ElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("../../router.js").RouteObserverMixinInterface);
export declare class SettingsSecurityPageV2Element extends SettingsSecurityPageV2ElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        securitySettingsBundleSettingEnum_: {
            type: ObjectConstructor;
            value: typeof SecuritySettingsBundleSetting;
        };
        safeBrowsingSettingEnum_: {
            type: ObjectConstructor;
            value: typeof SafeBrowsingSetting;
        };
        httpsFirstModeSettingEnum_: {
            type: ObjectConstructor;
            value: typeof HttpsFirstModeSetting;
        };
        isResetStandardBundleToDefaultsButtonVisible_: {
            type: BooleanConstructor;
            value: boolean;
        };
        isResetEnhancedBundleToDefaultsButtonVisible_: {
            type: BooleanConstructor;
            value: boolean;
        };
        isResettingToDefaults_: {
            type: BooleanConstructor;
            value: boolean;
        };
        isHttpsFirstModeEnabled_: {
            type: BooleanConstructor;
            value: boolean;
        };
        isSafeBrowsingEnabled_: {
            type: BooleanConstructor;
            value: boolean;
        };
        isSafeBrowsingWarningIconVisible_: {
            type: BooleanConstructor;
            value: boolean;
        };
        safeBrowsingOff_: {
            type: ArrayConstructor;
            value: () => SafeBrowsingSetting[];
        };
        httpsFirstModeUncheckedValues_: {
            type: ArrayConstructor;
            value: () => HttpsFirstModeSetting[];
        };
        javascriptGuardrailsOff_: {
            type: ArrayConstructor;
            value: () => JavascriptOptimizerSetting[];
        };
        safeBrowsingStateTextMap_: {
            type: ObjectConstructor;
            value: () => {
                2: string;
                1: string;
                0: string;
            };
        };
        javascriptGuardrailsStateTextMap_: {
            type: ObjectConstructor;
            value: () => {
                2: string;
                1: string;
                0: string;
            };
        };
        httpsFirstModeStateTextMap_: {
            type: ObjectConstructor;
            value: () => {
                2: string;
                3: string;
                0: string;
            };
        };
        enableSecurityKeysSubpage_: {
            type: BooleanConstructor;
            readOnly: boolean;
            value(): boolean;
        };
        enableBundledSecuritySettingsSecureDnsV2_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        javascriptOptimizerSettingEnum_: {
            type: ObjectConstructor;
            value: typeof JavascriptOptimizerSetting;
        };
        isSecureDnsManagedByProxy_: {
            type: BooleanConstructor;
            value: boolean;
        };
        shouldHideBundles_: {
            type: BooleanConstructor;
            computed: string;
        };
        showDisableSafebrowsingDialog_: {
            type: BooleanConstructor;
            value: boolean;
        };
        showNewBadge_: {
            type: BooleanConstructor;
            value: boolean;
            notify: boolean;
        };
        currentSafeBrowsingSetting_: typeof SafeBrowsingSetting;
    };
    static get observers(): string[];
    private currentSafeBrowsingSetting_;
    private enableBundledSecuritySettingsSecureDnsV2_;
    private enableSecurityKeysSubpage_;
    private httpsFirstModeUncheckedValues_;
    private httpsFirstModeStateTextMap_;
    private isResettingToDefaults_;
    private isResetStandardBundleToDefaultsButtonVisible_;
    private isResetEnhancedBundleToDefaultsButtonVisible_;
    private isHttpsFirstModeEnabled_;
    private isSafeBrowsingEnabled_;
    private isSafeBrowsingWarningIconVisible_;
    private javascriptGuardrailsOff_;
    private javascriptGuardrailsStateTextMap_;
    private safeBrowsingOff_;
    private safeBrowsingStateTextMap_;
    private isSecureDnsManagedByProxy_;
    private shouldHideBundles_;
    private showDisableSafebrowsingDialog_;
    private showNewBadge_;
    private lastFocusTime_;
    private totalTimeInFocus_;
    private interactions_;
    private safeBrowsingStateOnOpen_;
    private securitySettingsBundleStateOnOpen_;
    private isRouteSecurity_;
    private eventTracker_;
    private browserProxy_;
    private hatsBrowserProxy_;
    private metricsBrowserProxy_;
    connectedCallback(): void;
    ready(): void;
    /**
     * RouteObserverMixin
     */
    currentRouteChanged(route: Route): void;
    /** Updates the total time in focus when the page loses focus. */
    private onBlur_;
    /**
     * Updates the timestamp when the user returns to this security page from
     * another tab.
     */
    private onFocus_;
    private onSecureDnsPrefsChanged_;
    /**
     * Trigger the securityPageHatsRequest api to potentially start the survey.
     */
    private onBeforeUnload_;
    /**
     * Handles clicks on the safe browsing row.
     */
    private onSafeBrowsingRowClick_;
    private onHttpsFirstModeRowClick_;
    private onSafeBrowsingToggleChange_;
    /**
     * Handles changes of the radio button selection inside the safe browsing
     * settings row.
     */
    private onSafeBrowsingRadioChange_;
    /**
     * Handles the closure of the disable safebrowsing dialog, reselects the
     * appropriate radio button if the user cancels the dialog, and puts focus on
     * the safebrowsing row.
     */
    private onDisableSafebrowsingDialogClose_;
    private onSecureDnsRowExpandedChange_;
    private onSecureDnsToggleChange_;
    private onSecureDnsToggleClick_;
    /**
     * Handles changes of the radio button selection inside the secure DNS
     * settings row.
     */
    private onSecureDnsRadioGroupChange_;
    private onHttpsFirstModeToggleChange_;
    private onHttpsFirstModeRadioGroupChange_;
    private onPasswordsLeakToggleChange_;
    private onManageCertificatesClick_;
    private onSecurityKeysClick_;
    private onAdvancedProtectionProgramClick_;
    private onManageSiteExceptionsClick_;
    private onSecurityBundleChanged_;
    private onResetBundleToDefaultsButtonClick_;
    private resetBundleToDefaults_;
    private getBundleSetting_;
    private getDefaultSafeBrowsingValue_;
    private getDefaultJsGuardrailsValue_;
    private getDefaultHttpsFirstModeValue_;
    private getDefaultSecureDnsModeValue_;
    private getDefaultSecureDnsTemplatesValue_;
    private getDefaultSecureDnsFallbackValue_;
    private updateResetButtonVisibility_;
    private updateRowsState_;
    private computeShouldHideBundles_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-security-page-v2': SettingsSecurityPageV2Element;
    }
}
export {};
