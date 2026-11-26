import './searchbox_icon.js';
import './searchbox_action.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import type { AutocompleteMatch, OmniboxPopupSelection } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { SideType } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import type { SearchboxIconElement } from './searchbox_icon.js';
export declare const kDefaultSelection: OmniboxPopupSelection;
type ActionEvent = CustomEvent<{
    event: PointerEvent | KeyboardEvent;
    actionIndex: number;
}>;
export interface SearchboxMatchElement {
    $: {
        icon: SearchboxIconElement;
        contents: HTMLElement;
        description: HTMLElement;
        remove: HTMLElement;
        separator: HTMLElement;
        focusIndicator: HTMLElement;
    };
}
export declare class SearchboxMatchElement extends CrLitElement {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        /** Element's 'aria-label' attribute. */
        ariaLabel: {
            type: StringConstructor;
            reflect: boolean;
        };
        hasAction: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        showContextualDescription: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /**
         * Whether the match features an image (as opposed to an icon or favicon).
         */
        hasImage: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        hasKeywordChip: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /**
         * Whether the match is an entity suggestion (with or without an image).
         */
        isEntitySuggestion: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /**
         * Whether the match should be rendered in a two-row layout. Currently
         * limited to matches that feature an image, calculator, and answers.
         */
        isTwoRowSuggestion: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        match: {
            type: ObjectConstructor;
        };
        selection: {
            type: ObjectConstructor;
        };
        /**
         * Index of the match in the autocomplete result. Used to inform embedder
         * of events such as deletion, click, etc.
         */
        matchIndex: {
            type: NumberConstructor;
        };
        showThumbnail: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        showEllipsis: {
            type: BooleanConstructor;
        };
        sideType: {
            type: NumberConstructor;
        };
        virtualFocusEnabled: {
            type: BooleanConstructor;
        };
        resultSequenceId: {
            type: NumberConstructor;
        };
        isContextualSuggestion_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        isTopChromeSearchbox_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        isLensSearchbox_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        forceHideEllipsis_: {
            type: BooleanConstructor;
        };
        /** Rendered match contents based on autocomplete provided styling. */
        contentsHtml_: {
            type: StringConstructor;
        };
        /** Rendered match description based on autocomplete provided styling. */
        descriptionHtml_: {
            type: StringConstructor;
        };
        enableCsbMotionTweaks_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        /** Remove button's 'aria-label' attribute. */
        removeButtonAriaLabel_: {
            type: StringConstructor;
        };
        removeButtonTitle_: {
            type: StringConstructor;
        };
        /** Used to separate the contents from the description. */
        separatorText_: {
            type: StringConstructor;
        };
        /** Rendered tail suggest common prefix. */
        tailSuggestPrefix_: {
            type: StringConstructor;
        };
    };
    accessor ariaLabel: string;
    accessor hasAction: boolean;
    accessor showContextualDescription: boolean;
    accessor hasImage: boolean;
    accessor hasKeywordChip: boolean;
    accessor isEntitySuggestion: boolean;
    accessor isTwoRowSuggestion: boolean;
    accessor match: AutocompleteMatch;
    accessor selection: OmniboxPopupSelection;
    accessor matchIndex: number;
    accessor sideType: SideType;
    accessor showThumbnail: boolean;
    accessor showEllipsis: boolean;
    accessor virtualFocusEnabled: boolean;
    accessor resultSequenceId: number;
    private accessor isContextualSuggestion_;
    private accessor isTopChromeSearchbox_;
    private accessor isLensSearchbox_;
    private accessor forceHideEllipsis_;
    protected accessor contentsHtml_: TrustedHTML;
    protected accessor descriptionHtml_: TrustedHTML;
    protected accessor enableCsbMotionTweaks_: boolean;
    protected accessor removeButtonAriaLabel_: string;
    protected accessor removeButtonTitle_: string;
    protected accessor separatorText_: string;
    protected accessor tailSuggestPrefix_: string;
    private pageHandler_;
    constructor();
    willUpdate(changedProperties: PropertyValues<this>): void;
    firstUpdated(): void;
    updated(changedProperties: PropertyValues<this>): void;
    private updateAriaLabel_;
    protected onKeywordExecuteAction_(e: ActionEvent): void;
    /**
     * containing index of the action that was removed as well as modifier key
     * presses.
     */
    protected onExecuteAction_(e: ActionEvent): void;
    private onMatchClick_;
    private onMatchFocusin_;
    private onMatchMouseDown_;
    protected onRemoveButtonClick_(e: MouseEvent): void;
    protected onRemoveButtonMousedown_(e: Event): void;
    private computeAriaLabel_;
    /**
     * Sanitizes .innerHTML from `renderTextWithClassifications_()` through
     * `sanitizeInnerHtml` to ensure it only contains allowed tags.
     * @param innerHtml The .innerHTML from `renderTextWithClassifications_()`
     * @return Sanitized TrustedHTML safe for rendering
     */
    private sanitizeInnerHtml_;
    private computeContentsHtml_;
    private computeDescriptionHtml_;
    private computeHasAction_;
    private computeHasKeywordChip_;
    private computeHasImage_;
    private computeIsContextualSuggestion_;
    private computeIsEntitySuggestion_;
    private computeIsTwoRowSuggestion_;
    private computeRemoveButtonAriaLabel_;
    private computeSeparatorText_;
    private computeTailSuggestPrefix_;
    private computeShowEllipsis_;
    /**
     * Decodes the AcMatchClassificationStyle entries encoded in the given
     * ACMatchClassification style field, maps each entry to a CSS
     * class and returns them.
     */
    private convertClassificationStyleToCssClasses_;
    private createSpanWithClasses_;
    /**
     * Renders |text| based on the given ACMatchClassification(s)
     * Each classification contains an 'offset' and an encoded list of styles for
     * styling a substring starting with the 'offset' and ending with the next.
     * @return A <span> with <span> children for each styled substring.
     */
    private renderTextWithClassifications_;
    private getMatchContents_;
    private getMatchDescription_;
    private getMatchContentsClassifications_;
    private getMatchDescriptionClassifications_;
    protected getFocusIndicatorCssClass_(): string;
    protected getKeywordCssClass_(): string;
    protected getActionCssClass_(actionIndex: number): string;
    protected getRemoveCssClass_(): string;
}
declare global {
    interface HTMLElementTagNameMap {
        'cr-searchbox-match': SearchboxMatchElement;
    }
}
export {};
