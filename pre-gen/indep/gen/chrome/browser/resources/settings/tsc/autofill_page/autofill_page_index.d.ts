/**
 * @fileoverview
 * 'settings-autofill-page-index' is the settings page containing
 * settings for passwords, payment methods, addresses and more.
 */
import 'chrome://resources/cr_elements/cr_view_manager/cr_view_manager.js';
import '/shared/settings/prefs/prefs.js';
import './autofill_page.js';
import '../settings_shared.css.js';
import type { CrViewManagerElement } from 'chrome://resources/cr_elements/cr_view_manager/cr_view_manager.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { Route } from '../router.js';
import type { SettingsPlugin } from '../settings_main/settings_plugin.js';
export interface SettingsAutofillPageIndexElement {
    $: {
        viewManager: CrViewManagerElement;
    };
}
declare const SettingsAutofillPageIndexElementBase: typeof PolymerElement & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface) & (new (...args: any[]) => import("../settings_page/searchable_view_container_mixin.js").SearchableViewContainerMixinInterface);
export declare class SettingsAutofillPageIndexElement extends SettingsAutofillPageIndexElementBase implements SettingsPlugin {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        prefs: ObjectConstructor;
        isShoppingEnabled_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        showSuggestionsFromGeminiSettings_: {
            type: BooleanConstructor;
            value(): boolean;
        };
    };
    prefs: Record<string, unknown>;
    private isShoppingEnabled_;
    private showSuggestionsFromGeminiSettings_;
    currentRouteChanged(newRoute: Route, oldRoute?: Route): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-autofill-page-index': SettingsAutofillPageIndexElement;
    }
}
export {};
