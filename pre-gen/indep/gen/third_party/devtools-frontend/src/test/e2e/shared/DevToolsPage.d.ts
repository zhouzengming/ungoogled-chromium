import type * as puppeteer from 'puppeteer-core';
import type * as Root from '../../../front_end/core/root/root.js';
import type { InspectedPage } from './InspectedPage.js';
import { type DeducedElementType, PageWrapper } from './PageWrapper.js';
interface DevToolsReloadParams {
    canDock?: boolean;
    panel?: string;
}
export declare class DevToolsPage extends PageWrapper {
    #private;
    screenshotLog: Record<string, string>;
    delayPromisesIfRequired(): Promise<void>;
    throttleCPUIfRequired(): Promise<void>;
    reload(options?: puppeteer.WaitForOptions): Promise<void>;
    /**
     * Use the Runtime.setQueryParamForTesting to mock the parameter before
     * DevTools is loaded.
     *
     * Important information for the implementation:
     * Trying to change the url and then reload or navigate to the new one will
     * hit this check in the back end:
     * https://crsrc.org/c/chrome/browser/devtools/devtools_ui_bindings.cc;l=406?q=devtools_ui_b&ss=chromium
     *
     * @param panel Mocks DevTools URL search params to make it open a specific panel on load.
     * @param canDock Mocks DevTools URL search params to make it think whether it can dock or not.
     * This does not control whether or not the panel can actually dock or not.
     * @param persistReloads If this is true running {@link DevToolsPage.reload} will reloading with
     * the provided options
     */
    reloadWithParams({ panel, canDock }: DevToolsReloadParams, persistReloads?: boolean): Promise<void>;
    ensureReadyForTesting(): Promise<void>;
    useSoftMenu(): Promise<void>;
    $<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, root?: puppeteer.ElementHandle, handler?: string): Promise<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>> | null>;
    /**
     * @deprecated This method is not able to recover from unstable DOM. Use hover(selector) instead.
     */
    hoverElement(element: puppeteer.ElementHandle): Promise<void>;
    debuggerStatement(): Promise<void>;
    clickMoreTabsButton(root?: puppeteer.ElementHandle<Element>): Promise<void>;
    closePanelTab(panelTabSelector: string): Promise<void>;
    closeAllCloseableTabs(): Promise<void>;
    enableCDPLogging(): Promise<void>;
    enableCDPTracking(): Promise<void>;
    logOutstandingCDP(): Promise<void>;
    installEventListener(eventType: string): Promise<void>;
    getPendingEvents(eventType: string): Promise<Event[] | undefined>;
    renderCoordinatorQueueEmpty(): Promise<void>;
    summonSearchBox(): Promise<void>;
    readClipboard(): Promise<string>;
    setupOverridesFSMocks(): Promise<void>;
    setupMockHostConfigAndReload(hostConfig: Root.Runtime.HostConfig, aidaOverride?: string): Promise<string>;
    disableAnimations(): Promise<void>;
    enableAnimations(): Promise<void>;
    captureScreenshot(name?: string): Promise<void>;
    /**
     * A helper that takes heap snapshots of the DevTools page that can be used to
     * detect memory leaks. The snapshots are stored in out/<OutDir>.
     *
     * Usage:
     *
     * ```
     *   ... prepare test state ...
     *   await devToolsPsage.captureHeapSnapshot();
     *   ... perform actions that trigger the leak ...
     *   await devToolsPsage.captureHeapSnapshot();
     * ```
     *
     * Now `out/<OutDir>/heap-snapshot-0.heapsnapshot` and
     * `out/<OutDir>/heap-snapshot-1.heapsnapshot` are two snapshots that can be
     * compared in the Memory panel of DevTools.
     */
    captureHeapSnapshot(snapshotName?: string): Promise<void>;
    setAiAssistanceStructuredLogEnabled(): Promise<void>;
}
export interface DevtoolsSettings {
    enabledDevToolsExperiments: string[];
    disabledDevToolsExperiments: string[];
    devToolsSettings: Record<string, unknown>;
    /**
     * Defined in front_end/ui/legacy/DockController.ts DockState
     */
    dockingMode: 'bottom' | 'right' | 'left' | 'undocked';
    /**
     * The name of the panel to be loaded initially
     * This persist after {@link DevToolsPage.reload}
     *
     * To reload into a panel use {@link DevToolsPage.reloadWithParams}
     */
    panel?: string;
}
export declare const DEFAULT_DEVTOOLS_SETTINGS: DevtoolsSettings;
export declare function setupDevToolsPage(inspectedPage: InspectedPage, settings: DevtoolsSettings): Promise<DevToolsPage>;
export {};
