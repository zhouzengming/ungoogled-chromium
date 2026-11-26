import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare function waitForTheCoveragePanelToLoad(devToolsPage: DevToolsPage): Promise<void>;
export declare function navigateToCoverageTestSite(inspectedPage: InspectedPage): Promise<void>;
export declare function startInstrumentingCoverage(devToolsPage: DevToolsPage): Promise<void>;
export declare function stopInstrumentingCoverage(devToolsPage: DevToolsPage): Promise<void>;
export declare function clearCoverageContent(devToolsPage: DevToolsPage): Promise<void>;
export declare function getCoverageData(devToolsPage: DevToolsPage, expectedCount: number): Promise<Array<{
    url: string | undefined;
    total: string | undefined;
    unused: string | undefined;
}>>;
export declare function waitForCoverageData(devToolsPage: DevToolsPage, expectedData: Array<{
    url: string;
    total: string;
    unused: string;
}>): Promise<true>;
