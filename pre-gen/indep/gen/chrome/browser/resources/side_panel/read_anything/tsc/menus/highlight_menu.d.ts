import './simple_action_menu.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { SettingsPrefs, ShowAtConfigPrefs } from '../content/read_anything_types.js';
import type { MenuStateItem, ToolbarMenu } from './menu_util.js';
import type { SimpleActionMenuElement } from './simple_action_menu.js';
export interface HighlightMenuElement {
    $: {
        menu: SimpleActionMenuElement;
    };
}
declare const HighlightMenuElementBase: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_elements/web_ui_listener_mixin_lit.js").WebUiListenerMixinLitInterface);
export declare class HighlightMenuElement extends HighlightMenuElementBase implements ToolbarMenu {
    static get is(): string;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        settingsPrefs: {
            type: ObjectConstructor;
        };
        nonModal: {
            type: BooleanConstructor;
        };
        options_: {
            type: ArrayConstructor;
        };
    };
    accessor settingsPrefs: SettingsPrefs;
    accessor nonModal: boolean;
    private audioBrowserProxy_;
    protected accessor options_: Array<MenuStateItem<number>>;
    private logger_;
    open(anchor: HTMLElement, showAtConfig?: ShowAtConfigPrefs): void;
    close(): void;
    protected restoredHighlightIndex_(): number;
    protected onHighlightChange_(event: CustomEvent<{
        data: number;
    }>): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'highlight-menu': HighlightMenuElement;
    }
}
export {};
