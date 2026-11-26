import 'chrome://resources/cr_elements/cr_icon/cr_icon.js';
import 'chrome://resources/cr_elements/cr_icons.css.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/icons.html.js';
import '/shared/settings/prefs/prefs.js';
import '../controls/settings_toggle_button.js';
import '../icons.html.js';
import '../privacy_icons.html.js';
import '../settings_columned_section.css.js';
import '../settings_shared.css.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import type { SettingsToggleButtonElement } from '../controls/settings_toggle_button.js';
export interface SettingsWalletablePassDetectionToggleElement {
    $: {
        toggle: SettingsToggleButtonElement;
    };
}
export declare class SettingsWalletablePassDetectionToggleElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        walletablePassDetectionOptedIn_: {
            type: ObjectConstructor;
            value: () => {
                type: chrome.settingsPrivate.PrefType;
                value: boolean;
            };
        };
        ineligibleUser_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    private walletablePassDetectionOptedIn_;
    private ineligibleUser_;
    connectedCallback(): void;
    /**
     * Listener for `walletablePassDetectionPrefToggle` change event.
     */
    private onChange_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-walletable-pass-detection-toggle': SettingsWalletablePassDetectionToggleElement;
    }
}
