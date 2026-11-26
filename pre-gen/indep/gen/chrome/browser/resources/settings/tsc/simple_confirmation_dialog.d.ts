/**
 * @fileoverview 'settings-simple-confirmation-dialog' is a generic
 * component for confirming an action the user has taken, given them an
 * opportunity to cancel.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import type { CrDialogElement } from 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SettingsSimpleConfirmationDialogElement {
    $: {
        dialog: CrDialogElement;
        cancel: HTMLElement;
        confirm: HTMLElement;
    };
}
export declare class SettingsSimpleConfirmationDialogElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        titleText: StringConstructor;
        bodyText: StringConstructor;
        confirmText: StringConstructor;
        noPrimaryButton: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    titleText: string;
    bodyText: string;
    confirmText: string;
    noPrimaryButton: boolean;
    /** @return Whether the user confirmed the dialog. */
    wasConfirmed(): boolean;
    private onCancelClick_;
    private onConfirmClick_;
    private getConfirmButtonCssClass_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-simple-confirmation-dialog': SettingsSimpleConfirmationDialogElement;
    }
}
