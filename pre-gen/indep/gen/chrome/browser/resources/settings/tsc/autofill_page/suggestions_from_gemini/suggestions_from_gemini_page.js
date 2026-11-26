// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_components/cr_shortcut_input/cr_shortcut_input.js';
import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_icons.css.js';
import 'chrome://resources/cr_elements/cr_link_row/cr_link_row.js';
import '../../controls/settings_toggle_button.js';
import '../../icons.html.js';
import '../../settings_columned_section.css.js';
import '../../settings_page/settings_subpage.js';
import '../../settings_shared.css.js';
import '../autofill_shared.css.js';
import { PrefsMixin } from '/shared/settings/prefs/prefs_mixin.js';
import { CrSettingsPrefs } from '/shared/settings/prefs/prefs_types.js';
import { OpenWindowProxyImpl } from 'chrome://resources/js/open_window_proxy.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { ModelExecutionEnterprisePolicyValue } from '../../ai_page/constants.js';
import { loadTimeData } from '../../i18n_setup.js';
import { MetricsBrowserProxyImpl, SuggestionsFromGeminiAction } from '../../metrics_browser_proxy.js';
import { SettingsViewMixin } from '../../settings_page/settings_view_mixin.js';
import { getTemplate } from './suggestions_from_gemini_page.html.js';
const SettingsSuggestionsFromGeminiPageElementBase = SettingsViewMixin(PrefsMixin(PolymerElement));
const atMemoryShortcutPrefName = 'autofill.at_memory.shortcut';
export class SettingsSuggestionsFromGeminiPageElement extends SettingsSuggestionsFromGeminiPageElementBase {
    static get is() {
        return 'settings-suggestions-from-gemini-page';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            prefs: Object,
            isAtMemoryEnabled_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('isAtMemoryEnabled');
                },
            },
            isAtMemoryTriggerCustomizationAllowed_: {
                type: Boolean,
                value() {
                    return loadTimeData.getBoolean('isAtMemoryTriggerCustomizationAllowed');
                },
            },
            prefsInitialized_: {
                type: Boolean,
                value: false,
            },
        };
    }
    metricsBrowserProxy_ = MetricsBrowserProxyImpl.getInstance();
    connectedCallback() {
        super.connectedCallback();
        CrSettingsPrefs.initialized.then(() => {
            this.prefsInitialized_ = true;
        });
    }
    showQualityLogging_(toggleOn, atMemoryEnabled) {
        return toggleOn && atMemoryEnabled;
    }
    showDoubleCtrlShortcut_() {
        if (!this.prefsInitialized_) {
            return false;
        }
        return this.isAtMemoryTriggerCustomizationAllowed_ &&
            !!this.getPref('generated.find_and_fill_with_gemini').value;
    }
    showConsiderNoLoggingEnterprise_(enterprisePolicyValue) {
        return enterprisePolicyValue ===
            ModelExecutionEnterprisePolicyValue.ALLOW_WITHOUT_LOGGING;
    }
    onManageConnectedAppsClick_() {
        this.metricsBrowserProxy_.recordSuggestionsFromGeminiAction(SuggestionsFromGeminiAction.MANAGE_CONNECTED_APPS_CLICK);
        OpenWindowProxyImpl.getInstance().openUrl(loadTimeData.getString('personalContextConnectedAppsUrl'));
    }
    onToggleChange_(e) {
        const toggle = e.target;
        this.metricsBrowserProxy_.recordSuggestionsFromGeminiAction(toggle.checked ? SuggestionsFromGeminiAction.TOGGLE_ON :
            SuggestionsFromGeminiAction.TOGGLE_OFF);
    }
    onAtMemoryShortcutUpdated_(event) {
        this.setPrefValue(atMemoryShortcutPrefName, event.detail);
    }
    // SettingsViewMixin implementation.
    focusBackButton() {
        this.shadowRoot.querySelector('settings-subpage').focusBackButton();
    }
}
customElements.define(SettingsSuggestionsFromGeminiPageElement.is, SettingsSuggestionsFromGeminiPageElement);
