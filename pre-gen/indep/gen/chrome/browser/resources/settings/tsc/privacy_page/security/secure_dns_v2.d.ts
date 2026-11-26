/**
 * NOTE: This is currently forked over from the original settings-secure-dns.
 * @fileoverview 'settings-secure-dns-v2' is a setting that allows the secure
 * DNS mode and secure DNS resolvers to be configured.
 *
 * The underlying secure DNS prefs are not read directly since the setting is
 * meant to represent the current state of the host resolver, which depends not
 * only on the prefs but also a few other factors (e.g. whether we've detected a
 * managed environment, whether we've detected parental controls, etc). Instead,
 * the setting listens for secure-dns-setting-changed events, which are sent
 * by PrivacyPageBrowserProxy and describe the new host resolver configuration.
 */
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/md_select.css.js';
import '/shared/settings/prefs/prefs.js';
import './security_page_feature_row.js';
import '../../controls/controlled_radio_button.js';
import 'chrome://resources/cr_elements/cr_radio_group/cr_radio_group.js';
import './secure_dns_input.js';
import { SecureDnsMode } from '/shared/settings/security_page/security_page_browser_proxy.js';
import type { CrRadioGroupElement } from 'chrome://resources/cr_elements/cr_radio_group/cr_radio_group.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { ControlledRadioButtonElement } from '../../controls/controlled_radio_button.js';
import type { SecureDnsInputElement } from './secure_dns_input.js';
import type { SecurityPageFeatureRowElement } from './security_page_feature_row.js';
export interface SettingsSecureDnsV2Element {
    $: {
        automaticRadioButton: ControlledRadioButtonElement;
        customRadioButton: ControlledRadioButtonElement;
        fallbackRadioButton: ControlledRadioButtonElement;
        featureRow: SecurityPageFeatureRowElement;
        privacyPolicy: HTMLElement;
        secureDnsInput: SecureDnsInputElement;
        secureDnsInputContainer: HTMLElement;
        radioGroup: CrRadioGroupElement;
        resolverSelect: HTMLSelectElement;
    };
}
declare const SettingsSecureDnsV2ElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface);
/**
 * Enum for the categories of options in the secure DNS resolver select
 * menu and the radio button group.
 */
export declare enum SecureDnsV2ResolverType {
    AUTOMATIC = "automatic",
    FALLBACK = "fallback",
    BUILT_IN = "built-in",
    CUSTOM = "custom"
}
export declare class SettingsSecureDnsV2Element extends SettingsSecureDnsV2ElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Mirroring the secure DNS resolver enum so that it can be used from HTML
         * bindings.
         */
        resolverTypeEnum_: {
            type: ObjectConstructor;
            value: typeof SecureDnsV2ResolverType;
        };
        /**
         * The setting sublabel.
         */
        secureDnsDescription_: StringConstructor;
        /**
         * Represents whether the main toggle for the secure DNS setting is
         * switched on or off.
         */
        secureDnsTogglePref_: {
            type: ObjectConstructor;
            value(): {
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
        /**
         * List of secure DNS resolvers to display in dropdown menu.
         */
        resolverOptions_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        /**
         * String displaying the privacy policy of the resolver selected in the
         * dropdown menu.
         */
        privacyPolicyString_: StringConstructor;
        /**
         * String to display in the custom text field.
         */
        secureDnsInputValue_: StringConstructor;
        /**
         * Helper array to map the OFF mode to the unchecked state of the toggle.
         * Used by security-page-feature-row.
         */
        secureDnsModeUncheckedValues_: {
            type: ArrayConstructor;
            value: () => SecureDnsMode[];
        };
        /**
         * Tracks which radio button is currently selected.
         * Values: 'automatic', 'fallback', or 'custom'.
         */
        selectedMode_: StringConstructor;
        isSecureDnsWarningIconVisible_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
         * Controls visibility of the custom input container.
         * Replaces the old 'showSecureDnsOptions_' logic.
         */
        showCustomInput_: BooleanConstructor;
        /**
         * State text map to map each radio button to a string.
         */
        secureDnsStateTextMap_: {
            type: ObjectConstructor;
            value: () => {
                automatic: string;
                fallback: string;
                custom: string;
                off: string;
            };
        };
        /**
         * Computed key for the feature row text.
         * Automatically updates when the toggle or selection changes.
         */
        computedStateKey_: {
            type: StringConstructor;
            computed: string;
        };
    };
    static get observers(): string[];
    private resolverTypeEnum_;
    private secureDnsDescription_;
    private secureDnsTogglePref_;
    private resolverOptions_;
    private privacyPolicyString_;
    private secureDnsInputValue_;
    private secureDnsModeUncheckedValues_;
    private selectedMode_;
    private isSecureDnsWarningIconVisible_;
    private showCustomInput_;
    private secureDnsStateTextMap_;
    private computedStateKey_;
    private lastSelected_;
    private browserProxy_;
    connectedCallback(): void;
    /**
     * Observer for the fallback pref. Ensures UI updates correctly even if
     * the event listener fires before the PrefsMixin update.
     */
    private onFallbackPrefChanged_;
    private computeStateKey_;
    /**
     * Update the UI representation to match the underlying host resolver
     * configuration.
     */
    private onSecureDnsPrefsChanged_;
    /**
     * Handles user clicks on the Radio Buttons.
     * Because of 'no-set-pref', we manually trigger the backend update.
     */
    private onRadioGroupChange_;
    /**
     * Updates the underlying secure DNS mode pref based on the new toggle
     * selection.
     */
    private onToggleButtonChange_;
    /**
     * Updates the underlying secure DNS preferences based on the new radio group
     *  selection.
     */
    private applySelectionToPrefs_;
    /**
     * Helper function to determine the secure DNS template to use when the
     * "Secure" radio button is selected.
     */
    private getSecureDnsResolverTemplate_;
    /**
     * Helper method for updating the underlying secure DNS prefs.
     * Updated to handle the new fallback preference.
     */
    private updateDnsPrefs_;
    /**
     * Updates the underlying secure DNS templates pref based on the selected
     * resolver.
     */
    private onResolverSelectChange_;
    /**
     * Updates the setting to communicate the type of management, if any.
     */
    private updateManagementView_;
    private updateAppearance_;
    /**
     * Updates the UI to match the provided configuration parameters.
     */
    private updateConfigRepresentation_;
    private updatePrivacyPolicyLine_;
    private onSecureDnsInputValueUpdate_;
    private builtInResolver_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-secure-dns-v2': SettingsSecureDnsV2Element;
    }
}
export {};
