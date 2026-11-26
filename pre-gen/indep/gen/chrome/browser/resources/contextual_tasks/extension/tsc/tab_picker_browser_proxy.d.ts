import type { TabInfo } from 'chrome://resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
export interface TabPickerBrowserProxy {
    getRecentTabs(): Promise<{
        tabs: TabInfo[];
    }>;
    getPluralString(messageName: string, count: number): Promise<string>;
    addTabContext(tabId: number): void;
    deleteTabContext(tabId: number): void;
}
export declare class TabPickerBrowserProxyImpl implements TabPickerBrowserProxy {
    getRecentTabs(): Promise<{
        tabs: TabInfo[];
    }>;
    getPluralString(messageName: string, count: number): Promise<string>;
    addTabContext(tabId: number): void;
    deleteTabContext(tabId: number): void;
    static getInstance(): TabPickerBrowserProxy;
    static setInstance(newInstance: TabPickerBrowserProxy): void;
}
