import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export declare class SettingsPrefsElement extends PolymerElement {
    static get is(): string;
    static get properties(): {
        /**
         * Object containing all preferences, for use by Polymer controls.
         */
        prefs: {
            type: ObjectConstructor;
            notify: boolean;
        };
    };
    static get observers(): string[];
    prefs: {
        [key: string]: unknown;
    } | undefined;
    /**
     * Map of pref keys to values representing the state of the Chrome
     * pref store as of the last update from the API.
     */
    private lastPrefValues_;
    private settingsApi_;
    private initialized_;
    private boundPrefsChanged_;
    constructor();
    disconnectedCallback(): void;
    /**
     * @param settingsApi SettingsPrivate implementation to use
     *     (chrome.settingsPrivate by default).
     */
    initialize(settingsApi?: typeof chrome.settingsPrivate): void;
    private prefsChanged_;
    /**
     * Called when prefs in the underlying Chrome pref store are changed.
     */
    private onSettingsPrivatePrefsChanged_;
    /**
     * Get the current pref value from chrome.settingsPrivate to ensure the UI
     * stays up to date.
     */
    refresh(key: string): void;
    /**
     * Builds an object structure for the provided |path| within |prefsObject|,
     * ensuring that names that already exist are not overwritten. For example:
     * "a.b.c" -> a = {};a.b={};a.b.c={};
     * @param path Path to the new pref value.
     * @param value The value to expose at the end of the path.
     * @param prefsObject The prefs object to add the path to.
     */
    private updatePrefPath_;
    /**
     * Updates the prefs model with the given prefs.
     */
    private updatePrefs_;
    /**
     * Given a 'property-changed' path, returns the key of the preference the
     * path refers to. E.g., if the path of the changed property is
     * 'prefs.search.suggest_enabled.value', the key of the pref that changed is
     * 'search.suggest_enabled'.
     */
    private getPrefKeyFromPath_;
    /**
     * Resets the element so it can be re-initialized with a new prefs state.
     */
    resetForTesting(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-prefs': SettingsPrefsElement;
    }
}
