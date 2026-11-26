/**
 * @fileoverview
 * 'settings-category-default-radio-group' is the polymer element for showing
 * a certain category under Site Settings.
 */
import '../settings_shared.css.js';
import '../controls/collapse_radio_button.js';
import '../controls/settings_radio_group.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsCollapseRadioButtonElement } from '../controls/collapse_radio_button.js';
import type { SettingsRadioGroupElement } from '../controls/settings_radio_group.js';
import { ContentSetting } from './constants.js';
export interface SettingsCategoryDefaultRadioGroupElement {
    $: {
        allowRadioOption: SettingsCollapseRadioButtonElement;
        askRadioOption: SettingsCollapseRadioButtonElement;
        blockRadioOption: SettingsCollapseRadioButtonElement;
        settingsCategoryDefaultRadioGroup: SettingsRadioGroupElement;
    };
}
declare const SettingsCategoryDefaultRadioGroupElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("./site_settings_mixin.js").SiteSettingsMixinInterface);
export declare class SettingsCategoryDefaultRadioGroupElement extends SettingsCategoryDefaultRadioGroupElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        header: {
            type: StringConstructor;
            value(): string;
        };
        description: {
            type: StringConstructor;
            value(): string;
        };
        allowOptionLabel: {
            type: StringConstructor;
            value: null;
        };
        allowOptionSubLabel: StringConstructor;
        allowOptionIcon: StringConstructor;
        askOptionLabel: {
            type: StringConstructor;
            value: null;
        };
        askOptionSubLabel: StringConstructor;
        askOptionIcon: StringConstructor;
        blockOptionLabel: {
            type: StringConstructor;
            value: null;
        };
        blockOptionSubLabel: StringConstructor;
        blockOptionIcon: StringConstructor;
        selectedValue: {
            type: StringConstructor;
            computed: string;
            readOnly: boolean;
            notify: boolean;
        };
        contentSettingEnum_: {
            type: ObjectConstructor;
            value: typeof ContentSetting;
        };
        /**
         * Preference object used to keep track of the selected content setting
         * option.
         */
        pref_: {
            type: ObjectConstructor;
            value(): {
                type: chrome.settingsPrivate.PrefType;
                value: string;
            };
        };
    };
    static get observers(): string[];
    header: string;
    description: string;
    allowOptionLabel: string;
    allowOptionSubLabel: string;
    allowOptionIcon: string;
    askOptionLabel: string;
    askOptionSubLabel: string;
    askOptionIcon: string;
    blockOptionLabel: string;
    blockOptionSubLabel: string;
    blockOptionIcon: string;
    selectedValue: string;
    private pref_;
    ready(): void;
    private getButtonClass_;
    private getSelectedValue_;
    /**
     * A handler for when the user selects a differenet option in the nested
     * radio group.
     */
    private onSelectedRadioChanged_;
    /**
     * Update the pref values from the content settings.
     * @param update The updated content setting value.
     */
    private updatePref_;
    private onCategoryChanged_;
    /**
     * Check if the category is popups and the user is logged in guest mode.
     * Users in guest mode are not allowed to modify pop-ups content setting.
     */
    private isRadioGroupDisabled_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-category-default-radio-group': SettingsCategoryDefaultRadioGroupElement;
    }
}
export {};
