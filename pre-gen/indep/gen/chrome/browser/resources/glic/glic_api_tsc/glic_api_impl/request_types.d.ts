import type { //
AdditionalContext, //
AdditionalContextPart, //
AnnotatedPageData, //
ClientErrorDialogType, //
ConversationInfo, //
CounterAbuseVerdict, //
ErrorReasonTypes, //
ErrorWithReason, //
FocusedTabDataHasFocus, //
FocusedTabDataHasNoFocus, //
InvokeOptions, //
MetricUserInputReactionType, //
MicrophoneStatus, //
OnResponseStoppedDetails, //
OpenPinnedTabPickerOptions, //
PageMetadata, //
PdfDocumentData, //
PinTabsOptions, //
PromptType, //
ResumeActorTaskResult, //
TabContextOptions, //
TabContextResult, //
TabData, //
UnpinTabsOptions, //
UserProfileInfo, //
WebClientMode, //
ZeroStateSuggestions } from '../glic_api/glic_api.js';
import type { InterfaceDef, InterfaceDefMethods } from './transport/messaging.js';
import type { ErrorCodec, PendingRemote, TransferableException } from './transport/post_message_transport.js';
export declare const WebClientHostDef: {
    readonly name: "WebClientHost";
    readonly methods: readonly [{
        readonly name: "webClientInitialized";
        readonly request: {
            success: boolean;
            exception?: GlicException;
        };
    }, {
        readonly name: "getModelQualityClientId";
        readonly response: {
            modelQualityClientId: string;
        };
        readonly histogram: {
            readonly id: 8;
        };
    }, {
        readonly name: "switchConversation";
        readonly request: {
            info?: ConversationInfo;
        };
        readonly response: {};
        readonly histogram: {
            readonly id: 64;
        };
    }, {
        readonly name: "registerConversation";
        readonly request: {
            info: ConversationInfo;
        };
        readonly response: {};
        readonly histogram: {
            readonly id: 65;
        };
    }, {
        readonly name: "getContextFromFocusedTab";
        readonly request: {
            options: TabContextOptions;
        };
        readonly response: {
            tabContextResult: TabContextResultPrivate;
        };
        readonly histogram: {
            readonly id: 9;
        };
    }, {
        readonly name: "getContextFromTab";
        readonly request: {
            tabId: string;
            options: TabContextOptions;
        };
        readonly response: {
            tabContextResult: TabContextResultPrivate;
        };
        readonly histogram: {
            readonly id: 10;
        };
    }, {
        readonly name: "getImageBytesFromTab";
        readonly request: {
            tabId: string;
            documentId: string;
            domNodeId: number;
        };
        readonly response: {
            result: ImageBytesResultPrivate | null;
        };
        readonly histogram: {
            readonly id: 101;
        };
    }, {
        readonly name: "setMaximumNumberOfPinnedTabs";
        readonly request: {
            requestedMax: number;
        };
        readonly response: {
            effectiveMax: number;
        };
        readonly histogram: {
            readonly id: 12;
        };
    }, {
        readonly name: "activateTab";
        readonly request: {
            tabId: string;
        };
        readonly histogram: {
            readonly id: 76;
        };
    }, {
        readonly name: "resizeWindow";
        readonly request: {
            size: {
                width: number;
                height: number;
            };
            options?: {
                durationMs?: number;
            };
        };
        readonly histogram: {
            readonly id: 17;
        };
    }, {
        readonly name: "enableDragResize";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 18;
        };
    }, {
        readonly name: "setMinimumWidgetSize";
        readonly request: {
            size: {
                width: number;
                height: number;
            };
        };
        readonly histogram: {
            readonly id: 20;
        };
    }, {
        readonly name: "setMicrophonePermissionState";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 21;
        };
    }, {
        readonly name: "setLocationPermissionState";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 22;
        };
    }, {
        readonly name: "setTabContextPermissionState";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 23;
        };
    }, {
        readonly name: "setClosedCaptioningSetting";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 56;
        };
    }, {
        readonly name: "setActuationOnWebSetting";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 69;
        };
    }, {
        readonly name: "getUserProfileInfo";
        readonly response: {
            profileInfo?: UserProfileInfoPrivate;
        };
        readonly histogram: {
            readonly id: 25;
        };
    }, {
        readonly name: "refreshSignInCookies";
        readonly response: {
            success: boolean;
        };
        readonly histogram: {
            readonly id: 26;
        };
    }, {
        readonly name: "setAudioDucking";
        readonly request: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 29;
        };
    }, {
        readonly name: "onUserInputSubmitted";
        readonly request: {
            mode: number;
            promptType?: PromptType;
        };
        readonly histogram: {
            readonly id: 38;
        };
    }, {
        readonly name: "onReaction";
        readonly request: {
            reactionType: MetricUserInputReactionType;
        };
        readonly histogram: {
            readonly id: 66;
        };
    }, {
        readonly name: "onOptinImpression";
        readonly histogram: {
            readonly id: 99;
        };
    }, {
        readonly name: "onContextUploadStarted";
        readonly histogram: {
            readonly id: 68;
        };
    }, {
        readonly name: "onContextUploadCompleted";
        readonly histogram: {
            readonly id: 67;
        };
    }, {
        readonly name: "onResponseStarted";
        readonly histogram: {
            readonly id: 40;
        };
    }, {
        readonly name: "onResponseStopped";
        readonly request: {
            details?: OnResponseStoppedDetails;
        };
        readonly histogram: {
            readonly id: 41;
        };
    }, {
        readonly name: "onSessionTerminated";
        readonly histogram: {
            readonly id: 42;
        };
    }, {
        readonly name: "onTurnCompleted";
        readonly request: {
            model: number;
            duration: number;
        };
        readonly histogram: {
            readonly id: 43;
        };
    }, {
        readonly name: "onResponseRated";
        readonly request: {
            positive: boolean;
        };
        readonly histogram: {
            readonly id: 39;
        };
    }, {
        readonly name: "onClosedCaptionsShown";
        readonly histogram: {
            readonly id: 59;
        };
    }, {
        readonly name: "onActionSubmitted";
        readonly request: {
            isRetry?: boolean;
        };
        readonly histogram: {
            readonly id: 93;
        };
    }, {
        readonly name: "setSyntheticExperimentState";
        readonly request: {
            trialName: string;
            groupName: string;
        };
        readonly histogram: {
            readonly id: 46;
        };
    }, {
        readonly name: "getOsMicrophonePermissionStatus";
        readonly response: {
            enabled: boolean;
        };
        readonly histogram: {
            readonly id: 48;
        };
    }, {
        readonly name: "pinTabs";
        readonly request: {
            tabIds: string[];
            options?: PinTabsOptions;
        };
        readonly response: {
            pinnedAll: boolean;
        };
        readonly histogram: {
            readonly id: 49;
        };
    }, {
        readonly name: "unpinTabs";
        readonly request: {
            tabIds: string[];
            options?: UnpinTabsOptions;
        };
        readonly response: {
            unpinnedAll: boolean;
        };
        readonly histogram: {
            readonly id: 50;
        };
    }, {
        readonly name: "unpinAllTabs";
        readonly request: {
            options?: UnpinTabsOptions;
        };
        readonly histogram: {
            readonly id: 51;
        };
    }, {
        readonly name: "openPinnedTabPicker";
        readonly request: {
            options?: OpenPinnedTabPickerOptions;
        };
        readonly histogram: {
            readonly id: 104;
        };
    }, {
        readonly name: "deleteCapturedRegion";
        readonly request: {
            tabId: string;
            regionId: string;
        };
        readonly histogram: {
            readonly id: 92;
        };
    }, {
        readonly name: "getZeroStateSuggestionsForFocusedTab";
        readonly request: {
            isFirstRun?: boolean;
        };
        readonly response: {
            suggestions?: ZeroStateSuggestions;
        };
        readonly histogram: {
            readonly id: 54;
        };
    }, {
        readonly name: "maybeRefreshUserStatus";
        readonly histogram: {
            readonly id: 58;
        };
    }, {
        readonly name: "subscribeToPageMetadata";
        readonly request: {
            tabId: string;
            names: string[];
        };
        readonly response: {
            success: boolean;
        };
        readonly histogram: {
            readonly id: 63;
        };
    }, {
        readonly name: "onModeChange";
        readonly request: {
            newMode: WebClientMode;
        };
        readonly histogram: {
            readonly id: 70;
        };
    }, {
        readonly name: "setOnboardingCompleted";
        readonly histogram: {
            readonly id: 80;
        };
    }, {
        readonly name: "subscribeToTabData";
        readonly request: {
            tabId: string;
            remote: PendingRemote<WebClientTabDataObserver>;
        };
        readonly histogram: {
            readonly id: 81;
        };
    }, {
        readonly name: "onMicrophoneStatusChange";
        readonly request: {
            status: MicrophoneStatus;
        };
        readonly histogram: {
            readonly id: 90;
        };
    }, {
        readonly name: "recordHistogram";
        readonly request: {
            name: string;
            sparseValue: number;
        };
    }, {
        readonly name: "setErrorDialogState";
        readonly request: {
            shownDialogType?: ClientErrorDialogType;
        };
    }, {
        readonly name: "reportClientTransientError";
        readonly request: {
            abslStatus: number;
        };
    }, {
        readonly name: "processCounterAbuseVerdict";
        readonly request: {
            tabId: string;
            verdict: CounterAbuseVerdict;
        };
        readonly histogram: {
            readonly id: 100;
        };
    }];
};
export type WebClientHost = typeof WebClientHostDef;
export declare const WebClientDef: {
    readonly name: "WebClient";
    readonly methods: readonly [];
};
export type WebClient = typeof WebClientDef;
export declare const WebClientTabDataObserverDef: {
    readonly name: "WebClientTabDataObserver";
    readonly methods: readonly [{
        readonly name: "tabDataChanged";
        readonly request: {
            tabData: TabDataPrivate;
        };
    }];
};
export type WebClientTabDataObserver = typeof WebClientTabDataObserverDef;
export type WebClientRequestTypes = InterfaceDefMethods<WebClient> & InterfaceDefMethods<WebClientTabDataObserver>;
export type HostRequestTypes = InterfaceDefMethods<WebClientHost>;
export declare const RECORDED_REQUEST_IDS: {
    readonly GetModelQualityClientId: 8;
    readonly GetContextFromFocusedTab: 9;
    readonly GetContextFromTab: 10;
    readonly SetMaximumNumberOfPinnedTabs: 12;
    readonly ResizeWindow: 17;
    readonly EnableDragResize: 18;
    readonly SetMinimumWidgetSize: 20;
    readonly SetMicrophonePermissionState: 21;
    readonly SetLocationPermissionState: 22;
    readonly SetTabContextPermissionState: 23;
    readonly GetUserProfileInfo: 25;
    readonly RefreshSignInCookies: 26;
    readonly SetAudioDucking: 29;
    readonly OnUserInputSubmitted: 38;
    readonly OnResponseRated: 39;
    readonly OnResponseStarted: 40;
    readonly OnResponseStopped: 41;
    readonly OnSessionTerminated: 42;
    readonly OnTurnCompleted: 43;
    readonly SetSyntheticExperimentState: 46;
    readonly GetOsMicrophonePermissionStatus: 48;
    readonly PinTabs: 49;
    readonly UnpinTabs: 50;
    readonly UnpinAllTabs: 51;
    readonly GetZeroStateSuggestionsForFocusedTab: 54;
    readonly SetClosedCaptioningSetting: 56;
    readonly MaybeRefreshUserStatus: 58;
    readonly OnClosedCaptionsShown: 59;
    readonly SubscribeToPageMetadata: 63;
    readonly SwitchConversation: 64;
    readonly RegisterConversation: 65;
    readonly OnReaction: 66;
    readonly OnContextUploadCompleted: 67;
    readonly OnContextUploadStarted: 68;
    readonly SetActuationOnWebSetting: 69;
    readonly OnModeChange: 70;
    readonly ActivateTab: 76;
    readonly SetOnboardingCompleted: 80;
    readonly SubscribeToTabData: 81;
    readonly OnMicrophoneStatusChange: 90;
    readonly DeleteCapturedRegion: 92;
    readonly OnActionSubmitted: 93;
    readonly OnOptinImpression: 99;
    readonly ProcessCounterAbuseVerdict: 100;
    readonly GetImageBytesFromTab: 101;
    readonly OpenPinnedTabPicker: 104;
};
export declare const MAX_REQUEST_ID: number;
export interface HostRequestHistogramInfo {
    name: string;
    id: number;
}
export declare function getHostRequestHistogramInfo(requestType: string, interfaceDef: InterfaceDef | undefined): HostRequestHistogramInfo | undefined;
export declare interface TabDataPrivate extends Omit<TabData, 'favicon'> {
    favicon?: RgbaImage;
}
export declare interface RgbaImage {
    dataRGBA: ArrayBuffer;
    width: number;
    height: number;
    alphaType: ImageAlphaType;
    colorType: ImageColorType;
}
export declare enum ImageAlphaType {
    UNPREMUL = 0,
    PREMUL = 1
}
export declare enum ImageColorType {
    BGRA = 0,
    RGBA = 1
}
export declare interface FocusedTabDataPrivate {
    hasFocus?: Omit<FocusedTabDataHasFocus, 'tabData'> & {
        tabData: TabDataPrivate;
    };
    hasNoFocus?: Omit<FocusedTabDataHasNoFocus, 'tabFocusCandidateData'> & {
        tabFocusCandidateData?: TabDataPrivate;
    };
}
export declare interface TabContextResultPrivate extends Omit<TabContextResult, 'tabData' | 'screenshotInfo' | 'pdfDocumentData' | 'annotatedPageData'> {
    tabData: TabDataPrivate;
    screenshotInfo?: ArrayBuffer;
    pdfDocumentData?: PdfDocumentDataPrivate;
    annotatedPageData?: AnnotatedPageDataPrivate;
}
export declare interface ResumeActorTaskResultPrivate extends Omit<ResumeActorTaskResult, 'tabData' | 'screenshotInfo' | 'pdfDocumentData' | 'annotatedPageData'> {
    tabData: TabDataPrivate;
    screenshotInfo?: ArrayBuffer;
    pdfDocumentData?: PdfDocumentDataPrivate;
    annotatedPageData?: AnnotatedPageDataPrivate;
}
export declare interface UserProfileInfoPrivate extends Omit<UserProfileInfo, 'avatarIcon'> {
    avatarIcon?: RgbaImage;
}
export declare interface PdfDocumentDataPrivate extends Omit<PdfDocumentData, 'pdfData'> {
    pdfData?: ArrayBuffer;
}
export declare interface AnnotatedPageDataPrivate extends Omit<AnnotatedPageData, 'annotatedPageContent'> {
    annotatedPageContent?: ArrayBuffer;
    metadata?: PageMetadata;
}
export declare interface AdditionalContextPartPrivate extends Omit<AdditionalContextPart, 'annotatedPageData' | 'pdf' | 'data' | 'tabContext'> {
    annotatedPageData?: AnnotatedPageDataPrivate;
    pdf?: PdfDocumentDataPrivate;
    data?: {
        mimeType: string;
        data: ArrayBuffer;
    };
    filename?: string;
    tabContext?: TabContextResultPrivate;
}
export declare interface AdditionalContextPrivate extends Omit<AdditionalContext, 'parts'> {
    parts: AdditionalContextPartPrivate[];
}
export declare interface InvokeOptionsPrivate extends Omit<InvokeOptions, 'context'> {
    context?: AdditionalContextPrivate;
}
export declare interface ImageInfoPrivate {
    caption?: string;
    sourceOrigin?: string;
    url: string;
    mimeType?: string;
}
export declare interface ImageBytesResultPrivate {
    bytes: ArrayBuffer;
    imageInfo: ImageInfoPrivate;
}
export declare class ErrorWithReasonImpl<T extends keyof ErrorReasonTypes> extends Error implements ErrorWithReason<T> {
    reasonType: T;
    reason: ErrorReasonTypes[T];
    constructor(reasonType: T, reason: ErrorReasonTypes[T], message?: string);
}
/** Any ErrorWithReason<T>.reason type. */
export type AnyErrorReasonType = ErrorReasonTypes[keyof ErrorReasonTypes];
/** Any ErrorWithReason type. */
export type AnyErrorWithReasonType = ErrorWithReason<keyof ErrorReasonTypes>;
/** Sent in ResponseMessage to reconstruct the ErrorWithReason. */
export interface ErrorWithReasonDetails {
    reason: AnyErrorReasonType;
    reasonType: keyof ErrorReasonTypes;
}
export interface GlicException extends TransferableException {
    exceptionReason?: ErrorWithReasonDetails;
}
export declare function exceptionFromTransferable(e: GlicException): Error | AnyErrorWithReasonType;
export declare function newTransferableException(e: Error): GlicException;
export declare const ERROR_CODEC: ErrorCodec;
