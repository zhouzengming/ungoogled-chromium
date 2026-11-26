import type { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export declare enum RestartType {
    RESTART = 0,
    RELAUNCH = 1
}
type Constructor<T> = new (...args: any[]) => T;
/**
 * A helper Mixin to channel the relaunch/restart signal to native Chrome.
 * This uses LifetimeBrowserProxy under the surface but additionally supports
 * the <relaunch-confirmation-dialog> for non ChromeOS based desktop platforms.
 */
export declare const RelaunchMixin: <T extends Constructor<PolymerElement>>(superClass: T) => T & Constructor<RelaunchMixinInterface>;
export interface RelaunchMixinInterface {
    performRestart(restartType: RestartType, alwaysShowDialog?: boolean): void;
}
export {};
