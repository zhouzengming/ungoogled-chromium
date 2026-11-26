// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_url_list_item/cr_url_list_item.js';
import './organizer_list_section_item.js';
import { assert } from '//resources/js/assert.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { getCss } from './organizer_list_section.css.js';
import { getHtml } from './organizer_list_section.html.js';
import { browserProxyFactory } from './organizer_panel.mojom-webui.js';
import { search } from './search_utils.js';
/**
 * This is the number of items in a section that are rendered before the "Show
 * more" option.
 */
export const INITIAL_ITEM_COUNT = 3;
export class OrganizerListSectionElement extends CrLitElement {
    static get is() {
        return 'organizer-list-section';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            delegate: { type: Object },
            items: { type: Array },
            expanded_: {
                type: Boolean,
                reflect: true,
            },
            shouldRenderRemainingItems_: { type: Boolean },
            searchQuery: { type: String },
            filteredItems_: { type: Array },
            filteredSearchQuery_: { type: String },
        };
    }
    browserProxy_ = browserProxyFactory.getInstance();
    #delegate_accessor_storage = null;
    get delegate() { return this.#delegate_accessor_storage; }
    set delegate(value) { this.#delegate_accessor_storage = value; }
    #items_accessor_storage = [];
    get items() { return this.#items_accessor_storage; }
    set items(value) { this.#items_accessor_storage = value; }
    #expanded__accessor_storage = false;
    get expanded_() { return this.#expanded__accessor_storage; }
    set expanded_(value) { this.#expanded__accessor_storage = value; }
    #shouldRenderRemainingItems__accessor_storage = false;
    // True while overflow items should be populated in the DOM (from when
    // expansion starts until the collapse transition finishes).
    get shouldRenderRemainingItems_() { return this.#shouldRenderRemainingItems__accessor_storage; }
    set shouldRenderRemainingItems_(value) { this.#shouldRenderRemainingItems__accessor_storage = value; }
    #searchQuery_accessor_storage = '';
    get searchQuery() { return this.#searchQuery_accessor_storage; }
    set searchQuery(value) { this.#searchQuery_accessor_storage = value; }
    #filteredItems__accessor_storage = [];
    get filteredItems_() { return this.#filteredItems__accessor_storage; }
    set filteredItems_(value) { this.#filteredItems__accessor_storage = value; }
    #filteredSearchQuery__accessor_storage = '';
    // This is the search query that `filteredItems_` currently matches. This
    // ensures that we don't show the full list of elements until after the search
    // has been applied and the list of items has been filtered.
    get filteredSearchQuery_() { return this.#filteredSearchQuery__accessor_storage; }
    set filteredSearchQuery_(value) { this.#filteredSearchQuery__accessor_storage = value; }
    searchOptions_ = {
        includeScore: true,
        includeMatches: true,
        ignoreLocation: false,
        threshold: 0.0,
        distance: 200,
        keys: [
            {
                name: 'title',
                getter: item => item.title,
                weight: 2,
            },
            {
                name: 'description',
                getter: item => item.description?.map(d => d.text),
                weight: 1,
            },
        ],
    };
    // The panel WebUI will remain loaded but invisible when the panel is closed.
    // While invisible, the WebUI will not receive update events from the browser,
    // so all sections need to refetch their data upon visibility change.
    onVisibilityChange_ = () => {
        if (document.visibilityState === 'visible') {
            this.updateItems_();
        }
    };
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('visibilitychange', this.onVisibilityChange_);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('visibilitychange', this.onVisibilityChange_);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('delegate')) {
            this.delegate?.init(this);
            this.updateItems_();
        }
        if (changedProperties.has('items') ||
            changedProperties.has('searchQuery')) {
            this.updateFilteredItems_();
        }
        if (this.expanded_) {
            this.shouldRenderRemainingItems_ = true;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        this.updateExpandButtonAriaExpanded_();
    }
    /**
     * `<cr-url-list-item>` has no `aria-expanded` property, so set the attribute
     * directly on the focusable element it exposes. Awaiting the button's own
     * first update is required: this runs before a newly created child element
     * has rendered its shadow DOM, so its focusable element does not exist yet.
     */
    async updateExpandButtonAriaExpanded_() {
        const expandButton = this.shadowRoot.querySelector('#expandButton');
        if (!expandButton) {
            return;
        }
        await expandButton.updateComplete;
        expandButton.getFocusableElement().setAttribute('aria-expanded', this.expanded_ ? 'true' : 'false');
    }
    onItemsChanged(items) {
        this.items = items;
    }
    async updateItems_() {
        if (!this.delegate) {
            this.items = [];
            return;
        }
        this.items = await this.delegate.getItems();
    }
    async updateFilteredItems_() {
        const query = this.searchQuery;
        if (query.length === 0) {
            this.filteredSearchQuery_ = '';
            this.filteredItems_ = [...this.items];
            return;
        }
        const filteredItems = await search(query, this.items, this.searchOptions_);
        // Confirm that the search query hasn't changed before updating the filtered
        // items.
        if (this.searchQuery === query) {
            this.filteredSearchQuery_ = query;
            this.filteredItems_ = filteredItems;
        }
    }
    isSearching_() {
        return this.filteredSearchQuery_.length > 0;
    }
    getInitialItems_() {
        if (this.isSearching_()) {
            return this.getFilteredItems_();
        }
        return this.getFilteredItems_().slice(0, INITIAL_ITEM_COUNT);
    }
    getRemainingItems_() {
        if (!this.shouldRenderRemainingItems_ || this.isSearching_()) {
            return [];
        }
        return this.getFilteredItems_().slice(INITIAL_ITEM_COUNT);
    }
    hasMoreItems_() {
        return !this.isSearching_() &&
            this.getFilteredItems_().length > INITIAL_ITEM_COUNT;
    }
    hasNoSearchResults_() {
        return this.isSearching_() && this.getFilteredItems_().length === 0;
    }
    getExpandButtonLabel_() {
        return loadTimeData.getString(this.expanded_ ? 'showLess' : 'showMore');
    }
    getExpandButtonIcon_() {
        return this.expanded_ ? 'cr:keyboard-arrow-up' : 'cr:keyboard-arrow-down';
    }
    onExpandButtonClick_() {
        this.expanded_ = !this.expanded_;
    }
    onCollapseTransitionend_(e) {
        if (e.target === e.currentTarget && e.propertyName === 'height' &&
            !this.expanded_) {
            this.shouldRenderRemainingItems_ = false;
        }
    }
    onItemClick_(e) {
        const target = e.currentTarget;
        assert(target.item);
        assert(this.delegate);
        this.delegate.onItemClick(target.item);
        this.browserProxy_.handler.closePanel();
    }
    async onItemActionButtonClick_(e) {
        assert(e.detail.item);
        assert(e.detail.buttonElement);
        assert(this.delegate);
        const itemElement = e.currentTarget;
        await this.delegate.onItemActionButtonClicked?.(e.detail.item, e.detail.buttonElement);
        itemElement.resetActionButtonStateIfNeeded();
    }
    async onItemContextMenuClick_(e) {
        assert(e.detail.item);
        assert(this.delegate);
        await this.delegate.onItemContextMenuClicked?.(e.detail.item, e.detail.x, e.detail.y);
    }
    getFilteredItems_() {
        return this.filteredItems_;
    }
}
customElements.define(OrganizerListSectionElement.is, OrganizerListSectionElement);
