import './back_forward_button.js';
import './reload_button.js';
import './location_bar.js';
import './split_tabs_button.js';
import './home_button.js';
import './battery_saver_button.js';
import './performance_intervention_button.js';
import './pinned_toolbar_actions.js';
import './extensions.js';
import './app_menu_button.js';
import './glic_button.js';
import './avatar_button.js';
import './media_button.js';
import './overflow_button.js';
import '/shared/icon_table.js';
import '/shared/icon_from_table.js';
import './icons.js';
import { TrackedElementManager } from '//resources/js/tracked_element/tracked_element_manager.js';
import { CrLitElement, nothing } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import { IconTable } from '/shared/icon_table.js';
import { BrowserProxyImpl, EventDispositionFlag, INVALID_NAVIGATION_CONTROLS_STATE_LISTENER_HANDLE, INVALID_SHOW_SPLIT_TABS_CONTEXT_MENU_HANDLE } from './browser_proxy.js';
import type { BrowserProxy, FocusRequestHandle, FocusRequestListener, NavigationControlsState, NavigationControlsStateListener, NavigationControlsStateListenerHandle, ShowSplitTabsContextMenuHandle, ShowSplitTabsContextMenuListener } from './browser_proxy.js';
import type { ResponsiveControl } from './responsive_control.js';
import type { BrowserControlsServiceInterface } from '/shared/browser_controls_api.mojom-webui.js';
import type { IconFromTableElement } from '/shared/icon_from_table.js';
import { AppMenuIconType, AppMenuSeverity, AvatarToolbarButtonState, ContentSettingImageType, ContextMenuType, FocusRequestTarget, LhsChipIdentifier, SecurityChipRole, OmniboxTextColor, PageActionAnimationStyle, PageActionId, PageActionTrigger, PermissionAction, PermissionChipTheme, PermissionPromptStyle, PinnedToolbarAction } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
import { IconType } from '/shared/icon_handle.mojom-webui.js';
import type { GlicButtonState, OmniboxAction, LocationBarState, PageActionState, PermissionChipState, PermissionDashboardState } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
import type { AdjustOmniboxTextForCopyResult, InitialState, OverflowMenuItem, ToolbarUIServiceInterface } from '/shared/toolbar_ui_api.mojom-webui.js';
import { PermissionChipElement } from '/shared/permission_chip.js';
import type { PermissionDashboardElement } from '/shared/permission_dashboard.js';
import { INVALID_FOCUS_REQUEST_HANDLE } from './browser_proxy.js';
import { AppMenuButtonElement } from './app_menu_button.js';
import { BatterySaverButtonElement } from './battery_saver_button.js';
import { GlicButtonElement } from './glic_button.js';
import { ContentSettingIconElement } from './content_setting_icon.js';
import { ContentSettingsIconsElement } from './content_settings_icons.js';
import type { ExtensionsElement } from './extensions.js';
import { LocationBarElement } from './location_bar.js';
import { LocationIconElement } from './location_icon.js';
import { PageActionIconElement } from './page_action_icon.js';
import { PageActionIconsElement } from './page_action_icons.js';
import type { PinnedToolbarActionElement } from './pinned_toolbar_action.js';
import type { PinnedToolbarActionsElement } from './pinned_toolbar_actions.js';
import { PointerProxyImpl } from './pointer_proxy.js';
import type { PointerProxy } from './pointer_proxy.js';
import { ReadonlyOmniboxElement } from './readonly_omnibox.js';
import { AnimationTracker } from '/shared/animation_tracker.js';
import { ToolbarActionContainerMixin } from './toolbar_action_container_mixin.js';
import type { KeyedActionState, ToolbarActionContainerMixinInterface } from './toolbar_action_container_mixin.js';
import { ToolbarActionMixin } from './toolbar_action_mixin.js';
import type { ToolbarActionMixinInterface } from './toolbar_action_mixin.js';
import { OverflowableToolbarActionContainerMixin } from './overflowable_toolbar_action_container_mixin.js';
import type { OverflowableToolbarActionContainer } from './overflowable_toolbar_action_container_mixin.js';
import { OverflowableToolbarActionMixin } from './overflowable_toolbar_action_mixin.js';
import type { OverflowableToolbarActionElement, OverflowableToolbarActionMixinInterface } from './overflowable_toolbar_action_mixin.js';
import { getClickSourceType, getContextMenuSourceType, PressHandler, shouldSkipNextClick } from './toolbar_button.js';
import { ToolbarChipButtonElement } from './toolbar_chip_button.js';
import { CrLazyIconset } from '/shared/cr_lazy_iconset.js';
import { IconsetMap } from '//resources/cr_elements/cr_icon/iconset_map.js';
import { getTrustedHTML } from '//resources/js/static_types.js';
export { AnimationTracker, AppMenuButtonElement, AppMenuIconType, AppMenuSeverity, AvatarToolbarButtonState, BatterySaverButtonElement, BrowserProxyImpl, ContextMenuType, ContentSettingIconElement, ContentSettingImageType, ContentSettingsIconsElement, CrLazyIconset, EventDispositionFlag, FocusRequestTarget, GlicButtonElement, getClickSourceType, getContextMenuSourceType, getTrustedHTML, getTypedBoolean, getTypedInteger, hasInitialStateKey, IconTable, IconType, IconsetMap, INVALID_FOCUS_REQUEST_HANDLE, INVALID_NAVIGATION_CONTROLS_STATE_LISTENER_HANDLE, INVALID_SHOW_SPLIT_TABS_CONTEXT_MENU_HANDLE, LhsChipIdentifier, LocationBarElement, LocationIconElement, OmniboxTextColor, PageActionAnimationStyle, PageActionIconElement, PageActionIconsElement, PageActionId, PageActionTrigger, PermissionAction, PermissionChipElement, PermissionChipTheme, PermissionPromptStyle, PinnedToolbarAction, PointerProxyImpl, PressHandler, ReadonlyOmniboxElement, resetInitialStateForTesting, OverflowableToolbarActionContainerMixin, OverflowableToolbarActionMixin, SecurityChipRole, shouldSkipNextClick, ToolbarActionContainerMixin, ToolbarActionMixin, ToolbarChipButtonElement, TrackedElementManager, };
export type { AdjustOmniboxTextForCopyResult, BrowserControlsServiceInterface, BrowserProxy, ExtensionsElement, FocusRequestHandle, FocusRequestListener, GlicButtonState, IconFromTableElement, InitialState, KeyedActionState, LocationBarState, NavigationControlsStateListener, NavigationControlsStateListenerHandle, OmniboxAction, OverflowableToolbarActionContainer, OverflowableToolbarActionElement, OverflowableToolbarActionMixinInterface, PageActionState, PermissionChipState, PermissionDashboardElement, PermissionDashboardState, PinnedToolbarActionElement, PinnedToolbarActionsElement, PointerProxy, ShowSplitTabsContextMenuHandle, ShowSplitTabsContextMenuListener, ToolbarActionContainerMixinInterface, ToolbarActionMixinInterface, ToolbarFlatStateSchema, ToolbarUIServiceInterface, };
export { SearchboxBrowserProxy } from '//resources/cr_components/searchbox/searchbox_browser_proxy.js';
declare const AppElementBase: typeof CrLitElement & (new (...args: any[]) => import("//resources/cr_components/help_bubble/help_bubble_mixin_interface.js").HelpBubbleMixinInterface);
/**
 * Keys corresponding to initial toolbar state values provided by the browser.
 */
