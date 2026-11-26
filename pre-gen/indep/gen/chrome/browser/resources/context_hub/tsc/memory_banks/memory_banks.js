// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_action_menu/cr_action_menu.js';
import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_checkbox/cr_checkbox.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_elements/cr_search_field/cr_search_field.js';
import '//resources/cr_elements/icons.html.js';
import '../icons.html.js';
import './memory_banks_edit_dialog.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { browserProxyFactory, EntryType } from '../context_hub.mojom-webui.js';
import { getCss } from './memory_banks.css.js';
import { getHtml } from './memory_banks.html.js';
import { computeSuggestions, matchesMemoryBankEntry, parseSearchQuery } from './memory_banks_search.js';
function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
    if (!content) {
        return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
export class MemoryBanksElement extends CrLitElement {
    static get is() {
        return 'memory-banks';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            entries: { type: Array },
            selectedIds: { type: Object },
            searchQuery: { type: String },
            selectedCollections_: { type: Object, state: true },
            selectedTags_: { type: Object, state: true },
            activeFilterMenu_: { type: String, state: true },
            availableCollections_: { type: Array, state: true },
            availableTags_: { type: Array, state: true },
            filteredEntries_: { type: Array, state: true },
            geminiResponse_: { type: String, state: true },
            isAskingGemini_: { type: Boolean, state: true },
            showGeminiPanel_: { type: Boolean, state: true },
            editingEntry_: { type: Object, state: true },
            searchSuggestions_: { type: Array, state: true },
            highlightedSuggestionIndex_: { type: Number, state: true },
        };
    }
    #entries_accessor_storage = [];
    get entries() { return this.#entries_accessor_storage; }
    set entries(value) { this.#entries_accessor_storage = value; }
    #selectedIds_accessor_storage = new Set();
    get selectedIds() { return this.#selectedIds_accessor_storage; }
    set selectedIds(value) { this.#selectedIds_accessor_storage = value; }
    #searchQuery_accessor_storage = '';
    get searchQuery() { return this.#searchQuery_accessor_storage; }
    set searchQuery(value) { this.#searchQuery_accessor_storage = value; }
    #selectedCollections__accessor_storage = new Set();
    // The collections / tags checked in the chip filters; when non-empty, only
    // entries matching at least one selected value are shown. `''` is the
    // "No collection" / "No tags" bucket. Everything starts out unchecked
    // (no filter applied, all entries shown).
    get selectedCollections_() { return this.#selectedCollections__accessor_storage; }
    set selectedCollections_(value) { this.#selectedCollections__accessor_storage = value; }
    #selectedTags__accessor_storage = new Set();
    get selectedTags_() { return this.#selectedTags__accessor_storage; }
    set selectedTags_(value) { this.#selectedTags__accessor_storage = value; }
    #activeFilterMenu__accessor_storage = null;
    get activeFilterMenu_() { return this.#activeFilterMenu__accessor_storage; }
    set activeFilterMenu_(value) { this.#activeFilterMenu__accessor_storage = value; }
    #availableCollections__accessor_storage = [];
    get availableCollections_() { return this.#availableCollections__accessor_storage; }
    set availableCollections_(value) { this.#availableCollections__accessor_storage = value; }
    #availableTags__accessor_storage = [];
    get availableTags_() { return this.#availableTags__accessor_storage; }
    set availableTags_(value) { this.#availableTags__accessor_storage = value; }
    #filteredEntries__accessor_storage = [];
    get filteredEntries_() { return this.#filteredEntries__accessor_storage; }
    set filteredEntries_(value) { this.#filteredEntries__accessor_storage = value; }
    #geminiResponse__accessor_storage = '';
    get geminiResponse_() { return this.#geminiResponse__accessor_storage; }
    set geminiResponse_(value) { this.#geminiResponse__accessor_storage = value; }
    #isAskingGemini__accessor_storage = false;
    get isAskingGemini_() { return this.#isAskingGemini__accessor_storage; }
    set isAskingGemini_(value) { this.#isAskingGemini__accessor_storage = value; }
    #showGeminiPanel__accessor_storage = false;
    get showGeminiPanel_() { return this.#showGeminiPanel__accessor_storage; }
    set showGeminiPanel_(value) { this.#showGeminiPanel__accessor_storage = value; }
    #editingEntry__accessor_storage = null;
    get editingEntry_() { return this.#editingEntry__accessor_storage; }
    set editingEntry_(value) { this.#editingEntry__accessor_storage = value; }
    #searchSuggestions__accessor_storage = [];
    get searchSuggestions_() { return this.#searchSuggestions__accessor_storage; }
    set searchSuggestions_(value) { this.#searchSuggestions__accessor_storage = value; }
    #highlightedSuggestionIndex__accessor_storage = -1;
    get highlightedSuggestionIndex_() { return this.#highlightedSuggestionIndex__accessor_storage; }
    set highlightedSuggestionIndex_(value) { this.#highlightedSuggestionIndex__accessor_storage = value; }
    activeMenuEntry_ = null;
    connectedCallback() {
        super.connectedCallback();
        this.fetchEntries();
        document.addEventListener('pointerdown', this.onDocumentPointerDown_);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('pointerdown', this.onDocumentPointerDown_);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedProperties.has('entries')) {
            this.availableCollections_ = this.computeAvailableCollections_();
            this.availableTags_ = this.computeAvailableTags_();
            this.selectedCollections_ = new Set(this.availableCollections_.filter(c => this.selectedCollections_.has(c)));
            this.selectedTags_ =
                new Set(this.availableTags_.filter(t => this.selectedTags_.has(t)));
        }
        if (changedProperties.has('entries') ||
            changedProperties.has('searchQuery') ||
            changedPrivateProperties.has('selectedCollections_') ||
            changedPrivateProperties.has('selectedTags_')) {
            this.filteredEntries_ = this.computeFilteredEntries_();
            // Drop selections that are no longer visible, so bulk actions (copy,
            // download, delete, Ask Gemini) never act on entries the user can't see.
            const visibleIds = new Set(this.filteredEntries_.map(entry => entry.id));
            const nextSelectedIds = new Set(Array.from(this.selectedIds).filter(id => visibleIds.has(id)));
            if (nextSelectedIds.size !== this.selectedIds.size) {
                this.selectedIds = nextSelectedIds;
            }
        }
    }
    async fetchEntries() {
        const { entries } = await browserProxyFactory.getInstance()
            .handler.getAllMemoryBankEntries();
        this.entries = entries;
    }
    computeAvailableCollections_() {
        const set = new Set();
        let hasUncollected = false;
        for (const entry of this.entries) {
            if (entry.collection) {
                set.add(entry.collection);
            }
            else {
                hasUncollected = true;
            }
        }
        const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));
        if (hasUncollected) {
            sorted.unshift('');
        }
        return sorted;
    }
    computeAvailableTags_() {
        const set = new Set();
        let hasUntagged = false;
        for (const entry of this.entries) {
            if (!entry.tags || entry.tags.length === 0) {
                hasUntagged = true;
            }
            else {
                for (const tag of entry.tags) {
                    if (tag) {
                        set.add(tag);
                    }
                }
            }
        }
        const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));
        if (hasUntagged) {
            sorted.unshift('');
        }
        return sorted;
    }
    computeFilteredEntries_() {
        const query = this.searchQuery.trim();
        if (query) {
            const parsed = parseSearchQuery(query);
            return this.entries.filter(entry => matchesMemoryBankEntry(entry, parsed));
        }
        let result = this.entries;
        // `''` represents the "No collection" / "No tags" bucket for entries
        // without those annotations.
        if (this.isCollectionFilterActive_()) {
            result = result.filter(entry => this.selectedCollections_.has(entry.collection || ''));
        }
        if (this.isTagFilterActive_()) {
            result = result.filter(entry => !entry.tags || entry.tags.length === 0 ?
                this.selectedTags_.has('') :
                entry.tags.some(tag => this.selectedTags_.has(tag)));
        }
        return result;
    }
    onFilterChipClick_(e) {
        e.stopPropagation();
        const target = e.currentTarget;
        const type = target.dataset['type'];
        this.activeFilterMenu_ = this.activeFilterMenu_ === type ? null : type;
    }
    getSelectedCollectionCount_() {
        return this.selectedCollections_.size;
    }
    isCollectionFilterActive_() {
        return this.selectedCollections_.size > 0;
    }
    isAllCollectionsSelected_() {
        return this.selectedCollections_.size === 0;
    }
    isCollectionSelected_(collection) {
        return this.selectedCollections_.has(collection);
    }
    onToggleAllCollectionsChange_(e) {
        const checkbox = e.currentTarget;
        checkbox.checked = true;
        this.selectedCollections_ = new Set();
    }
    onCollectionCheckboxChange_(e) {
        const checkbox = e.currentTarget;
        const collection = checkbox.dataset['collection'] ?? '';
        const updated = new Set(this.selectedCollections_);
        if (checkbox.checked) {
            updated.add(collection);
        }
        else {
            updated.delete(collection);
        }
        this.selectedCollections_ = updated;
    }
    getSelectedTagCount_() {
        return this.selectedTags_.size;
    }
    isTagFilterActive_() {
        return this.selectedTags_.size > 0;
    }
    isAllTagsSelected_() {
        return this.selectedTags_.size === 0;
    }
    isTagSelected_(tag) {
        return this.selectedTags_.has(tag);
    }
    onToggleAllTagsChange_(e) {
        const checkbox = e.currentTarget;
        checkbox.checked = true;
        this.selectedTags_ = new Set();
    }
    onTagCheckboxChange_(e) {
        const checkbox = e.currentTarget;
        const tag = checkbox.dataset['tag'] ?? '';
        const updated = new Set(this.selectedTags_);
        if (checkbox.checked) {
            updated.add(tag);
        }
        else {
            updated.delete(tag);
        }
        this.selectedTags_ = updated;
    }
    onFilterDropdownKeydown_(e) {
        if (e.key === 'Escape' && this.activeFilterMenu_) {
            e.preventDefault();
            e.stopPropagation();
            this.activeFilterMenu_ = null;
        }
    }
    onDocumentPointerDown_ = (e) => {
        if (!this.activeFilterMenu_) {
            return;
        }
        const isInsideChipWrapper = e.composedPath().some(el => el instanceof HTMLElement &&
            el.classList.contains('filter-chip-wrapper'));
        if (!isInsideChipWrapper) {
            this.activeFilterMenu_ = null;
        }
    };
    onMoreActionsClick_(entry, e) {
        e.preventDefault();
        e.stopPropagation();
        this.activeMenuEntry_ = entry;
        const target = e.currentTarget;
        this.$.actionMenu.showAt(target);
    }
    onMenuEditClick_() {
        this.$.actionMenu.close();
        this.editingEntry_ = this.activeMenuEntry_;
        this.activeMenuEntry_ = null;
    }
    async onMenuDeleteClick_() {
        this.$.actionMenu.close();
        if (this.activeMenuEntry_) {
            const id = this.activeMenuEntry_.id;
            this.activeMenuEntry_ = null;
            await this.deleteEntries_([id]);
        }
    }
    onEditDialogClose_() {
        this.editingEntry_ = null;
    }
    onEntryAnnotationsUpdated_(e) {
        const { id, collection, note, tags } = e.detail;
        this.entries = this.entries.map(entry => entry.id === id ? { ...entry, collection, note, tags } : entry);
        this.editingEntry_ = null;
    }
    convertMojoTimeToDate(mojoTime) {
        // Mojo Time represents microseconds since the Windows epoch (January 1,
        // 1601). JavaScript Date expects milliseconds since the Unix epoch (January
        // 1, 1970).
        // 11,644,473,600,000,000n is the Windows-to-Unix epoch delta in
        // microseconds.
        const unixEpochUs = mojoTime.internalValue - 11644473600000000n;
        return new Date(Number(unixEpochUs / 1000n));
    }
    isSelected(id) {
        return this.selectedIds.has(id);
    }
    isAllSelected_() {
        const filtered = this.filteredEntries_;
        return filtered.length > 0 &&
            filtered.every(entry => this.selectedIds.has(entry.id));
    }
    isSomeSelected_() {
        if (this.selectedIds.size === 0) {
            return false;
        }
        const filtered = this.filteredEntries_;
        const filteredSelected = filtered.filter(entry => this.selectedIds.has(entry.id));
        return filteredSelected.length > 0 &&
            filteredSelected.length < filtered.length;
    }
    onCheckboxClick(e) {
        e.stopPropagation();
    }
    onCheckboxChange(e) {
        const checkbox = e.target;
        const id = BigInt(checkbox.dataset['id']);
        const updated = new Set(this.selectedIds);
        if (checkbox.checked) {
            updated.add(id);
        }
        else {
            updated.delete(id);
        }
        this.selectedIds = updated;
    }
    onSelectAllChange_(e) {
        const checkbox = e.target;
        if (checkbox.checked) {
            this.selectedIds = new Set(this.filteredEntries_.map(entry => entry.id));
        }
        else {
            this.selectedIds = new Set();
        }
    }
    get searchField_() {
        return this.shadowRoot?.querySelector('#search-field') ??
            null;
    }
    updateSuggestions_(input = this.searchQuery) {
        this.searchSuggestions_ = computeSuggestions(input, this.availableTags_.filter(Boolean), this.availableCollections_.filter(Boolean));
        this.highlightedSuggestionIndex_ = -1;
    }
    closeSuggestions_() {
        this.searchSuggestions_ = [];
        this.highlightedSuggestionIndex_ = -1;
    }
    onSearchFocusin_() {
        this.updateSuggestions_();
    }
    onSearchFocusout_(e) {
        const relatedTarget = e.relatedTarget;
        if (relatedTarget && this.shadowRoot?.contains(relatedTarget)) {
            return;
        }
        this.closeSuggestions_();
    }
    onSearchChanged_(e) {
        this.searchQuery = e.detail;
        this.selectedIds = new Set();
        this.updateSuggestions_(this.searchQuery);
    }
    onSearchKeydown_(e) {
        if (this.searchSuggestions_.length === 0) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                this.updateSuggestions_();
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            // Highlight the next suggestion. If unselected (-1), highlights the first
            // item (0). If at the bottom, wraps back to the top.
            this.highlightedSuggestionIndex_ =
                (this.highlightedSuggestionIndex_ + 1) %
                    this.searchSuggestions_.length;
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            // Highlight the previous suggestion. If unselected (-1) or already at
            // the top (0), wraps around to the last item.
            this.highlightedSuggestionIndex_ = this.highlightedSuggestionIndex_ <= 0 ?
                this.searchSuggestions_.length - 1 :
                this.highlightedSuggestionIndex_ - 1;
        }
        else if (e.key === 'Enter' || e.key === 'Tab') {
            const selected = this.searchSuggestions_[this.highlightedSuggestionIndex_];
            if (selected) {
                e.preventDefault();
                this.applySuggestion_(selected);
            }
            else if (e.key === 'Enter') {
                this.closeSuggestions_();
            }
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            this.closeSuggestions_();
        }
    }
    async applySuggestion_(suggestion) {
        this.setSearchQuery_(suggestion.query);
        if (suggestion.query.trim().endsWith(':')) {
            this.updateSuggestions_(suggestion.query);
        }
        else {
            this.closeSuggestions_();
        }
        await this.updateComplete;
        this.searchField_?.getSearchInput().focus();
    }
    onSuggestionMousedown_(e) {
        e.preventDefault();
        const target = e.currentTarget;
        const index = Number(target.dataset['index']);
        const suggestion = this.searchSuggestions_[index];
        if (suggestion) {
            this.applySuggestion_(suggestion);
        }
    }
    setSearchQuery_(newQuery) {
        this.searchQuery = newQuery;
        this.searchField_?.setValue(newQuery, /*noEvent=*/ true);
        this.selectedIds = new Set();
    }
    async onCopyClick_() {
        const textToCopy = this.getSelectedEntriesAsText_();
        try {
            await navigator.clipboard.writeText(textToCopy);
        }
        catch (err) {
            console.error('Failed to copy: ', err);
        }
    }
    onDownloadSelectedEntriesClick_() {
        downloadFile('memory_banks_entries.txt', this.getSelectedEntriesAsText_());
    }
    onDownloadGeminiResponseClick_() {
        downloadFile('gemini_response.md', this.geminiResponse_, 'text/markdown;charset=utf-8');
    }
    async onDeleteClick_() {
        await this.deleteEntries_(Array.from(this.selectedIds));
    }
    async deleteEntries_(ids) {
        await browserProxyFactory.getInstance().handler.deleteMemoryBankEntries(ids);
        const updated = new Set(this.selectedIds);
        for (const id of ids) {
            updated.delete(id);
        }
        this.selectedIds = updated;
        await this.fetchEntries();
    }
    onAskGeminiClick_() {
        this.showGeminiPanel_ = !this.showGeminiPanel_;
    }
    onClosePanelClick_() {
        this.showGeminiPanel_ = false;
        this.geminiResponse_ = '';
    }
    onCloseResponseClick_() {
        this.geminiResponse_ = '';
    }
    async onQuickOptionClick_(e) {
        const target = e.currentTarget;
        const action = target.dataset['option'];
        if (!action || this.selectedIds.size === 0 || this.isAskingGemini_) {
            return;
        }
        this.isAskingGemini_ = true;
        this.geminiResponse_ = '';
        const memoryBankEntryIds = Array.from(this.selectedIds);
        try {
            const { response } = await browserProxyFactory.getInstance().handler.askGeminiWithContext(action, memoryBankEntryIds, /*save_to_history=*/ false);
            this.geminiResponse_ = response ? response.content : '';
        }
        catch (err) {
            console.error('Failed to ask Gemini:', err);
            this.geminiResponse_ = 'Error generating response from Gemini.';
        }
        finally {
            this.isAskingGemini_ = false;
        }
    }
    getSelectedEntriesAsText_() {
        return this.entries.filter(entry => this.selectedIds.has(entry.id))
            .map(entry => {
            const dateStr = this.convertMojoTimeToDate(entry.timestamp).toLocaleString();
            const typeStr = entry.type === EntryType.kTextSelection ?
                'Saved Text' :
                'Saved Tab';
            const lines = [
                `[${typeStr}]`,
                `Title: ${entry.tabTitle}`,
                `URL: ${entry.url}`,
            ];
            if (entry.collection) {
                lines.push(`Collection: ${entry.collection}`);
            }
            if (entry.tags && entry.tags.length > 0) {
                lines.push(`Tags: ${entry.tags.join(', ')}`);
            }
            if (entry.note) {
                lines.push(`Note: "${entry.note}"`);
            }
            if (entry.selectedText) {
                lines.push(`Content: "${entry.selectedText}"`);
            }
            lines.push(`Saved Date: ${dateStr}`);
            return lines.join('\n');
        })
            .join('\n\n---\n\n');
    }
}
customElements.define(MemoryBanksElement.is, MemoryBanksElement);
