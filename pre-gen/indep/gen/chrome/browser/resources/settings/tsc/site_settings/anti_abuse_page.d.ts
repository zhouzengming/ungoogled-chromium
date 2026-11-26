/**
 * @fileoverview
 * 'settings-anti-abuse-page' is the settings page containing anti-abuse
 * settings.
 */
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import '../controls/settings_toggle_button.js';
import '../icons.html.js';
import '../settings_page/settings_subpage.js';
import '../settings_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../controls/settings_toggle_button.js';
export interface SettingsAntiAbusePageElement {
    $: {
        toggleButton: SettingsToggleButtonElement;
    };
}
declare const AntiAbuseElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface) & (new (...args: any[]) => import("../site_settings/site_settings_mixin.js").SiteSettingsMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface);
export declare class SettingsAntiAbusePageElement extends AntiAbuseElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Preference object used to keep track of the selected content setting
         * option.
         */
        pref_: {
            type: ObjectConstructor;
            value(): {
                type: chrome.settingsPrivate.PrefType;
            };
        };
        toggleDisabled_: BooleanConstructor;
    };
    static get observers(): string[];
    private pref_;
    private toggleDisabled_;
    ready(): void;
    private onCategoryChanged_;
    private onEnforcementChanged_;
    private updateToggleValue_;
    /**
     * A handler for changing the default permission value for a the anti-abuse
     * content type.
     */
    private onToggleChange_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-anti-abuse-page': SettingsAntiAbusePageElement;
    }
}
export {};
