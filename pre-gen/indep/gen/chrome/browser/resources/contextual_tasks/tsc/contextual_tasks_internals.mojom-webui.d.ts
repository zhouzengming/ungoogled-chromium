import { mojo } from '//resources/mojo/mojo/public/js/bindings.js';
import { MojoBrowserProxyFactory } from '//resources/mojo/mojo_browser_proxy.js';
import type { MojoBrowserProxy } from '//resources/mojo/mojo_browser_proxy.js';
import { TabSelectionMode as contextualTasks_mojom_TabSelectionMode } from './contextual_tasks_types.mojom-webui.js';
import { Time as mojoBase_mojom_Time } from '//resources/mojo/mojo/public/mojom/base/time.mojom-webui.js';
import { Url as url_mojom_Url } from '//resources/mojo/url/mojom/url.mojom-webui.js';
export type ContextualTasksInternalsPageHandlerFactoryPendingReceiverEndpoint = mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPageHandlerFactoryPendingReceiver>;
export declare class ContextualTasksInternalsPageHandlerFactoryPendingReceiver implements mojo.internal.interfaceSupport.PendingReceiver<ContextualTasksInternalsPageHandlerFactory> {
    handle: mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPageHandlerFactoryPendingReceiver>;
    constructor(handle: MojoHandle | ContextualTasksInternalsPageHandlerFactoryPendingReceiverEndpoint);
    bindInBrowser(scope?: string): void;
}
export interface ContextualTasksInternalsPageHandlerFactoryInterface {
    createPageHandler(page: ContextualTasksInternalsPageRemote, handler: ContextualTasksInternalsPageHandlerPendingReceiver): void;
}
export declare class ContextualTasksInternalsPageHandlerFactoryRemote implements ContextualTasksInternalsPageHandlerFactoryInterface, mojo.internal.interfaceSupport.InterfaceRemote<ContextualTasksInternalsPageHandlerFactoryPendingReceiver> {
    private proxy;
    $: mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper<ContextualTasksInternalsPageHandlerFactoryPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(handle?: MojoHandle | ContextualTasksInternalsPageHandlerFactoryPendingReceiverEndpoint);
    createPageHandler(page: ContextualTasksInternalsPageRemote, handler: ContextualTasksInternalsPageHandlerPendingReceiver): void;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPageHandlerFactory
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
export declare class ContextualTasksInternalsPageHandlerFactoryReceiver implements mojo.internal.interfaceSupport.InterfaceReceiver<ContextualTasksInternalsPageHandlerFactoryRemote, ContextualTasksInternalsPageHandlerFactoryPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageHandlerFactoryRemote, ContextualTasksInternalsPageHandlerFactoryPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(impl: ContextualTasksInternalsPageHandlerFactoryInterface);
}
export declare class ContextualTasksInternalsPageHandlerFactory {
    static get $interfaceName(): string;
    /**
     * Returns a remote for this interface which sends messages to the browser.
     * The browser must have an interface request binder registered for this
     * interface and accessible to the calling document's frame.
     */
    static getRemote(): ContextualTasksInternalsPageHandlerFactoryRemote;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPageHandlerFactory
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
export declare class ContextualTasksInternalsPageHandlerFactoryCallbackRouter implements mojo.internal.interfaceSupport.InterfaceCallbackRouter<ContextualTasksInternalsPageHandlerFactoryRemote, ContextualTasksInternalsPageHandlerFactoryPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageHandlerFactoryRemote, ContextualTasksInternalsPageHandlerFactoryPendingReceiver>;
    router_: mojo.internal.interfaceSupport.CallbackRouter;
    createPageHandler: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(page: ContextualTasksInternalsPageRemote, handler: ContextualTasksInternalsPageHandlerPendingReceiver) => any>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor();
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id: number): boolean;
}
export type ContextualTasksInternalsPageHandlerPendingReceiverEndpoint = mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPageHandlerPendingReceiver>;
export declare class ContextualTasksInternalsPageHandlerPendingReceiver implements mojo.internal.interfaceSupport.PendingReceiver<ContextualTasksInternalsPageHandler> {
    handle: mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPageHandlerPendingReceiver>;
    constructor(handle: MojoHandle | ContextualTasksInternalsPageHandlerPendingReceiverEndpoint);
    bindInBrowser(scope?: string): void;
}
export interface ContextualTasksInternalsPageHandlerInterface {
    getRelevantContext(request: GetRelevantContextRequest): Promise<{
        response: GetRelevantContextResponse;
    }>;
    setForcedEmbeddedPageHost(host: url_mojom_Url): void;
    getForcedEmbeddedPageHost(): Promise<{
        host: url_mojom_Url;
    }>;
    getEligibilityState(): Promise<{
        state: EligibilityState;
    }>;
}
export declare class ContextualTasksInternalsPageHandlerRemote implements ContextualTasksInternalsPageHandlerInterface, mojo.internal.interfaceSupport.InterfaceRemote<ContextualTasksInternalsPageHandlerPendingReceiver> {
    private proxy;
    $: mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper<ContextualTasksInternalsPageHandlerPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(handle?: MojoHandle | ContextualTasksInternalsPageHandlerPendingReceiverEndpoint);
    getRelevantContext(request: GetRelevantContextRequest): Promise<{
        response: GetRelevantContextResponse;
    }>;
    setForcedEmbeddedPageHost(host: url_mojom_Url): void;
    getForcedEmbeddedPageHost(): Promise<{
        host: url_mojom_Url;
    }>;
    getEligibilityState(): Promise<{
        state: EligibilityState;
    }>;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPageHandler
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
export declare class ContextualTasksInternalsPageHandlerReceiver implements mojo.internal.interfaceSupport.InterfaceReceiver<ContextualTasksInternalsPageHandlerRemote, ContextualTasksInternalsPageHandlerPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageHandlerRemote, ContextualTasksInternalsPageHandlerPendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(impl: ContextualTasksInternalsPageHandlerInterface);
}
export declare class ContextualTasksInternalsPageHandler {
    static get $interfaceName(): string;
    /**
     * Returns a remote for this interface which sends messages to the browser.
     * The browser must have an interface request binder registered for this
     * interface and accessible to the calling document's frame.
     */
    static getRemote(): ContextualTasksInternalsPageHandlerRemote;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPageHandler
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
export declare class ContextualTasksInternalsPageHandlerCallbackRouter implements mojo.internal.interfaceSupport.InterfaceCallbackRouter<ContextualTasksInternalsPageHandlerRemote, ContextualTasksInternalsPageHandlerPendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageHandlerRemote, ContextualTasksInternalsPageHandlerPendingReceiver>;
    router_: mojo.internal.interfaceSupport.CallbackRouter;
    getRelevantContext: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(request: GetRelevantContextRequest) => any>;
    setForcedEmbeddedPageHost: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(host: url_mojom_Url) => any>;
    getForcedEmbeddedPageHost: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<() => any>;
    getEligibilityState: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<() => any>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor();
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id: number): boolean;
}
export type ContextualTasksInternalsPagePendingReceiverEndpoint = mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPagePendingReceiver>;
export declare class ContextualTasksInternalsPagePendingReceiver implements mojo.internal.interfaceSupport.PendingReceiver<ContextualTasksInternalsPage> {
    handle: mojo.internal.interfaceSupport.Endpoint<ContextualTasksInternalsPagePendingReceiver>;
    constructor(handle: MojoHandle | ContextualTasksInternalsPagePendingReceiverEndpoint);
    bindInBrowser(scope?: string): void;
}
export interface ContextualTasksInternalsPageInterface {
    onLogMessageAdded(eventTime: mojoBase_mojom_Time, sourceFile: string, sourceLine: bigint, message: string): void;
}
export declare class ContextualTasksInternalsPageRemote implements ContextualTasksInternalsPageInterface, mojo.internal.interfaceSupport.InterfaceRemote<ContextualTasksInternalsPagePendingReceiver> {
    private proxy;
    $: mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper<ContextualTasksInternalsPagePendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(handle?: MojoHandle | ContextualTasksInternalsPagePendingReceiverEndpoint);
    onLogMessageAdded(eventTime: mojoBase_mojom_Time, sourceFile: string, sourceLine: bigint, message: string): void;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPage
 * mojom interface. Must be constructed over an object which implements that
 * interface.
 */
export declare class ContextualTasksInternalsPageReceiver implements mojo.internal.interfaceSupport.InterfaceReceiver<ContextualTasksInternalsPageRemote, ContextualTasksInternalsPagePendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageRemote, ContextualTasksInternalsPagePendingReceiver>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor(impl: ContextualTasksInternalsPageInterface);
}
export declare class ContextualTasksInternalsPage {
    static get $interfaceName(): string;
    /**
     * Returns a remote for this interface which sends messages to the browser.
     * The browser must have an interface request binder registered for this
     * interface and accessible to the calling document's frame.
     */
    static getRemote(): ContextualTasksInternalsPageRemote;
}
/**
 * An object which receives request messages for the ContextualTasksInternalsPage
 * mojom interface and dispatches them as callbacks. One callback receiver exists
 * on this object for each message defined in the mojom interface, and each
 * receiver can have any number of listeners added to it.
 */
