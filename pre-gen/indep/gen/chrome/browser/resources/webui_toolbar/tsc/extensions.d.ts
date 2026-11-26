import './extension.js';
import './toolbar_divider.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { ExtensionActionInfo } from '/shared/extensions_bar_data_model.mojom-webui.js';
declare const ExtensionsElementBase: typeof CrLitElement & (new (...args: any[]) => import("./toolbar_action_container_mixin.js").ToolbarActionContainerMixinInterface<import("/shared/extensions_bar_data_model.mojom-webui.js").ExtensionActionInfoMojoType>);
export declare class ExtensionsElement extends ExtensionsElementBase {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    getKey(state: ExtensionActionInfo): string;
    moveItem(id: string, index: number): void;
    moveItemBy(id: string, delta: number): void;
    getMimeType(): string;
    getBroadcastChannelName(): string;
    get childTagName(): string;
    isDraggable(state: ExtensionActionInfo, _index: number): boolean;
}
declare global {
    interface HTMLElementTagNameMap {
        'webui-toolbar-extensions': ExtensionsElement;
    }
}
export {};
