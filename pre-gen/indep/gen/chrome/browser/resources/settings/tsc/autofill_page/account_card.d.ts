/**
 * @fileoverview
 * 'settings-account-card' component is a card that shows the user's account
 * name and picture with optional controls.
 * It's a slimmed down copy of
 * chrome/browser/resources/settings/people_page/people_page.ts
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import 'chrome://resources/cr_elements/policy/cr_policy_indicator.js';
import '../controls/settings_toggle_button.js';
import '../people_page/sync_account_control.js';
import '../icons.html.js';
import '../settings_shared.css.js';
import type { StoredAccount, SyncStatus } from '/shared/settings/people_page/sync_browser_proxy.js';
import { ChromeSigninAccessPoint } from '/shared/settings/people_page/sync_browser_proxy.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
declare const SettingsAccountCardElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin.js").WebUiListenerMixinInterface);
export declare class SettingsAccountCardElement extends SettingsAccountCardElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Preferences state.
         */
        prefs: {
            type: ObjectConstructor;
            notify: boolean;
        };
        /**
         * This flag is used to conditionally show a set of new sign-in UIs to the
         * profiles that have been migrated to be consistent with the web
         * sign-ins.
         */
        signinAllowed_: {
            type: BooleanConstructor;
            value(): boolean;
        };
        /**
         * The current sync status, supplied by SyncBrowserProxy.
         */
        syncStatus: ObjectConstructor;
        /**
         * Stored accounts to the system, supplied by SyncBrowserProxy.
         */
        storedAccounts: ObjectConstructor;
        primaryAccountName_: StringConstructor;
        primaryAccountEmail_: StringConstructor;
        primaryAccountIconUrl_: StringConstructor;
        /** Expose ChromeSigninAccessPoint enum to HTML bindings. */
        accessPointEnum_: {
            type: ObjectConstructor;
            value: typeof ChromeSigninAccessPoint;
        };
    };
    prefs: Record<string, unknown>;
    private signinAllowed_;
    syncStatus: SyncStatus | null;
    storedAccounts: StoredAccount[] | null;
    private primaryAccountName_;
    private primaryAccountEmail_;
    private primaryAccountIconUrl_;
    private syncBrowserProxy_;
    connectedCallback(): void;
    /**
     * Handler for when the sync state is pushed from the browser.
     */
    private handleSyncStatus_;
    private onAccountClick_;
    private shouldLinkToAccountSettingsPage_;
    private shouldShowSyncAccountControl_;
    private handleStoredAccounts_;
    private getAccountRowSubtitle_;
    /**
     * @return A CSS image-set for multiple scale factors.
     */
    private getIconImageSet_;
    private isSyncing_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-account-card': SettingsAccountCardElement;
    }
}
export {};
