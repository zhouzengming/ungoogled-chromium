import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
export declare class ReopenTabsElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    protected onReopenClick_(): void;
    protected onDismissClick_(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'reopen-tabs': ReopenTabsElement;
    }
}
