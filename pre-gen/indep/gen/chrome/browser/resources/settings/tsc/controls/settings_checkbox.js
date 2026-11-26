// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview
 * `settings-checkbox` is a checkbox that controls a supplied preference.
 */
import 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import { SettingsBooleanControlMixin } from '/shared/settings/controls/settings_boolean_control_mixin.js';
import { PrefService } from '/shared/settings/prefs2/pref_service.js';
import { sanitizeInnerHtml } from 'chrome://resources/js/parse_html_subset.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { PrefKeyObserverMixin } from './pref_key_observer_mixin.js';
import { getTemplate } from './settings_checkbox.html.js';
const SettingsCheckboxElementBase = PrefKeyObserverMixin(SettingsBooleanControlMixin(PolymerElement));
export class SettingsCheckboxElement extends SettingsCheckboxElementBase {
    static get is() {
        return 'settings-checkbox';
    }
    static get template() {
        return getTemplate();
    }
    static get properties() {
        return {
            /**
             * Alternative source for the sub-label that can contain html markup.
             * Only use with trusted input.
             */
            subLabelHtml: {
                type: String,
                value: '',
            },
        };
    }
    static get observers() {
        return [
            'onSubLabelChanged_(subLabel, subLabelHtml)',
        ];
    }
    /** Focus on the inner cr-checkbox. */
    focus() {
        this.$.checkbox.focus();
    }
    onSubLabelChanged_() {
        this.$.checkbox.ariaDescription = this.$.subLabel.textContent;
    }
    stopPropagation_(event) {
        event.stopPropagation();
    }
    hasSubLabel_(subLabel, subLabelHtml) {
        return !!subLabel || !!subLabelHtml;
    }
    sanitizeInnerHtml_(rawString) {
        return sanitizeInnerHtml(rawString, {
            attrs: [
                'id',
                'aria-label',
            ],
        });
    }
    onSubLabelClick_(e) {
        const target = e.target;
        if (target.tagName === 'A') {
            this.dispatchEvent(new CustomEvent('sub-label-link-clicked', { bubbles: true, composed: true, detail: { id: target.id } }));
            e.preventDefault();
            // Don't let link click events from the sub-label reach the checkbox.
            e.stopPropagation();
        }
    }
    sendPrefChangeInternal(value) {
        if (this.prefKey) {
            PrefService.getInstance().setPrefValue(this.prefKey, value);
            return;
        }
        // Fallback to the old 'prefs' mechanism if this element hasn't been
        // migrated to use prefKey yet.
        super.sendPrefChangeInternal(value);
    }
}
customElements.define(SettingsCheckboxElement.is, SettingsCheckboxElement);
