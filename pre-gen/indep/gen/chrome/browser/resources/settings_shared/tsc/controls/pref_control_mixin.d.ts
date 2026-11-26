import type { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
type Constructor<T> = new (...args: any[]) => T;
/**
 * Tracks the initialization of a specified preference and logs an error if the
 * pref is not defined after prefs have been fetched.
 */
export declare const PrefControlMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<PrefControlMixinInterface>;
export interface PrefControlMixinInterface {
    pref?: chrome.settingsPrivate.PrefObject;
    prefKey?: string;
}
export {};
