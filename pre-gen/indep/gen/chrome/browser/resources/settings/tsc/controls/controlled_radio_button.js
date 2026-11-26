// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_radio_button/cr_radio_button_style.css.js';
import '//resources/cr_elements/cr_shared_vars.css.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import { CrRadioButtonMixin } from '//resources/cr_elements/cr_radio_button/cr_radio_button_mixin.js';
import { assert } from '//resources/js/assert.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { PrefControlMixin } from '/shared/settings/controls/pref_control_mixin.js';
import { prefToString } from '/shared/settings/prefs/pref_util.js';
import { CrRippleMixinPolymer } from 'chrome://resources/cr_elements/cr_ripple/cr_ripple_mixin_polymer.js';
import { getTemplate } from './controlled_radio_button.html.js';
import { PrefKeyObserverMixin } from './pref_key_observer_mixin.js';
const ControlledRadioButtonElementBase = PrefKeyObserverMixin(CrRippleMixinPolymer(CrRadioButtonMixin(PrefControlMixin(PolymerElement))));
export class ControlledRadioButtonElement extends ControlledRadioButtonElementBase {
    static get is() {
        return 'controlled-radio-button';
    }
    static get template() {
        return getTemplate();
    }
    static get observers() {
        return [
            'updateDisabled_(pref.enforcement)',
        ];
    }
    // Overridden from CrRadioButtonMixin
    getPaperRipple() {
        return this.getRipple();
    }
    // Overridden from CrRippleMixinPolymer
    createRipple() {
        this.rippleContainer = this.shadowRoot.querySelector('.disc-wrapper');
        const ripple = super.createRipple();
        ripple.setAttribute('recenters', '');
        ripple.classList.add('circle');
        return ripple;
    }
    updateDisabled_() {
        this.disabled =
            this.pref.enforcement === chrome.settingsPrivate.Enforcement.ENFORCED;
    }
    showIndicator_() {
        if (!this.disabled) {
            return false;
        }
        assert(this.pref);
        return this.name === prefToString(this.pref);
    }
    onIndicatorClick_(e) {
        // Disallow <controlled-radio-button on-click="..."> when disabled.
        e.preventDefault();
        e.stopPropagation();
    }
}
customElements.define(ControlledRadioButtonElement.is, ControlledRadioButtonElement);
