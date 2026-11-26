import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_expand_button/cr_expand_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_radio_button/cr_radio_button_style.css.js';
import '../settings_shared.css.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import type { CrExpandButtonElement } from 'chrome://resources/cr_elements/cr_expand_button/cr_expand_button.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SettingsCollapseRadioButtonElement {
    $: {
        expandButton: CrExpandButtonElement;
    };
}
declare const SettingsCollapseRadioButtonElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/controls/pref_control_mixin.js").PrefControlMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/cr_radio_button/cr_radio_button_mixin.js").CrRadioButtonMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/cr_ripple/cr_ripple_mixin_polymer.js").CrRippleMixinPolymerInterface) & (new (...args: any[]) => import("./pref_key_observer_mixin.js").PrefKeyObserverMixinInterface) & (new (...args: any[]) => import("../settings.js").PrefServiceObserverMixinInterface);
export declare class SettingsCollapseRadioButtonElement extends SettingsCollapseRadioButtonElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        expanded: {
            type: BooleanConstructor;
            notify: boolean;
            value: boolean;
        };
        noAutomaticCollapse: {
            type: BooleanConstructor;
            value: boolean;
        };
        noCollapse: BooleanConstructor;
        label: StringConstructor;
        indicatorAriaLabel: StringConstructor;
        icon: {
            type: StringConstructor;
            value: string;
        };
        disabled: {
            type: BooleanConstructor;
            value: boolean;
            reflectToAttribute: boolean;
        };
        subLabel: {
            type: StringConstructor;
            value: string;
        };
        expandAriaLabel: StringConstructor;
    };
    static get observers(): string[];
    expanded: boolean;
    noAutomaticCollapse: boolean;
    noCollapse: boolean;
    label: string;
    indicatorAriaLabel: string;
    icon: string;
    disabled: boolean;
    subLabel: string;
    expandAriaLabel: string;
    private pendingUpdateCollapsed_;
    constructor();
    getPaperRipple(): import("//resources/cr_elements/cr_ripple/cr_ripple.js").CrRippleElement;
    createRipple(): import("//resources/cr_elements/cr_ripple/cr_ripple.js").CrRippleElement;
    /**
     * Updates the collapsed status of this radio button to reflect
     * the user selection actions.
     */
    updateCollapsed(): void;
    getBubbleAnchor(): HTMLElement;
    private onCheckedChanged_;
    private onPrefChanged_;
    private onExpandClicked_;
    private onRadioFocus_;
    /**
     * Clear the ripple associated with the radio button when the expand button
     * is focused. Stop propagation to prevent the ripple being re-created.
     */
    private onNonRadioFocus_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-collapse-radio-button': SettingsCollapseRadioButtonElement;
    }
}
export {};
