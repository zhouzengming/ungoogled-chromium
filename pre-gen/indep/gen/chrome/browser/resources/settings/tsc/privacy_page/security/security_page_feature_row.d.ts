/**
 * @fileoverview
 * `security-page-feature-row` is a toggle with an expand button that
 * controls a supplied preference and also allows for expanding and
 * collapsing so a user can learn more about a setting.
 */
import 'chrome://resources/cr_elements/cr_collapse/cr_collapse.js';
import 'chrome://resources/cr_elements/cr_expand_button/cr_expand_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import '../../controls/settings_toggle_button.js';
import '../../settings_shared.css.js';
import 'chrome://resources/cr_components/help_bubble/new_badge.js';
import type { CrExpandButtonElement } from 'chrome://resources/cr_elements/cr_expand_button/cr_expand_button.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SecurityPageFeatureRowElement {
    $: {
        expandButton: CrExpandButtonElement;
    };
}
export declare class SecurityPageFeatureRowElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        showNewBadge: {
            type: BooleanConstructor;
            value: boolean;
        };
        expanded: {
            type: BooleanConstructor;
            notify: boolean;
            value: boolean;
            observer: string;
        };
        icon: {
            type: StringConstructor;
            reflectToAttribute: boolean;
        };
        iconVisible: {
            type: BooleanConstructor;
            reflectToAttribute: boolean;
            value: boolean;
        };
        label: StringConstructor;
        pref: ObjectConstructor;
        subLabel: StringConstructor;
        numericUncheckedValues: ArrayConstructor;
        numericCheckedValue: NumberConstructor;
        stateTextMap: ObjectConstructor;
        /**
         * Optional key to override the lookup in stateTextMap.
         * If provided, this is used instead of pref.value.
         */
        currentStateOverrideKey: {
            type: StringConstructor;
            value: null;
        };
        currentStateLabel_: {
            type: StringConstructor;
            computed: string;
        };
    };
    expanded: boolean;
    showNewBadge: boolean;
    icon: string;
    iconVisible: boolean;
    label: string;
    pref: chrome.settingsPrivate.PrefObject;
    subLabel: string;
    numericUncheckedValues: number[];
    numericCheckedValue: number;
    stateTextMap: Record<string, string>;
    currentStateOverrideKey: string | null;
    private currentStateLabel_;
    private onExpandedChange_;
    private onToggleButtonChange_;
    private computeCurrentStateLabel_;
}
declare global {
    interface HTMLElementTagNameMap {
        'security-page-feature-row': SecurityPageFeatureRowElement;
    }
}
