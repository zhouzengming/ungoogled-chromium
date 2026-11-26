import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_elements/icons.html.js';
import './icons.html.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
/**
 * User actions on the threads rail. This enum must match the numbering for
 * NtpThreadsAction in enums.xml. These values are persisted to logs.
 * Entries should not be renumbered, removed or reused.
 */
export declare enum ThreadsAction {
    SHOW_HISTORY_CLICKED = 0,
    MAX_VALUE = 0
}
declare const ThreadsRailElementBase: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface);
/**
 * The element for displaying the AI Mode threads rail.
 */
export declare class ThreadsRailElement extends ThreadsRailElementBase {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected onShowHistoryClick_(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-threads-rail': ThreadsRailElement;
    }
}
export {};
