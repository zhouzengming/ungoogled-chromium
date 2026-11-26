// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ContentSettingsType } from '../../content_settings_types.mojom-webui.js';
import { enumFromClient, enumToClient } from '../../enum_conversions.js';
import { //
CaptureRegionObserverReceiver, //
PinCandidatesObserverReceiver, //
SettingsPageField as SettingsPageFieldMojo, //
TabFaviconHandlerReceiver, //
WebClientReceiver, //
 } from '../../glic.mojom-webui.js';
import { CaptureRegionErrorReason, ClientCapabilities, HostCapability } from '../../glic_api/glic_api.js';
import { ObservableValue as ObservableValueImpl, Subject } from '../../observable.js';
import { OneShotTimer } from '../../timer.js';
import { GlicBrowserHostActor } from '../actor/actor_client.js';
import { GlicBrowserHostAnnotation } from '../annotation/annotation_client.js';
import { GlicBrowserHostExperimentalTriggering } from '../experimental_triggering/experimental_triggering_client.js';
import { GlicBrowserHostGeic } from '../geic/geic_client.js';
import { //
additionalContextToClient, //
bitmapN32ToRGBAImage, //
captureRegionResultToClient, //
conversionSettings, //
createTabOptionsFromClient, //
fileUploadPolicyStateToClient, //
focusedTabDataToClient, //
getPinCandidatesOptionsFromClient, //
idFromClient, //
idToClient, //
invokeOptionsToClient, //
pageMetadataToClient, //
panelOpeningDataToClient, //
panelStateToClient, //
pinCandidateToClient, //
tabContextOptionsFromClient, //
tabDataToClient, //
timeDeltaFromClient, //
urlFromClient, //
webClientModeToMojo, //
 } from '../host/conversions.js';
