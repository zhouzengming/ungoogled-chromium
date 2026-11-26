// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PrefServiceObserverMixinLit } from '/shared/settings/prefs2/pref_service_observer_mixin_lit.js';
import { assert } from 'chrome://resources/js/assert.js';
export const PrefKeyObserverMixinLit = (superClass) => {
    const superClassBase = PrefServiceObserverMixinLit(superClass);
    class PrefKeyObserverMixinLit extends superClassBase {
        static get properties() {
            return {
                prefKey: { type: String },
            };
        }
        #prefKey_accessor_storage = '';
        get prefKey() { return this.#prefKey_accessor_storage; }
        set prefKey(value) { this.#prefKey_accessor_storage = value; }
        willUpdate(changedProperties) {
            super.willUpdate(changedProperties);
            if (changedProperties.has('prefKey')) {
                this.onPrefKeyChanged_(this.prefKey, changedProperties.get('prefKey'));
            }
        }
        onPrefKeyChanged_(newKey, oldKey) {
            if (newKey === '' && oldKey === undefined) {
                return;
            }
            // Disallow re-assigning the prefKey after initial assignment.
            assert(!oldKey);
            this.mirrorPref(newKey, 'pref');
        }
    }
    return PrefKeyObserverMixinLit;
};
