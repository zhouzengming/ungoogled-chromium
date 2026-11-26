/**
 * @fileoverview
 * 'settings-menu' shows a menu with a hardcoded set of pages and subpages.
 */
import 'chrome://resources/cr_elements/cr_icons.css.js';
import 'chrome://resources/cr_elements/cr_menu_selector/cr_menu_selector.js';
import 'chrome://resources/cr_elements/cr_hidden_style.css.js';
import 'chrome://resources/cr_elements/cr_nav_menu_item_style.css.js';
import 'chrome://resources/cr_elements/cr_ripple/cr_ripple.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import '../settings_vars.css.js';
import '../icons.html.js';
import type { CrMenuSelectorElement } from 'chrome://resources/cr_elements/cr_menu_selector/cr_menu_selector.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { PageVisibility } from '../page_visibility.js';
import type { Route } from '../router.js';
export interface SettingsMenuElement {
    $: {
        autofill: HTMLLinkElement;
        menu: CrMenuSelectorElement;
        people: HTMLLinkElement;
        yourSavedInfo: HTMLLinkElement;
    };
}
declare const SettingsMenuElementBase: typeof PolymerElement & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface);
export declare class SettingsMenuElement extends SettingsMenuElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        collapsed: {
            type: BooleanConstructor;
            value: boolean;
            reflectToAttribute: boolean;
        };
        /**
         * Dictionary defining page visibility.
         */
        pageVisibility_: {
            type: ObjectConstructor;
            value: () => PageVisibility | undefined;
        };
        showAiPage_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
    };
    collapsed: boolean;
    private pageVisibility_?;
    private showAiPage_;
    private metricsBrowserProxy_;
    private showAiPageMenuItem_;
    currentRouteChanged(newRoute: Route): void;
    focusFirstItem(): void;
    /**
     * Prevent clicks on sidebar items from navigating. These are only links for
     * accessibility purposes, taps are handled separately.
     */
    private onLinkClick_;
    /**
     * Keeps both menus in sync. `path` needs to come from
     * `element.getAttribute('href')`. Using `element.href` will not work as it
     * would pass the entire URL instead of just the path.
     */
    private setSelectedPath_;
    private onSelectorActivate_;
    private onExtensionsLinkClick_;
    private onAutofillClick_;
    private hideBottomMenuSeparator_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-menu': SettingsMenuElement;
    }
}
export {};
