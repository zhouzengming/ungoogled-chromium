import type { ElementHandle } from 'puppeteer-core';
import type { UserFlow } from '../../../front_end/panels/recorder/models/Schema.js';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare function record(devToolsPage: DevToolsPage, inspectedPage: InspectedPage): Promise<void>;
export declare function getRecordingPanel(devToolsPage: DevToolsPage): Promise<ElementHandle<Element>>;
export declare function onRecordingStateChanged(devToolsPage: DevToolsPage): Promise<UserFlow>;
export declare function onRecorderAttachedToTarget(devToolsPage: DevToolsPage): Promise<unknown>;
export declare function onReplayFinished(devToolsPage: DevToolsPage): Promise<unknown>;
export declare function enableUntrustedEventMode(devToolsPage: DevToolsPage): Promise<void>;
export declare function enableAndOpenRecorderPanel(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path: string): Promise<void>;
export declare function createAndStartRecording(devToolsPage: DevToolsPage, name?: string, selectorAttribute?: string): Promise<void>;
export declare function changeNetworkConditions(devToolsPage: DevToolsPage, condition: string): Promise<void>;
export declare function openRecorderPanel(devToolsPage: DevToolsPage): Promise<void>;
interface StartRecordingOptions {
    networkCondition?: string;
    untrustedEvents?: boolean;
    selectorAttribute?: string;
}
export declare function startRecording(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path: string, options?: StartRecordingOptions): Promise<void>;
export declare function stopRecording(devToolsPage: DevToolsPage): Promise<UserFlow>;
interface RecordingSnapshotOptions {
    /**
     * Whether to keep the offsets for recording or not.
     *
     * @default false
     */
    offsets?: boolean;
    /**
     * @default true
     */
    expectCommon?: boolean;
    resource?: string;
}
export declare const processAndVerifyBaseRecording: (recording: unknown, options?: RecordingSnapshotOptions) => any;
export declare function clickSelectButtonItem(devToolsPage: DevToolsPage, itemLabel: string, root: string): Promise<void>;
export declare function setupRecorderWithScript(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, script: UserFlow, path?: string): Promise<void>;
export declare function setupRecorderWithScriptAndReplay(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, script: UserFlow, path?: string): Promise<void>;
export declare function getCurrentRecording(devToolsPage: DevToolsPage): Promise<UserFlow>;
export declare function startOrStopRecordingShortcut(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, execute?: 'inspectedPage' | 'devToolsPage'): Promise<UserFlow>;
export declare function fillCreateRecordingForm(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path: string): Promise<void>;
export declare function startRecordingViaShortcut(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path: string): Promise<void>;
export declare function replayShortcut(devToolsPage: DevToolsPage): Promise<void>;
export declare function toggleCodeView(devToolsPage: DevToolsPage): Promise<void>;
export {};
