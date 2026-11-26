// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * All Trust & Safety based interactions which may result in a HaTS survey.
 *
 * Must be kept in sync with the enum of the same name in hats_handler.h.
 */
export var TrustSafetyInteraction;
(function (TrustSafetyInteraction) {
    TrustSafetyInteraction[TrustSafetyInteraction["RAN_SAFETY_CHECK"] = 0] = "RAN_SAFETY_CHECK";
    TrustSafetyInteraction[TrustSafetyInteraction["USED_PRIVACY_CARD"] = 1] = "USED_PRIVACY_CARD";
    // OPENED_PRIVACY_SANDBOX = 2, // DEPRECATED
    TrustSafetyInteraction[TrustSafetyInteraction["OPENED_PASSWORD_MANAGER"] = 3] = "OPENED_PASSWORD_MANAGER";
    TrustSafetyInteraction[TrustSafetyInteraction["COMPLETED_PRIVACY_GUIDE"] = 4] = "COMPLETED_PRIVACY_GUIDE";
    TrustSafetyInteraction[TrustSafetyInteraction["RAN_PASSWORD_CHECK"] = 5] = "RAN_PASSWORD_CHECK";
    // OPENED_AD_PRIVACY = 6, // DEPRECATED
    // OPENED_TOPICS_SUBPAGE = 7, // DEPRECATED
    // OPENED_FLEDGE_SUBPAGE = 8, // DEPRECATED
    // OPENED_AD_MEASUREMENT_SUBPAGE = 9, // DEPRECATED
    // OPENED_GET_MOST_CHROME = 10, // DEPRECATED
})(TrustSafetyInteraction || (TrustSafetyInteraction = {}));
/**
 * All interactions from the security settings page which may result in a HaTS
 * survey. Must be kept in sync with the enum of the same name located in:
 * chrome/browser/ui/webui/settings/hats_handler.h
 */
// LINT.IfChange(SecurityPageInteraction)
export var SecurityPageInteraction;
(function (SecurityPageInteraction) {
    SecurityPageInteraction[SecurityPageInteraction["RADIO_BUTTON_ENHANCED_CLICK"] = 0] = "RADIO_BUTTON_ENHANCED_CLICK";
    SecurityPageInteraction[SecurityPageInteraction["RADIO_BUTTON_STANDARD_CLICK"] = 1] = "RADIO_BUTTON_STANDARD_CLICK";
    SecurityPageInteraction[SecurityPageInteraction["RADIO_BUTTON_DISABLE_CLICK"] = 2] = "RADIO_BUTTON_DISABLE_CLICK";
    SecurityPageInteraction[SecurityPageInteraction["EXPAND_BUTTON_ENHANCED_CLICK"] = 3] = "EXPAND_BUTTON_ENHANCED_CLICK";
    SecurityPageInteraction[SecurityPageInteraction["EXPAND_BUTTON_STANDARD_CLICK"] = 4] = "EXPAND_BUTTON_STANDARD_CLICK";
    SecurityPageInteraction[SecurityPageInteraction["NO_INTERACTION"] = 5] = "NO_INTERACTION";
})(SecurityPageInteraction || (SecurityPageInteraction = {}));
// LINT.ThenChange(/chrome/browser/ui/webui/settings/hats_handler.h:SecurityPageInteraction)
/**
 * Enumeration of interactions with the security settings v2 page. Must be kept
 * in sync with the enum of the same name located in:
 * chrome/browser/ui/webui/settings/hats_handler.h
 */
export var SecurityPageV2Interaction;
(function (SecurityPageV2Interaction) {
    SecurityPageV2Interaction[SecurityPageV2Interaction["STANDARD_BUNDLE_RADIO_BUTTON_CLICK"] = 0] = "STANDARD_BUNDLE_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["ENHANCED_BUNDLE_RADIO_BUTTON_CLICK"] = 1] = "ENHANCED_BUNDLE_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SAFE_BROWSING_ROW_EXPANDED"] = 2] = "SAFE_BROWSING_ROW_EXPANDED";
    SecurityPageV2Interaction[SecurityPageV2Interaction["STANDARD_SAFE_BROWSING_RADIO_BUTTON_CLICK"] = 3] = "STANDARD_SAFE_BROWSING_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["ENHANCED_SAFE_BROWSING_RADIO_BUTTON_CLICK"] = 4] = "ENHANCED_SAFE_BROWSING_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SAFE_BROWSING_TOGGLE_CLICK"] = 5] = "SAFE_BROWSING_TOGGLE_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_V2_ROW_EXPANDED"] = 6] = "SECURE_DNS_V2_ROW_EXPANDED";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_V2_AUTOMATIC_RADIO_BUTTON_CLICK"] = 7] = "SECURE_DNS_V2_AUTOMATIC_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_V2_FALLBACK_RADIO_BUTTON_CLICK"] = 8] = "SECURE_DNS_V2_FALLBACK_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_V2_CUSTOM_RADIO_BUTTON_CLICK"] = 9] = "SECURE_DNS_V2_CUSTOM_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_V2_TOGGLE_CLICK"] = 10] = "SECURE_DNS_V2_TOGGLE_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["HTTPS_FIRST_MODE_TOGGLE_CLICK"] = 11] = "HTTPS_FIRST_MODE_TOGGLE_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["BALANCED_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK"] = 12] = "BALANCED_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["STRICT_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK"] = 13] = "STRICT_HTTPS_FIRST_MODE_RADIO_BUTTON_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["PASSWORD_LEAK_DETECTION_TOGGLE_CLICK"] = 14] = "PASSWORD_LEAK_DETECTION_TOGGLE_CLICK";
    SecurityPageV2Interaction[SecurityPageV2Interaction["SECURE_DNS_TOGGLE_CLICK"] = 15] = "SECURE_DNS_TOGGLE_CLICK";
})(SecurityPageV2Interaction || (SecurityPageV2Interaction = {}));
/** Enumeration of all security settings bundle modes.*/
// LINT.IfChange(SecuritySettingsBundleSetting)
export var SecuritySettingsBundleSetting;
(function (SecuritySettingsBundleSetting) {
    SecuritySettingsBundleSetting[SecuritySettingsBundleSetting["STANDARD"] = 0] = "STANDARD";
    SecuritySettingsBundleSetting[SecuritySettingsBundleSetting["ENHANCED"] = 1] = "ENHANCED";
})(SecuritySettingsBundleSetting || (SecuritySettingsBundleSetting = {}));
export class HatsBrowserProxyImpl {
    trustSafetyInteractionOccurred(interaction) {
        chrome.send('trustSafetyInteractionOccurred', [interaction]);
    }
    securityPageHatsRequest(securityPageInteraction, safeBrowsingSetting, totalTimeOnPage) {
        chrome.send('securityPageHatsRequest', [securityPageInteraction, safeBrowsingSetting, totalTimeOnPage]);
    }
    securityPageV2HatsRequest(securityPageInteractions, safeBrowsingSetting, totalTimeOnPage, securitySettingsBundleSetting) {
        chrome.send('securityPageV2HatsRequest', [
            securityPageInteractions,
            safeBrowsingSetting,
            totalTimeOnPage,
            securitySettingsBundleSetting,
        ]);
    }
    now() {
        return window.performance.now();
    }
    static getInstance() {
        return instance || (instance = new HatsBrowserProxyImpl());
    }
    static setInstance(obj) {
        instance = obj;
    }
}
let instance = null;
