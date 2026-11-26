import '//resources/js/cr.js';
import type { BrowserControlsServiceInterface } from '/shared/browser_controls_api.mojom-webui.js';
import { EventDispositionFlag } from '/shared/browser_controls_api_data_model.mojom-webui.js';
import type { IconUpdate } from '/shared/icon_handle.mojom-webui.js';
import type { ToolbarUIServiceInterface } from '/shared/toolbar_ui_api.mojom-webui.js';
import { ContextMenuType } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
import type { BackForwardButtonState, FocusRequestTarget, NavigationControlsState, OmniboxViewState, ReloadControlState } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
export { ContextMenuType, EventDispositionFlag, };
export type { BackForwardButtonState, IconUpdate, NavigationControlsState, OmniboxViewState, ReloadControlState, };
export type NavigationControlsStateListener = (icons: IconUpdate[], state: NavigationControlsState) => void;
export type NavigationControlsStateListenerHandle = number;
export declare const INVALID_NAVIGATION_CONTROLS_STATE_LISTENER_HANDLE: NavigationControlsStateListenerHandle;
export type FocusRequestListener = (target: FocusRequestTarget) => void;
export type FocusRequestHandle = number;
export declare const INVALID_FOCUS_REQUEST_HANDLE: FocusRequestHandle;
export type ShowSplitTabsContextMenuListener = () => void;
export type ShowSplitTabsContextMenuHandle = number;
export declare const INVALID_SHOW_SPLIT_TABS_CONTEXT_MENU_HANDLE: ShowSplitTabsContextMenuHandle;
import type { PermissionChipDelegate } from '/shared/permission_chip_delegate.js';
import type { LhsChipIdentifier } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
export interface BrowserProxy extends PermissionChipDelegate {
    browserControlsHandler: BrowserControlsServiceInterface;
    toolbarUIHandler: ToolbarUIServiceInterface;
    /**
     * Records a value in a histogram.
     * @param histogramName The name of the histogram.
     * @param value The value to record.
     * @param maxValue The maximum value of the histogram.
     */
    recordInHistogram(histogramName: string, value: number, maxValue: number): void;
    addNavigationStateListener(listener: NavigationControlsStateListener): NavigationControlsStateListenerHandle;
    addFocusRequestListener(listener: FocusRequestListener): FocusRequestHandle;
    addShowSplitTabsContextMenuListener(listener: ShowSplitTabsContextMenuListener): ShowSplitTabsContextMenuHandle;
    removeNavigationStateListener(handle: NavigationControlsStateListenerHandle): void;
    removeFocusRequestListener(handle: FocusRequestHandle): void;
    removeShowSplitTabsContextMenuListener(handle: ShowSplitTabsContextMenuHandle): void;
}
export declare class BrowserProxyImpl implements BrowserProxy {
    private callbackRouter;
    browserControlsHandler: BrowserControlsServiceInterface;
    toolbarUIHandler: ToolbarUIServiceInterface;
    private constructor();
    onChipClicked(id: LhsChipIdentifier, isPointer: boolean, stateToken: number): void;
    onChipPointerEntered(id: LhsChipIdentifier): void;
    onChipPointerExited(id: LhsChipIdentifier): void;
    onChipMousePressed(id: LhsChipIdentifier, isMiddleClick?: boolean): void;
    onChipExpandAnimationEnded(id: LhsChipIdentifier): void;
    onChipCollapseAnimationEnded(id: LhsChipIdentifier): void;
    /**
     * Records a value in a histogram.
     * @param histogramName The name of the histogram.
     * @param value The value to record.
     * @param maxValue The maximum value of the histogram.
     */
    recordInHistogram(histogramName: string, value: number, maxValue: number): void;
    addNavigationStateListener(listener: NavigationControlsStateListener): number;
    addFocusRequestListener(listener: FocusRequestListener): number;
    addShowSplitTabsContextMenuListener(listener: ShowSplitTabsContextMenuListener): number;
    removeNavigationStateListener(handle: NavigationControlsStateListenerHandle): void;
    removeFocusRequestListener(handle: FocusRequestHandle): void;
    removeShowSplitTabsContextMenuListener(handle: ShowSplitTabsContextMenuHandle): void;
    static getInstance(): BrowserProxy;
    static setInstance(proxy: BrowserProxy): void;
}
