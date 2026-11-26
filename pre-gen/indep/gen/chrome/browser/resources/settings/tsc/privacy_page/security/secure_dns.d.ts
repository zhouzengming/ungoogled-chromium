/**
 * @fileoverview 'settings-secure-dns' is a setting that allows the secure DNS
 * mode and secure DNS resolvers to be configured.
 *
 * The underlying secure DNS prefs are not read directly since the setting is
 * meant to represent the current state of the host resolver, which depends not
 * only on the prefs but also a few other factors (e.g. whether we've detected a
 * managed environment, whether we've detected parental controls, etc). Instead,
 * the setting listens for secure-dns-setting-changed events, which are sent
 * by PrivacyPageBrowserProxy and describe the new host resolver configuration.
 */
import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/md_select.css.js';
import '../../controls/settings_toggle_button.js';
import './secure_dns_input.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SecureDnsInputElement } from './secure_dns_input.js';
export interface SettingsSecureDnsElement {
    $: {
        privacyPolicy: HTMLElement;
        secureDnsInput: SecureDnsInputElement;
        secureDnsInputContainer: HTMLElement;
        resolverSelect: HTMLSelectElement;
    };
}
declare const SettingsSecureDnsElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface);
/**
 * Enum for the categories of options in the secure DNS resolver select
 * menu.
 */
export declare enum SecureDnsResolverType {
    AUTOMATIC = "automatic",
    BUILT_IN = "built-in",
    CUSTOM = "custom"
}
export declare class SettingsSecureDnsElement extends SettingsSecureDnsElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Mirroring the secure DNS resolver enum so that it can be used from HTML
         * bindings.
         */
        resolverTypeEnum_: {
            type: ObjectConstructor;
            value: typeof SecureDnsResolverType;
        };
        /**
         * The setting sublabel.
         */
        secureDnsDescription_: StringConstructor;
        /**
         * Represents whether the main toggle for the secure DNS setting is
         * switched on or off.
         */
        secureDnsToggle_: {
            type: ObjectConstructor;
            value(): {
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
        /**
         * Whether the secure DNS resolver options should be shown.
         */
        showSecureDnsOptions_: BooleanConstructor;
        /**
         * List of secure DNS resolvers to display in dropdown menu.
         */
        resolverOptions_: ArrayConstructor;
        /**
         * String displaying the privacy policy of the resolver selected in the
         * dropdown menu.
         */
        privacyPolicyString_: StringConstructor;
        /**
         * String to display in the custom text field.
         */
        secureDnsInputValue_: StringConstructor;
    };
    private secureDnsDescription_;
    private secureDnsToggle_;
    private showSecureDnsOptions_;
    private resolverOptions_;
    private privacyPolicyString_;
    private secureDnsInputValue_;
    private browserProxy_;
    connectedCallback(): void;
    /**
     * Update the UI representation to match the underlying host resolver
     * configuration.
     */
    private onSecureDnsPrefsChanged_;
    /**
     * Updates the underlying secure DNS mode pref based on the new toggle
     * selection (and the underlying select menu if the toggle has just been
     * turned on).
     */
    private onToggleChanged_;
    /**
     * Helper method for updating the underlying secure DNS prefs based on the
     * provided mode and templates (if the latter is specified). The templates
     * param should only be specified when the underlying prefs are being updated
     * after a custom entry has been validated.
     */
    private updateDnsPrefs_;
    /**
     * Updates the underlying secure DNS templates pref based on the selected
     * resolver and displays the corresponding privacy policy.
     */
    private onDropdownSelectionChanged_;
    /**
     * Updates the setting to communicate the type of management, if any. The
     * setting is always collapsed if there is any management.
     */
    private updateManagementView_;
    /**
     * Updates the UI to match the provided configuration parameters.
     */
    private updateConfigRepresentation_;
    /**
     * Displays the privacy policy string if the policy URL is specified,
     * otherwise hides it.
     * @param policy The privacy policy URL.
     */
    private updatePrivacyPolicyLine_;
    /**
     * Updates the underlying prefs if a custom entry was determined to be valid.
     */
    private onSecureDnsInputEvaluated_;
    /**
     * Returns the ResolverOption details if the currently selected secure DNS
     * resolver is a built-in one.
     */
    private builtInResolver_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-secure-dns': SettingsSecureDnsElement;
    }
}
export {};
