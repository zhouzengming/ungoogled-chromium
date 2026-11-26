// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// This file handles messages from the client, usually passing them on
// to the browser via mojo.
import { assertNotReached } from '//resources/js/assert.js';
import { enumFromClient } from '../../enum_conversions.js';
import { //
PromptType as PromptTypeMojo, //
ResponseStopCause as ResponseStopCauseMojo, //
TabDataHandlerReceiver, //
 } from '../../glic.mojom-webui.js';
import { ResponseStopCause } from '../../glic_api/glic_api.js';
import { replaceProperties } from '../conversions.js';
import { ErrorWithReasonImpl, exceptionFromTransferable } from '../request_types.js';
import { ResponseExtras } from '../transport/messaging.js';
import { //
bitmapN32ToRGBAImage, //
conversationInfoFromClient, //
counterAbuseVerdictFromClient, //
idFromClient, //
idToClient, //
imageBytesResultToClient, //
microphoneStatusToMojo, //
openPinnedTabPickerOptionsToMojo, //
optionalFromClient, //
pinTabsOptionsToMojo, //
tabContextOptionsFromClient, //
tabContextToClient, //
tabDataToPrivate, //
timeDeltaFromClient, //
unpinTabsOptionsToMojo, //
urlToClient, //
webClientModeToMojo, //
 } from './conversions.js';
import { linkPipeClosure } from './host_utils.js';
/**
 * Handles all requests to the host.
 *
 * Each function is a message handler, automatically called when the host
 * receives a message with the corresponding request name.
 *
 * Any new state or function that's not a handler should be added to
 * `GlicApiHost`.
 */
