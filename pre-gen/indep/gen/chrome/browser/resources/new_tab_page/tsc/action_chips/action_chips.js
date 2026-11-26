// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import { ToolMode } from '//resources/cr_components/composebox/composebox_query.mojom-webui.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { QueryActionOverride } from 'chrome://resources/mojo/components/omnibox/browser/fusebox_action.mojom-webui.js';
import { TabAttachmentSource } from 'chrome://resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { IconType } from '../action_chips.mojom-webui.js';
import { WindowProxy } from '../window_proxy.js';
import { getCss } from './action_chips.css.js';
import { getHtml } from './action_chips.html.js';
import { ActionChipsApiProxyImpl } from './action_chips_proxy.js';
// Records a click metric for the given action chip icon type.
function recordClick(iconType) {
    chrome.metricsPrivate.recordEnumerationValue('NewTabPage.ActionChips.Click2', iconType, IconType.MAX_VALUE + 1);
}
// Records a latency metric.
function recordLatency(metricName, latency) {
    chrome.metricsPrivate.recordTime(metricName, Math.round(latency));
}
/**
 * The enum value sent as part of action-chips-retrieval-state-changed.
 * The handler of the event should expect to receive UPDATED multiple times.
 */
export var ActionChipsRetrievalState;
(function (ActionChipsRetrievalState) {
    // The initial state. This is not sent as part of the event and can be used as
    // the default value of a variable containing this enum.
    ActionChipsRetrievalState[ActionChipsRetrievalState["INITIAL"] = 0] = "INITIAL";
    // The state used in an event firing when the first and only retrieval
    // request is sent from this component.
    ActionChipsRetrievalState[ActionChipsRetrievalState["REQUESTED"] = 1] = "REQUESTED";
    // The state used in events firing when the action chips are updated by a call
    // from the browser side.
    ActionChipsRetrievalState[ActionChipsRetrievalState["UPDATED"] = 2] = "UPDATED";
})(ActionChipsRetrievalState || (ActionChipsRetrievalState = {}));
const kActionChipsRetrievalStateChangedEvent = 'action-chips-retrieval-state-changed';
/**
 * The element for displaying Action Chips.
 */
