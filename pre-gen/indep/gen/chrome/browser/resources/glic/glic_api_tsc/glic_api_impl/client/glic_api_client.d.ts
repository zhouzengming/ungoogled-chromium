import type { BitmapN32 } from '//resources/mojo/skia/public/mojom/bitmap.mojom-webui.js';
import type { PageMetadata as PageMetadataMojo } from '../../ai_page_content_metadata.mojom-webui.js';
import type { //
AdditionalContext as AdditionalContextMojo, //
CaptureRegionErrorReason as CaptureRegionErrorReasonMojo, //
CaptureRegionObserverInterface, //
CaptureRegionResult as CaptureRegionResultMojo, //
FileUploadPolicyState as FileUploadPolicyStateMojo, //
FocusedTabData as FocusedTabDataMojo, //
GeminiEnterpriseSettings as GeminiEnterpriseSettingsMojo, //
InvokeOptions as InvokeOptionsMojo, //
OpenPanelInfo as OpenPanelInfoMojo, //
PanelOpeningData as PanelOpeningDataMojo, //
PanelState as PanelStateMojo, //
PinCandidate as PinCandidateMojo, //
PinCandidatesObserverInterface, //
TabData as TabDataMojo, //
TabFaviconHandlerInterface, //
WebClientHandlerRemote, //
WebClientInterface } from '../../glic.mojom-webui.js';
import { CaptureRegionErrorReason, ClientCapabilities, HostCapability } from '../../glic_api/glic_api.js';
import type { //
ActivateTabOptions, //
AdditionalContext, //
CaptureRegionParams, //
CaptureRegionResult, //
ChromeVersion, //
ClientErrorDialogType, //
ConversationInfo, //
CounterAbuseVerdict, //
CreateTabOptions, //
FileUploadPolicyState, //
FocusedTabData, //
FormFactor, //
GeicBrowserHost, //
GeminiEnterpriseSettings, //
GetPinCandidatesOptions, //
GlicBrowserHost, //
GlicBrowserHostMetrics, //
GlicHostRegistry, //
GlicWebClient, //
ImageBytesResult, //
MicrophoneStatus, //
Observable, //
ObservableValue, //
OpenPinnedTabPickerOptions, //
OpenSettingsOptions, //
PageMetadata, //
PanelState, //
PinCandidate, //
PinTabsOptions, //
Platform, //
ResizeWindowOptions, //
ResumeActorTaskResult, //
TabContextOptions, //
TabContextResult, //
TabData, //
UnpinTabsOptions, //
UserProfileInfo, //
WebClientMode, //
ZeroStateSuggestions } from '../../glic_api/glic_api.js';
import { ObservableValue as ObservableValueImpl, Subject } from '../../observable.js';
import { GlicBrowserHostActor } from '../actor/actor_client.js';
import { GlicBrowserHostAnnotation } from '../annotation/annotation_client.js';
import { GlicBrowserHostExperimentalTriggering } from '../experimental_triggering/experimental_triggering_client.js';
import { GlicBrowserHostGeic } from '../geic/geic_client.js';
import type { GlicApiHost } from '../host/glic_api_host.js';
import { PanelOpenState } from '../host/types.js';
import { GlicBrowserHostSkills } from '../skills/skills_client.js';
import { GlicBrowserHostTools } from '../tools/tools_client.js';
import type { //
createDirectMessagingPair, //
PostMessageRemote, //
PostMessageRouter } from '../transport/post_message_transport.js';
import { GlicBrowserHostZeroStateSuggestions } from '../zero_state_suggestions/zero_state_suggestions_client.js';
import type { //
GlicException, //
ResumeActorTaskResultPrivate, //
TabContextResultPrivate, //
TabDataPrivate, //
WebClient, //
WebClientHost, //
WebClientTabDataObserver } from './../request_types.js';
import type { GlicBrowserHostBaseContext } from './glic_client_common.js';
import { ObservableSetByTabId } from './observable_set_by_tab_id.js';
export declare class GlicHostRegistryImpl implements GlicHostRegistry {
    private directPair;
    private hostApi;
    private host;
    constructor(directPair: ReturnType<typeof createDirectMessagingPair<WebClientHost, WebClient>>, hostApi: GlicApiHost);
    registerWebClient(webClient: GlicWebClient): Promise<void>;
}
export declare class GlicBrowserHostImpl implements GlicBrowserHostBaseContext, GlicBrowserHost, WebClientInterface {
    webClient: GlicWebClient;
    private hostApi;
    readonly router: PostMessageRouter;
    readonly clientRemote: PostMessageRemote<WebClientHost>;
    readonly actorClient: GlicBrowserHostActor;
    readonly annotationClient: GlicBrowserHostAnnotation;
    readonly skillsClient: GlicBrowserHostSkills;
    readonly toolsClient: GlicBrowserHostTools;
    readonly experimentalTriggeringClient: GlicBrowserHostExperimentalTriggering;
    readonly suggestionsClient: GlicBrowserHostZeroStateSuggestions;
    readonly geicClient: GlicBrowserHostGeic;
    private chromeVersion?;
    private platform?;
    private formFactor?;
    private panelState;
    canAttachPanelValue: ObservableValueImpl<boolean>;
    private focusedTabStateV2;
    private geminiEnterpriseSettings;
    private zoomLevel;
    private permissionStateMicrophone;
    private permissionStateLocation;
    private permissionStateTabContext;
    defaultTabContextPermission: ObservableValueImpl<boolean>;
    private enableDefaultTabContextSettingFeature;
    private permissionStateOsLocation;
    closedCaptioningState: ObservableValueImpl<boolean>;
    actuationOnWebState: ObservableValueImpl<boolean>;
    fileUploadAllowedState: ObservableValueImpl<FileUploadPolicyState>;
    private osHotkeyState;
    onboardingCompleted: ObservableValueImpl<boolean>;
    panelActiveValue: ObservableValueImpl<boolean>;
    isBrowserOpenValue: ObservableValueImpl<boolean>;
    private metrics;
    private manuallyResizing;
    private cachedUserProfile?;
    private enableCachedGetUserProfileInfo?;
    pinnedTabs: ObservableValueImpl<TabData[]>;
    pinCandidates: PinCandidatesObservable | undefined;
    captureRegionObservable?: CaptureRegionObservable;
    private cachedPinnedTabs;
    private webClientReceiver?;
    private hostCapabilities;
    readonly additionalContextSubject: Subject<AdditionalContext>;
    pageMetadataObservers: Map<string, ObservableValueImpl<PageMetadata>>;
    getTabByIdObservableSet: ObservableSetByTabId<TabData, WebClientTabDataObserver>;
    getTabFaviconByIdObservableSet: TabFaviconObservableSet;
    notifyPanelWillOpenCompleted: PromiseWithResolvers<void>;
    private panelOpenState;
    private handler;
    constructor(webClient: GlicWebClient, directPair: ReturnType<typeof createDirectMessagingPair<WebClientHost, WebClient>>, hostApi: GlicApiHost);
    isPanelOpen(): boolean;
    panelOpenStateChanged(state: PanelOpenState): void;
    getHandler(): WebClientHandlerRemote;
    destroy(): void;
    webClientCreated(clientCapabilities: Set<ClientCapabilities>): Promise<void>;
    webClientInitialized(success: boolean, exception: GlicException | undefined): void;
    checkResponsive(): Promise<void>;
    notifyPanelWillOpen(panelOpeningData: PanelOpeningDataMojo): Promise<{
        openPanelInfo: OpenPanelInfoMojo;
    }>;
    notifyPanelWasClosed(): Promise<void>;
    invoke(options: InvokeOptionsMojo): Promise<void>;
    notifyPanelStateChange(panelState: PanelStateMojo): void;
    notifyPanelActiveChange(panelActive: boolean): void;
    notifyPanelCanAttachChange(canAttach: boolean): void;
    notifyGeminiEnterpriseSettingsChanged(settings: GeminiEnterpriseSettingsMojo | null): void;
    notifyMicrophonePermissionStateChanged(enabled: boolean): void;
    stopMicrophone(): Promise<void>;
    notifyLocationPermissionStateChanged(enabled: boolean): void;
    notifyTabContextPermissionStateChanged(enabled: boolean): void;
    notifyOsLocationPermissionStateChanged(enabled: boolean): void;
    notifyClosedCaptioningSettingChanged(enabled: boolean): void;
    notifyDefaultTabContextPermissionStateChanged(enabled: boolean): void;
    notifyActuationOnWebSettingChanged(enabled: boolean): void;
    notifyFileUploadStateChanged(state: FileUploadPolicyStateMojo): void;
    notifyZoomLevelChanged(zoomFactor: number): void;
    notifyFocusedTabChanged(focusedTabData: FocusedTabDataMojo): void;
    notifyManualResizeChanged(resizing: boolean): void;
    notifyBrowserIsOpenChanged(browserIsOpen: boolean): void;
    notifyInstanceActivationChanged(instanceIsActive: boolean): void;
    notifyOsHotkeyStateChanged(hotkey: string): void;
    notifyPinnedTabsChanged(tabData: TabDataMojo[]): void;
    notifyPinnedTabDataChanged(tabData: TabDataMojo): void;
    notifyPageMetadataChanged(tabId: number, metadata: PageMetadataMojo | null): void;
    notifyAdditionalContext(context: AdditionalContextMojo): void;
    notifyActOnWebCapabilityChanged(canActOnWeb: boolean): void;
    notifyOnboardingCompletedChanged(completed: boolean): void;
    notifyActorTaskListRowClicked(taskId: number): void;
    getChromeVersion(): Promise<ChromeVersion>;
    experimentalTriggering(): GlicBrowserHostExperimentalTriggering;
    getPlatform(): Platform;
    getFormFactor(): FormFactor;
    createTab(url: string, options?: CreateTabOptions): Promise<TabData>;
    activateTabWithUrl(exactUrl: string, options?: ActivateTabOptions): Promise<TabData>;
    openGlicSettingsPage(options?: OpenSettingsOptions): void;
    openPasswordManagerSettingsPage?(): void;
    openContactInfoSettingsPage?(): void;
    reportClientTransientError(abslStatus: number): void;
    processCounterAbuseVerdict?(tabId: string, verdict: CounterAbuseVerdict): void;
    closePanel(): Promise<void>;
    closePanelAndShutdown(): void;
    attachPanel?(): void;
    detachPanel?(): void;
    showProfilePicker(): void;
    getModelQualityClientId?(): Promise<string>;
    getGeminiEnterpriseSettings?(): ObservableValueImpl<GeminiEnterpriseSettings | undefined>;
    switchConversation(info?: ConversationInfo): Promise<void>;
    registerConversation(info: ConversationInfo): Promise<void>;
    getContextFromFocusedTab(options: TabContextOptions): Promise<TabContextResult>;
    setMaximumNumberOfPinnedTabs?(requestedMax: number): Promise<number>;
    getContextFromTab?(tabId: string, options: TabContextOptions): Promise<TabContextResult>;
    getImageBytesFromTab?(tabId: string, documentId: string, domNodeId: number): Promise<ImageBytesResult>;
    getTabById?(tabId: string): ObservableValueImpl<TabData>;
    getTabFaviconById?(tabId: string): ObservableValueImpl<Blob | undefined>;
    activateTab?(tabId: string): void;
    onModeChange?(newMode: WebClientMode): void;
    onMicrophoneStatusChange?(status: MicrophoneStatus): void;
    setErrorDialogState?(shownDialogType?: ClientErrorDialogType): void;
    resizeWindow(width: number, height: number, options?: ResizeWindowOptions): Promise<void>;
    enableDragResize?(enabled: boolean): Promise<void>;
    captureRegion?(params?: CaptureRegionParams): ObservableValue<CaptureRegionResult>;
    deleteCapturedRegion?(tabId: string, regionId: string): void;
    setMinimumWidgetSize(width: number, height: number): Promise<void>;
    getPanelState?(): ObservableValueImpl<PanelState>;
    panelActive(): ObservableValueImpl<boolean>;
    canAttachPanel?(): ObservableValue<boolean>;
    isBrowserOpen(): ObservableValue<boolean>;
    getFocusedTabStateV2(): ObservableValueImpl<FocusedTabData>;
    getZoomLevel(): ObservableValueImpl<number>;
    getMicrophonePermissionState(): ObservableValueImpl<boolean>;
    getLocationPermissionState(): ObservableValueImpl<boolean>;
    getTabContextPermissionState(): ObservableValueImpl<boolean>;
    getDefaultTabContextPermissionState?(): ObservableValueImpl<boolean>;
    getOsLocationPermissionState(): ObservableValueImpl<boolean>;
    getClosedCaptioningSetting?(): ObservableValueImpl<boolean>;
    getActuationOnWebSetting?(): ObservableValueImpl<boolean>;
    getFileUploadAllowedCapability?(): ObservableValueImpl<FileUploadPolicyState>;
    setMicrophonePermissionState(enabled: boolean): Promise<void>;
    setLocationPermissionState(enabled: boolean): Promise<void>;
    setTabContextPermissionState(enabled: boolean): Promise<void>;
    setClosedCaptioningSetting?(enabled: boolean): Promise<void>;
    setContextAccessIndicator(show: boolean): void;
    setActuationOnWebSetting?(enabled: boolean): Promise<void>;
    getUserProfileInfo?(): Promise<UserProfileInfo>;
    private fetchUserProfileDirect;
    private fetchUserProfileCached;
    refreshSignInCookies(): Promise<void>;
    setAudioDucking?(enabled: boolean): void;
    getMetrics(): GlicBrowserHostMetrics;
    getGeicClient(): GeicBrowserHost;
    setSyntheticExperimentState(trialName: string, groupName: string): void;
    openOsPermissionSettingsMenu?(permission: string): void;
    getOsMicrophonePermissionStatus(): Promise<boolean>;
    isManuallyResizing(): ObservableValueImpl<boolean>;
    getOsHotkeyState(): ObservableValueImpl<{
        hotkey: string;
    }>;
    getPinnedTabs?(): ObservableValueImpl<TabData[]>;
    pinTabs?(tabIds: string[], options?: PinTabsOptions): Promise<boolean>;
    unpinTabs?(tabIds: string[], options?: UnpinTabsOptions): Promise<boolean>;
    unpinAllTabs?(options?: UnpinTabsOptions): void;
    openPinnedTabPicker?(options?: OpenPinnedTabPickerOptions): Promise<void>;
    getPinCandidates?(options: GetPinCandidatesOptions): ObservableValue<PinCandidate[]>;
    getZeroStateSuggestionsForFocusedTab?(isFirstRun?: boolean): Promise<ZeroStateSuggestions>;
    maybeRefreshUserStatus?(): void;
    getAdditionalContext?(): Observable<AdditionalContext>;
    getHostCapabilities(): Set<HostCapability>;
    getPageMetadata?(tabId: string, names: string[]): ObservableValueImpl<PageMetadata>;
    setOnboardingCompleted?(): void;
    isOnboardingCompleted?(): ObservableValue<boolean>;
}
export declare class CaptureRegionObservable extends ObservableValueImpl<CaptureRegionResult> implements CaptureRegionObserverInterface {
    private handler;
    private params?;
    private receiver?;
    constructor(handler: WebClientHandlerRemote, params?: CaptureRegionParams | undefined);
    private close;
    activeSubscriptionChanged(hasActiveSubscription: boolean): void;
    error(e: Error): void;
    complete(): void;
    onUpdate(result: CaptureRegionResultMojo | null, reason: CaptureRegionErrorReasonMojo | null): void;
    processError(reason: CaptureRegionErrorReason): void;
}
declare class PinCandidatesObservable extends ObservableValueImpl<PinCandidate[]> implements PinCandidatesObserverInterface {
    private host;
    private options;
    private isObsolete;
    private isConnected;
    private receiver?;
    constructor(host: GlicBrowserHostImpl, options: GetPinCandidatesOptions);
    activeSubscriptionChanged(hasActiveSubscription: boolean): void;
    connectToSource(): void;
    disconnectFromSource(): void;
    onPinCandidatesChanged(candidates: PinCandidateMojo[]): void;
    setObsolete(): void;
}
export declare class TabFaviconObservableSet {
    private handler;
    private observablesByTabId;
    constructor(handler: WebClientHandlerRemote);
    getObservableByTabId(tabId: string): ObservableValueImpl<Blob | undefined>;
}
export declare class TabFaviconObservable extends ObservableValueImpl<Blob | undefined> implements TabFaviconHandlerInterface {
    tabId: string;
    private handler;
    private onComplete;
    private unsubscribeTimer;
    private receiver?;
    private isCompleting;
    constructor(tabId: string, handler: WebClientHandlerRemote, onComplete: () => void);
    activeSubscriptionChanged(hasActiveSubscription: boolean): void;
    onTabFaviconChanged(favicon: BitmapN32 | null): void;
    complete(): void;
}
export declare function convertTabDataFromPrivate(data: TabDataPrivate): TabData;
export declare function convertTabDataFromPrivate(data: TabDataPrivate | undefined): TabData | undefined;
export declare function convertTabContextResultFromPrivate(data: ResumeActorTaskResultPrivate): ResumeActorTaskResult;
export declare function convertTabContextResultFromPrivate(data: TabContextResultPrivate): TabContextResult;
export {};
