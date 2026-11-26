// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '//resources/js/cr.js';
import { BrowserControlsService } from '/shared/browser_controls_api.mojom-webui.js';
import { EventDispositionFlag } from '/shared/browser_controls_api_data_model.mojom-webui.js';
import { ToolbarUIObserverCallbackRouter, ToolbarUIService } from '/shared/toolbar_ui_api.mojom-webui.js';
import { ContextMenuType } from '/shared/toolbar_ui_api_data_model.mojom-webui.js';
export { ContextMenuType, EventDispositionFlag, };
export const INVALID_NAVIGATION_CONTROLS_STATE_LISTENER_HANDLE = -1;
export const INVALID_FOCUS_REQUEST_HANDLE = -1;
export const INVALID_SHOW_SPLIT_TABS_CONTEXT_MENU_HANDLE = -1;
export class BrowserProxyImpl {
    callbackRouter;
    browserControlsHandler;
    toolbarUIHandler;
    constructor() {
        this.callbackRouter = new ToolbarUIObserverCallbackRouter();
        this.browserControlsHandler = BrowserControlsService.getRemote();
        this.toolbarUIHandler = ToolbarUIService.getRemote();
    }
    onChipClicked(id, isPointer, stateToken) {
        this.toolbarUIHandler.onLhsChipClicked(id, isPointer, stateToken);
    }
    onChipPointerEntered(id) {
        this.toolbarUIHandler.onLhsChipPointerEntered(id);
    }
    onChipPointerExited(id) {
        this.toolbarUIHandler.onLhsChipPointerExited(id);
    }
    onChipMousePressed(id, isMiddleClick = false) {
        this.toolbarUIHandler.onLhsChipMousePressed(id, isMiddleClick);
    }
    onChipExpandAnimationEnded(id) {
        this.toolbarUIHandler.onLhsChipExpandAnimationEnded(id);
    }
    onChipCollapseAnimationEnded(id) {
        this.toolbarUIHandler.onLhsChipCollapseAnimationEnded(id);
    }
    /**
     * Records a value in a histogram.
     * @param histogramName The name of the histogram.
     * @param value The value to record.
     * @param maxValue The maximum value of the histogram.
     */
    recordInHistogram(histogramName, value, maxValue) {
        chrome.send('metricsHandler:recordInHistogram', [histogramName, value, maxValue]);
    }
    addNavigationStateListener(listener) {
        const handle = this.callbackRouter.onNavigationControlsStateChanged.addListener(listener);
        this.toolbarUIHandler.bind().then(fence => {
            listener(fence.icons, fence.state);
            this.callbackRouter.$.bindHandle(fence.updateStream.handle);
        });
        return handle;
    }
    addFocusRequestListener(listener) {
        // This assumes addNavigationStateListener will happen or has happened to
        // actually connect the router.
        return this.callbackRouter.onFocusRequested.addListener(listener);
    }
    addShowSplitTabsContextMenuListener(listener) {
        return this.callbackRouter.showSplitTabsContextMenu.addListener(listener);
    }
    removeNavigationStateListener(handle) {
        if (handle !== INVALID_NAVIGATION_CONTROLS_STATE_LISTENER_HANDLE) {
            this.callbackRouter.removeListener(handle);
        }
    }
    removeFocusRequestListener(handle) {
        if (handle !== INVALID_FOCUS_REQUEST_HANDLE) {
            this.callbackRouter.removeListener(handle);
        }
    }
    removeShowSplitTabsContextMenuListener(handle) {
        if (handle !== INVALID_SHOW_SPLIT_TABS_CONTEXT_MENU_HANDLE) {
            this.callbackRouter.removeListener(handle);
        }
    }
    static getInstance() {
        return instance || (instance = new BrowserProxyImpl());
    }
    static setInstance(proxy) {
        instance = proxy;
    }
}
let instance = null;
