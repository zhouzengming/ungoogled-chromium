/**
 * @fileoverview
 * 'settings-autofill-page' is the entry point for users to see
 * and manage their saved info.
 */
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import './account_card.js';
import './category_reference_card.js';
import './collapsible_autofill_settings_card.js';
import '/shared/settings/prefs/prefs.js';
import '../settings_page/settings_section.js';
import '../icons.html.js';
import '../privacy_icons.html.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { YourSavedInfoDataChip } from '../metrics_browser_proxy.js';
/**
 * Represents a single chip for a saved data type, showing a label, icon,
 * and the number of items.
 */
export interface DataChip {
    id: YourSavedInfoDataChip;
    label: string;
    icon: string;
    count?: number;
    isVisibleWhenNoEntitiesOfTypeExists: () => boolean;
}
declare const SettingsAutofillPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface);
export declare class SettingsAutofillPageElement extends SettingsAutofillPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        prefs: ObjectConstructor;
        hierarchy_: {
            type: ObjectConstructor;
        };
        isShoppingEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        showSuggestionsFromGeminiSettings_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        spark_: {
            type: StringConstructor;
            value: () => string;
        };
    };
    prefs: Record<string, unknown>;
    private hierarchy_;
    private isShoppingEnabled_;
    private showSuggestionsFromGeminiSettings_;
    private dataChipIdToChip_;
    private dataChipIdToCategory_;
    private dataChipIdToCategoryName_;
    private availableAutofillAiTypes_;
    private paymentsManager_;
    private autofillManager_;
    private autofillAiEntityManager_;
    private metricsBrowserProxy_;
    private setPersonalDataListener_;
    private onAutofillAiEntitiesChangedListener_;
    private spark_;
    connectedCallback(): void;
    private initializeDataTypeHierarchy_;
    private setupDataTypeCounters;
    private onAutofillAiEntitiesChanged;
    disconnectedCallback(): void;
    getFocusConfig(): Map<any, any>;
    getAssociatedControlFor(childViewId: string): HTMLElement;
    private setChipCount_;
    private getVisibleChips_;
    private hasVisibleChips_;
    private onDataCategoryClick_;
    private onDataChipClick_;
    /**
     * Navigate to the settings sub page corresponding to a data category.
     */
    private navigateToLeafPage_;
    private onSuggestionsFromGeminiClick_;
    /**
     * Opens Password Manager page on clicking a related service link.
     */
    private onPasswordManagerRelatedServiceClick_;
    /**
     * Opens Wallet page in a new tab.
     */
    private onGoogleWalletRelatedServiceClick_;
    /**
     * Opens Google Account page in a new tab.
     */
    private onGoogleAccountRelatedServiceClick_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-autofill-page': SettingsAutofillPageElement;
    }
}
export {};
