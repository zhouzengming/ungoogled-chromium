// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './icons.html.js';
import '//resources/cr_elements/cr_button/cr_button.js';
import '//resources/cr_elements/cr_icon/cr_icon.js';
import '//resources/cr_elements/cr_icon_button/cr_icon_button.js';
import '//resources/cr_elements/cr_lazy_render/cr_lazy_render_lit.js';
import '//resources/cr_elements/icons.html.js';
import './favicon_group.js';
import './reopen_tabs.js';
import './sources_menu.js';
import './overflow_menu.js';
// 
import '/shared/permission_dashboard.js';
import { HelpBubbleMixinLit } from 'chrome://resources/cr_components/help_bubble/help_bubble_mixin_lit.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { BrowserProxyImpl } from './contextual_tasks_browser_proxy.js';
import { ToolbarBrowserProxyImpl } from './contextual_tasks_toolbar_browser_proxy.js';
import { getCss } from './top_toolbar.css.js';
import { getHtml } from './top_toolbar.html.js';
import { recordAction } from './utils.js';
// 
// 
const TopToolbarElementBase = HelpBubbleMixinLit(CrLitElement);
// 
export class TopToolbarElement extends TopToolbarElementBase {
    static get is() {
        return 'top-toolbar';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            contextInfos: { type: Array },
            darkMode: {
                type: Boolean,
                reflect: true,
                attribute: 'dark-mode',
            },
            isAiPage: {
                type: Boolean,
                reflect: true,
                attribute: 'is-ai-page',
            },
            enableOpenInNewTabButton: {
                type: Boolean,
                reflect: true,
            },
            title: { type: String },
            hideOverflowMenuButton_: { type: Boolean },
            showReopenTabs_: { type: Boolean },
            isExpandButtonEnabled: { type: Boolean },
            isPinButtonEnabled: { type: Boolean },
            isPinned: { type: Boolean },
            contextManagementInComposeboxEnabled_: { type: Boolean },
            isAimEligible: {
                type: Boolean,
                reflect: true,
            },
            isCobrowseEligible: { type: Boolean },
            isUserSignedIn: { type: Boolean },
            onboardingTooltipShowing: { type: Boolean },
            contextualTasksEnableSpatialModelToolbarLayout_: { type: Boolean },
            contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow_: { type: Boolean },
            overflowMenuOpen_: { type: Boolean },
            isSidePanelRearchitectureEnabled_: {
                type: Boolean,
                reflect: true,
                attribute: 'is-side-panel-rearchitecture-enabled',
            },
            webuiRoundedIconsEnabled_: { type: Boolean },
            permissionDashboardState: { type: Object },
            permissionChipDelegate_: { type: Object },
        };
    }
    #title_accessor_storage = '';
    get title() { return this.#title_accessor_storage; }
    set title(value) { this.#title_accessor_storage = value; }
    #contextInfos_accessor_storage = [];
    get contextInfos() { return this.#contextInfos_accessor_storage; }
    set contextInfos(value) { this.#contextInfos_accessor_storage = value; }
    #darkMode_accessor_storage = false;
    get darkMode() { return this.#darkMode_accessor_storage; }
    set darkMode(value) { this.#darkMode_accessor_storage = value; }
    #isAiPage_accessor_storage = loadTimeData.getBoolean('isAiPage');
    get isAiPage() { return this.#isAiPage_accessor_storage; }
    set isAiPage(value) { this.#isAiPage_accessor_storage = value; }
    #isAimEligible_accessor_storage = loadTimeData.getBoolean('isAimEligible');
    get isAimEligible() { return this.#isAimEligible_accessor_storage; }
    set isAimEligible(value) { this.#isAimEligible_accessor_storage = value; }
    #isCobrowseEligible_accessor_storage = loadTimeData.getBoolean('isCobrowseEligible');
    get isCobrowseEligible() { return this.#isCobrowseEligible_accessor_storage; }
    set isCobrowseEligible(value) { this.#isCobrowseEligible_accessor_storage = value; }
    #permissionDashboardState_accessor_storage = null;
    get permissionDashboardState() { return this.#permissionDashboardState_accessor_storage; }
    set permissionDashboardState(value) { this.#permissionDashboardState_accessor_storage = value; }
    #isSidePanelRearchitectureEnabled__accessor_storage = loadTimeData.getBoolean('contextualTasksSidePanelRearchitectureEnabled');
    get isSidePanelRearchitectureEnabled_() { return this.#isSidePanelRearchitectureEnabled__accessor_storage; }
    set isSidePanelRearchitectureEnabled_(value) { this.#isSidePanelRearchitectureEnabled__accessor_storage = value; }
    #isUserSignedIn_accessor_storage = true;
    get isUserSignedIn() { return this.#isUserSignedIn_accessor_storage; }
    set isUserSignedIn(value) { this.#isUserSignedIn_accessor_storage = value; }
    #enableOpenInNewTabButton_accessor_storage = false;
    get enableOpenInNewTabButton() { return this.#enableOpenInNewTabButton_accessor_storage; }
    set enableOpenInNewTabButton(value) { this.#enableOpenInNewTabButton_accessor_storage = value; }
    #showReopenTabs__accessor_storage = false;
    get showReopenTabs_() { return this.#showReopenTabs__accessor_storage; }
    set showReopenTabs_(value) { this.#showReopenTabs__accessor_storage = value; }
    #onboardingTooltipShowing_accessor_storage = false;
    get onboardingTooltipShowing() { return this.#onboardingTooltipShowing_accessor_storage; }
    set onboardingTooltipShowing(value) { this.#onboardingTooltipShowing_accessor_storage = value; }
    #permissionChipDelegate__accessor_storage = null;
    get permissionChipDelegate_() { return this.#permissionChipDelegate__accessor_storage; }
    set permissionChipDelegate_(value) { this.#permissionChipDelegate__accessor_storage = value; }
    browserProxy_ = BrowserProxyImpl.getInstance();
    toolbarBrowserProxy_ = ToolbarBrowserProxyImpl.getInstance();
    listenerIds_ = [];
    toolbarListenerIds_ = [];
    // 
    sidePanelToolbarListenerIds_ = [];
    #isExpandButtonEnabled_accessor_storage = loadTimeData.getBoolean('expandButtonEnabled');
    // 
    get isExpandButtonEnabled() { return this.#isExpandButtonEnabled_accessor_storage; }
    set isExpandButtonEnabled(value) { this.#isExpandButtonEnabled_accessor_storage = value; }
    #isPinButtonEnabled_accessor_storage = loadTimeData.getBoolean('enablePinButton');
    get isPinButtonEnabled() { return this.#isPinButtonEnabled_accessor_storage; }
    set isPinButtonEnabled(value) { this.#isPinButtonEnabled_accessor_storage = value; }
    hideOverflowMenuOnAiPageEnabled_ = loadTimeData.getBoolean('hideMenuOnAiPageEnabled');
    #contextualTasksEnableSpatialModelToolbarLayout__accessor_storage = loadTimeData.getBoolean('contextualTasksEnableSpatialModelToolbarLayout');
    get contextualTasksEnableSpatialModelToolbarLayout_() { return this.#contextualTasksEnableSpatialModelToolbarLayout__accessor_storage; }
    set contextualTasksEnableSpatialModelToolbarLayout_(value) { this.#contextualTasksEnableSpatialModelToolbarLayout__accessor_storage = value; }
    #contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow__accessor_storage = loadTimeData.getBoolean('contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow');
    get contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow_() { return this.#contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow__accessor_storage; }
    set contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow_(value) { this.#contextualTasksEnableSpatialModelToolbarLayoutNewThreadInOverflow__accessor_storage = value; }
    #hideOverflowMenuButton__accessor_storage = this.hideOverflowMenuOnAiPageEnabled_ && this.isAiPage;
    get hideOverflowMenuButton_() { return this.#hideOverflowMenuButton__accessor_storage; }
    set hideOverflowMenuButton_(value) { this.#hideOverflowMenuButton__accessor_storage = value; }
    #isPinned_accessor_storage = loadTimeData.getBoolean('isSidePanelPinned');
    get isPinned() { return this.#isPinned_accessor_storage; }
    set isPinned(value) { this.#isPinned_accessor_storage = value; }
    #contextManagementInComposeboxEnabled__accessor_storage = loadTimeData.getBoolean('contextManagementInComposeboxEnabled');
    get contextManagementInComposeboxEnabled_() { return this.#contextManagementInComposeboxEnabled__accessor_storage; }
    set contextManagementInComposeboxEnabled_(value) { this.#contextManagementInComposeboxEnabled__accessor_storage = value; }
    #overflowMenuOpen__accessor_storage = false;
    get overflowMenuOpen_() { return this.#overflowMenuOpen__accessor_storage; }
    set overflowMenuOpen_(value) { this.#overflowMenuOpen__accessor_storage = value; }
    #webuiRoundedIconsEnabled__accessor_storage = loadTimeData.getBoolean('webuiRoundedIconsEnabled');
    get webuiRoundedIconsEnabled_() { return this.#webuiRoundedIconsEnabled__accessor_storage; }
    set webuiRoundedIconsEnabled_(value) { this.#webuiRoundedIconsEnabled__accessor_storage = value; }
    boundOnWindowBlur_ = this.onWindowBlur_.bind(this);
    connectedCallback() {
        super.connectedCallback();
        const callbackRouter = this.browserProxy_.callbackRouter;
        this.listenerIds_ = [
            callbackRouter.setShowReopenTabs.addListener(show => {
                this.showReopenTabs_ = show;
            }),
            callbackRouter.setExpandButtonEnabled.addListener((enabled) => {
                this.isExpandButtonEnabled = enabled;
            }),
        ];
        this.toolbarListenerIds_ = [
            this.toolbarBrowserProxy_.callbackRouter.onSidePanelPinStateChanged
                .addListener((isPinned) => {
                this.isPinned = isPinned;
            }),
            this.toolbarBrowserProxy_.callbackRouter.onContextUpdated.addListener((contextInfos) => {
                this.contextInfos = contextInfos;
            }),
        ];
        window.addEventListener('blur', this.boundOnWindowBlur_);
        // 
        const toolbarUiService = this.toolbarBrowserProxy_.toolbarUiService;
        const toolbarUiObserverCallbackRouter = this.toolbarBrowserProxy_.toolbarUiObserverCallbackRouter;
        this.sidePanelToolbarListenerIds_ = [
            toolbarUiObserverCallbackRouter.onPermissionDashboardStateChanged
                .addListener((state) => {
                this.permissionDashboardState = state;
            }),
        ];
        toolbarUiService.getInitialState().then((response) => {
            if (!this.isConnected) {
                return;
            }
            if (response) {
                if (response.updateStream) {
                    toolbarUiObserverCallbackRouter.$.bindHandle(response.updateStream.handle);
                }
                if (response.state !== undefined) {
                    this.permissionDashboardState = response.state;
                }
            }
        }, () => { });
        this.permissionChipDelegate_ = {
            onChipClicked: (id, isPointer) => {
                toolbarUiService.onChipClicked(id, isPointer);
            },
            onChipPointerEntered: (id) => {
                toolbarUiService.onChipPointerEntered(id);
            },
            onChipPointerExited: (id) => {
                toolbarUiService.onChipPointerExited(id);
            },
            onChipMousePressed: (id, _isMiddleClick) => {
                toolbarUiService.onChipMousePressed(id);
            },
            onChipExpandAnimationEnded: (id) => {
                toolbarUiService.onChipExpandAnimationEnded(id);
            },
            onChipCollapseAnimationEnded: (id) => {
                toolbarUiService.onChipCollapseAnimationEnded(id);
            },
        };
        // 
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.listenerIds_.forEach(id => this.browserProxy_.callbackRouter.removeListener(id));
        this.listenerIds_ = [];
        this.toolbarListenerIds_.forEach(id => this.toolbarBrowserProxy_.callbackRouter.removeListener(id));
        this.toolbarListenerIds_ = [];
        window.removeEventListener('blur', this.boundOnWindowBlur_);
        // 
        const toolbarUiObserverCallbackRouter = this.toolbarBrowserProxy_.toolbarUiObserverCallbackRouter;
        this.sidePanelToolbarListenerIds_.forEach(id => toolbarUiObserverCallbackRouter.removeListener(id));
        this.sidePanelToolbarListenerIds_ = [];
        toolbarUiObserverCallbackRouter.$.close();
        // 
    }
    // Dismisses any open menu when the side panel loses focus. Clicks outside of
    // the side panel (e.g. on the page contents, the Lens crop frame, or a search
    // result in the sandboxed results frame) never reach this document, so
    // `cr-action-menu`'s own light dismiss does not run. See crbug.com/543760434.
    onWindowBlur_() {
        this.$.overflowMenu.getIfExists()?.close();
        this.$.sourcesMenu.getIfExists()?.close();
    }
    // 
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.registerHelpBubble('kContextualTasksWebUIToolbarElementId', '#top-row');
        this.registerHelpBubble('kContextualTasksWebUIOverflowMenuElementId', '#overflowMenuButton');
        // Register help bubble only if 'G' logo is being shown.
        if (this
            .shadowRoot?.querySelector('.top-toolbar-logo')) {
            this.registerHelpBubble('kContextualTasksSuperGButtonElementId', '.top-toolbar-logo');
        }
    }
    // 
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('isAiPage') ||
            changedProperties.has('onboardingTooltipShowing')) {
            this.hideOverflowMenuButton_ =
                this.isAiPage && this.hideOverflowMenuOnAiPageEnabled_;
            // 
            if (this.isAiPage) {
                if (!this.onboardingTooltipShowing) {
                    this.browserProxy_.handler.maybeTriggerPinningPromo();
                }
            }
            // 
        }
    }
    // If permission dashboard is not imported due to being on android, the
    // optional chaining (?) causes this to return false.
    isPermissionShowing_() {
        return this.isSidePanelRearchitectureEnabled_ &&
            (!!this.permissionDashboardState?.indicatorChip?.isVisible ||
                !!this.permissionDashboardState?.requestChip?.isVisible);
    }
    shouldShowSourcesMenuButton_() {
        return this.contextInfos.length > 0;
    }
    onPinClick_() {
        this.isPinned = !this.isPinned;
    }
    onCloseButtonClick_() {
        recordAction('ContextualTasks.WebUI.UserAction.CloseSidePanel');
        this.browserProxy_.handler.closeSidePanel();
    }
    onNewThreadClick_() {
        this.fire('new-thread-click');
    }
    onThreadHistoryClick_() {
        recordAction('ContextualTasks.WebUI.UserAction.OpenThreadHistory');
        this.toolbarBrowserProxy_.handler.showThreadHistory();
    }
    onOverflowMenuButtonClick_(e) {
        recordAction('ContextualTasks.WebUI.UserAction.OpenOverflowMenu');
        this.$.overflowMenu.get().showAt(e.target);
    }
    onOverflowMenuOpenChanged_(e) {
        this.overflowMenuOpen_ = e.detail.value;
    }
    onSourcesClick_(e) {
        recordAction('ContextualTasks.WebUI.UserAction.OpenSourcesMenu');
        this.$.sourcesMenu.get().showAt(e.target);
    }
    onOpenInNewTabClick_() {
        recordAction('ContextualTasks.WebUI.UserAction.OpenInNewTab');
        this.toolbarBrowserProxy_.handler.moveTaskUiToNewTab();
    }
    onReopenTabsReopenClick_() {
        this.browserProxy_.handler.reopenTabs();
    }
    onReopenTabsDismissClick_() {
        this.showReopenTabs_ = false;
    }
    onLogoPointerdown_() {
        if (!this.isSidePanelRearchitectureEnabled_) {
            return;
        }
        this.browserProxy_.handler.onLogoPointerDown();
    }
    onLogoClick_(e) {
        if (!this.isSidePanelRearchitectureEnabled_) {
            return;
        }
        // Keyboard synthetic clicks generate PointerEvents with an empty
        // pointerType in WebUI, whereas natural pointer clicks have a valid
        // pointerType (e.g., 'mouse', 'touch', 'pen').
        this.browserProxy_.handler.showPageInfoBubble(e instanceof PointerEvent && e.pointerType !== '');
    }
}
customElements.define(TopToolbarElement.is, TopToolbarElement);
