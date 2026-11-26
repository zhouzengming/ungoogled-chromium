import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare const CONSOLE_TAB_SELECTOR = "#tab-console";
export declare const CONSOLE_MESSAGES_SELECTOR = ".console-group-messages";
export declare const CONSOLE_MESSAGES_TEXT_SELECTOR = ".source-code .console-message-text";
export declare const CONSOLE_ALL_MESSAGES_SELECTOR: '.console-group-messages .source-code .console-message-text';
export declare const CONSOLE_INFO_MESSAGES_SELECTOR: '.console-group-messages .console-info-level .source-code .console-message-text';
export declare const CONSOLE_ERROR_MESSAGES_SELECTOR: '.console-group-messages .console-error-level .source-code .console-message-text';
export declare const CONSOLE_MESSAGE_TEXT_AND_ANCHOR_SELECTOR = ".console-group-messages .source-code";
export declare const LOG_LEVELS_SELECTOR = "[aria-label^=\"Log level: \"]";
export declare const LOG_LEVELS_VERBOSE_OPTION_SELECTOR = "[aria-label^=\"Verbose\"]";
export declare const CONSOLE_PROMPT_SELECTOR = ".console-prompt-editor-container";
export declare const CONSOLE_VIEW_IN_DRAWER_SELECTOR = ".drawer-tabbed-pane .console-view";
export declare const CONSOLE_VIEW_SELECTOR = ".console-view";
export declare const CONSOLE_TOOLTIP_SELECTOR = ".cm-tooltip";
export declare const CONSOLE_COMPLETION_HINT_SELECTOR = ".cm-completionHint";
export declare const STACK_PREVIEW_CONTAINER = ".stack-preview-container";
export declare const CONSOLE_MESSAGE_WRAPPER_SELECTOR = ".console-group-messages .console-message-wrapper";
export declare const CONSOLE_SELECTOR = ".console-user-command-result";
export declare const CONSOLE_SETTINGS_SELECTOR = "[aria-label^=\"Console settings\"]";
export declare const AUTOCOMPLETE_FROM_HISTORY_SELECTOR = "[title=\"Autocomplete from history\"]";
export declare const SHOW_CORS_ERRORS_SELECTOR = "[title=\"CORS errors in console\"]";
export declare const LOG_XML_HTTP_REQUESTS_SELECTOR = "[title=\"Log XMLHttpRequests\"]";
export declare const CONSOLE_CREATE_LIVE_EXPRESSION_SELECTOR = "[aria-label^=\"Create live expression\"]";
export declare const CONSOLE_SIDEBAR_SELECTOR = "div[slot=\"sidebar\"]";
export declare const Level: Record<'All' | 'Info' | 'Error', string>;
export declare const SidebarItem: {
    Messages: number;
    UserMessages: number;
    Errors: number;
    Warnings: number;
    Info: number;
    Verbose: number;
};
export declare function deleteConsoleMessagesFilter(devToolsPage: DevToolsPage): Promise<void>;
export declare function filterConsoleMessages(devToolsPage: DevToolsPage, filter: string): Promise<void>;
export declare function waitForConsoleMessagesToBeNonEmpty(devToolsPage: DevToolsPage, numberOfMessages: number): Promise<void>;
export declare function waitForExactConsoleMessageCount(devToolsPage: DevToolsPage, expectedCount: number): Promise<void>;
export declare function waitForLastConsoleMessageToHaveContent(devToolsPage: DevToolsPage, expectedTextContent: string): Promise<void>;
export declare function getConsoleMessages(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, testName: string, withAnchor?: boolean, callback?: (() => Promise<void>) | undefined): Promise<string[]>;
export declare function getCurrentConsoleMessages(devToolsPage: DevToolsPage, withAnchor?: boolean, level?: string, callback?: (() => Promise<void>) | undefined): Promise<string[]>;
export declare function getLastConsoleMessages(devToolsPage: DevToolsPage, offset?: number): Promise<string | undefined>;
export declare function maybeGetCurrentConsoleMessages(devToolsPage: DevToolsPage, withAnchor?: boolean, callback?: (() => Promise<void>) | undefined): Promise<string[]>;
export declare function getStructuredConsoleMessages(devToolsPage: DevToolsPage): Promise<Array<{
    message: string | undefined;
    messageClasses: string | undefined;
    repeatCount: string | null;
    source: string | undefined;
    stackPreview: string | null;
    wrapperClasses: string;
}>>;
export declare function focusConsolePrompt(devToolsPage: DevToolsPage): Promise<void>;
export declare function showVerboseMessages(devToolsPage: DevToolsPage): Promise<void>;
export declare function typeIntoConsole(devToolsPage: DevToolsPage, message: string): Promise<void>;
export declare function typeIntoConsoleAndWaitForResult(devToolsPage: DevToolsPage, message: string, leastExpectedMessages?: number, selector?: string): Promise<void>;
export declare function unifyLogVM(actualLog: string, expectedLog: string): Promise<string>;
export declare function navigateToConsoleTab(devToolsPage: DevToolsPage): Promise<void>;
export declare function openConsoleSidebar(devToolsPage: DevToolsPage): Promise<void>;
export declare function closeConsoleSidebar(devToolsPage: DevToolsPage): Promise<void>;
export declare function selectConsoleSidebarItem(devToolsPage: DevToolsPage, itemPosition?: number): Promise<void>;
export declare function waitForConsoleInfoMessageAndClickOnLink(devToolsPage: DevToolsPage): Promise<void>;
export declare function turnOffHistoryAutocomplete(devToolsPage: DevToolsPage): Promise<void>;
export declare function toggleShowCorsErrors(devToolsPage: DevToolsPage): Promise<void>;
export declare function toggleShowLogXmlHttpRequests(devToolsPage: DevToolsPage): Promise<void>;
export declare function waitForIssueButtonLabel(devToolsPage: DevToolsPage, expectedLabel: string): Promise<void>;
export declare function clickOnContextMenu(devToolsPage: DevToolsPage, selectorForNode: string, jslogContext: string): Promise<void>;
/**
 * Creates a function that runs a command and checks the nth output from the
 * bottom (checks last message by default)
 */
export declare function checkCommandResultFunction(offset?: number): (devToolsPage: DevToolsPage, command: string, expected: string, message?: string | undefined) => Promise<void>;
export declare function getLastConsoleStacktrace(devToolsPage: DevToolsPage, offset?: number): Promise<string>;
export declare function checkCommandStacktrace(devToolsPage: DevToolsPage, command: string, expected: string, leastMessages?: number, offset?: number): Promise<void>;
export declare function veImpressionForConsolePanel(): {
    impressions: string[];
};
