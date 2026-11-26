import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_shared_style.css.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_shared_vars.css.js';
import type { CrButtonElement } from 'chrome://resources/cr_elements/cr_button/cr_button.js';
import type { CrIconButtonElement } from 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
export interface HistoryCrossDeviceSigninPromoElement {
    $: {
        actionButton: CrButtonElement;
        close: CrIconButtonElement;
    };
}
declare const HistoryCrossDeviceSigninPromoElementBase: typeof CrLitElement & (new (...args: any[]) => import("chrome://resources/cr_elements/i18n_mixin_lit.js").I18nMixinLitInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/web_ui_listener_mixin_lit.js").WebUiListenerMixinLitInterface);
export declare class HistoryCrossDeviceSigninPromoElement extends HistoryCrossDeviceSigninPromoElementBase {
    static get is(): string;
    static get styles(): import("chrome://resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("chrome://resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    connectedCallback(): void;
    private handler_;
    protected onActionButtonClick_(): void;
    protected onCloseClick_(): void;
    private propagateShouldShowPromo_;
}
declare global {
    interface HTMLElementTagNameMap {
        'history-cross-device-signin-promo': HistoryCrossDeviceSigninPromoElement;
    }
}
export {};
