import type { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
type Constructor<T> = new (...args: any[]) => T;
export declare const PrefsMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<PrefsMixinInterface>;
export interface PrefsMixinInterface {
    prefs: Record<string, unknown>;
    getPref<T>(prefPath: string): chrome.settingsPrivate.PrefObject<T>;
    setPrefValue(prefPath: string, value: unknown): void;
    appendPrefListItem(key: string, item: unknown): void;
    updatePrefListItem(key: string, item: unknown, newItem: unknown): void;
    deletePrefListItem(key: string, item: unknown): void;
    setPrefDictEntry(prefPath: string, key: string, value: unknown): void;
    deletePrefDictEntry(prefPath: string, key: string): void;
}
export {};
