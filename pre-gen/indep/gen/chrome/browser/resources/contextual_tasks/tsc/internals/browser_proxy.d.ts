import { ContextualTasksInternalsPageCallbackRouter, ContextualTasksInternalsPageHandlerRemote } from '../contextual_tasks_internals.mojom-webui.js';
/**
 * @fileoverview A browser proxy for the ContextualTasks Internals page.
 */
export declare class BrowserProxy {
    handler: ContextualTasksInternalsPageHandlerRemote;
    callbackRouter: ContextualTasksInternalsPageCallbackRouter;
    constructor(handler: ContextualTasksInternalsPageHandlerRemote, callbackRouter: ContextualTasksInternalsPageCallbackRouter);
    static getInstance(): BrowserProxy;
}
