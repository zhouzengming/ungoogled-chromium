import '/shared/settings/prefs/prefs.js';
import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import '../../controls/collapse_radio_button.js';
import '../../controls/controlled_radio_button.js';
import '../../controls/settings_radio_group.js';
import '../../controls/settings_toggle_button.js';
import '../../icons.html.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../../simple_confirmation_dialog.js';
import './secure_dns.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsCollapseRadioButtonElement } from '../../controls/collapse_radio_button.js';
import type { SettingsRadioGroupElement } from '../../controls/settings_radio_group.js';
import type { SettingsToggleButtonElement } from '../../controls/settings_toggle_button.js';
import type { Route } from '../../router.js';
import { SecurityPageInteraction } from '../hats_browser_proxy.js';
import { SafeBrowsingSetting } from './safe_browsing_types.js';
/**
 * Enumeration of all HTTPS-First Mode setting states. Must be kept in sync with
 * the enum of the same name located in:
 * chrome/browser/ssl/https_first_mode_settings_tracker.h
 */
export declare enum HttpsFirstModeSetting {
    DISABLED = 0,
    ENABLED_FULL = 2,
    ENABLED_BALANCED = 3
}
export interface SettingsSecurityPageElement {
    $: {
        passwordsLeakToggle: SettingsToggleButtonElement;
        safeBrowsingDisabled: SettingsCollapseRadioButtonElement;
        safeBrowsingEnhanced: SettingsCollapseRadioButtonElement;
        safeBrowsingRadioGroup: SettingsRadioGroupElement;
        safeBrowsingReportingToggle: SettingsToggleButtonElement;
        safeBrowsingStandard: SettingsCollapseRadioButtonElement;
    };
}
declare const SettingsSecurityPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("../../router.js").RouteObserverMixinInterface) & (new (...args: any[]) => import("//resources/cr_components/help_bubble/help_bubble_mixin_interface.js").HelpBubbleMixinInterface);
export declare class SettingsSecurityPageElement extends SettingsSecurityPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Whether the secure DNS setting should be displayed.
         */
        showSecureDnsSetting_: {
            type: BooleanConstructor;
            readOnly: boolean;
            value: () => boolean;
        };
        /**
         * Valid safe browsing states.
         */
        safeBrowsingSettingEnum_: {
            type: ObjectConstructor;
            value: typeof SafeBrowsingSetting;
        };
        /**
         * Valid HTTPS-First Mode states.
         */
        httpsFirstModeSettingEnum_: {
            type: ObjectConstructor;
            value: typeof HttpsFirstModeSetting;
        };
        /**
         * Setting for HTTPS-First Mode when the toggle is off.
         */
        httpsFirstModeUncheckedValues_: {
            type: ArrayConstructor;
            value: () => HttpsFirstModeSetting[];
        };
        javascriptOptimizerSubLabel_: {
            type: StringConstructor;
            value: string;
        };
        enableHttpsFirstModeNewSettings_: {
            type: BooleanConstructor;
            readOnly: boolean;
            value(): boolean;
        };
        enableSecurityKeysSubpage_: {
            type: BooleanConstructor;
            readOnly: boolean;
            value(): boolean;
        };
        enableHashPrefixRealTimeLookups_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        hideExtendedReportingRadioButton_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        showDisableSafebrowsingDialog_: BooleanConstructor;
        /**
         * A timestamp that records the last time the user visited this page or
         * returned to it.
         */
        lastFocusTime_: NumberConstructor;
        /** The total amount of time a user spent on the page in focus. */
        totalTimeInFocus_: {
            type: NumberConstructor;
            value: number;
        };
        /** Latest user interaction type on the security page. */
        lastInteraction_: {
            type: typeof SecurityPageInteraction;
            value: SecurityPageInteraction;
        };
        /** Safe browsing state when the page opened. */
        safeBrowsingStateOnOpen_: typeof SafeBrowsingSetting;
        /** Whether the user is currently on the security page or not. */
        isRouteSecurity_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    private showSecureDnsSetting_;
    private enableSecurityKeysSubpage_;
    private showDisableSafebrowsingDialog_;
    private enableHashPrefixRealTimeLookups_;
    private httpsFirstModeUncheckedValues_;
    private enableHttpsFirstModeNewSettings_;
    private javascriptOptimizerSubLabel_;
    private lastFocusTime_;
    private totalTimeInFocus_;
    private lastInteraction_;
    private safeBrowsingStateOnOpen_;
    private isRouteSecurity_;
    private eventTracker_;
    private hideExtendedReportingRadioButton_;
    private metricsBrowserProxy_;
    private siteBrowserProxy_;
    ready(): void;
    /**
     * RouteObserverMixin
     */
    currentRouteChanged(route: Route, oldRoute?: Route): void;
    /** Call this function when the user switches to another tab. */
    private onBlur_;
    /** Call this function when the user returns to it from other tabs. */
    private onFocus_;
    /**
     * Trigger the securityPageHatsRequest api to potentially start the survey.
     */
    private onBeforeUnload_;
    /**
     * Updates the buttons' expanded status by propagating previous click
     * events
     */
    private updateCollapsedButtons_;
    private updateJavascriptOptimizerEnabledByDefault_;
    /**
     * Possibly displays the Safe Browsing disable dialog based on the users
     * selection.
     */
    private onSafeBrowsingRadioChange_;
    private interactedWithPage_;
    private getDisabledExtendedSafeBrowsing_;
    private getSafeBrowsingStandardSubLabel_;
    private getPasswordsLeakToggleSubLabel_;
    private getName_;
    private getHttpsFirstModeSubLabel_;
    private isHttpsFirstModeExpanded_;
    private onManageCertificatesClick_;
    private onAdvancedProtectionProgramLinkClick_;
    private onJavascriptOptimizerSettingsClick_;
    private onSecurityKeysClick_;
    private onEnhancedProtectionLearnMoreClick_;
    private onSafeBrowsingExtendedReportingChange_;
    /**
     * Handles the closure of the disable safebrowsing dialog, reselects the
     * appropriate radio button if the user cancels the dialog, and puts focus on
     * the disable safebrowsing button.
     */
    private onDisableSafebrowsingDialogClose_;
    private onEnhancedProtectionExpandButtonClicked_;
    private onStandardProtectionExpandButtonClicked_;
    private recordInteractionHistogramOnRadioChange_;
    private recordInteractionHistogramOnExpandButtonClicked_;
    private recordInteractionHistogramOnSafeBrowsingDialogClose_;
    private recordActionOnRadioChange_;
    private recordActionOnExpandButtonClicked_;
    private recordActionOnSafeBrowsingDialogClose_;
    getFocusConfig(): Map<string, string>;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-security-page': SettingsSecurityPageElement;
    }
}
export {};
