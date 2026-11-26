import { mojo } from '//resources/mojo/mojo/public/js/bindings.js';
export declare const TabAlertStateSpec: {
    $: mojo.internal.MojomType;
};
export declare enum TabAlertState {
    MIN_VALUE = 0,
    MAX_VALUE = 18,
    kNone = 0,
    kAudioMuting = 1,
    kAudioRecording = 2,
    kAudioPlaying = 3,
    kBluetoothConnected = 4,
    kBluetoothScanActive = 5,
    kDesktopCapturing = 6,
    kActorAccessing = 7,
    kActorWaitingOnUser = 8,
    kGlicAccessing = 9,
    kGlicSharing = 10,
    kHidConnected = 11,
    kMediaRecording = 12,
    kPipPlaying = 13,
    kSerialConnected = 14,
    kTabCapturing = 15,
    kUsbConnected = 16,
    kVideoRecording = 17,
    kVrPresentingInHeadset = 18
}
export declare const TabNetworkStateSpec: {
    $: mojo.internal.MojomType;
};
export declare enum TabNetworkState {
    MIN_VALUE = 0,
    MAX_VALUE = 3,
    kNone = 0,
    kWaiting = 1,
    kLoading = 2,
    kError = 3
}
