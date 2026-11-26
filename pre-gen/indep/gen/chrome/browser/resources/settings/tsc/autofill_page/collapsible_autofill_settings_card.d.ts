/**
 * @fileoverview
 * 'collapsible-card' is a container component used to display Autofill-related
 * settings. It can be expanded or collapsed by the user.
 */
import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_expand_button/cr_expand_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import '/shared/settings/controls/extension_controlled_indicator.js';
import '/shared/settings/prefs/prefs.js';
import '../ai_page/ai_logging_info_bullet.js';
import '../controls/settings_toggle_button.js';
import '../icons.html.js';
import '../settings_columned_section.css.js';
import '../settings_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../controls/settings_toggle_button.js';
export interface CollapsibleCardElement {
    $: {
        optInToggle: SettingsToggleButtonElement;
    };
}
declare const CollapsibleCardElement_base: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class CollapsibleCardElement extends CollapsibleCardElement_base {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Controls the expanded/collapsed state of the details.
         */
        expanded_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
           Indicates if a user is eligible to change Enhanced Autofill data.
           If a user is not eligible for Enhanced Autofill (Autofill with Ai),
           but they have data saved, the code allows them only to edit and delete
           their data. They are not allowed to add new data, or to opt in or
           opt-out of Enhanced Autofill using the corresponding toggle in this
           component. If a user is not eligible for Enhanced Autofill and they
           also have no data saved, then they cannot access this page at all.
         */
        enhancedAutofillEligibleUser_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
         * Indicates whether the feature `kAutofillAiReauthRequired` is enabled.
         */
        /**
           A "fake" preference object that reflects the state of the opt-in
           toggle for Enhanced Autofill and the presence/absence of an enterprise
           policy. This allows leveraging the settings-toggle-button component
           to reflect enterprise enabled/disabled states.
         */
        enhancedAutofillOptedIn_: {
            type: ObjectConstructor;
            value: () => {
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
        isUserEligibleForWalletablePassDetection_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
         * If true, Autofill AI does not depend on whether Autofill for addresses
         * is enabled.
         */
        autofillSettingsEnterprisePolicyEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        prefsInitialized_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    static get observers(): string[];
    private expanded_;
    private enhancedAutofillEligibleUser_;
    private enhancedAutofillOptedIn_;
    private isUserEligibleForWalletablePassDetection_;
    private autofillSettingsEnterprisePolicyEnabled_;
    private prefsInitialized_;
    private entityInstancesChangedListener_;
    private entityDataManager_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private onOptInToggleChange_;
    private onChangeAuthenticationRequirementClicked_;
    /**
     * Whether an info bullet regarding logging is shown. Enhanced Autofill only
     * shows logging behaviour information for enterprise clients who have either
     * the feature disabled or just logging disabled.
     */
    private showLoggingInfoBullet_;
    /**
     * Observes changes to the enterprise policies for Address autofill and
     * Autofill AI keeping the component's state up to date. When the policy
     * disables the feature, updates the UI to reflect the enforced state,
     * disabling the toggle. When the policy is lifted, it asynchronously fetches
     * the user's latest opt-in status to accurately restore the toggle's state
     * without blocking the UI.
     */
    private onEnterprisePolicyChanged_;
    private showExtensionControlledIndicator_;
    private optInToggleDisabled_;
}
declare global {
    interface HTMLElementTagNameMap {
        'collapsible-autofill-settings-card': CollapsibleCardElement;
    }
}
export {};
