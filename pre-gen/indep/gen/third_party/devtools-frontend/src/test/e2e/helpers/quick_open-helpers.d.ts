import type { ElementHandle } from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare const QUICK_OPEN_SELECTOR = "[aria-label=\"Quick open\"],[aria-label=\"Abrir r\u00E1pido\"]";
export declare const openCommandMenu: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const openFileQuickOpen: (devtoolsPage: DevToolsPage) => Promise<void>;
export declare function readQuickOpenResults(devtoolsPage: DevToolsPage): Promise<string[]>;
/** Does not play well with pptr:evaluate scripts. crbug.com/391533572 */
export declare const openFileWithQuickOpen: (devtoolsPage: DevToolsPage, sourceFile: string, filePosition?: number) => Promise<void>;
export declare function runCommandWithQuickOpen(devtoolsPage: DevToolsPage, command: string): Promise<void>;
export declare const openGoToLineQuickOpen: (devtoolsPage: DevToolsPage) => Promise<void>;
export declare const showSnippetsAutocompletion: (devtoolsPage: DevToolsPage) => Promise<void>;
export declare function getAvailableSnippets(devtoolsPage: DevToolsPage): Promise<string[]>;
export declare function getMenuItemAtPosition(devtoolsPage: DevToolsPage, position: number): Promise<ElementHandle<Element>>;
export declare function getMenuItemTitleAtPosition(devtoolsPage: DevToolsPage, position: number): Promise<string>;
export declare const closeDrawer: (devToolsPage: DevToolsPage) => Promise<void>;
export declare const getSelectedItemText: (devToolsPage: DevToolsPage) => Promise<string>;
export declare function typeIntoQuickOpen(devtoolsPage: DevToolsPage, query: string, expectEmptyResults?: boolean): Promise<void>;
