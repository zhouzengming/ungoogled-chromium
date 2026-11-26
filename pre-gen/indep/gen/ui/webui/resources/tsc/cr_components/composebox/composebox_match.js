// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { getUrlForCss } from '//resources/js/icon.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { SuggestStyle } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { ToolMode } from '//resources/mojo/components/omnibox/composebox/composebox_query.mojom-webui.js';
import { getCss } from './composebox_match.css.js';
import { getHtml } from './composebox_match.html.js';
import { ComposeboxProxyImpl, createAutocompleteMatch } from './composebox_proxy.js';
// Displays an autocomplete match
export class ComposeboxMatchElement extends CrLitElement {
    static get is() {
        return 'cr-composebox-match';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            //========================================================================
            // Public properties
            //========================================================================
            /**
             * Whether the match should be rendered in a two-row layout, i.e. with the
             * description (secondary text) rendered below the contents (primary
             * text). Mirrors `AutocompleteMatch::is_two_row_suggestion`, which the
             * handler derives from `SuggestTemplateInfo::secondary_text_placement`.
             */
            isTwoRowSuggestion: {
                type: Boolean,
                reflect: true,
            },
            match: { type: Object },
            overrideClampLineNum: {
                type: Number,
                reflect: true,
            },
            /**
             * Index of the match in the autocomplete result. Used to inform embedder
             * of events such as deletion, click, etc.
             */
            matchIndex: { type: Number },
            resultSequenceId: { type: Number },
            toolMode: {
                type: Number,
                reflect: true,
            },
            removeButtonTitle_: { type: String },
            richImageSuggestionsEnabled: { type: Boolean },
            suggestStyle: {
                type: String,
                reflect: true,
                attribute: 'suggest-style',
            },
        };
    }
    #isTwoRowSuggestion_accessor_storage = false;
    get isTwoRowSuggestion() { return this.#isTwoRowSuggestion_accessor_storage; }
    set isTwoRowSuggestion(value) { this.#isTwoRowSuggestion_accessor_storage = value; }
    #match_accessor_storage = createAutocompleteMatch();
    get match() { return this.#match_accessor_storage; }
    set match(value) { this.#match_accessor_storage = value; }
    #overrideClampLineNum_accessor_storage = -1;
    get overrideClampLineNum() { return this.#overrideClampLineNum_accessor_storage; }
    set overrideClampLineNum(value) { this.#overrideClampLineNum_accessor_storage = value; }
    #matchIndex_accessor_storage = -1;
    get matchIndex() { return this.#matchIndex_accessor_storage; }
    set matchIndex(value) { this.#matchIndex_accessor_storage = value; }
    #resultSequenceId_accessor_storage = 0;
    get resultSequenceId() { return this.#resultSequenceId_accessor_storage; }
    set resultSequenceId(value) { this.#resultSequenceId_accessor_storage = value; }
    #toolMode_accessor_storage = ToolMode.kUnspecified;
    get toolMode() { return this.#toolMode_accessor_storage; }
    set toolMode(value) { this.#toolMode_accessor_storage = value; }
    #richImageSuggestionsEnabled_accessor_storage = false;
    get richImageSuggestionsEnabled() { return this.#richImageSuggestionsEnabled_accessor_storage; }
    set richImageSuggestionsEnabled(value) { this.#richImageSuggestionsEnabled_accessor_storage = value; }
    #suggestStyle_accessor_storage = 'default';
    get suggestStyle() { return this.#suggestStyle_accessor_storage; }
    set suggestStyle(value) { this.#suggestStyle_accessor_storage = value; }
    searchboxHandler_;
    #removeButtonTitle__accessor_storage = loadTimeData.getString('removeSuggestion');
    get removeButtonTitle_() { return this.#removeButtonTitle__accessor_storage; }
    set removeButtonTitle_(value) { this.#removeButtonTitle__accessor_storage = value; }
    get isRichImage() {
        return this.suggestStyle === 'rich-image';
    }
    constructor() {
        super();
        this.searchboxHandler_ = ComposeboxProxyImpl.getInstance().searchboxHandler;
    }
    connectedCallback() {
        super.connectedCallback();
        // Use mousedown to avoid clicks being swallowed by focusin.
        this.addEventListener('click', (event) => this.onMouseClick_(event));
        this.addEventListener('focusin', () => this.onMatchFocusin_());
        // Prevent default mousedown behavior (e.g., focus) to avoid layout shifts
        // that could interfere with click events, especially for ZPS suggestions.
        this.addEventListener('mousedown', (event) => {
            event.preventDefault();
        });
        this.style.setProperty('--clamp-line-num', `${this.overrideClampLineNum}`);
    }
    computeSuggestStyle_() {
        switch (this.match.suggestStyle) {
            case SuggestStyle.kRichImage:
                return (this.richImageSuggestionsEnabled &&
                    Boolean(this.match.imageUrl)) ?
                    'rich-image' :
                    'default';
            case SuggestStyle.kDefault:
            default:
                return 'default';
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('match') ||
            changedProperties.has('richImageSuggestionsEnabled')) {
            this.suggestStyle = this.computeSuggestStyle_();
            this.isTwoRowSuggestion = this.match.isTwoRowSuggestion;
        }
    }
    iconPath_() {
        return this.match.iconPath || '';
    }
    // Returns a CSP-safe image URL using Chrome's SanitizedImageSource
    // (//image?...).
    computeImageUrl_(url) {
        if (!url) {
            return '';
        }
        return `//image?staticEncode=true&encodeType=webp&url=${encodeURIComponent(url)}`;
    }
    imageStyle_() {
        if (!this.isRichImage) {
            return '';
        }
        const src = this.computeImageUrl_(this.match.imageUrl);
        return src ? `background-image: ${getUrlForCss(src)};` : '';
    }
    onMatchFocusin_() {
        this.fire('match-focusin', {
            index: this.matchIndex,
        });
    }
    onMouseClick_(e) {
        if (e.button > 1) {
            // Only handle main (generally left) and middle button presses.
            return;
        }
        e.preventDefault(); // Prevents default browser action (navigation).
        const event = new CustomEvent('match-pre-accept', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { match: this.match },
        });
        this.dispatchEvent(event);
        if (event.defaultPrevented) {
            return;
        }
        this.searchboxHandler_.openAutocompleteMatch(this.resultSequenceId, this.matchIndex, this.match.destinationUrl, 
        /*areMatchesShowing=*/ true, 
        /*mouseButton=*/ e.button || 0, {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
        }, 
        /*viaKeyboard=*/ false);
        this.fire('match-click', {
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
        });
    }
    onRemoveButtonClick_(e) {
        if (e.button !== 0) {
            // Only handle main (generally left) button presses.
            return;
        }
        e.preventDefault(); // Prevents default browser action (navigation).
        e.stopPropagation(); // Prevents <iron-selector> from selecting the match.
        this.searchboxHandler_.deleteAutocompleteMatch(this.matchIndex, this.match.destinationUrl);
    }
    onRemoveButtonMousedown_(e) {
        e.preventDefault(); // Prevents default browser action (focus).
    }
}
customElements.define(ComposeboxMatchElement.is, ComposeboxMatchElement);
