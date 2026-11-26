// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assert } from '//resources/js/assert.js';
import { enumToClient } from '../../enum_conversions.js';
import { GeminiEnterpriseHandlerRemote } from '../../gemini_enterprise.mojom-webui.js';
export class GlicBrowserHostGeic {
    handler;
    handlerRemote;
    initialize(_initialState, handler) {
        this.handler = handler;
    }
    destroy() {
        if (this.handlerRemote) {
            this.handlerRemote.$.close();
            this.handlerRemote = undefined;
        }
        this.handler = undefined;
    }
    async openSignInTab(options) {
        const mojoOptions = options ? {
            signinUrl: options.signinUrl ?? null,
        } :
            null;
        const response = await this.getGeicHandler().openSignInTab(mojoOptions);
        return enumToClient(response.result);
    }
    async closeSignInTab(options) {
        const response = await this.getGeicHandler().closeSignInTab(options ?? null);
        return enumToClient(response.result);
    }
    getGeicHandler() {
        assert(this.handler);
        if (!this.handlerRemote) {
            this.handlerRemote = new GeminiEnterpriseHandlerRemote();
            this.handler.createGeminiEnterpriseHandler(this.handlerRemote.$.bindNewPipeAndPassReceiver());
        }
        return this.handlerRemote;
    }
}
