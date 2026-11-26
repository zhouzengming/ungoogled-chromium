import type { PrefServiceObserverMixinInterface } from '/shared/settings/prefs2/pref_service_observer_mixin.js';
import type { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
type Constructor<T> = new (...args: any[]) => T;
export declare const PrefKeyObserverMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<PrefKeyObserverMixinInterface> & Constructor<PrefServiceObserverMixinInterface>;
export interface PrefKeyObserverMixinInterface extends PrefServiceObserverMixinInterface {
    prefKey: string;
}
export {};