declare enum ToolbarStateKey {
    IS_NAVIGATION_LOADING = "isNavigationLoading",
    RELOAD_CAN_SHOW_MENU = "reloadCanShowMenu",
    BACK_BUTTON_ENABLED = "backButtonEnabled",
    FORWARD_BUTTON_ENABLED = "forwardButtonEnabled",
    HOME_BUTTON_SHOULD_BE_SHOWN = "homeButtonShouldBeShown",
    BATTERY_SAVER_BUTTON_VISIBLE = "batterySaverButtonVisible",
    LAYOUT_CONSTANTS_VERSION = "layoutConstantsVersion",
    TOUCH_UI = "touchUi",
    INITIAL_WEBUI_SURFACE_SYNC_ENABLED = "initialWebUISurfaceSyncEnabled",
    IS_FALLBACK_PREWARMING = "isFallbackPrewarming"
}
/**
 * Schema mapping `ToolbarStateKey` entries to their respective value types in
 * the initial state dictionary.
 */
interface ToolbarFlatStateSchema {
    [ToolbarStateKey.IS_NAVIGATION_LOADING]: boolean;
    [ToolbarStateKey.RELOAD_CAN_SHOW_MENU]: boolean;
    [ToolbarStateKey.BACK_BUTTON_ENABLED]: boolean;
    [ToolbarStateKey.FORWARD_BUTTON_ENABLED]: boolean;
    [ToolbarStateKey.HOME_BUTTON_SHOULD_BE_SHOWN]: boolean;
    [ToolbarStateKey.BATTERY_SAVER_BUTTON_VISIBLE]: boolean;
    [ToolbarStateKey.LAYOUT_CONSTANTS_VERSION]: number;
    [ToolbarStateKey.TOUCH_UI]: boolean;
    [ToolbarStateKey.INITIAL_WEBUI_SURFACE_SYNC_ENABLED]: boolean;
    [ToolbarStateKey.IS_FALLBACK_PREWARMING]: boolean;
}
/**
 * Determines whether the specified `key` is present in the initial toolbar
 * state dictionary.
 */
