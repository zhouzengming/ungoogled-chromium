import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { AutocompleteMatch } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { ToolMode } from '//resources/mojo/components/omnibox/composebox/composebox_query.mojom-webui.js';
export interface ComposeboxMatchElement {
    $: {
        iconContainer: HTMLElement;
        image: HTMLElement;
        remove: HTMLElement;
        textContainer: HTMLElement;
    };
}
export declare class ComposeboxMatchElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        /**
         * Whether the match should be rendered in a two-row layout, i.e. with the
         * description (secondary text) rendered below the contents (primary
         * text). Mirrors `AutocompleteMatch::is_two_row_suggestion`, which the
         * handler derives from `SuggestTemplateInfo::secondary_text_placement`.
         */
        isTwoRowSuggestion: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        match: {
            type: ObjectConstructor;
        };
        overrideClampLineNum: {
            type: NumberConstructor;
            reflect: boolean;
        };
        /**
         * Index of the match in the autocomplete result. Used to inform embedder
         * of events such as deletion, click, etc.
         */
        matchIndex: {
            type: NumberConstructor;
        };
        resultSequenceId: {
            type: NumberConstructor;
        };
        toolMode: {
            type: NumberConstructor;
            reflect: boolean;
        };
        removeButtonTitle_: {
            type: StringConstructor;
        };
        richImageSuggestionsEnabled: {
            type: BooleanConstructor;
        };
        suggestStyle: {
            type: StringConstructor;
            reflect: boolean;
            attribute: string;
        };
    };
    accessor isTwoRowSuggestion: boolean;
    accessor match: AutocompleteMatch;
    accessor overrideClampLineNum: number;
    accessor matchIndex: number;
    accessor resultSequenceId: number;
    accessor toolMode: ToolMode;
    accessor richImageSuggestionsEnabled: boolean;
    accessor suggestStyle: string;
    private searchboxHandler_;
    protected accessor removeButtonTitle_: string;
    get isRichImage(): boolean;
    constructor();
    connectedCallback(): void;
    private computeSuggestStyle_;
    willUpdate(changedProperties: PropertyValues<this>): void;
    protected iconPath_(): string;
    protected computeImageUrl_(url: string | undefined): string;
    protected imageStyle_(): string;
    private onMatchFocusin_;
    private onMouseClick_;
    protected onRemoveButtonClick_(e: MouseEvent): void;
    protected onRemoveButtonMousedown_(e: Event): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-composebox-match': ComposeboxMatchElement;
    }
}