export class HostMessageHandler {
    handler;
    host;
    // Reminder: Don't add more state here! See `HostMessageHandler`'s comment.
    constructor(handler, host) {
        this.handler = handler;
        this.host = host;
    }
    destroy() { }
    webClientInitialized(request) {
        // The webview may have been re-shown by webui, having previously been
        // opened by the browser. In that case, show the guest frame again.
        if (request.exception) {
            console.warn(exceptionFromTransferable(request.exception));
        }
        if (request.success) {
            this.host.webClientInitialized();
        }
        else {
            this.host.webClientInitializeFailed();
        }
    }
    reportClientTransientError(request) {
        this.handler.reportClientTransientError(request.abslStatus);
    }
    processCounterAbuseVerdict(request) {
        const mojoVerdict = counterAbuseVerdictFromClient(request.verdict);
        this.handler.processCounterAbuseVerdict(idFromClient(request.tabId), mojoVerdict);
    }
    getModelQualityClientId() {
        return this.handler.getModelQualityClientId();
    }
    async switchConversation(request) {
        const { errorReason } = await this.handler.switchConversation(conversationInfoFromClient(request.info ?? {
            conversationId: '',
            conversationTitle: '',
            clientData: undefined,
        }));
        if (errorReason !== null) {
            throw new ErrorWithReasonImpl('switchConversation', errorReason.valueOf());
        }
        return {};
    }
    async registerConversation(request) {
        const { errorReason } = await this.handler.registerConversation(conversationInfoFromClient(request.info));
        if (errorReason !== null) {
            throw new ErrorWithReasonImpl('registerConversation', errorReason.valueOf());
        }
        return {};
    }
    async getContextFromFocusedTab(request, extras) {
        const { result: { errorReason, tabContext } } = await this.handler.getContextFromFocusedTab(tabContextOptionsFromClient(request.options));
        if (!tabContext) {
            throw new Error(`tabContext failed: ${errorReason}`);
        }
        const tabContextResult = tabContextToClient(tabContext, extras);
        return {
            tabContextResult: tabContextResult,
        };
    }
    async getContextFromTab(request, extras) {
        const { result: { errorReason, tabContext } } = await this.handler.getContextFromTab(idFromClient(request.tabId), tabContextOptionsFromClient(request.options));
        if (!tabContext) {
            throw new Error(`tabContext failed: ${errorReason}`);
        }
        const tabContextResult = tabContextToClient(tabContext, extras);
        return {
            tabContextResult: tabContextResult,
        };
    }
    async getImageBytesFromTab(request, extras) {
        const { result: { errorReason, imageBytes } } = await this.handler.getImageBytesFromTab(idFromClient(request.tabId), request.documentId, request.domNodeId);
        if (!imageBytes) {
            throw new Error(`getImageBytes failed: ${errorReason}`);
        }
        return {
            result: imageBytesResultToClient(imageBytes, extras),
        };
    }
    async setMaximumNumberOfPinnedTabs(request) {
        const requestedMax = request.requestedMax >= 0 ? request.requestedMax : 0;
        const { effectiveMax } = await this.handler.setMaximumNumberOfPinnedTabs(requestedMax);
        return { effectiveMax };
    }
    activateTab(request) {
        this.handler.activateTab(idFromClient(request.tabId));
    }
    async resizeWindow(request) {
        return await this.handler.resizeWidget(request.size, timeDeltaFromClient(request.options?.durationMs));
    }
    enableDragResize(request) {
        return this.handler.enableDragResize(request.enabled);
    }
    deleteCapturedRegion(request) {
        this.handler.deleteCapturedRegion(idFromClient(request.tabId), request.regionId);
    }
    setMinimumWidgetSize(request) {
        return this.handler.setMinimumPanelSize(request.size);
    }
    setMicrophonePermissionState(request) {
        return this.handler.setMicrophonePermissionState(request.enabled);
    }
    setLocationPermissionState(request) {
        return this.handler.setLocationPermissionState(request.enabled);
    }
    setTabContextPermissionState(request) {
        return this.handler.setTabContextPermissionState(request.enabled);
    }
    setClosedCaptioningSetting(request) {
        return this.handler.setClosedCaptioningSetting(request.enabled);
    }
    setActuationOnWebSetting(request) {
        return this.handler.setActuationOnWebSetting(request.enabled);
    }
    async getUserProfileInfo(_request, extras) {
        const { profileInfo: mojoProfileInfo } = await this.handler.getUserProfileInfo();
        if (!mojoProfileInfo) {
            return {};
        }
        let avatarIcon;
        bitmapN32ToRGBAImage;
        if (mojoProfileInfo.avatarIcon) {
            avatarIcon = bitmapN32ToRGBAImage(mojoProfileInfo.avatarIcon);
            if (avatarIcon) {
                extras.addTransfer(avatarIcon.dataRGBA);
            }
        }
        return { profileInfo: replaceProperties(mojoProfileInfo, { avatarIcon }) };
    }
    refreshSignInCookies() {
        return this.handler.syncCookies();
    }
    setAudioDucking(request) {
        this.handler.setAudioDucking(request.enabled);
    }
    onOptinImpression() {
        this.handler.onOptinImpression();
    }
    onUserInputSubmitted(request) {
        this.handler.onUserInputSubmitted(webClientModeToMojo(request.mode), enumFromClient(request.promptType) ?? PromptTypeMojo.kUnspecified);
    }
    onContextUploadStarted() {
        this.handler.onContextUploadStarted();
    }
    onContextUploadCompleted() {
        this.handler.onContextUploadCompleted();
    }
    onReaction(request) {
        this.handler.onReaction(request.reactionType);
    }
    onActionSubmitted(request) {
        this.handler.onActionSubmitted(request.isRetry ?? false);
    }
    onResponseStarted() {
        this.handler.onResponseStarted();
    }
    onResponseStopped(request) {
        const cause = request.details?.cause;
        let causeMojo = ResponseStopCauseMojo.kUnknown;
        if (cause !== undefined) {
            switch (cause) {
                case ResponseStopCause.USER:
                    causeMojo = ResponseStopCauseMojo.kUser;
                    break;
                case ResponseStopCause.OTHER:
                    causeMojo = ResponseStopCauseMojo.kOther;
                    break;
                default:
                    assertNotReached();
            }
        }
        this.handler.onResponseStopped({ cause: causeMojo });
    }
    onSessionTerminated() {
        this.handler.onSessionTerminated();
    }
    onTurnCompleted(request) {
        this.handler.onTurnCompleted(request.model, timeDeltaFromClient(request.duration));
    }
    recordHistogram(request) {
        this.handler.recordSparseValue(request.name, request.sparseValue);
    }
    onResponseRated(request) {
        this.handler.onResponseRated(request.positive);
    }
    onClosedCaptionsShown() {
        this.handler.onClosedCaptionsShown();
    }
    setSyntheticExperimentState(request) {
        return this.handler.setSyntheticExperimentState(request.trialName, request.groupName);
    }
    getOsMicrophonePermissionStatus() {
        return this.handler.getOsMicrophonePermissionStatus();
    }
    pinTabs(request) {
        return this.handler.pinTabs(request.tabIds.map((x) => idFromClient(x)), pinTabsOptionsToMojo(request.options));
    }
    unpinTabs(request) {
        return this.handler.unpinTabs(request.tabIds.map((x) => idFromClient(x)), unpinTabsOptionsToMojo(request.options));
    }
    unpinAllTabs(request) {
        this.handler.unpinAllTabs(unpinTabsOptionsToMojo(request.options));
    }
    async openPinnedTabPicker(request) {
        await this.handler.openPinnedTabPicker(openPinnedTabPickerOptionsToMojo(request.options));
    }
    async getZeroStateSuggestionsForFocusedTab(request) {
        const zeroStateResult = await this.handler.getZeroStateSuggestionsForFocusedTab(optionalFromClient(request.isFirstRun));
        const zeroStateData = zeroStateResult.suggestions;
        if (!zeroStateData) {
            return {};
        }
        else {
            return {
                suggestions: {
                    tabId: idToClient(zeroStateData.tabId),
                    url: urlToClient(zeroStateData.url),
                    suggestions: zeroStateData.suggestions,
                },
            };
        }
    }
    maybeRefreshUserStatus() {
        this.handler.maybeRefreshUserStatus();
    }
    subscribeToPageMetadata(request) {
        return this.handler.subscribeToPageMetadata(idFromClient(request.tabId), request.names);
    }
    onModeChange(request) {
        this.handler.onModeChange(webClientModeToMojo(request.newMode));
    }
    onMicrophoneStatusChange(request) {
        this.handler.onMicrophoneStatusChange(microphoneStatusToMojo(request.status));
    }
    setOnboardingCompleted() {
        this.handler.setOnboardingCompleted();
    }
    subscribeToTabData(request) {
        new TabDataHandlerImpl(idFromClient(request.tabId), this.handler, request.remote, this.host.router);
    }
    setErrorDialogState(request) {
        if (request.shownDialogType !== undefined) {
            this.handler.clientErrorDialogStateChanged(enumFromClient(request.shownDialogType));
        }
        // TODO(b/506142920): Avoid showing error panels to the user if it is
        // presented while the panel is backgrounded. Automatically reload the
        // page instead.
    }
}
class TabDataHandlerImpl {
    mojoReceiver;
    pmRemote;
    constructor(tabId, handler, pendingRemote, router) {
        this.pmRemote = router.newRemote(pendingRemote);
        this.mojoReceiver = new TabDataHandlerReceiver(this);
        linkPipeClosure(this.pmRemote, this.mojoReceiver);
        handler.subscribeToTabData(tabId, this.mojoReceiver.$.bindNewPipeAndPassRemote());
    }
    onTabDataChanged(tabData) {
        const extras = new ResponseExtras();
        this.pmRemote.requestNoResponse('tabDataChanged', {
            tabData: tabDataToPrivate(tabData, extras),
        }, extras.transfers);
    }
}
