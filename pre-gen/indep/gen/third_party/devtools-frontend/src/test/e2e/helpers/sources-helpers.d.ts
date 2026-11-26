import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare const ACTIVE_LINE = ".CodeMirror-activeline > pre > span";
export declare const PAUSE_BUTTON = "[aria-label=\"Pause script execution\"]";
export declare const RESUME_BUTTON = "[aria-label=\"Resume script execution\"]";
export declare const SOURCES_LINES_SELECTOR = ".CodeMirror-code > div";
export declare const PAUSE_INDICATOR_SELECTOR = ".paused-status";
export declare const CODE_LINE_COLUMN_SELECTOR = ".cm-lineNumbers";
export declare const CODE_LINE_SELECTOR = ".cm-lineNumbers .cm-gutterElement";
export declare const SCOPE_LOCAL_VALUES_SELECTOR = "li[aria-label=\"Local\"] + ol";
export declare const THREADS_SELECTOR = "[aria-label=\"Threads\"]";
export declare const SELECTED_THREAD_SELECTOR = ".thread-item[aria-selected=\"true\"] > div.thread-item-title";
export declare const STEP_INTO_BUTTON = "[aria-label=\"Step into next function call\"]";
export declare const STEP_OVER_BUTTON = "[aria-label=\"Step over next function call\"]";
export declare const STEP_OUT_BUTTON = "[aria-label=\"Step out of current function\"]";
export declare const TURNED_ON_PAUSE_BUTTON_SELECTOR = "button.toolbar-state-on";
export declare const DEBUGGER_PAUSED_EVENT = "DevTools.DebuggerPaused";
export declare const OVERRIDES_TAB_SELECTOR = "[aria-label=\"Overrides\"]";
export declare const ENABLE_OVERRIDES_SELECTOR = "[aria-label=\"Select folder for overrides\"]";
export declare const PAUSE_ON_UNCAUGHT_EXCEPTION_SELECTOR = ".pause-on-uncaught-exceptions";
export declare const BREAKPOINT_ITEM_SELECTOR = ".breakpoint-item";
export declare function getLineNumberElement(devToolsPage: DevToolsPage, lineNumber: number | string): Promise<puppeteer.ElementHandle<Element>>;
export declare function doubleClickSourceTreeItem(devToolsPage: DevToolsPage, selector: string): Promise<void>;
export declare function waitForSourcesPanel(devToolsPage: DevToolsPage): Promise<void>;
export declare function openSourcesPanel(devToolsPage: DevToolsPage): Promise<puppeteer.ElementHandle<Element>>;
export declare function openFileInSourcesPanel(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, testInput: string): Promise<void>;
export declare function openSnippetsSubPane(devToolsPage: DevToolsPage): Promise<void>;
/**
 * Creates a new snippet, optionally pre-filling it with the provided content.
 * `snippetName` must not contain spaces or special characters, otherwise
 * `createNewSnippet` will time out.
 * DevTools uses the escaped snippet name for the ARIA label. `createNewSnippet`
 * doesn't mirror the escaping so it won't be able to wait for the snippet
 * entry in the navigation tree to appear.
 */
