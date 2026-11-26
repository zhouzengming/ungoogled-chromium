import 'chrome://resources/cr_components/cr_shortcut_input/cr_shortcut_input.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_icons.css.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '../../controls/settings_toggle_button.js';
import '../../icons.html.js';
import '../../settings_columned_section.css.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../autofill_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../../controls/settings_toggle_button.js';
declare const SettingsSuggestionsFromGeminiPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export interface SettingsSuggestionsFromGeminiPageElement {
    $: {
        atMemoryDoubleCtrlTriggerToggle: SettingsToggleButtonElement;
    };
}
export declare class SettingsSuggestionsFromGeminiPageElement extends SettingsSuggestionsFromGeminiPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        prefs: ObjectConstructor;
        isAtMemoryEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        isAtMemoryTriggerCustomizationAllowed_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        prefsInitialized_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    prefs: Record<string, unknown>;
    private isAtMemoryEnabled_;
    private isAtMemoryTriggerCustomizationAllowed_;
    private prefsInitialized_;
    private metricsBrowserProxy_;
    connectedCallback(): void;
    private showQualityLogging_;
    private showDoubleCtrlShortcut_;
    private showConsiderNoLoggingEnterprise_;
    private onManageConnectedAppsClick_;
    private onToggleChange_;
    private onAtMemoryShortcutUpdated_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-suggestions-from-gemini-page': SettingsSuggestionsFromGeminiPageElement;
    }
}
export {};
