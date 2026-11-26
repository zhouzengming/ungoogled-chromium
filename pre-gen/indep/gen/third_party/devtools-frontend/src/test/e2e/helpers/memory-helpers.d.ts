import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare const MEMORY_TAB_ID = "#tab-heap-profiler";
export declare const SELECTED_RESULT = "#profile-views table.data tr.data-grid-data-grid-node.revealed.parent.selected";
export declare function navigateToMemoryTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function takeDetachedElementsProfile(devToolsPage: DevToolsPage): Promise<void>;
export declare function takeAllocationProfile(devToolsPage: DevToolsPage): Promise<void>;
export declare function takeAllocationTimelineProfile(devToolsPage: DevToolsPage, { recordStacks }?: {
    recordStacks: boolean;
}): Promise<void>;
export declare function takeHeapSnapshot(devToolsPage: DevToolsPage, name?: string): Promise<void>;
export declare function waitForHeapSnapshotData(devToolsPage: DevToolsPage): Promise<Array<puppeteer.ElementHandle<Element>>>;
export declare function waitForNonEmptyHeapSnapshotData(devToolsPage: DevToolsPage): Promise<void>;
export declare function getDataGridRows(devToolsPage: DevToolsPage, selector: string): Promise<Array<puppeteer.ElementHandle<Element>>>;
export declare function setClassFilter(devToolsPage: DevToolsPage, text: string): Promise<void>;
export declare function setSearchFilter(devToolsPage: DevToolsPage, text: string): Promise<void>;
export declare function waitForSearchResultNumber(devToolsPage: DevToolsPage, results: number): Promise<puppeteer.ElementHandle<Element>>;
export declare function waitForSelectedRowWithText(devToolsPage: DevToolsPage, text: string): Promise<puppeteer.ElementHandle<Element>>;
/**
 *
 * @param searchResult
 * @param searchMatch Leave undefined if you want to go over all instances
 * @param devToolsPage
 */
export declare function findSearchResult(devToolsPage: DevToolsPage, searchResult: string, searchMatch?: string | RegExp): Promise<void>;
interface RetainerChainEntry {
    propertyName: string;
    retainerClassName: string;
}
export declare function checkRetainerChainSatisfies(devToolsPage: DevToolsPage, p: (retainerChain: RetainerChainEntry[]) => boolean): Promise<boolean>;
export declare function waitUntilRetainerChainSatisfies(devToolsPage: DevToolsPage, p: (retainerChain: RetainerChainEntry[]) => boolean): Promise<void>;
export declare function appearsInOrder(targetArray: string[], inputArray: string[]): boolean;
export declare function waitForRetainerChain(devToolsPage: DevToolsPage, expectedRetainers: string[]): Promise<void>;
export declare function changeViewViaDropdown(devToolsPage: DevToolsPage, newPerspective: string): Promise<void>;
export declare function changeAllocationSampleViewViaDropdown(devToolsPage: DevToolsPage, newPerspective: string): Promise<void>;
export declare function focusTableRowWithName(devToolsPage: DevToolsPage, text: string): Promise<void>;
export declare function focusTableRow(devToolsPage: DevToolsPage, row: puppeteer.ElementHandle<Element>): Promise<void>;
export declare function expandFocusedRow(devToolsPage: DevToolsPage): Promise<void>;
export declare function getSizesFromSelectedRow(devToolsPage: DevToolsPage): Promise<{
    shallowSize: number;
    retainedSize: number;
}>;
export declare function getCategoryRow(devToolsPage: DevToolsPage, text: string, wait?: true): ReturnType<DevToolsPage['waitFor']>;
export declare function getCategoryRow(devToolsPage: DevToolsPage, text: string, wait: false): ReturnType<DevToolsPage['$']>;
export declare function getSizesFromCategoryRow(devToolsPage: DevToolsPage, text: string): Promise<{
    shallowSize: number;
    retainedSize: number;
}>;
export declare function getDistanceFromCategoryRow(devToolsPage: DevToolsPage, text: string): Promise<number>;
export declare function getCountFromCategoryRowWithName(devToolsPage: DevToolsPage, text: string): Promise<number>;
export declare function getCountFromCategoryRow(devToolsPage: DevToolsPage, row: puppeteer.ElementHandle<Element>): Promise<number>;
export declare function getAddedCountFromComparisonRowWithName(devToolsPage: DevToolsPage, text: string): Promise<number>;
export declare function getAddedCountFromComparisonRow(devToolsPage: DevToolsPage, row: puppeteer.ElementHandle<Element>): Promise<number>;
export declare function getRemovedCountFromComparisonRow(devToolsPage: DevToolsPage, row: puppeteer.ElementHandle<Element>): Promise<number>;
export declare function clickOnContextMenuForRetainer(devToolsPage: DevToolsPage, retainerName: string, menuItem: string): Promise<void>;
export declare function restoreIgnoredRetainers(devToolsPage: DevToolsPage): Promise<void>;
export declare function setFilterDropdown(devToolsPage: DevToolsPage, filter: string): Promise<void>;
export {};
