// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PrefServiceObserverMixin } from '/shared/settings/prefs2/pref_service_observer_mixin.js';
import { assert } from 'chrome://resources/js/assert.js';
import { dedupingMixin } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export const PrefKeyObserverMixin = dedupingMixin((superClass) => {
    const superClassBase = PrefServiceObserverMixin(superClass);
    class PrefKeyObserverMixin extends superClassBase {
        static get properties() {
            return {
                prefKey: {
                    type: String,
                    value: '',
                    observer: 'onPrefKeyChanged_',
                },
            };
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
    return PrefKeyObserverMixin;
});
