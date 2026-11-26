import { PageCallbackRouter, PageHandlerRemote } from './new_tab_page.mojom-webui.js';
/** Holds Mojo interfaces for communication with the browser process. */
export declare class NewTabPageProxy {
    static getInstance(): NewTabPageProxy;
    static setInstance(handler: PageHandlerRemote, callbackRouter: PageCallbackRouter): void;
    handler: PageHandlerRemote;
    callbackRouter: PageCallbackRouter;
    private constructor();
}
