import '/lens/region_selection.js';
import '/lens/post_selection_renderer.js';
import '/lens/overlay_border_glow.js';
import '/lens/overlay_shimmer_canvas.js';
import '/strings.m.js';
import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_elements/cr_toast/cr_toast.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { OverlayBorderGlowElement } from '/lens/overlay_border_glow.js';
import type { OverlayShimmerCanvasElement } from '/lens/overlay_shimmer_canvas.js';
import type { PostSelectionBoundingBox, PostSelectionRendererElement } from '/lens/post_selection_renderer.js';
import type { RegionSelectionElement } from '/lens/region_selection.js';
import { SelectionOverlayBaseLitElement } from '/lens/selection_overlay_base_lit.js';
import type { SuggestedAction } from './selection_overlay.mojom-webui.js';
export interface SelectionOverlayElementElement {
    $: {
        backgroundImageCanvas: HTMLCanvasElement;
        cursor: HTMLElement;
        initialFlashScrim: HTMLElement;
        overlayShimmerCanvas: OverlayShimmerCanvasElement;
        postSelectionRenderer: PostSelectionRendererElement;
        regionSelectionLayer: RegionSelectionElement;
        selectionOverlay: HTMLElement;
        floatingPromptContainer?: HTMLElement;
        promptInput?: HTMLInputElement;
    };
}
export declare class SelectionOverlayElementElement extends SelectionOverlayBaseLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        screenshotDataUri: {
            type: StringConstructor;
        };
        enableRegionSelectedGlow: {
            type: BooleanConstructor;
        };
        enableBorderGlow: {
            type: BooleanConstructor;
        };
        disableShimmer: {
            type: BooleanConstructor;
        };
        showFloatingPrompt: {
            type: BooleanConstructor;
        };
        floatingPromptStyle: {
            type: StringConstructor;
        };
        activeSelection: {
            type: ObjectConstructor;
        };
        suggestedActions: {
            type: ArrayConstructor;
        };
        enableSelectionOverlayPrompt: {
            type: BooleanConstructor;
        };
        enableSelectionOverlayPromptBox: {
            type: BooleanConstructor;
        };
        isScreenshotRendered: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        isResized: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        isInitialSize: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        canvasHeight: {
            type: NumberConstructor;
        };
        canvasWidth: {
            type: NumberConstructor;
        };
        isPointerInside: {
            type: BooleanConstructor;
        };
        currentGesture: {
            type: ObjectConstructor;
        };
        isClosing: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        shimmerOnSegmentation: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        shimmerFadeOutComplete: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        darkenExtraScrim: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        selectionOverlayRect: {
            type: ObjectConstructor;
        };
        hideBackgroundImageCanvas: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        sidePanelOpened: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        activeRegionId: {
            type: StringConstructor;
        };
    };
    accessor screenshotDataUri: string;
    accessor enableRegionSelectedGlow: boolean;
    accessor enableBorderGlow: boolean;
    accessor disableShimmer: boolean;
    accessor showFloatingPrompt: boolean;
    accessor floatingPromptStyle: string;
    accessor activeSelection: PostSelectionBoundingBox | null;
    accessor suggestedActions: SuggestedAction[];
    accessor enableSelectionOverlayPrompt: boolean;
    accessor enableSelectionOverlayPromptBox: boolean;
    constructor();
    get selectionElements(): {
        backgroundImageCanvas: HTMLCanvasElement;
        cursor: HTMLElement;
        initialFlashScrim: HTMLElement;
        overlayShimmerCanvas: OverlayShimmerCanvasElement;
        postSelectionRenderer: PostSelectionRendererElement;
        regionSelectionLayer: RegionSelectionElement;
        selectionOverlay: HTMLElement;
    };
    updated(changedProperties: PropertyValues<this>): void;
    protected updateCanvasSize(containerWidth: number, containerHeight: number): void;
    firstUpdated(): void;
    private updateThemeColors;
    private suggestedActionsListenerRouter_;
    private fetchSuggestedActions;
    protected get defaultCursorIconUrl(): string;
    private updateFloatingPromptPosition;
    handleGestureStart(): void;
    protected handleGestureDrag(event: PointerEvent): void;
    protected handleGestureEnd(): void;
    protected onInputKeydown(event: KeyboardEvent): void;
    protected onSuggestedActionClick(e: Event): void;
    protected submitPrompt(prompt: string): void;
    protected onPromptPointerdown(event: PointerEvent): void;
    protected getActionIcon(title: string): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    getOverlayBorderGlow(): OverlayBorderGlowElement;
}
declare global {
    interface HTMLElementTagNameMap {
        'glic-selection-overlay': SelectionOverlayElementElement;
    }
}