export declare class ContextualTasksInternalsPageCallbackRouter implements mojo.internal.interfaceSupport.InterfaceCallbackRouter<ContextualTasksInternalsPageRemote, ContextualTasksInternalsPagePendingReceiver> {
    private helper_internal_;
    $: mojo.internal.interfaceSupport.InterfaceReceiverHelper<ContextualTasksInternalsPageRemote, ContextualTasksInternalsPagePendingReceiver>;
    router_: mojo.internal.interfaceSupport.CallbackRouter;
    onLogMessageAdded: mojo.internal.interfaceSupport.InterfaceCallbackReceiver<(eventTime: mojoBase_mojom_Time, sourceFile: string, sourceLine: bigint, message: string) => any>;
    onConnectionError: mojo.internal.interfaceSupport.ConnectionErrorEventRouter;
    constructor();
    /**
     * @param id An ID returned by a prior call to addListener.
     * @return True iff the identified listener was found and removed.
     */
    removeListener(id: number): boolean;
}
export declare const GetRelevantContextRequestSpec: {
    $: mojo.internal.MojomType;
};
export declare const TabSpec: {
    $: mojo.internal.MojomType;
};
export declare const GetRelevantContextResponseSpec: {
    $: mojo.internal.MojomType;
};
export declare const EligibilityStateSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandlerFactory_CreatePageHandler_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetRelevantContext_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetRelevantContext_ResponseParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_SetForcedEmbeddedPageHost_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ResponseParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetEligibilityState_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPageHandler_GetEligibilityState_ResponseParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare const ContextualTasksInternalsPage_OnLogMessageAdded_ParamsSpec: {
    $: mojo.internal.MojomType;
};
export declare interface GetRelevantContextRequestMojoType {
    query: string;
    tabSelectionMode: contextualTasks_mojom_TabSelectionMode;
    minModelScore: number;
}
export type GetRelevantContextRequest = GetRelevantContextRequestMojoType;
export declare interface TabMojoType {
    title: string;
    url: url_mojom_Url;
}
export type Tab = TabMojoType;
export declare interface GetRelevantContextResponseMojoType {
    relevantTabs: Tab[];
}
export type GetRelevantContextResponse = GetRelevantContextResponseMojoType;
export declare interface EligibilityStateMojoType {
    isEligible: boolean;
    isContextualTasksEnabled: boolean;
    isSignedIn: boolean;
    primaryAccountInCookieJar: boolean;
    isAimAllowedByPolicy: boolean;
    isAimEligible: boolean;
    isCobrowseEligible: boolean;
    isContextSharingEnabled: boolean;
    isDefaultSearchEngineGoogle: boolean;
}
export type EligibilityState = EligibilityStateMojoType;
export declare interface ContextualTasksInternalsPageHandlerFactory_CreatePageHandler_ParamsMojoType {
    page: ContextualTasksInternalsPageRemote;
    handler: ContextualTasksInternalsPageHandlerPendingReceiver;
}
export type ContextualTasksInternalsPageHandlerFactory_CreatePageHandler_Params = ContextualTasksInternalsPageHandlerFactory_CreatePageHandler_ParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetRelevantContext_ParamsMojoType {
    request: GetRelevantContextRequest;
}
export type ContextualTasksInternalsPageHandler_GetRelevantContext_Params = ContextualTasksInternalsPageHandler_GetRelevantContext_ParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetRelevantContext_ResponseParamsMojoType {
    response: GetRelevantContextResponse;
}
export type ContextualTasksInternalsPageHandler_GetRelevantContext_ResponseParams = ContextualTasksInternalsPageHandler_GetRelevantContext_ResponseParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_SetForcedEmbeddedPageHost_ParamsMojoType {
    host: url_mojom_Url;
}
export type ContextualTasksInternalsPageHandler_SetForcedEmbeddedPageHost_Params = ContextualTasksInternalsPageHandler_SetForcedEmbeddedPageHost_ParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ParamsMojoType {
}
export type ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_Params = ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ResponseParamsMojoType {
    host: url_mojom_Url;
}
export type ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ResponseParams = ContextualTasksInternalsPageHandler_GetForcedEmbeddedPageHost_ResponseParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetEligibilityState_ParamsMojoType {
}
export type ContextualTasksInternalsPageHandler_GetEligibilityState_Params = ContextualTasksInternalsPageHandler_GetEligibilityState_ParamsMojoType;
export declare interface ContextualTasksInternalsPageHandler_GetEligibilityState_ResponseParamsMojoType {
    state: EligibilityState;
}
export type ContextualTasksInternalsPageHandler_GetEligibilityState_ResponseParams = ContextualTasksInternalsPageHandler_GetEligibilityState_ResponseParamsMojoType;
export declare interface ContextualTasksInternalsPage_OnLogMessageAdded_ParamsMojoType {
    eventTime: mojoBase_mojom_Time;
    sourceFile: string;
    sourceLine: bigint;
    message: string;
}
export type ContextualTasksInternalsPage_OnLogMessageAdded_Params = ContextualTasksInternalsPage_OnLogMessageAdded_ParamsMojoType;
export type BrowserProxy = MojoBrowserProxy<ContextualTasksInternalsPageHandlerInterface, ContextualTasksInternalsPageCallbackRouter>;
export declare const browserProxyFactory: MojoBrowserProxyFactory<ContextualTasksInternalsPageHandlerInterface, ContextualTasksInternalsPageRemote, ContextualTasksInternalsPageHandlerPendingReceiver, ContextualTasksInternalsPagePendingReceiver, ContextualTasksInternalsPageCallbackRouter, ContextualTasksInternalsPageHandlerRemote>;
