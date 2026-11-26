import type { AccessPoint, PageHandlerRemote } from 'chrome://resources/cr_components/history/history.mojom-webui.js';
import { PageCallbackRouter } from 'chrome://resources/cr_components/history/history.mojom-webui.js';
import type { HistoryIdentityState } from './externs.js';
export type RemoveVisitsRequest = Array<{
    url: string;
    timestamps: number[];
}>;
export interface BrowserProxy {
    handler: PageHandlerRemote;
    callbackRouter: PageCallbackRouter;
    recordHistogram(histogram: string, value: number, max: number): void;
    recordBooleanHistogram(histogram: string, value: boolean): void;
    recordAction(action: string): void;
    recordTime(histogram: string, time: number): void;
    recordLongTime(histogram: string, time: number): void;
    recordSigninPendingOffered(accessPoint: AccessPoint): void;
    navigateToUrl(url: string, target: string, e: MouseEvent): void;
    otherDevicesInitialized(): void;
    getInitialIdentityState(): Promise<HistoryIdentityState>;
    startTurnOnSyncFlow(): void;
}
export declare class BrowserProxyImpl implements BrowserProxy {
    handler: PageHandlerRemote;
    callbackRouter: PageCallbackRouter;
    constructor();
    recordHistogram(histogram: string, value: number, max: number): void;
    recordBooleanHistogram(histogram: string, value: boolean): void;
    recordAction(action: string): void;
    recordTime(histogram: string, time: number): void;
    recordLongTime(histogram: string, time: number): void;
    recordSigninPendingOffered(accessPoint: AccessPoint): void;
    navigateToUrl(url: string, target: string, e: MouseEvent): void;
    otherDevicesInitialized(): void;
    getInitialIdentityState(): Promise<HistoryIdentityState>;
    startTurnOnSyncFlow(): void;
    static getInstance(): BrowserProxy;
    static setInstance(obj: BrowserProxy): void;
}
