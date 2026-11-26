// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Chrome-WebUI-side of the Glic API.
// Communicates with the web client side in ../client/.
import { enumToClient } from '../../enum_conversions.js';
import { GlicRequestEvent as MojomGlicRequestEvent, WebClientHandlerRemote } from '../../glic.mojom-webui.js';
import { ClientCapabilities } from '../../glic_api/glic_api.js';
import { ObservableValue } from '../../observable.js';
import { TaskQueue } from '../../task_queue.js';
import { maybeWrapWithLogging } from '../mojo_logging.js';
import { getHostRequestHistogramInfo } from '../request_types.js';
import { conversionSettings, urlFromClient } from './conversions.js';
import { HostMessageHandler } from './host_from_client.js';
import { PanelOpenState } from './types.js';
export var WebClientState;
(function (WebClientState) {
    WebClientState[WebClientState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    WebClientState[WebClientState["WARMED"] = 1] = "WARMED";
    WebClientState[WebClientState["RESPONSIVE"] = 2] = "RESPONSIVE";
    WebClientState[WebClientState["UNRESPONSIVE"] = 3] = "UNRESPONSIVE";
    WebClientState[WebClientState["ERROR"] = 4] = "ERROR";
})(WebClientState || (WebClientState = {}));
/**
 * The host side of the Glic API.
 *
 * Its primary job is to route calls between the client (over postMessage) and
 * the browser (over Mojo).
 */
export class GlicApiHost {
    hostMessageHandler;
    sender;
    panelIsActive = false;
    handler;
    get handlerForTesting() {
        return this.handler;
    }
    webClientState = ObservableValue.withValue(WebClientState.UNINITIALIZED);
    openCloseTasks = new TaskQueue();
    waitingOnPanelWillOpenValue = false;
    // Synchronizes panel open/close events between the browser and client,
    // ensuring panel open state is eventually consistent.
    clientActiveObs = ObservableValue.withValue(false);
    // The open state as understood by the client, this is delayed
    // from the notifyPanelWillOpen and notifyPanelWasClosed calls because
    // processing is async.
    panelOpenState = PanelOpenState.CLOSED;
    instanceIsActive = true;
    router;
    isDestroyed = false;
    constructor(hostRemote, hostRouter) {
        this.router = hostRouter;
        this.sender = hostRemote;
        this.handler = maybeWrapWithLogging(new WebClientHandlerRemote(), { prefix: 'WebClientHandler' });
        this.handler.onConnectionError.addListener(() => {
            if (this.isDestroyed ||
                this.webClientState.getCurrentValue() === WebClientState.ERROR) {
                return;
            }
            console.warn(`Mojo connection error in glic host`);
            this.webClientState.assignAndSignal(WebClientState.ERROR);
        });
        const receiver = this.handler.$.bindNewPipeAndPassReceiver();
        receiver.bindInBrowser();
        this.hostMessageHandler = new HostMessageHandler(this.handler, this);
        if (this.router.receiver) {
            this.router.receiver.requestObserver = this;
            this.router.receiver.setHandlerWrapper(this.handlerWrapper.bind(this));
        }
    }
    destroy() {
        this.isDestroyed = true;
        this.webClientState = ObservableValue.withValue(WebClientState.ERROR); // Final state
        this.hostMessageHandler.destroy();
    }
    setInitialState(initialState, clientCapabilities) {
        this.panelIsActive = initialState.panelIsActive;
        this.instanceIsActive = initialState.instanceIsActive;
        conversionSettings.platform = enumToClient(initialState.platform);
        conversionSettings.omitFaviconInTabData =
            clientCapabilities.has(ClientCapabilities.IGNORES_TAB_DATA_FAVICONS);
    }
    waitingOnPanelWillOpen() {
        return this.waitingOnPanelWillOpenValue;
    }
    setWaitingOnPanelWillOpen(value) {
        this.waitingOnPanelWillOpenValue = value;
    }
    panelOpenStateChanged(state) {
        this.panelOpenState = state;
        this.clientActiveObs.assignAndSignal(this.isClientActive());
    }
    setInstanceIsActive(instanceIsActive) {
        this.instanceIsActive = instanceIsActive;
        this.clientActiveObs.assignAndSignal(this.isClientActive());
    }
    getInstanceIsActive() {
        return this.instanceIsActive;
    }
    isPanelOpen() {
        return this.panelOpenState === PanelOpenState.OPEN;
    }
    // Returns true if the user might be interacting with the client.
    // That is, the panel is open, not in an error state, and either the panel
    // itself is focused or a browser window it could be accessing is.
    isClientActive() {
        return this.panelOpenState === PanelOpenState.OPEN &&
            this.webClientState.getCurrentValue() !== WebClientState.ERROR &&
            this.instanceIsActive;
    }
    // Called when the web client is initialized.
    webClientInitialized() {
        this.setWebClientState(WebClientState.RESPONSIVE);
    }
    webClientInitializeFailed() {
        console.warn('GlicApiHost: web client initialize failed');
        this.setWebClientState(WebClientState.ERROR);
    }
    setWebClientState(state) {
        this.webClientState.assignAndSignal(state);
    }
    getWebClientState() {
        return this.webClientState;
    }
    openLinkInPopup(url, initialWidth, initialHeight) {
        this.handler.openLinkInPopup(urlFromClient(url), initialWidth, initialHeight);
    }
    async openLinkInNewTab(url) {
        await this.handler.createTab(urlFromClient(url), {
            openInBackground: false,
            windowId: null,
        });
    }
    async handlerWrapper(type, interfaceDef, payload, extras, handlerFunction) {
        const startTime = performance.now();
        const response = await handlerFunction(payload, extras);
        if (response) {
            // Report latency metric for handled requests that return a response.
            const latency = performance.now() - startTime;
            this.reportLatency(type, interfaceDef, latency);
        }
        // Not all request types require a return value.
        return response;
    }
    onRequestReceived(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_RECEIVED);
        if (!this.panelIsActive) {
            this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_RECEIVED_WHILE_INACTIVE);
        }
    }
    onRequestHandlerException(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.REQUEST_HANDLER_EXCEPTION);
    }
    onRequestCompleted(type, interfaceDef) {
        this.reportRequestCountEvent(type, interfaceDef, GlicRequestEvent.RESPONSE_SENT);
    }
    reportRequestCountEvent(requestType, interfaceDef, event) {
        const histogramInfo = getHostRequestHistogramInfo(requestType, interfaceDef);
        if (histogramInfo === undefined) {
            return;
        }
        let mojoEvent = MojomGlicRequestEvent.kRequestReceived;
        switch (event) {
            case GlicRequestEvent.REQUEST_RECEIVED:
                mojoEvent = MojomGlicRequestEvent.kRequestReceived;
                break;
            case GlicRequestEvent.RESPONSE_SENT:
                mojoEvent = MojomGlicRequestEvent.kResponseSent;
                break;
            case GlicRequestEvent.REQUEST_HANDLER_EXCEPTION:
                mojoEvent = MojomGlicRequestEvent.kRequestHandlerException;
                break;
            case GlicRequestEvent.REQUEST_RECEIVED_WHILE_INACTIVE:
                mojoEvent = MojomGlicRequestEvent.kRequestReceivedWhileInactive;
                break;
            default:
                return;
        }
        try {
            this.handler.reportApiRequestCount(histogramInfo.id, mojoEvent);
        }
        catch (e) {
            console.error('[reportApiRequestCount ERROR]', e);
        }
    }
    reportLatency(requestType, interfaceDef, latencyMs) {
        const histogramInfo = getHostRequestHistogramInfo(requestType, interfaceDef);
        if (histogramInfo === undefined) {
            return;
        }
        try {
            this.handler.reportApiRequestLatency(histogramInfo.name, { microseconds: BigInt(Math.round(latencyMs * 1000)) });
        }
        catch (e) {
            console.error('[reportApiRequestLatency ERROR]', e);
        }
    }
}
// LINT.IfChange(GlicRequestEvent)
var GlicRequestEvent;
(function (GlicRequestEvent) {
    GlicRequestEvent[GlicRequestEvent["REQUEST_RECEIVED"] = 0] = "REQUEST_RECEIVED";
    GlicRequestEvent[GlicRequestEvent["RESPONSE_SENT"] = 1] = "RESPONSE_SENT";
    GlicRequestEvent[GlicRequestEvent["REQUEST_HANDLER_EXCEPTION"] = 2] = "REQUEST_HANDLER_EXCEPTION";
    // Deprecated: REQUEST_RECEIVED_WHILE_HIDDEN = 3,
    GlicRequestEvent[GlicRequestEvent["REQUEST_RECEIVED_WHILE_INACTIVE"] = 4] = "REQUEST_RECEIVED_WHILE_INACTIVE";
    GlicRequestEvent[GlicRequestEvent["MAX_VALUE"] = 4] = "MAX_VALUE";
})(GlicRequestEvent || (GlicRequestEvent = {}));
// LINT.ThenChange(//tools/metrics/histograms/metadata/glic/enums.xml:GlicRequestEvent)
