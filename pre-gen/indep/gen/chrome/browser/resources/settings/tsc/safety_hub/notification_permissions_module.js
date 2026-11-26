// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * @fileoverview
 * 'settings-safety-hub-notification-permissions-module' is the module in Safety
 * Hub page that show the origins sending a lot of notifications.
 */
import 'chrome://resources/cr_elements/cr_action_menu/cr_action_menu.js';
import 'chrome://resources/cr_elements/cr_toast/cr_toast.js';
import 'chrome://resources/cr_elements/cr_icon_button/cr_icon_button.js';
import 'chrome://resources/cr_elements/cr_button/cr_button.js';
import 'chrome://resources/cr_elements/cr_tooltip/cr_tooltip.js';
import '../i18n_setup.js';
import '../icons.html.js';
import './safety_hub_module.js';
import { I18nMixinLit } from 'chrome://resources/cr_elements/i18n_mixin_lit.js';
import { WebUiListenerMixinLit } from 'chrome://resources/cr_elements/web_ui_listener_mixin_lit.js';
import { assert, assertNotReached } from 'chrome://resources/js/assert.js';
import { EventTracker } from 'chrome://resources/js/event_tracker.js';
import { PluralStringProxyImpl } from 'chrome://resources/js/plural_string_proxy.js';
import { isUndoKeyboardEvent } from 'chrome://resources/js/util.js';
import { CrLitElement } from 'chrome://resources/lit/v3_0/lit.rollup.js';
import { MetricsBrowserProxyImpl, SafetyCheckNotificationsModuleInteractions } from '../metrics_browser_proxy.js';
import { routes } from '../route.js';
import { RouteObserverMixinLit, Router } from '../router.js';
import { SafetyHubBrowserProxyImpl, SafetyHubEvent } from '../safety_hub/safety_hub_browser_proxy.js';
import { TooltipMixinLit } from '../tooltip_mixin_lit.js';
import { getCss } from './notification_permissions_module.css.js';
import { getHtml } from './notification_permissions_module.html.js';
/**
 * The list of actions that a user can take with regards to the permissions of
 * notifications.
 */
