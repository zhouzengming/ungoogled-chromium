import type * as puppeteer from 'puppeteer-core';
export declare function chromeLogin(page: puppeteer.Page, username: string): Promise<void>;
export declare function fillGoogleLoginPage(page: puppeteer.Page, username: string): Promise<void>;
export declare function typeTextIn(page: puppeteer.Page, selector: string, value: string): Promise<void>;
export declare function configureDevToolsPreferences(page: puppeteer.Page): Promise<void>;
export declare function getOtaPassword(email: string): string;
