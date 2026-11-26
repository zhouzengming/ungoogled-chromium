import type * as puppeteer from 'puppeteer-core';
import { AsyncScope } from '../../conductor/async-scope.js';
export type Action = (element: puppeteer.ElementHandle) => Promise<void>;
export interface KeyModifiers {
    /**
     * On Mac this presses the Meta key
     */
    control?: boolean;
    alt?: boolean;
    shift?: boolean;
}
export interface ClickOptions {
    root?: puppeteer.ElementHandle;
    modifiers?: KeyModifiers;
    clickOptions?: puppeteer.ClickOptions;
    maxPixelsFromLeft?: number;
}
export interface Logger {
    log(message: string): void;
}
export type DeducedElementType<ElementType extends Element | null, Selector extends string> = ElementType extends null ? puppeteer.NodeFor<Selector> : ElementType;
export declare class PageWrapper {
    #private;
    page: puppeteer.Page;
    evaluate: puppeteer.Page['evaluate'];
    waitForNavigation: puppeteer.Page['waitForNavigation'];
    bringToFront: puppeteer.Page['bringToFront'];
    evaluateOnNewDocument: puppeteer.Page['evaluateOnNewDocument'];
    removeScriptToEvaluateOnNewDocument: puppeteer.Page['removeScriptToEvaluateOnNewDocument'];
    locator: puppeteer.Page['locator'];
    constructor(page: puppeteer.Page);
    /**
     * `waitForFunction` runs in the test context and not in the page
     * context. If you want to evaluate code on the page, use
     * {@link PageWrapper.evaluate} within the `waitForFunction` callback.
     */
    waitForFunction<T>(fn: (logger: Logger) => T | undefined | Promise<T | undefined>, asyncScope?: AsyncScope, description?: string, successCondition?: (result: T) => boolean): Promise<Exclude<NonNullable<T>, false>>;
    /**
     * Wait for the return value of a function to not be undefined and to strictly
     * equal the expected value.
     */
    waitForStrictEqual<T>(expected: T, fn: (logger: Logger) => T | undefined | Promise<T | undefined>, description?: string, asyncScope?: AsyncScope): Promise<Exclude<NonNullable<T>, false>>;
    /**
     * Wait for the return value of a function to be a string that includes the
     * expected value.
     */
    waitForIncludes(expected: string, fn: (logger: Logger) => string | undefined | null | Promise<string | undefined | null>, description?: string, asyncScope?: AsyncScope): Promise<string>;
    timeout(duration: number): Promise<void>;
    screenshot(): Promise<string>;
    reload(options?: puppeteer.WaitForOptions): Promise<void>;
    raf(): Promise<void>;
    /**
     * Schedules a task in the page that ensures that previously
     * handled tasks have been handled.
     */
    drainTaskQueue(): Promise<void>;
    pressKey(key: puppeteer.KeyInput, modifiers?: KeyModifiers): Promise<void>;
    pressKeyAndExpectNavigation(key: puppeteer.KeyInput, modifiers?: KeyModifiers): Promise<void>;
    /**
     * Get a single element handle. Uses `pierce` handler per default for piercing Shadow DOM.
     */
    $<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, root?: puppeteer.ElementHandle, handler?: string): Promise<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>> | null>;
    /**
     * Get multiple element handles. Uses `pierce` handler per default for piercing Shadow DOM.
     */
    $$<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, root?: puppeteer.JSHandle, handler?: string): Promise<Array<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>>>>;
    waitFor<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope, handler?: string): Promise<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>>>;
    performActionOnSelector(selector: string, options: {
        root?: puppeteer.ElementHandle;
    }, action: Action): Promise<puppeteer.ElementHandle>;
    click(selector: string, options?: ClickOptions): Promise<puppeteer.ElementHandle<Element>>;
    typeText(text: string, opts?: {
        delay: number;
    }): Promise<void>;
    hover(selector: string, options?: {
        root?: puppeteer.ElementHandle;
    }): Promise<puppeteer.ElementHandle<Element>>;
    waitForAria<ElementType extends Element = Element>(selector: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope): Promise<puppeteer.ElementHandle<DeducedElementType<ElementType, string>>>;
    waitForNone(selector: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope, handler?: string): Promise<true>;
    /**
     * @deprecated This method is not able to recover from unstable DOM. Use click(selector) instead.
     */
    clickElement(element: puppeteer.ElementHandle, options?: ClickOptions): Promise<void>;
    waitForElementWithTextContent(textContent: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope): Promise<puppeteer.ElementHandle<Element>>;
    scrollElementIntoView(selector: string, root?: puppeteer.ElementHandle): Promise<void>;
    /**
     * Search for all elements based on their textContent
     *
     * @param textContent The text content to search for.
     * @param root The root of the search.
     */
    $$textContent(textContent: string, root?: puppeteer.ElementHandle): Promise<Array<puppeteer.ElementHandle<Element>>>;
    waitForNoElementsWithTextContent(textContent: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope): Promise<true>;
    doubleClick(selector: string, options?: {
        root?: puppeteer.ElementHandle;
        clickOptions?: puppeteer.ClickOptions;
    }): Promise<puppeteer.ElementHandle<Element>>;
    pasteText(text: string): Promise<void>;
    /**
     * Search for an element based on its textContent.
     *
     * @param textContent The text content to search for.
     * @param root The root of the search.
     */
    $textContent(textContent: string, root?: puppeteer.ElementHandle): Promise<puppeteer.ElementHandle<Element> | null>;
    getTextContent<ElementType extends Element = Element>(selector: string, root?: puppeteer.ElementHandle): Promise<string | undefined>;
    getAllTextContents(selector: string, root?: puppeteer.JSHandle, handler?: string): Promise<Array<string | null>>;
    /**
     * Match multiple elements based on a selector and return their textContents, but only for those
     * elements that are visible.
     *
     * @param selector jquery selector to match
     * @returns array containing text contents from visible elements
     */
    getVisibleTextContents(selector: string): Promise<string[]>;
    waitForVisible<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope, handler?: string): Promise<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>>>;
    waitForMany<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, count: number, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope, handler?: string): Promise<Array<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>>>>;
    waitForManyWithTries<ElementType extends Element | null = null, Selector extends string = string>(selector: Selector, count: number, tries: number, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope, handler?: string): Promise<Array<puppeteer.ElementHandle<DeducedElementType<ElementType, Selector>>> | undefined>;
    waitForAriaNone: (selector: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope) => Promise<true>;
    waitForElementsWithTextContent(textContent: string, root?: puppeteer.ElementHandle, asyncScope?: AsyncScope): Promise<Array<puppeteer.ElementHandle<Element>>>;
    waitForFunctionWithTries<T>(fn: () => Promise<T | undefined>, options?: {
        tries: number;
    }, asyncScope?: AsyncScope): Promise<Exclude<NonNullable<T>, false> | undefined>;
    waitForWithTries(selector: string, root?: puppeteer.ElementHandle, options?: {
        tries: number;
    }, asyncScope?: AsyncScope, handler?: string): Promise<puppeteer.ElementHandle<Element> | undefined>;
    activeElement(): Promise<puppeteer.ElementHandle<Element>>;
    activeElementTextContent(): Promise<string>;
    activeElementAccessibleName(): Promise<string | null>;
    tabForward(): Promise<void>;
    tabBackward(): Promise<void>;
    hasClass(element: puppeteer.ElementHandle<Element>, classname: string): Promise<boolean>;
    waitForClass(element: puppeteer.ElementHandle<Element>, classname: string): Promise<void>;
    setCheckBox(selector: string, wantChecked: boolean): Promise<void>;
}
