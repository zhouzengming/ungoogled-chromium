import './grouped_action_menu.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { SettingsPrefs, ShowAtConfigPrefs } from '../content/read_anything_types.js';
import type { GroupedActionMenuElement } from './grouped_action_menu.js';
import type { MenuGroup, ToolbarMenu } from './menu_util.js';
export interface TextMenuElement {
    $: {
        menu: GroupedActionMenuElement;
    };
}
declare const TextMenuElementBase: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface) & (new (...args: any[]) => import("//resources/cr_elements/web_ui_listener_mixin_lit.js").WebUiListenerMixinLitInterface);
export declare class TextMenuElement extends TextMenuElementBase implements ToolbarMenu {
    static get is(): string;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        settingsPrefs: {
            type: ObjectConstructor;
        };
        nonModal: {
            type: BooleanConstructor;
        };
        areFontsLoaded: {
            type: BooleanConstructor;
        };
        pageLanguage: {
            type: StringConstructor;
        };
        groups_: {
            type: ArrayConstructor;
        };
    };
    accessor settingsPrefs: SettingsPrefs;
    accessor nonModal: boolean;
    accessor areFontsLoaded: boolean;
    accessor pageLanguage: string;
    private visualBrowserProxy_;
    private fontOptions_;
    private lineSpacingOptions_;
    private letterSpacingOptions_;
    protected accessor groups_: Array<MenuGroup<number | string>>;
    private logger_;
    willUpdate(changedProperties: PropertyValues<this>): void;
    open(anchor: HTMLElement, showAtConfig?: ShowAtConfigPrefs): void;
    close(): void;
    protected onFontChange_(event: CustomEvent<{
        data: string;
    }>): void;
    protected onLineSpacingChange_(event: CustomEvent<{
        data: number;
    }>): void;
    protected onLetterSpacingChange_(event: CustomEvent<{
        data: number;
    }>): void;
    private updateOptionsForFont_;
    private updateOptionsForLineSpacing_;
    private updateOptionsForLetterSpacing_;
    private computeFontOptions_;
}
declare global {
    interface HTMLElementTagNameMap {
        'text-menu': TextMenuElement;
    }
}
export {};
