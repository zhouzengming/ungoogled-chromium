import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export declare class ExtensionControlledIndicatorElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        extensionCanBeDisabled: BooleanConstructor;
        extensionId: StringConstructor;
        extensionName: StringConstructor;
        extensionNameOnlyInLabel: BooleanConstructor;
    };
    extensionCanBeDisabled: boolean;
    extensionId: string;
    extensionName: string;
    extensionNameOnlyInLabel?: boolean;
    private getLabel_;
    private onManageClick_;
    private onDisableClick_;
}
declare global {
    interface HTMLElementTagNameMap {
        'extension-controlled-indicator': ExtensionControlledIndicatorElement;
    }
}
