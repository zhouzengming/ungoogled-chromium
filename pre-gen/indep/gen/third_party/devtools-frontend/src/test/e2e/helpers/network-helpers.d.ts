import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare function waitForNetworkTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function openNetworkTab(devToolsPage: DevToolsPage): Promise<void>;
/**
 * Select the Network tab in DevTools
 */
export declare function navigateToNetworkTab(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, testName: string): Promise<void>;
/**
 * Wait until a certain number of requests are shown in the request list.
 * @param numberOfRequests The expected number of requests to wait for.
 * @param selector Optional. The selector to use to get the list of requests.
 */
export declare function waitForSomeRequestsToAppear(devToolsPage: DevToolsPage, numberOfRequests: number): Promise<void>;
export declare function getAllRequestNames(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function getNumberOfRequests(devToolsPage: DevToolsPage): Promise<number>;
export declare function getSelectedRequestName(devToolsPage: DevToolsPage): Promise<string | null>;
export declare function selectRequestByName(devToolsPage: DevToolsPage, name: string, clickOptions?: puppeteer.ClickOptions): Promise<void>;
export declare function waitForSelectedRequestChange(devToolsPage: DevToolsPage, initialSelected: string | null): Promise<string>;
export declare function setKeepLog(devToolsPage: DevToolsPage, enable: boolean): Promise<void>;
export declare function setCacheDisabled(devToolsPage: DevToolsPage, enable: boolean): Promise<void>;
export declare function setInvert(devToolsPage: DevToolsPage, invert: boolean): Promise<void>;
export declare function setTimeWindow(devToolsPage: DevToolsPage): Promise<void>;
export declare function clearTimeWindow(devToolsPage: DevToolsPage): Promise<void>;
export declare function setTextFilter(devToolsPage: DevToolsPage, text: string): Promise<void>;
export declare function getTextFilterContent(devToolsPage: DevToolsPage): Promise<string>;
export declare function clearTextFilter(devToolsPage: DevToolsPage): Promise<void>;
export declare function getTextFromHeadersRow(devToolsPage: DevToolsPage, row: puppeteer.ElementHandle<Element>): Promise<string[]>;
export declare function elementContainsTextWithSelector(element: puppeteer.ElementHandle<Element>, textContent: string, selector: string): Promise<boolean>;
export declare function veImpressionForNetworkPanel(options?: {
    newFilterBar?: boolean;
}): {
    impressions: string[];
};
export declare function clickInfobarButton(devToolsPage: DevToolsPage): Promise<void>;
