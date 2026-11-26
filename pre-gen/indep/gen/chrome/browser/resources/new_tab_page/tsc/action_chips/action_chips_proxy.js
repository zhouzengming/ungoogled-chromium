// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ActionChipsHandlerFactory, ActionChipsHandlerRemote, PageCallbackRouter } from '../action_chips.mojom-webui.js';
export class ActionChipsApiProxyImpl {
    handler;
    callbackRouter;
    constructor() {
        this.handler = new ActionChipsHandlerRemote();
        this.callbackRouter = new PageCallbackRouter();
        const factory = ActionChipsHandlerFactory.getRemote();
        factory.createActionChipsHandler(this.handler.$.bindNewPipeAndPassReceiver(), this.callbackRouter.$.bindNewPipeAndPassRemote());
    }
    getHandler() {
        return this.handler;
    }
    getCallbackRouter() {
        return this.callbackRouter;
    }
    static getInstance() {
        return instance || (instance = new ActionChipsApiProxyImpl());
    }
    static setInstance(newInstance) {
        instance = newInstance;
    }
}
let instance = null;
