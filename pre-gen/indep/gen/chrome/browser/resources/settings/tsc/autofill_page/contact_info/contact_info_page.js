// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
import { getInstance as getAnnouncerInstance } from '//resources/cr_elements/cr_a11y_announcer/cr_a11y_announcer.js';
import { I18nMixin } from '//resources/cr_elements/i18n_mixin.js';
import { PrefService } from '/shared/settings/prefs2/pref_service.js';
import { PrefServiceObserverMixin } from '/shared/settings/prefs2/pref_service_observer_mixin.js';
import { assert, assertNotReached } from 'chrome://resources/js/assert.js';
import { focusWithoutInk } from 'chrome://resources/js/focus_without_ink.js';
import { OpenWindowProxyImpl } from 'chrome://resources/js/open_window_proxy.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { loadTimeData } from '../../i18n_setup.js';
import { SettingsViewMixin } from '../../settings_page/settings_view_mixin.js';
import { AutofillManagerImpl } from '../autofill_manager_proxy.js';
import { AutofillPolicyDataCategory, computeEffectiveAutofillPref } from '../policy_utils.js';
import { getTemplate } from './contact_info_page.html.js';
/**
 * The enum values for the Autofill.Address.IsEnabled.Change metric.
 * These values are persisted to logs. Entries should not be renumbered and
 * numeric values should never be reused.
 */
