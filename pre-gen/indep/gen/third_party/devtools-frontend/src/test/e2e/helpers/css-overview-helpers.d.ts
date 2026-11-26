import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function cssOverviewTabDoesNotExist(devToolsPage: DevToolsPage): Promise<void>;
export declare function navigateToCssOverviewTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function openCSSOverviewPanelFromMoreTools(devToolsPage: DevToolsPage): Promise<void>;
export declare function cssOverviewTabExists(devToolsPage: DevToolsPage): Promise<void>;
export declare function cssOverviewPanelContentIsLoaded(devToolsPage: DevToolsPage): Promise<void>;
export declare function startCaptureCSSOverview(devToolsPage: DevToolsPage): Promise<void>;
