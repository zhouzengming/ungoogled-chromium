/**
 * @fileoverview
 * `settings-radio-group` wraps cr-radio-group and set of radio-buttons that
 * control a supplied preference.
 *
 * Example:
 *      <settings-radio-group pref="{{prefs.settings.foo}}"
 *          label="Foo Options." buttons="{{fooOptionsList}}">
 *      </settings-radio-group>
 */
import '//resources/cr_elements/cr_radio_button/cr_radio_button.js';
import '//resources/cr_elements/cr_radio_group/cr_radio_group.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
declare const SettingsRadioGroupElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/controls/pref_control_mixin.js").PrefControlMixinInterface) & (new (...args: any[]) => import("./pref_key_observer_mixin.js").PrefKeyObserverMixinInterface) & (new (...args: any[]) => import("../settings.js").PrefServiceObserverMixinInterface);
export declare class SettingsRadioGroupElement extends SettingsRadioGroupElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        groupAriaLabel: StringConstructor;
        /**
         * If true, do not automatically set the preference value. This allows the
         * container to confirm the change first then call either sendPrefChange
         * or resetToPrefValue accordingly.
         */
        noSetPref: {
            type: BooleanConstructor;
            value: boolean;
        };
        selected: StringConstructor;
        selectableElements: {
            type: StringConstructor;
            value: string;
        };
        nestedSelectable: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    static get observers(): string[];
    groupAriaLabel: string;
    noSetPref: boolean;
    selected?: string;
    selectableElements: string;
    nestedSelectable: boolean;
    ready(): void;
    focus(): void;
    /** Reset the selected value to match the current pref value. */
    resetToPrefValue(): void;
    /** Update the pref to the current selected value. */
    sendPrefChange(): void;
    private onSelectedChanged_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-radio-group': SettingsRadioGroupElement;
    }
}
export {};
