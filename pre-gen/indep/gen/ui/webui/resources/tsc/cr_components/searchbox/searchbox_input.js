// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import './searchbox_icon.js';
import { I18nMixinLit } from '//resources/cr_elements/i18n_mixin_lit.js';
import { assert } from '//resources/js/assert.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { MetricsReporterImpl } from '//resources/js/metrics_reporter/metrics_reporter.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { KeywordType } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { SearchboxBrowserProxy } from './searchbox_browser_proxy.js';
import { getCss } from './searchbox_input.css.js';
import { getHtml } from './searchbox_input.html.js';
import { afterNextPaint, announce, markOnce } from './utils.js';
// Register --placeholder-opacity as type <number> so that we can animate it.
CSS.registerProperty({
    name: '--placeholder-opacity',
    syntax: '<number>',
    initialValue: '1',
    inherits: true,
});
const MULTILINE_INPUT_HEIGHT_THRESHOLD = 48;
const SearchboxInputElementBase = I18nMixinLit(CrLitElement);
export class SearchboxInputElement extends SearchboxInputElementBase {
    static get is() {
        return 'cr-searchbox-input';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            dropdownIsVisible: { type: Boolean, reflect: true },
            inputAriaLive: { type: String },
            multiLineEnabled: { type: Boolean, reflect: true },
            singleLineOnInlineAutocomplete: { type: Boolean },
            forceSingleLine_: { type: Boolean, reflect: true, attribute: 'force-single-line' },
            showEllipsis_: { type: Boolean, reflect: true, attribute: 'show-ellipsis' },
            hasInlineSelection_: { type: Boolean, reflect: true, attribute: 'has-inline-selection' },
            placeholderText: { type: String },
            searchboxAriaDescription: { type: String },
            searchboxIcon: { type: String },
            selectedMatch: { type: Object },
            /**
             * The URL of the current webpage when focused in the searchbox before
             * typing, used to load the page's favicon. Empty when typing, on the NTP,
             * or for consumers that do not provide a page URL.
             */
            pageUrl: { type: String },
            inputKeywordModel: { type: Object },
            inputHasMatches: { type: Boolean },
            allowFilePaste: { type: Boolean },
        };
    }
    #dropdownIsVisible_accessor_storage = false;
    get dropdownIsVisible() { return this.#dropdownIsVisible_accessor_storage; }
    set dropdownIsVisible(value) { this.#dropdownIsVisible_accessor_storage = value; }
    #inputAriaLive_accessor_storage = '';
    get inputAriaLive() { return this.#inputAriaLive_accessor_storage; }
    set inputAriaLive(value) { this.#inputAriaLive_accessor_storage = value; }
    #multiLineEnabled_accessor_storage = false;
    get multiLineEnabled() { return this.#multiLineEnabled_accessor_storage; }
    set multiLineEnabled(value) { this.#multiLineEnabled_accessor_storage = value; }
    #singleLineOnInlineAutocomplete_accessor_storage = false;
    get singleLineOnInlineAutocomplete() { return this.#singleLineOnInlineAutocomplete_accessor_storage; }
    set singleLineOnInlineAutocomplete(value) { this.#singleLineOnInlineAutocomplete_accessor_storage = value; }
    #forceSingleLine__accessor_storage = false;
    get forceSingleLine_() { return this.#forceSingleLine__accessor_storage; }
    set forceSingleLine_(value) { this.#forceSingleLine__accessor_storage = value; }
    #showEllipsis__accessor_storage = false;
    get showEllipsis_() { return this.#showEllipsis__accessor_storage; }
    set showEllipsis_(value) { this.#showEllipsis__accessor_storage = value; }
    #hasInlineSelection__accessor_storage = false;
    get hasInlineSelection_() { return this.#hasInlineSelection__accessor_storage; }
    set hasInlineSelection_(value) { this.#hasInlineSelection__accessor_storage = value; }
    #placeholderText_accessor_storage = undefined;
    get placeholderText() { return this.#placeholderText_accessor_storage; }
    set placeholderText(value) { this.#placeholderText_accessor_storage = value; }
    #searchboxAriaDescription_accessor_storage = '';
    get searchboxAriaDescription() { return this.#searchboxAriaDescription_accessor_storage; }
    set searchboxAriaDescription(value) { this.#searchboxAriaDescription_accessor_storage = value; }
    #searchboxIcon_accessor_storage = '';
    get searchboxIcon() { return this.#searchboxIcon_accessor_storage; }
    set searchboxIcon(value) { this.#searchboxIcon_accessor_storage = value; }
    #selectedMatch_accessor_storage = null;
    get selectedMatch() { return this.#selectedMatch_accessor_storage; }
    set selectedMatch(value) { this.#selectedMatch_accessor_storage = value; }
    #pageUrl_accessor_storage = '';
    get pageUrl() { return this.#pageUrl_accessor_storage; }
    set pageUrl(value) { this.#pageUrl_accessor_storage = value; }
    #inputKeywordModel_accessor_storage = null;
    get inputKeywordModel() { return this.#inputKeywordModel_accessor_storage; }
    set inputKeywordModel(value) { this.#inputKeywordModel_accessor_storage = value; }
    #inputHasMatches_accessor_storage = false;
    get inputHasMatches() { return this.#inputHasMatches_accessor_storage; }
    set inputHasMatches(value) { this.#inputHasMatches_accessor_storage = value; }
    #allowFilePaste_accessor_storage = false;
    get allowFilePaste() { return this.#allowFilePaste_accessor_storage; }
    set allowFilePaste(value) { this.#allowFilePaste_accessor_storage = value; }
    callbackRouter_;
    inputTextChangedListenerId_ = null;
    lastInput_ = { text: '', inline: '' };
    lastUserInput_ = '';
    isDeletingInput_ = false;
    pastedInInput_ = false;
    resizeObserver_ = null;
    onDocumentSelectionChangeBound_ = () => this.updateEllipsisState_();
    // Bumped by each `setSelectionA11yLabel()` call, so that a deferred
    // notification can tell whether it has been superseded.
    selectionA11yLabelGeneration_ = 0;
    // Whether a selection label's notification is deferred and still pending.
    selectionA11yLabelPending_ = false;
    constructor() {
        super();
        this.callbackRouter_ = SearchboxBrowserProxy.getInstance().callbackRouter;
    }
    connectedCallback() {
        super.connectedCallback();
        this.inputTextChangedListenerId_ =
            this.callbackRouter_.setInputText.addListener(this.onSetInputText_.bind(this));
        document.addEventListener('selectionchange', this.onDocumentSelectionChangeBound_);
        this.setupResizeObserver_();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        assert(this.inputTextChangedListenerId_);
        this.callbackRouter_.removeListener(this.inputTextChangedListenerId_);
        document.removeEventListener('selectionchange', this.onDocumentSelectionChangeBound_);
        if (this.resizeObserver_) {
            this.resizeObserver_.disconnect();
            this.resizeObserver_ = null;
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('inputKeywordModel')) {
            this.toggleAttribute('in-keyword-mode', this.inKeywordMode_());
        }
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.setupResizeObserver_();
    }
    setupResizeObserver_() {
        if (!this.resizeObserver_) {
            this.resizeObserver_ = new ResizeObserver(() => {
                this.updateEllipsisState_();
            });
        }
        if (this.$.input) {
            this.resizeObserver_.observe(this.$.input);
        }
    }
    get inputElement() {
        assert(this.$.input);
        return this.$.input;
    }
    focus() {
        assert(this.$.input);
        this.$.input.focus();
    }
    blur() {
        assert(this.$.input);
        this.$.input.blur();
    }
    select() {
        assert(this.$.input);
        this.$.input.select();
    }
    setSelectionRange(start, end, direction) {
        assert(this.$.input);
        this.$.input.setSelectionRange(start, end, direction);
    }
    getInputValue() {
        assert(this.$.input);
        return this.$.input.value;
    }
    setInputText(text) {
        markOnce('SearchboxInputElement::setInputText:StartupStart');
        this.onSetInputText_(text);
        if (markOnce('SearchboxInputElement::setInputText:StartupEnd')) {
            // Records a user timing mark after the initial startup input text has
            // been painted and presented to the display.
            afterNextPaint(() => {
                markOnce('SearchboxInputElement::setInputText:StartupRendered');
            });
        }
    }
    setInput(update) {
        this.updateInput_(update);
    }
    lastInput() {
        return this.lastInput_;
    }
    /**
     * While a selection is active, the input's value previews it. Screen readers
     * narrate that value change, drowning out the selection's own announcement.
     * Like the WebUI toolbar's readonly omnibox, this distracts them from the
     * input by pointing aria-activedescendant at an offscreen element, then
     * notifies the label, so that is all they narrate. The distraction has no
     * role of its own, so screen reader focus stays on the input. This is the
     * only narration of selection changes, so callers must not announce the
     * label by other means too. Pass an empty string to narrate the input itself
     * again, e.g. when the user edits.
     */
    setSelectionA11yLabel(label) {
        const input = this.inputElement;
        const distraction = this.$.selectionAnnouncement;
        const wasDistracted = input.ariaActiveDescendantElement === distraction;
        distraction.textContent = label;
        input.ariaActiveDescendantElement = label ? distraction : null;
        const generation = ++this.selectionA11yLabelGeneration_;
        if (!label) {
            this.selectionA11yLabelPending_ = false;
            return;
        }
        if (wasDistracted && !this.selectionA11yLabelPending_) {
            announce(this, label);
            return;
        }
        // Pointing aria-activedescendant at the distraction is reported to screen
        // readers as a focus change. Notify once that has gone out with the next
        // accessibility tree update, so that whatever they make of the focus
        // change, the label is what they narrate last.
        this.selectionA11yLabelPending_ = true;
        afterNextPaint(() => {
            if (generation !== this.selectionA11yLabelGeneration_) {
                return; // Superseded by a newer label, or cancelled by an edit.
            }
            this.selectionA11yLabelPending_ = false;
            announce(this, label);
        });
    }
    isMultiline() {
        if (!this.$.input) {
            return false;
        }
        if (this.forceSingleLine_) {
            return false;
        }
        return this.multiLineEnabled &&
            this.$.input.scrollHeight > MULTILINE_INPUT_HEIGHT_THRESHOLD;
    }
    preventInlineAutocomplete(input) {
        const caretNotAtEnd = this.$.input ? this.$.input.selectionStart !== input.length : false;
        return this.isDeletingInput_ || this.pastedInInput_ || caretNotAtEnd;
    }
    //============================================================================
    // Callbacks
    //============================================================================
    onSetInputText_(inputText) {
        this.updateInput_({ text: inputText, inline: '' });
    }
    //============================================================================
    // Event handlers
    //============================================================================
    onInputFocus_() {
        this.updateEllipsisState_();
    }
    onInputBlur_() {
        this.setSelectionA11yLabel('');
        this.updateEllipsisState_();
    }
    onInputCopy_(e) {
        this.onInputCutCopy_(e);
    }
    onInputCut_(e) {
        this.onInputCutCopy_(e);
    }
    onInputCutCopy_(e) {
        // Only handle cut/copy when input has content and it's all selected.
        if (!this.$.input.value || this.$.input.selectionStart !== 0 ||
            this.$.input.selectionEnd !== this.$.input.value.length ||
            !this.inputHasMatches) {
            return;
        }
        if (this.selectedMatch && !this.selectedMatch.isSearchType) {
            e.clipboardData.setData('text/plain', this.selectedMatch.destinationUrl);
            e.preventDefault();
            if (e.type === 'cut') {
                this.updateInput_({ text: '', inline: '' });
                this.fire('searchbox-input-text-updated', {
                    value: '',
                    isComposing: false,
                    event: e,
                });
            }
        }
    }
    onInputInput_(e) {
        const inputValue = this.$.input.value;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        if (lastInputValue === inputValue) {
            return;
        }
        // The user is editing, so narrate the input itself.
        this.setSelectionA11yLabel('');
        this.updateInput_({ text: inputValue, inline: '' });
        // Record a user timing mark if the input has content.
        if (inputValue.length > 0 &&
            markOnce('SearchboxInputElement::onInputInput_:HasContent')) {
            // Records a user timing mark after the user's typed character echo and
            // trailing caret have been painted to the display.
            afterNextPaint(() => {
                markOnce('SearchboxInputElement::onInputInput_:ContentRendered');
            });
        }
        this.fire('searchbox-input-text-updated', {
            value: inputValue,
            isComposing: e.isComposing,
            event: e,
        });
        // If a character has been typed, mark 'CharTyped'. Otherwise clear it. If
        // 'CharTyped' mark already exists, there's a pending typed character for
        // which the results have not been painted yet. In that case, keep the
        // earlier mark.
        if (loadTimeData.getBoolean('reportMetrics')) {
            const charTyped = !this.isDeletingInput_ && !!inputValue.trim();
            const metricsReporter = MetricsReporterImpl.getInstance();
            if (charTyped) {
                if (!metricsReporter.hasLocalMark('CharTyped')) {
                    metricsReporter.mark('CharTyped');
                }
            }
            else {
                metricsReporter.clearMark('CharTyped');
            }
        }
        this.pastedInInput_ = false;
    }
    onInputKeydown_(e) {
        // The user is moving the caret, so narrate the input itself.
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
            this.setSelectionA11yLabel('');
        }
        // Ignore this event during IME composition or if the input does not have
        // inline autocompletion.
        if (e.isComposing || !this.lastInput_.inline) {
            return;
        }
        const inputValue = this.$.input.value;
        const inputSelection = inputValue.substring(this.$.input.selectionStart, this.$.input.selectionEnd);
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        // If the current input state (its value and selection) matches its last
        // state (text and inline autocompletion) and the user types the next
        // character in the inline autocompletion, stop the keydown event. Just move
        // the selection. This is needed to avoid flicker.
        if (inputSelection === this.lastInput_.inline &&
            inputValue === lastInputValue &&
            this.lastInput_.inline[0].toLocaleLowerCase() ===
                e.key.toLocaleLowerCase()) {
            const text = this.lastInput_.text + e.key;
            assert(text);
            this.updateInput_({
                text: text,
                inline: this.lastInput_.inline.substr(1),
            });
            this.fire('searchbox-input-text-updated', {
                value: this.lastInput_.text,
                isComposing: false,
                event: e,
            });
            // If 'CharTyped' mark already exists, there's a pending typed character
            // for which the results have not been painted yet. In that case, keep the
            // earlier mark.
            if (loadTimeData.getBoolean('reportMetrics')) {
                const metricsReporter = MetricsReporterImpl.getInstance();
                if (!metricsReporter.hasLocalMark('CharTyped')) {
                    metricsReporter.mark('CharTyped');
                }
            }
            // The above code already updated the text and selection. Prevent default
            // keydown handling muddling the updated state.
            e.preventDefault();
            // The above code already identified this is a text-changing keydown event
            // and fired 'searchbox-input-text-updated' to update state accordingly
            // text update. Prevent event bubbling from triggering other custom
            // keydown handlers treating this as a generic keydown event.
            e.stopPropagation();
        }
    }
    onInputKeyup_(e) {
        if (e.key !== 'Tab') {
            return;
        }
        // User is tabbing into the input element.
        this.fire('input-focus-changed', { value: this.$.input.value, isOnFocus: !this.$.input.value });
    }
    onInputMousedown_(e) {
        // Non-main (generally left) mouse clicks are ignored.
        if (e && e.button !== 0) {
            return;
        }
        // The user is placing the caret, so narrate the input itself.
        this.setSelectionA11yLabel('');
        this.fire('input-focus-changed', { value: this.$.input.value, isOnFocus: !this.$.input.value });
    }
    onInputPaste_(e) {
        this.fire('searchbox-input-pasted');
        if (this.allowFilePaste && e.clipboardData?.files &&
            e.clipboardData.files.length > 0) {
            e.preventDefault();
            this.fire('searchbox-input-files-pasted', {
                files: e.clipboardData.files,
            });
            return;
        }
        this.pastedInInput_ = true;
    }
    /**
     * Updates the input state (text and inline autocompletion) with |update|.
     */
    updateInput_(update) {
        const newInput = Object.assign({}, this.lastInput_, update);
        const newInputValue = newInput.text + newInput.inline;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        const isMatchPreview = update.isMatchPreview ?? false;
        if (!isMatchPreview) {
            this.lastUserInput_ = newInput.text;
        }
        // If the user has explicitly entered a multiline query (containing '\n'),
        // respect the user's multiline intent and do not force single-line mode.
        // Otherwise, clamp single-line queries with inline autocomplete or match
        // preview to a single line.
        const hasInlineAutocomplete = newInput.inline !== '';
        this.forceSingleLine_ = this.singleLineOnInlineAutocomplete &&
            (hasInlineAutocomplete || isMatchPreview) &&
            !this.lastUserInput_.includes('\n');
        const inlineDiffers = newInput.inline !== this.lastInput_.inline;
        const preserveSelection = !inlineDiffers && !update.moveCursorToEnd && !isMatchPreview;
        let needsSelectionUpdate = !preserveSelection;
        const oldSelectionStart = this.$.input?.selectionStart || null;
        const oldSelectionEnd = this.$.input?.selectionEnd || null;
        if (this.$.input && newInputValue !== this.$.input.value) {
            this.$.input.value = newInputValue;
            needsSelectionUpdate = true; // Setting .value blows away selection.
        }
        if (this.$.input && newInputValue.trim() && needsSelectionUpdate) {
            // If the cursor is to be moved to the end (implies selection should not
            // be preserved), set the selection start to same as the selection end.
            this.$.input.selectionStart = preserveSelection ? oldSelectionStart :
                (update.moveCursorToEnd || isMatchPreview) ? newInputValue.length :
                    newInput.text.length;
            this.$.input.selectionEnd =
                preserveSelection ? oldSelectionEnd : newInputValue.length;
            // Programmatic value and selection updates do not automatically scroll
            // the input element. Explicitly scroll to the end when the caret is
            // placed at the end of the input.
            const input = this.$.input;
            if (this.multiLineEnabled) {
                input.scrollTop = input.scrollHeight;
            }
            else if (input.selectionStart === newInputValue.length &&
                input.selectionEnd === newInputValue.length) {
                input.scrollLeft = input.scrollWidth;
            }
        }
        this.isDeletingInput_ = update.isDeletingInput ??
            (lastInputValue.length > newInputValue.length &&
                lastInputValue.startsWith(newInputValue));
        this.lastInput_ = newInput;
        this.updateEllipsisState_();
    }
    updateEllipsisState_() {
        if (!this.singleLineOnInlineAutocomplete) {
            this.showEllipsis_ = false;
            return;
        }
        // Abort early if the searchbox input does not have focus or is missing.
        if (this.shadowRoot?.activeElement !== this.$.input || !this.$.input) {
            this.showEllipsis_ = false;
            return;
        }
        const hasInlineAutocomplete = this.lastInput_.inline !== '';
        // Verifies that the selection spans the entire autocompleted suffix
        // (from the end of user-typed text to the end of input), confirming
        // the user hasn't moved the cursor or edited the selection.
        const hasInlineSelection = this.$.input.selectionStart === this.lastInput_.text.length &&
            this.$.input.selectionEnd === this.$.input.value.length &&
            this.$.input.selectionStart !== this.$.input.selectionEnd;
        if (hasInlineAutocomplete && !hasInlineSelection) {
            this.lastInput_ = { text: this.$.input.value, inline: '' };
            this.forceSingleLine_ = false;
        }
        else if (
        // If the user clicks into or moves the cursor within preview text,
        // exit forced single-line mode so they can edit normally.
        !hasInlineAutocomplete && this.forceSingleLine_ &&
            (this.$.input.selectionStart !== this.lastInput_.text.length ||
                this.$.input.selectionEnd !== this.lastInput_.text.length)) {
            this.forceSingleLine_ = false;
        }
        this.hasInlineSelection_ = hasInlineSelection;
        // Only force a reflow if the preconditions for showing the ellipsis are
        // met.
        this.showEllipsis_ = this.forceSingleLine_ &&
            this.$.input.scrollWidth > this.$.input.clientWidth;
    }
    computePlaceholderText_() {
        if (this.inKeywordMode_()) {
            return this.inputKeywordModel?.placeholder || '';
        }
        return this.placeholderText ?? this.i18n('searchBoxHint');
    }
    computeDefaultIcon_() {
        if (this.inKeywordMode_()) {
            return this.inputKeywordModel?.iconPath ||
                '//resources/cr_components/searchbox/icons/search_cr23.svg';
        }
        return this.searchboxIcon;
    }
    inKeywordMode_() {
        return this.inputKeywordModel?.type === KeywordType.kInKeyword;
    }
}
customElements.define(SearchboxInputElement.is, SearchboxInputElement);
