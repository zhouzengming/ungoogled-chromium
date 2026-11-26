import type * as puppeteer from 'puppeteer-core';
export declare const assertElementScreenshotUnchanged: (element: puppeteer.ElementHandle | null, fileName: NonNullable<puppeteer.ScreenshotOptions["path"]>, options?: Partial<puppeteer.ScreenshotOptions>) => Promise<void>;
