import type { CustomizeToolbarHandlerInterface } from '../customize_toolbar.mojom-webui.js';
import { CustomizeToolbarClientCallbackRouter } from '../customize_toolbar.mojom-webui.js';
export declare class CustomizeToolbarApiProxy {
    static getInstance(): CustomizeToolbarApiProxy;
    static setInstance(handler: CustomizeToolbarHandlerInterface, callbackRouter: CustomizeToolbarClientCallbackRouter): void;
    handler: CustomizeToolbarHandlerInterface;
    callbackRouter: CustomizeToolbarClientCallbackRouter;
    private constructor();
}