declare function hasInitialStateKey(key: ToolbarStateKey): boolean;
/**
 * Resets the cached initial toolbar state to `null` for testing purposes.
 */
declare function resetInitialStateForTesting(): void;
/**
 * Reads a boolean property for the given `key` from the initial state
 * dictionary. Returns `false` if the property is missing or not a boolean.
 */
declare function getTypedBoolean<K extends keyof ToolbarFlatStateSchema>(key: K): boolean;
/**
 * Reads a numeric property for the given `key` from the initial state
 * dictionary. Returns `0` if the property is missing or not a number.
 */
declare function getTypedInteger<K extends keyof ToolbarFlatStateSchema>(key: K): number;
export declare class ToolbarAppElement extends AppElementBase {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    /**
     * Returns the Lit element template. To prevent premature paint holding
     * resolution (FCP) during startup, we return `nothing` until the initial
     * navigation controls state has been received from the browser.
     */
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1> | typeof nothing;
    static get properties(): {
        isReloadButtonEnabled_: {
            type: BooleanConstructor;
        };
        isAppMenuButtonEnabled_: {
            type: BooleanConstructor;
        };
        isSplitTabsButtonEnabled_: {
            type: BooleanConstructor;
        };
        isHomeButtonEnabled_: {
            type: BooleanConstructor;
        };
        isBatterySaverButtonEnabled_: {
            type: BooleanConstructor;
        };
        isLocationBarEnabled_: {
            type: BooleanConstructor;
        };
        navigationControlsState_: {
            type: ObjectConstructor;
        };
        isBackForwardButtonEnabled_: {
            type: BooleanConstructor;
        };
        isPinnedToolbarActionsEnabled_: {
            type: BooleanConstructor;
        };
        isExtensionsContainerEnabled_: {
            type: BooleanConstructor;
        };
        isGlicButtonEnabled_: {
            type: BooleanConstructor;
        };
        isAvatarButtonEnabled_: {
            type: BooleanConstructor;
        };
        isPerformanceInterventionButtonEnabled_: {
            type: BooleanConstructor;
        };
        isMediaButtonEnabled_: {
            type: BooleanConstructor;
        };
        isInitialized_: {
            type: BooleanConstructor;
        };
        isInitializedSyncForTesting_: {
            type: BooleanConstructor;
        };
        initialSyncBootSuccess_: {
            type: BooleanConstructor;
        };
        webUIToolbarFullyEnabled_: {
            type: BooleanConstructor;
        };
    };
    protected accessor isReloadButtonEnabled_: boolean;
    protected accessor isAppMenuButtonEnabled_: boolean;
    protected accessor isSplitTabsButtonEnabled_: boolean;
    protected accessor isHomeButtonEnabled_: boolean;
    protected accessor isBatterySaverButtonEnabled_: boolean;
    protected accessor isLocationBarEnabled_: boolean;
    protected accessor isBackForwardButtonEnabled_: boolean;
    protected accessor isPinnedToolbarActionsEnabled_: boolean;
    protected accessor isExtensionsContainerEnabled_: boolean;
    protected accessor isGlicButtonEnabled_: boolean;
    protected accessor isAvatarButtonEnabled_: boolean;
    protected accessor isPerformanceInterventionButtonEnabled_: boolean;
    protected accessor isMediaButtonEnabled_: boolean;
    /**
     * Tracks whether the element has received its first navigation state
     * update from the browser and completed its initial visual render.
     */
    protected accessor isInitialized_: boolean;
    protected accessor isInitializedSyncForTesting_: boolean;
    protected accessor initialSyncBootSuccess_: boolean;
    private omniboxResizingPrioritizationEnabled_;
    protected accessor webUIToolbarFullyEnabled_: boolean;
    protected accessor navigationControlsState_: NavigationControlsState;
    private browserProxy_;
    private navigationStateListenerHandle_;
    private iconTable_;
    private isPageInitialized_;
    private hasReadState_;
    private hasReceivedNavigationState_;
    private initializeSessionId_;
    private resizeObserver_?;
    private pendingLayoutIfNeeded_;
    private pendingLayout_;
    private dragOverListener_;
    private dropListener_;
    private keyDownListener_;
    private windowResizeListener_;
    private requestLayoutListener_;
    private layoutNowListener_;
    private isRtl_;
    get browserProxyForTesting(): BrowserProxy;
    protected readonly initialBootSnapshot_: {
        backButtonEnabled: boolean;
        forwardButtonEnabled: boolean;
        isNavigationLoading: boolean;
        initializedSync: boolean;
    };
    constructor();
    /**
     * Sets up event listeners and the PerformanceObserver when the element is
     * added to the DOM.
     */
    connectedCallback(): void;
    private initializePage_;
    /**
     * Cleans up event listeners and the PerformanceObserver when the element is
     * removed from the DOM.
     */
    disconnectedCallback(): void;
    private getDeepActiveElement;
    private getDeepFocusableElements;
    private onKeyDown_;
    firstUpdated(changedProperties: PropertyValues<this>): void;
    /**
     * Schedules a layoutIfNeeded_() on the next animation frame, if one isn't
     * already scheduled. layoutIfNeeded_() will layout the ResponsiveControls if
     * getAvailableWidth() is non-zero, meaning the window and toolbar have
     * different widths so a new layout is needed, or if `pendingLayout_` is
     * true.
     *
     * The scheduled task should be fast if no layout is actually needed.
     *
     * Called on window resize, toolbar-app resize, or when something happens that
     * may result in resizing the toolbar-app. Also used by
     * scheduleLayoutResponsiveControls_().
     */
    private scheduleLayoutIfNeeded_;
    /**
     * Schedules a layout of responsive controls before the next animation frame.
     * Multiple calls are aggregated into a single layout, so this should
     * typically be used rather than calling layoutResponsiveControls() directly.
     *
     * This should be called whenever any control's visibility state or size
     * changes, and a new layout is definitely needed. ResponsiveControls
     * themselves are responsible for bubbling up `request-layout` events to the
     * app to trigger layouts when their preferred and/or minimize sizes may have
     * changed, while non-responsive controls are monitored by watching the size
     * of the toolbar-app element itself. If two or more non-ResponsiveControls
     * change in size in such a way that the toolbar's size remains the same, no
     * resize is triggered, which is fine, since that should have no effect on
     * which ResponsiveControls should be displayed.
     */
    private scheduleLayoutResponsiveControls_;
    private layoutIfNeeded_;
    /**
     * Returns the amount of available width for the toolbar, in pixels, which is
     * the difference between the window inner width and the current width of this
     * element (`window.innerWidth - this.clientWidth`). This is intended to be
     * used during layout, which attempts to size controls so that there's exactly
     * 0 available width.
     *
     * Note that this value can be negative if the toolbar element's client width
     * exceeds the window's inner width.
     */
    getAvailableWidth(): number;
    /**
     * Resizes / shows / hides responsive controls based on available space in the
     * toolbar. Returns true if all controls were successfully laid out; returns
     * false if `failOnOverflow` is true and any control overflowed.
     *
     * If true is returned, all available space on the window should be taken up
     * by the toolbar and its controls. If false is returned, the method has
     * exited early, and the toolbar may not be taking up all available space in
     * the window - the expectation is that this method will be called again,
     * after making the overflow button visible, without `failOnOverflow` set.
     */
    private runLayoutPass;
    /**
     * Returns a prioritized Array of responsive controls that can be resized or
     * hidden so the toolbar fits in the window. Earlier controls in the Array
     * have higher priority.
     *
     * Controls that can't be hidden on overflow or otherwise change size in
     * response to the amount of available width are not ResponsiveControls, so
     * are not returned by this method. e.g., of the navigation buttons on the
     * left of the toolbar, the back and reload buttons are always shown, and
     * never moved to the overflow menu, so are not included.
     */
    getResponsiveControls(): Array<ResponsiveControl & HTMLElement>;
    /**
     * Returns information on all controls that are currently hidden due to
     * overflow and should therefore be displayed on the overflow menu.
     */
    getOverflowedMenuItems(): OverflowMenuItem[];
    /**
     * Resizes / shows / hides responsive controls based on available space in the
     * toolbar.
     *
     * This should generally only be called through
     * `scheduleLayoutResponsiveControls_`, to avoid redundant calls, which can
     * be fairly heavy weight.
     *
     * TODO(crbug.com/491791965): Investigate performance of this method. It does
     * force a lot of layouts, which may well be a performance issue. There are
     * ways to improve performance, at potentially significant complexity cost.
     */
    private layoutResponsiveControls;
    protected onDragOver_(e: DragEvent): void;
    protected onDrop_(e: DragEvent): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'toolbar-app': ToolbarAppElement;
    }
}
