import type { WebClientHandlerInterface } from '../../glic.mojom-webui.js';
import type { //
ClientErrorDialogType, //
ConversationInfo, //
CounterAbuseVerdict, //
MicrophoneStatus, //
OnResponseStoppedDetails, //
OpenPinnedTabPickerOptions, //
PinTabsOptions, //
PromptType, //
TabContextOptions, //
UnpinTabsOptions, //
WebClientMode, //
ZeroStateSuggestions } from '../../glic_api/glic_api.js';
import type { //
GlicException, //
ImageBytesResultPrivate, //
RgbaImage, //
TabContextResultPrivate, //
WebClientHost, //
WebClientTabDataObserver } from '../request_types.js';
import { ResponseExtras } from '../transport/messaging.js';
import type { //
PendingRemote, //
PostMessageHandler } from '../transport/post_message_transport.js';
import type { GlicApiHost } from './glic_api_host.js';
/**
 * Handles all requests to the host.
 *
 * Each function is a message handler, automatically called when the host
 * receives a message with the corresponding request name.
 *
 * Any new state or function that's not a handler should be added to
 * `GlicApiHost`.
 */
export declare class HostMessageHandler implements PostMessageHandler<WebClientHost> {
    private handler;
    private host;
    constructor(handler: WebClientHandlerInterface, host: GlicApiHost);
    destroy(): void;
    webClientInitialized(request: {
        success: boolean;
        exception?: GlicException;
    }): void;
    reportClientTransientError(request: {
        abslStatus: number;
    }): void;
    processCounterAbuseVerdict(request: {
        tabId: string;
        verdict: CounterAbuseVerdict;
    }): void;
    getModelQualityClientId(): Promise<{
        modelQualityClientId: string;
    }>;
    switchConversation(request: {
        info?: ConversationInfo;
    }): Promise<{}>;
    registerConversation(request: {
        info: ConversationInfo;
    }): Promise<{}>;
    getContextFromFocusedTab(request: {
        options: TabContextOptions;
    }, extras: ResponseExtras): Promise<{
        tabContextResult: TabContextResultPrivate;
    }>;
    getContextFromTab(request: {
        tabId: string;
        options: TabContextOptions;
    }, extras: ResponseExtras): Promise<{
        tabContextResult: TabContextResultPrivate;
    }>;
    getImageBytesFromTab(request: {
        tabId: string;
        documentId: string;
        domNodeId: number;
    }, extras: ResponseExtras): Promise<{
        result: ImageBytesResultPrivate | null;
    }>;
    setMaximumNumberOfPinnedTabs(request: {
        requestedMax: number;
    }): Promise<{
        effectiveMax: number;
    }>;
    activateTab(request: {
        tabId: string;
    }): void;
    resizeWindow(request: {
        size: {
            width: number;
            height: number;
        };
        options?: {
            durationMs?: number;
        };
    }): Promise<void>;
    enableDragResize(request: {
        enabled: boolean;
    }): void;
    deleteCapturedRegion(request: {
        tabId: string;
        regionId: string;
    }): void;
    setMinimumWidgetSize(request: {
        size: {
            width: number;
            height: number;
        };
    }): void;
    setMicrophonePermissionState(request: {
        enabled: boolean;
    }): Promise<void>;
    setLocationPermissionState(request: {
        enabled: boolean;
    }): Promise<void>;
    setTabContextPermissionState(request: {
        enabled: boolean;
    }): Promise<void>;
    setClosedCaptioningSetting(request: {
        enabled: boolean;
    }): Promise<void>;
    setActuationOnWebSetting(request: {
        enabled: boolean;
    }): Promise<void>;
    getUserProfileInfo(_request: void, extras: ResponseExtras): Promise<{
        profileInfo?: undefined;
    } | {
        profileInfo: Omit<import("../../glic.mojom-webui.js").UserProfileInfoMojoType, "avatarIcon"> & {
            avatarIcon: RgbaImage | undefined;
        };
    }>;
    refreshSignInCookies(): Promise<{
        success: boolean;
    }>;
    setAudioDucking(request: {
        enabled: boolean;
    }): void;
    onOptinImpression(): void;
    onUserInputSubmitted(request: {
        mode: number;
        promptType?: PromptType;
    }): void;
    onContextUploadStarted(): void;
    onContextUploadCompleted(): void;
    onReaction(request: {
        reactionType: number;
    }): void;
    onActionSubmitted(request: {
        isRetry?: boolean;
    }): void;
    onResponseStarted(): void;
    onResponseStopped(request: {
        details?: OnResponseStoppedDetails;
    }): void;
    onSessionTerminated(): void;
    onTurnCompleted(request: {
        model: number;
        duration: number;
    }): void;
    recordHistogram(request: {
        name: string;
        sparseValue: number;
    }): void;
    onResponseRated(request: {
        positive: boolean;
    }): void;
    onClosedCaptionsShown(): void;
    setSyntheticExperimentState(request: {
        trialName: string;
        groupName: string;
    }): void;
    getOsMicrophonePermissionStatus(): Promise<{
        enabled: boolean;
    }>;
    pinTabs(request: {
        tabIds: string[];
        options?: PinTabsOptions;
    }): Promise<{
        pinnedAll: boolean;
    }>;
    unpinTabs(request: {
        tabIds: string[];
        options?: UnpinTabsOptions;
    }): Promise<{
        unpinnedAll: boolean;
    }>;
    unpinAllTabs(request: {
        options?: UnpinTabsOptions;
    }): void;
    openPinnedTabPicker(request: {
        options?: OpenPinnedTabPickerOptions;
    }): Promise<void>;
    getZeroStateSuggestionsForFocusedTab(request: {
        isFirstRun?: boolean;
    }): Promise<{
        suggestions?: ZeroStateSuggestions;
    }>;
    maybeRefreshUserStatus(): void;
    subscribeToPageMetadata(request: {
        tabId: string;
        names: string[];
    }): Promise<{
        success: boolean;
    }>;
    onModeChange(request: {
        newMode: WebClientMode;
    }): void;
    onMicrophoneStatusChange(request: {
        status: MicrophoneStatus;
    }): void;
    setOnboardingCompleted(): void;
    subscribeToTabData(request: {
        tabId: string;
        remote: PendingRemote<WebClientTabDataObserver>;
    }): void;
    setErrorDialogState(request: {
        shownDialogType?: ClientErrorDialogType;
    }): void;
}
