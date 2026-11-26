import type { ElementHandle } from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare function navigateToLighthouseTab(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, path?: string): Promise<ElementHandle<Element>>;
export type LighthouseAny = any;
/**
 * Instead of watching the worker or controller/panel internals, we wait for the Lighthouse renderer
 * to create the new report DOM. And we pull the LHR and artifacts off the lh-root node.
 **/
export declare function waitForResult(devToolsPage: DevToolsPage, inspectedPage: InspectedPage): Promise<{
    reportEl: ElementHandle<Element>;
    lhr: LighthouseAny;
    artifacts: LighthouseAny;
}>;
/**
 * Set the category checkboxes
 * @param selectedCategoryIds One of 'performance'|'accessibility'|'best-practices'|'seo'|'pwa'
 */
export declare function selectCategories(devToolsPage: DevToolsPage, selectedCategoryIds: string[]): Promise<void>;
export declare function selectRadioOption(devToolsPage: DevToolsPage, value: string, optionName: string): Promise<void>;
export declare function selectMode(devToolsPage: DevToolsPage, mode: 'navigation' | 'timespan' | 'snapshot'): Promise<void>;
export declare function selectDevice(devToolsPage: DevToolsPage, device: 'mobile' | 'desktop'): Promise<void>;
export declare function setToolbarCheckboxWithText(devToolsPage: DevToolsPage, enabled: boolean, textContext: string): Promise<void>;
export declare function setThrottlingMethod(devToolsPage: DevToolsPage, throttlingMethod: 'simulate' | 'devtools'): Promise<void>;
export declare function clickStartButton(devToolsPage: DevToolsPage): Promise<void>;
export declare function isGenerateReportButtonDisabled(devToolsPage: DevToolsPage): Promise<boolean>;
export declare function getHelpText(devToolsPage: DevToolsPage): Promise<string>;
export declare function openStorageView(devToolsPage: DevToolsPage): Promise<void>;
export declare function clearSiteData(devToolsPage: DevToolsPage, inspectedPage: InspectedPage): Promise<void>;
export declare function waitForStorageUsage(p: (quota: number) => boolean, devToolsPage: DevToolsPage): Promise<void>;
export declare function waitForTimespanStarted(devToolsPage: DevToolsPage): Promise<void>;
export declare function endTimespan(devToolsPage: DevToolsPage): Promise<void>;
export declare function getAuditsBreakdown(lhr: LighthouseAny, flakyAudits?: string[]): {
    auditResults: LighthouseAny[];
    erroredAudits: LighthouseAny[];
    failedAudits: LighthouseAny[];
};
export declare function getTargetViewport(inspectedPage: InspectedPage): Promise<{
    innerHeight: number;
    innerWidth: number;
    outerWidth: number;
    outerHeight: number;
    devicePixelRatio: number;
}>;
export declare function getServiceWorkerCount(inspectedPage: InspectedPage): Promise<number>;
export declare function registerServiceWorker(inspectedPage: InspectedPage): Promise<void>;
export declare function interceptNextFileSave(devToolsPage: DevToolsPage): Promise<() => Promise<string>>;
export declare function renderHtmlInIframe(inspectedPage: InspectedPage, html: string): Promise<ElementHandle<Document>>;
