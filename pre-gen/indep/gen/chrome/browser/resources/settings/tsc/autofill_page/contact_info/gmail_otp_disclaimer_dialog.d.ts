/**
 * @fileoverview 'settings-gmail-otp-disclaimer-dialog' is the dialog that is
 * shown when turning on Gmail OTP filling requires smart features in Gmail to
 * be enabled.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import '../../settings_shared.css.js';
import type { CrButtonElement } from 'chrome://resources/cr_elements/cr_button/cr_button.js';
import type { CrDialogElement } from 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SettingsGmailOtpDisclaimerDialogElement {
    $: {
        confirmButton: CrButtonElement;
        dialog: CrDialogElement;
    };
}
export declare class SettingsGmailOtpDisclaimerDialogElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    private onConfirmButtonClick_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-gmail-otp-disclaimer-dialog': SettingsGmailOtpDisclaimerDialogElement;
    }
}
