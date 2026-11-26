import type { Action, AutocompleteMatch, AutocompleteResult, InputKeywordModel, MatchKeywordModel, PageHandlerInterface } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
import { PageCallbackRouter } from '//resources/mojo/components/omnibox/browser/searchbox.mojom-webui.js';
export declare function createAutocompleteMatch(modifiers?: Partial<AutocompleteMatch>): AutocompleteMatch;
export declare function createAutocompleteResultForTesting(modifiers?: Partial<AutocompleteResult>): AutocompleteResult;
export declare function createSearchMatchForTesting(modifiers?: Partial<AutocompleteMatch>): AutocompleteMatch;
export declare function createMatchKeywordModelForTesting(modifiers?: Partial<MatchKeywordModel>): MatchKeywordModel;
export declare function createInputKeywordModelForTesting(modifiers?: Partial<InputKeywordModel>): InputKeywordModel;
export declare function createActionForTesting(modifiers?: Partial<Action>): Action;
export declare class SearchboxBrowserProxy {
    static getInstance(): SearchboxBrowserProxy;
    static setInstance(newInstance: SearchboxBrowserProxy): void;
    handler: PageHandlerInterface;
    callbackRouter: PageCallbackRouter;
    constructor();
}
