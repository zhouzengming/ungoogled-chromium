import './toggle_row.js';
import type { App } from 'chrome://resources/cr_components/app_management/app_management.mojom-webui.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from 'chrome://resources/lit/v3_0/lit.rollup.js';
export declare class WindowModeItemElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        windowModeLabel: {
            type: StringConstructor;
        };
        app: {
            type: ObjectConstructor;
        };
        hidden: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    accessor windowModeLabel: string;
    accessor app: App;
    accessor hidden: boolean;
    willUpdate(changedProperties: PropertyValues<this>): void;
    firstUpdated(): void;
    protected getValue_(): boolean;
    private onClick_;
    private toggleWindowMode_;
    private isHidden_;
}
declare global {
    interface HTMLElementTagNameMap {
        'app-management-window-mode-item': WindowModeItemElement;
    }
}
