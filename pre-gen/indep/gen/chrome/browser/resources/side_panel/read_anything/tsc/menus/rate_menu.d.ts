import './simple_action_menu.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { SettingsPrefs } from '../content/read_anything_types.js';
import type { MenuStateItem } from './menu_util.js';
import type { SimpleActionMenuElement } from './simple_action_menu.js';
export interface RateMenuElement {
    $: {
        menu: SimpleActionMenuElement;
    };
}
export declare const RATE_OPTIONS: number[];
declare const RateMenuElementBase: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_elements/web_ui_listener_mixin_lit.js").WebUiListenerMixinLitInterface);
export declare class RateMenuElement extends RateMenuElementBase {
    static get is(): string;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        settingsPrefs: {
            type: ObjectConstructor;
        };
        options_: {
            type: ArrayConstructor;
        };
    };
    accessor settingsPrefs: SettingsPrefs;
    private audioBrowserProxy_;
    protected accessor options_: Array<MenuStateItem<number>>;
    private logger_;
    open(anchor: HTMLElement): void;
    protected restoredRateIndex_(): number;
    protected onRateChange_(event: CustomEvent<{
        data: number;
    }>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'rate-menu': RateMenuElement;
    }
}
export {};
