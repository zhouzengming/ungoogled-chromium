import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import type { CrIconButtonElement } from '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { OverflowMenuItem } from '/shared/toolbar_ui_api.mojom-webui.js';
import type { PinnedToolbarActionState } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
declare const PinnedToolbarActionElementBase: typeof CrLitElement & (new (...args: any[]) => import("./toolbar_action_mixin.js").ToolbarActionMixinInterface<import("/shared/toolbar_ui_api_data_model.mojom-webui.js").PinnedToolbarActionStateMojoType>) & (new (...args: any[]) => import("./overflowable_toolbar_action_mixin.js").OverflowableToolbarActionMixinInterface);
export interface PinnedToolbarActionElement {
    $: {
        button: CrIconButtonElement;
    };
}
export declare class PinnedToolbarActionElement extends PinnedToolbarActionElementBase {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    getOverflowMenuItem(): OverflowMenuItem;
    static get properties(): {
        poppedOut: {
            type: BooleanConstructor;
        };
    };
    accessor poppedOut: boolean;
    private iconTable_;
    private skipNextClick_;
    willUpdate(changedProperties: PropertyValues<this>): void;
    private get browserProxy_();
    getElementId(state: PinnedToolbarActionState): string | undefined;
    protected getIronIcon_(): string | undefined;
    protected getIconStyle_(): string | undefined;
    protected onPointerdown_(e: PointerEvent): void;
    protected onActionClick_(e: PointerEvent): void;
    private getContextMenuType_;
    protected getTooltip_(): string;
    getMimeType(): string;
    getItemId(): string;
    isDraggable(): boolean;
    moveItemBy(delta: number): void;
    protected onContextmenu_(e: Event): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'pinned-toolbar-action': PinnedToolbarActionElement;
    }
}
export {};
