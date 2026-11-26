import type * as puppeteer from 'puppeteer-core';
export interface InspectedPage {
    serverPort: number;
    goTo(url: string, options?: puppeteer.WaitForOptions): Promise<void>;
    goToHtml(html: string): Promise<void>;
    goToResource(path: string, options?: puppeteer.WaitForOptions): Promise<void>;
    goToResourceWithCustomHost(host: string, path: string): Promise<void>;
    getResourcesPath(host?: string): string;
    domain(host?: string): string;
    getOopifResourcesPath(): string;
    overridePermissions(permissions: puppeteer.Permission[]): Promise<void>;
    waitForSelector<Selector extends string>(selector: Selector, options?: puppeteer.WaitForSelectorOptions): Promise<any>;
    evaluate<T>(fn: (...args: any[]) => T, ...args: any[]): Promise<T>;
    [key: string]: any;
}
