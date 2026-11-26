import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function openPanelViaMoreTools(devToolsPage: DevToolsPage, panelTitle: string): Promise<void>;
export declare const openSettingsTab: (devToolsPage: DevToolsPage, tabTitle: string) => Promise<void>;
export declare const closeSettings: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const togglePreferenceInSettingsTab: (devToolsPage: DevToolsPage, label: string, shouldBeChecked?: boolean) => Promise<void>;
export declare const setIgnoreListPattern: (devToolsPage: DevToolsPage, pattern: string) => Promise<void>;
export declare const toggleIgnoreListing: (devToolsPage: DevToolsPage, enable: boolean) => Promise<void>;
