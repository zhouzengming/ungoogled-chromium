import type * as puppeteer from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
import type { InspectedPage } from '../shared/InspectedPage.js';
export declare function loadExtension(devToolsPage: DevToolsPage, inspectedPage: InspectedPage, name: string, startPage?: string | undefined, allowFileAccess?: boolean | undefined): Promise<puppeteer.Frame>;
