// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { addWebUiListener, sendWithPromise } from 'chrome://resources/js/cr.js';
import { loadTimeData } from 'chrome://resources/js/load_time_data.js';
import { PolicyPageClientCallbackRouter, PolicyPageHandlerFactory, PolicyPageHandlerRemote } from './policy.mojom-webui.js';
const policyPageMojoMigrationEnabled = loadTimeData.getBoolean('policyPageMojoMigrationEnabled');
export class BrowserProxy {
    handler;
    callbackRouter;
    constructor() {
        this.handler = new PolicyPageHandlerRemote();
        this.callbackRouter = new PolicyPageClientCallbackRouter();
        PolicyPageHandlerFactory.getRemote().createHandler(this.handler.$.bindNewPipeAndPassReceiver(), this.callbackRouter.$.bindNewPipeAndPassRemote());
    }
    static getInstance() {
        return proxyInstance || (proxyInstance = new BrowserProxy());
    }
    static getDebugString() {
        return this.getInstance().handler.getDebugString().then(result => result.message);
    }
    // 
    static checkPromotionEligibility() {
        if (policyPageMojoMigrationEnabled) {
            return this.getInstance().handler.checkPromotionEligibility().then(response => response.shouldShowPromotion);
        }
        else {
            return sendWithPromise('shouldShowPromotion');
        }
    }
    static setBannerDismissed() {
        if (policyPageMojoMigrationEnabled) {
            this.getInstance().handler.setBannerDismissed();
        }
        else {
            sendWithPromise('setBannerDismissed');
        }
    }
    static recordBannerRedirected() {
        if (policyPageMojoMigrationEnabled) {
            this.getInstance().handler.recordBannerRedirected();
        }
        else {
            chrome.send('recordBannerRedirected');
        }
    }
    // 
    static getPolicies(reason) {
        if (policyPageMojoMigrationEnabled) {
            return this.getInstance().handler.getPoliciesJson(reason).then(response => response.policiesJson);
        }
        else {
            return sendWithPromise('getPoliciesJson', reason);
        }
    }
    static listenForStatusUpdated(callback) {
        if (policyPageMojoMigrationEnabled) {
            this.getInstance().callbackRouter.statusUpdated.addListener(callback);
        }
        else {
            addWebUiListener('status-updated', callback);
        }
    }
}
let proxyInstance = null;
