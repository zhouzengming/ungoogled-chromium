/**
 * @fileoverview
 * 'settings-cookies-page' is the settings page containing cookies
 * settings.
 */
import '/shared/settings/prefs/prefs.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '../controls/collapse_radio_button.js';
import '../controls/controlled_radio_button.js';
import '../controls/settings_radio_group.js';
import '../controls/settings_toggle_button.js';
import '../icons.html.js';
import '../privacy_icons.html.js';
import '../settings_page/settings_subpage.js';
import '../settings_shared.css.js';
import '../site_settings/site_list.js';
import './do_not_track_toggle.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { Route } from '../router.js';
import { ContentSetting, ContentSettingsTypes } from '../site_settings/constants.js';
import { ThirdPartyCookieBlockingSetting } from '../site_settings/site_settings_browser_proxy.js';
declare const SettingsCookiesPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class SettingsCookiesPageElement extends SettingsCookiesPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Current search term.
         */
        searchTerm: {
            type: StringConstructor;
            notify: boolean;
            value: string;
        };
        thirdPartyCookieBlockingSettingEnum_: {
            type: ObjectConstructor;
            value: typeof ThirdPartyCookieBlockingSetting;
        };
        contentSettingEnum_: {
            type: ObjectConstructor;
            value: typeof ContentSetting;
        };
        cookiesContentSettingType_: {
            type: StringConstructor;
            value: ContentSettingsTypes;
        };
        showUniversalOptOutSettings_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        pageTitle_: {
            type: StringConstructor;
            computed: string;
        };
        isSettingsRefresh2026_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
    };
    searchTerm: string;
    private pageTitle_;
    private cookiesContentSettingType_;
    private showUniversalOptOutSettings_;
    private isSettingsRefresh2026_;
    private metricsBrowserProxy_;
    private onSiteDataClick_;
    private onThirdPartyCookieBlockingSettingChanged_;
    private onUniversalOptOutToggleChange_;
    private computePageTitle_;
    currentRouteChanged(currentRoute: Route): void;
    getFocusConfig(): Map<string, string>;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-cookies-page': SettingsCookiesPageElement;
    }
}
export {};
