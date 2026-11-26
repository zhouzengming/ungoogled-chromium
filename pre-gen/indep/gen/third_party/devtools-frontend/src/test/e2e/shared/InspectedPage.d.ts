import type * as puppeteer from 'puppeteer-core';
import type { InspectedPage as InspectedPageInterface } from '../../conductor/inspected_page.js';
import { PageWrapper } from './PageWrapper.js';
export declare class InspectedPage extends PageWrapper implements InspectedPageInterface {
    readonly serverPort: number;
    constructor(page: puppeteer.Page, serverPort: number);
    goTo(url: string, options?: puppeteer.WaitForOptions): Promise<void>;
    goToHtml(unparsedHtml: string): Promise<void>;
    waitForSelector<Selector extends string>(selector: Selector, options?: puppeteer.WaitForSelectorOptions): Promise<puppeteer.ElementHandle<puppeteer.NodeFor<Selector>> | null>;
    goToResource(path: string, options?: puppeteer.WaitForOptions): Promise<void>;
    goToResourceWithCustomHost(host: string, path: string): Promise<void>;
    getResourcesPath(host?: string): string;
    domain(host?: string): string;
    getOopifResourcesPath(): string;
    overridePermissions(permissions: puppeteer.Permission[]): Promise<void>;
}
export declare function setupInspectedPage(context: puppeteer.BrowserContext, serverPort: number): Promise<InspectedPage>;
