import { CustomizeButtonsDocumentCallbackRouter, CustomizeButtonsHandlerRemote } from './customize_buttons.mojom-webui.js';
/** Holds Mojo interfaces for communication with the browser process. */
export declare class CustomizeButtonsProxy {
    static getInstance(): CustomizeButtonsProxy;
    static setInstance(handler: CustomizeButtonsHandlerRemote, callbackRouter: CustomizeButtonsDocumentCallbackRouter): void;
    handler: CustomizeButtonsHandlerRemote;
    callbackRouter: CustomizeButtonsDocumentCallbackRouter;
    private constructor();
}