// LINT.IfChange(AutofillAddressOptInChange)
export var AutofillAddressOptInChange;
(function (AutofillAddressOptInChange) {
    AutofillAddressOptInChange[AutofillAddressOptInChange["OPT_IN"] = 0] = "OPT_IN";
    AutofillAddressOptInChange[AutofillAddressOptInChange["OPT_OUT"] = 1] = "OPT_OUT";
    // Must be last.
    AutofillAddressOptInChange[AutofillAddressOptInChange["COUNT"] = 2] = "COUNT";
})(AutofillAddressOptInChange || (AutofillAddressOptInChange = {}));
// LINT.ThenChange(/tools/metrics/histograms/metadata/autofill/enums.xml:AutofillAddressOptInChange)
// LINT.IfChange(AutofillGmailOtpFillingPref)
export const AUTOFILL_GMAIL_OTP_FILLING_ENABLED_PREF = 'autofill.gmail_otp_filling.enabled';
// LINT.ThenChange(//components/autofill/core/common/autofill_prefs.h:AutofillGmailOtpFillingPref)
export const AUTOFILL_GMAIL_OTP_OPT_IN_SETTINGS_CHANGE_METRIC = 'Autofill.GmailOtpOptIn.SettingsChange';
const SettingsContactInfoPageElementBase = PrefServiceObserverMixin(SettingsViewMixin(I18nMixin(PolymerElement)));
export class SettingsContactInfoPageElement extends SettingsContactInfoPageElementBase {
    static get is() {
        return 'settings-contact-info-page';
    }
    static get template() {
        return getTemplate();
    }
    static get observers() {
        return [
            `onGmailOtpFillingPrefOrAccountChange_(
          showGmailOtpFillingToggle_,
          accountInfo_,
          gmailOtpFillingEnabledPref_)`,
        ];
    }
    static get properties() {
        return {
            accountInfo_: {
                type: Object,
                value: null,
            },
            /** An array of saved addresses. */
            addresses: Array,
            /** The model for any address related action menus or dialogs. */
            activeAddress: Object,
            showAddressDialog_: Boolean,
            showAddressRemoveConfirmationDialog_: Boolean,
            showEmailRemoveConfirmationDialog_: Boolean,
            showGmailOtpDisclaimerDialog_: Boolean,
            activeEmailIssuer_: String,
            isGoogleProfileAddress: {
                type: Boolean,
                computed: 'computeIsGoogleProfileAddress_(activeAddress)',
            },
            isEmailVerificationProtocolEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean('emailVerificationProtocolEnabled'),
            },
            emailVerificationStatePref_: Object,
            emailVerificationAddresses_: {
                type: Array,
                computed: 'computeEmailVerificationAddresses_(emailVerificationStatePref_)',
            },
            /**
             * Computed field that determines if the Gmail OTP filling toggle should
             * be shown.
             */
            showGmailOtpFillingToggle_: {
                type: Boolean,
                computed: 'computeShowGmailOtpFillingToggle_(accountInfo_)',
            },
            gmailOtpFillingEnabledPref_: Object,
            profileEnabledSyntheticPref_: {
                type: Object,
                value: () => ({
                    key: 'autofill.profile_enabled',
                    type: chrome.settingsPrivate.PrefType.BOOLEAN,
                    value: false,
                }),
            },
            isOtpConsentLoading_: {
                type: Boolean,
                value: false,
            },
            /**
             * A fake preference object that reflects the UI state of the Gmail OTP
             * filling toggle based on both the backend preference and the iUDP/gUDP
             * consent status.
             */
            otpFillingTogglePref_: {
                type: Object,
                value: () => ({
                    type: chrome.settingsPrivate.PrefType.BOOLEAN,
                    value: false,
                }),
            },
        };
    }
    lastCheckedAccountEmail_ = null;
    minOtpConsentSpinnerDurationMs = 200;
    emailSharedMenuModel_ = '';
    /**
     * Computes a synthetic preference that overlays the wildcard
     * `autofill.types_blocked` enterprise policy onto the user's
     * `autofill.profile_enabled` preference.
     */
    updateProfileEnabledSyntheticPref_() {
        this.profileEnabledSyntheticPref_ = computeEffectiveAutofillPref(PrefService.getInstance().getPref('autofill.profile_enabled'), PrefService.getInstance().getPref('autofill.types_blocked'), AutofillPolicyDataCategory.CONTACT_INFO);
    }
    /**
     * Handles user toggle changes on the address autofill toggle. Since the
     * toggle is one-way bound to `profileEnabledSyntheticPref_`, we explicitly
     * update the underlying `autofill.profile_enabled` pref and record metrics,
     * guarding against changes when policy is enforced.
     */
    onAutofillProfileToggleChange_(event) {
        // If the preference is enforced by enterprise policy, do not allow the user
        // to toggle or mutate the underlying preference value.
        if (this.profileEnabledSyntheticPref_?.enforcement ===
            chrome.settingsPrivate.Enforcement.ENFORCED) {
            return;
        }
        const toggle = event.target;
        PrefService.getInstance().setPrefValue('autofill.profile_enabled', toggle.checked);
        const value = toggle.checked ? AutofillAddressOptInChange.OPT_IN :
            AutofillAddressOptInChange.OPT_OUT;
        chrome.metricsPrivate.recordEnumerationValue('Autofill.Address.IsEnabled.Change', value, AutofillAddressOptInChange.COUNT);
    }
    autofillManager_ = AutofillManagerImpl.getInstance();
    setPersonalDataListener_ = null;
    ready() {
        super.ready();
        this.addEventListener('save-address', this.saveAddress_);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addPrefObserver('autofill.profile_enabled', () => this.updateProfileEnabledSyntheticPref_());
        this.addPrefObserver('autofill.types_blocked', () => this.updateProfileEnabledSyntheticPref_());
        this.mirrorPrefs({
            'autofill.email_verification_state': 'emailVerificationStatePref_',
            [AUTOFILL_GMAIL_OTP_FILLING_ENABLED_PREF]: 'gmailOtpFillingEnabledPref_',
        });
        // Create listener functions.
        const setAddressesListener = (addressList) => {
            this.addresses = addressList;
        };
        const setAccountListener = (accountInfo) => {
            this.accountInfo_ = accountInfo || null;
        };
        const setPersonalDataListener = (addressList, _cardList, _ibans, _payOverTimeIssuerList, accountInfo) => {
            this.addresses = addressList;
            this.accountInfo_ = accountInfo || null;
        };
        // Remember the bound reference in order to detach.
        this.setPersonalDataListener_ = setPersonalDataListener;
        // Request initial data.
        this.autofillManager_.getAddressList().then(setAddressesListener);
        this.autofillManager_.getAccountInfo().then(setAccountListener);
        // Listen for changes.
        this.autofillManager_.setPersonalDataManagerListener(setPersonalDataListener);
        // Record that the user opened the address settings.
        chrome.metricsPrivate.recordUserAction('AutofillAddressesViewed');
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.autofillManager_.removePersonalDataManagerListener(this.setPersonalDataListener_);
        this.setPersonalDataListener_ = null;
    }
    /**
     * Returns the text for the remove button in the action menu.
     */
    getMenuRemoveAddressLabel_(address) {
        const isGoogleProfileAddress = this.isAccountHomeAddress_(address) ||
            this.isAccountWorkAddress_(address) ||
            this.isAccountNameEmailAddress_(address);
        return this.i18n(isGoogleProfileAddress ? 'removeFromChrome' : 'removeAddress');
    }
    /**
     * Open the address action menu.
     */
    onAddressMenuClick_(e) {
        const item = e.model.item;
        // Copy item so dialog won't update model on cancel.
        this.activeAddress = Object.assign({}, item);
        const dotsButton = e.target;
        this.$.addressSharedMenu.showAt(dotsButton);
    }
    /**
     * Handles tapping on the "Add address" button.
     */
    onAddAddressClick_(e) {
        e.preventDefault();
        this.activeAddress = { fields: [] };
        this.showAddressDialog_ = true;
    }
    onAddressDialogClose_() {
        this.showAddressDialog_ = false;
    }
    /**
     * Handles tapping on the "Edit" address button.
     */
    onMenuEditAddressClick_(e) {
        e.preventDefault();
        if (this.isAccountHomeAddress_(this.activeAddress)) {
            this.onAccountHomeAddressClick_();
        }
        else if (this.isAccountWorkAddress_(this.activeAddress)) {
            this.onAccountWorkAddressClick_();
        }
        else if (this.isAccountNameEmailAddress_(this.activeAddress)) {
            this.onAccountNameEmailAddressClick_();
        }
        else {
            this.showAddressDialog_ = true;
        }
        this.$.addressSharedMenu.close();
    }
    onAddressRemoveConfirmationDialogClose_() {
        // Check if the dialog was confirmed before closing it.
        const wasDeletionConfirmed = this.shadowRoot
            .querySelector('settings-address-remove-confirmation-dialog').wasConfirmed();
        const isHomeOrWorkAddress = this.isAccountHomeAddress_(this.activeAddress) ||
            this.isAccountWorkAddress_(this.activeAddress);
        const recordType = this.activeAddress?.metadata?.recordType;
        if (wasDeletionConfirmed) {
            // Two corner cases are handled:
            // 1. removing the only address: the focus goes to the Add button
            // 2. removing the last address: the focus goes to the previous address
            // In other cases the focus remaining on the same node (reused in
            // subsequently updated address list), but the next address, works fine.
            if (this.addresses.length === 1) {
                focusWithoutInk(this.$.addAddress);
            }
            else {
                const lastIndex = this.addresses.length - 1;
                if (this.activeAddress.guid === this.addresses[lastIndex].guid) {
                    focusWithoutInk(this.$.addressList.querySelectorAll('.address-menu')[lastIndex - 1]);
                }
            }
            this.autofillManager_.removeAddress(this.activeAddress.guid);
            if (isHomeOrWorkAddress) {
                getAnnouncerInstance().announce(loadTimeData.getString('homeAndWorkAddressRemovedMessage'));
            }
            else if (this.isAccountNameEmailAddress_(this.activeAddress)) {
                getAnnouncerInstance().announce(loadTimeData.getString('nameEmailAddressRemovedMessage'));
            }
            else {
                getAnnouncerInstance().announce(loadTimeData.getString('addressRemovedMessage'));
            }
        }
        if (recordType) {
            this.recordDeletionMetrics_(wasDeletionConfirmed, recordType);
        }
        this.showAddressRemoveConfirmationDialog_ = false;
    }
    /**
     * Handles tapping on the "Remove" address button.
     */
    onMenuRemoveAddressClick_() {
        this.showAddressRemoveConfirmationDialog_ = true;
        this.$.addressSharedMenu.close();
    }
    /**
     * @return Whether the list exists and has items.
     */
    hasSome_(list) {
        return !!(list && list.length);
    }
    /**
     * Listens for the save-address event, and calls the private API.
     */
    saveAddress_(event) {
        this.autofillManager_.saveAddress(event.detail);
    }
    isAccountHomeAddress_(address) {
        return address.metadata?.recordType ===
            chrome.autofillPrivate.AddressRecordType.ACCOUNT_HOME;
    }
    isAccountWorkAddress_(address) {
        return address.metadata?.recordType ===
            chrome.autofillPrivate.AddressRecordType.ACCOUNT_WORK;
    }
    isAccountNameEmailAddress_(address) {
        return address.metadata?.recordType ===
            chrome.autofillPrivate.AddressRecordType.ACCOUNT_NAME_EMAIL;
    }
    computeIsGoogleProfileAddress_(address) {
        if (!address) {
            return false;
        }
        return this.isAccountHomeAddress_(address) ||
            this.isAccountWorkAddress_(address) ||
            this.isAccountNameEmailAddress_(address);
    }
    computeEmailVerificationAddresses_() {
        return Object.keys(this.emailVerificationStatePref_?.value || {});
    }
    onAccountHomeAddressClick_() {
        OpenWindowProxyImpl.getInstance().openUrl(this.i18n('googleAccountHomeAddressUrl'));
    }
    onAccountWorkAddressClick_() {
        OpenWindowProxyImpl.getInstance().openUrl(this.i18n('googleAccountWorkAddressUrl'));
    }
    onAccountNameEmailAddressClick_() {
        OpenWindowProxyImpl.getInstance().openUrl(this.i18n('googleAccountNameEmailAddressEditUrl'));
    }
    onEmailMenuClick_(e) {
        this.emailSharedMenuModel_ = e.model.item;
        const dotsButton = e.target;
        this.$.emailSharedMenu.showAt(dotsButton);
    }
    onMenuRemoveEmailClick_() {
        this.$.emailSharedMenu.close();
        const email = this.emailSharedMenuModel_;
        const pref = PrefService.getInstance()
            .getPref('autofill.email_verification_state');
        const emailData = pref.value[email];
        assert(emailData);
        const issuerSite = emailData.issuer_site;
        assert(issuerSite);
        const hostname = new URL(issuerSite).hostname;
        this.activeEmailIssuer_ = hostname;
        this.showEmailRemoveConfirmationDialog_ = true;
    }
    onEmailRemoveConfirmationDialogClose_(e) {
        const confirmationDialog = e.target;
        assert(confirmationDialog);
        const wasDeletionConfirmed = confirmationDialog.wasConfirmed();
        if (wasDeletionConfirmed) {
            const email = this.emailSharedMenuModel_;
            PrefService.getInstance().deletePrefDictEntry('autofill.email_verification_state', email);
        }
        this.showEmailRemoveConfirmationDialog_ = false;
    }
    getEmailRemoveConfirmationDescription_(issuer) {
        return this.i18n('removeVerifiedEmailPermissionBody', issuer);
    }
    getIssuerSite_(email) {
        const state = PrefService.getInstance()
            .getPref('autofill.email_verification_state')
            .value;
        return state[email]?.issuer_site || '';
    }
    isCloudOffVisible_(address, accountInfo) {
        if (address.metadata?.recordType ===
            chrome.autofillPrivate.AddressRecordType.ACCOUNT ||
            address.metadata?.recordType ===
                chrome.autofillPrivate.AddressRecordType.ACCOUNT_HOME ||
            address.metadata?.recordType ===
                chrome.autofillPrivate.AddressRecordType.ACCOUNT_WORK ||
            address.metadata?.recordType ===
                chrome.autofillPrivate.AddressRecordType.ACCOUNT_NAME_EMAIL) {
            return false;
        }
        if (!accountInfo) {
            return false;
        }
        if (accountInfo.isSyncEnabledForAutofillProfiles) {
            return false;
        }
        // Local profile of a logged-in user with disabled address sync and
        // enabled feature.
        return true;
    }
    /**
     * Determines if an icon is to be shown for the given address.
     */
    shouldShowAddressIcon_(address, accountInfo) {
        return this.getAddressIcon_(address, accountInfo).length > 0;
    }
    /**
     * Determines which icon to show for a given address.
     *
     * @return The icon string or an empty string.
     */
    getAddressIcon_(address, accountInfo) {
        if (this.isAccountHomeAddress_(address)) {
            return 'settings20:home';
        }
        if (this.isAccountWorkAddress_(address)) {
            return 'settings20:work';
        }
        if (this.isCloudOffVisible_(address, accountInfo)) {
            return 'cr20:cloud-off';
        }
        return '';
    }
    /**
     * Determines which a11y string to announce for a given address.
     *
     * @return The a11y string or an empty string.
     */
    getA11yLabelForIcon_(address, accountInfo) {
        if (this.isCloudOffVisible_(address, accountInfo)) {
            return this.i18n('localAddressIconA11yLabel');
        }
        if (this.isAccountHomeAddress_(address)) {
            return this.i18n('homeAddressIconA11yLabel');
        }
        if (this.isAccountWorkAddress_(address)) {
            return this.i18n('workAddressIconA11yLabel');
        }
        return '';
    }
    /**
     * @returns the title for the More Actions button corresponding to the address
     */
    moreActionsTitle_(address) {
        const label = address.metadata?.summaryLabel;
        const subLabel = address.metadata?.summarySublabel;
        const fullLabel = label + (subLabel ?? '');
        let messageKey;
        if (this.isAccountHomeAddress_(address)) {
            messageKey = 'moreOptionsForHomeAddress';
        }
        else if (this.isAccountWorkAddress_(address)) {
            messageKey = 'moreOptionsForWorkAddress';
        }
        else {
            messageKey = 'moreActionsForAddress';
        }
        return this.i18n(messageKey, fullLabel);
    }
    computeShowGmailOtpFillingToggle_(accountInfo) {
        return !!accountInfo &&
            loadTimeData.getBoolean('autofillGmailOtpFillingEnabled');
    }
    getRecordTypeSuffix_(recordType) {
        switch (recordType) {
            case chrome.autofillPrivate.AddressRecordType.LOCAL_OR_SYNCABLE:
                return 'LocalOrSyncable';
            case chrome.autofillPrivate.AddressRecordType.ACCOUNT:
                return 'Account';
            case chrome.autofillPrivate.AddressRecordType.ACCOUNT_HOME:
                return 'AccountHome';
            case chrome.autofillPrivate.AddressRecordType.ACCOUNT_WORK:
                return 'AccountWork';
            case chrome.autofillPrivate.AddressRecordType.ACCOUNT_NAME_EMAIL:
                return 'AccountNameEmail';
            default:
                assertNotReached();
        }
    }
    recordDeletionMetrics_(wasDeletionConfirmed, recordType) {
        const suffix = this.getRecordTypeSuffix_(recordType);
        chrome.metricsPrivate.recordBoolean('Autofill.ProfileDeleted.Settings.Total', wasDeletionConfirmed);
        chrome.metricsPrivate.recordBoolean('Autofill.ProfileDeleted.Any.Total', wasDeletionConfirmed);
        chrome.metricsPrivate.recordBoolean('Autofill.ProfileDeleted.Settings.' + suffix, wasDeletionConfirmed);
        chrome.metricsPrivate.recordBoolean('Autofill.ProfileDeleted.Any.' + suffix, wasDeletionConfirmed);
    }
    fetchConsentWithMinDuration_() {
        const delayPromise = new Promise(resolve => setTimeout(resolve, this.minOtpConsentSpinnerDurationMs));
        // Wait at least minOtpConsentSpinnerDurationMs before resolving to prevent
        // UI flickering.
        return this.autofillManager_.fetchUserDataProcessingConsent().finally(() => delayPromise);
    }
    fetchConsentWithMinDurationForTesting() {
        return this.fetchConsentWithMinDuration_();
    }
    getGmailOtpFillingDescription_() {
        return this.i18nAdvanced('enableGmailOtpFillingDescription', {
            attrs: [
                'aria-description',
                'aria-hidden',
                'aria-label',
                'aria-labelledby',
                'tabindex',
            ],
        });
    }
    shouldShowOtpFillingLoadingRow_() {
        return this.showGmailOtpFillingToggle_ && this.isOtpConsentLoading_;
    }
    shouldShowOtpFillingToggle_() {
        return this.showGmailOtpFillingToggle_ && !this.isOtpConsentLoading_;
    }
    setOtpFillingToggleChecked_(checked) {
        this.set('otpFillingTogglePref_.value', checked);
        this.$.autofillOtpFillingToggle.checked = checked;
    }
    resetOtpFillingState_() {
        this.lastCheckedAccountEmail_ = null;
        this.isOtpConsentLoading_ = false;
        this.setOtpFillingToggleChecked_(false);
    }
    enableOtpFilling_(email) {
        if (email) {
            this.lastCheckedAccountEmail_ = email;
        }
        this.setOtpFillingToggleChecked_(true);
        PrefService.getInstance().setPrefValue(AUTOFILL_GMAIL_OTP_FILLING_ENABLED_PREF, true);
        chrome.metricsPrivate.recordBoolean(AUTOFILL_GMAIL_OTP_OPT_IN_SETTINGS_CHANGE_METRIC, true);
    }
    focusOtpFillingToggle_() {
        if (!this.isConnected) {
            return;
        }
        focusWithoutInk(this.$.autofillOtpFillingToggle);
    }
    onGmailOtpConsentBackendNetworkError_() {
        // If fetching consent fails (e.g., due to a network error or API
        // timeout), fall back to enabling the UI toggle to avoid blocking users and
        // rely on backend enforcement when autofill is performed.
        this.setOtpFillingToggleChecked_(true);
    }
    async onGmailOtpFillingPrefOrAccountChange_() {
        const currentEmail = (this.showGmailOtpFillingToggle_ && this.accountInfo_) ?
            this.accountInfo_.email :
            null;
        if (!this.showGmailOtpFillingToggle_ || !currentEmail) {
            this.resetOtpFillingState_();
            return;
        }
        if (!this.gmailOtpFillingEnabledPref_) {
            return;
        }
        if (!this.gmailOtpFillingEnabledPref_.value) {
            this.resetOtpFillingState_();
            return;
        }
        // Guard against re-running the initial consent check and showing an
        // unexpected spinner on subsequent pref changes or user interactions during
        // the session if the account has not changed.
        if (currentEmail === this.lastCheckedAccountEmail_) {
            this.setOtpFillingToggleChecked_(this.gmailOtpFillingEnabledPref_.value);
            return;
        }
        this.lastCheckedAccountEmail_ = currentEmail;
        this.isOtpConsentLoading_ = true;
        const fetchEmail = currentEmail;
        try {
            const consent = await this.fetchConsentWithMinDuration_();
            // Check whether the page is still connected to the DOM and the
            // account has not changed or state reset in case the user navigated
            // away, switched accounts, or turned off the pref during the RPC.
            if (!this.isConnected || this.lastCheckedAccountEmail_ !== fetchEmail) {
                return;
            }
            if (consent?.commsApps ===
                chrome.autofillPrivate.UserDataProcessingConsentState.ENABLED &&
                consent?.googleApps ===
                    chrome.autofillPrivate.UserDataProcessingConsentState.ENABLED) {
                this.setOtpFillingToggleChecked_(true);
            }
            else {
                // We explicitly don't align the preference value with the
                // current UI state, since an `UNKNOWN` value could be a temporary
                // result from the service. Furthermore, the user could re-consent
                // and then the original preference value is preserved in this way.
                this.setOtpFillingToggleChecked_(false);
            }
        }
        catch {
            // Check whether the page is still connected to the DOM and the
            // account has not changed or state reset in case the user navigated
            // away, switched accounts, or turned off the pref during the RPC.
            if (!this.isConnected || this.lastCheckedAccountEmail_ !== fetchEmail) {
                return;
            }
            this.onGmailOtpConsentBackendNetworkError_();
        }
        finally {
            if (this.isConnected && this.lastCheckedAccountEmail_ === fetchEmail) {
                this.isOtpConsentLoading_ = false;
            }
        }
    }
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
    onGmailOtpFillingLinkClick_(e) {
        if (e && !(e instanceof CustomEvent)) {
            const target = e.target;
            if (target.tagName !== 'A') {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        }
        OpenWindowProxyImpl.getInstance().openUrl(loadTimeData.getString('gmailOtpFillingLearnMoreUrl'));
    }
    async onAutofillOtpFillingToggleChanged_(event) {
        const toggle = event.target;
        if (!toggle.checked) {
            this.resetOtpFillingState_();
            PrefService.getInstance().setPrefValue(AUTOFILL_GMAIL_OTP_FILLING_ENABLED_PREF, false);
            chrome.metricsPrivate.recordBoolean(AUTOFILL_GMAIL_OTP_OPT_IN_SETTINGS_CHANGE_METRIC, false);
            return;
        }
        this.isOtpConsentLoading_ = true;
        const currentEmail = this.accountInfo_?.email;
        try {
            const consent = await this.fetchConsentWithMinDuration_();
            if (!this.isConnected || this.accountInfo_?.email !== currentEmail) {
                return;
            }
            if (consent?.commsApps ===
                chrome.autofillPrivate.UserDataProcessingConsentState.ENABLED &&
                consent?.googleApps ===
                    chrome.autofillPrivate.UserDataProcessingConsentState.ENABLED) {
                this.enableOtpFilling_(currentEmail);
            }
            else {
                this.setOtpFillingToggleChecked_(false);
                this.showGmailOtpDisclaimerDialog_ = true;
            }
        }
        catch {
            if (!this.isConnected || this.accountInfo_?.email !== currentEmail) {
                return;
            }
            this.onGmailOtpConsentBackendNetworkError_();
        }
        finally {
            this.isOtpConsentLoading_ = false;
            // Restore focus to the toggle once it is unhidden if no disclaimer
            // dialog was displayed.
            if (this.isConnected && this.accountInfo_?.email === currentEmail &&
                !this.showGmailOtpDisclaimerDialog_) {
                this.focusOtpFillingToggle_();
            }
        }
    }
    onGmailOtpDisclaimerDialogClose_() {
        this.showGmailOtpDisclaimerDialog_ = false;
        this.setOtpFillingToggleChecked_(false);
        this.focusOtpFillingToggle_();
    }
    // SettingsViewMixin implementation.
    focusBackButton() {
        this.shadowRoot.querySelector('settings-subpage').focusBackButton();
    }
}
customElements.define(SettingsContactInfoPageElement.is, SettingsContactInfoPageElement);
