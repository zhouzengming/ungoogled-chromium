// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PageCallbackRouter, PageHandlerFactory, PageHandlerRemote } from './reading_list.mojom-webui.js';
let instance = null;
export class ReadingListApiProxyImpl {
    callbackRouter = new PageCallbackRouter();
    handler = new PageHandlerRemote();
    constructor() {
        this.callbackRouter = new PageCallbackRouter();
        this.handler = new PageHandlerRemote();
        const factory = PageHandlerFactory.getRemote();
        factory.createPageHandler(this.callbackRouter.$.bindNewPipeAndPassRemote(), this.handler.$.bindNewPipeAndPassReceiver());
    }
    getReadLaterEntries() {
        return this.handler.getReadLaterEntries();
    }
    openUrl(url, clickModifiers) {
        this.handler.openURL(url, clickModifiers);
    }
    updateReadStatus(url, read) {
        this.handler.updateReadStatus(url, read);
    }
    markCurrentTabAsRead() {
        this.handler.markCurrentTabAsRead();
    }
    addCurrentTab() {
        this.handler.addCurrentTab();
    }
    removeEntry(url) {
        this.handler.removeEntry(url);
    }
    showContextMenuForUrl(url, locationX, locationY) {
        this.handler.showContextMenuForURL(url, locationX, locationY);
    }
    updateCurrentPageActionButtonState() {
        this.handler.updateCurrentPageActionButtonState();
    }
    showUi() {
        this.handler.showUI();
    }
    closeUi() {
        this.handler.closeUI();
    }
    getWindowData() {
        return this.handler.getWindowData();
    }
    getCallbackRouter() {
        return this.callbackRouter;
    }
    static getInstance() {
        return instance || (instance = new ReadingListApiProxyImpl());
    }
    static setInstance(obj) {
        instance = obj;
    }
}
