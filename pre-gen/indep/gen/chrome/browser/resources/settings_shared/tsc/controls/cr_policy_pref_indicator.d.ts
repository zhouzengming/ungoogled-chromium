/**
 * @fileoverview Polymer element for indicating policies that apply to an
 * element controlling a settings preference.
 */
import '//resources/cr_elements/cr_hidden_style.css.js';
import '//resources/cr_elements/policy/cr_tooltip_icon.js';
import { CrPolicyIndicatorType } from '//resources/cr_elements/policy/cr_policy_types.js';
import type { CrTooltipIconElement } from '//resources/cr_elements/policy/cr_tooltip_icon.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface CrPolicyPrefIndicatorElement {
    $: {
        tooltipIcon: CrTooltipIconElement;
    };
}
export declare class CrPolicyPrefIndicatorElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        iconAriaLabel: StringConstructor;
        indicatorIcon: {
            type: StringConstructor;
            computed: string;
        };
        indicatorType: {
            type: StringConstructor;
            value: CrPolicyIndicatorType;
            computed: string;
        };
        indicatorTooltip: {
            type: StringConstructor;
            computed: string;
        };
        indicatorVisible: {
            type: BooleanConstructor;
            computed: string;
        };
        /**
         * Optional preference object associated with the indicator. Initialized
         * to null so that computed functions will get called if this is never
         * set.
         */
        pref: ObjectConstructor;
        /**
         * Optional value for the preference value this indicator is associated
         * with. If this is set, no indicator will be shown if it is a member
         * of |pref.userSelectableValues| and is not |pref.recommendedValue|.
         */
        associatedValue: ObjectConstructor;
    };
    iconAriaLabel: string;
    indicatorIcon: string;
    indicatorType: CrPolicyIndicatorType;
    indicatorTooltip: string;
    indicatorVisible: boolean;
    pref?: chrome.settingsPrivate.PrefObject;
    associatedValue?: unknown;
    /**
     * @return True if the indicator should be shown.
     */
    private getIndicatorVisible_;
    /**
     * @return {string} The cr-icon icon name.
     */
    private getIndicatorIcon_;
    /**
     * @param name The name associated with the indicator. See
     *     chrome.settingsPrivate.PrefObject.controlledByName
     * @param matches For RECOMMENDED only, whether the indicator
     *     value matches the recommended value.
     * @return The tooltip text for |type|.
     */
    private getIndicatorTooltip_;
    /**
     * @return The indicator type based on |pref| and |associatedValue|.
     */
    private getIndicatorTypeForPref_;
    /**
     * @return The tooltip text for |indicatorType|.
     */
    private getIndicatorTooltipForPref_;
    getFocusableElement(): HTMLElement;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-policy-pref-indicator': CrPolicyPrefIndicatorElement;
    }
}
