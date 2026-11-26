/**
 * @fileoverview
 * 'settings-notifications-subpage' contains the settings for notifications
 * under Site Settings.
 */
import '/shared/settings/prefs/prefs.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_hidden_style.css.js';
import 'chrome://resources/cr_elements/cr_radio_button/cr_radio_button.js';
import 'chrome://resources/cr_elements/cr_radio_group/cr_radio_group.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import './category_setting_exceptions.js';
import './settings_category_default_radio_group.js';
import './site_settings_shared.css.js';
import '../controls/collapse_radio_button.js';
import '../controls/settings_radio_group.js';
import '../privacy_icons.html.js';
import '../safety_hub/safety_hub_module.js';
import '../settings_page/settings_subpage.js';
import '../settings_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { Route } from '../router.js';
import { ContentSetting, ContentSettingsTypes, SettingsState } from './constants.js';
declare const NotificationsPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface);
export declare class NotificationsPageElement extends NotificationsPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        searchTerm: {
            type: StringConstructor;
            notify: boolean;
            value: string;
        };
        isGuest_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /** Expose the Permissions SettingsState enum to HTML bindings. */
        settingsStateEnum_: {
            type: ObjectConstructor;
            value: typeof SettingsState;
        };
        /** Expose ContentSettingsTypes enum to HTML bindings. */
        contentSettingsTypesEnum_: {
            type: ObjectConstructor;
            value: typeof ContentSettingsTypes;
        };
        showNotificationPermissionsReview_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /** Expose ContentSetting enum to HTML bindings. */
        contentSettingEnum_: {
            type: ObjectConstructor;
            value: typeof ContentSetting;
        };
        shouldShowSafetyHub_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
         * Glue property to connect the category default setting value to the
         * visibility of the additional CPSS options.
         */
        notificationSettingValue_: StringConstructor;
        notificationPermissionsReviewHeader_: StringConstructor;
        notificationPermissionsReviewSubheader_: StringConstructor;
    };
    searchTerm: string;
    private isGuest_;
    private shouldShowSafetyHub_;
    private showNotificationPermissionsReview_;
    private notificationSettingValue_;
    private notificationPermissionsReviewHeader_;
    private notificationPermissionsReviewSubheader_;
    private safetyHubBrowserProxy_;
    private metricsBrowserProxy_;
    ready(): void;
    currentRouteChanged(newRoute: Route, oldRoute?: Route): void;
    private onReviewNotificationPermissionListChanged_;
    private isEqualToAsk_;
    private onSafetyHubButtonClick_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-notifications-page': NotificationsPageElement;
    }
}
export {};
