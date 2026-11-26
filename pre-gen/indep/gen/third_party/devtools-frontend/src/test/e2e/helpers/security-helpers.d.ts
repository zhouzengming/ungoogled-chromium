import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function securityTabExists(devToolsPage: DevToolsPage): Promise<void>;
export declare function securityTabDoesNotExist(devToolsPage: DevToolsPage): Promise<void>;
export declare function securityPanelContentIsLoaded(devToolsPage: DevToolsPage): Promise<void>;
export declare function navigateToSecurityTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function closeSecurityTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function openSecurityPanelFromMoreTools(devToolsPage: DevToolsPage): Promise<void>;
export declare function openSecurityPanelFromCommandMenu(devToolsPage: DevToolsPage): Promise<void>;
export declare function veImpressionForSecurityPanel(): {
    impressions: string[];
};
