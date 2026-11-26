/**
 * @fileoverview `secure-dns-input` is a single-line text field that is used
 * with the secure DNS setting to configure custom servers. It is based on
 * `home-url-input`.
 */
import 'chrome://resources/cr_elements/cr_textarea/cr_textarea.js';
import type { CrTextareaElement } from 'chrome://resources/cr_elements/cr_textarea/cr_textarea.js';
import { PolymerElement } from 'chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export interface SecureDnsInputElement {
    $: {
        input: CrTextareaElement;
    };
}
export declare class SecureDnsInputElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        value: StringConstructor;
        showError_: {
            type: BooleanConstructor;
            computed: string;
        };
        /**
         * The error text to display beneath the input field when |showError_| is
         * true.
         */
        errorText_: {
            type: StringConstructor;
            value: string;
        };
    };
    value: string;
    private readonly showError_;
    private errorText_;
    private browserProxy_;
    private onKeyPress_;
    /**
     * This function ensures that while the user is entering input, especially
     * after pressing Enter, the input is not prematurely marked as invalid.
     */
    private onInput_;
    /**
     * When the custom input field loses focus, validate the current value and
     * trigger an event with the result. If the value is valid, also attempt a
     * test query. Show an error message if the tested value is still the most
     * recent value, is non-empty, and was either invalid or failed the test
     * query.
     */
    validate(): Promise<void>;
    /**
     * Focus the custom dns input field.
     */
    focus(): void;
    /**
     * @return whether an error is being shown.
     */
    private isInvalid_;
}
declare global {
    interface HTMLElementTagNameMap {
        'secure-dns-input': SecureDnsInputElement;
    }
}
