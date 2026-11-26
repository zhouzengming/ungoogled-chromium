// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from 'chai';
import { AsyncScope } from '../../conductor/async-scope.js';
import { platform } from '../../conductor/platform.js';
export class PageWrapper {
    page;
    evaluate;
    waitForNavigation;
    bringToFront;
    evaluateOnNewDocument;
    removeScriptToEvaluateOnNewDocument;
    locator;
    constructor(page) {
        this.page = page;
        this.evaluate = page.evaluate.bind(page);
        this.bringToFront = page.bringToFront.bind(page);
        this.evaluateOnNewDocument = page.evaluateOnNewDocument.bind(page);
        this.removeScriptToEvaluateOnNewDocument = page.removeScriptToEvaluateOnNewDocument.bind(page);
        this.waitForNavigation = page.waitForNavigation.bind(page);
        this.locator = page.locator.bind(page);
    }
    /**
     * `waitForFunction` runs in the test context and not in the page
     * context. If you want to evaluate code on the page, use
     * {@link PageWrapper.evaluate} within the `waitForFunction` callback.
     */
    async waitForFunction(fn, asyncScope = new AsyncScope(), description, successCondition = Boolean) {
        const signal = AsyncScope.abortSignal;
        const innerFunction = async (messages) => {
            let iterations = 0;
            const logger = { log: messages.push.bind(messages) };
            while (true) {
                signal?.throwIfAborted();
                const messagesBefore = messages.length;
                const result = await fn(logger);
                const success = result !== undefined && successCondition(result);
                // On completing an iteration, remove any leftover messages from the previous iteration.
                messages.splice(0, messagesBefore);
                messages.push(`Iteration ${iterations++} result: ${success ? 'success' : `${result}`}`);
                signal?.throwIfAborted();
                if (success) {
                    return result;
                }
                await this.timeout(100);
            }
        };
        return await asyncScope.exec(innerFunction, description);
    }
    /**
     * Wait for the return value of a function to not be undefined and to strictly
     * equal the expected value.
     */
    async waitForStrictEqual(expected, fn, description, asyncScope = new AsyncScope()) {
        return await this.waitForFunction(fn, asyncScope, description ?? `Waiting for function to return ${expected}`, (result) => result === expected);
    }
    /**
     * Wait for the return value of a function to be a string that includes the
     * expected value.
     */
    async waitForIncludes(expected, fn, description, asyncScope = new AsyncScope()) {
        return await this.waitForFunction(fn, asyncScope, description ?? `Waiting for result to include "${expected}"`, result => Boolean(result && result.includes(expected)));
    }
    timeout(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }
    async screenshot() {
        await this.bringToFront();
        return await this.page.screenshot({
            encoding: 'base64',
        });
    }
    async reload(options) {
        await this.page.reload(options);
    }
    async raf() {
        await this.page.evaluate(() => {
            return new Promise(resolve => window.requestAnimationFrame(resolve));
        });
    }
    /**
     * Schedules a task in the page that ensures that previously
     * handled tasks have been handled.
     */
    async drainTaskQueue() {
        await this.evaluate(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    }
    async pressKey(key, modifiers) {
        await this.#withKeyModifiers(async () => {
            // TODO: this should probably be fixed in Puppeteer.
            await this.page.keyboard.press(key, { commands: modifiers?.control && key === 'c' ? ['copy'] : undefined });
        }, modifiers ?? {});
    }
    async pressKeyAndExpectNavigation(key, modifiers) {
        await this.#withKeyModifiers(async () => {
            await this.page.keyboard.down(key);
            await this.page.keyboard.up(key).catch(e => {
                // When KeyDown triggers a navigation, it is likely that the target
                // (that normally would handle the KeyUp event) gets destroyed before
                // the event gets handled. This should not be seen as a failure case,
                // as that causes flakiness in tests.
                if (!e.message.includes('Target closed')) {
                    throw e;
                }
            });
        }, modifiers ?? {});
    }
    /**
     * Get a single element handle. Uses `pierce` handler per default for piercing Shadow DOM.
     */
    async $(selector, root, handler = 'pierce') {
        const rootElement = root ? root : this.page;
        const element = await rootElement.$(`${handler}/${selector}`);
        return element;
    }
    /**
     * Get multiple element handles. Uses `pierce` handler per default for piercing Shadow DOM.
     */
    async $$(selector, root, handler = 'pierce') {
        const rootElement = root?.asElement() ?? this.page;
        const elements = await rootElement.$$(`${handler}/${selector}`);
        return elements;
    }
    async waitFor(selector, root, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunction(async () => {
            const element = await this.$(selector, root, handler);
            return (element || undefined);
        }, asyncScope, `Waiting for element matching selector '${handler ? `${handler}/` : ''}${selector}'`));
    }
    async performActionOnSelector(selector, options, action) {
        // TODO(crbug.com/1410168): we should refactor waitFor to be compatible with
        // Puppeteer's syntax for selectors.
        const queryHandlers = new Set([
            'pierceShadowText',
            'pierce',
            'aria',
            'xpath',
            'text',
        ]);
        let queryHandler = 'pierce';
        for (const handler of queryHandlers) {
            const prefix = handler + '/';
            if (selector.startsWith(prefix)) {
                queryHandler = handler;
                selector = selector.substring(prefix.length);
                break;
            }
        }
        return await this.waitForFunction(async (logger) => {
            const element = await this.waitFor(selector, options?.root, undefined, queryHandler);
            try {
                await action(element);
                await this.drainTaskQueue();
                return element;
            }
            catch (err) {
                logger.log(`Threw error: ${err.message}`);
                return undefined;
            }
        }, undefined, `Performing action on ${selector}`);
    }
    async click(selector, options) {
        return await this.#withKeyModifiers(async () => {
            return await this.performActionOnSelector(selector, { root: options?.root }, element => element.click(options?.clickOptions));
        }, options?.modifiers ?? {});
    }
    async #withKeyModifiers(action, modifiers) {
        return await this.waitForFunction(async () => {
            if (modifiers.control) {
                if (platform === 'mac') {
                    // Use command key on mac
                    await this.page.keyboard.down('Meta');
                }
                else {
                    await this.page.keyboard.down('Control');
                }
            }
            if (modifiers.alt) {
                await this.page.keyboard.down('Alt');
            }
            if (modifiers.shift) {
                await this.page.keyboard.down('Shift');
            }
            try {
                const result = await action();
                return result ?? true;
            }
            finally {
                if (modifiers.shift) {
                    await this.page.keyboard.up('Shift');
                }
                if (modifiers.alt) {
                    await this.page.keyboard.up('Alt');
                }
                if (modifiers.control) {
                    if (platform === 'mac') {
                        // Use command key on mac
                        await this.page.keyboard.up('Meta');
                    }
                    else {
                        await this.page.keyboard.up('Control');
                    }
                }
            }
        });
    }
    async typeText(text, opts) {
        await this.page.keyboard.type(text, opts);
        await this.drainTaskQueue();
    }
    async hover(selector, options) {
        return await this.performActionOnSelector(selector, { root: options?.root }, element => element.hover());
    }
    waitForAria(selector, root, asyncScope = new AsyncScope()) {
        return this.waitFor(selector, root, asyncScope, 'aria');
    }
    async waitForNone(selector, root, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunction(async () => {
            const elements = await this.$$(selector, root, handler);
            if (elements.length === 0) {
                return true;
            }
            return false;
        }, asyncScope, `Waiting for no elements to match selector '${handler ? `${handler}/` : ''}${selector}'`));
    }
    /**
     * @deprecated This method is not able to recover from unstable DOM. Use click(selector) instead.
     */
    async clickElement(element, options) {
        await this.#withKeyModifiers(async () => {
            await this.waitForFunction(async () => {
                try {
                    await element.click(options?.clickOptions);
                    await this.drainTaskQueue();
                    return true;
                }
                catch {
                    return false;
                }
            }, undefined, 'Clicking element');
        }, options?.modifiers ?? {});
    }
    waitForElementWithTextContent(textContent, root, asyncScope = new AsyncScope()) {
        return this.waitFor(textContent, root, asyncScope, 'pierceShadowText');
    }
    async scrollElementIntoView(selector, root) {
        const element = await this.$(selector, root);
        if (!element) {
            throw new Error(`Unable to find element with selector "${selector}"`);
        }
        await element.evaluate(el => {
            el.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'center',
            });
        });
    }
    /**
     * Search for all elements based on their textContent
     *
     * @param textContent The text content to search for.
     * @param root The root of the search.
     */
    async $$textContent(textContent, root) {
        return await this.$$(textContent, root, 'pierceShadowText');
    }
    waitForNoElementsWithTextContent(textContent, root, asyncScope = new AsyncScope()) {
        return asyncScope.exec(() => this.waitForFunction(async () => {
            const elements = await this.$$textContent(textContent, root);
            if (elements?.length === 0) {
                return true;
            }
            return false;
        }, asyncScope, `Waiting for no elements with textContent '${textContent}'`));
    }
    async doubleClick(selector, options) {
        const passedClickOptions = (options?.clickOptions) || {};
        const clickOptionsWithDoubleClick = {
            ...passedClickOptions,
            count: 2,
        };
        return await this.click(selector, {
            ...options,
            clickOptions: clickOptionsWithDoubleClick,
        });
    }
    async pasteText(text) {
        await this.page.keyboard.sendCharacter(text);
        await this.drainTaskQueue();
    }
    /**
     * Search for an element based on its textContent.
     *
     * @param textContent The text content to search for.
     * @param root The root of the search.
     */
    async $textContent(textContent, root) {
        return await this.$(textContent, root, 'pierceShadowText');
    }
    async getTextContent(selector, root) {
        return await (await this.$(selector, root))?.evaluate(node => node.textContent);
    }
    async getAllTextContents(selector, root, handler = 'pierce') {
        const allElements = await this.$$(selector, root, handler);
        return await Promise.all(allElements.map(e => e.evaluate(e => e.textContent)));
    }
    /**
     * Match multiple elements based on a selector and return their textContents, but only for those
     * elements that are visible.
     *
     * @param selector jquery selector to match
     * @returns array containing text contents from visible elements
     */
    async getVisibleTextContents(selector) {
        const allElements = await this.$$(selector);
        const texts = await Promise.all(allElements.map(el => el.evaluate(node => node.checkVisibility() ? node.textContent?.trim() : undefined)));
        return texts.filter(content => typeof (content) === 'string');
    }
    async waitForVisible(selector, root, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunction(async () => {
            const element = await this.$(selector, root, handler);
            const visible = await element?.evaluate(node => node.checkVisibility());
            return visible ? element : undefined;
        }, asyncScope, `Waiting for element matching selector '${handler ? `${handler}/` : ''}${selector}' to be visible`));
    }
    async waitForMany(selector, count, root, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunction(async () => {
            const elements = await this.$$(selector, root, handler);
            return elements.length >= count ? elements : undefined;
        }, asyncScope, `Waiting for ${count} elements to match selector '${handler ? `${handler}/` : ''}${selector}'`));
    }
    async waitForManyWithTries(selector, count, tries, root, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunctionWithTries(async () => {
            const elements = await this.$$(selector, root, handler);
            return elements.length >= count ? elements : undefined;
        }, { tries }, asyncScope), `Waiting for ${count} elements to match selector '${handler ? `${handler}/` : ''}${selector}'`);
    }
    waitForAriaNone = (selector, root, asyncScope = new AsyncScope()) => {
        return this.waitForNone(selector, root, asyncScope, 'aria');
    };
    waitForElementsWithTextContent(textContent, root, asyncScope = new AsyncScope()) {
        return asyncScope.exec(() => this.waitForFunction(async () => {
            const elements = await this.$$textContent(textContent, root);
            if (elements?.length) {
                return elements;
            }
            return;
        }, asyncScope), `Waiting for elements with textContent '${textContent}'`);
    }
    async waitForFunctionWithTries(fn, options = {
        tries: Number.MAX_SAFE_INTEGER,
    }, asyncScope = new AsyncScope()) {
        return await asyncScope.exec(async () => {
            let tries = 0;
            while (tries++ < options.tries) {
                const result = await fn();
                if (result) {
                    return result;
                }
                await this.timeout(100);
            }
            return;
        });
    }
    async waitForWithTries(selector, root, options = {
        tries: Number.MAX_SAFE_INTEGER,
    }, asyncScope = new AsyncScope(), handler) {
        return await asyncScope.exec(() => this.waitForFunctionWithTries(async () => {
            const element = await this.$(selector, root, handler);
            return (element || undefined);
        }, options, asyncScope));
    }
    async activeElement() {
        await this.raf();
        return await this.page.evaluateHandle(() => {
            let activeElement = document.activeElement;
            while (activeElement?.shadowRoot) {
                activeElement = activeElement.shadowRoot.activeElement;
            }
            if (!activeElement) {
                throw new Error('No active element found');
            }
            return activeElement;
        });
    }
    async activeElementTextContent() {
        const element = await this.activeElement();
        return await element.evaluate(node => node.textContent);
    }
    async activeElementAccessibleName() {
        const element = await this.activeElement();
        return await element.evaluate(node => node.getAttribute('aria-label') || node.getAttribute('title'));
    }
    async tabForward() {
        await this.page.keyboard.press('Tab');
    }
    async tabBackward() {
        await this.pressKey('Tab', { shift: true });
    }
    async hasClass(element, classname) {
        return await element.evaluate((el, classname) => el.classList.contains(classname), classname);
    }
    async waitForClass(element, classname) {
        await this.waitForFunction(async () => {
            return await this.hasClass(element, classname);
        }, undefined, `Waiting for element to have class '${classname}'`);
    }
    async setCheckBox(selector, wantChecked) {
        const checkbox = await this.waitFor(selector);
        const checked = await checkbox.evaluate(box => box.checked);
        if (checked !== wantChecked) {
            await this.click(`${selector} + label`);
        }
        assert.strictEqual(await checkbox.evaluate(box => box.checked), wantChecked, `Expected checkbox to be ${wantChecked}`);
    }
}
//# sourceMappingURL=PageWrapper.js.map