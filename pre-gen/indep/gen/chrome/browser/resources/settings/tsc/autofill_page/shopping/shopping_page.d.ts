/**
 * @fileoverview 'settings-shopping-page', is a subpage of the "Your saved info"
 * section. It manages the user's autofill data for shopping. Users can view and
 * hide their saved orders and shipments as well as opt out of the autofill
 * functionality entirely.
 */
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '/shared/settings/controls/extension_controlled_indicator.js';
import '/shared/settings/prefs/prefs.js';
import '../../controls/settings_toggle_button.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../autofill_ai_entries_list.js';
import '../autofill_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../../controls/settings_toggle_button.js';
export interface SettingsShoppingPageElement {
    $: {
        optInToggle: SettingsToggleButtonElement;
    };
}
declare const SettingsShoppingPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class SettingsShoppingPageElement extends SettingsShoppingPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        canEnableOrDisableAutofillAi_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
           Fake preference used by `this.$.optInToggle`. Shows value of
           `autofill.autofill_ai.shopping_entities_enabled` preference if toggle
           is enabled (clickable). If toggle is disabled then the value is
           overridden to be shown as false even if the preference is true.
         */
        shoppingOptedIn_: {
            type: ObjectConstructor;
            computed: string;
        };
        /**
          If true, Autofill AI does not depend on whether Autofill for addresses
          is enabled.
        */
        autofillSettingsEnterprisePolicyEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
         * Set to true once CrSettingsPrefs is fully initialized.
         * Guards against race conditions where prefs are accessed before the full
         * preference tree is populated.
         */
        prefsInitialized_: {
            type: BooleanConstructor;
            value: boolean;
        };
        showSuggestionsFromGeminiSettings_: {
            type: BooleanConstructor;
            value(): boolean;
        };
    };
    private shoppingOptedIn_;
    private autofillSettingsEnterprisePolicyEnabled_;
    private canEnableOrDisableAutofillAi_;
    private prefsInitialized_;
    private showSuggestionsFromGeminiSettings_;
    private metricsBrowserProxy_;
    connectedCallback(): void;
    private optInToggleDisabled_;
    private computeShoppingOptedIn_;
    private onOptInToggleChange_;
    private getAllowedEntityTypes_;
    private getMetricEntityTypes_;
    private extensionControlledIndicatorIsVisible_;
    private onSuggestionsFromGeminiClick_;
    getFocusConfig(): Map<any, any>;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-shopping-page': SettingsShoppingPageElement;
    }
}
export {};
