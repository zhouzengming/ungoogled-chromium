import '//resources/cr_elements/cr_spinner_style.css.js';
import '/strings.m.js';
import './searchbox_shared_style.css.js';
import '//resources/cr_components/searchbox/searchbox_icon.js';
import { PolymerElement } from '//resources/polymer/v3_0/polymer/polymer_bundled.min.js';
import { PageContentType } from './page_content_type.mojom-webui.js';
declare const SearchboxGhostLoaderElementBase: typeof PolymerElement & (new (...args: any[]) => import("//resources/cr_elements/i18n_mixin.js").I18nMixinInterface);
export declare class SearchboxGhostLoaderElement extends SearchboxGhostLoaderElementBase {
    static get is(): string;
    static get template(): HTMLTemplateElement;
    static get properties(): {
        enableCsbMotionTweaks: {
            type: BooleanConstructor;
            value: () => boolean;
            reflectToAttribute: boolean;
        };
        showErrorState: {
            type: BooleanConstructor;
            reflectToAttribute: boolean;
            notify: boolean;
        };
        showContextualSearchboxLoadingState: {
            type: BooleanConstructor;
            value: () => boolean;
            reflectToAttribute: boolean;
        };
        pageContentType: {
            type: NumberConstructor;
            value: PageContentType;
        };
        ghostLoaderPrimaryMessage: {
            type: StringConstructor;
            computed: string;
        };
        enableSummarizeSuggestionHint: {
            type: BooleanConstructor;
            value: () => boolean;
            reflectToAttribute: boolean;
        };
        suggestionCount: {
            type: NumberConstructor;
            value: number;
        };
        shouldFadeOut: {
            type: BooleanConstructor;
            computed: string;
        };
    };
    private enableCsbMotionTweaks;
    private showErrorState;
    private showContextualSearchboxLoadingState;
    private pageContentType;
    private enableSummarizeSuggestionHint;
    private suggestionCount;
    private shouldFadeOut;
    private browserProxy;
    private listenerIds;
    private ghostLoaderPrimaryMessage;
    connectedCallback(): void;
    disconnectedCallback(): void;
    getText(): string;
    showErrorStateForTesting(): void;
    private computeGhostLoaderPrimaryMessage;
    private computeShouldFadeOut;
    private getSuggestionItems;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-searchbox-ghost-loader': SearchboxGhostLoaderElement;
    }
}
export {};
