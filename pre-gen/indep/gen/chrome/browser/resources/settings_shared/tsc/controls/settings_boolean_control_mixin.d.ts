import type { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { CrPolicyPrefMixinInterface } from './cr_policy_pref_mixin.js';
import type { PrefControlMixinInterface } from './pref_control_mixin.js';
export declare const DEFAULT_UNCHECKED_VALUE = 0;
export declare const DEFAULT_CHECKED_VALUE = 1;
type Constructor<T> = new (...args: any[]) => T;
export declare const SettingsBooleanControlMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<SettingsBooleanControlMixinInterface>;
export interface SettingsBooleanControlMixinInterface extends PrefControlMixinInterface, CrPolicyPrefMixinInterface {
    inverted: boolean;
    checked: boolean;
    disabled: boolean;
    noSetPref: boolean;
    label: string;
    subLabel: string;
    numericUncheckedValues: number[];
    numericCheckedValue: number;
    controlDisabled(): boolean;
    notifyChangedByUserInteraction(): void;
    resetToPrefValue(): void;
    sendPrefChange(): void;
    sendPrefChangeInternal(value: boolean | number): void;
}
export {};
