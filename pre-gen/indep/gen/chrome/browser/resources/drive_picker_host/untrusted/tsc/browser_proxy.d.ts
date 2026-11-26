import { PageCallbackRouter, PageHandlerRemote } from './drive_picker_host_untrusted.mojom-webui.js';
export interface BrowserProxy {
    handler: PageHandlerRemote;
    callbackRouter: PageCallbackRouter;
}
export declare class BrowserProxyImpl implements BrowserProxy {
    handler: PageHandlerRemote;
    callbackRouter: PageCallbackRouter;
    constructor();
    static getInstance(): BrowserProxy;
    static setInstance(obj: BrowserProxy): void;
}
