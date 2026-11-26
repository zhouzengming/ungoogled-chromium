// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { CustomizeButtonsDocumentCallbackRouter, CustomizeButtonsHandlerFactory, CustomizeButtonsHandlerRemote } from './customize_buttons.mojom-webui.js';
let instance = null;
/** Holds Mojo interfaces for communication with the browser process. */
export class CustomizeButtonsProxy {
    static getInstance() {
        if (!instance) {
            const handler = new CustomizeButtonsHandlerRemote();
            const callbackRouter = new CustomizeButtonsDocumentCallbackRouter();
            CustomizeButtonsHandlerFactory.getRemote().createCustomizeButtonsHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance = new CustomizeButtonsProxy(handler, callbackRouter);
        }
        return instance;
    }
    static setInstance(handler, callbackRouter) {
        instance = new CustomizeButtonsProxy(handler, callbackRouter);
    }
    handler;
    callbackRouter;
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter;
    }
}
