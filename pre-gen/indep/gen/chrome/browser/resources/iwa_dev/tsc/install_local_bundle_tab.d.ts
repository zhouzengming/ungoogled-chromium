import { IwaDevInstallTabElement } from './install_tab.js';
export declare class IwaDevInstallLocalBundleTabElement extends IwaDevInstallTabElement {
    static get is(): string;
    connectedCallback(): void;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        disabled: {
            type: BooleanConstructor;
        };
    };
    accessor disabled: boolean;
    isValid(): boolean;
    submit(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'iwa-dev-install-local-bundle-tab': IwaDevInstallLocalBundleTabElement;
    }
}
