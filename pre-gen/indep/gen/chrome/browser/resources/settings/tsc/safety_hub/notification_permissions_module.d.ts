/**
 * @fileoverview
 * 'settings-safety-hub-notification-permissions-module' is the module in Safety
 * Hub page that show the origins sending a lot of notifications.
 */
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_toast/cr_toast.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_tooltip/cr_tooltip.js';
import '../i18n_setup.js';
import '../icons.html.js';
import './safety_hub_module.js';
import type { CrActionMenuElement } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import type { CrToastElement } from 'chrome://resources/cr_elements/cr_toast/cr_toast.js';
import type { PropertyValues } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import type { Route } from '../router.js';
import type { NotificationPermission } from '../safety_hub/safety_hub_browser_proxy.js';
import type { SettingsSafetyHubModuleElement, SiteInfo, SiteInfoWithTarget } from './safety_hub_module.js';
export interface SettingsSafetyHubNotificationPermissionsModuleElement {
    $: {
        actionMenu: CrActionMenuElement;
        blockAllButton: HTMLElement;
        bulkUndoButton: HTMLElement;
        headerActionMenu: CrActionMenuElement;
        ignore: HTMLElement;
        module: SettingsSafetyHubModuleElement;
        reset: HTMLElement;
        toastUndoButton: HTMLElement;
        undoNotification: HTMLElement;
        undoToast: CrToastElement;
    };
}
interface NotificationPermissionsDisplay extends NotificationPermission, SiteInfo {
}
declare const SettingsSafetyHubNotificationPermissionsModuleElementBase: typeof CrLitElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface) & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin_lit.js").WebUiListenerMixinLitInterface) & (new (...args: any[]) => import("../tooltip_mixin_lit.js").TooltipMixinLitInterface);
export declare class SettingsSafetyHubNotificationPermissionsModuleElement extends SettingsSafetyHubNotificationPermissionsModuleElementBase {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        headerString_: {
            type: StringConstructor;
        };
        subheaderString_: {
            type: StringConstructor;
        };
        toastText_: {
            type: StringConstructor;
        };
        lastUserAction_: {
            type: StringConstructor;
        };
        lastOrigins_: {
            type: ArrayConstructor;
        };
        sites_: {
            type: ArrayConstructor;
        };
        shouldShowCompletionInfo_: {
            type: BooleanConstructor;
        };
    };
    protected accessor headerString_: string;
    protected accessor subheaderString_: string;
    protected accessor toastText_: string | null;
    protected accessor sites_: NotificationPermissionsDisplay[] | null;
    protected accessor shouldShowCompletionInfo_: boolean;
    protected accessor lastOrigins_: string[];
    private renderedOrigins_;
    private accessor lastUserAction_;
    private eventTracker_;
    private browserProxy_;
    private metricsBrowserProxy_;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValues<this>): void;
    updated(changedProperties: PropertyValues<this>): void;
    currentRouteChanged(currentRoute: Route): void;
    private onNotificationPermissionListChanged_;
    private setHeaderToCompletionState_;
    private onSitesChanged_;
    /** Clears all the changes made by a previous action. */
    private resetValues_;
    /** Sets all the values needed for an action. */
    private setValues_;
    protected onShModuleItemButtonClick_(e: CustomEvent<NotificationPermission>): void;
    protected onShModuleMoreActionButtonClick_(e: CustomEvent<SiteInfoWithTarget>): void;
    protected onIgnoreClick_(e: Event): void;
    protected onResetClick_(e: Event): void;
    protected onBlockAllClick_(e: Event): void;
    protected onUndoClick_(e: Event): void;
    protected onHeaderMoreActionClick_(e: Event): void;
    protected onGoToSettingsClick_(e: Event): void;
    private updateUndoNotificationText_;
    private showUndoToast_;
    private undoLastAction_;
    private onKeyDown_;
    /** Show info that review is completed when there are no permissions left. */
    private computeShouldShowCompletionInfo_;
    protected getIgnoreAriaLabelForOrigins_(): string;
    protected getResetAriaLabelForOrigins_(): string;
    protected onBulkUndoButtonFocus_(e: Event): void;
    protected onBulkUndoButtonMouseenter_(e: Event): void;
    private showUndoTooltip_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-safety-hub-notification-permissions-module': SettingsSafetyHubNotificationPermissionsModuleElement;
    }
}
export {};
