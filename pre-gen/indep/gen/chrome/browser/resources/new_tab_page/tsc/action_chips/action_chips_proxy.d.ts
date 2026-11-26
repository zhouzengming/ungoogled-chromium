import type { ActionChipsHandlerInterface } from '../action_chips.mojom-webui.js';
import { PageCallbackRouter } from '../action_chips.mojom-webui.js';
export interface ActionChipsApiProxy {
    getHandler(): ActionChipsHandlerInterface;
    getCallbackRouter(): PageCallbackRouter;
}
export declare class ActionChipsApiProxyImpl implements ActionChipsApiProxy {
    private handler;
    private callbackRouter;
    constructor();
    getHandler(): ActionChipsHandlerInterface;
    getCallbackRouter(): PageCallbackRouter;
    static getInstance(): ActionChipsApiProxy;
    static setInstance(newInstance: ActionChipsApiProxy | null): void;
}
