/**
 * @fileoverview 'settings-autofill-ai-add-or-edit-dialog' is the dialog that
 * allows adding and editing entity instances for Autofill AI.
 */
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import 'chrome://resources/cr_elements/cr_input/cr_input.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import 'chrome://resources/cr_elements/cr_spinner_style.css.js';
import 'chrome://resources/cr_elements/md_select.css.js';
import '../settings_shared.css.js';
import type { CrDialogElement } from 'chrome://resources/cr_elements/cr_dialog/cr_dialog.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
type EntityInstance = chrome.autofillPrivate.EntityInstance;
type UpsertPassDetails = chrome.autofillPrivate.UpsertPassDetails;
export interface SettingsAutofillAiAddOrEditDialogElement {
    $: {
        dialog: CrDialogElement;
    };
}
declare const SettingsAutofillAiAddOrEditDialogElementBase: typeof PolymerElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin.js").I18nMixinInterface);
export declare class SettingsAutofillAiAddOrEditDialogElement extends SettingsAutofillAiAddOrEditDialogElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        /**
           The entity instance to be modified. If this is an "add" dialog, the
           entity instance has only a type, but no attribute instances or guid.
         */
        entityInstance: {
            type: ObjectConstructor;
            value: null;
        };
        dialogTitle: {
            type: StringConstructor;
            value: string;
        };
        attributeTypeDataTypeEnum_: {
            type: ObjectConstructor;
            value: () => typeof chrome.autofillPrivate.AttributeTypeDataType;
        };
        /**
           Complete list of attribute instances that are associated with the
           current entity instance. If this is an "edit" dialog, some attribute
           instances are populated with their already existing values.
         */
        completeAttributeInstanceList_: {
            type: ArrayConstructor;
            computed: string;
        };
        /**
           The list of all countries that should be displayed in a <select>
           element for a country field.
         */
        countryList_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        /**
           Complete list of attribute types that are associated with the
           current entity type.
         */
        completeAttributeTypesList_: {
            type: ArrayConstructor;
            value: () => never[];
        };
        /**
         *  User email associated with the account.
         */
        userEmail_: {
            type: StringConstructor;
            value: string;
        };
        /**
         * Footer text shown in the view, represented as a TrustedHTML object,
         * since the footer text can contain a link. If the object represents an
         * empty TrustedHTML, no footer text is shown.
         */
        footerText_: {
            type: ObjectConstructor;
            computed: string;
        };
        /**
         * Details for upserting a public pass, including legal message lines and
         * context token.
         */
        upsertPassDetails: {
            type: ObjectConstructor;
            value: null;
        };
        /**
           True if all fields are empty. The first validation occurs when the user
           clicks the "Save" button for the first time. Subsequent validations
           occur any time an input field is changed. If true, the "Save" button
           is disabled and an error message is displayed.
         */
        allFieldsAreEmpty_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
           False if the form is invalid. The first validation occurs when the user
           clicks the "Save" button for the first time. Subsequent validations
           occur any time an input field is changed. If false, the "Save" button
           is disabled and an error message is displayed.
         */
        canSave_: {
            type: BooleanConstructor;
            value: boolean;
        };
        userClickedSaveButton_: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
           Holds the error to display (or empty string if valid).
         */
        validationError_: {
            type: StringConstructor;
            value: string;
        };
        months_: {
            type: ArrayConstructor;
            value: string[];
        };
        days_: {
            type: ArrayConstructor;
            value: string[];
        };
        years_: {
            type: ArrayConstructor;
            value: () => string[];
        };
        enableSavePrivatePassesToWallet_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        isWalletPassBranding2026Enabled_: {
            type: BooleanConstructor;
            value: () => boolean;
        };
        /**
         * True while waiting for the backend to respond from Wallet API call.
         */
        saveInProgress_: {
            type: BooleanConstructor;
            value: boolean;
        };
    };
    entityInstance: EntityInstance | null;
    dialogTitle: string;
    upsertPassDetails: UpsertPassDetails | null;
    private completeAttributeInstanceList_;
    private countryList_;
    private completeAttributeTypesList_;
    private allFieldsAreEmpty_;
    private canSave_;
    private userClickedSaveButton_;
    private validationError_;
    private months_;
    private days_;
    private years_;
    private userEmail_;
    private footerText_;
    private enableSavePrivatePassesToWallet_;
    private isWalletPassBranding2026Enabled_;
    private saveInProgress_;
    private requiredAttributeTypes_;
    private entityDataManager_;
    private countryDetailManager_;
    connectedCallback(): Promise<void>;
    private checkRequiredFields_;
    private computeCompleteAttributeInstanceList_;
    private convertCountryAttributeInstance_;
    private isDataType_;
    private getCountryCode_;
    private isCountrySeparator_;
    private getCountryName_;
    private getMonthName_;
    private isCountrySelected_;
    private isMonthSelected_;
    private isDaySelected_;
    private isYearSelected_;
    private onCountrySelectChange_;
    private onMonthSelectChange_;
    private onDaySelectChange_;
    private onYearSelectChange_;
    /**
     * Returns '*' if the field is required.
     */
    private getRequiredIndicator_;
    /**
     * Computes the label for cr-input fields.
     * Appends '*' to the label text if required.
     */
    private computeInputLabel_;
    private walletManageYourInfoUrl_;
    private shouldHideFooterText_;
    private isPublicPass_;
    private computeFooterText_;
    private formatLegalMessageLines_;
    private isExistingYearOutOfBounds_;
    private getExistingYear_;
    /**
     * This function returns a string that can be used in a srcset to scale
     * the provided `url` based on the user's screen resolution.
     */
    private getScaledSrcSet_;
    /**
     * Returns true if the date is invalid. A date is invalid either if it is
     * incomplete (i.e. only some of the month, day, year selectors are empty), or
     * if the combination of month, day, year is invalid (i.e. 30th of February
     * 2020 is invalid).
     * Returns false if month, day, year are all empty, or if the combination of
     * month, day, year is complete and valid.
     * The first validation occurs when the user clicks the "Save" button for the
     * first time. Subsequent validations occur any time a field is changed.
     */
    private isDateInvalid_;
    /**
     * Returns true if the field should be highlighted as invalid due to
     * missing requirements.
     */
    private isFieldInvalid_;
    private shouldShowWalletBranding_;
    /**
     * Returns true if the value is not empty and it is not made out only of
     * whitespaces.
     * For dates, at least one of month, day and year has to be not empty. An
     * incomplete date is not an empty field.
     */
    private isAttributeInstanceNotEmpty;
    private onAttributeInstanceFieldInput_;
    private validateForm_;
    /**
     * Helper to determine if the spinner should be visible.
     */
    private shouldShowSpinner_;
    private onCancelClick_;
    private onDialogCancel_;
    private onConfirmClick_;
}
declare global {
    interface HTMLElementTagNameMap {
        'settings-autofill-ai-add-or-edit-dialog': SettingsAutofillAiAddOrEditDialogElement;
    }
}
export {};
