import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_url_list_item/cr_url_list_item.js';
import './organizer_list_section_item.js';
import type { PropertyValues } from '//resources/lit/v3_0/lit.rollup.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import type { OrganizerListSectionClient, OrganizerListSectionDelegate } from './organizer_list_section_delegate.js';
import type { HighlightableOrganizerListSectionItem, OrganizerListSectionItem } from './organizer_list_section_item.js';
/**
 * This is the number of items in a section that are rendered before the "Show
 * more" option.
 */
export declare const INITIAL_ITEM_COUNT = 3;
export interface OrganizerListSectionElement {
    $: {
        header: HTMLElement;
    };
}
export declare class OrganizerListSectionElement extends CrLitElement implements OrganizerListSectionClient {
    static get is(): string;
    static get styles(): import("//resources/lit/v3_0/lit.rollup.js").CSSResultGroup;
    render(): import("//resources/lit/v3_0/lit.rollup.js").TemplateResult<1>;
    static get properties(): {
        delegate: {
            type: ObjectConstructor;
        };
        items: {
            type: ArrayConstructor;
        };
        expanded_: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        shouldRenderRemainingItems_: {
            type: BooleanConstructor;
        };
        searchQuery: {
            type: StringConstructor;
        };
        filteredItems_: {
            type: ArrayConstructor;
        };
        filteredSearchQuery_: {
            type: StringConstructor;
        };
    };
    private browserProxy_;
    accessor delegate: OrganizerListSectionDelegate<unknown> | null;
    accessor items: Array<OrganizerListSectionItem<unknown>>;
    protected accessor expanded_: boolean;
    private accessor shouldRenderRemainingItems_;
    accessor searchQuery: string;
    protected accessor filteredItems_: Array<HighlightableOrganizerListSectionItem<unknown>>;
    protected accessor filteredSearchQuery_: string;
    private searchOptions_;
    private onVisibilityChange_;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changedProperties: PropertyValues<this>): void;
    updated(changedProperties: PropertyValues<this>): void;
    /**
     * `<cr-url-list-item>` has no `aria-expanded` property, so set the attribute
     * directly on the focusable element it exposes. Awaiting the button's own
     * first update is required: this runs before a newly created child element
     * has rendered its shadow DOM, so its focusable element does not exist yet.
     */
    private updateExpandButtonAriaExpanded_;
    onItemsChanged(items: Array<OrganizerListSectionItem<unknown>>): void;
    private updateItems_;
    private updateFilteredItems_;
    private isSearching_;
    protected getInitialItems_(): Array<HighlightableOrganizerListSectionItem<unknown>>;
    protected getRemainingItems_(): Array<HighlightableOrganizerListSectionItem<unknown>>;
    protected hasMoreItems_(): boolean;
    protected hasNoSearchResults_(): boolean;
    protected getExpandButtonLabel_(): string;
    protected getExpandButtonIcon_(): string;
    protected onExpandButtonClick_(): void;
    protected onCollapseTransitionend_(e: TransitionEvent): void;
    protected onItemClick_(e: Event): void;
    protected onItemActionButtonClick_(e: CustomEvent<{
        item: HighlightableOrganizerListSectionItem<unknown>;
        buttonElement: HTMLElement;
    }>): Promise<void>;
    protected onItemContextMenuClick_(e: CustomEvent<{
        item: HighlightableOrganizerListSectionItem<unknown>;
        x: number;
        y: number;
    }>): Promise<void>;
    protected getFilteredItems_(): Array<HighlightableOrganizerListSectionItem<unknown>>;
}
declare global {
    interface HTMLElementTagNameMap {
        'organizer-list-section': OrganizerListSectionElement;
    }
}
