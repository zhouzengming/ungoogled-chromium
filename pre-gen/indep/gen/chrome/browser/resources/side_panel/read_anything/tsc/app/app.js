// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './read_anything_toolbar.js';
import '/strings.m.js';
import '//read-anything-side-panel.top-chrome/shared/sp_empty_state.js';
import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_toast/cr_toast.js';
import '../read_aloud/language_toast.js';
import { ColorChangeUpdater } from '//resources/cr_components/color_change_listener/colors_css_updater.js';
import { WebUiListenerMixinLit } from '//resources/cr_elements/web_ui_listener_mixin_lit.js';
import { assert } from '//resources/js/assert.js';
import { isRTL } from '//resources/js/util.js';
import { CrLitElement } from '//resources/lit/v3_0/lit.rollup.js';
import { ContentBrowserProxyImpl } from '../content/content_browser_proxy.js';
import { ContentController, ContentType } from '../content/content_controller.js';
import { LineFocusController } from '../content/line_focus_controller.js';
import { NodeStore } from '../content/node_store.js';
import { DEFAULT_SETTINGS, LineFocusType } from '../content/read_anything_types.js';
import { SelectionController } from '../content/selection_controller.js';
import { AudioBrowserProxyImpl } from '../read_aloud/audio_browser_proxy.js';
import { SpeechController } from '../read_aloud/speech_controller.js';
import { VoiceLanguageController } from '../read_aloud/voice_language_controller.js';
import { VoiceNotificationManager } from '../read_aloud/voice_notification_manager.js';
import { getWordCount, isDistilledByReadability } from '../shared/common.js';
import { isPlayPauseShortcut } from '../shared/keyboard_util.js';
import { ReadAnythingLogger, TimeFrom } from '../shared/read_anything_logger.js';
import { getCss } from './app.css.js';
import { getHtml } from './app.html.js';
import { AppStyleUpdater } from './app_style_updater.js';
import { VisualBrowserProxyImpl } from './visual_browser_proxy.js';
const AppElementBase = WebUiListenerMixinLit(CrLitElement);
export class AppElement extends AppElementBase {
    static get is() {
        return 'read-anything-app';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            isSpeechActive_: { type: Boolean },
            isAudioCurrentlyPlaying_: { type: Boolean },
            enabledLangs_: { type: Array },
            settingsPrefs_: { type: Object },
            selectedVoice_: { type: Object },
            availableVoices_: { type: Array },
            previewVoicePlaying_: { type: Object },
            localeToDisplayName_: { type: Object },
            contentState_: { type: Object },
            speechEngineLoaded_: { type: Boolean },
            willDrawAgainSoon_: { type: Boolean },
            pageLanguage_: { type: String },
            presentationState_: { type: Number },
            lineFocusStyle_: { type: Object },
            lineFocusEnabled_: { type: Boolean },
            lineFocusMovement_: { type: Number },
            hasValidSelection_: { type: Boolean },
            isReadAnythingPinned_: { type: Boolean },
        };
    }
    startTime_ = Date.now();
    #contentState__accessor_storage;
    get contentState_() { return this.#contentState__accessor_storage; }
    set contentState_(value) { this.#contentState__accessor_storage = value; }
    #lineFocusStyle__accessor_storage = null;
    get lineFocusStyle_() { return this.#lineFocusStyle__accessor_storage; }
    set lineFocusStyle_(value) { this.#lineFocusStyle__accessor_storage = value; }
    #lineFocusEnabled__accessor_storage = false;
    get lineFocusEnabled_() { return this.#lineFocusEnabled__accessor_storage; }
    set lineFocusEnabled_(value) { this.#lineFocusEnabled__accessor_storage = value; }
    #lineFocusMovement__accessor_storage = null;
    get lineFocusMovement_() { return this.#lineFocusMovement__accessor_storage; }
    set lineFocusMovement_(value) { this.#lineFocusMovement__accessor_storage = value; }
    #hasValidSelection__accessor_storage = false;
    get hasValidSelection_() { return this.#hasValidSelection__accessor_storage; }
    set hasValidSelection_(value) { this.#hasValidSelection__accessor_storage = value; }
    #isReadAnythingPinned__accessor_storage = false;
    get isReadAnythingPinned_() { return this.#isReadAnythingPinned__accessor_storage; }
    set isReadAnythingPinned_(value) { this.#isReadAnythingPinned__accessor_storage = value; }
    isReadAnythingImprovedUiEnabled_ = false;
    #speechEngineLoaded__accessor_storage = true;
    // If the speech engine is considered "loaded." If it is, we should display
    // the play / pause buttons normally. Otherwise, we should disable the
    // Read Aloud controls until the engine has loaded in order to provide
    // visual feedback that a voice is about to be spoken.
    get speechEngineLoaded_() { return this.#speechEngineLoaded__accessor_storage; }
    set speechEngineLoaded_(value) { this.#speechEngineLoaded__accessor_storage = value; }
    #willDrawAgainSoon__accessor_storage = false;
    // Sometimes distillations are queued up while distillation is happening so
    // when the current distillation finishes, we re-distill immediately. In that
    // case we shouldn't allow playing speech until the next distillation to avoid
    // resetting speech right after starting it.
    get willDrawAgainSoon_() { return this.#willDrawAgainSoon__accessor_storage; }
    set willDrawAgainSoon_(value) { this.#willDrawAgainSoon__accessor_storage = value; }
    #selectedVoice__accessor_storage = null;
    get selectedVoice_() { return this.#selectedVoice__accessor_storage; }
    set selectedVoice_(value) { this.#selectedVoice__accessor_storage = value; }
    #enabledLangs__accessor_storage = [];
    // The set of languages currently enabled for use by Read Aloud. This
    // includes user-enabled languages and auto-downloaded languages. The former
    // are stored in preferences. The latter are not.
    get enabledLangs_() { return this.#enabledLangs__accessor_storage; }
    set enabledLangs_(value) { this.#enabledLangs__accessor_storage = value; }
    #availableVoices__accessor_storage = [];
    // All possible available voices for the current speech engine.
    get availableVoices_() { return this.#availableVoices__accessor_storage; }
    set availableVoices_(value) { this.#availableVoices__accessor_storage = value; }
    #previewVoicePlaying__accessor_storage = null;
    // If a preview is playing, this is set to the voice the preview is playing.
    // Otherwise, this is null.
    get previewVoicePlaying_() { return this.#previewVoicePlaying__accessor_storage; }
    set previewVoicePlaying_(value) { this.#previewVoicePlaying__accessor_storage = value; }
    #localeToDisplayName__accessor_storage = {};
    get localeToDisplayName_() { return this.#localeToDisplayName__accessor_storage; }
    set localeToDisplayName_(value) { this.#localeToDisplayName__accessor_storage = value; }
    #pageLanguage__accessor_storage = '';
    get pageLanguage_() { return this.#pageLanguage__accessor_storage; }
    set pageLanguage_(value) { this.#pageLanguage__accessor_storage = value; }
    notificationManager_ = VoiceNotificationManager.getInstance();
    logger_ = ReadAnythingLogger.getInstance();
    styleUpdater_;
    nodeStore_ = NodeStore.getInstance();
    playOnOpen_ = false;
    voiceLanguageController_ = VoiceLanguageController.getInstance();
    speechController_ = SpeechController.getInstance();
    contentController_ = ContentController.getInstance();
    contentBrowserProxy_ = ContentBrowserProxyImpl.getInstance();
    visualBrowserProxy_ = VisualBrowserProxyImpl.getInstance();
    audioBrowserProxy_ = AudioBrowserProxyImpl.getInstance();
    selectionController_ = SelectionController.getInstance();
    lineFocusController_ = LineFocusController.getInstance();
    // Animation frame handle for scheduling text block extraction after DOM
    // layout. Tracked so rapid consecutive calls to updateContent can cancel
    // pending frames to avoid desynchronizing text node mapping with the AXTree.
    renderedTextBlocksAnimationFrameHandle_ = null;
    #settingsPrefs__accessor_storage = DEFAULT_SETTINGS;
    get settingsPrefs_() { return this.#settingsPrefs__accessor_storage; }
    set settingsPrefs_(value) { this.#settingsPrefs__accessor_storage = value; }
    #isSpeechActive__accessor_storage = false;
    get isSpeechActive_() { return this.#isSpeechActive__accessor_storage; }
    set isSpeechActive_(value) { this.#isSpeechActive__accessor_storage = value; }
    #isAudioCurrentlyPlaying__accessor_storage = false;
    get isAudioCurrentlyPlaying_() { return this.#isAudioCurrentlyPlaying__accessor_storage; }
    set isAudioCurrentlyPlaying_(value) { this.#isAudioCurrentlyPlaying__accessor_storage = value; }
    #presentationState__accessor_storage = 0;
    get presentationState_() { return this.#presentationState__accessor_storage; }
    set presentationState_(value) { this.#presentationState__accessor_storage = value; }
    isImmersiveMode() {
        return this.presentationState_ ===
            this.visualBrowserProxy_.getInImmersiveOverlayPresentationState();
    }
    constructor() {
        super();
        this.logger_.logTimeFrom(TimeFrom.APP, this.startTime_, Date.now());
        this.styleUpdater_ = new AppStyleUpdater(this);
        this.nodeStore_.clear();
        ColorChangeUpdater.forDocument().start();
        this.contentState_ = this.contentController_.getState();
        this.isReadAnythingImprovedUiEnabled_ =
            this.visualBrowserProxy_.isReadAnythingImprovedUiEnabled();
    }
    connectedCallback() {
        super.connectedCallback();
        // onConnected should always be called first in connectedCallback to ensure
        // onConnected is not blocked on anything else during WebUI setup.
        this.contentBrowserProxy_.onConnected();
        // Request the presentation state to determine whether we should use the UI
        // for immersive mode.
        this.visualBrowserProxy_.sendGetPresentationStateRequest();
        // Push ShowUI() callback to the event queue to allow deferred rendering
        // to take place.
        setTimeout(() => this.visualBrowserProxy_.shouldShowUi(), 0);
        this.styleUpdater_.setMaxLineWidth();
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            window.addEventListener('resize', this.onWindowResize_.bind(this));
            this.$.containerParent.addEventListener('mousemove', mouseEvent => {
                this.lineFocusController_.onMouseMove(mouseEvent.clientY);
            });
            this.$.toolbar.addEventListener('mousemove', mouseEvent => {
                this.lineFocusController_.onMouseMoveInToolbar(mouseEvent.clientY);
            });
            this.$.settingsOverlay.addEventListener('mousemove', mouseEvent => {
                this.lineFocusController_.onMouseMoveInToolbar(mouseEvent.clientY);
            });
            this.lineFocusController_.addListener(this);
        }
        this.contentController_.addListener(this);
        this.speechController_.addListener(this);
        this.voiceLanguageController_.addListener(this);
        this.notificationManager_.addListener(this.$.languageToast);
        // Clear state. We don't do this in disconnectedCallback because that's
        // not always reliabled called.
        this.nodeStore_.clear();
        this.showLoading();
        this.settingsPrefs_ = {
            letterSpacing: this.visualBrowserProxy_.getLetterSpacing(),
            lineSpacing: this.visualBrowserProxy_.getLineSpacing(),
            theme: this.visualBrowserProxy_.getColorTheme(),
            speechRate: this.audioBrowserProxy_.getSpeechRate(),
            font: this.visualBrowserProxy_.getFontName(),
            highlightGranularity: this.audioBrowserProxy_.getHighlightGranularity(),
            linksEnabled: this.visualBrowserProxy_.isLinksEnabled(),
            imagesEnabled: this.visualBrowserProxy_.isImagesEnabled(),
        };
        this.visualBrowserProxy_.sendPinStateRequest();
        document.onselectionchange = () => {
            // When Read Aloud is playing, user-selection is disabled on the Read
            // Anything panel, so don't attempt to update selection, as this can
            // end up clearing selection in the main part of the browser.
            if (!this.contentController_.hasContent() ||
                this.speechController_.isSpeechActive()) {
                return;
            }
            const selection = this.getSelection();
            this.selectionController_.onSelectionChange(selection, this.$.container);
            const position = this.selectionController_.hasSelection() ?
                this.selectionController_.getCurrentSelectionStart() :
                null;
            this.speechController_.onSelectionChange(position);
            this.contentController_.onSelectionChange(this.shadowRoot);
        };
        // Pass copy commands to main page. Copy commands will not work if they are
        // disabled on the main page.
        document.oncopy = () => {
            this.contentBrowserProxy_.onCopy();
            return false;
        };
        document.onkeydown = this.onKeyDown_.bind(this);
        this.contentBrowserProxy_.onAnchorsReadyForReadability.addListener(this.onReadabilityAnchorsReady_.bind(this));
        this.contentBrowserProxy_.onMainFrameSameDocumentNavigation.addListener(this.onMainFrameSameDocumentNavigation_.bind(this));
        this.contentBrowserProxy_.onRenderedTextMappingReady.addListener(this.onRenderedTextMappingReady_.bind(this));
        this.contentBrowserProxy_.updateImages.addListener(this.updateImages_.bind(this));
        this.contentBrowserProxy_.updateLinks.addListener(this.updateLinks_.bind(this));
        this.contentBrowserProxy_.updateSelection.addListener(() => {
            this.selectionController_.updateSelection(this.getSelection(), this.$.container);
        });
        this.contentBrowserProxy_.updateContent.addListener(this.updateContent.bind(this));
        this.contentBrowserProxy_.showLoading.addListener(this.showLoading.bind(this));
        this.visualBrowserProxy_.onPinStateReceived.addListener((pinState) => {
            this.isReadAnythingPinned_ = pinState;
        });
        this.visualBrowserProxy_.onPresentationStateReceived.addListener(this.onPresentationStateReceived_.bind(this));
        this.visualBrowserProxy_.restoreSettingsFromPrefs.addListener(this.restoreSettingsFromPrefs_.bind(this));
        this.audioBrowserProxy_.languageChanged.addListener(this.languageChanged.bind(this));
        this.audioBrowserProxy_.setPlayOnOpen.addListener(this.setPlayOnOpen.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // Even though disconnectedCallback isn't always called reliably in prod,
        // it is called in tests, and the speech extension timeout can cause
        // flakiness.
        this.voiceLanguageController_.stopWaitingForSpeechExtension();
        this.cancelRenderedTextBlocksAnimationFrame_();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (this.playOnOpen_ && this.computeIsReadAloudPlayable()) {
            if (!this.speechController_.isSpeechActive()) {
                this.speechController_.onPlayPauseToggle(this.$.container);
            }
            this.playOnOpen_ = false;
        }
    }
    setPlayOnOpen(playOnOpen) {
        if (this.isReadAnythingImprovedUiEnabled_) {
            this.playOnOpen_ = playOnOpen;
            this.requestUpdate();
        }
    }
    onWindowResize_() {
        requestAnimationFrame(() => {
            this.onTextLocationsChange_();
        });
    }
    onSettingsOpened_() {
        if (this.$.settingsOverlay) {
            this.$.settingsOverlay.style.display = 'block';
        }
    }
    onSettingsClosed_() {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onAllMenusClose();
        }
        if (this.$.settingsOverlay) {
            this.$.settingsOverlay.style.display = 'none';
        }
    }
    onContainerScroll_() {
        this.selectionController_.onScroll();
        this.speechController_.onScroll();
        // Add fading effect to Immersive Mode text when scrolling.
        const fontSize = Number.parseInt(window.getComputedStyle(this.$.container)
            .getPropertyValue('font-size'));
        // Add fade to scroller after the first line of text to avoid fading the
        // top of the text.
        this.$.containerScroller.scrollTop > fontSize ?
            this.$.containerScroller.classList.add('fade') :
            this.$.containerScroller.classList.remove('fade');
        this.onTextLocationsChange_();
    }
    onContainerScrollend_() {
        this.nodeStore_.estimateWordsSeenWithDelay();
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onScrollEnd(this.$.containerScroller.scrollTop);
        }
    }
    showLoading() {
        this.cancelRenderedTextBlocksAnimationFrame_();
        this.contentController_.setState(ContentType.LOADING);
        this.speechController_.resetForNewContent();
    }
    updateContent() {
        this.willDrawAgainSoon_ = this.contentBrowserProxy_.requiresDistillation();
        this.hasValidSelection_ = this.contentBrowserProxy_.hasValidSelection();
        // Remove all children from container. Use `replaceChildren` rather than
        // setting `innerHTML = ''` in order to remove all listeners, too.
        this.$.container.replaceChildren();
        const newRoot = this.contentController_.updateContent();
        if (newRoot) {
            this.$.container.appendChild(newRoot);
        }
        // Wait for the next animation frame to ensure the DOM is visible and then
        // send rendered text blocks to the controller so that it can map the
        // rendered text to the AXTree.
        this.cancelRenderedTextBlocksAnimationFrame_();
        this.renderedTextBlocksAnimationFrameHandle_ = requestAnimationFrame(() => {
            this.renderedTextBlocksAnimationFrameHandle_ = null;
            this.onRenderedTextBlocksAvailable_();
        });
        const wordCountContainer = isDistilledByReadability() ? this.$.container : newRoot;
        if (!this.willDrawAgainSoon_) {
            const wordCount = (wordCountContainer && wordCountContainer.textContent) ?
                getWordCount(wordCountContainer.textContent) :
                0;
            this.contentBrowserProxy_.onDistilled(wordCount);
            if (wordCountContainer && wordCountContainer instanceof Element) {
                this.logger_.logDistilledPageStructure(wordCountContainer);
            }
        }
    }
    getSelection() {
        assert(this.shadowRoot, 'no shadow root');
        return this.shadowRoot.getSelection();
    }
    onLinksToggle_() {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            linksEnabled: this.visualBrowserProxy_.isLinksEnabled(),
        };
        this.updateLinks_();
    }
    updateLinks_() {
        this.contentController_.updateLinks(this.shadowRoot);
    }
    onImagesToggle_() {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            imagesEnabled: this.visualBrowserProxy_.isImagesEnabled(),
        };
        this.updateImages_();
    }
    updateImages_() {
        this.contentController_.updateImages(this.shadowRoot);
    }
    onMainFrameSameDocumentNavigation_(url) {
        assert(this.shadowRoot);
        this.contentController_.scrollToAnchor(url, this.shadowRoot);
    }
    onRenderedTextMappingReady_() {
        this.contentController_.onRenderedTextMappingReady();
        this.selectionController_.updateSelection(this.getSelection(), this.$.container);
    }
    cancelRenderedTextBlocksAnimationFrame_() {
        if (this.renderedTextBlocksAnimationFrameHandle_ !== null) {
            cancelAnimationFrame(this.renderedTextBlocksAnimationFrameHandle_);
            this.renderedTextBlocksAnimationFrameHandle_ = null;
        }
    }
    onRenderedTextBlocksAvailable_() {
        this.contentController_.onRenderedTextBlocksAvailable(this.$.container);
    }
    onPresentationStateReceived_(presentationState) {
        this.presentationState_ = presentationState;
        this.logger_.setHidden(presentationState ===
            this.visualBrowserProxy_.getInHiddenPresentationState());
    }
    onLanguageMenuOpen_() {
        this.notificationManager_.removeListener(this.$.languageToast);
    }
    onLanguageMenuClose_() {
        this.notificationManager_.addListener(this.$.languageToast);
    }
    onPreviewVoice_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.speechController_.previewVoice(event.detail.previewVoice);
    }
    onVoiceMenuOpen_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.speechController_.onVoiceMenuOpen();
    }
    onVoiceMenuClose_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.speechController_.onVoiceMenuClose();
    }
    onPlayPauseClick_() {
        this.speechController_.onPlayPauseToggle(this.$.container);
    }
    ///////////////////////// LineFocusListener methods //////////////////////////
    onLineFocusVisualPositionChange(newTop, newHeight) {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        this.styleUpdater_.setLineFocusPos(newTop, newHeight);
    }
    onLineFocusContentPositionChange(newTop, newHeight, newFocalPoint) {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        this.styleUpdater_.setLineFocusPos(newTop, newHeight);
        // Only update content position when read aloud is not speaking
        // or temporarily paused (e.g. during voice preview or settings change).
        // During active speech, line focus moves on every word boundary. So
        // calling document.caretPositionFromPoint would force synchronous layout
        // recalculations on every word, lagging the UI. Additionally, calling
        // onLineFocusChange updates currentContentPosition, causing subsequent
        // Play/Pause to be slow.
        if (this.speechController_.isSpeechActive() ||
            this.speechController_.isTemporaryPause()) {
            return;
        }
        const position = document.caretPositionFromPoint(0, newFocalPoint, { shadowRoots: [this.shadowRoot] });
        this.speechController_.onLineFocusChange(position);
    }
    onNeedScrollForLineFocus(scrollDiff, instant = false) {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        const top = this.$.containerScroller.scrollTop + scrollDiff;
        this.$.containerScroller.scrollTo({ top, behavior: instant ? 'instant' : 'smooth' });
    }
    onNeedScrollToTop() {
        if (!this.visualBrowserProxy_.isLineFocusEnabled() ||
            this.$.containerScroller.scrollTop === 0) {
            return;
        }
        this.$.containerScroller.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onLineFocusModesChanged() {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        this.updateLineFocusState_();
        this.lineFocusMovement_ =
            this.lineFocusController_.getCurrentLineFocusMovement();
        this.requestUpdate();
    }
    onScrollBufferForLineFocusChange(needsBuffer) {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        const oldPadding = this.styleUpdater_.getPaddingForLineFocus();
        const newPadding = needsBuffer ? Math.floor(this.$.containerParent.offsetHeight / 2) : 0;
        if (oldPadding !== newPadding) {
            this.styleUpdater_.setPaddingForLineFocus(newPadding);
            const paddingDiff = newPadding - oldPadding;
            // Maintain the same scroll position even after adding or removing padding
            // by scrolling by the difference in padding.
            this.$.containerScroller.scrollBy({ top: paddingDiff, behavior: 'instant' });
        }
    }
    /////////////////////// end LineFocusListener methods ////////////////////////
    onContentStateChange() {
        this.contentState_ = this.contentController_.getState();
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            const lineFocusTypeForStyling = (this.contentState_.type === ContentType.HAS_CONTENT) ?
                this.lineFocusController_.getCurrentLineFocusType() :
                LineFocusType.NONE;
            this.styleUpdater_.setLineFocusStyle(lineFocusTypeForStyling);
        }
    }
    onNewPageDrawn() {
        this.$.containerScroller.scrollTop = 0;
    }
    onContentChange() {
        requestAnimationFrame(() => {
            this.onTextLocationsChange_();
        });
    }
    onPlayingFromSelection() {
        // Clear the selection so we don't keep trying to play from the same
        // selection every time they press play.
        this.getSelection()?.removeAllRanges();
    }
    onWordBoundary(segments) {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onWordBoundary(segments);
        }
    }
    onIsSpeechActiveChange() {
        this.isSpeechActive_ = this.speechController_.isSpeechActive();
        if (this.visualBrowserProxy_.isLinksEnabled() &&
            !this.speechController_.isTemporaryPause()) {
            this.updateLinks_();
        }
    }
    onIsAudioCurrentlyPlayingChange() {
        this.isAudioCurrentlyPlaying_ =
            this.speechController_.isAudioCurrentlyPlaying();
    }
    onEngineStateChange() {
        this.speechEngineLoaded_ = this.speechController_.isEngineLoaded();
    }
    onPreviewVoicePlaying() {
        this.previewVoicePlaying_ = this.speechController_.getPreviewVoicePlaying();
    }
    onEnabledLangsChange() {
        this.enabledLangs_ = this.voiceLanguageController_.getEnabledLangs();
    }
    onAvailableVoicesChange() {
        this.availableVoices_ = this.voiceLanguageController_.getAvailableVoices();
        this.localeToDisplayName_ =
            this.voiceLanguageController_.getDisplayNamesForLocaleCodes();
    }
    onCurrentVoiceChange() {
        this.selectedVoice_ = this.voiceLanguageController_.getCurrentVoice();
        this.speechController_.onSpeechSettingsChange();
    }
    onNextGranularityClick_() {
        this.speechController_.onNextGranularityClick();
    }
    onPreviousGranularityClick_() {
        this.speechController_.onPreviousGranularityClick();
    }
    onSelectVoice_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.speechController_.onVoiceSelected(event.detail.selectedVoice);
    }
    onVoiceLanguageToggle_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.voiceLanguageController_.onLanguageToggle(event.detail.language);
    }
    onVoiceLanguageSelected_(event) {
        event.preventDefault();
        event.stopPropagation();
        this.voiceLanguageController_.onLanguageSelected(event.detail.language);
    }
    onReadabilityAnchorsReady_() {
        if (this.contentBrowserProxy_.isReadabilityEnabled()) {
            this.contentController_.updateAnchorsForReadability(this.shadowRoot);
        }
    }
    onSpeechRateChange_() {
        // TODO(crbug.com/564638585): Replace manual settingsPrefs_ updates for each
        // onChange_ method with automated updates.
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            speechRate: this.audioBrowserProxy_.getSpeechRate(),
        };
        this.speechController_.onSpeechSettingsChange();
    }
    restoreSettingsFromPrefs_() {
        this.settingsPrefs_ = {
            letterSpacing: this.visualBrowserProxy_.getLetterSpacing(),
            lineSpacing: this.visualBrowserProxy_.getLineSpacing(),
            theme: this.visualBrowserProxy_.getColorTheme(),
            speechRate: this.audioBrowserProxy_.getSpeechRate(),
            font: this.visualBrowserProxy_.getFontName(),
            highlightGranularity: this.audioBrowserProxy_.getHighlightGranularity(),
            linksEnabled: this.visualBrowserProxy_.isLinksEnabled(),
            imagesEnabled: this.visualBrowserProxy_.isImagesEnabled(),
        };
        this.styleUpdater_.setAllTextStyles();
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.restoreFromPrefs(this.visualBrowserProxy_.getLastNonDisabledLineFocus(), this.visualBrowserProxy_.isLineFocusOn(), this.$.container, this.$.appFlexParent.clientHeight);
        }
    }
    onLineSpacingChange_() {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            lineSpacing: this.visualBrowserProxy_.getLineSpacing(),
        };
        this.styleUpdater_.setLineSpacing();
        this.onTextLocationsChange_();
    }
    onLetterSpacingChange_() {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            letterSpacing: this.visualBrowserProxy_.getLetterSpacing(),
        };
        this.styleUpdater_.setLetterSpacing();
        this.onTextLocationsChange_();
    }
    onFontChange_() {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            font: this.visualBrowserProxy_.getFontName(),
        };
        this.styleUpdater_.setFont();
        this.onTextLocationsChange_();
    }
    onFontSizeChange_() {
        this.styleUpdater_.setFontSize();
        this.onTextLocationsChange_();
        this.setLineFocusStyle_();
    }
    onThemeChange_(event) {
        if (this.visualBrowserProxy_.isReadAnythingImprovedUiEnabled() &&
            event.detail && event.detail.data !== undefined) {
            this.settingsPrefs_ = {
                ...this.settingsPrefs_,
                theme: event.detail.data,
            };
        }
        this.styleUpdater_.setTheme();
    }
    onPresentationChange_(event) {
        if (event.detail && event.detail.data !== undefined) {
            this.presentationState_ = event.detail.data;
        }
    }
    onHighlightChange_(event) {
        this.settingsPrefs_ = {
            ...this.settingsPrefs_,
            highlightGranularity: event.detail.data,
        };
        this.speechController_.onHighlightGranularityChange(event.detail.data);
        // Apply highlighting changes to the DOM.
        this.styleUpdater_.setHighlight();
    }
    onCloseAllMenus_() {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onAllMenusClose();
        }
    }
    onLineFocusStyleChange_(event) {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onStyleChange(event.detail.data, this.$.container, this.$.appFlexParent.clientHeight);
            this.updateLineFocusState_();
        }
    }
    onLineFocusToggleChange_(event) {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.toggle(event.detail.data, this.$.container, this.$.appFlexParent.clientHeight);
            this.updateLineFocusState_();
        }
    }
    updateLineFocusState_() {
        this.lineFocusEnabled_ = this.lineFocusController_.isEnabled();
        this.lineFocusStyle_ = this.lineFocusController_.getCurrentLineFocusStyle();
        this.setLineFocusStyle_();
        // Clear the content position if line focus is turned off.
        if (!this.lineFocusController_.isEnabled()) {
            this.speechController_.onLineFocusChange(null);
        }
    }
    onLineFocusMovementChange_(event) {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onMovementChange(event.detail.data, this.$.container, this.$.appFlexParent.clientHeight);
            this.lineFocusMovement_ =
                this.lineFocusController_.getCurrentLineFocusMovement();
            this.setLineFocusStyle_();
        }
    }
    setLineFocusStyle_() {
        if (!this.visualBrowserProxy_.isLineFocusEnabled()) {
            return;
        }
        if (this.computeHasContent()) {
            this.styleUpdater_.setLineFocusStyle(this.lineFocusController_.getCurrentLineFocusType());
            return;
        }
        this.styleUpdater_.setLineFocusStyle(LineFocusType.NONE);
    }
    onTextLocationsChange_() {
        if (this.visualBrowserProxy_.isLineFocusEnabled()) {
            this.lineFocusController_.onTextLocationsChange(this.$.container, this.$.appFlexParent.clientHeight);
        }
    }
    languageChanged() {
        this.pageLanguage_ = this.audioBrowserProxy_.getBaseLanguageForSpeech();
        // Update the font to ensure the font is valid for the page language.
        this.styleUpdater_.setFont();
    }
    computeHasContent() {
        return this.contentState_.type === ContentType.HAS_CONTENT;
    }
    computeIsReadAloudPlayable() {
        return (this.contentState_.type === ContentType.HAS_CONTENT) &&
            this.speechEngineLoaded_ && !!this.selectedVoice_ &&
            !this.willDrawAgainSoon_;
    }
    computeIsLineFocusShowing_() {
        return this.visualBrowserProxy_.isLineFocusEnabled() &&
            this.lineFocusController_.isEnabled() &&
            (this.contentState_.type === ContentType.HAS_CONTENT ||
                this.contentState_.type === ContentType.LOADING);
    }
    onKeyDown_(e) {
        if (isPlayPauseShortcut(e)) {
            e.stopPropagation();
            e.preventDefault();
            this.speechController_.onPlayPauseKeyPress(this.$.container);
        }
        else if (this.lineFocusController_.onKeyDown(e, this.$.container, this.$.appFlexParent.offsetHeight)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onScrollerMousemove_(e) {
        if (!this.isImmersiveMode()) {
            return;
        }
        const target = e.currentTarget;
        const scrollbarWidthStr = window.getComputedStyle(target).getPropertyValue('--immersive-scrollbar-width');
        const scrollbarWidth = parseInt(scrollbarWidthStr, 10) || 14;
        const rect = target.getBoundingClientRect();
        let isOverScrollbarHitbox = false;
        if (isRTL()) {
            isOverScrollbarHitbox = e.clientX <= rect.left + scrollbarWidth;
        }
        else {
            isOverScrollbarHitbox = e.clientX >= rect.right - scrollbarWidth;
        }
        if (isOverScrollbarHitbox) {
            target.classList.add('scrollbar-hovered');
        }
        else {
            target.classList.remove('scrollbar-hovered');
        }
    }
    onScrollerMouseleave_(e) {
        if (!this.isImmersiveMode()) {
            return;
        }
        const target = e.currentTarget;
        target.classList.remove('scrollbar-hovered');
    }
    getImmersiveClass_() {
        const immersiveClass = 'immersive';
        return this.isImmersiveMode() ? `${immersiveClass} full-page` :
            immersiveClass;
    }
    getLineFocusClass_() {
        if (!this.visualBrowserProxy_.isLineFocusEnabled() ||
            !this.lineFocusController_.isEnabled() ||
            this.contentState_.type !== ContentType.HAS_CONTENT) {
            return '';
        }
        const type = this.lineFocusController_.getCurrentLineFocusType();
        switch (type) {
            case LineFocusType.WINDOW:
                return 'window-mode';
            case LineFocusType.LINE:
                return 'line-mode';
            default:
                return '';
        }
    }
}
customElements.define(AppElement.is, AppElement);
