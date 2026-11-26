import type { ClickModifiers } from 'chrome://resources/mojo/ui/base/mojom/window_open_disposition.mojom-webui.js';
import type { Url } from 'chrome://resources/mojo/url/mojom/url.mojom-webui.js';
import type { ReadLaterEntriesByStatus, Window } from './reading_list.mojom-webui.js';
import { PageCallbackRouter } from './reading_list.mojom-webui.js';
export interface ReadingListApiProxy {
    getReadLaterEntries(): Promise<{
        entries: ReadLaterEntriesByStatus;
    }>;
    openUrl(url: Url, clickModifiers: ClickModifiers): void;
    updateReadStatus(url: Url, read: boolean): void;
    markCurrentTabAsRead(): void;
    addCurrentTab(): void;
    removeEntry(url: Url): void;
    showContextMenuForUrl(url: Url, locationX: number, locationY: number): void;
    updateCurrentPageActionButtonState(): void;
    showUi(): void;
    closeUi(): void;
    getWindowData(): Promise<{
        windows: Window[];
    }>;
    getCallbackRouter(): PageCallbackRouter;
}
export declare class ReadingListApiProxyImpl implements ReadingListApiProxy {
    private callbackRouter;
    private handler;
    constructor();
    getReadLaterEntries(): Promise<{
        entries: ReadLaterEntriesByStatus;
    }>;
    openUrl(url: Url, clickModifiers: ClickModifiers): void;
    updateReadStatus(url: Url, read: boolean): void;
    markCurrentTabAsRead(): void;
    addCurrentTab(): void;
    removeEntry(url: Url): void;
    showContextMenuForUrl(url: Url, locationX: number, locationY: number): void;
    updateCurrentPageActionButtonState(): void;
    showUi(): void;
    closeUi(): void;
    getWindowData(): Promise<{
        windows: Window[];
    }>;
    getCallbackRouter(): PageCallbackRouter;
    static getInstance(): ReadingListApiProxy;
    static setInstance(obj: ReadingListApiProxy): void;
}
