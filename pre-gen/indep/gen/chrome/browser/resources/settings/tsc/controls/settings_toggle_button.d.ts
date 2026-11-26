/**
 * @fileoverview
 * `settings-toggle-button` is a toggle that controls a supplied preference.
 */
import '//resources/cr_elements/cr_actionable_row_style.css.js';
import '//resources/cr_elements/cr_shared_style.css.js';
import '//resources/cr_elements/cr_shared_vars.css.js';
import '//resources/cr_elements/action_link.css.js';
import '//resources/cr_elements/cr_toggle/cr_toggle.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import type { CrToggleElement } from '//resources/cr_elements/cr_toggle/cr_toggle.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SettingsToggleButtonElement {
    $: {
        control: CrToggleElement;
        labelWrapper: HTMLElement;
    };
}
declare const SettingsToggleButtonElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/controls/settings_boolean_control_mixin.js").SettingsBooleanControlMixinInterface) & (new (...args: any[]) => import("./pref_key_observer_mixin.js").PrefKeyObserverMixinInterface) & (new (...args: any[]) => import("../settings.js").PrefServiceObserverMixinInterface);
export declare class SettingsToggleButtonElement extends SettingsToggleButtonElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        ariaLabel: {
            type: StringConstructor;
            reflectToAttribute: boolean;
            observer: string;
            value: string;
        };
        ariaShowLabel: {
            type: BooleanConstructor;
            reflectToAttribute: boolean;
            value: boolean;
        };
        ariaShowSublabel: {
            type: BooleanConstructor;
            reflectToAttribute: boolean;
            value: boolean;
        };
        elideLabel: {
            type: BooleanConstructor;
            reflectToAttribute: boolean;
        };
        learnMoreUrl: {
            type: StringConstructor;
            reflectToAttribute: boolean;
        };
        subLabelWithLink: {
            type: StringConstructor;
            reflectToAttribute: boolean;
        };
        learnMoreAriaLabel: {
            type: StringConstructor;
            value: string;
        };
        icon: StringConstructor;
        subLabelIcon: StringConstructor;
        /**
         * If true, the host element does not get a click event handler and the
         * client is responsible for determining their own click logic. Thus when
         * true, clicking on the setting row does not toggle the setting pref.
         * Note, this boolean is only used on ready() callback, and any changes
         * after that have no effect.
         */
        noToggleOnHostClick: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    static get observers(): string[];
    ariaLabel: string;
    ariaShowLabel: boolean;
    ariaShowSublabel: boolean;
    elideLabel: boolean;
    icon: string;
    learnMoreAriaLabel: string;
    learnMoreUrl: string;
    subLabelWithLink: string;
    subLabelIcon: string;
    noToggleOnHostClick: boolean;
    ready(): void;
    private fire_;
    focus(): void;
    /**
     * Removes the aria-label attribute if it's added by $i18n{...}.
     */
    private onAriaLabelSet_;
    private getAriaLabel_;
    private getLearnMoreAriaLabelledBy_;
    getBubbleAnchor(): HTMLElement;
    private onDisableOrPrefChange_;
    /**
     * Handles non cr-toggle button clicks (cr-toggle handles its own click events
     * which don't bubble).
     */
    private onHostClick_;
    private onLearnMoreClick_;
    /**
     * Set up the contents of sub label with link.
     */
    private getSubLabelWithLinkContent_;
    private onSubLabelTextWithLinkClick_;
    private onChange_;
    private updateCheckedAndNotify_;
    sendPrefChangeInternal(value: boolean | number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-toggle-button': SettingsToggleButtonElement;
    }
}
export {};
