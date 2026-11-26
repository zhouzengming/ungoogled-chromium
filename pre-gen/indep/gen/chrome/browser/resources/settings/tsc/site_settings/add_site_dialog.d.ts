/**
 * @fileoverview
 * 'add-site-dialog' provides a dialog to add exceptions for a given Content
 * Settings category.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import 'chrome://resources/cr_elements/cr_input/cr_input.js';
import '../settings_shared.css.js';
import type { CrButtonElement } from 'chrome://resources/cr_elements/cr_button/cr_button.js';
import type { CrCheckboxElement } from 'chrome://resources/cr_elements/cr_checkbox/cr_checkbox.js';
import type { CrDialogElement } from 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import type { CrInputElement } from 'chrome://resources/cr_elements/cr_input/cr_input.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { ContentSetting, CookiesExceptionType } from './constants.js';
import type { SiteSettingsMixinInterface } from './site_settings_mixin.js';
export interface AddSiteDialogElement {
    $: {
        add: CrButtonElement;
        dialog: CrDialogElement;
        incognito: CrCheckboxElement;
        site: CrInputElement;
    };
}
declare const AddSiteDialogElementBase: {
    new (): PolymerElement & SiteSettingsMixinInterface;
};
export declare class AddSiteDialogElement extends AddSiteDialogElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
         * Whether this is about an Allow, Block, SessionOnly, or other.
         */
        contentSetting: StringConstructor;
        hasIncognito: {
            type: BooleanConstructor;
            observer: string;
        };
        /**
         * Controls what kind of patterns the created cookies exception will have
         * (based on the CookiesExceptionType):
         * - THIRD_PARTY: Exception that will have primary pattern as wildcard
         * (third-party cookie exceptions).
         * - SITE_DATA: Exception that will have secondary pattern as wildcard
         * (regular exceptions).
         * - COMBINED: Support both pattern types and have a checkbox to control
         * the mode.
         */
        cookiesExceptionType: StringConstructor;
        /**
         * The site to add an exception for.
         */
        site_: StringConstructor;
        /**
         * The error message to display when the pattern is invalid.
         */
        errorMessage_: StringConstructor;
    };
    contentSetting: ContentSetting;
    hasIncognito: boolean;
    cookiesExceptionType: CookiesExceptionType;
    private site_;
    private errorMessage_;
    connectedCallback(): void;
    /**
     * Validates that the pattern entered is valid.
     */
    private validate_;
    private onCancelClick_;
    /**
     * The tap handler for the Add [Site] button (adds the pattern and closes
     * the dialog).
     */
    private onSubmit_;
    private showIncognitoSessionOnly_;
    private hasIncognitoChanged_;
}
declare global {
    interface HTMLElementTagNameMap {
        'add-site-dialog': AddSiteDialogElement;
    }
}
export {};