var Actions;
(function (Actions) {
    Actions["BLOCK"] = "block";
    Actions["BLOCK_ALL"] = "block_all";
    Actions["IGNORE"] = "ignore";
    Actions["RESET"] = "reset";
})(Actions || (Actions = {}));
const SettingsSafetyHubNotificationPermissionsModuleElementBase = TooltipMixinLit(WebUiListenerMixinLit(RouteObserverMixinLit(I18nMixinLit(CrLitElement))));
export class SettingsSafetyHubNotificationPermissionsModuleElement extends SettingsSafetyHubNotificationPermissionsModuleElementBase {
    static get is() {
        return 'settings-safety-hub-notification-permissions-module';
    }
    static get styles() {
        return getCss();
    }
    render() {
        return getHtml.bind(this)();
    }
    static get properties() {
        return {
            // The string for the primary header label.
            headerString_: { type: String },
            // Text below primary header label.
            subheaderString_: { type: String },
            // The text that will be shown in the undo toast element.
            toastText_: { type: String },
            // The last action taken by the user: block, reset or ignore.
            lastUserAction_: { type: String },
            // The last origins that the user interacted with.
            lastOrigins_: { type: Array },
            // List of domains that sends a lot of notifications.
            sites_: { type: Array },
            // Indicates whether user has finished the review process.
            shouldShowCompletionInfo_: { type: Boolean },
        };
    }
    #headerString__accessor_storage = '';
    get headerString_() { return this.#headerString__accessor_storage; }
    set headerString_(value) { this.#headerString__accessor_storage = value; }
    #subheaderString__accessor_storage = '';
    get subheaderString_() { return this.#subheaderString__accessor_storage; }
    set subheaderString_(value) { this.#subheaderString__accessor_storage = value; }
    #toastText__accessor_storage = null;
    get toastText_() { return this.#toastText__accessor_storage; }
    set toastText_(value) { this.#toastText__accessor_storage = value; }
    #sites__accessor_storage = null;
    get sites_() { return this.#sites__accessor_storage; }
    set sites_(value) { this.#sites__accessor_storage = value; }
    #shouldShowCompletionInfo__accessor_storage = false;
    get shouldShowCompletionInfo_() { return this.#shouldShowCompletionInfo__accessor_storage; }
    set shouldShowCompletionInfo_(value) { this.#shouldShowCompletionInfo__accessor_storage = value; }
    #lastOrigins__accessor_storage = [];
    get lastOrigins_() { return this.#lastOrigins__accessor_storage; }
    set lastOrigins_(value) { this.#lastOrigins__accessor_storage = value; }
    renderedOrigins_ = [];
    #lastUserAction__accessor_storage = null;
    get lastUserAction_() { return this.#lastUserAction__accessor_storage; }
    set lastUserAction_(value) { this.#lastUserAction__accessor_storage = value; }
    eventTracker_ = new EventTracker();
    browserProxy_ = SafetyHubBrowserProxyImpl.getInstance();
    metricsBrowserProxy_ = MetricsBrowserProxyImpl.getInstance();
    async connectedCallback() {
        // Register for review notification permission list updates.
        this.addWebUiListener(SafetyHubEvent.NOTIFICATION_PERMISSIONS_MAYBE_CHANGED, (sites) => this.onNotificationPermissionListChanged_(sites));
        const sites = await this.browserProxy_.getNotificationPermissionReview();
        this.onNotificationPermissionListChanged_(sites);
        // This should be called after the sites have been retrieved such that
        // currentRouteChanged is called afterwards.
        super.connectedCallback();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll();
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has('lastUserAction_') ||
            changedPrivateProperties.has('lastOrigins_')) {
            this.updateUndoNotificationText_();
        }
        if (changedPrivateProperties.has('sites_')) {
            this.shouldShowCompletionInfo_ = this.computeShouldShowCompletionInfo_();
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const changedPrivateProperties = changedProperties;
        if (changedPrivateProperties.has('sites_') ||
            changedPrivateProperties.has('shouldShowCompletionInfo_')) {
            this.onSitesChanged_();
        }
    }
    currentRouteChanged(currentRoute) {
        if (currentRoute !== routes.SAFETY_HUB) {
            // Remove event listener when navigating away from the page.
            this.eventTracker_.removeAll();
            return;
        }
        if (this.sites_ !== null) {
            this.metricsBrowserProxy_
                .recordSafetyHubNotificationPermissionsModuleListCountHistogram(this.sites_.length);
        }
        this.eventTracker_.add(document, 'keydown', (e) => this.onKeyDown_(e));
    }
    /* Repopulate the list when notification permission list is updated. */
    onNotificationPermissionListChanged_(sites) {
        this.sites_ = sites.map((site) => ({ ...site, detail: site.notificationInfoString }));
    }
    setHeaderToCompletionState_() {
        assert(this.toastText_);
        this.headerString_ = this.toastText_;
        this.subheaderString_ = '';
    }
    async onSitesChanged_() {
        if (this.sites_ === null) {
            return;
        }
        // Run the show animation on all new items, i.e. those items
        // in |this.sites_| which aren't already rendered.
        this.$.module.animateShow(this.sites_.map(site => site.origin)
            .filter(origin => !this.renderedOrigins_.includes(origin)));
        this.renderedOrigins_ = this.sites_.map(site => site.origin);
        if (this.shouldShowCompletionInfo_) {
            this.setHeaderToCompletionState_();
            return;
        }
        this.headerString_ =
            await PluralStringProxyImpl.getInstance().getPluralString('safetyHubNotificationPermissionsPrimaryLabel', this.sites_.length);
        this.subheaderString_ =
            await PluralStringProxyImpl.getInstance().getPluralString('safetyHubNotificationPermissionsSecondaryLabel', this.sites_.length);
    }
    /** Clears all the changes made by a previous action. */
    resetValues_(e) {
        e.stopPropagation();
        this.$.undoToast.hide();
        this.lastOrigins_ = [];
        this.lastUserAction_ = null;
    }
    /** Sets all the values needed for an action. */
    setValues_(origins, action) {
        //  Both lastUserAction_ and lastOrigins_ need to be reset before setting
        //  new values to prevent triggering updateUndoNotificationText_ twice
        //  (which can cause issues like "flickering" on the header string, e.g.
        //  when the wrong header string is shown for a split second before the
        //  correct one).
        assert(!this.lastUserAction_);
        assert(!this.lastOrigins_.length);
        this.lastOrigins_ = origins;
        this.lastUserAction_ = action;
    }
    onShModuleItemButtonClick_(e) {
        this.resetValues_(e);
        this.setValues_([e.detail.origin], Actions.BLOCK);
        this.showUndoToast_();
        this.$.module.animateHide(e.detail.origin, this.browserProxy_.blockNotificationPermissionForOrigins.bind(this.browserProxy_, this.lastOrigins_));
        this.browserProxy_.recordSafetyHubInteraction();
        this.metricsBrowserProxy_
            .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.BLOCK);
    }
    onShModuleMoreActionButtonClick_(e) {
        this.resetValues_(e);
        this.lastOrigins_ = [e.detail.origin];
        this.$.actionMenu.showAt(e.detail.target);
    }
    onIgnoreClick_(e) {
        const tempLastOrigins = this.lastOrigins_;
        this.resetValues_(e);
        this.setValues_(tempLastOrigins, Actions.IGNORE);
        this.showUndoToast_();
        this.$.actionMenu.close();
        // |lastOrigins| is set to a 1-item array containing the item on which
        // the context menu with the |reset| option was open,
        // in |onMoreActionClick_|.
        this.$.module.animateHide(this.lastOrigins_[0], this.browserProxy_.ignoreNotificationPermissionForOrigins.bind(this.browserProxy_, this.lastOrigins_));
        this.browserProxy_.recordSafetyHubInteraction();
        this.metricsBrowserProxy_
            .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.IGNORE);
    }
    onResetClick_(e) {
        const tempLastOrigins = this.lastOrigins_;
        this.resetValues_(e);
        this.setValues_(tempLastOrigins, Actions.RESET);
        this.showUndoToast_();
        this.$.actionMenu.close();
        // |lastOrigins| is set to a 1-item array containing the item on which
        // the context menu with the |reset| option was open,
        // in |onMoreActionClick_|.
        this.$.module.animateHide(this.lastOrigins_[0], this.browserProxy_.resetNotificationPermissionForOrigins.bind(this.browserProxy_, this.lastOrigins_));
        this.browserProxy_.recordSafetyHubInteraction();
        this.metricsBrowserProxy_
            .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.RESET);
    }
    onBlockAllClick_(e) {
        this.resetValues_(e);
        // To be able to undo the block-all action, we need to keep track of all
        // origins that were blocked.
        assert(this.sites_);
        this.setValues_(this.sites_.map(site => site.origin), Actions.BLOCK_ALL);
        this.$.module.animateHide(
        /* all origins */ null, this.browserProxy_.blockNotificationPermissionForOrigins.bind(this.browserProxy_, this.lastOrigins_));
        this.browserProxy_.recordSafetyHubInteraction();
        this.metricsBrowserProxy_
            .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.BLOCK_ALL);
    }
    onUndoClick_(e) {
        e.stopPropagation();
        this.undoLastAction_();
    }
    onHeaderMoreActionClick_(e) {
        e.stopPropagation();
        this.$.headerActionMenu.showAt(e.target);
    }
    onGoToSettingsClick_(e) {
        e.stopPropagation();
        this.$.headerActionMenu.close();
        Router.getInstance().navigateTo(routes.SITE_SETTINGS_NOTIFICATIONS, /* dynamicParams= */ undefined, 
        /* removeSearch= */ true);
        this.metricsBrowserProxy_
            .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.GO_TO_SETTINGS);
    }
    async updateUndoNotificationText_() {
        if (!this.lastUserAction_ || this.lastOrigins_.length === 0) {
            return;
        }
        switch (this.lastUserAction_) {
            case Actions.BLOCK:
                this.toastText_ = this.i18n('safetyHubNotificationPermissionReviewBlockedToastLabel', this.lastOrigins_[0]);
                break;
            case Actions.BLOCK_ALL:
                this.toastText_ =
                    await PluralStringProxyImpl.getInstance().getPluralString('safetyHubNotificationPermissionReviewBlockAllToastLabel', this.lastOrigins_.length);
                break;
            case Actions.IGNORE:
                this.toastText_ = this.i18n('safetyHubNotificationPermissionReviewIgnoredToastLabel', this.lastOrigins_[0]);
                break;
            case Actions.RESET:
                this.toastText_ = this.i18n('safetyHubNotificationPermissionReviewResetToastLabel', this.lastOrigins_[0]);
                break;
            default:
                assertNotReached();
        }
    }
    showUndoToast_() {
        // Only show Undo toast if there are multiple sites to review. Otherwise,
        // once the single site is reviewed, the completion state with a permanent
        // Undo button in the header will be shown.
        if (this.sites_.length > 1) {
            this.$.undoToast.show();
        }
    }
    undoLastAction_() {
        switch (this.lastUserAction_) {
            // As BLOCK and RESET actions just change the notification permission,
            // undoing them only requires allowing notification permissions again.
            case Actions.BLOCK:
                this.browserProxy_.allowNotificationPermissionForOrigins(this.lastOrigins_);
                this.metricsBrowserProxy_
                    .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.UNDO_BLOCK);
                break;
            case Actions.BLOCK_ALL:
                this.browserProxy_.allowNotificationPermissionForOrigins(this.lastOrigins_);
                this.metricsBrowserProxy_
                    .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.UNDO_BLOCK_ALL);
                break;
            case Actions.RESET:
                this.browserProxy_.allowNotificationPermissionForOrigins(this.lastOrigins_);
                this.metricsBrowserProxy_
                    .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.UNDO_RESET);
                break;
            case Actions.IGNORE:
                this.browserProxy_.undoIgnoreNotificationPermissionForOrigins(this.lastOrigins_);
                this.metricsBrowserProxy_
                    .recordSafetyHubNotificationPermissionsModuleInteractionsHistogram(SafetyCheckNotificationsModuleInteractions.UNDO_IGNORE);
                break;
            default:
                assertNotReached();
        }
        this.$.undoToast.hide();
    }
    onKeyDown_(e) {
        // Only allow undoing via ctrl+z when the undo toast is opened.
        if (!this.$.undoToast.open) {
            return;
        }
        if (isUndoKeyboardEvent(e)) {
            this.undoLastAction_();
            e.stopPropagation();
        }
    }
    /** Show info that review is completed when there are no permissions left. */
    computeShouldShowCompletionInfo_() {
        return this.sites_ !== null && this.sites_.length === 0;
    }
    getIgnoreAriaLabelForOrigins_() {
        // A label is only needed when the action menu is shown for a single origin.
        if (this.lastOrigins_.length !== 1) {
            return '';
        }
        return this.i18n('safetyHubNotificationPermissionReviewIgnoreAriaLabel', this.lastOrigins_[0]);
    }
    getResetAriaLabelForOrigins_() {
        // A label is only needed when the action menu is shown for a single origin.
        if (this.lastOrigins_.length !== 1) {
            return '';
        }
        return this.i18n('safetyHubNotificationPermissionReviewResetAriaLabel', this.lastOrigins_[0]);
    }
    onBulkUndoButtonFocus_(e) {
        this.showUndoTooltip_(e);
    }
    onBulkUndoButtonMouseenter_(e) {
        this.showUndoTooltip_(e);
    }
    showUndoTooltip_(e) {
        e.stopPropagation();
        const tooltip = this.shadowRoot.querySelector('cr-tooltip');
        assert(tooltip);
        this.showTooltipAtTarget(tooltip, e.target);
    }
}
customElements.define(SettingsSafetyHubNotificationPermissionsModuleElement.is, SettingsSafetyHubNotificationPermissionsModuleElement);
