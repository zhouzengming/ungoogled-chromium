/**
 * @fileoverview 'settings-contact-info-page' is the page containing saved
 * addresses for use in autofill and payments APIs.
 */
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_spinner_style.css.js';
import 'chrome://resources/cr_elements/cr_toggle/cr_toggle.js';
import '/shared/settings/controls/extension_controlled_indicator.js';
import '../../controls/settings_toggle_button.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../../simple_confirmation_dialog.js';
import '../../site_favicon.js';
import './address_edit_dialog.js';
import './address_remove_confirmation_dialog.js';
import './gmail_otp_disclaimer_dialog.js';
import '../autofill_shared.css.js';
import type { CrActionMenuElement } from 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import type { CrButtonElement } from 'chrome://resources/cr_elements/cr_button/cr_button.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../../controls/settings_toggle_button.js';
/**
 * The enum values for the Autofill.Address.IsEnabled.Change metric.
 * These values are persisted to logs. Entries should not be renumbered and
 * numeric values should never be reused.
 */
export declare enum AutofillAddressOptInChange {
    OPT_IN = 0,
    OPT_OUT = 1,
    COUNT = 2
}
export declare const AUTOFILL_GMAIL_OTP_FILLING_ENABLED_PREF = "autofill.gmail_otp_filling.enabled";
export declare const AUTOFILL_GMAIL_OTP_OPT_IN_SETTINGS_CHANGE_METRIC = "Autofill.GmailOtpOptIn.SettingsChange";
declare global {
    interface HTMLElementEventMap {
        'save-address': CustomEvent<chrome.autofillPrivate.AddressEntry>;
    }
}
export interface SettingsContactInfoPageElement {
    $: {
        addAddress: CrButtonElement;
        addressList: HTMLElement;
        addressSharedMenu: CrActionMenuElement;
        autofillOtpFillingToggle: SettingsToggleButtonElement;
        autofillProfileToggle: SettingsToggleButtonElement;
        emailSharedMenu: CrActionMenuElement;
        menuEditAddress: HTMLElement;
        menuRemoveAddress: HTMLElement;
        menuRemoveEmail: HTMLElement;
        noAddressesLabel: HTMLElement;
        otpFillingLoadingRow: HTMLElement;
        otpFillingLoadingSpinner: HTMLElement;
        otpFillingLoadingSubLabelWithLink: HTMLElement;
    };
}
declare const SettingsContactInfoPageElementBase: typeof PolymerElement & (new (...args: any[]) => import("//resources/cr_elements/i18n_mixin.js").I18nMixinInterface) & (new (...args: any[]) => import("../../settings_page/settings_view_mixin.js").SettingsViewMixinInterface) & (new (...args: any[]) => import("/shared/settings/prefs2/pref_service_observer_mixin.js").PrefServiceObserverMixinInterface);
export declare class SettingsContactInfoPageElement extends SettingsContactInfoPageElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get observers(): string[];
    static get properties(): {
        accountInfo_: {
            type: ObjectConstructor;
            value: null;
        };
        /** An array of saved addresses. */
        addresses: ArrayConstructor;
        /** The model for any address related action menus or dialogs. */
        activeAddress: ObjectConstructor;
        showAddressDialog_: BooleanConstructor;
        showAddressRemoveConfirmationDialog_: BooleanConstructor;
        showEmailRemoveConfirmationDialog_: BooleanConstructor;
        showGmailOtpDisclaimerDialog_: BooleanConstructor;
        activeEmailIssuer_: StringConstructor;
        isGoogleProfileAddress: {
            type: BooleanConstructor;
            computed: string;
        };
        isEmailVerificationProtocolEnabled_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        emailVerificationStatePref_: ObjectConstructor;
        emailVerificationAddresses_: {
            type: ArrayConstructor;
            computed: string;
        };
        /**
         * Computed field that determines if the Gmail OTP filling toggle should
         * be shown.
         */
        showGmailOtpFillingToggle_: {
            type: BooleanConstructor;
            computed: string;
        };
        gmailOtpFillingEnabledPref_: ObjectConstructor;
        profileEnabledSyntheticPref_: {
            type: ObjectConstructor;
            value: () => {
                key: string;
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
        isOtpConsentLoading_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
         * A fake preference object that reflects the UI state of the Gmail OTP
         * filling toggle based on both the backend preference and the iUDP/gUDP
         * consent status.
         */
        otpFillingTogglePref_: {
            type: ObjectConstructor;
            value: () => {
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
    };
    addresses: chrome.autofillPrivate.AddressEntry[];
    activeAddress: chrome.autofillPrivate.AddressEntry | null;
    private accountInfo_;
    private showAddressDialog_;
    private showAddressRemoveConfirmationDialog_;
    private showEmailRemoveConfirmationDialog_;
    private showGmailOtpDisclaimerDialog_;
    private activeEmailIssuer_;
    private isGoogleProfileAddress;
    private isEmailVerificationProtocolEnabled_;
    private emailVerificationStatePref_;
    private emailVerificationAddresses_;
    private showGmailOtpFillingToggle_;
    private gmailOtpFillingEnabledPref_;
    private profileEnabledSyntheticPref_;
    private isOtpConsentLoading_;
    private otpFillingTogglePref_;
    private lastCheckedAccountEmail_;
    minOtpConsentSpinnerDurationMs: number;
    private emailSharedMenuModel_;
    /**
     * Computes a synthetic preference that overlays the wildcard
     * `autofill.types_blocked` enterprise policy onto the user's
     * `autofill.profile_enabled` preference.
     */
    private updateProfileEnabledSyntheticPref_;
    /**
     * Handles user toggle changes on the address autofill toggle. Since the
     * toggle is one-way bound to `profileEnabledSyntheticPref_`, we explicitly
     * update the underlying `autofill.profile_enabled` pref and record metrics,
     * guarding against changes when policy is enforced.
     */
    private onAutofillProfileToggleChange_;
    private autofillManager_;
    private setPersonalDataListener_;
    ready(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Returns the text for the remove button in the action menu.
     */
    private getMenuRemoveAddressLabel_;
    /**
     * Open the address action menu.
     */
    private onAddressMenuClick_;
    /**
     * Handles tapping on the "Add address" button.
     */
    private onAddAddressClick_;
    private onAddressDialogClose_;
    /**
     * Handles tapping on the "Edit" address button.
     */
    private onMenuEditAddressClick_;
    private onAddressRemoveConfirmationDialogClose_;
    /**
     * Handles tapping on the "Remove" address button.
     */
    private onMenuRemoveAddressClick_;
    /**
     * @return Whether the list exists and has items.
     */
    private hasSome_;
    /**
     * Listens for the save-address event, and calls the private API.
     */
    private saveAddress_;
    private isAccountHomeAddress_;
    private isAccountWorkAddress_;
    private isAccountNameEmailAddress_;
    private computeIsGoogleProfileAddress_;
    private computeEmailVerificationAddresses_;
    private onAccountHomeAddressClick_;
    private onAccountWorkAddressClick_;
    private onAccountNameEmailAddressClick_;
    private onEmailMenuClick_;
    private onMenuRemoveEmailClick_;
    private onEmailRemoveConfirmationDialogClose_;
    private getEmailRemoveConfirmationDescription_;
    private getIssuerSite_;
    private isCloudOffVisible_;
    /**
     * Determines if an icon is to be shown for the given address.
     */
    private shouldShowAddressIcon_;
    /**
     * Determines which icon to show for a given address.
     *
     * @return The icon string or an empty string.
     */
    private getAddressIcon_;
    /**
     * Determines which a11y string to announce for a given address.
     *
     * @return The a11y string or an empty string.
     */
    private getA11yLabelForIcon_;
    /**
     * @returns the title for the More Actions button corresponding to the address
     */
    private moreActionsTitle_;
    private computeShowGmailOtpFillingToggle_;
    private getRecordTypeSuffix_;
    private recordDeletionMetrics_;
    private fetchConsentWithMinDuration_;
    fetchConsentWithMinDurationForTesting(): Promise<chrome.autofillPrivate.UserDataProcessingConsentStates>;
    private getGmailOtpFillingDescription_;
    private shouldShowOtpFillingLoadingRow_;
    private shouldShowOtpFillingToggle_;
    private setOtpFillingToggleChecked_;
    private resetOtpFillingState_;
    private enableOtpFilling_;
    private focusOtpFillingToggle_;
    private onGmailOtpConsentBackendNetworkError_;
    private onGmailOtpFillingPrefOrAccountChange_;
    /**
     * Handles click events for the "Learn more" link inside the description.
     * This implements standard WebUI event delegation and navigation handling:
     * 1. Filtering plain text clicks: Because the HTML with the anchor tag is
     *    injected dynamically and the listener is attached to the parent
     *    container, `target.tagName !== 'A'` ensures clicks on surrounding text
     *    are ignored.
     * 2. Allowing synthetic events: CustomEvents dispatched programmatically
     *    (e.g., keyboard activation on custom elements) bypass the tagName check.
     * 3. Preventing native navigation: `preventDefault()` prevents navigating the
     *    privileged chrome:// settings tab. URL opening is delegated to
     *    `OpenWindowProxyImpl`.
     * 4. Stopping bubbling: `stopPropagation()` prevents parent rows or toggles
     *    from triggering when the link is clicked.
     */
    private onGmailOtpFillingLinkClick_;
    private onAutofillOtpFillingToggleChanged_;
    private onGmailOtpDisclaimerDialogClose_;
    focusBackButton(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-contact-info-page': SettingsContactInfoPageElement;
    }
}
export {};
