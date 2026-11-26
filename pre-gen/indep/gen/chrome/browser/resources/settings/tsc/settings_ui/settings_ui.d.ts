/**
 * @fileoverview
 * 'settings-ui' implements the UI for the Settings page.
 *
 * Example:
 *
 *    <settings-ui prefs="{{prefs}}"></settings-ui>
 */
import 'chrome://resources/cr_elements/cr_drawer/cr_drawer.js';
import 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar.js';
import 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar_search_field.js';
import 'chrome://resources/cr_elements/cr_page_host_style.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import 'chrome://resources/cr_elements/cr_scrollable.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '/shared/settings/prefs/prefs.js';
import '../icons.html.js';
import '../settings_main/settings_main.js';
import '../settings_menu/settings_menu.js';
import '../settings_shared.css.js';
import '../settings_vars.css.js';
import type { SettingsPrefsElement } from '/shared/settings/prefs/prefs.js';
import type { CrDrawerElement } from 'chrome://resources/cr_elements/cr_drawer/cr_drawer.js';
import type { CrToolbarElement } from 'chrome://resources/cr_elements/cr_toolbar/cr_toolbar.js';
import type { DomIf } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { Route } from '../router.js';
import type { SettingsMainElement } from '../settings_main/settings_main.js';
import type { SettingsMenuElement } from '../settings_menu/settings_menu.js';
declare global {
    interface HTMLElementEventMap {
        'refresh-pref': CustomEvent<string>;
    }
}
export interface SettingsUiElement {
    $: {
        container: HTMLElement;
        drawer: CrDrawerElement;
        drawerTemplate: DomIf;
        left: HTMLElement;
        leftMenu: SettingsMenuElement;
        main: SettingsMainElement;
        scrollableShadow: HTMLElement;
        toolbar: CrToolbarElement;
        prefs: SettingsPrefsElement;
    };
}
export declare const MAX_QUERY_LENGTH = 1000;
declare const SettingsUiElementBase: typeof PolymerElement & (new (...args: any[]) => import("//resources/cr_elements/find_shortcut_manager.js").FindShortcutListener) & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface);
export declare class SettingsUiElement extends SettingsUiElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Preferences state.
         */
        prefs: ObjectConstructor;
        toolbarSpinnerActive_: {
            type: BooleanConstructor;
            value: boolean;
        };
        narrow_: {
            type: BooleanConstructor;
            observer: string;
        };
        lastSearchQuery_: {
            type: StringConstructor;
            value: string;
        };
        isSettingsRefresh2026_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
    };
    prefs: Record<string, unknown>;
    private toolbarSpinnerActive_;
    private narrow_;
    private lastSearchQuery_;
    private isSettingsRefresh2026_;
    private activeTimer_;
    private searchMetricsRecorder_;
    constructor();
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    currentRouteChanged(route: Route): void;
    handleFindShortcut(modalContextOpen: boolean): boolean;
    searchInputHasFocus(): boolean;
    private onRefreshPref_;
    /**
     * Handles the 'search-changed' event fired from the toolbar.
     */
    private onSearchChanged_;
    /**
     * Handles the 'search-finished' event fired from settings-main.
     */
    private onSearchFinished_;
    /**
     * Handles the 'search-result-interaction' event fired from settings-main.
     */
    private onSearchResultInteraction_;
    /**
     * Called when a section is selected.
     */
    private onIronActivate_;
    private onMenuButtonClick_;
    /**
     * When this is called, The drawer animation is finished, and the dialog no
     * longer has focus. The selected section will gain focus if one was
     * selected. Otherwise, the drawer was closed due being canceled, and the
     * main settings container is given focus. That way the arrow keys can be
     * used to scroll the container, and pressing tab focuses a component in
     * settings.
     */
    private onMenuClose_;
    private getLeftMenuHidden_;
    private getLeftMenuCollapsed_;
    private onNarrowChanged_;
    private addThemedColors_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-ui': SettingsUiElement;
    }
}
export {};
