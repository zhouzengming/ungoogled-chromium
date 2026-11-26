import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
export declare class SidePanelGhostLoaderElement extends PolymerElement {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        darkMode: {
            type: BooleanConstructor;
            value: () => boolean;
            reflectToAttribute: boolean;
        };
    };
    private darkMode;
}
declare global {
    interface HTMLElementTagNameMap {
        'side-panel-ghost-loader': SidePanelGhostLoaderElement;
    }
}
