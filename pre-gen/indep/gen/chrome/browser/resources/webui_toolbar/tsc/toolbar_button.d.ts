import type { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { MenuSourceType } from '//resources/mojo/ui/base/mojom/menu_source_type.mojom-webui.js';
import type { HelpBubbleMixinInterface } from 'chrome://resources/cr_components/help_bubble/help_bubble_mixin_interface.js';
import { EventDispositionFlag } from './browser_proxy.js';
export declare const BUTTON_LEFT = 0;
export declare const BUTTON_MIDDLE = 1;
export declare const BUTTON_RIGHT = 2;
export interface GetEventDispositionFlagsOptions {
    ignoreCtrlKey?: boolean;
    ignoreShiftKey?: boolean;
}
type Constructor<T> = new (...args: any[]) => T;
export interface HelpBubbleAnchor {
    hasHelpBubble: boolean;
    adjustTooltipForHelpBubble(original: string): string;
}
/**
 * A mixin for components that can be targeted by a help bubble (IPH).
 * Centralizes the `hasHelpBubble` property and tooltip suppression logic.
 */
export declare const HelpBubbleAnchorMixin: <T extends Constructor<CrLitElement>>(superClass: T) => T & Constructor<HelpBubbleMixinInterface> & Constructor<HelpBubbleAnchor>;
export declare function setHasHelpBubble(el: Element, value: boolean): void;
/**
 * A helper class for handling pointer events to trigger long press, short
 * press, as well as context menu actions.
 *
 * This class encapsulates the common logic for determining whether a pointer
 * interaction should result in a short press, a long press (often used to show
 * a context menu), or a direct context menu trigger (e.g., right-click or Mac
 * Ctrl+LeftClick).
 *
 * Safe usage of this class requires the caller to route all relevant pointer
 * events (pointerdown, pointerup, pointercancel) and the contextmenu event
 * to this class's respective handlers. These can be bound directly in the
 * HTML template, or called from within custom event listeners if the component
 * requires additional logic (like the reload button).
 *
 * This class typically gets pointer capture on pointer down, and then on
 * pointer up, only treats it as a click if it has pointer capture. This gets us
 * the standard button behavior where pressing on a different button or on a
 * non-button area and releasing on a button does nothing, nor does pressing
 * on a button when it's disabled, and releasing after it's been enabled.
 *
 * Important note on accessibility:
 * `PressHandler` specifically manages pointer (mouse, touch, pen) interactions.
 * Natively, `<cr-icon-button>` intercepts keyboard `Space` and `Enter` keys and
 * synthesizes a standard `click` event (where `e.detail === 0`).
 * To ensure your button is fully accessible to keyboard, you MUST also add an
 * `@click` listener that explicitly intercepts these synthetic clicks and
 * delegates them to your short press logic, while ignoring actual mouse clicks
 * (which have `detail > 0` and are already handled here by `pointerup`).
 *
 * Example of direct usage in .html.ts:
 * ```html
 * <cr-icon-button
 *   @pointerdown="${this.pressHandler_.onPointerdown}"
 *   @pointerup="${this.pressHandler_.onPointerup}"
 *   @pointercancel="${this.pressHandler_.onPointercancel}"
 *   @contextmenu="${this.pressHandler_.onContextmenu}"
 *   @click="${this.onClick_}">
 * </cr-icon-button>
 * ```
 */
export declare class PressHandler {
    private static readonly LONG_PRESS_TIMER_THRESHOLD_MS;
    private static readonly DRAG_THRESHOLD_PX;
    private static readonly NO_ACTIVE_POINTER_ID;
    private onLongPress_;
    private onShortPress_;
    private contextMenuState_;
    private expectPointerCapture_;
    constructor(onLongPress: (source: MenuSourceType) => void, onShortPress: (e: MouseEvent) => void, enableContextMenu?: boolean);
    private onPointermove_;
    private resetContextMenuState_;
    private shouldCancelClick_;
    onPointerdown: (e: PointerEvent, skipLongPress?: boolean) => void;
    onPointerup: (e: PointerEvent) => void;
    onPointercancel: (e: PointerEvent) => void;
    onContextmenu: (e: PointerEvent) => void;
}
export declare function getContextMenuPosition(element: HTMLElement): DOMRect;
export declare function getClickSourceType(e: Event): MenuSourceType;
export declare function getContextMenuSourceType(e: Event): MenuSourceType;
/**
 * Call this method on pointerdown to determine whether a click following this
 * pointerdown event should be skipped to avoid reopening a bubble that was
 * dismissed due to focus loss (due to this pointerdown). `e` should be the
 * pointerdown event. `isBubbleOpen` should indicate if a bubble is currently
 * open. `lastBubbleClosedTime` should indicate when a bubble was last closed.
 */
export declare function shouldSkipNextClick(e: PointerEvent, isBubbleOpen: boolean, lastBubbleClosedTime?: number): boolean;
export declare function getEventDispositionFlags(e: MouseEvent | KeyboardEvent, options?: GetEventDispositionFlagsOptions): EventDispositionFlag[];
export declare function roundedIconsEnabled(): boolean;
/**
 * Triggers programmatic SMIL animations within the shadow root of a cr-icon
 * that is nested inside the given button. Filtering by begin="indefinite"
 * ensures that sequentially chained or auto-running timed animations are not
 * inadvertently force-started simultaneously.
 */
export declare function playIconAnimation(button: CrLitElement): void;
export {};
