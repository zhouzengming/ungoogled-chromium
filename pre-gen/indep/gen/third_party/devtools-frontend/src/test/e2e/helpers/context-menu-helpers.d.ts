import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function waitForSoftContextMenu(devToolsPage: DevToolsPage): Promise<puppeteer.ElementHandle<Element>>;
export declare function findSubMenuEntryItem(devToolsPage: DevToolsPage, text: string): Promise<puppeteer.ElementHandle<Element>>;
export declare function openSoftContextMenuAndClickOnItem(devToolsPage: DevToolsPage, selector: string, label: string): Promise<void>;
export declare function openSubMenu(devToolsPage: DevToolsPage, selector: string, text: string): Promise<void>;
