/**
 * @fileoverview
 * 'settings-main' displays the selected settings page.
 */
import 'chrome://resources/cr_components/managed_footnote/managed_footnote.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_view_manager/cr_view_manager.js';
import 'chrome://resources/cr_elements/icons.html.js';
import '../about_page/about_page.js';
import '../ai_page/ai_page_index.js';
import '../appearance_page/appearance_page_index.js';
import '../autofill_page/autofill_page_index.js';
import '../on_startup_page/on_startup_page.js';
import '../people_page/people_page_index.js';
import '../performance_page/performance_page_index.js';
import '../privacy_page/privacy_page_index.js';
import '../reset_page/reset_profile_banner.js';
import '../search_page/search_page_index.js';
import '../default_browser_page/default_browser_page.js';
import type { CrViewManagerElement } from 'chrome://resources/cr_elements/cr_view_manager/cr_view_manager.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { PageVisibility } from '../page_visibility.js';
import type { Route, SettingsRoutes } from '../router.js';
export interface SearchFinishedDetail {
    query: string;
    matchCount: number;
}
declare global {
    interface HTMLElementEventMap {
        'search-finished': CustomEvent<SearchFinishedDetail>;
    }
}
export interface SettingsMainElement {
    $: {
        noSearchResults: HTMLElement;
        switcher: CrViewManagerElement;
    };
}
declare const SettingsMainElementBase: typeof PolymerElement & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface);
export declare class SettingsMainElement extends SettingsMainElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Preferences state.
         */
        prefs: {
            type: ObjectConstructor;
            notify: boolean;
        };
        pageVisibility_: {
            type: ObjectConstructor;
            value: () => PageVisibility;
        };
        lastRoute_: {
            type: ObjectConstructor;
            value: null;
        };
        routes_: {
            type: ObjectConstructor;
            value: () => SettingsRoutes;
        };
        /**
         * Whether a search operation is in progress or previous search results
         * are being displayed.
         */
        inSearchMode_: {
            type: BooleanConstructor;
            value: boolean;
            observer: string;
        };
        showNoResultsFound_: {
            type: BooleanConstructor;
            value: boolean;
        };
        showResetProfileBanner_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        toolbarSpinnerActive: {
            type: BooleanConstructor;
            value: boolean;
            notify: boolean;
        };
    };
    prefs: Record<string, unknown>;
    private pageVisibility_;
    private lastRoute_;
    private routes_;
    private inSearchMode_;
    private showNoResultsFound_;
    private showResetProfileBanner_;
    toolbarSpinnerActive: boolean;
    private eventTracker_;
    private pendingViewSwitching_;
    private topLevelEquivalentRoute_;
    private currentQuery_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private beforeNextRenderPromise_;
    currentRouteChanged(route: Route): Promise<void>;
    whenViewSwitchingDone(): Promise<void>;
    /**
     * @return A promise indicating that searching finished.
     */
    searchContents(query: string): Promise<void>;
    /**
     * Notifies about the user interacting with one of the search results, but
     * only while search results are being displayed, so that no listener is
     * registered during normal browsing of the Settings page.
     *
     * Both 'click' and 'change' are observed, because neither covers every
     * result on its own. Results that navigate elsewhere when opened are only
     * visible as a 'click', whereas controls that commonly show up as results,
     * settings-toggle-button and cr-toggle for example, stop 'click' events from
     * propagating and fire no 'click' at all when activated with the keyboard.
     * Those do fire a composed 'change' event when their value changes.
     *
     * The two can both fire for a single interaction, and 'click' also fires for
     * clicks that landed next to a result rather than on one, so this is an
     * upper bound rather than an exact signal. Consumers are expected to be
     * interested in the first notification only.
     */
    private onInSearchModeChanged_;
    private renderPlugin_;
    private showPage_;
    private showAiPage_;
    private showManagedHeader_;
    private shouldShowAll_;
    private onResetProfileBannerClose_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-main': SettingsMainElement;
    }
}
export {};
