/**
 * @fileoverview
 * `settings-checkbox` is a checkbox that controls a supplied preference.
 */
import 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import type { CrCheckboxElement } from 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SettingsCheckboxElement {
    $: {
        checkbox: CrCheckboxElement;
        subLabel: HTMLElement;
    };
}
declare const SettingsCheckboxElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/controls/settings_boolean_control_mixin.js").SettingsBooleanControlMixinInterface) & (new (...args: any[]) => import("./pref_key_observer_mixin.js").PrefKeyObserverMixinInterface) & (new (...args: any[]) => import("../settings.js").PrefServiceObserverMixinInterface);
export declare class SettingsCheckboxElement extends SettingsCheckboxElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Alternative source for the sub-label that can contain html markup.
         * Only use with trusted input.
         */
        subLabelHtml: {
            type: StringConstructor;
            value: string;
        };
    };
    subLabelHtml: string;
    static get observers(): string[];
    /** Focus on the inner cr-checkbox. */
    focus(): void;
    private onSubLabelChanged_;
    private stopPropagation_;
    private hasSubLabel_;
    private sanitizeInnerHtml_;
    private onSubLabelClick_;
    sendPrefChangeInternal(value: boolean | number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-checkbox': SettingsCheckboxElement;
    }
}
export {};
