// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview 'settings-travel-page', is a subpage of the "Your saved info"
 * section. It manages the user's autofill data for traveling. Users can add,
 * edit, or delete their saved document details, as well as opt out of the
 * autofill functionality entirely.
 */
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '/shared/settings/controls/extension_controlled_indicator.js';
import '/shared/settings/prefs/prefs.js';
import '../../controls/settings_toggle_button.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../autofill_ai_entries_list.js';
import '../autofill_shared.css.js';
import { PrefsMixin } from '/shared/settings/prefs/prefs_mixin.js';
import { CrSettingsPrefs } from '/shared/settings/prefs/prefs_types.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { AiEnterpriseFeaturePrefName } from '../../ai_page/constants.js';
import { EntityTypeName } from '../../autofill_ai_enums.mojom-webui.js';
import { loadTimeData } from '../../i18n_setup.js';
import { MetricsBrowserProxyImpl, SuggestionsFromGeminiEntryPoint } from '../../metrics_browser_proxy.js';
import { routes } from '../../route.js';
import { Router } from '../../router.js';
import { SettingsViewMixin } from '../../settings_page/settings_view_mixin.js';
import { EntityDataManagerProxyImpl } from '../entity_data_manager_proxy.js';
import { AutofillPolicyDataCategory, checkAutofillPoliciesAndModifyPrefIfNecessary } from '../policy_utils.js';
import { getTemplate } from './travel_page.html.js';
const SettingsTravelPageElementBase = SettingsViewMixin(PrefsMixin(PolymerElement));
export class SettingsTravelPageElement extends SettingsTravelPageElementBase {
    static get is() {
        return 'settings-travel-page';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            /**
             Controls whether the user can use Autofill AI (in this context travel
             info filling). As an example, this can be false if the extensions API
             disables the feature.
            */
            canEnableOrDisableAutofillAi_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('canEnableOrDisableAutofillAi');
                },
            },
            /**
               Fake preference used by `this.$.optInToggle`. Shows value of
               `autofill.autofill_ai.travel_entities_enabled` preference if toggle
               is enabled (clickable). If toggle is disabled then the value is
               overridden to be shown as false even if the preference is true.
             */
            travelOptedIn_: {
                type: Object,
                computed: `computeTravelOptedIn_(
              prefs.autofill.autofill_ai.travel_entities_enabled.*,
              prefs.autofill.profile_enabled.value,
              prefs.${AiEnterpriseFeaturePrefName.AUTOFILL_AI}.*,
              prefsInitialized_, prefs.autofill.types_blocked.*)`,
            },
            /**
              If true, Autofill AI does not depend on whether Autofill for addresses
              is enabled.
            */
            autofillSettingsEnterprisePolicyEnabled_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('AutofillSettingsEnterprisePolicyEnabled');
                },
            },
            prefsInitialized_: {
                type: Boolean,
                value: false,
            },
            showSuggestionsFromGeminiSettings_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('showSuggestionsFromGeminiSettings');
                },
            },
        };
    }
    metricsBrowserProxy_ = MetricsBrowserProxyImpl.getInstance();
    entityDataManager_ = EntityDataManagerProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        CrSettingsPrefs.initialized.then(() => {
            this.prefsInitialized_ = true;
        });
        this.entityDataManager_.preloadDetailsForUpsertPass();
    }
    optInToggleDisabled_() {
        if (!this.prefsInitialized_) {
            return true;
        }
        const addressAutofillOptInStatus = this.getPref('autofill.profile_enabled').value;
        const ignoreAddressAutofill = this.autofillSettingsEnterprisePolicyEnabled_;
        return !this.canEnableOrDisableAutofillAi_ ||
            (!ignoreAddressAutofill && !addressAutofillOptInStatus);
    }
    computeTravelOptedIn_() {
        const fakePref = {
            key: 'fake',
            type: chrome.settingsPrivate.PrefType.BOOLEAN,
            value: false,
        };
        if (!this.prefsInitialized_) {
            return fakePref;
        }
        fakePref.value =
            this.getPref('autofill.autofill_ai.travel_entities_enabled')
                .value;
        if (this.optInToggleDisabled_()) {
            fakePref.value = false;
        }
        const addressPolicy = this.getPref('autofill.profile_enabled');
        const autofillAiPolicy = this.getPref(AiEnterpriseFeaturePrefName.AUTOFILL_AI);
        checkAutofillPoliciesAndModifyPrefIfNecessary(fakePref, addressPolicy, autofillAiPolicy, this.getPref('autofill.types_blocked'), AutofillPolicyDataCategory.TRAVEL);
        return fakePref;
    }
    onOptInToggleChange_() {
        // If the preference is enforced by enterprise policy, do not allow the user
        // to toggle or mutate the underlying preference value.
        if (this.$.optInToggle.pref?.enforcement ===
            chrome.settingsPrivate.Enforcement.ENFORCED) {
            return;
        }
        this.setPrefValue('autofill.autofill_ai.travel_entities_enabled', this.$.optInToggle.checked);
    }
    getAllowedEntityTypes_() {
        return new Set([
            EntityTypeName.kFlightReservation,
            EntityTypeName.kKnownTravelerNumber,
            EntityTypeName.kRedressNumber,
            EntityTypeName.kVehicle,
        ]);
    }
    getMetricEntityTypes_() {
        return {
            [EntityTypeName.kFlightReservation]: 'FlightReservation',
            [EntityTypeName.kKnownTravelerNumber]: 'KnownTravelerNumber',
            [EntityTypeName.kRedressNumber]: 'RedressNumber',
            [EntityTypeName.kVehicle]: 'Vehicle',
        };
    }
    extensionControlledIndicatorIsVisible_() {
        if (!this.prefsInitialized_) {
            return false;
        }
        const addressAutofillEnabled = this.getPref('autofill.profile_enabled');
        return !!addressAutofillEnabled.extensionId &&
            !addressAutofillEnabled.value;
    }
    onSuggestionsFromGeminiClick_() {
        this.metricsBrowserProxy_.recordSuggestionsFromGeminiEntryPointClick(SuggestionsFromGeminiEntryPoint.TRAVEL);
        Router.getInstance().navigateTo(routes.SUGGESTIONS_FROM_GEMINI);
    }
    // SettingsViewMixin implementation.
    getFocusConfig() {
        const map = new Map();
        if (routes.SUGGESTIONS_FROM_GEMINI) {
            map.set(routes.SUGGESTIONS_FROM_GEMINI.path, '#suggestionsFromGeminiLinkRow');
        }
        return map;
    }
    // SettingsViewMixin implementation.
    focusBackButton() {
        this.shadowRoot.querySelector('settings-subpage').focusBackButton();
    }
}
customElements.define(SettingsTravelPageElement.is, SettingsTravelPageElement);
