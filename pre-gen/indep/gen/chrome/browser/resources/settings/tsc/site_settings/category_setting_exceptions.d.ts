/**
 * @fileoverview
 * 'category-setting-exceptions' is the polymer element for showing a certain
 * category of exceptions under Site Settings.
 */
import './site_list.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { ContentSetting } from './constants.js';
declare const CategorySettingExceptionsElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("./site_settings_mixin.js").SiteSettingsMixinInterface);
export declare class CategorySettingExceptionsElement extends CategorySettingExceptionsElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * The string description shown below the header.
         */
        description: {
            type: StringConstructor;
            value: () => string;
        };
        /**
         * Some content types (like Location) do not allow the user to manually
         * edit the exception list from within Settings.
         */
        readOnlyList: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
         * True if the default value is managed by a policy.
         */
        defaultManaged_: BooleanConstructor;
        /**
         * The heading text for the blocked exception list.
         */
        blockHeader: StringConstructor;
        /**
         * The heading text for the allowed exception list.
         */
        allowHeader: StringConstructor;
        searchFilter: StringConstructor;
        /**
         * If true, displays the Allow site list. Defaults to true.
         */
        showAllowSiteList_: {
            type: BooleanConstructor;
            computed: string;
        };
        /**
         * Expose ContentSetting enum to HTML bindings.
         */
        contentSettingEnum_: {
            type: ObjectConstructor;
            value: typeof ContentSetting;
        };
    };
    static get observers(): string[];
    description: string;
    private readOnlyList;
    private defaultManaged_;
    blockHeader: string;
    allowHeader: string;
    searchFilter: string;
    private showAllowSiteList_;
    ready(): void;
    /**
     * Hides particular category subtypes if |this.category| does not support the
     * content setting of that type.
     */
    private computeShowAllowSiteList_;
    /**
     * Updates whether or not the default value is managed by a policy.
     */
    private updateDefaultManaged_;
    /**
     * Returns true if this list is explicitly marked as readonly by a consumer
     * of this component or if the default value for these exceptions are managed
     * by a policy. User should not be able to set exceptions to managed default
     * values.
     */
    private getReadOnlyList_;
}
declare global {
    interface HTMLElementTagNameMap {
        'category-setting-exceptions': CategorySettingExceptionsElement;
    }
}
export {};
