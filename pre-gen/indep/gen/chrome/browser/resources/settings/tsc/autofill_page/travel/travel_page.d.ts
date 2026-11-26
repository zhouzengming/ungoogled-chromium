/**
 * @fileoverview 'settings-travel-page', is a subpage of the "Your saved info"
 * section. It manages the user's autofill data for traveling. Users can add,
 * edit, or delete their saved document details, as well as opt out of the
 * autofill functionality entirely.
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
export interface SettingsTravelPageElement {
    $: {
        optInToggle: SettingsToggleButtonElement;
    };
}
declare const SettingsTravelPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class SettingsTravelPageElement extends SettingsTravelPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         Controls whether the user can use Autofill AI (in this context travel
         info filling). As an example, this can be false if the extensions API
         disables the feature.
        */
        canEnableOrDisableAutofillAi_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
           Fake preference used by `this.$.optInToggle`. Shows value of
           `autofill.autofill_ai.travel_entities_enabled` preference if toggle
           is enabled (clickable). If toggle is disabled then the value is
           overridden to be shown as false even if the preference is true.
         */
        travelOptedIn_: {
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
        prefsInitialized_: {
            type: BooleanConstructor;
            value: boolean;
        };
        showSuggestionsFromGeminiSettings_: {
            type: BooleanConstructor;
            value(): boolean;
        };
    };
    private travelOptedIn_;
    private autofillSettingsEnterprisePolicyEnabled_;
    private canEnableOrDisableAutofillAi_;
    private prefsInitialized_;
    private showSuggestionsFromGeminiSettings_;
    private metricsBrowserProxy_;
    private entityDataManager_;
    connectedCallback(): void;
    private optInToggleDisabled_;
    private computeTravelOptedIn_;
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
        'settings-travel-page': SettingsTravelPageElement;
    }
}
export {};
