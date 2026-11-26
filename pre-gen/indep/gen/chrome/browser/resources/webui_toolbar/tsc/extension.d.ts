import '//resources/cr_elements/cr_button/cr_button.js';
import '/shared/icon_from_table.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { ExtensionActionInfo } from '/shared/extensions_bar_data_model.mojom-webui.js';
declare const ExtensionElementBase: typeof CrLitElement & (new (...args: any[]) => import("./toolbar_action_mixin.js").ToolbarActionMixinInterface<import("/shared/extensions_bar_data_model.mojom-webui.js").ExtensionActionInfoMojoType>);
export declare class ExtensionElement extends ExtensionElementBase {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    private browserProxy_;
    getElementId(state: ExtensionActionInfo): string;
    getSecondaryElementId(): string;
    protected onClick_(e: PointerEvent): void;
    protected onPointerdown_(e: PointerEvent): void;
    protected onContextmenu_(e: Event): void;
    getMimeType(): string;
    getItemId(): string;
    isDraggable(): boolean;
    moveItemBy(delta: number): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'webui-toolbar-extension': ExtensionElement;
    }
}
export {};
