// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chrome://resources/js/assert.js';
import { deepEqual } from '../prefs/equality_comparators.js';
import { PrefsBrowserProxy } from './prefs_browser_proxy.js';
export class PrefService {
    cache_ = new Map();
    initializedPromise_;
    isInitialized_ = false;
    nextObserverId_ = 1;
    observers_ = new Map();
    eventTarget_ = new EventTarget();
    eventQueue_ = [];
    eventQueueIndex_ = 0;
    isDispatching_ = false;
    browserProxy_ = PrefsBrowserProxy.getInstance();
    boundOnPrefsChanged_ = this.onPrefsChanged_.bind(this);
    constructor() {
        this.initializedPromise_ = this.initialize_();
    }
    async initialize_() {
        assert(!this.isInitialized_);
        const prefs = await this.browserProxy_.getAllPrefs();
        for (const pref of prefs) {
            this.cache_.set(pref.key, pref);
        }
        this.isInitialized_ = true;
        this.browserProxy_.onPrefsChanged.addListener(this.boundOnPrefsChanged_);
    }
    whenInitialized() {
        return this.initializedPromise_;
    }
    async setPrefValue(key, value) {
        assert(this.isInitialized_, `setPrefValue called before PrefService initialized, for pref '${key}'`);
        // Step1: Update local cache and notify observers synchronously.
        const pref = this.cache_.get(key);
        assert(pref, `setPrefValue called for unknown pref '${key}'`);
        if (deepEqual(pref.value, value)) {
            return Promise.resolve(true);
        }
        pref.value = value;
        this.queueAndDispatch_([
            new CustomEvent(pref.key, { detail: structuredClone(pref) }),
        ]);
        // Step2: Propagate change to backend.
        const success = await this.browserProxy_.setPref(key, value);
        if (success) {
            return true;
        }
        // Step3: Revert local change if backend call failed.
        await this.updateCacheFromBackend_(key);
        return false;
    }
    /**
     * @param prefKey The key of the PrefObject to be updated. Must be of
     *     PrefType.DICTIONARY otherwise an assertion error will be thrown.
     * @param dictKey The key within the dictionary identifying the entry to be
     *     updated.
     * @param value The new value of the dictionary entry being updated.
     */
    async setPrefDictEntry(prefKey, dictKey, value) {
        const pref = this.getPref(prefKey);
        assert(pref.type === chrome.settingsPrivate.PrefType.DICTIONARY);
        const dict = { ...pref.value };
        dict[dictKey] = value;
        return this.setPrefValue(prefKey, dict);
    }
    /**
     * @param prefKey The key of the PrefObject to be updated. Must be of
     *     PrefType.DICTIONARY otherwise an assertion error will be thrown.
     * @param dictKey The key within the dictionary identifying the entry to be
     *     deleted.
     */
    async deletePrefDictEntry(prefKey, dictKey) {
        const pref = this.getPref(prefKey);
        assert(pref.type === chrome.settingsPrivate.PrefType.DICTIONARY);
        const dict = { ...pref.value };
        delete dict[dictKey];
        return this.setPrefValue(prefKey, dict);
    }
    /**
     * @param prefKey The key of the PrefObject to be updated. Must be of
     *     PrefType.LIST otherwise an assertion error will be thrown.
     * @param value The value to append to the list pref if not already present.
     */
    async appendPrefListItem(prefKey, value) {
        const pref = this.getPref(prefKey);
        assert(pref.type === chrome.settingsPrivate.PrefType.LIST);
        if (pref.value.includes(value)) {
            return Promise.resolve(true);
        }
        return this.setPrefValue(prefKey, [...pref.value, value]);
    }
    getPref(key) {
        assert(this.isInitialized_, `getPref called before PrefService initialized, for pref '${key}'`);
        const pref = this.cache_.get(key);
        assert(pref, `pref '${key}' not found in cache`);
        return structuredClone(pref);
    }
    /**
     * Get the current pref value from chrome.settingsPrivate to ensure the UI
     * stays up to date.
     */
    async updateCacheFromBackend_(key) {
        const pref = await this.browserProxy_.getPref(key);
        this.onPrefsChanged_([pref]);
    }
    addObserver(key, callback) {
        const id = this.nextObserverId_++;
        const listener = (e) => {
            const customEvent = e;
            callback(customEvent.detail);
        };
        this.eventTarget_.addEventListener(key, listener);
        this.observers_.set(id, { key, listener });
        // Call the observer once to provide the initial value, as soon as it is
        // available.
        this.whenInitialized().then(() => {
            const observer = this.observers_.get(id);
            if (!observer) {
                // Observer was removed before initialization, do nothing.
                return;
            }
            observer.listener(new CustomEvent(key, { detail: structuredClone(this.getPref(key)) }));
        });
        return id;
    }
    removeObserver(id) {
        const observer = this.observers_.get(id);
        if (!observer) {
            return false;
        }
        this.eventTarget_.removeEventListener(observer.key, observer.listener);
        this.observers_.delete(id);
        return true;
    }
    onPrefsChanged_(prefs) {
        assert(this.isInitialized_, 'onPrefsChanged_ called before PrefService initialized');
        const events = [];
        for (const pref of prefs) {
            const oldPref = this.cache_.get(pref.key);
            assert(oldPref, `onPrefsChanged_ called for uknown pref '${pref.key}'`);
            if (deepEqual(oldPref, pref)) {
                // Handle case where the change originated from the Settings UI and
                // therefore it is already in the local cache.
                continue;
            }
            this.cache_.set(pref.key, pref);
            events.push(new CustomEvent(pref.key, { detail: structuredClone(pref) }));
        }
        // Fire events only after the cache has been fully updated to reflect the
        // latest changes.
        this.queueAndDispatch_(events);
    }
    queueAndDispatch_(events) {
        this.eventQueue_.push(...events);
        if (this.isDispatching_) {
            return;
        }
        this.isDispatching_ = true;
        try {
            while (this.eventQueueIndex_ < this.eventQueue_.length) {
                const nextEvent = this.eventQueue_[this.eventQueueIndex_];
                this.eventQueueIndex_++;
                this.eventTarget_.dispatchEvent(nextEvent);
            }
        }
        finally {
            this.isDispatching_ = false;
            this.eventQueue_ = [];
            this.eventQueueIndex_ = 0;
        }
    }
    destroy_() {
        this.browserProxy_.onPrefsChanged.removeListener(this.boundOnPrefsChanged_);
    }
    static resetInstanceForTesting() {
        if (instance) {
            instance.destroy_();
            instance = null;
        }
    }
    static getInstance() {
        return instance || (instance = new PrefService());
    }
}
let instance = null;
