// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { CustomizeToolbarClientCallbackRouter, CustomizeToolbarHandlerFactory, CustomizeToolbarHandlerRemote } from '../customize_toolbar.mojom-webui.js';
let instance = null;
export class CustomizeToolbarApiProxy {
    static getInstance() {
        if (!instance) {
            const handler = new CustomizeToolbarHandlerRemote();
            const callbackRouter = new CustomizeToolbarClientCallbackRouter();
            CustomizeToolbarHandlerFactory.getRemote().createCustomizeToolbarHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance = new CustomizeToolbarApiProxy(handler, callbackRouter);
        }
        return instance;
    }
    static setInstance(handler, callbackRouter) {
        instance = new CustomizeToolbarApiProxy(handler, callbackRouter);
    }
    handler;
    callbackRouter;
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter;
    }
}
