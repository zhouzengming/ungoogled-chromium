// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { PageCallbackRouter as SearchboxPageCallbackRouter, PageHandlerRemote as SearchboxPageHandlerRemote, SuggestStyle } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { PageHandlerFactory, PageHandlerRemote } from './composebox.mojom-webui.js';
export function createAutocompleteMatch(config = {}) {
    return {
        isHidden: false,
        a11yLabel: '',
        actions: [],
        allowedToBeDefaultMatch: false,
        isSearchType: false,
        isEnterpriseSearchAggregatorPeopleType: false,
        showContextualDescription: false,
        supportsDeletion: false,
        suggestionGroupId: -1,
        contents: '',
        contentsClass: [{ offset: 0, style: 0 }],
        description: '',
        descriptionClass: [{ offset: 0, style: 0 }],
        destinationUrl: '',
        inlineAutocompletion: '',
        fillIntoEdit: '',
        iconPath: '',
        iconUrl: '',
        imageDominantColor: '',
        imageUrl: '',
        removeButtonA11yLabel: '',
        type: '',
        isContextualSuggestion: false,
        isTwoRowSuggestion: false,
        tailSuggestCommonPrefix: null,
        keywordModel: null,
        fuseboxAction: null,
        suggestStyle: SuggestStyle.kUnspecified,
        ...config,
    };
}
export class ComposeboxProxyImpl {
    handler;
    searchboxHandler;
    searchboxCallbackRouter;
    constructor(handler, searchboxHandler, searchboxCallbackRouter) {
        this.handler = handler;
        this.searchboxHandler = searchboxHandler;
        this.searchboxCallbackRouter = searchboxCallbackRouter;
    }
    // 
    getSmartTabSharingActive() {
        return this.searchboxHandler.getSmartTabSharingActive();
    }
    setSmartTabSharingActive(active) {
        this.searchboxHandler.setSmartTabSharingActive(active);
    }
    observeSmartTabSharingActive(callback) {
        return this.searchboxCallbackRouter.updateSmartTabSharingActive.addListener(callback);
    }
    // 
    static getInstance() {
        if (instance) {
            return instance;
        }
        // Composebox connection variables.
        const handler = new PageHandlerRemote();
        const factory = PageHandlerFactory.getRemote();
        // Searchbox connection variables.
        const searchboxHandler = new SearchboxPageHandlerRemote();
        const searchboxCallbackRouter = new SearchboxPageCallbackRouter();
        factory.createPageHandler(handler.$.bindNewPipeAndPassReceiver(), searchboxCallbackRouter.$.bindNewPipeAndPassRemote(), searchboxHandler.$.bindNewPipeAndPassReceiver());
        instance = new ComposeboxProxyImpl(handler, searchboxHandler, searchboxCallbackRouter);
        return instance;
    }
    static setInstance(newInstance) {
        instance = newInstance;
    }
}
let instance = null;