export class ActionChipsElement extends CrLitElement {
    static get is() {
        return 'ntp-action-chips';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            showBackground: { type: Boolean, reflect: true },
            actionChips_: { type: Array, state: true },
            showDismissalUI_: {
                type: Boolean,
                reflect: true,
            },
            disablementContextMenuEnabled_: {
                type: Boolean,
                reflect: true,
            },
            smallChipsEnabled_: {
                type: Boolean,
                reflect: true,
                attribute: 'small-chips-enabled',
            },
        };
    }
    #showBackground_accessor_storage = false;
    get showBackground() { return this.#showBackground_accessor_storage; }
    set showBackground(value) { this.#showBackground_accessor_storage = value; }
    #actionChips__accessor_storage = [];
    get actionChips_() { return this.#actionChips__accessor_storage; }
    set actionChips_(value) { this.#actionChips__accessor_storage = value; }
    #showDismissalUI__accessor_storage = loadTimeData.getBoolean('ntpNextShowDismissalUIEnabled');
    get showDismissalUI_() { return this.#showDismissalUI__accessor_storage; }
    set showDismissalUI_(value) { this.#showDismissalUI__accessor_storage = value; }
    #disablementContextMenuEnabled__accessor_storage = loadTimeData.getBoolean('ntpNextDisablementContextMenuEnabled');
    get disablementContextMenuEnabled_() { return this.#disablementContextMenuEnabled__accessor_storage; }
    set disablementContextMenuEnabled_(value) { this.#disablementContextMenuEnabled__accessor_storage = value; }
    #smallChipsEnabled__accessor_storage = loadTimeData.getBoolean('ntpSmallActionChipsEnabled');
    get smallChipsEnabled_() { return this.#smallChipsEnabled__accessor_storage; }
    set smallChipsEnabled_(value) { this.#smallChipsEnabled__accessor_storage = value; }
    callbackRouter;
    delayTabUploads_ = loadTimeData.getBoolean('addTabUploadDelayOnActionChipClick');
    handler;
    initialLoadStartTime_ = null;
    onActionChipChangedListenerId_ = null;
    getAdditionalIconClasses_(chip) {
        switch (chip.suggestTemplateInfo.typeIcon) {
            case IconType.kBanana:
                return 'icon-type-banana';
            case IconType.kGlobeWithSearchLoop:
                return 'icon-type-globe-with-search-loop';
            case IconType.kSubArrowRight:
                return 'icon-type-sub-arrow-right';
            case IconType.kDraftSpark:
                return 'icon-type-draft-spark';
            case IconType.kFavicon:
                return 'icon-type-favicon';
            case IconType.kSearchLoopWithSparkle:
                return 'icon-type-search-spark';
            case IconType.kLightbulb:
                return 'icon-type-lightbulb';
            case IconType.kAttachFile:
                return 'icon-type-attach-file';
            case IconType.kSchool:
                return 'icon-type-school';
            case IconType.kInkPen:
                return 'icon-type-ink-pen';
            case IconType.kTab:
                return 'icon-type-tab';
            case IconType.kPhotoSpark:
                return 'icon-type-photo-spark';
            case IconType.kBolt:
                return 'icon-type-bolt';
            case IconType.kImageCreate:
                return 'icon-type-image-create';
            default:
                return '';
        }
    }
    constructor() {
        super();
        const proxy = ActionChipsApiProxyImpl.getInstance();
        this.handler = proxy.getHandler();
        this.callbackRouter = proxy.getCallbackRouter();
        this.initialLoadStartTime_ = WindowProxy.getInstance().now();
    }
    connectedCallback() {
        super.connectedCallback();
        this.onActionChipChangedListenerId_ =
            this.callbackRouter.onActionChipsChanged.addListener((actionChips) => {
                this.actionChips_ = actionChips;
                this.toggleAttribute('has-chips', actionChips.length > 0);
                this.fire(kActionChipsRetrievalStateChangedEvent, { state: ActionChipsRetrievalState.UPDATED });
            });
        this.handler.startActionChipsRetrieval();
        this.fire(kActionChipsRetrievalStateChangedEvent, { state: ActionChipsRetrievalState.REQUESTED });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.callbackRouter.removeListener(this.onActionChipChangedListenerId_);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        // Records only the first load latency after rendering chips.
        if (this.initialLoadStartTime_ !== null && this.actionChips_.length > 0) {
            recordLatency('NewTabPage.ActionChips.WebUI.InitialLoadLatency', WindowProxy.getInstance().now() - this.initialLoadStartTime_);
            this.initialLoadStartTime_ = null;
        }
    }
    onClick_(e) {
        const index = Number(e.currentTarget.dataset['index']);
        const chip = this.actionChips_[index];
        switch (chip.suggestTemplateInfo.fuseboxAction?.preselectedTool) {
            case ToolMode.kImageGen:
                this.handler.activateMetricsFunnel('CreateImageChip');
                break;
            case ToolMode.kDeepSearch:
                this.handler.activateMetricsFunnel('DeepSearchChip');
                break;
            case ToolMode.kCanvas:
                this.handler.activateMetricsFunnel('CanvasChip');
                break;
            case ToolMode.kUnspecified:
                if (chip.suggestTemplateInfo.typeIcon === IconType.kFavicon) {
                    this.handler.activateMetricsFunnel('RecentTabChip');
                }
                else if (chip.suggestTemplateInfo.typeIcon === IconType.kSubArrowRight) {
                    this.handler.activateMetricsFunnel('DeepDiveChip');
                }
                else if (chip.suggestTemplateInfo.typeIcon ===
                    IconType.kSearchLoopWithSparkle) {
                    this.handler.activateMetricsFunnel('PromptSuggestionChip');
                }
                break;
            default:
            // Do nothing yet...
        }
        this.onActionChipClick_(chip, e);
    }
    // Auxclick fires for all non-primary mouse buttons. Only handle middle clicks
    // (button 1) to open in a new background tab, and ignore other buttons.
    onAuxclick_(e) {
        if (e.button === 1) {
            this.onClick_(e);
        }
    }
    onRemoveClick_(e) {
        e.preventDefault();
        e.stopPropagation();
        const index = Number(e.currentTarget.dataset['index']);
        const chip = this.actionChips_[index];
        this.actionChips_ =
            this.actionChips_.filter((c) => c.suggestion !== chip.suggestion);
        this.toggleAttribute('has-chips', this.actionChips_.length > 0);
    }
    onContextmenu_(e) {
        e.preventDefault();
        e.stopPropagation();
        this.$.actionMenu.showAt(e.target);
    }
    onDisableSuggestionClick_() {
        this.$.actionMenu.close();
        this.handler.setActionChipsVisibility(false);
        this.fire('action-chips-disabled', {
            message: loadTimeData.getString('actionChipsUndoDisablementToastMessage'),
            undo: () => this.handler.setActionChipsVisibility(true),
        });
    }
    getFaviconUrl_(url) {
        const faviconUrl = new URL('chrome://favicon2/');
        faviconUrl.searchParams.set('size', '24');
        faviconUrl.searchParams.set('scaleFactor', '1x');
        faviconUrl.searchParams.set('showFallbackMonogram', '');
        faviconUrl.searchParams.set('pageUrl', url);
        return faviconUrl.href;
    }
    getMostRecentTabFaviconUrl_(chip) {
        return chip.tab ? this.getFaviconUrl_(chip.tab.url) : '';
    }
    onActionChipClick_(chip, e) {
        recordClick(chip.suggestTemplateInfo.typeIcon);
        if (chip.suggestTemplateInfo.fuseboxAction?.queryActionOverride ===
            QueryActionOverride.kDefault) {
            this.handler.navigateToAim(chip.suggestion, e.button || 0, {
                altKey: e.altKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
            });
            return;
        }
        const contextFiles = [];
        const tab = chip.tab;
        if (tab) {
            const tabInfo = {
                tabId: tab.tabId,
                url: tab.url,
                title: tab.title,
                delayUpload: this.delayTabUploads_,
                origin: TabAttachmentSource.kActionChip,
            };
            contextFiles.push(tabInfo);
        }
        this.fire('action-chip-click', {
            suggestion: chip.suggestion,
            files: contextFiles,
            fuseboxAction: chip.suggestTemplateInfo.fuseboxAction ?? undefined,
        });
    }
    recentTabChipTitle_(chip) {
        if (!chip.tab) {
            return '';
        }
        const url = new URL(chip.tab.url);
        const domain = url.hostname.replace(/^www\./, '');
        return `${chip.suggestTemplateInfo.secondaryText?.text ?? ''} - ${domain}`;
    }
    getChipSubtitle_(chip) {
        return chip.suggestTemplateInfo.secondaryText?.text ?? '';
    }
    getChipTitle_(chip) {
        const primaryText = chip.suggestTemplateInfo.primaryText;
        const secondaryText = chip.suggestTemplateInfo.secondaryText;
        const primary = primaryText?.a11yText || primaryText?.text || '';
        const secondary = secondaryText?.a11yText || secondaryText?.text || '';
        if (primary && secondary) {
            return `${primary} ${secondary}`;
        }
        return primary || secondary || '';
    }
}
customElements.define(ActionChipsElement.is, ActionChipsElement);
