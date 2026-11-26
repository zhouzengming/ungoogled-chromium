import '//resources/cr_elements/cr_icon/cr_icon.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { IconHandle } from './icon_handle.mojom-webui.js';
import type { IconInfo } from './icon_table.js';
export declare class IconFromTableElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        /**
         * Handle to the icon to show here. See toolbar_ui_api.mojom.IconHandle.
         */
        iconHandle: {
            type: ObjectConstructor;
        };
        /**
         * Internally cached information on the icon.
         */
        iconInfo_: {
            type: ObjectConstructor;
        };
    };
    accessor iconHandle: IconHandle;
    protected accessor iconInfo_: IconInfo;
    private iconTable_;
    constructor();
    willUpdate(changedProperties: PropertyValues<this>): void;
    protected getIconColorCss_(): string | undefined;
}
declare global {
    interface HTMLElementTagNameMap {
        'icon-from-table': IconFromTableElement;
    }
}
