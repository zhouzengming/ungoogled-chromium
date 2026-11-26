// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { NtpPromoClientCallbackRouter, NtpPromoHandlerFactory, NtpPromoHandlerRemote } from '../ntp_promo.mojom-webui.js';
export class NtpPromoProxyImpl {
    callbackRouter_ = new NtpPromoClientCallbackRouter();
    handler_ = new NtpPromoHandlerRemote();
    constructor() {
        const factory = NtpPromoHandlerFactory.getRemote();
        factory.createNtpPromoHandler(this.callbackRouter_.$.bindNewPipeAndPassRemote(), this.handler_.$.bindNewPipeAndPassReceiver());
    }
    static getInstance() {
        return instance || (instance = new NtpPromoProxyImpl());
    }
    static setInstance(obj) {
        instance = obj;
    }
    getHandler() {
        return this.handler_;
    }
    getCallbackRouter() {
        return this.callbackRouter_;
    }
}
let instance = null;
