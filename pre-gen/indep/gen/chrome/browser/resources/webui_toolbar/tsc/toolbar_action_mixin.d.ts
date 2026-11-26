import type { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { HelpBubbleMixinInterface } from 'chrome://resources/cr_components/help_bubble/help_bubble_mixin_interface.js';
import type { HelpBubbleAnchor } from './toolbar_button.js';
type Constructor<T> = new (...args: any[]) => T;
export interface ToolbarActionMixinInterface<T> extends HelpBubbleMixinInterface, HelpBubbleAnchor {
    state: T;
    trackedHighlighted: boolean;
    lastUnhighlightedTime: number;
    getElementId(state: T): string | undefined;
    getSecondaryElementId(): string | undefined;
    getMimeType(): string;
    getItemId(): string;
    isDraggable(): boolean;
    moveItemBy(delta: number): void;
    onDragstart(e: DragEvent): void;
    onDragend(e: DragEvent): void;
    onKeydown(e: KeyboardEvent): void;
}
/**
 * A mixin for individual WebUI toolbar action buttons (such as pinned toolbar
 * actions and extensions).
 *
 * It manages help bubble registration and tracking, waiting for any entrance
 * or movement animations to finish before registering help bubbles so they
 * anchor at the button's final DOM location. It also handles cleanup on
 * disconnect and updating bubble registration when the element's identifier
 * changes.
 */
export declare const ToolbarActionMixin: <T, BaseClass extends Constructor<CrLitElement>>(superClass: BaseClass, initialState: T) => BaseClass & Constructor<ToolbarActionMixinInterface<T>>;
export {};
