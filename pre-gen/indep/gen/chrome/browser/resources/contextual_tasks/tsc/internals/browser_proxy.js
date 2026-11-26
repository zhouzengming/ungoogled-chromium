// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ContextualTasksInternalsPageCallbackRouter, ContextualTasksInternalsPageHandlerFactory, ContextualTasksInternalsPageHandlerRemote } from '../contextual_tasks_internals.mojom-webui.js';
/**
 * @fileoverview A browser proxy for the ContextualTasks Internals page.
 */
export class BrowserProxy {
    handler;
    callbackRouter;
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter;
    }
    static getInstance() {
        if (!instance) {
            const handler = new ContextualTasksInternalsPageHandlerRemote();
            const callbackRouter = new ContextualTasksInternalsPageCallbackRouter();
            ContextualTasksInternalsPageHandlerFactory.getRemote().createPageHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance = new BrowserProxy(handler, callbackRouter);
        }
        return instance;
    }
}
let instance = null;