import { PanelOpenState } from '../host/types.js';
import { GlicBrowserHostSkills } from '../skills/skills_client.js';
import { GlicBrowserHostTools } from '../tools/tools_client.js';
import { assertNever, ResponseExtras } from '../transport/messaging.js';
import { GlicBrowserHostZeroStateSuggestions } from '../zero_state_suggestions/zero_state_suggestions_client.js';
import { replaceProperties } from './../conversions.js';
import { ErrorWithReasonImpl, newTransferableException, WebClientTabDataObserverDef } from './../request_types.js';
import { createDelegationProxy } from './glic_client_common.js';
import { rgbaImageToBlob } from './image_utils.js';
import { ObservableSetByTabId } from './observable_set_by_tab_id.js';
// Web client side of the Glic API.
// Communicates with the Chrome-WebUI-side in glic_api_host.ts
export class GlicHostRegistryImpl {
    directPair;
    hostApi;
    host;
    constructor(directPair, hostApi) {
        this.directPair = directPair;
        this.hostApi = hostApi;
    }
    async registerWebClient(webClient) {
        this.host =
            new GlicBrowserHostImpl(webClient, this.directPair, this.hostApi);
        const clientCapabilities = webClient.getClientCapabilities?.() ?? new Set();
        await this.host.webClientCreated(clientCapabilities);
        let success = false;
        let exception;
        try {
            await webClient.initialize(this.host);
            success = true;
        }
        catch (e) {
            console.warn(e);
            if (e instanceof Error) {
                exception = newTransferableException(e);
            }
        }
        if (this.host) {
            this.host.webClientInitialized(success, exception);
        }
    }
}
export class GlicBrowserHostImpl {
    webClient;
    hostApi;
    router;
    clientRemote;
    actorClient;
    annotationClient;
    skillsClient;
    toolsClient;
    experimentalTriggeringClient = new GlicBrowserHostExperimentalTriggering();
    suggestionsClient;
    geicClient;
    chromeVersion;
    platform;
    formFactor;
    panelState = ObservableValueImpl.withNoValue();
    canAttachPanelValue = ObservableValueImpl.withNoValue();
    focusedTabStateV2 = ObservableValueImpl.withNoValue();
    geminiEnterpriseSettings = ObservableValueImpl.withNoValue();
    zoomLevel = ObservableValueImpl.withNoValue();
    permissionStateMicrophone = ObservableValueImpl.withNoValue();
    permissionStateLocation = ObservableValueImpl.withNoValue();
    permissionStateTabContext = ObservableValueImpl.withNoValue();
    defaultTabContextPermission = ObservableValueImpl.withNoValue();
    enableDefaultTabContextSettingFeature = false;
    permissionStateOsLocation = ObservableValueImpl.withNoValue();
    closedCaptioningState = ObservableValueImpl.withNoValue();
    actuationOnWebState = ObservableValueImpl.withNoValue();
    fileUploadAllowedState = ObservableValueImpl.withNoValue();
    osHotkeyState = ObservableValueImpl.withNoValue();
    onboardingCompleted = ObservableValueImpl.withNoValue();
    panelActiveValue = ObservableValueImpl.withNoValue();
    isBrowserOpenValue = ObservableValueImpl.withNoValue();
    metrics;
    manuallyResizing = ObservableValueImpl.withValue(false);
    cachedUserProfile;
    enableCachedGetUserProfileInfo;
    pinnedTabs = ObservableValueImpl.withNoValue();
    pinCandidates;
    captureRegionObservable;
    cachedPinnedTabs = undefined;
    webClientReceiver;
    hostCapabilities = new Set();
    additionalContextSubject = new Subject();
    pageMetadataObservers = new Map();
    getTabByIdObservableSet;
    getTabFaviconByIdObservableSet;
    notifyPanelWillOpenCompleted = Promise.withResolvers();
    panelOpenState = PanelOpenState.CLOSED;
    handler;
    constructor(webClient, directPair, hostApi) {
        this.webClient = webClient;
        this.hostApi = hostApi;
        this.handler = hostApi.handler;
        this.router = directPair.client.router;
        this.clientRemote = directPair.client.rootRemote;
        this.actorClient = new GlicBrowserHostActor();
        this.annotationClient = new GlicBrowserHostAnnotation();
        this.skillsClient = new GlicBrowserHostSkills();
        this.suggestionsClient = new GlicBrowserHostZeroStateSuggestions();
        this.toolsClient = new GlicBrowserHostTools();
        this.geicClient = new GlicBrowserHostGeic();
        this.getTabByIdObservableSet =
            new ObservableSetByTabId(new GetTabByIdObservableSetImpl(), this.clientRemote, this.router);
        this.getTabFaviconByIdObservableSet =
            new TabFaviconObservableSet(this.handler);
        this.metrics = new GlicBrowserHostMetricsImpl(this.clientRemote);
        const proxy = createDelegationProxy(this, [
            this.actorClient,
            this.annotationClient,
            this.skillsClient,
            this.suggestionsClient,
            this.toolsClient,
        ]);
        assertNever();
        return proxy;
    }
    isPanelOpen() {
        return this.panelOpenState === PanelOpenState.OPEN;
    }
    panelOpenStateChanged(state) {
        this.panelOpenState = state;
        if (state === PanelOpenState.CLOSED) {
            this.pinCandidates?.disconnectFromSource();
        }
        else {
            if (this.pinCandidates?.hasActiveSubscription()) {
                this.pinCandidates.connectToSource();
            }
        }
    }
    getHandler() {
        return this.handler;
    }
    destroy() {
        this.pinCandidates?.setObsolete();
        this.actorClient.destroyActor();
        this.skillsClient.destroySkills();
        this.toolsClient.destroyTools();
        this.annotationClient.destroyAnnotation();
        this.geicClient.destroy();
        this.suggestionsClient.destroySuggestions();
        this.experimentalTriggeringClient.destroy();
        if (this.webClientReceiver) {
            this.webClientReceiver.$.close();
            this.webClientReceiver = undefined;
        }
        this.router.destroy();
    }
    async webClientCreated(clientCapabilities) {
        conversionSettings.omitFaviconInTabData =
            clientCapabilities.has(ClientCapabilities.IGNORES_TAB_DATA_FAVICONS);
        this.webClientReceiver = new WebClientReceiver(this);
        const { initialState } = await this.handler.webClientCreated(this.webClientReceiver.$.bindNewPipeAndPassRemote());
        this.hostApi.setInitialState(initialState, clientCapabilities);
        this.actorClient.initialize(initialState, this.handler);
        this.annotationClient.initialize(initialState, this.handler);
        this.skillsClient.initialize(initialState, this.handler);
        this.experimentalTriggeringClient.initialize(this.webClient, this.handler);
        this.suggestionsClient.initialize(initialState, this.handler);
        this.toolsClient.initialize(initialState, this.handler);
        this.geicClient.initialize(initialState, this.handler);
        const state = initialState;
        this.geminiEnterpriseSettings.assignAndSignal(state.geminiEnterpriseSettings ?? undefined);
        this.zoomLevel.assignAndSignal(state.zoomFactor);
        this.panelState.assignAndSignal(panelStateToClient(state.panelState));
        const extras = new ResponseExtras();
        const focusedTabDataPrivate = focusedTabDataToClient(state.focusedTabData, extras);
        this.focusedTabStateV2.assignAndSignal(convertFocusedTabDataFromPrivate(focusedTabDataPrivate));
        this.permissionStateMicrophone.assignAndSignal(state.microphonePermissionEnabled);
        this.permissionStateLocation.assignAndSignal(state.locationPermissionEnabled);
        if (state.enableDefaultTabContextSettingFeature) {
            this.permissionStateTabContext.assignAndSignal(state.defaultTabContextSettingEnabled);
        }
        else {
            this.permissionStateTabContext.assignAndSignal(state.tabContextPermissionEnabled);
        }
        this.defaultTabContextPermission.assignAndSignal(state.defaultTabContextSettingEnabled);
        this.enableDefaultTabContextSettingFeature =
            state.enableDefaultTabContextSettingFeature;
        this.permissionStateOsLocation.assignAndSignal(state.osLocationPermissionEnabled);
        this.canAttachPanelValue.assignAndSignal(state.canAttach);
        const chromeVersion = state.chromeVersion.components;
        this.chromeVersion = {
            major: chromeVersion[0] || 0,
            minor: chromeVersion[1] || 0,
            build: chromeVersion[2] || 0,
            patch: chromeVersion[3] || 0,
        };
        this.platform = enumToClient(state.platform);
        this.formFactor = enumToClient(state.formFactor);
        this.enableCachedGetUserProfileInfo = state.enableCachedGetUserProfileInfo;
        this.panelActiveValue.assignAndSignal(state.panelIsActive);
        this.isBrowserOpenValue.assignAndSignal(state.browserIsOpen);
        this.osHotkeyState.assignAndSignal({ hotkey: state.hotkey });
        this.closedCaptioningState.assignAndSignal(state.closedCaptioningSettingEnabled);
        this.actuationOnWebState.assignAndSignal(state.actuationOnWebSettingEnabled);
        this.fileUploadAllowedState.assignAndSignal(fileUploadPolicyStateToClient(state.fileUploadPolicyState));
        for (const capability of state.hostCapabilities) {
            this.hostCapabilities.add(enumToClient(capability));
        }
        this.actorClient.actOnWebCapabilityValue.assignAndSignal(state.canActOnWeb);
        this.onboardingCompleted.assignAndSignal(state.onboardingCompleted);
        // Set the method to undefined since it's gated behind a mojo
        // RuntimeFeature. Calling a such a method when the feature is disabled
        // results in a mojo pipe closure.
        if (!this.hostCapabilities.has(HostCapability.GET_MODEL_QUALITY_CLIENT_ID)) {
            // MOJO_RUNTIME_FEATURE_GATED GetModelQualityClientId
            this.getModelQualityClientId = undefined;
        }
        if (!state.enableZeroStateSuggestions) {
            this.getZeroStateSuggestionsForFocusedTab = undefined;
        }
        if (!state.enableDefaultTabContextSettingFeature) {
            this.getDefaultTabContextPermissionState = undefined;
        }
        if (!state.enableMaybeRefreshUserStatus) {
            this.maybeRefreshUserStatus = undefined;
        }
        if (!state.enableGetPageMetadata) {
            this.getPageMetadata = undefined;
        }
        if (!state.enableWebActuationSettingFeature) {
            this.getActuationOnWebSetting = undefined;
            this.setActuationOnWebSetting = undefined;
        }
        if (!state.enableCaptureRegion) {
            this.captureRegion = undefined;
            this.deleteCapturedRegion = undefined;
        }
        if (!state.enableActivateTab) {
            // MOJO_RUNTIME_FEATURE_GATED ActivateTab
            this.activateTab = undefined;
        }
        if (!state.enableGetTabById) {
            this.getTabById = undefined;
        }
        if (!state.enableOpenPasswordManagerSettingsPage) {
            this.openPasswordManagerSettingsPage = undefined;
        }
        if (!state.enableOpenContactInfoSettingsPage) {
            this.openContactInfoSettingsPage = undefined;
        }
        if (!state.enableGetTabFaviconById) {
            this.getTabFaviconById = undefined;
        }
        if (!state.enableProcessCounterAbuseVerdict) {
            this.processCounterAbuseVerdict = undefined;
        }
    }
    webClientInitialized(success, exception) {
        if (success) {
            this.handler.webClientInitialized();
        }
        else {
            this.handler.webClientInitializeFailed();
        }
        this.clientRemote.requestNoResponse('webClientInitialized', { success, exception });
    }
    // WebClientInterface implementation.
    async checkResponsive() {
        await this.webClient.checkResponsive?.();
    }
    async notifyPanelWillOpen(panelOpeningData) {
        let openPanelInfo;
        const clientOpeningData = panelOpeningDataToClient(panelOpeningData);
        try {
            const mergedArgument = Object.assign({}, clientOpeningData, clientOpeningData.panelState);
            const completedPromise = this.notifyPanelWillOpenCompleted;
            const result = await this.webClient.notifyPanelWillOpen?.(mergedArgument);
            completedPromise.resolve();
            if (result) {
                openPanelInfo = result;
            }
        }
        catch (e) {
            console.warn(e);
        }
        finally {
            this.panelOpenStateChanged(PanelOpenState.OPEN);
        }
        const openPanelInfoMojo = {
            webClientMode: webClientModeToMojo(openPanelInfo?.startingMode),
            panelSize: null,
            resizeDuration: timeDeltaFromClient(openPanelInfo?.resizeParams?.options?.durationMs),
            canUserResize: openPanelInfo?.canUserResize ?? true,
        };
        if (openPanelInfo?.resizeParams) {
            const size = {
                width: openPanelInfo?.resizeParams?.width,
                height: openPanelInfo?.resizeParams?.height,
            };
            openPanelInfoMojo.panelSize = size;
        }
        return { openPanelInfo: openPanelInfoMojo };
    }
    async notifyPanelWasClosed() {
        this.panelOpenStateChanged(PanelOpenState.CLOSED);
        try {
            this.notifyPanelWillOpenCompleted = Promise.withResolvers();
            await this.webClient.notifyPanelWasClosed?.();
        }
        catch (e) {
            console.warn(e);
        }
    }
    async invoke(options) {
        try {
            const extras = new ResponseExtras();
            const clientOptions = convertInvokeOptionsFromPrivate(invokeOptionsToClient(options, extras));
            // Wait until notifyPanelWillOpen has resolved before invoking.
            await this.notifyPanelWillOpenCompleted.promise;
            await this.webClient.invoke?.(clientOptions);
        }
        catch (e) {
            console.warn(e);
        }
    }
    notifyPanelStateChange(panelState) {
        this.panelState.assignAndSignal(panelStateToClient(panelState));
    }
    notifyPanelActiveChange(panelActive) {
        this.panelActiveValue.assignAndSignal(panelActive);
    }
    notifyPanelCanAttachChange(canAttach) {
        this.canAttachPanelValue.assignAndSignal(canAttach);
    }
    notifyGeminiEnterpriseSettingsChanged(settings) {
        this.geminiEnterpriseSettings.assignAndSignal(settings || undefined);
    }
    notifyMicrophonePermissionStateChanged(enabled) {
        this.permissionStateMicrophone.assignAndSignal(enabled);
    }
    async stopMicrophone() {
        await this.webClient.stopMicrophone?.();
    }
    notifyLocationPermissionStateChanged(enabled) {
        this.permissionStateLocation.assignAndSignal(enabled);
    }
    notifyTabContextPermissionStateChanged(enabled) {
        this.permissionStateTabContext.assignAndSignal(enabled);
    }
    notifyOsLocationPermissionStateChanged(enabled) {
        this.permissionStateOsLocation.assignAndSignal(enabled);
    }
    notifyClosedCaptioningSettingChanged(enabled) {
        this.closedCaptioningState.assignAndSignal(enabled);
    }
    notifyDefaultTabContextPermissionStateChanged(enabled) {
        this.defaultTabContextPermission.assignAndSignal(enabled);
    }
    notifyActuationOnWebSettingChanged(enabled) {
        this.actuationOnWebState.assignAndSignal(enabled);
    }
    notifyFileUploadStateChanged(state) {
        this.fileUploadAllowedState.assignAndSignal(fileUploadPolicyStateToClient(state));
    }
    notifyZoomLevelChanged(zoomFactor) {
        this.zoomLevel.assignAndSignal(zoomFactor);
    }
    notifyFocusedTabChanged(focusedTabData) {
        const extras = new ResponseExtras();
        const focusedTabDataPrivate = focusedTabDataToClient(focusedTabData, extras);
        this.focusedTabStateV2.assignAndSignal(convertFocusedTabDataFromPrivate(focusedTabDataPrivate));
    }
    notifyManualResizeChanged(resizing) {
        this.manuallyResizing.assignAndSignal(resizing);
    }
    notifyBrowserIsOpenChanged(browserIsOpen) {
        this.isBrowserOpenValue.assignAndSignal(browserIsOpen);
    }
    notifyInstanceActivationChanged(instanceIsActive) {
        this.hostApi.setInstanceIsActive(instanceIsActive);
    }
    notifyOsHotkeyStateChanged(hotkey) {
        this.osHotkeyState.assignAndSignal({ hotkey });
    }
    notifyPinnedTabsChanged(tabData) {
        this.cachedPinnedTabs = tabData.map((x) => tabDataToClient(x));
        this.pinnedTabs.assignAndSignal(this.cachedPinnedTabs);
    }
    notifyPinnedTabDataChanged(tabData) {
        if (!this.cachedPinnedTabs) {
            return;
        }
        const convertedTab = tabDataToClient(tabData);
        this.cachedPinnedTabs = this.cachedPinnedTabs.map((cachedTab) => {
            if (cachedTab.tabId === convertedTab.tabId) {
                return convertedTab;
            }
            return cachedTab;
        });
        this.pinnedTabs.assignAndSignal(this.cachedPinnedTabs);
    }
    notifyPageMetadataChanged(tabId, metadata) {
        const tabIdStr = idToClient(tabId);
        const observable = this.pageMetadataObservers.get(tabIdStr);
        if (!observable) {
            return;
        }
        const clientMetadata = pageMetadataToClient(metadata);
        if (clientMetadata) {
            observable.assignAndSignal(clientMetadata);
        }
        else {
            if (!observable.isStopped()) {
                observable.complete();
            }
            this.pageMetadataObservers.delete(tabIdStr);
        }
    }
    notifyAdditionalContext(context) {
        const extras = new ResponseExtras();
        const clientContext = convertAdditionalContextFromPrivate(additionalContextToClient(context, extras));
        this.additionalContextSubject.next(clientContext);
    }
    notifyActOnWebCapabilityChanged(canActOnWeb) {
        this.actorClient.actOnWebCapabilityValue.assignAndSignal(canActOnWeb);
    }
    notifyOnboardingCompletedChanged(completed) {
        this.onboardingCompleted.assignAndSignal(completed);
    }
    notifyActorTaskListRowClicked(taskId) {
        this.actorClient.actorTaskListRowClickedSubject.next(taskId);
    }
    // GlicBrowserHost implementation.
    getChromeVersion() {
        return Promise.resolve(this.chromeVersion);
    }
    experimentalTriggering() {
        return this.experimentalTriggeringClient;
    }
    getPlatform() {
        return this.platform;
    }
    getFormFactor() {
        return this.formFactor;
    }
    async createTab(url, options = {}) {
        const response = await this.handler.createTab(urlFromClient(url), createTabOptionsFromClient(options));
        if (!response.tabData) {
            throw new Error('createTab: failed');
        }
        return tabDataToClient(response.tabData);
    }
    async activateTabWithUrl(exactUrl, options = {}) {
        const response = await this.handler.activateTabWithUrl(urlFromClient(exactUrl), {
            pattern: options.pattern ?? '',
            fallbackWindowId: idFromClient(options.fallbackWindowId),
        });
        if (!response.tabData) {
            throw new Error('activateTabWithUrl: failed');
        }
        return tabDataToClient(response.tabData);
    }
    openGlicSettingsPage(options) {
        this.handler.openGlicSettingsPage({
            highlightField: enumFromClient(options?.highlightField) ??
                SettingsPageFieldMojo.kNone,
        });
    }
    openPasswordManagerSettingsPage() {
        this.handler.openPasswordManagerSettingsPage();
    }
    openContactInfoSettingsPage() {
        this.handler.openContactInfoSettingsPage();
    }
    reportClientTransientError(abslStatus) {
        this.clientRemote.requestNoResponse('reportClientTransientError', { abslStatus });
    }
    processCounterAbuseVerdict(tabId, verdict) {
        this.clientRemote.requestNoResponse('processCounterAbuseVerdict', { tabId, verdict });
    }
    async closePanel() {
        this.handler.closePanel();
    }
    closePanelAndShutdown() {
        this.handler.closePanelAndShutdown();
    }
    attachPanel() {
        this.handler.attachPanel();
    }
    detachPanel() {
        if (this.hostCapabilities.has(HostCapability.NO_LIVE_MODE)) {
            throw new Error('NO_LIVE_MODE: detachPanel not supported');
        }
        this.handler.detachPanel();
    }
    showProfilePicker() {
        this.handler.showProfilePicker();
    }
    async getModelQualityClientId() {
        const result = await this.clientRemote.requestWithResponse('getModelQualityClientId', undefined);
        return result.modelQualityClientId;
    }
    getGeminiEnterpriseSettings() {
        return this.geminiEnterpriseSettings;
    }
    async switchConversation(info) {
        await this.clientRemote.requestWithResponse('switchConversation', { info });
    }
    async registerConversation(info) {
        await this.clientRemote.requestWithResponse('registerConversation', { info });
    }
    async getContextFromFocusedTab(options) {
        const context = await this.clientRemote.requestWithResponse('getContextFromFocusedTab', { options });
        return convertTabContextResultFromPrivate(context.tabContextResult);
    }
    async setMaximumNumberOfPinnedTabs(requestedMax) {
        const result = await this.clientRemote.requestWithResponse('setMaximumNumberOfPinnedTabs', { requestedMax });
        return result.effectiveMax;
    }
    async getContextFromTab(tabId, options) {
        const result = await this.clientRemote.requestWithResponse('getContextFromTab', { tabId, options });
        return convertTabContextResultFromPrivate(result.tabContextResult);
    }
    async getImageBytesFromTab(tabId, documentId, domNodeId) {
        const response = await this.clientRemote.requestWithResponse('getImageBytesFromTab', { tabId, documentId, domNodeId });
        if (!response.result) {
            throw new Error('Failed to get image bytes');
        }
        return convertImageBytesResultFromPrivate(response.result);
    }
    getTabById(tabId) {
        return this.getTabByIdObservableSet.getObservableByTabId(tabId);
    }
    getTabFaviconById(tabId) {
        return this.getTabFaviconByIdObservableSet.getObservableByTabId(tabId);
    }
    activateTab(tabId) {
        this.clientRemote.requestNoResponse('activateTab', { tabId });
    }
    onModeChange(newMode) {
        this.clientRemote.requestNoResponse('onModeChange', { newMode });
    }
    onMicrophoneStatusChange(status) {
        this.clientRemote.requestNoResponse('onMicrophoneStatusChange', { status });
    }
    setErrorDialogState(shownDialogType) {
        this.clientRemote.requestNoResponse('setErrorDialogState', { shownDialogType });
    }
    async resizeWindow(width, height, options) {
        return this.clientRemote.requestWithResponse('resizeWindow', { size: { width, height }, options });
    }
    enableDragResize(enabled) {
        return this.clientRemote.requestWithResponse('enableDragResize', { enabled });
    }
    captureRegion(params) {
        if (this.captureRegionObservable) {
            this.captureRegionObservable.complete();
        }
        this.captureRegionObservable =
            new CaptureRegionObservable(this.handler, params);
        return this.captureRegionObservable;
    }
    deleteCapturedRegion(tabId, regionId) {
        this.clientRemote.requestNoResponse('deleteCapturedRegion', { tabId, regionId });
    }
    setMinimumWidgetSize(width, height) {
        return this.clientRemote.requestWithResponse('setMinimumWidgetSize', { size: { width, height } });
    }
    getPanelState() {
        return this.panelState;
    }
    panelActive() {
        return this.panelActiveValue;
    }
    canAttachPanel() {
        return this.canAttachPanelValue;
    }
    isBrowserOpen() {
        return this.isBrowserOpenValue;
    }
    getFocusedTabStateV2() {
        return this.focusedTabStateV2;
    }
    getZoomLevel() {
        return this.zoomLevel;
    }
    getMicrophonePermissionState() {
        return this.permissionStateMicrophone;
    }
    getLocationPermissionState() {
        return this.permissionStateLocation;
    }
    getTabContextPermissionState() {
        return this.permissionStateTabContext;
    }
    getDefaultTabContextPermissionState() {
        return this.defaultTabContextPermission;
    }
    getOsLocationPermissionState() {
        return this.permissionStateOsLocation;
    }
    getClosedCaptioningSetting() {
        return this.closedCaptioningState;
    }
    getActuationOnWebSetting() {
        return this.actuationOnWebState;
    }
    getFileUploadAllowedCapability() {
        return this.fileUploadAllowedState;
    }
    setMicrophonePermissionState(enabled) {
        return this.clientRemote.requestWithResponse('setMicrophonePermissionState', { enabled });
    }
    setLocationPermissionState(enabled) {
        return this.clientRemote.requestWithResponse('setLocationPermissionState', { enabled });
    }
    setTabContextPermissionState(enabled) {
        if (this.enableDefaultTabContextSettingFeature) {
            this.permissionStateTabContext.assignAndSignal(enabled);
            return Promise.resolve();
        }
        return this.clientRemote.requestWithResponse('setTabContextPermissionState', { enabled });
    }
    setClosedCaptioningSetting(enabled) {
        return this.clientRemote.requestWithResponse('setClosedCaptioningSetting', { enabled });
    }
    setContextAccessIndicator(show) {
        this.handler.setContextAccessIndicator(show);
    }
    setActuationOnWebSetting(enabled) {
        return this.clientRemote.requestWithResponse('setActuationOnWebSetting', { enabled });
    }
    async getUserProfileInfo() {
        return this.enableCachedGetUserProfileInfo ? this.fetchUserProfileCached() :
            this.fetchUserProfileDirect();
    }
    async fetchUserProfileDirect() {
        const { profileInfo } = await this.clientRemote.requestWithResponse('getUserProfileInfo', undefined);
        if (!profileInfo) {
            throw new Error('getUserProfileInfo failed');
        }
        const { avatarIcon } = profileInfo;
        return replaceProperties(profileInfo, {
            avatarIcon: async () => avatarIcon && Promise.resolve(rgbaImageToBlob(avatarIcon)),
        });
    }
    async fetchUserProfileCached() {
        if (this.cachedUserProfile) {
            return this.cachedUserProfile;
        }
        this.cachedUserProfile = (async () => {
            try {
                const { profileInfo } = await this.clientRemote.requestWithResponse('getUserProfileInfo', undefined);
                if (!profileInfo) {
                    throw new Error('getUserProfileInfo failed');
                }
                let blobPromise;
                return replaceProperties(profileInfo, {
                    avatarIcon: () => {
                        if (blobPromise) {
                            return blobPromise;
                        }
                        if (!profileInfo.avatarIcon) {
                            blobPromise = Promise.resolve(undefined);
                            return blobPromise;
                        }
                        const newBlob = rgbaImageToBlob(profileInfo.avatarIcon);
                        // Clear memory after conversion
                        profileInfo.avatarIcon = undefined;
                        blobPromise = Promise.resolve(newBlob);
                        return blobPromise;
                    },
                });
            }
            catch (e) {
                this.cachedUserProfile = undefined;
                throw e;
            }
        })();
        return this.cachedUserProfile;
    }
    async refreshSignInCookies() {
        const result = await this.clientRemote.requestWithResponse('refreshSignInCookies', undefined);
        if (!result.success) {
            throw Error('refreshSignInCookies failed');
        }
    }
    setAudioDucking(enabled) {
        this.clientRemote.requestNoResponse('setAudioDucking', { enabled });
    }
    getMetrics() {
        return this.metrics;
    }
    getGeicClient() {
        return this.geicClient;
    }
    setSyntheticExperimentState(trialName, groupName) {
        this.clientRemote.requestNoResponse('setSyntheticExperimentState', { trialName, groupName });
    }
    openOsPermissionSettingsMenu(permission) {
        // Warning: calling openOsPermissionSettingsMenu with unsupported content
        // setting type will terminate the render process (bad mojo message).
        // Update GlicWebClientHandler:OpenOsPermissionSettingsMenu with any new
        // types.
        switch (permission) {
            case 'media':
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.MEDIASTREAM_MIC);
                break;
            case 'geolocation':
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.GEOLOCATION);
                break;
            default:
                this.handler.openOsPermissionSettingsMenu(ContentSettingsType.COOKIES);
                break;
        }
    }
    async getOsMicrophonePermissionStatus() {
        return (await this.clientRemote.requestWithResponse('getOsMicrophonePermissionStatus', undefined))
            .enabled;
    }
    isManuallyResizing() {
        return this.manuallyResizing;
    }
    getOsHotkeyState() {
        return this.osHotkeyState;
    }
    getPinnedTabs() {
        return this.pinnedTabs;
    }
    async pinTabs(tabIds, options) {
        return (await this.clientRemote.requestWithResponse('pinTabs', { tabIds, options }))
            .pinnedAll;
    }
    async unpinTabs(tabIds, options) {
        return (await this.clientRemote.requestWithResponse('unpinTabs', { tabIds, options }))
            .unpinnedAll;
    }
    unpinAllTabs(options) {
        this.clientRemote.requestNoResponse('unpinAllTabs', { options });
    }
    async openPinnedTabPicker(options) {
        await this.clientRemote.requestWithResponse('openPinnedTabPicker', { options });
    }
    getPinCandidates(options) {
        this.pinCandidates?.setObsolete();
        return this.pinCandidates = new PinCandidatesObservable(this, options);
    }
    async getZeroStateSuggestionsForFocusedTab(isFirstRun) {
        const zeroStateResult = await this.clientRemote.requestWithResponse('getZeroStateSuggestionsForFocusedTab', { isFirstRun });
        if (!zeroStateResult.suggestions) {
            return {
                suggestions: [],
                tabId: '',
                url: '',
            };
        }
        return zeroStateResult.suggestions;
    }
    maybeRefreshUserStatus() {
        this.cachedUserProfile = undefined;
        this.clientRemote.requestNoResponse('maybeRefreshUserStatus', undefined);
    }
    getAdditionalContext() {
        return this.additionalContextSubject;
    }
    getHostCapabilities() {
        return this.hostCapabilities;
    }
    getPageMetadata(tabId, names) {
        if (this.pageMetadataObservers.has(tabId)) {
            // Currently, we assume that names do not change and keep only
            // one observer per tabId.
            return this.pageMetadataObservers.get(tabId);
        }
        if (names.length === 0) {
            throw Error('names must not be empty');
        }
        const observableValue = ObservableValueImpl.withNoValue(async (isActive) => {
            // If the client subscribes to an Observable with an invalid tabId,
            // it will emit nothing, even if the tab later becomes valid.
            const { success } = await this.clientRemote.requestWithResponse('subscribeToPageMetadata', { tabId, names: isActive ? names : [] });
            if (!success) {
                if (!observableValue.isStopped()) {
                    observableValue.complete();
                }
                this.pageMetadataObservers.delete(tabId);
            }
        });
        this.pageMetadataObservers.set(tabId, observableValue);
        return observableValue;
    }
    setOnboardingCompleted() {
        return this.clientRemote.requestNoResponse('setOnboardingCompleted', undefined);
    }
    isOnboardingCompleted() {
        return this.onboardingCompleted;
    }
}
class GlicBrowserHostMetricsImpl {
    sender;
    constructor(sender) {
        this.sender = sender;
    }
    onOptinImpression() {
        this.sender.requestNoResponse('onOptinImpression', undefined);
    }
    onUserInputSubmitted(mode, promptType) {
        this.sender.requestNoResponse('onUserInputSubmitted', { mode, promptType });
    }
    onReaction(reactionType) {
        this.sender.requestNoResponse('onReaction', { reactionType });
    }
    onPerformActionResultSubmitted(isRetry) {
        this.sender.requestNoResponse('onActionSubmitted', { isRetry });
    }
    onContextUploadStarted() {
        this.sender.requestNoResponse('onContextUploadStarted', undefined);
    }
    onContextUploadCompleted() {
        this.sender.requestNoResponse('onContextUploadCompleted', undefined);
    }
    onResponseStarted() {
        this.sender.requestNoResponse('onResponseStarted', undefined);
    }
    onResponseStopped(details) {
        this.sender.requestNoResponse('onResponseStopped', { details });
    }
    onSessionTerminated() {
        this.sender.requestNoResponse('onSessionTerminated', undefined);
    }
    onResponseRated(positive) {
        this.sender.requestNoResponse('onResponseRated', { positive });
    }
    onClosedCaptionsShown() {
        this.sender.requestNoResponse('onClosedCaptionsShown', undefined);
    }
    onTurnCompleted(model, duration) {
        this.sender.requestNoResponse('onTurnCompleted', { model, duration });
    }
    onRecordUseCounter(counter) {
        // Since the frontend can contain a newer version than what Chrome is
        // built against, we use a sparse histogram.
        this.sender.requestNoResponse('recordHistogram', { name: 'Glic.Api.UseCounter', sparseValue: counter });
    }
}
export class CaptureRegionObservable extends ObservableValueImpl {
    handler;
    params;
    receiver;
    constructor(handler, params) {
        super(false);
        this.handler = handler;
        this.params = params;
    }
    close() {
        this.receiver?.$.close();
        this.receiver = undefined;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (this.isStopped()) {
            return;
        }
        if (hasActiveSubscription) {
            this.close();
            this.receiver = new CaptureRegionObserverReceiver(this);
            this.receiver.onConnectionError.addListener(() => {
                if (!this.isStopped()) {
                    this.processError(CaptureRegionErrorReason.UNKNOWN);
                }
            });
            const remote = this.receiver.$.bindNewPipeAndPassRemote();
            this.handler.captureRegion(remote, this.params ? {
                tabId: idFromClient(this.params.tabId),
                options: tabContextOptionsFromClient(this.params.options),
            } :
                null);
        }
        else {
            this.complete();
        }
    }
    error(e) {
        if (this.isStopped()) {
            return;
        }
        super.error(e);
    }
    complete() {
        if (this.isStopped()) {
            return;
        }
        super.complete();
        this.close();
    }
    onUpdate(result, reason) {
        if (this.isStopped()) {
            return;
        }
        const captureResult = captureRegionResultToClient(result);
        if (captureResult) {
            this.assignAndSignal(captureResult);
        }
        else {
            const errorReason = reason !== null ?
                enumToClient(reason) :
                CaptureRegionErrorReason.UNKNOWN;
            this.processError(errorReason);
        }
    }
    processError(reason) {
        if (this.isStopped()) {
            return;
        }
        this.error(new ErrorWithReasonImpl('captureRegion', reason));
        this.close();
    }
}
// TODO(harringtond): Instead of watching for panel state changes in typescript,
// we should probably just have c++ code not send updates when the panel is not
// visible.
class PinCandidatesObservable extends ObservableValueImpl {
    host;
    options;
    isObsolete = false;
    isConnected = false;
    receiver;
    constructor(host, options) {
        super(false);
        this.host = host;
        this.options = options;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (this.isObsolete) {
            console.warn(`getPinCandidates() observable is in use while obsolete.`);
            return;
        }
        if (hasActiveSubscription) {
            if (this.host.isPanelOpen()) {
                this.connectToSource();
            }
        }
        else {
            this.disconnectFromSource();
        }
    }
    connectToSource() {
        if (this.isObsolete || this.isConnected) {
            return;
        }
        const handler = this.host.getHandler();
        this.isConnected = true;
        this.receiver = new PinCandidatesObserverReceiver(this);
        handler.subscribeToPinCandidates(getPinCandidatesOptionsFromClient(this.options), this.receiver.$.bindNewPipeAndPassRemote());
    }
    disconnectFromSource() {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        this.receiver?.$.close();
        this.receiver = undefined;
    }
    onPinCandidatesChanged(candidates) {
        this.assignAndSignal(candidates.map(c => pinCandidateToClient(c)));
    }
    // Mark this observable as obsolete. It should not be used any further.
    // Only one PinCandidatesObservable is active at one time.
    setObsolete() {
        if (this.hasActiveSubscription()) {
            console.warn(`getPinCandidates() observable was made obsolete with subscribers.`);
        }
        this.isObsolete = true;
        this.disconnectFromSource();
    }
}
class GetTabByIdObservableSetImpl {
    interfaceDef = WebClientTabDataObserverDef;
    unsubscribeDelay = 1000;
    subscribe(clientRemote, tabId, remote) {
        clientRemote.requestNoResponse('subscribeToTabData', { tabId, remote });
    }
    createHandler(observable) {
        return new WebClientTabDataObserverHandler(observable);
    }
}
class WebClientTabDataObserverHandler {
    observable;
    constructor(observable) {
        this.observable = observable;
    }
    tabDataChanged(payload) {
        this.observable.assignAndSignal(convertTabDataFromPrivate(payload.tabData));
    }
}
export class TabFaviconObservableSet {
    handler;
    observablesByTabId = new Map();
    constructor(handler) {
        this.handler = handler;
    }
    getObservableByTabId(tabId) {
        let obs = this.observablesByTabId.get(tabId);
        if (obs !== undefined) {
            return obs;
        }
        obs = new TabFaviconObservable(tabId, this.handler, () => {
            this.observablesByTabId.delete(tabId);
        });
        this.observablesByTabId.set(tabId, obs);
        return obs;
    }
}
export class TabFaviconObservable extends ObservableValueImpl {
    tabId;
    handler;
    onComplete;
    unsubscribeTimer = new OneShotTimer(1000);
    receiver;
    isCompleting = false;
    constructor(tabId, handler, onComplete) {
        super(/*isSet=*/ false);
        this.tabId = tabId;
        this.handler = handler;
        this.onComplete = onComplete;
    }
    activeSubscriptionChanged(hasActiveSubscription) {
        super.activeSubscriptionChanged(hasActiveSubscription);
        if (!hasActiveSubscription) {
            this.unsubscribeTimer.start(() => {
                if (this.hasActiveSubscription()) {
                    return;
                }
                this.complete();
            });
            return;
        }
        this.unsubscribeTimer.reset();
        if (!this.receiver) {
            this.receiver = new TabFaviconHandlerReceiver(this);
            this.receiver.onConnectionError.addListener(() => {
                this.complete();
            });
            this.handler.subscribeToTabFavicon(idFromClient(this.tabId), this.receiver.$.bindNewPipeAndPassRemote());
        }
    }
    onTabFaviconChanged(favicon) {
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        let blob;
        if (favicon) {
            const rgba = bitmapN32ToRGBAImage(favicon);
            if (rgba) {
                blob = rgbaImageToBlob(rgba);
            }
        }
        this.assignAndSignal(blob);
    }
    complete() {
        if (this.isCompleting || this.isStopped()) {
            return;
        }
        this.isCompleting = true;
        this.receiver?.$.close();
        this.receiver = undefined;
        this.onComplete();
        super.complete();
    }
}
export function convertTabDataFromPrivate(data) {
    if (!data) {
        return undefined;
    }
    let faviconResult;
    const dataFavicon = data.favicon;
    async function getFavicon() {
        if (dataFavicon && !faviconResult) {
            faviconResult = Promise.resolve(rgbaImageToBlob(dataFavicon));
        }
        return faviconResult;
    }
    const favicon = dataFavicon && getFavicon;
    return replaceProperties(data, { favicon });
}
function convertFocusedTabDataFromPrivate(data) {
    const result = {};
    if (data.hasFocus) {
        result.hasFocus = replaceProperties(data.hasFocus, {
            tabData: convertTabDataFromPrivate(data.hasFocus.tabData),
        });
    }
    if (data.hasNoFocus) {
        result.hasNoFocus = replaceProperties(data.hasNoFocus, {
            tabFocusCandidateData: convertTabDataFromPrivate(data.hasNoFocus.tabFocusCandidateData),
        });
    }
    return result;
}
function streamFromBuffer(buffer) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(buffer);
            controller.close();
        },
    });
}
function convertPdfDocumentDataFromPrivate(data) {
    const pdfData = data.pdfData && streamFromBuffer(new Uint8Array(data.pdfData));
    return replaceProperties(data, { pdfData });
}
function convertAnnotatedPageDataFromPrivate(data) {
    const annotatedPageContent = data.annotatedPageContent &&
        streamFromBuffer(new Uint8Array(data.annotatedPageContent));
    return replaceProperties(data, { annotatedPageContent });
}
export function convertTabContextResultFromPrivate(data) {
    const tabData = convertTabDataFromPrivate(data.tabData);
    const screenshotInfo = data.screenshotInfo &&
        streamFromBuffer(new Uint8Array(data.screenshotInfo));
    const pdfDocumentData = data.pdfDocumentData &&
        convertPdfDocumentDataFromPrivate(data.pdfDocumentData);
    const annotatedPageData = data.annotatedPageData &&
        convertAnnotatedPageDataFromPrivate(data.annotatedPageData);
    return replaceProperties(data, { tabData, screenshotInfo, pdfDocumentData, annotatedPageData });
}
function convertAdditionalContextFromPrivate(context) {
    const parts = context.parts.map(p => {
        const annotatedPageData = p.annotatedPageData &&
            convertAnnotatedPageDataFromPrivate(p.annotatedPageData);
        const pdf = p.pdf && convertPdfDocumentDataFromPrivate(p.pdf);
        const data = p.data && new Blob([p.data.data], { type: p.data.mimeType });
        const filename = p.filename;
        const tabContext = p.tabContext && convertTabContextResultFromPrivate(p.tabContext);
        return {
            ...p,
            data,
            filename,
            annotatedPageData,
            pdf,
            tabContext,
        };
    });
    return {
        ...context,
        parts,
    };
}
function convertInvokeOptionsFromPrivate(options) {
    return {
        ...options,
        context: options.context ?
            convertAdditionalContextFromPrivate(options.context) :
            undefined,
    };
}
function convertImageInfoFromPrivate(data) {
    return {
        caption: data.caption,
        sourceOrigin: data.sourceOrigin,
        url: data.url,
        mimeType: data.mimeType,
    };
}
function convertImageBytesResultFromPrivate(data) {
    return {
        bytes: data.bytes,
        imageInfo: convertImageInfoFromPrivate(data.imageInfo),
    };
}
