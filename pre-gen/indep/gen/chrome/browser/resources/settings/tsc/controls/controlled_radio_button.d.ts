import '//resources/cr_elements/cr_radio_button/cr_radio_button_style.css.js';
import '//resources/cr_elements/cr_shared_vars.css.js';
import '/shared/settings/controls/cr_policy_pref_indicator.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
declare const ControlledRadioButtonElementBase: typeof PolymerElement & (new (...args: any[]) => import("/shared/settings/controls/pref_control_mixin.js").PrefControlMixinInterface) & (new (...args: any[]) => import("//resources/cr_elements/cr_radio_button/cr_radio_button_mixin.js").CrRadioButtonMixinInterface) & (new (...args: any[]) => import("chrome://resources/cr_elements/cr_ripple/cr_ripple_mixin_polymer.js").CrRippleMixinPolymerInterface) & (new (...args: any[]) => import("./pref_key_observer_mixin.js").PrefKeyObserverMixinInterface) & (new (...args: any[]) => import("../settings.js").PrefServiceObserverMixinInterface);
export declare class ControlledRadioButtonElement extends ControlledRadioButtonElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get observers(): string[];
    getPaperRipple(): import("//resources/cr_elements/cr_ripple/cr_ripple.js").CrRippleElement;
    createRipple(): import("//resources/cr_elements/cr_ripple/cr_ripple.js").CrRippleElement;
    private updateDisabled_;
    private showIndicator_;
    private onIndicatorClick_;
}
declare global {
    interface HTMLElementTagNameMap {
        'controlled-radio-button': ControlledRadioButtonElement;
    }
}
export {};
