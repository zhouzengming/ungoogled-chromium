import type { ElementHandle } from 'puppeteer-core';
import type { DevToolsPage } from '../shared/DevToolsPage.js';
export declare function setCustomOrientation(devtoolsPage: DevToolsPage): Promise<void>;
export declare function getInputFieldValue(field: ElementHandle<Element>): Promise<string>;
export declare function getOrientationInputs(devtoolsPage: DevToolsPage): Promise<Array<ElementHandle<HTMLInputElement>>>;
export declare function getOrientationValues(devtoolsPage: DevToolsPage): Promise<number[]>;
