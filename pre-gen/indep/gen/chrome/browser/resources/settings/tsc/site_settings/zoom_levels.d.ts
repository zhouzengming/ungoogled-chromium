/**
 * @fileoverview
 * 'zoom-levels' is the polymer element for showing the sites that are zoomed in
 * or out.
 */
import 'chrome://resources/polymer/v3_0/iron-list/iron-list.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/icons.html.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '../settings_page/settings_subpage.js';
import '../settings_shared.css.js';
import '../site_favicon.js';
import type { IronListElement } from 'chrome://resources/polymer/v3_0/iron-list/iron-list.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface ZoomLevelsElement {
    $: {
        empty: HTMLElement;
        listContainer: HTMLElement;
        list: IronListElement;
    };
}
declare const ZoomLevelsElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("./site_settings_mixin.js").SiteSettingsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/list_property_update_mixin.js").ListPropertyUpdateMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class ZoomLevelsElement extends ZoomLevelsElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Array of sites that are zoomed in or out.
         */
        sites_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        showNoSites_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    private sites_;
    private showNoSites_;
    ready(): void;
    /**
     * A handler for when zoom levels change.
     * @param sites The up to date list of sites and their zoom levels.
     */
    private onZoomLevelsChanged_;
    /**
     * A handler for when a zoom level for a site is deleted.
     */
    private removeZoomLevel_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'zoom-levels': ZoomLevelsElement;
    }
}
export {};
