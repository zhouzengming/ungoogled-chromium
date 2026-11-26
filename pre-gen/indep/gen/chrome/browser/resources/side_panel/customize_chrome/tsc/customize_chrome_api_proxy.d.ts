import type { CustomizeChromePageHandlerInterface } from './customize_chrome.mojom-webui.js';
import { CustomizeChromePageCallbackRouter } from './customize_chrome.mojom-webui.js';
export declare class CustomizeChromeApiProxy {
    handler: CustomizeChromePageHandlerInterface;
    callbackRouter: CustomizeChromePageCallbackRouter;
    private constructor();
    static getInstance(): CustomizeChromeApiProxy;
    static setInstance(handler: CustomizeChromePageHandlerInterface, callbackRouter: CustomizeChromePageCallbackRouter): void;
}
