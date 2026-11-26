// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './searchbox_icon.js';
import './searchbox_action.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import { loadTimeData } from '//resources/js/load_time_data.js';
import { sanitizeInnerHtml } from '//resources/js/parse_html_subset.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { NavigationPredictor } from '//resources/mojo/components/omnibox/browser/omnibox.mojom-webui.js';
import { KeywordType, SelectionLineState, SideType } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { createAutocompleteMatch, SearchboxBrowserProxy } from './searchbox_browser_proxy.js';
import { getCss } from './searchbox_match.css.js';
import { getHtml } from './searchbox_match.html.js';
import { mojoTimeTicks } from './utils.js';
// clang-format off
/**
 * Bitmap used to decode the value of ACMatchClassification style
 * field.
 * See components/omnibox/browser/autocomplete_match.h.
 */
var AcMatchClassificationStyle;
(function (AcMatchClassificationStyle) {
    AcMatchClassificationStyle[AcMatchClassificationStyle["NONE"] = 0] = "NONE";
    AcMatchClassificationStyle[AcMatchClassificationStyle["URL"] = 1] = "URL";
    AcMatchClassificationStyle[AcMatchClassificationStyle["MATCH"] = 2] = "MATCH";
    AcMatchClassificationStyle[AcMatchClassificationStyle["DIM"] = 4] = "DIM";
})(AcMatchClassificationStyle || (AcMatchClassificationStyle = {}));
// clang-format on
const ENTITY_MATCH_TYPE = 'search-suggest-entity';
// Represents the initial selection when a match is created or reset.
export const kDefaultSelection = {
    line: -1,
    state: SelectionLineState.kNormal,
    actionIndex: 0,
};
// Displays an autocomplete match.
export class SearchboxMatchElement extends CrLitElement {
    static get is() {
        return 'cr-searchbox-match';
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
            /** Element's 'aria-label' attribute. */
            ariaLabel: {
                type: String,
                reflect: true,
            },
            hasAction: {
                type: Boolean,
                reflect: true,
            },
            showContextualDescription: {
                type: Boolean,
                reflect: true,
            },
            /**
             * Whether the match features an image (as opposed to an icon or favicon).
             */
            hasImage: {
                type: Boolean,
                reflect: true,
            },
            hasKeywordChip: {
                type: Boolean,
                reflect: true,
            },
            /**
             * Whether the match is an entity suggestion (with or without an image).
             */
            isEntitySuggestion: {
                type: Boolean,
                reflect: true,
            },
            /**
             * Whether the match should be rendered in a two-row layout. Currently
             * limited to matches that feature an image, calculator, and answers.
             */
            isTwoRowSuggestion: {
                type: Boolean,
                reflect: true,
            },
            match: { type: Object },
            selection: { type: Object },
            /**
             * Index of the match in the autocomplete result. Used to inform embedder
             * of events such as deletion, click, etc.
             */
            matchIndex: { type: Number },
            showThumbnail: {
                type: Boolean,
                reflect: true,
            },
            showEllipsis: { type: Boolean },
            sideType: { type: Number },
            virtualFocusEnabled: { type: Boolean },
            resultSequenceId: { type: Number },
            //========================================================================
            // Private properties
            //========================================================================
            isContextualSuggestion_: {
                type: Boolean,
                reflect: true,
            },
            isTopChromeSearchbox_: {
                type: Boolean,
                reflect: true,
            },
            isLensSearchbox_: {
                type: Boolean,
                reflect: true,
            },
            forceHideEllipsis_: { type: Boolean },
            /** Rendered match contents based on autocomplete provided styling. */
            contentsHtml_: { type: String },
            /** Rendered match description based on autocomplete provided styling. */
            descriptionHtml_: { type: String },
            enableCsbMotionTweaks_: {
                type: Boolean,
                reflect: true,
            },
            /** Remove button's 'aria-label' attribute. */
            removeButtonAriaLabel_: { type: String },
            removeButtonTitle_: { type: String },
            /** Used to separate the contents from the description. */
            separatorText_: { type: String },
            /** Rendered tail suggest common prefix. */
            tailSuggestPrefix_: { type: String },
        };
    }
    #ariaLabel_accessor_storage = '';
    get ariaLabel() { return this.#ariaLabel_accessor_storage; }
    set ariaLabel(value) { this.#ariaLabel_accessor_storage = value; }
    #hasAction_accessor_storage = false;
    get hasAction() { return this.#hasAction_accessor_storage; }
    set hasAction(value) { this.#hasAction_accessor_storage = value; }
    #showContextualDescription_accessor_storage = false;
    get showContextualDescription() { return this.#showContextualDescription_accessor_storage; }
    set showContextualDescription(value) { this.#showContextualDescription_accessor_storage = value; }
    #hasImage_accessor_storage = false;
    get hasImage() { return this.#hasImage_accessor_storage; }
    set hasImage(value) { this.#hasImage_accessor_storage = value; }
    #hasKeywordChip_accessor_storage = false;
    get hasKeywordChip() { return this.#hasKeywordChip_accessor_storage; }
    set hasKeywordChip(value) { this.#hasKeywordChip_accessor_storage = value; }
    #isEntitySuggestion_accessor_storage = false;
    get isEntitySuggestion() { return this.#isEntitySuggestion_accessor_storage; }
    set isEntitySuggestion(value) { this.#isEntitySuggestion_accessor_storage = value; }
    #isTwoRowSuggestion_accessor_storage = false;
    get isTwoRowSuggestion() { return this.#isTwoRowSuggestion_accessor_storage; }
    set isTwoRowSuggestion(value) { this.#isTwoRowSuggestion_accessor_storage = value; }
    #match_accessor_storage = createAutocompleteMatch();
    get match() { return this.#match_accessor_storage; }
    set match(value) { this.#match_accessor_storage = value; }
    #selection_accessor_storage = kDefaultSelection;
    get selection() { return this.#selection_accessor_storage; }
    set selection(value) { this.#selection_accessor_storage = value; }
    #matchIndex_accessor_storage = -1;
    get matchIndex() { return this.#matchIndex_accessor_storage; }
    set matchIndex(value) { this.#matchIndex_accessor_storage = value; }
    #sideType_accessor_storage = SideType.kDefaultPrimary;
    get sideType() { return this.#sideType_accessor_storage; }
    set sideType(value) { this.#sideType_accessor_storage = value; }
    #showThumbnail_accessor_storage = false;
    get showThumbnail() { return this.#showThumbnail_accessor_storage; }
    set showThumbnail(value) { this.#showThumbnail_accessor_storage = value; }
    #showEllipsis_accessor_storage = false;
    get showEllipsis() { return this.#showEllipsis_accessor_storage; }
    set showEllipsis(value) { this.#showEllipsis_accessor_storage = value; }
    #virtualFocusEnabled_accessor_storage = false;
    get virtualFocusEnabled() { return this.#virtualFocusEnabled_accessor_storage; }
    set virtualFocusEnabled(value) { this.#virtualFocusEnabled_accessor_storage = value; }
    #resultSequenceId_accessor_storage = 0;
    get resultSequenceId() { return this.#resultSequenceId_accessor_storage; }
    set resultSequenceId(value) { this.#resultSequenceId_accessor_storage = value; }
    #isContextualSuggestion__accessor_storage = false;
    get isContextualSuggestion_() { return this.#isContextualSuggestion__accessor_storage; }
    set isContextualSuggestion_(value) { this.#isContextualSuggestion__accessor_storage = value; }
    #isTopChromeSearchbox__accessor_storage = loadTimeData.getBoolean('isTopChromeSearchbox');
    get isTopChromeSearchbox_() { return this.#isTopChromeSearchbox__accessor_storage; }
    set isTopChromeSearchbox_(value) { this.#isTopChromeSearchbox__accessor_storage = value; }
    #isLensSearchbox__accessor_storage = loadTimeData.getBoolean('isLensSearchbox');
    get isLensSearchbox_() { return this.#isLensSearchbox__accessor_storage; }
    set isLensSearchbox_(value) { this.#isLensSearchbox__accessor_storage = value; }
    #forceHideEllipsis__accessor_storage = loadTimeData.getBoolean('forceHideEllipsis');
    get forceHideEllipsis_() { return this.#forceHideEllipsis__accessor_storage; }
    set forceHideEllipsis_(value) { this.#forceHideEllipsis__accessor_storage = value; }
    #contentsHtml__accessor_storage = window.trustedTypes.emptyHTML;
    get contentsHtml_() { return this.#contentsHtml__accessor_storage; }
    set contentsHtml_(value) { this.#contentsHtml__accessor_storage = value; }
    #descriptionHtml__accessor_storage = window.trustedTypes.emptyHTML;
    get descriptionHtml_() { return this.#descriptionHtml__accessor_storage; }
    set descriptionHtml_(value) { this.#descriptionHtml__accessor_storage = value; }
    #enableCsbMotionTweaks__accessor_storage = loadTimeData.getBoolean('enableCsbMotionTweaks');
    get enableCsbMotionTweaks_() { return this.#enableCsbMotionTweaks__accessor_storage; }
    set enableCsbMotionTweaks_(value) { this.#enableCsbMotionTweaks__accessor_storage = value; }
    #removeButtonAriaLabel__accessor_storage = '';
    get removeButtonAriaLabel_() { return this.#removeButtonAriaLabel__accessor_storage; }
    set removeButtonAriaLabel_(value) { this.#removeButtonAriaLabel__accessor_storage = value; }
    #removeButtonTitle__accessor_storage = loadTimeData.getString('removeSuggestion');
    get removeButtonTitle_() { return this.#removeButtonTitle__accessor_storage; }
    set removeButtonTitle_(value) { this.#removeButtonTitle__accessor_storage = value; }
    #separatorText__accessor_storage = '';
    get separatorText_() { return this.#separatorText__accessor_storage; }
    set separatorText_(value) { this.#separatorText__accessor_storage = value; }
    #tailSuggestPrefix__accessor_storage = '';
    get tailSuggestPrefix_() { return this.#tailSuggestPrefix__accessor_storage; }
    set tailSuggestPrefix_(value) { this.#tailSuggestPrefix__accessor_storage = value; }
    pageHandler_;
    constructor() {
        super();
        this.pageHandler_ = SearchboxBrowserProxy.getInstance().handler;
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has('match')) {
            this.ariaLabel = this.computeAriaLabel_();
            this.contentsHtml_ = this.computeContentsHtml_();
            this.descriptionHtml_ = this.computeDescriptionHtml_();
            this.hasAction = this.computeHasAction_();
            this.hasKeywordChip = this.computeHasKeywordChip_();
            this.hasImage = this.computeHasImage_();
            this.isContextualSuggestion_ = this.computeIsContextualSuggestion_();
            this.isEntitySuggestion = this.computeIsEntitySuggestion_();
            this.isTwoRowSuggestion = this.computeIsTwoRowSuggestion_();
            this.removeButtonAriaLabel_ = this.computeRemoveButtonAriaLabel_();
            this.separatorText_ = this.computeSeparatorText_();
            this.tailSuggestPrefix_ = this.computeTailSuggestPrefix_();
            this.selection = kDefaultSelection;
        }
        const changedPrivateProperties = changedProperties;
        if (changedProperties.has('showThumbnail') ||
            changedPrivateProperties.has('isLensSearchbox_') ||
            changedPrivateProperties.has('forceHideEllipsis_')) {
            this.showEllipsis = this.computeShowEllipsis_();
        }
    }
    firstUpdated() {
        this.addEventListener('click', (event) => this.onMatchClick_(event));
        this.addEventListener('auxclick', (event) => this.onMatchClick_(event));
        this.addEventListener('focusin', () => this.onMatchFocusin_());
        this.addEventListener('mousedown', (event) => this.onMatchMouseDown_(event));
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('selection') || changedProperties.has('match')) {
            this.updateAriaLabel_();
        }
        // Virtual focus selection changes are narrated by the hosting searchbox's
        // input (see `SearchboxMixin.getSelectionA11yLabel()`), so this match must
        // not announce them too.
    }
    updateAriaLabel_() {
        if (!this.virtualFocusEnabled) {
            return;
        }
        const state = this.selection.state;
        if (this.selection.line === this.matchIndex) {
            if (state === SelectionLineState.kNormal) {
                this.ariaLabel = this.computeAriaLabel_();
            }
            else if (state === SelectionLineState.kKeywordMode) {
                this.ariaLabel = this.match.keywordModel?.chipA11y || '';
            }
            else if (state === SelectionLineState.kFocusedButtonAction) {
                const action = this.match.actions[this.selection.actionIndex];
                this.ariaLabel = action ? action.a11yLabel : '';
            }
            else if (state === SelectionLineState.kFocusedButtonRemoveSuggestion) {
                this.ariaLabel = this.removeButtonAriaLabel_ || '';
            }
        }
        else {
            this.ariaLabel = this.computeAriaLabel_();
        }
    }
    //============================================================================
    // Event handlers
    //============================================================================
    onKeywordExecuteAction_(e) {
        // Keyboard activation isn't possible because when the keyword chip is
        // focused, focus is redirected to the omnibox view.
        const event = e.detail.event;
        this.fire('keyword-click', { match: this.match, matchIndex: this.matchIndex });
        this.pageHandler_.activateKeyword(this.matchIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), 
        // Distinguish mouse and touch or pen events for logging purposes.
        event.pointerType === 'mouse');
    }
    /**
     * containing index of the action that was removed as well as modifier key
     * presses.
     */
    onExecuteAction_(e) {
        const event = e.detail.event;
        this.pageHandler_.executeAction(this.matchIndex, e.detail.actionIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), event.button || 0, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
    }
    onMatchClick_(e) {
        if (e.button > 1) {
            // Only handle main (generally left) and middle button presses.
            return;
        }
        e.preventDefault(); // Prevents default browser action (navigation).
        e.stopPropagation(); // Prevents <iron-selector> from selecting the match.
        if (this.match.keywordModel?.type === KeywordType.kInstant) {
            this.fire('keyword-click', { match: this.match, matchIndex: this.matchIndex });
            this.pageHandler_.activateKeyword(this.matchIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), e.button === 0);
            return;
        }
        this.pageHandler_.openAutocompleteMatch(this.resultSequenceId, this.matchIndex, this.match.destinationUrl, 
        /*areMatchesShowing=*/ true, 
        /*mouseButton=*/ e.button || 0, {
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
        }, 
        /*viaKeyboard=*/ false);
        // Duplicates the logic in `ui::DispositionFromClick()`.
        const backgroundTab = (e.metaKey || e.ctrlKey) && e.shiftKey;
        // 'match-click' event is used to close the dropdown. Don't do so when
        // opening a background tab so users can open multiple matches.
        if (!backgroundTab) {
            this.fire('match-click');
        }
    }
    onMatchFocusin_() {
        this.fire('match-focusin', this.matchIndex);
    }
    onMatchMouseDown_(e) {
        if (this.virtualFocusEnabled ||
            this.match.keywordModel?.type === KeywordType.kInstant) {
            e.preventDefault(); // Prevents default browser action (focus loss).
        }
        this.pageHandler_.onNavigationLikely(this.matchIndex, this.match.destinationUrl, NavigationPredictor.kMouseDown);
    }
    onRemoveButtonClick_(e) {
        if (e.button !== 0) {
            // Only handle main (generally left) button presses.
            return;
        }
        e.preventDefault(); // Prevents default browser action (navigation).
        e.stopPropagation(); // Prevents <iron-selector> from selecting the match.
        this.fire('match-remove');
        this.pageHandler_.deleteAutocompleteMatch(this.matchIndex, this.match.destinationUrl);
    }
    onRemoveButtonMousedown_(e) {
        e.preventDefault(); // Prevents default browser action (focus).
    }
    //============================================================================
    // Helpers
    //============================================================================
    computeAriaLabel_() {
        if (!this.match) {
            return '';
        }
        // `a11yLabel` is the complete label, computed in C++ with the same logic
        // used by the omnibox edit model. It already includes the description
        // for match types where it is relevant.
        return this.match.a11yLabel;
    }
    /**
     * Sanitizes .innerHTML from `renderTextWithClassifications_()` through
     * `sanitizeInnerHtml` to ensure it only contains allowed tags.
     * @param innerHtml The .innerHTML from `renderTextWithClassifications_()`
     * @return Sanitized TrustedHTML safe for rendering
     */
    sanitizeInnerHtml_(innerHtml) {
        try {
            return sanitizeInnerHtml(innerHtml, { attrs: ['class'] });
        }
        catch (e) {
            // If sanitization fails return empty HTML.
            return window.trustedTypes.emptyHTML;
        }
    }
    computeContentsHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML;
        }
        // See //chrome/browser/ui/webui/searchbox/searchbox_handler.cc
        return this.sanitizeInnerHtml_(this.renderTextWithClassifications_(this.getMatchContents_(), this.getMatchContentsClassifications_())
            .innerHTML);
    }
    computeDescriptionHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML;
        }
        return this.sanitizeInnerHtml_(this.renderTextWithClassifications_(this.getMatchDescription_(), this.getMatchDescriptionClassifications_())
            .innerHTML);
    }
    computeHasAction_() {
        return this.match?.actions?.length > 0;
    }
    computeHasKeywordChip_() {
        return this.match?.keywordModel?.type === KeywordType.kChip;
    }
    computeHasImage_() {
        return this.match && !!this.match.imageUrl;
    }
    computeIsContextualSuggestion_() {
        return this.match.isContextualSuggestion;
    }
    computeIsEntitySuggestion_() {
        return this.match && this.match.type === ENTITY_MATCH_TYPE;
    }
    computeIsTwoRowSuggestion_() {
        // When the searchbox is embedded in the top-chrome (i.e. Omnibox), all
        // suggestions should be rendered using a one-line layout.
        return !this.isTopChromeSearchbox_ && this.match &&
            this.match.isTwoRowSuggestion;
    }
    computeRemoveButtonAriaLabel_() {
        if (!this.match) {
            return '';
        }
        return this.match.removeButtonA11yLabel;
    }
    computeSeparatorText_() {
        return this.getMatchDescription_() ?
            loadTimeData.getString('searchboxSeparator') :
            '';
    }
    computeTailSuggestPrefix_() {
        if (!this.match || !this.match.tailSuggestCommonPrefix) {
            return '';
        }
        const prefix = this.match.tailSuggestCommonPrefix;
        // Replace last space with non breaking space since spans collapse
        // trailing white spaces and the prefix always ends with a white space.
        if (prefix.slice(-1) === ' ') {
            return prefix.slice(0, -1) + '\u00A0';
        }
        return prefix;
    }
    computeShowEllipsis_() {
        if (this.isLensSearchbox_ && this.forceHideEllipsis_) {
            return false;
        }
        return this.showThumbnail;
    }
    /**
     * Decodes the AcMatchClassificationStyle entries encoded in the given
     * ACMatchClassification style field, maps each entry to a CSS
     * class and returns them.
     */
    convertClassificationStyleToCssClasses_(style) {
        const classes = [];
        if (style & AcMatchClassificationStyle.DIM) {
            classes.push('dim');
        }
        if (style & AcMatchClassificationStyle.MATCH) {
            classes.push('match');
        }
        if (style & AcMatchClassificationStyle.URL) {
            classes.push('url');
        }
        return classes;
    }
    createSpanWithClasses_(text, classes) {
        const span = document.createElement('span');
        if (classes.length) {
            span.classList.add(...classes);
        }
        span.textContent = text;
        return span;
    }
    /**
     * Renders |text| based on the given ACMatchClassification(s)
     * Each classification contains an 'offset' and an encoded list of styles for
     * styling a substring starting with the 'offset' and ending with the next.
     * @return A <span> with <span> children for each styled substring.
     */
    renderTextWithClassifications_(text, classifications) {
        const container = document.createElement('span');
        // If no classifications are provided, render the entire text unstyled.
        if (classifications.length === 0) {
            container.appendChild(this.createSpanWithClasses_(text, []));
            return container;
        }
        // If the first classification doesn't start at 0, render the prefix text
        // unstyled. `AutocompleteMatch::ValidateClassifications()` guarantees the
        // first offset is 0, however this is only validated in debug builds.
        const firstClassification = classifications[0];
        if (firstClassification.offset > 0) {
            const prefix = text.substring(0, firstClassification.offset);
            container.appendChild(this.createSpanWithClasses_(prefix, []));
        }
        classifications.map(({ offset, style }, index) => {
            // Each classification defines a region from its offset to the next
            // classification's offset or end of string for the last one. This covers
            // the entire string with no gaps.
            const nextOffset = index + 1 < classifications.length ?
                classifications[index + 1].offset :
                text.length;
            const subString = text.substring(offset, nextOffset);
            const classes = this.convertClassificationStyleToCssClasses_(style);
            container.appendChild(this.createSpanWithClasses_(subString, classes));
        });
        return container;
    }
    // `contents` and `description` are already swapped in the browser when
    // needed, so `contents` is always the primary text.
    getMatchContents_() {
        return this.match ? this.match.contents : '';
    }
    getMatchDescription_() {
        return this.match ? this.match.description : '';
    }
    getMatchContentsClassifications_() {
        return this.match ? this.match.contentsClass : [];
    }
    getMatchDescriptionClassifications_() {
        return this.match ? this.match.descriptionClass : [];
    }
    getFocusIndicatorCssClass_() {
        return this.selection.line === this.matchIndex &&
            this.selection.state !== SelectionLineState.kNormal &&
            this.match.keywordModel?.type !== KeywordType.kInstant ?
            'selected-within' :
            '';
    }
    getKeywordCssClass_() {
        return this.selection.line === this.matchIndex &&
            this.selection.state === SelectionLineState.kKeywordMode ?
            'selected' :
            '';
    }
    getActionCssClass_(actionIndex) {
        return this.selection.line === this.matchIndex &&
            this.selection.state === SelectionLineState.kFocusedButtonAction &&
            this.selection.actionIndex === actionIndex ?
            'selected' :
            '';
    }
    getRemoveCssClass_() {
        return this.selection.line === this.matchIndex &&
            this.selection.state ===
                SelectionLineState.kFocusedButtonRemoveSuggestion ?
            'selected' :
            '';
    }
}
customElements.define(SearchboxMatchElement.is, SearchboxMatchElement);
