/**
 * @fileoverview
 * 'settings-privacy-page' is the settings page containing privacy and
 * security settings.
 */
import '/shared/settings/prefs/prefs.js';
import 'chrome://resources/cr_elements/icons.html.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_toast/cr_toast.js';
import '../icons.html.js';
import '../privacy_icons.html.js';
import '../settings_page/settings_section.js';
import '../settings_shared.css.js';
import './privacy_guide/privacy_guide_dialog.js';
import type { CrLinkRowElement } from 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { Route } from '../router.js';
export interface SettingsPrivacyPageElement {
    $: {
        clearBrowsingData: CrLinkRowElement;
        siteSettingsLinkRow: CrLinkRowElement;
        securityLinkRow: CrLinkRowElement;
    };
}
declare const SettingsPrivacyPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/prefs/prefs_mixin.js").PrefsMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("../router.js").RouteObserverMixinInterface) & (new (...args: any[]) => import("../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("./privacy_guide/privacy_guide_availability_mixin.js").PrivacyGuideAvailabilityMixinInterface);
export declare class SettingsPrivacyPageElement extends SettingsPrivacyPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        showClearBrowsingDataDialog_: BooleanConstructor;
        showPrivacyGuideDialog_: BooleanConstructor;
        dbdDeletionConfirmationToastLabel_: {
            type: StringConstructor;
            value: string;
        };
        shouldShowDbdDeletionConfirmationToast_: {
            type: BooleanConstructor;
            value: boolean;
        };
        showUniversalOptOutSettings_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        thirdPartyCookiesLabel_: {
            type: StringConstructor;
            computed: string;
        };
        thirdPartyCookiesSublabel_: {
            type: StringConstructor;
            computed: string;
        };
    };
    private showClearBrowsingDataDialog_;
    private showPrivacyGuideDialog_;
    private dbdDeletionConfirmationToastLabel_;
    private shouldShowDbdDeletionConfirmationToast_;
    private showUniversalOptOutSettings_;
    private thirdPartyCookiesLabel_;
    private thirdPartyCookiesSublabel_;
    private metricsBrowserProxy_;
    currentRouteChanged(newRoute: Route, oldRoute?: Route): void;
    private onClearBrowsingDataClick_;
    private onCookiesClick_;
    private onCbdDialogClosed_;
    private onPrivacyGuideDialogClosed_;
    private onSiteSettingsLinkRowClick_;
    private onSecurityPageClick_;
    private onPrivacyGuideClick_;
    private interactedWithPage_;
    private computeThirdPartyCookiesLabel_;
    private computeThirdPartyCookiesSublabel_;
    private onBrowsingDataDeleted_;
    getFocusConfig(): Map<any, any>;
    getAssociatedControlFor(childViewId: string): HTMLElement;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-privacy-page': SettingsPrivacyPageElement;
    }
}
export {};
