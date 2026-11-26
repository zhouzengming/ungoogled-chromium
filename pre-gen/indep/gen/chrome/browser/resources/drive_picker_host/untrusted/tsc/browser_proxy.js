// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PageCallbackRouter, PageHandlerFactory, PageHandlerRemote } from './drive_picker_host_untrusted.mojom-webui.js';
export class BrowserProxyImpl {
    handler;
    callbackRouter;
    constructor() {
        this.callbackRouter = new PageCallbackRouter();
        this.handler = new PageHandlerRemote();
        const factory = PageHandlerFactory.getRemote();
        factory.createPageHandler(this.callbackRouter.$.bindNewPipeAndPassRemote(), this.handler.$.bindNewPipeAndPassReceiver());
    }
    static getInstance() {
        return instance || (instance = new BrowserProxyImpl());
    }
    static setInstance(obj) {
        instance = obj;
    }
}
let instance = null;
