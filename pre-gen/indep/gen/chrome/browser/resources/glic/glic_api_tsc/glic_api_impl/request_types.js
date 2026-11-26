// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { defInterface, defMessage } from './transport/messaging.js';
/*
This file defines messages sent over postMessage in-between the Glic WebUI
and the Glic web client.

Most requests closely match signatures of API methods. Where possible, name
messages by concatenating the interface name with the method name. This helps
readability, and ensures that each name is unique.
*/
export const WebClientHostDef = defInterface({
    name: 'WebClientHost',
    methods: [
        {
            name: 'webClientInitialized',
            request: defMessage(),
        },
        {
            name: 'getModelQualityClientId',
            response: defMessage(),
            histogram: { id: 8 },
        },
        {
            name: 'switchConversation',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 64 },
        },
        {
            name: 'registerConversation',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 65 },
        },
        {
            name: 'getContextFromFocusedTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 9 },
        },
        {
            name: 'getContextFromTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 10 },
        },
        {
            name: 'getImageBytesFromTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 101 },
        },
        {
            name: 'setMaximumNumberOfPinnedTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 12 },
        },
        {
            name: 'activateTab',
            request: defMessage(),
            histogram: { id: 76 },
        },
        {
            name: 'resizeWindow',
            request: defMessage(),
            histogram: { id: 17 },
        },
        {
            name: 'enableDragResize',
            request: defMessage(),
            histogram: { id: 18 },
        },
        {
            name: 'setMinimumWidgetSize',
            request: defMessage(),
            histogram: { id: 20 },
        },
        {
            name: 'setMicrophonePermissionState',
            request: defMessage(),
            histogram: { id: 21 },
        },
        {
            name: 'setLocationPermissionState',
            request: defMessage(),
            histogram: { id: 22 },
        },
        {
            name: 'setTabContextPermissionState',
            request: defMessage(),
            histogram: { id: 23 },
        },
        {
            name: 'setClosedCaptioningSetting',
            request: defMessage(),
            histogram: { id: 56 },
        },
        {
            name: 'setActuationOnWebSetting',
            request: defMessage(),
            histogram: { id: 69 },
        },
        {
            name: 'getUserProfileInfo',
            response: defMessage(),
            histogram: { id: 25 },
        },
        {
            name: 'refreshSignInCookies',
            response: defMessage(),
            histogram: { id: 26 },
        },
        {
            name: 'setAudioDucking',
            request: defMessage(),
            histogram: { id: 29 },
        },
        {
            name: 'onUserInputSubmitted',
            request: defMessage(),
            histogram: { id: 38 },
        },
        {
            name: 'onReaction',
            request: defMessage(),
            histogram: { id: 66 },
        },
        {
            name: 'onOptinImpression',
            histogram: { id: 99 },
        },
        {
            name: 'onContextUploadStarted',
            histogram: { id: 68 },
        },
        {
            name: 'onContextUploadCompleted',
            histogram: { id: 67 },
        },
        {
            name: 'onResponseStarted',
            histogram: { id: 40 },
        },
        {
            name: 'onResponseStopped',
            request: defMessage(),
            histogram: { id: 41 },
        },
        {
            name: 'onSessionTerminated',
            histogram: { id: 42 },
        },
        {
            name: 'onTurnCompleted',
            request: defMessage(),
            histogram: { id: 43 },
        },
        {
            name: 'onResponseRated',
            request: defMessage(),
            histogram: { id: 39 },
        },
        {
            name: 'onClosedCaptionsShown',
            histogram: { id: 59 },
        },
        {
            name: 'onActionSubmitted',
            request: defMessage(),
            histogram: { id: 93 },
        },
        {
            name: 'setSyntheticExperimentState',
            request: defMessage(),
            histogram: { id: 46 },
        },
        {
            name: 'getOsMicrophonePermissionStatus',
            response: defMessage(),
            histogram: { id: 48 },
        },
        {
            name: 'pinTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 49 },
        },
        {
            name: 'unpinTabs',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 50 },
        },
        {
            name: 'unpinAllTabs',
            request: defMessage(),
            histogram: { id: 51 },
        },
        {
            name: 'openPinnedTabPicker',
            request: defMessage(),
            histogram: { id: 104 },
        },
        {
            name: 'deleteCapturedRegion',
            request: defMessage(),
            histogram: { id: 92 },
        },
        {
            name: 'getZeroStateSuggestionsForFocusedTab',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 54 },
        },
        {
            name: 'maybeRefreshUserStatus',
            histogram: { id: 58 },
        },
        {
            name: 'subscribeToPageMetadata',
            request: defMessage(),
            response: defMessage(),
            histogram: { id: 63 },
        },
        {
            name: 'onModeChange',
            request: defMessage(),
            histogram: { id: 70 },
        },
        {
            name: 'setOnboardingCompleted',
            histogram: { id: 80 },
        },
        {
            name: 'subscribeToTabData',
            request: defMessage(),
            histogram: { id: 81 },
        },
        {
            name: 'onMicrophoneStatusChange',
            request: defMessage(),
            histogram: { id: 90 },
        },
        {
            name: 'recordHistogram',
            request: defMessage(),
        },
        {
            name: 'setErrorDialogState',
            request: defMessage(),
        },
        {
            name: 'reportClientTransientError',
            request: defMessage(),
        },
        {
            name: 'processCounterAbuseVerdict',
            request: defMessage(),
            histogram: { id: 100 },
        },
    ],
});
// Types of requests to the GlicWebClient.
export const WebClientDef = defInterface({
    name: 'WebClient',
    methods: [],
});
export const WebClientTabDataObserverDef = defInterface({
    name: 'WebClientTabDataObserver',
    methods: [
        {
            name: 'tabDataChanged',
            request: defMessage(),
        },
    ],
});
// Note: We are migrating API request reporting to C++. This list should be
// trimmed down and fully deleted eventually.
// See chrome/browser/glic/public/glic_api_metrics.h.
export const RECORDED_REQUEST_IDS = {
    // Do not reuse deleted request ID: 1,
    // Do not reuse deleted request ID: 2,
    // Do not reuse deleted request ID: 3,
    // Do not reuse deleted request ID: 4,
    // Do not reuse deleted request ID: 5,
    // Do not reuse deleted request ID: 6,
    // Do not reuse deleted request ID: 7,
    GetModelQualityClientId: 8,
    GetContextFromFocusedTab: 9,
    GetContextFromTab: 10,
    // Do not reuse deleted request ID: 11,
    SetMaximumNumberOfPinnedTabs: 12,
    // Do not reuse deleted request ID: 13,
    // Do not reuse deleted request ID: 14,
    // Do not reuse deleted request ID: 15,
    // Do not reuse deleted request ID: 16,
    ResizeWindow: 17,
    EnableDragResize: 18,
    // Do not reuse deleted request ID: 19,
    SetMinimumWidgetSize: 20,
    SetMicrophonePermissionState: 21,
    SetLocationPermissionState: 22,
    SetTabContextPermissionState: 23,
    // Do not reuse deleted request ID: 24,
    GetUserProfileInfo: 25,
    RefreshSignInCookies: 26,
    // Do not reuse deleted request ID: 27,
    // Do not reuse deleted request ID: 28,
    SetAudioDucking: 29,
    // Do not reuse deleted request ID: 30,
    // Do not reuse deleted request ID: 31,
    // Do not reuse deleted request ID: 32,
    // Do not reuse deleted request ID: 33,
    // Do not reuse deleted request ID: 34,
    // Do not reuse deleted request ID: 35,
    // Do not reuse deleted request ID: 36,
    // Do not reuse deleted request ID: 37,
    OnUserInputSubmitted: 38,
    OnResponseRated: 39,
    OnResponseStarted: 40,
    OnResponseStopped: 41,
    OnSessionTerminated: 42,
    OnTurnCompleted: 43,
    // Do not reuse deleted request ID: 44,
    // Do not reuse deleted request ID: 45,
    SetSyntheticExperimentState: 46,
    // Do not reuse deleted request ID: 47,
    GetOsMicrophonePermissionStatus: 48,
    PinTabs: 49,
    UnpinTabs: 50,
    UnpinAllTabs: 51,
    // Do not reuse deleted request ID: 52,
    // Do not reuse deleted request ID: 53,
    GetZeroStateSuggestionsForFocusedTab: 54,
    // Do not reuse deleted request ID: 55,
    SetClosedCaptioningSetting: 56,
    // Do not reuse deleted request ID: 57,
    MaybeRefreshUserStatus: 58,
    OnClosedCaptionsShown: 59,
    // Do not reuse deleted request ID: 60,
    // Do not reuse deleted request ID: 61,
    // Do not reuse deleted request ID: 62,
    SubscribeToPageMetadata: 63,
    SwitchConversation: 64,
    RegisterConversation: 65,
    OnReaction: 66,
    OnContextUploadCompleted: 67,
    OnContextUploadStarted: 68,
    SetActuationOnWebSetting: 69,
    OnModeChange: 70,
    // Do not reuse deleted request ID: 71,
    // Do not reuse deleted request ID: 72,
    // Do not reuse deleted request ID: 73,
    // Do not reuse deleted request ID: 74,
    // Do not reuse deleted request ID: 75,
    ActivateTab: 76,
    // Do not reuse deleted request ID: 77,
    // Do not reuse deleted request ID: 78,
    SetOnboardingCompleted: 80,
    SubscribeToTabData: 81,
    // Do not reuse deleted request ID: 82,
    // Do not reuse deleted request ID: 83,
    // Do not reuse deleted request ID: 84,
    // Do not reuse deleted request ID: 85,
    // Do not reuse deleted request ID: 86,
    // Do not reuse deleted request ID: 87,
    // Do not reuse deleted request ID: 88,
    // Do not reuse deleted request ID: 89,
    OnMicrophoneStatusChange: 90,
    // Do not reuse deleted request ID: 91,
    DeleteCapturedRegion: 92,
    OnActionSubmitted: 93,
    // Do not reuse deleted request ID: 94,
    // Do not reuse deleted request ID: 95,
    // Do not reuse deleted request ID: 96,
    // Do not reuse deleted request ID: 97,
    // Do not reuse deleted request ID: 98,
    OnOptinImpression: 99,
    ProcessCounterAbuseVerdict: 100,
    GetImageBytesFromTab: 101,
    // Do not reuse deleted request ID: 102,
    // Do not reuse deleted request ID: 103,
    OpenPinnedTabPicker: 104,
    // Do not reuse deleted request ID: 105,
};
export const MAX_REQUEST_ID = Math.max(...Object.values(RECORDED_REQUEST_IDS));
export function getHostRequestHistogramInfo(requestType, interfaceDef) {
    if (!interfaceDef) {
        return undefined;
    }
    const method = interfaceDef.methodMap?.get(requestType);
    if (!method || !method.histogram) {
        return undefined;
    }
    const name = method.histogram.name ??
        (requestType.charAt(0).toUpperCase() + requestType.slice(1));
    return {
        name,
        id: method.histogram.id,
    };
}
export var ImageAlphaType;
(function (ImageAlphaType) {
    // RGB values are unmodified.
    ImageAlphaType[ImageAlphaType["UNPREMUL"] = 0] = "UNPREMUL";
    // RGB values have been premultiplied by alpha.
    ImageAlphaType[ImageAlphaType["PREMUL"] = 1] = "PREMUL";
})(ImageAlphaType || (ImageAlphaType = {}));
// Chromium currently only uses a single color type for BitmapN32.
export var ImageColorType;
(function (ImageColorType) {
    ImageColorType[ImageColorType["BGRA"] = 0] = "BGRA";
    ImageColorType[ImageColorType["RGBA"] = 1] = "RGBA";
})(ImageColorType || (ImageColorType = {}));
export class ErrorWithReasonImpl extends Error {
    reasonType;
    reason;
    constructor(reasonType, reason, message) {
        super(message ?? `${reasonType} Error: ${reason}`);
        this.reasonType = reasonType;
        this.reason = reason;
    }
}
// Constructs an exception from a TransferableException.
export function exceptionFromTransferable(e) {
    // Error types are serializable, but they do not serialize all members.
    // If exceptionReason is provided, we use it to reconstruct a
    // ErrorWithReason by just setting additional fields after
    // serialization.
    if (e.exceptionReason !== undefined) {
        const withReason = e.exception;
        withReason.reason = e.exceptionReason.reason;
        withReason.reasonType = e.exceptionReason.reasonType;
    }
    return e.exception;
}
// Transform an Error into a TransferableException.
export function newTransferableException(e) {
    let exceptionReason = undefined;
    const maybeWithReason = e;
    if (maybeWithReason.reasonType !== undefined &&
        maybeWithReason.reason !== undefined) {
        exceptionReason = {
            reason: maybeWithReason.reason,
            reasonType: maybeWithReason.reasonType,
        };
    }
    return { exception: e, exceptionReason };
}
export const ERROR_CODEC = {
    serialize: newTransferableException,
    deserialize: exceptionFromTransferable,
};