export declare function createNewSnippet(devToolsPage: DevToolsPage, snippetName: string, content?: string): Promise<void>;
export declare function openOverridesSubPane(devToolsPage: DevToolsPage): Promise<void>;
export declare function openFileInEditor(devToolsPage: DevToolsPage, sourceFile: string): Promise<void>;
export declare function openSourceCodeEditorForFile(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, sourceFile: string, testInput: string): Promise<void>;
export declare function getBreakpointHitLocation(devToolsPage: DevToolsPage): Promise<string>;
export declare function getOpenSources(devToolsPage: DevToolsPage): Promise<Array<string | null>>;
export declare function waitForHighlightedLine(devToolsPage: DevToolsPage, lineNumber: number): Promise<void>;
export declare function getToolbarText(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function addBreakpointForLine(devToolsPage: DevToolsPage, index: number | string): Promise<void>;
export declare function removeBreakpointForLine(devToolsPage: DevToolsPage, index: number | string): Promise<void>;
export declare function addLogpointForLine(devToolsPage: DevToolsPage, index: number, condition: string): Promise<void>;
export declare function isBreakpointSet(devToolsPage: DevToolsPage, lineNumber: number | string): Promise<boolean>;
/**
 * @param lineNumber 1-based line number
 * @param index 1-based index of the inline breakpoint in the given line
 */
export declare function enableInlineBreakpointForLine(devToolsPage: DevToolsPage, line: number, index: number): Promise<void>;
/**
 * @param lineNumber 1-based line number
 * @param index 1-based index of the inline breakpoint in the given line
 * @param expectNoBreakpoint If we should wait for the line to not have any inline breakpoints after
 *                           the click instead of a disabled one.
 */
export declare function disableInlineBreakpointForLine(devToolsPage: DevToolsPage, line: number, index: number, expectNoBreakpoint?: boolean): Promise<void>;
export declare function checkBreakpointDidNotActivate(devToolsPage: DevToolsPage): Promise<void>;
export declare function getBreakpointDecorators(devToolsPage: DevToolsPage, disabledOnly?: boolean, expected?: number): Promise<number[]>;
export declare function getNonBreakableLines(devToolsPage: DevToolsPage): Promise<number[]>;
export declare function executionLineHighlighted(devToolsPage: DevToolsPage): Promise<puppeteer.ElementHandle<Element>>;
export declare function getCallFrameNames(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function getCallFrameLocations(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function switchToCallFrame(devToolsPage: DevToolsPage, index: number): Promise<void>;
export declare function retrieveTopCallFrameScriptLocation(devToolsPage: DevToolsPage, target: puppeteer.Page | InspectedPage, script: string): Promise<string>;
export declare function retrieveTopCallFrameWithoutResuming(devToolsPage: DevToolsPage): Promise<string>;
export declare function waitForStackTopMatch(devToolsPage: DevToolsPage, matcher: RegExp): Promise<string>;
export declare function waitForNewLocation(devToolsPage: DevToolsPage, oldLocation: string): Promise<string>;
export declare function setEventListenerBreakpoint(devToolsPage: DevToolsPage, groupName: string, eventName: string): Promise<void>;
declare global {
    interface Window {
        __sourceFileEvents: Map<number, {
            files: string[];
            handler: (e: Event) => void;
        }>;
    }
}
export declare const enum SourceFileEvents {
    SOURCE_FILE_LOADED = "source-file-loaded",
    ADDED_TO_SOURCE_TREE = "source-tree-file-added"
}
export declare function waitForSourceFiles<T>(devToolsPage: DevToolsPage, eventName: SourceFileEvents, waitCondition: (files: string[]) => boolean | Promise<boolean>, action?: () => T): Promise<T>;
export declare function captureAddedSourceFiles(devToolsPage: DevToolsPage, count: number, action?: () => Promise<void>): Promise<string[]>;
export declare function reloadPageAndWaitForSourceFile(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, sourceFile?: string): Promise<void>;
export declare function isEqualOrAbbreviation(abbreviated: string, full: string): boolean;
/** Helpers for navigating the file tree. **/
export interface NestedFileSelector {
    rootSelector: string;
    domainSelector: string;
    folderSelector?: string;
    fileSelector: string;
}
export declare function createSelectorsForWorkerFile(inspectedPage: InspectedPage, workerName: string, folderName: string, fileName: string, workerIndex?: number): NestedFileSelector;
export declare function expandSourceTreeItem(devToolsPage: DevToolsPage, selector: string): Promise<void>;
export declare function expandFileTree(devToolsPage: DevToolsPage, selectors: NestedFileSelector): Promise<puppeteer.ElementHandle<Element>>;
export declare function readSourcesTreeView(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function readIgnoreListedSources(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function stepThroughTheCode(devToolsPage: DevToolsPage, checkLineChange?: boolean): Promise<void>;
export declare function stepIn(devToolsPage: DevToolsPage, checkLineChange?: boolean): Promise<void>;
export declare function stepOver(devToolsPage: DevToolsPage, checkLineChange?: boolean): Promise<void>;
export declare function stepOut(devToolsPage: DevToolsPage, checkLineChange?: boolean): Promise<void>;
export declare function openNestedWorkerFile(devToolsPage: DevToolsPage, selectors: NestedFileSelector): Promise<void>;
export declare function inspectMemory(devToolsPage: DevToolsPage, variableName: string): Promise<void>;
export declare function getScopeNames(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function getValuesForScope(devToolsPage: DevToolsPage, scope: string, expandCount: number, waitForNoOfValues: number): Promise<string[]>;
export declare function waitValuesForScope(devToolsPage: DevToolsPage, scope: string, expandCount: number, expectedValues: string[]): Promise<string[]>;
export declare function getPausedMessages(devToolsPage: DevToolsPage): Promise<{
    statusMain: string;
    statusSub: string;
}>;
export declare function getWatchExpressionsValues(devToolsPage: DevToolsPage): Promise<string[] | null>;
export declare function runSnippet(devToolsPage: DevToolsPage): Promise<void>;
export declare function evaluateSelectedTextInConsole(devToolsPage: DevToolsPage): Promise<void>;
export declare function addSelectedTextToWatches(devToolsPage: DevToolsPage): Promise<void>;
export declare function enableLocalOverrides(devToolsPage: DevToolsPage): Promise<void>;
export interface LabelMapping {
    label: string;
    moduleOffset: number;
    bytecode: number;
    sourceLine: number;
    labelLine: number;
    labelColumn: number;
}
export declare class WasmLocationLabels {
    #private;
    constructor(source: string, wasm: string, mappings: Map<string, LabelMapping[]>, devToolsPage: DevToolsPage, inspectedPage: InspectedPage);
    static load(source: string, wasm: string, devToolsPage: DevToolsPage, inspectedPage: InspectedPage): WasmLocationLabels;
    checkLocationForLabel(label: string): Promise<LabelMapping>;
    addBreakpointsForLabelInSource(label: string): Promise<void>;
    addBreakpointsForLabelInWasm(label: string): Promise<void>;
    setBreakpointInSourceAndRun(label: string, script: string): Promise<void>;
    setBreakpointInWasmAndRun(label: string, script: string): Promise<void>;
    continueAndCheckForLabel(label: string): Promise<void>;
    getMappingsForPlugin(): LabelMapping[];
}
export declare function retrieveCodeMirrorEditorContent(devToolsPage: DevToolsPage): Promise<string[]>;
export declare function waitForLines(devToolsPage: DevToolsPage, lineCount: number): Promise<void>;
export declare function isPrettyPrinted(devToolsPage: DevToolsPage): Promise<boolean>;
export declare function veImpressionForSourcesPanel(): {
    impressions: string[];
};
