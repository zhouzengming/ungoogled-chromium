import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare const FILTER_TEXTBOX_SELECTOR = "[aria-label=\"Filter\"]";
export declare const CLEAR_BUTTON_SELECTOR = "[aria-label=\"Clear\"]";
export declare const RECORD_BUTTON_SELECTOR = "[aria-label=\"Record\"]";
export declare const RELOAD_AND_RECORD_BUTTON_SELECTOR = "[aria-label=\"Record and reload\"]";
export declare const STOP_BUTTON_SELECTOR = "[aria-label=\"Stop\"]";
export declare const SUMMARY_TAB_SELECTOR = "[aria-label=\"Summary\"]";
export declare const BOTTOM_UP_SELECTOR = "[aria-label=\"Bottom-up\"]";
export declare const CALL_TREE_SELECTOR = "[aria-label=\"Call tree\"]";
export declare const ACTIVITY_COLUMN_SELECTOR = ".activity-column.disclosure";
export declare const TOTAL_TIME_SELECTOR = "div:nth-child(1) > div.vbox.timeline-details-chip-body > div:nth-child(1) > div.timeline-details-view-row-value";
export declare function navigateToPerformanceTab(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, testResource?: string): Promise<void>;
export declare function openCaptureSettings(devToolsPage: DevToolsPage, sectionClassName: string): Promise<void>;
export declare function searchForComponent(devToolsPage: DevToolsPage, searchEntry: string): Promise<void>;
export declare function navigateToBottomUpTab(devToolsPage: DevToolsPage, veLinkContext: string): Promise<void>;
export declare function navigateToCallTreeTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function setFilter(devToolsPage: DevToolsPage, filter: string): Promise<void>;
export declare function toggleCaseSensitive(devToolsPage: DevToolsPage): Promise<void>;
export declare function toggleRegExButtonBottomUp(devToolsPage: DevToolsPage): Promise<void>;
export declare function toggleMatchWholeWordButtonBottomUp(devToolsPage: DevToolsPage): Promise<void>;
export declare function startRecording(devToolsPage: DevToolsPage): Promise<void>;
/**
 * Increases the timeout for the tests in the given context.
 * Useful for performance as tests that import or record a trace often get over the default timeout on slower bots.
 * Note that in e2e this can only be used on a `describe`, not an
 * `it`, hence why the type of the argument is `Mocha.Suite`
 */
export declare function increaseTimeoutForPerfPanel(context: Mocha.Suite): void;
/**
 * @param checkHasActiveTrace Usually this only required for enhanced traces
 */
export declare function loadTraceAndWaitToFullyRender(devToolsPage: DevToolsPage, initiateTraceLoadCb: () => Promise<unknown>, checkHasActiveTrace?: boolean): Promise<number>;
export declare function reloadAndRecord(devToolsPage: DevToolsPage): Promise<void>;
export declare function stopRecording(devToolsPage: DevToolsPage): Promise<void>;
export declare function getTotalTimeFromSummary(devToolsPage: DevToolsPage): Promise<number>;
export declare function getTotalTimeFromPie(devToolsPage: DevToolsPage): Promise<number>;
export declare function retrieveSelectedAndExpandedActivityItems(frontend: puppeteer.Page): Promise<string[]>;
export declare function navigateToSelectorStatsTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function selectRecalculateStylesEvent(devToolsPage: DevToolsPage): Promise<boolean>;
export declare function enableCSSSelectorStats(devToolsPage: DevToolsPage): Promise<void>;
export declare function veImpressionForPerformancePanel(): {
    impressions: string[];
};
export declare function uploadTraceFile(devToolsPage: DevToolsPage, tracePath: string): Promise<number>;
